import { defineEventHandler } from 'h3'
import type { EventHandler } from 'h3'
import type { ExtractorEventHandlerArgs } from '../types'

import { addToQueue } from './extractor'

export function defineExtractorEventHandler<T = any>(args: ExtractorEventHandlerArgs<T>): EventHandler<T> {
  const { handler, extract } = args

  return defineEventHandler(async (event) => {
    const result = await handler(event)
    const extracted = await extract(result)

    // TODO: Check if is the prerender env.
    addToQueue(extracted)

    return result
  })
}
