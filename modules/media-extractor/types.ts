import type { EventHandler } from 'h3'

export interface ModuleOptions {
  dir: string;
  imgDir: string;
  videoDir: string;
}

export interface ExtractorEventHandlerArgs<T> {
  handler: EventHandler<T>;
  extract: (response: T) => Promise<ExtractorResult>;
}

export interface ExtractorResult {
  destination: string;
  medias?: Media[]
}

export interface Media {
  url: string;
  fileName: string;
}

export interface FileProperties {
  extension: string;
  name: string;
  type: 'video' | 'image' | 'other';
  mimeType?: string;
  fileName: string;
}
