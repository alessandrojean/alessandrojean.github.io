import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import { pipeline } from 'node:stream'

import sharp from 'sharp'

import type { Consola } from 'consola'
import type { ExtractorResult, ModuleOptions } from '../types'
import { fileNameFromUrl } from './utils'

interface SaveImagesArgs {
  logger: Consola;
  outputDir: string;
  options: ModuleOptions
}

export async function saveImages(args: SaveImagesArgs): Promise<void> {
  const { logger, outputDir, options } = args
  const queue = global.mediaExtractorQueue as ExtractorResult[]

  if (queue.length === 0) {
    return
  }

  const result = queue.shift()

  if (!result.medias || result.medias.length === 0) {
    return
  }

  const imagePath = path.join(outputDir, options.imgDir, result.destination)
  const videoPath = path.join(outputDir, options.videoDir, result.destination)

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
      const file = fs.createWriteStream(filePath)

      
      // TODO: Replace with fetch when migrating to Node.js v17.
      await new Promise<void>((resolve, reject) => {
        https.get(media.url, (response) => {
          if (type === 'image') {
            const imageTransformer = sharp()
              .setMaxListeners(0)
              .webp({ quality: 90 })

            pipeline(response, imageTransformer, file, (err) => {
              if (err) {
                return reject(err)
              }

              file.close()
              resolve()
            })
          } else {
            pipeline(response, file, (err) => {
              if (err) {
                return reject(err)
              }

              file.close()
              resolve()
            })
          }
        })
      })

      const endTime = process.hrtime(startTime)
      const duration = (endTime[1] / 1_000_000).toFixed(0)

      logger.log(gray(`  ├─ ${logPath} (${duration}ms)`))
    } catch (error) {
      const endTime = process.hrtime(startTime)
      const duration = (endTime[1] / 1_000_000).toFixed(0)

      logger.log(yellow(`  ├─ ${logPath} (${duration}ms) (${error.toString()})`))
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