import {
  IconBluesky,
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconMastodon,
  // IconMyAnimeList,
  IconThreads,
  // IconTrakt,
  // IconX,
} from '#components'
import { Component } from 'vue';


export interface SocialMediaLink {
  name: string;
  url: string;
  icon: Component;
}

export default function useSocialMedia(): SocialMediaLink[] {
  const { socialMedia } = useAppConfig()
  const [mastodonUser, mastodonInstance] = socialMedia.mastodon.split('@')

  return [
    // {
    //   name: 'X',
    //   url: `https://twitter.com/${socialMedia.x}`,
    //   icon: IconX,
    // },
    {
      name: 'Mastodon',
      url: `https://${mastodonInstance}/@${mastodonUser}`,
      icon: IconMastodon,
    },
    {
      name: 'Threads',
      url: `https://threads.net/@${socialMedia.threads}`,
      icon: IconThreads,
    },
    {
      name: 'Bluesky',
      url: `https://bsky.app/profile/${socialMedia.bluesky}`,
      icon: IconBluesky,
    },
    {
      name: 'Instagram',
      url: `https://instagram.com/${socialMedia.instagram}`,
      icon: IconInstagram
    },
    {
      name: 'GitHub',
      url: `https://github.com/${socialMedia.instagram}`,
      icon: IconGitHub
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/in/${socialMedia.linkedIn}`,
      icon: IconLinkedIn
    },
    // {
    // name: 'MyAnimeList',
    //   url: `https://myanimelist.net/profile/${socialMedia.myAnimeList}`,
    //   icon: IconMyAnimeList
    // },
    // {
    //   name: 'Trakt',
    //   url: `https://trakt.tv/users/${socialMedia.trakt}`,
    //   icon: IconTrakt
    // },
  ]
}
