import { fetchPage, fetchBlocks } from '@/lib/notion'

export default defineEventHandler(async () => {
  const { notionAboutPage, notionEnglishAboutPage } = useRuntimeConfig()

  const pageEn = await fetchPage({ pageId: notionEnglishAboutPage })
  const blockMapEn = await fetchBlocks({ page: pageEn })

  const pagePt = await fetchPage({ pageId: notionAboutPage })
  const blockMapPt = await fetchBlocks({ page: pagePt })

  return { en: blockMapEn, pt: blockMapPt }
})
