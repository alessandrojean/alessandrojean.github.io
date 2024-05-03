import fs from 'node:fs'
import path from 'node:path'

import { fetch } from 'ofetch'

import type { ConsolaInstance } from 'consola'
import type { ExtractorResult, ModuleOptions } from '../types'
import { fileNameFromUrl } from './utils'

interface SaveMediasArgs {
  logger: ConsolaInstance;
  imgOutputDir: string;
  videoOutputDir: string;
  options: ModuleOptions
}

export async function saveMedias(args: SaveMediasArgs): Promise<void> {
  const { logger, imgOutputDir, videoOutputDir, options } = args
  const queue = global.mediaExtractorQueue as ExtractorResult[]

  if (queue.length === 0) {
    return
  }

  const result = queue.shift()!!

  if (!result.medias || result.medias.length === 0) {
    return
  }

  const imagePath = path.join(imgOutputDir, options.imgDir, result.destination)
  const videoPath = path.join(videoOutputDir, options.videoDir, result.destination)

  const hasImages = result.medias.find((media) => {
    return fileNameFromUrl(media.fileName).type === 'image'
  })

  const hasVideos = result.medias.find((media) => {
    return fileNameFromUrl(media.fileName).type === 'video'
  })

  if (hasImages && !fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true })
  }

  if (hasVideos && !fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath, { recursive: true })
  }

  for (const media of result.medias) {
    const { type } = fileNameFromUrl(media.fileName)

    if (type === 'other') {
      continue
    }

    const mediaDir = type === 'image' ? options.imgDir : options.videoDir
    const mediaPath = type === 'image' ? imagePath : videoPath

    const logPath = path.sep + path.join(mediaDir, result.destination, media.fileName)
    const startTime = process.hrtime()

    try {
      const filePath = path.join(mediaPath, media.fileName)

      const response = await fetch(media.url)
      const arrayBuffer = await response.arrayBuffer()

      fs.writeFileSync(filePath, Buffer.from(arrayBuffer))

      const endTime = process.hrtime(startTime)
      const duration = (endTime[1] / 1_000_000).toFixed(0)

      logger.log(gray(`  ├─ ${logPath} (${duration}ms)`))
    } catch (error) {
      const endTime = process.hrtime(startTime)
      const duration = (endTime[1] / 1_000_000).toFixed(0)
      const errorMsg = (error instanceof Error) ? error.message : String(error)

      logger.log(yellow(`  ├─ ${logPath} (${duration}ms) (${errorMsg})`))
    }
  }
}

// Implement the color directly as chalk produces import errors.
function gray(text: string) {
  return '\u001B[90m' + text + '\u001B[39m'
}

function yellow(text: string) {
  return '\u001B[33m' + text + '\u001B[39m'
}
