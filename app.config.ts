export default defineAppConfig({
  title: 'Alessandro Jean',
  description: 'Apenas mais um site hospedado no GitHub Pages.',
  lang: 'pt-BR',
  url: 'https://alessandrojean.github.io',
  avatarAlt: 'Avatar pessoal com desenho do personagem Okabe da franquia "Steins;Gate". Na imagem, Okabe está posicionado levemente de perfil com um meio sorriso. Seu cabelo está levemente despenteado e ele está vestindo um jaleco branco.',
  socialMedia: {
    twitter: 'alessandrojean_',
    instagram: 'alessandrojean',
    gitHub: 'alessandrojean',
    linkedIn: 'alessandrojean',
    myAnimeList: 'alessandrojean',
    trakt: 'alessandrojean'
  },
  navLinks: [
    { title: 'Sobre', to: '/about' },
    { title: 'Artigos', to: '/posts', exact: false },
    { title: 'Projetos', to: '/projects' },
  ]
})
