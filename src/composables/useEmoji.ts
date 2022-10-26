import emojiRegex from 'emoji-regex'

const EMOJI_REGEX = emojiRegex()
const TWEMOJI_URL = 'https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter'

function emojiToCode(emoji: string) {
  return [...emoji].map((e) => e.codePointAt(0).toString(16)).join('-')
}

function twemojiUrl(emoji: string) {
  const emojiCode = emojiToCode(emoji)

  return `${TWEMOJI_URL}/${emojiCode}.svg`
}

function replaceEmoji(text: string) {
  return text.replace(EMOJI_REGEX, (emoji) => {
    return `<img class="w-5 h-5 m-0 inline-block align-text-bottom" src="${twemojiUrl(emoji)}" alt="${emoji}" aria-label="${emoji}">`
  })
}

function hasEmoji(text: string) {
  return EMOJI_REGEX.test(text)
}

export default function useEmoji() {
  return {
    emojiToCode,
    twemojiUrl,
    replaceEmoji,
    hasEmoji
  }
}
