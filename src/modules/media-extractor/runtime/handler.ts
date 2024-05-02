import type { EventHandlerRequest } from 'h3'
import { defineEventHandler } from 'h3'
import type { ExtractorEventHandlerArgs, ExtractorResult } from '../types'

export function addToQueue(result: ExtractorResult) {
  (global.mediaExtractorQueue as ExtractorResult[])?.push(result)
}

export function defineExtractorEventHandler<
  Req extends EventHandlerRequest = EventHandlerRequest,
  Res extends unknown = any
>(args: ExtractorEventHandlerArgs<Req, Res>) {
  const { handler, extract } = args

  return defineEventHandler(async (event) => {
    const result = await handler(event)
    const extracted = await extract(result)

    // TODO: Check if is the prerender env.
    addToQueue(extracted)

    return result
  })
}
