import {
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconMyAnimeList,
  IconTrakt,
  IconTwitter,
} from '#components'


export interface SocialMediaLink {
  name: string;
  url: string;
  icon: ReturnType<typeof resolveComponent>;
}

export default function useSocialMedia(): SocialMediaLink[] {
  const { socialMedia } = useAppConfig()

  return [
    {
      name: 'Twitter',
      url: `https://twitter.com/${socialMedia.twitter}`,
      icon: IconTwitter
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
    {
    name: 'MyAnimeList',
      url: `https://myanimelist.net/profile/${socialMedia.myAnimeList}`,
      icon: IconMyAnimeList
    },
    {
      name: 'Trakt',
      url: `https://trakt.tv/users/${socialMedia.trakt}`,
      icon: IconTrakt
    },
  ]
}
