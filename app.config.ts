export default defineAppConfig({
  title: 'Alessandro Jean',
  description: 'Apenas mais um site hospedado no GitHub Pages.',
  url: 'https://alessandrojean.github.io',
  notion: {
    postsTableId: '820ac763104542a0a0868955acd53d4a',
    projectsTableId: '6481387f6ac04dfe9be644327c5d834e',
    aboutPageId: '400a5da984d04cba97e4233f7d6ce244'
  },
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
    { title: 'Artigos', to: '/posts' },
    { title: 'Projetos', to: '/projects' },
  ]
})
