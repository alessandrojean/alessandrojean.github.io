import type { Blog, Person } from 'schema-dts';

export function useJsonLdSimplePerson() {
  return {
    '@type': 'Person',
    'name': 'Alessandro Jean',
    'image': 'https://alessandrojean.github.io/avatar-okabe-small.webp',
    'url': 'https://alessandrojean.github.io',
    'mainEntityOfPage': 'https://alessandrojean.github.io',
  } satisfies Person;
}

export function useJsonLdPerson() {
  const { socialMedia } = useAppConfig();
  const [mastodonUser, mastodonInstance] = socialMedia.mastodon.split('@');

  return {
    ...useJsonLdSimplePerson(),
    'gender': 'Male',
    'jobTitle': 'Developer',
    'sameAs': [
      `https://github.com/${socialMedia.gitHub}`,
      `https://instagram.com/${socialMedia.instagram}`,
      `https://threads.net/@${socialMedia.threads}`,
      `https://www.linkedin.com/in/${socialMedia.linkedin}`,
      `https://x.com/${socialMedia.twitter}`,
      `https://${mastodonInstance}/@${mastodonUser}`,
      `https://myanimelist.net/profile/${socialMedia.myAnimeList}`,
      `https://trakt.tv/users/${socialMedia.trakt}`,
      `https://linktr.ee/${socialMedia.linktree}`,
      `https://bsky.app/profile/${socialMedia.bluesky}`,
      `https://skoob.com.br/share/user/${socialMedia.skoob}`,
    ],
  } satisfies Person;
}

export function useJsonLdBlog() {
  return {
    '@type': 'Blog',
    '@id': 'https://alessandrojean.github.io/blog',
    'name': 'Alessandro Jean Blog',
    'mainEntityOfPage': 'https://alessandrojean.github.io/blog',
  } satisfies Blog;
}
