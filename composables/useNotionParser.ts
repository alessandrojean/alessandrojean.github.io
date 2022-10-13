import * as Notion from '@/lib/notion'

export interface MapImageUrlArgs {
  src: string;
  block?: Notion.BlockNode;
  blockMap?: Notion.BlockMap
}

export interface NotionBlockProps {
  blockMap: Notion.BlockMap;
  contentId?: string;
  contentIndex?: number;
  embedAllow?: string;
  fullPage?: boolean;
  headerAnchor?: boolean;
  level?: number;
  mapImageUrl?: (args: MapImageUrlArgs) => string,
  mapPageUrl?: (url: string) => string;
  pageLinkTarget?: string;
  shiki?: boolean;
  textLinkTarget?: string;
}

export function defaultMapImageUrl({ src, block, blockMap }: MapImageUrlArgs): string {
  const root = Object.values(blockMap)[0]
  
  if (process.dev || root.type !== 'page') {
    return src
  }

  const slug: string = root.properties['Slug']['rich_text']
    .reduce((acm, crr) => acm + crr, '')
  const fileName = new URL(src).pathname.split('/').filter(Boolean).pop()
  const format = fileName.split('.').filter(Boolean).pop()

  return `/img/${slug}/${block.id}.${format}`
}

export function defaultMapPageUrl(pageId: string = ''): string {
  return `/${pageId.replace(/-/g, '')}`;
}

type PageOnly<T extends Notion.BlockNode> =
  T extends Notion.BlockPageObject ? Notion.BlockPageObject['properties'] : null

export default function useNotionParser<Block extends Notion.BlockNode>(props: NotionBlockProps) {
  const pass = computed<NotionBlockProps>(() => ({
    blockMap: props.blockMap,
    contentId: props.contentId,
    contentIndex: props.contentIndex,
    embedAllow: props.embedAllow,
    fullPage: props.fullPage,
    headerAnchor: props.headerAnchor,
    level: props.level,
    mapImageUrl: props.mapImageUrl,
    mapPageUrl: props.mapPageUrl,
    pageLinkTarget: props.pageLinkTarget,
    shiki: props.shiki,
    textLinkTarget: props.textLinkTarget
  }))

  const block = computed<Block & { content: string[] }>(() => {
    const id = props.contentId || Object.keys(props.blockMap)[0]
    return props.blockMap[id] as Block & { content: string[] }
  })
  
  const properties = computed<PageOnly<Block>>(() => {
    return (block.value.type === 'page'
      ? block.value.properties : null) as PageOnly<Block>
  })
  
  const type = computed<Block['type']>(() => block.value?.type)
  
  const parent = computed(() => {
    const id = block.value.parent[block.value.parent.type]

    return typeof id === 'string' ? props.blockMap[id] : null;
  })

  const root = computed(() => Object.values(props.blockMap)[0] as Notion.BlockPageObject)

  function isType(t: string | string[]): boolean {
    if (Array.isArray(t)) {
      return t.includes(type.value)
    }

    return type.value === t
  }

  return {
    pass,
    block,
    properties,
    type,
    parent,
    root,
    isType,
    getTextContent: Notion.getTextContent,
  }
}
