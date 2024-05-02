import type { EventHandler, EventHandlerRequest } from 'h3';

export interface ModuleOptions {
  dir: string;
  videoDir: string;
}

export interface ExtractorEventHandlerArgs<
  Req extends EventHandlerRequest = EventHandlerRequest,
  Res extends unknown = any
> {
  handler: EventHandler<Req, Res>;
  extract: (response: Awaited<Res>) => Promise<ExtractorResult>;
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
  type: 'video' | 'other';
  mimeType?: string;
  fileName: string;
}
