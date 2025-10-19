import type { RichTextItemResponse } from '@notionhq/client';

export function getTextContent(text: RichTextItemResponse[]) {
  return text.reduce((prev, current) => prev + current.plain_text, '');
}
