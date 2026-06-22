<template>
  <div class="pb-16">
    <SiteHeader />

    <PageHeader>
      <PageHeaderTitle>About me</PageHeaderTitle>
    </PageHeader>

    <div class="typography -mt-10">
      <p>Nice to meet you, my name is Alessandro Jean.</p>

      <p>
        I am playing with computer stuff since my childhood, encouraged by family and friends. I realized how fascinating computers are and how many cool stuff they can do since I had my first PC with <a
          href="https://en.wikipedia.org/wiki/Windows_98"
          target="_blank"
        >Windows 98</a>. Since then, I've never stopped.
      </p>

      <p>
        Later, I completed a technical IT course alongside high school. It was there I discovered about the world of <em>programming</em> and wrote my very first programs. Currently, I am a candidate for a Bachelor's degree in Computer Science at <a
          href="https://ufabc.edu.br/en"
          target="_blank"
        >UFABC</a>.
      </p>

      <p>In my free time, I enjoy improving my knowledge through programming and building useful projects for my own needs. I also like reading manga and books, watching movies and TV shows, and playing games.</p>

      <p>Sharing knowledge is something I personally love to do. Helping others and teaching about the fields I study is rewarding.</p>

      <p><em>El Psy Kongroo.</em></p>
    </div>

    <PostFooter class="mt-12">
      <PostFooterCdPreviousDirectory to="/" />
      <PostFooterCopyright />
    </PostFooter>
  </div>
</template>

<script lang="ts" setup>
const { url } = useSiteConfig();

defineOgImage('Page.takumi', {
  title: 'About me',
  subtitle: 'A few words about myself.',
  author: 'Alessandro Jean',
  avatar: url + '/img/avatar-okabe-small.webp',
  role: url,
});

useSeoMeta({
  title: 'About me',
  description: 'A few words about myself.',
  ogTitle: 'About me',
  ogDescription: 'A few words about myself.',
  ogType: 'article',
  ogLocale: 'pt-BR',
  twitterCard: 'summary_large_image',
  twitterTitle: 'About me',
  twitterDescription: 'A few words about myself.',
});
</script>
