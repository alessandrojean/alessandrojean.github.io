import sharp from 'sharp'
import { decode, encode } from 'blurhash'

const BLURHASH_WIDTH = 150
const BLURHASH_COMPONENT = 4

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing or invalid url query parameter'
    })
  }

  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  const image = sharp(Buffer.from(arrayBuffer)).raw().ensureAlpha()

  const metadata = await image.metadata()
  const resized = await image
    .resize(Math.min(metadata.width, BLURHASH_WIDTH))
    .toBuffer({ resolveWithObject: true })

  const hash = encode(
    new Uint8ClampedArray(resized.data),
    resized.info.width,
    resized.info.height,
    BLURHASH_COMPONENT,
    BLURHASH_COMPONENT
  )

  const pixels = decode(hash, resized.info.width, resized.info.height)

  const blurImage = sharp(Buffer.from(pixels), {
    raw: {
      channels: 4,
      width: resized.info.width,
      height: resized.info.height
    }
  })

  const blurBuffer = await blurImage
    .avif({ quality: 80 })
    .toBuffer()

  return {
    hash,
    dataUrl: `data:image/avif;base64,${blurBuffer.toString('base64')}`,
    width: metadata.width,
    height: metadata.height,
    aspectRatio: metadata.width / metadata.height,
    format: metadata.format
  }
})
