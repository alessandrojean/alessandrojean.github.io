import emojiRegex from 'emoji-regex'

const EMOJI_REGEX = emojiRegex()
const TWEMOJI_URL = 'https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter'

function emojiToCode(emoji: string) {
  return [...emoji].map((e) => e.codePointAt(0)!!.toString(16)).join('-')
}

function twemojiUrl(emoji: string) {
  const emojiCode = emojiToCode(emoji)

  return `${TWEMOJI_URL}/${emojiCode}.svg`
}

function replaceEmoji(text: string, size: 'small' | 'normal' = 'normal') {
  const imgSize = size === 'small' ? 'size-4' : 'size-5'
  return text.replace(EMOJI_REGEX, (emoji) => {
    return `<img class="${imgSize} m-0 inline-block align-text-bottom" src="${twemojiUrl(emoji)}" alt="${emoji}" aria-label="${emoji}">`
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
