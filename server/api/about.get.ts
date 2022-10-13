import { fetchPage, fetchBlocks } from '@/lib/notion'

export default defineEventHandler(async () => {
  const { notionAboutPage } = useRuntimeConfig()

  const page = await fetchPage({ pageId: notionAboutPage })
  const blockMap = await fetchBlocks({ page })

  return blockMap
})
