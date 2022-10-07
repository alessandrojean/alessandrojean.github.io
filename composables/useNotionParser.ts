import { NotionNode, NotionNodeMap } from '@/composables/useNotionPage'

export interface NotionBlockProps {
  blockMap: NotionNodeMap;
  contentId?: string;
  contentIndex?: number;
  embedAllow?: string;
  fullPage?: boolean;
  hideList?: any[];
  level?: number;
  mapImageUrl?: (src: string, block?: NotionNode) => string,
  mapPageUrl?: (url: string) => string;
  pageLinkTarget?: string;
  shiki?: boolean;
  textLinkTarget?: string;
}

export function defaultMapImageUrl(src: string = '', block?: NotionNode): string {
  const url = new URL(
    `https://www.notion.so${
      src.startsWith('/image') ? src : `/image/${encodeURIComponent(src)}`
    }`
  )

  if (block && !src.includes('/images/page-cover/')) {
    const table = block.value.parent_table === 'space' 
      ? 'block' : block.value.parent_table
    url.searchParams.set('table', table)
    url.searchParams.set('id', block.value.id)
    url.searchParams.set('cache', 'v2')
  }

  return url.toString()
}

export function defaultMapPageUrl(pageId: string = ''): string {
  return `/${pageId.replace(/-/g, '')}`;
}

function groupBlockContent(blockMap: NotionNodeMap): string[] {
  const output = []

  let lastType = undefined
  let index = -1

  Object.keys(blockMap).forEach((id) => {
    blockMap[id].value.content?.forEach((blockId) => {
      const blockType = blockMap[blockId]?.value?.type

      if (blockType && blockType !== lastType) {
        index++
        lastType = blockType
        output[index] = []
      }

      output[index].push(blockId)
    })

    lastType = undefined
  })

  return output
}

export default function useNotionParser(props: NotionBlockProps) {
  const pass = computed<NotionBlockProps>(() => ({
    blockMap: props.blockMap,
    contentId: props.contentId,
    contentIndex: props.contentIndex,
    embedAllow: props.embedAllow,
    fullPage: props.fullPage,
    hideList: props.hideList,
    level: props.level,
    mapImageUrl: props.mapImageUrl,
    mapPageUrl: props.mapPageUrl,
    pageLinkTarget: props.pageLinkTarget,
    shiki: props.shiki,
    textLinkTarget: props.textLinkTarget
  }))

  const block = computed(() => {
    const id = props.contentId || Object.keys(props.blockMap)[0]
    return props.blockMap[id]
  })
  const value = computed(() => block.value?.value)
  const format = computed(() => value.value?.format)
  const f = computed(() => ({
    block_aspect_ratio: format.value?.block_aspect_ratio,
    block_height: format.value?.block_height || 1,
    block_width: format.value?.block_width || 1,
    block_color: format.value?.block_color,
    bookmark_icon: format.value?.bookmark_icon,
    bookmark_cover: format.value?.bookmark_cover,
    display_source: format.value?.display_source
  }))
  const icon = computed(() => format.value?.page_icon || '')
  const width = computed(() => format.value?.block_width)
  const properties = computed(() => value.value?.properties)
  const caption = computed(() => properties.value?.caption)
  const description = computed(() => properties.value?.description)
  const src = computed(() => {
    return props.mapImageUrl(properties.value?.source[0][0], block.value);
  })
  const title = computed(() => properties.value?.title)
  const type = computed(() => value.value?.type)
  const visible = computed(() => !props.hideList.includes(type.value))
  const parent = computed(() => {
    return props.blockMap[value.value?.parent_id];
  })
  const alt = computed(() => caption.value?.[0][0])

  function isType(t: string | string[]): boolean {
    if (Array.isArray(t)) {
      return visible.value && t.includes(type.value)
    }

    return visible.value && type.value === t
  }

  function getTextContent(text: (string | any)[]): string {
    return text.reduce((prev, current) => prev + current[0], '')
  }

  function blockColorClass(suffix: string = ''): string | undefined {
    const blockColor = format.value?.block_color
    return blockColor ? `notion-${blockColor}${suffix}` : undefined
  }

  function getListNumber(blockId: string): number | undefined {
    const groups = groupBlockContent(props.blockMap)
    const group = groups.find((g) => g.includes(blockId));

    if (!group) {
      return
    }

    return group.indexOf(blockId) + 1;
  }

  return {
    pass,
    alt,
    block,
    value,
    format,
    f,
    icon,
    width,
    properties,
    caption,
    description,
    src,
    title,
    type,
    visible,
    parent,
    isType,
    getTextContent,
    blockColorClass,
    getListNumber
  }
}
