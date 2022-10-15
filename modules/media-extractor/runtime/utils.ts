import type { FileProperties } from '../types'

const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']
const videoExtensions = ['mp4', 'm4v', 'webm', 'ogv']

export function isVideo(extension: string) {
  return videoExtensions.includes(extension)
}

export function isImage(extension: string) {
  return imageExtensions.includes(extension)
}

export function getType(extension: string): FileProperties['type'] {
  if (isVideo(extension)) {
    return 'video'
  } else if (isImage(extension)) {
    return 'image'
  } else {
    return 'other'
  }
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const mimeTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg'
}

export function fileNameFromUrl(urlStr: string): FileProperties {
  const url = new URL(urlStr, 'http://localhost')
  const fileName = url.pathname.split('/').filter(Boolean).pop()
  const lastDot = fileName.lastIndexOf('.')

  const extension = fileName.substring(lastDot + 1)

  return {
    extension,
    name: fileName.substring(0, lastDot),
    type: isVideo(extension) ? 'video' : 'image',
    mimeType: mimeTypes[extension],
    fileName
  }
}
