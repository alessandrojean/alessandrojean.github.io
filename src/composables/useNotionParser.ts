import { getTextContent } from '@/lib/notion';

import type {
  BlockMap,
  BlockNode,
  BlockPageObject,
  NotionApi
} from '@/lib/notion';
import type { ComputedRef, ToRefs } from 'vue';

export interface MapImageUrlArgs {
  src: string;
  block?: Extract<BlockNode, { type: 'image' }>;
  blockMap?: BlockMap
}

export interface MapVideoUrlArgs {
  src: string;
  block?: Extract<BlockNode, { type: 'video' }>;
  blockMap?: BlockMap
}

export interface NotionBlockProps {
  blockMap: BlockMap;
  contentId?: string;
  contentIndex?: number;
  embedAllow?: string;
  fullPage?: boolean;
  headerAnchor?: boolean;
  level?: number;
  mapImageUrl?: (args: MapImageUrlArgs) => string;
  mapPageUrl?: (url: string) => string | undefined;
  mapVideoUrl?: (args: MapVideoUrlArgs) => string;
  pageLinkTarget?: string;
  shiki?: boolean;
  textLinkTarget?: string;
}

export function defaultMapImageUrl({ src }: MapImageUrlArgs): string {
  return src
}

export function defaultMapPageUrl(pageId: string = ''): string {
  return `/${pageId.replace(/-/g, '')}`;
}

export function defaultMapVideoUrl({ src }: MapVideoUrlArgs): string {
  return src
}

type PageOnly<T extends BlockNode> =
  T extends BlockPageObject ? BlockPageObject['properties'] : never

type RichTextBlock = 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' |
  'callout' | 'quote' | 'bulleted_list_item' | 'numbered_list_item' |
  'to_do' | 'code'

type RichTextOnly<T extends BlockNode> =
  T['type'] extends RichTextBlock ? NotionApi.TextRichTextItemResponse[] : never

type CaptionBlock = 'image' | 'video' | 'code' | 'embed'

type CaptionOnly<T extends BlockNode> =
  T['type'] extends CaptionBlock ? NotionApi.TextRichTextItemResponse[] : never

export default function useNotionParser<Block extends BlockNode>(
  props: ToRefs<Readonly<NotionBlockProps>>
) {
  const pass = computed<NotionBlockProps>(() => ({
    blockMap: props.blockMap.value,
    contentId: props.contentId.value,
    contentIndex: props.contentIndex.value,
    embedAllow: props.embedAllow.value,
    fullPage: props.fullPage.value,
    headerAnchor: props.headerAnchor.value,
    level: props.level.value,
    mapImageUrl: props.mapImageUrl.value,
    mapPageUrl: props.mapPageUrl.value,
    mapVideoUrl: props.mapVideoUrl.value,
    pageLinkTarget: props.pageLinkTarget.value,
    shiki: props.shiki.value,
    textLinkTarget: props.textLinkTarget.value
  }))

  const block = computed<Block & { content: string[] }>(() => {
    const id = props.contentId.value || 
      Object.values(props.blockMap.value)
        .find((b) => b.type === 'page').id

    return props.blockMap.value[id] as Block & { content: string[] }
  })

  const content = computed(() => block.value.content ?? [])
  
  const properties = computed<PageOnly<Block>>(() => {
    return (block.value.type === 'page'
      ? block.value.properties : null) as PageOnly<Block>
  })
  
  const type = computed<Block['type']>(() => block.value?.type)
  
  const parent = computed(() => {
    const id = block.value.parent[block.value.parent.type]

    return typeof id === 'string' ? props.blockMap.value[id] : null;
  })

  const root = computed(() => {
    return Object.values(props.blockMap.value)
      .find((b) => b.type === 'page') as BlockPageObject
  })

  const richText = computed(() => {
    const blockUnref = unref(block)

    switch (blockUnref.type) {
      case 'paragraph': return blockUnref.paragraph.rich_text
      case 'heading_1': return blockUnref.heading_1.rich_text
      case 'heading_2': return blockUnref.heading_2.rich_text
      case 'heading_3': return blockUnref.heading_3.rich_text
      case 'callout' : return blockUnref.callout.rich_text
      case 'quote' : return blockUnref.quote.rich_text
      case 'bulleted_list_item': return blockUnref.bulleted_list_item.rich_text
      case 'numbered_list_item': return blockUnref.numbered_list_item.rich_text
      case 'to_do': return blockUnref.to_do.rich_text
      case 'code': return blockUnref.code.rich_text
      default: return undefined
    }
  }) as ComputedRef<RichTextOnly<Block>>

  const caption = computed(() => {
    const blockUnref = unref(block)

    switch (blockUnref.type) {
      case 'code': return blockUnref.code.caption
      case 'image': return blockUnref.image.caption
      case 'video': return blockUnref.video.caption
      case 'embed': return blockUnref.embed.caption
      default: return undefined
    }
  }) as ComputedRef<CaptionOnly<Block>>

  function isType(t: Block['type'] | Block['type'][]): boolean {
    if (Array.isArray(t)) {
      return t.includes(type.value)
    }

    return type.value === t
  }

  return {
    pass,
    block,
    content,
    properties,
    type,
    parent,
    root,
    richText,
    caption,
    isType,
    getTextContent,
  }
}
