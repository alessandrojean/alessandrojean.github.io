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
  ogv: 'video/ogg',
};

export interface FileProperties {
  extension: string;
  name: string;
  type: 'image' | 'video' | 'other';
  mimeType?: string;
  fileName: string;
};

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']);
const videoExtensions = new Set(['mp4', 'm4v', 'webm', 'ogv']);

export function isImage(extension: string) {
  return imageExtensions.has(extension);
}

export function isVideo(extension: string) {
  return videoExtensions.has(extension);
}

export function fileNameFromUrl(urlStr: string): FileProperties {
  const url = new URL(urlStr, 'http://localhost');
  const fileName = url.pathname.split('/').filter(Boolean).pop()!;
  const lastDot = fileName.lastIndexOf('.');

  const extension = fileName.substring(lastDot + 1);

  return {
    extension,
    name: fileName.substring(0, lastDot),
    type: isVideo(extension) ? 'video' : 'image',
    mimeType: mimeTypes[extension],
    fileName,
  };
}
