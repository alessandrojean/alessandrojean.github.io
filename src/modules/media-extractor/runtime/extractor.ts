import fs from 'node:fs'
import path from 'node:path'

import { fetch } from 'ofetch'

import type { ConsolaInstance } from 'consola'
import type { ExtractorResult, ModuleOptions } from '../types'
import { fileNameFromUrl } from './utils'

interface SaveMediasArgs {
  logger: ConsolaInstance;
  outputDir: string;
  options: ModuleOptions
}

export async function saveMedias(args: SaveMediasArgs): Promise<void> {
  const { logger, outputDir, options } = args
  const queue = global.mediaExtractorQueue as ExtractorResult[]

  if (queue.length === 0) {
    return
  }

  const result = queue.shift()!!

  if (!result.medias || result.medias.length === 0) {
    return
  }

  const videoPath = path.join(outputDir, options.videoDir, result.destination)

  const hasVideos = result.medias.find((media) => {
    return fileNameFromUrl(media.fileName).type === 'video'
  })

  if (hasVideos && !fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath, { recursive: true })
  }

  for (const media of result.medias) {
    const { type } = fileNameFromUrl(media.fileName)

    if (type === 'other') {
      continue
    }

    const logPath = path.sep + path.join(options.videoDir, result.destination, media.fileName)
    const startTime = process.hrtime()

    try {
      const filePath = path.join(videoPath, media.fileName)

      const response = await fetch(media.url)
      const arrayBuffer = await response.arrayBuffer()

      if (type === 'video') {
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
      }

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
