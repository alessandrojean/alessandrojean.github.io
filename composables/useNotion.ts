import { Client } from '@notionhq/client'

const notion = ref<Client>()

export default function useNotion(): Client {
  if (notion.value) {
    return notion.value
  }

  const { notionApiKey } = useRuntimeConfig()
  notion.value = new Client({ auth: notionApiKey })

  return notion.value
}
