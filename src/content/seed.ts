/**
 * Conteúdo semente — usado como fallback ENQUANTO o projeto Sanity real
 * não existe ou não foi populado. Permite que `npm run dev` e `npm run
 * build` funcionem desde o primeiro clone, sem precisar configurar nada.
 *
 * Textos institucionais e frase de destaque foram extraídos verbatim do
 * site atual (valorizarte.com.br) em julho de 2026. As descrições de
 * serviço são rascunhos escritos para preencher a estrutura real do menu
 * — o texto completo de cada serviço vivia dentro de templates do
 * Elementor e não é recuperável via API; o Gilvan deve revisar e ajustar
 * cada descrição pelo Studio antes da publicação.
 *
 * Os posts do blog NÃO ficam aqui: são importados do WordPress por
 * `npm run import:blog` e vivem em ./blogPosts.ts, que é gerado.
 */

export type SeedService = {
  _id: string
  title: string
  slug: string
  audience: 'empresas' | 'profissionais'
  /** Subtítulo exibido no topo da própria página do serviço. */
  summary: string
  /** Frase curta exibida nos cards (Home e /empresas ou /profissionais). Cai para `summary` quando ausente. */
  cardSummary?: string
  image?: string
  /** Banner largo (estilo faixa navy) exibido no topo da página do serviço. */
  headerImage?: string
  highlights?: string[]
  body?: string[] // parágrafos simples; o app converte para blocos
  /** Parágrafo exibido depois dos highlights, quando o serviço precisa de uma chamada final. */
  closingText?: string
  /**
   * Uma ou mais sessões com seletor de abas (ex: Coaching de Carreira/
   * Vocacional/De Vida; ou Coaching + Mentoring, cada um com suas próprias
   * abas). Quando presente, substitui `body`/`highlights` no lugar do texto
   * principal. Cada sessão pode ter sua própria imagem lateral — se
   * ausente, cai para `image`.
   */
  tabSections?: { title?: string; image?: string; tabs: { label: string; body: string }[] }[]
}

export type SeedInterview = {
  _id: string
  title: string
  slug: string
  outlet: string
  publishedAt?: string
  audioTracks: { label?: string; url: string }[]
}

export type SeedGalleryItem = {
  _id: string
  image: string
  alt: string
  caption?: string
  eventDate?: string
}

export type SeedUsefulLink = {
  _id: string
  label: string
  url: string
  description?: string
}

export type SeedCareerTip = {
  _id: string
  title: string
  instagramUrl: string
}

export const seedSiteSettings = {
  siteName: 'Valorizarte',
  tagline: 'A VALORIZARTE desenvolve serviços personalizados de acordo com as necessidades de sua empresa.',
  phone: '31 99105-0060',
  email: 'gilvan@valorizarte.com.br',
  social: {
    instagram: 'https://instagram.com/gilvansilva.valorizarte',
    linkedin: 'https://www.linkedin.com/in/gilvan-silva/',
    facebook: 'https://www.facebook.com/gilvan.silva.valorizarte',
  },
}

export const seedHomePage = {
  heroSlides: [
    {
      image: '/images/hero/palestras-workshops.png',
      headline: 'PALESTRAS, WORKSHOPS E TREINAMENTOS',
      subtext: 'A VALORIZARTE desenvolve serviços personalizados de acordo com as necessidades de sua empresa.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '/empresas/palestras-workshops-e-treinamentos',
    },
    {
      image: '/images/hero/nos-mostramos-o-caminho.png',
      headline: 'DESENVOLVIMENTO PROFISSIONAL',
      subtext:
        'Coaching de Carreira individual e em grupo, Coaching Vocacional, Assessoria em Transição de Carreira e Mentoria em Empreendedorismo.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '/empresas/coaching',
    },
    {
      image: '/images/hero/coaching-de-equipes.png',
      headline: 'COACHING E MENTORING',
      subtext:
        'Eleve sua empresa a um novo patamar através do desenvolvimento das pessoas, a partir dos objetivos estratégicos da empresa.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '/empresas/coaching-mentoring',
    },
    {
      image: '/images/hero/consultoria-empresarial.png',
      headline: 'CONSELHO CONSULTIVO',
      subtext:
        'Um time de especialistas ajudando você a tomar decisões mais seguras, reduzir riscos e acelerar o crescimento do seu negócio com insights estratégicos e visão experiente.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '/empresas/conselho-consultivo',
    },
    {
      image: '/images/hero/consultoria-empresarial.png',
      headline: 'CONSULTORIA EMPRESARIAL',
      subtext: 'Alavanque seu negócio pela otimização dos processos, Planejamento Estratégico e Cultura de Inovação.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '/empresas/consultoria-empresarial',
    },
  ],
  heroHeadline: 'A VALORIZARTE desenvolve serviços personalizados de acordo com as necessidades de sua empresa.',
  heroSubtext:
    'Consultoria, coaching e mentoring para empresas, líderes e profissionais que querem evoluir com propósito.',
  founderIntro:
    'Fundada em 2013, a VALORIZARTE conta com Consultores Associados multidisciplinares, com experiência expressiva nas diversas áreas organizacionais e conectados com as melhores práticas de mercado.',
  founderPhoto: '/images/founder.png',
  howWeHelpTitle: 'Como te auxiliamos?',
  howWeHelpTagline: 'Do conselho estratégico à ação prática: soluções para transformar seu negócio e sua carreira.',
  howWeHelpText:
    'Na Valorizarte, guiamos empresas e empreendedores iniciantes rumo ao sucesso com estratégias personalizadas. Do **conselho consultivo** à **mentoria e coaching**, passando por **cursos, palestras e assessoria de aposentadoria**, oferecemos o suporte certo para cada etapa da sua jornada. **Clareza, estratégia e ação** – é assim que transformamos desafios em oportunidades.',
}

export const seedNavigation = [
  { label: 'Início', href: '/' },
  {
    label: 'Quem Somos',
    href: '/quemsomos',
    children: [
      { label: 'A Valorizarte', href: '/quemsomos#a-valorizarte' },
      { label: 'Sócio fundador', href: '/quemsomos#socio-fundador' },
      { label: 'Principais clientes', href: '/quemsomos#principais-clientes' },
      { label: 'Relatos de clientes', href: '/quemsomos#relatos-de-clientes' },
    ],
  },
  {
    label: 'Para Empresas',
    href: '/empresas',
    children: [
      { label: 'Conselho Consultivo', href: '/empresas/conselho-consultivo' },
      { label: 'Palestras, Workshops e Treinamentos', href: '/empresas/palestras-workshops-e-treinamentos' },
      { label: 'Consultoria Empresarial', href: '/empresas/consultoria-empresarial' },
      { label: 'Coaching e Mentoring', href: '/empresas/coaching-mentoring' },
      { label: 'Programa de Aposentadoria', href: '/empresas/programa-aposentadoria' },
      { label: 'Assessments', href: '/empresas/assessments' },
    ],
  },
  {
    label: 'Para Profissionais',
    href: '/profissionais',
    children: [
      { label: 'Coaching', href: '/empresas/coaching' },
      { label: 'Assessoria', href: '/empresas/assessoria' },
      { label: 'Mentoring', href: '/empresas/mentoring' },
      { label: 'Treinamentos Abertos', href: '/empresas/treinamentos-abertos' },
      // Repetidos de propósito em relação a "Para Empresas": o Gilvan presta
      // estes dois serviços tanto para empresas (PJ) quanto para
      // profissionais (PF), então ambos os menus levam à mesma página.
      { label: 'Programa de Aposentadoria', href: '/empresas/programa-aposentadoria' },
      { label: 'Assessments', href: '/empresas/assessments' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  {
    label: 'Mídia',
    href: '/midia',
    children: [
      { label: 'Entrevistas', href: '/midia/entrevistas' },
      { label: 'Fotos', href: '/midia/fotos' },
      { label: 'Links Importantes', href: '/links-uteis' },
      { label: 'Dicas de Carreira', href: '/dicas-de-carreira' },
    ],
  },
]

// Os arquivos de mídia (mp3 e fotos) ainda são servidos pelo WordPress atual.
// Ao migrar para o Sanity, os assets sobem para o CDN e estas URLs saem daqui.
const WP_UPLOADS = 'https://valorizarte.com.br/wp-content/uploads'

export const seedInterviews: SeedInterview[] = [
  {
    _id: 'entrevista-sobre-coaching-band-news-30abr15',
    title: 'Entrevista sobre Coaching – Band News – 30/abr/15',
    slug: 'entrevista-sobre-coaching-band-news-30abr15',
    outlet: 'Band News',
    publishedAt: '2015-04-30',
    audioTracks: [
      { label: 'Bloco 1', url: `${WP_UPLOADS}/2016/05/radio_band_2_1.mp3` },
      { label: 'Bloco 2', url: `${WP_UPLOADS}/2016/05/radio_band_2_2.mp3` },
      { label: 'Bloco 3', url: `${WP_UPLOADS}/2016/05/radio_band_2_3.mp3` },
      { label: 'Bloco 4', url: `${WP_UPLOADS}/2016/05/radio_band_2_4.mp3` },
    ],
  },
  {
    _id: 'entrevista-radio-band-outubro-2014',
    title: 'Entrevista sobre Coaching – Band News – 16/out/14',
    slug: 'entrevista-radio-band-outubro-2014',
    outlet: 'Band News',
    publishedAt: '2014-10-16',
    audioTracks: [{ url: `${WP_UPLOADS}/2016/05/radio_band1.mp3` }],
  },
  {
    _id: 'pratique-gentileza-radio-itatiaia',
    title: 'Pratique Gentileza – Rádio Itatiaia',
    slug: 'pratique-gentileza-radio-itatiaia',
    outlet: 'Rádio Itatiaia',
    publishedAt: '2016-05-31',
    audioTracks: [{ url: `${WP_UPLOADS}/2016/05/Pratique-Gentileza-Gilvan-Silva-Radio-Itatiaia.mp3` }],
  },
]

export const seedGallery: SeedGalleryItem[] = [
  {
    _id: 'foto-1',
    image: `${WP_UPLOADS}/2025/03/1-Formacao-em-Coaching-IBC-MG-2013.jpeg`,
    alt: 'Turma de formação em Coaching do IBC em Minas Gerais, 2013',
    caption: 'Formação em Coaching – IBC – MG',
    eventDate: '2013-01-01',
  },
  {
    _id: 'foto-2',
    image: `${WP_UPLOADS}/2025/03/2-Com-Tim-Gallwey-Precursor-do-Coaching-2014.jpeg`,
    alt: 'Gilvan Silva ao lado de Tim Gallwey, precursor do coaching',
    caption: 'Com Tim Gallwey – precursor do Coaching',
    eventDate: '2014-01-01',
  },
  {
    _id: 'foto-3',
    image: `${WP_UPLOADS}/2025/03/3-Formacao-em-Coaching-The-Inner-Game-School-2014.jpeg`,
    alt: 'Formação em Coaching pela The Inner Game School',
    caption: 'Formação em Coaching – The Inner Game School',
    eventDate: '2014-01-01',
  },
  {
    _id: 'foto-4',
    image: `${WP_UPLOADS}/2025/03/4-20-anos-de-International-Coach-Federation-2015.jpeg`,
    alt: 'Celebração dos 20 anos da International Coach Federation',
    caption: '20 anos de International Coach Federation',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-5',
    image: `${WP_UPLOADS}/2025/03/5-Com-a-Jornalista-e-Apresentadora-Inacia-Soares-2015.png`,
    alt: 'Gilvan Silva com a jornalista e apresentadora Inácia Soares',
    caption: 'Com a jornalista e apresentadora Inácia Soares',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-6',
    image: `${WP_UPLOADS}/2025/03/6-Palestra-no-Senac-Minas-Gerais-2015.jpeg`,
    alt: 'Palestra de Gilvan Silva no Senac, em Minas Gerais',
    caption: 'Palestra no Senac – Minas Gerais',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-7',
    image: `${WP_UPLOADS}/2025/03/7-Palestra-na-PUC-Minas-Gerais-2015.jpeg`,
    alt: 'Palestra de Gilvan Silva na PUC Minas',
    caption: 'Palestra na PUC – Minas Gerais',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-8',
    image: `${WP_UPLOADS}/2025/03/8-Com-Steve-Harrison-e-Jose-Augusto-da-LHH-DBM-2015.jpeg`,
    alt: 'Gilvan Silva com Steve Harrison e José Augusto, da LHH | DBM',
    caption: 'Com Steve Harrison e José Augusto, da LHH | DBM',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-9',
    image: `${WP_UPLOADS}/2025/03/9-Sebrae-MG-Encontro-de-Credenciados-2015.jpeg`,
    alt: 'Encontro de credenciados do Sebrae Minas Gerais',
    caption: 'Sebrae MG – Encontro de Credenciados',
    eventDate: '2015-01-01',
  },
  {
    _id: 'foto-10',
    image: `${WP_UPLOADS}/2025/03/10-Palestra-Minas-Tenis-Clube-MG-2016.jpeg`,
    alt: 'Palestra de Gilvan Silva no Minas Tênis Clube',
    caption: 'Palestra no Minas Tênis Clube – MG',
    eventDate: '2016-01-01',
  },
  {
    _id: 'foto-11',
    image: `${WP_UPLOADS}/2025/03/11-Posse-de-Diretoria-ICF-Minas-2016.jpeg`,
    alt: 'Cerimônia de posse da diretoria da ICF Minas',
    caption: 'Posse de Diretoria – ICF Minas',
    eventDate: '2016-01-01',
  },
  {
    _id: 'foto-12',
    image: `${WP_UPLOADS}/2025/03/12-Semana-Internacional-de-Coaching-ICF-2016.jpeg`,
    alt: 'Semana Internacional de Coaching da ICF',
    caption: 'Semana Internacional de Coaching – ICF',
    eventDate: '2016-01-01',
  },
]

export const seedUsefulLinks: SeedUsefulLink[] = [
  { _id: 'link-podcast', label: 'Podcast', url: 'https://youtube.com/live/2AtkjhsK5gQ' },
  { _id: 'link-linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/gilvan-silva' },
  { _id: 'link-instagram', label: 'Instagram', url: 'https://www.instagram.com/gilvansilva.valorizarte/' },
  { _id: 'link-site', label: 'Visite meu site', url: 'https://www.valorizarte.com.br/' },
  { _id: 'link-blog', label: 'Meu Blog', url: 'https://valorizarte.com.br/blog/' },
  { _id: 'link-whatsapp', label: 'WhatsApp', url: 'https://api.whatsapp.com/send?phone=5531991050060' },
  {
    _id: 'link-newsletter',
    label: 'Assine minha newsletter no LinkedIn',
    url: 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7278395366805323776',
  },
  // Facebook não entra na lista de links: já aparece como ícone junto com
  // LinkedIn e Instagram, no rodapé do cartão — igual à página original.
]

// Reels publicados no Instagram da jornalista Inácia Soares (@inaciasoares),
// em que o Gilvan comenta temas de carreira. O site atual os embute na
// página "Dicas de Carreira".
export const seedCareerTips: SeedCareerTip[] = [
  { _id: 'dica-1', title: 'Dica de carreira 1', instagramUrl: 'https://www.instagram.com/reel/C1PPORYO-x1/' },
  { _id: 'dica-2', title: 'Dica de carreira 2', instagramUrl: 'https://www.instagram.com/reel/C1NnYesOWWx/' },
  { _id: 'dica-3', title: 'Dica de carreira 3', instagramUrl: 'https://www.instagram.com/reel/C1NKh5TOIdp/' },
  { _id: 'dica-4', title: 'Dica de carreira 4', instagramUrl: 'https://www.instagram.com/reel/C1JwGmPu2X7/' },
  { _id: 'dica-5', title: 'Dica de carreira 5', instagramUrl: 'https://www.instagram.com/reel/C1Ir_NhtJ8i/' },
  { _id: 'dica-6', title: 'Dica de carreira 6', instagramUrl: 'https://www.instagram.com/reel/C1Ch-pxuuPy/' },
  { _id: 'dica-7', title: 'Dica de carreira 7', instagramUrl: 'https://www.instagram.com/reel/C0xZ6w7Oj0S/' },
  { _id: 'dica-8', title: 'Dica de carreira 8', instagramUrl: 'https://www.instagram.com/reel/C0vAQ8bt9u7/' },
  { _id: 'dica-9', title: 'Dica de carreira 9', instagramUrl: 'https://www.instagram.com/reel/C0t2J0iu4f2/' },
  { _id: 'dica-10', title: 'Dica de carreira 10', instagramUrl: 'https://www.instagram.com/reel/C00C0zKN0oq/' },
]

export const seedServices: SeedService[] = [
  {
    _id: 'conselho-consultivo',
    title: 'Conselho Consultivo',
    slug: 'conselho-consultivo',
    audience: 'empresas',
    summary: 'Experiência e visão estratégica para impulsionar seu negócio.',
    cardSummary:
      'Um time de especialistas ajudando você a tomar decisões mais seguras, reduzir riscos e acelerar o crescimento do seu negócio com insights estratégicos e visão experiente.',
    image: '/images/services/conselho-consultivo.jpg',
    headerImage: '/images/services/conselho-consultivo-header.jpg',
    body: [
      'Na jornada organizacional, contar com a experiência e a visão estratégica de especialistas faz toda a diferença.',
      'O **Conselho Consultivo** da Valorizarte é um serviço exclusivo para organizações de pequeno e médio porte que desejam tomar decisões mais seguras, minimizar riscos e acelerar o crescimento de seus negócios.',
    ],
    highlights: [
      'Visão externa e imparcial sobre o seu negócio.',
      'Orientação estratégica para crescimento sustentável.',
      'Apoio na tomada de decisões, reduzindo riscos e incertezas.',
      'Acesso à experiência de especialistas sem necessidade de contratação fixa.',
      'Networking poderoso para ampliar suas conexões.',
    ],
  },
  {
    _id: 'palestras-workshops-e-treinamentos',
    title: 'Palestras, Workshops e Treinamentos',
    slug: 'palestras-workshops-e-treinamentos',
    audience: 'empresas',
    summary: 'Transformando Conhecimento em Ação: Experiências que Inspiram e Capacitam',
    cardSummary:
      'Capacitações empresariais para desenvolver equipes, fortalecer a cultura organizacional e impulsionar a performance com conhecimento estratégico.',
    headerImage: '/images/services/palestras-workshops-e-treinamentos-header.jpg',
    body: [
      'Oferecemos uma ampla variedade de palestras, workshops e treinamentos voltados para o desenvolvimento profissional e organizacional. Nossos temas abrangem desde liderança e produtividade até inovação e inteligência emocional, sempre com foco em resultados e na valorização do capital humano.',
      'Confira algumas das nossas principais opções:',
    ],
    highlights: [
      '**Liderança Coach** – Estratégias para liderança eficaz e resultados sustentáveis.',
      '**Qualidade de Vida no Trabalho** – Bem-estar e produtividade caminhando juntos.',
      '**Administração do Tempo e Gestão de Tarefas** – Técnicas para otimizar a rotina e aumentar a eficiência.',
      '**Comunicação Assertiva e Feedback** – Construindo diálogos produtivos e relações saudáveis.',
      '**Plano de Desenvolvimento Individual (PDI)** – Traçando metas claras para crescimento profissional.',
      '**Inteligência Emocional no Trabalho** – Equilíbrio emocional para um ambiente mais harmônico e produtivo.',
      '**Inovação e Competitividade** – Estratégias para se destacar no mercado atual.',
      '**Planejamento Estratégico** – Direcionamento eficaz para alcançar objetivos organizacionais.',
      '**Palestras Motivacionais** – Inspiração e engajamento para equipes de alta performance.',
      '**Desenvolvimento de Equipes de Alto Desempenho** – Construindo times fortes e colaborativos.',
      '**Criação e Implantação de Processos e Procedimentos** – Estruturando a organização para maior eficiência.',
      '**Inovação e Criatividade** – Como reinventar seu negócio e se adaptar a novos desafios.',
      '**Alinhamento de Competências aos Objetivos do Negócio** – Potencializando talentos para o crescimento da empresa.',
    ],
    closingText:
      'Além dessas opções, personalizamos palestras, workshops e treinamentos para atender às necessidades específicas da sua empresa. Entre em contato e descubra como podemos impulsionar o desenvolvimento do seu time!',
  },
  {
    _id: 'consultoria-empresarial',
    title: 'Consultoria Empresarial',
    slug: 'consultoria-empresarial',
    audience: 'empresas',
    summary: 'Soluções Estratégicas para o Crescimento e a Eficiência do seu Negócio',
    cardSummary:
      'Soluções personalizadas para empresas, otimizando processos, aumentando a eficiência e fortalecendo a gestão com estratégias inovadoras.',
    image: '/images/services/consultoria-empresarial.jpg',
    headerImage: '/images/services/consultoria-empresarial-header.jpg',
    body: [
      'Tem como objetivo promover o desenvolvimento empresarial pelo uso de técnicas de melhoria contínua de processos, com os objetivos de alavancar o negócio, reduzir custos, elevar a lucratividade e aumentar a satisfação dos clientes. Na gestão de processos com foco em resultados são utilizadas Metodologias Ágeis.',
      '## Planejamento Estratégico',
      'O Planejamento Estratégico visa a adaptação a mercados em contínua mudança, buscando manter uma flexibilidade viável de seus objetivos, habilidades e recursos enquanto mantém um compromisso com o lucro, o crescimento e sua missão organizacional.',
      '## Inovação e Competitividade',
      'A Consultoria em Inovação e Competitividade tem como objetivo levar a empresa para um novo patamar através da implantação e de um Programa de Gestão Estratégica da Inovação e do desenvolvimento das habilidades criativas de seus colaboradores, propiciando em cada um a construção interna de uma Cultura para Inovação, que em seguida será disseminada na Organização em que atua, com vistas a propiciar um aumento na produtividade e na rentabilidade da empresa. Em um mundo onde mercado, produtos, tecnologias, concorrentes e a própria sociedade mudam de forma tão ágil, a inovação contínua tornou-se uma vantagem competitiva sustentável para as organizações.',
    ],
  },
  {
    _id: 'coaching-mentoring-empresas',
    title: 'Coaching e Mentoring',
    slug: 'coaching-mentoring',
    audience: 'empresas',
    summary: 'Impulsionando Líderes e Equipes para Alta Performance Empresarial',
    cardSummary:
      'Desenvolvimento de líderes e equipes por meio de acompanhamento estratégico, promovendo alta performance, engajamento e crescimento sustentável.',
    headerImage: '/images/services/coaching-mentoring-header.jpg',
    tabSections: [
      {
        title: 'Coaching',
        image: '/images/services/coaching-mentoring.png',
        tabs: [
          {
            label: 'Executivo',
            body: 'Coaching Executivo visa desenvolver nos líderes as competências necessárias para que possam desempenhar suas funções com eficiência, construir equipes de alta performance e se preparar para o processo de sucessão.',
          },
          {
            label: 'De liderança',
            body: 'É um processo focado no desenvolvimento e aprimoramento de competências do líder, possibilitando a adoção de um estilo de liderança e gestão que permita conduzir o profissional a um novo patamar na carreira e a equipe à obtenção de melhores resultados junto à instituição.',
          },
          {
            label: 'De equipes',
            body: 'Coaching de Equipes é um processo de desenvolvimento profissional que estimula a aprendizagem coletiva por meio deste espaço de reflexão, acelerando o processo de desenvolvimento dos profissionais e contribuindo para a evolução do grupo e da empresa.',
          },
          {
            label: 'De negócios',
            body: 'Coaching de Negócios propicia à empresa a definição e alcance dos objetivos estratégicos necessários para levá-la a um patamar mais elevado, com maior produtividade e melhores resultados financeiros.',
          },
        ],
      },
      {
        title: 'Mentoring',
        image: '/images/services/coaching-mentoring-mentoring.jpg',
        tabs: [
          {
            label: 'Mentoria interna',
            body: '**Implantação do Programa de Mentoria Organizacional Interna:** Visa o desenvolvimento de líderes e colaboradores, com o intuito de preparar e reter talentos, aumentar a integração entre as áreas e facilitar a gestão do conhecimento, principalmente tácito e empírico, em poder dos mais seniores.',
          },
          {
            label: 'Sucessão',
            body: 'Tem por objetivos preparar colaboradores para o processo sucessório e atrair novos colaboradores por meio das políticas de desenvolvimento de carreira. A abordagem é focada na aprendizagem individual e no desenvolvimento profissional, resultando no alinhamento do talento e do potencial do colaborador à missão organizacional.',
          },
        ],
      },
    ],
  },
  {
    _id: 'programa-aposentadoria',
    title: 'Programa de Aposentadoria',
    slug: 'programa-aposentadoria',
    audience: 'empresas',
    summary: 'Plantando hoje a paz de amanhã',
    cardSummary:
      'Planejamento estruturado para a transição de profissionais no sentido de uma aposentadoria ativa, equilibrada e alinhada a seus objetivos de vida.',
    image: '/images/services/programa-aposentadoria.png',
    headerImage: '/images/services/programa-aposentadoria-header.jpg',
    body: [
      'O **Programa de Aposentadoria** da Valorizarte apoia profissionais que estão se aposentando ou já se aposentaram, na definição de seus próximos passos.',
      'Seja para iniciar uma nova carreira ou empreender, o programa oferece um planejamento estruturado e alinhado aos seus objetivos.',
      'Para isso, utilizamos metodologias como **Coaching de Carreira, Modelo de Negócios Profissionais (CANVAS)** e **Design Thinking**, ajudando você a transformar experiência em novas oportunidades.',
    ],
  },
  {
    _id: 'assessments-empresas',
    title: 'Assessments',
    slug: 'assessments',
    audience: 'empresas',
    summary: 'Avaliações e Diagnósticos para seu Crescimento',
    cardSummary:
      'Ferramentas de diagnóstico pessoal e profissional para análise de perfil, competências e potencial, auxiliando no desenvolvimento de talentos e na tomada de decisões estratégicas de carreira.',
    image: '/images/services/assessments.png',
    body: [
      '## MBTI Step II',
      'MBTI significa Myers-Briggs Type Indicator (Indicador de Tipos de Myers-Briggs). É um teste de personalidade baseado na teoria dos tipos psicológicos de Carl Jung, desenvolvido por Isabel Briggs Myers e Katharine Cook Briggs. Tem como objetivo a indicação de aspectos da personalidade, proporcionando autoconhecimento através do destaque dos pontos fortes e dos pontos a serem observados, a fim de trabalhar o desenvolvimento pessoal e profissional do indivíduo.',
      '## DISC',
      'O DISC é um modelo de avaliação comportamental baseado na teoria do psicólogo William Moulton Marston. Este teste oferece uma representação gráfica e quantitativa do perfil comportamental, seja individual ou da equipe, destacando de forma clara as forças, preferências, estilo de liderança e vulnerabilidades de cada pessoa, ajudando a prever como ela age e interage com os outros.',
      '## Facet5',
      'O Facet5 identifica os 5 principais elementos de base de personalidade – divididos em 13 subfatores. É o padrão de pontuações que verificamos em cada um dos fatores que fornece uma imagem geral da nossa personalidade. Os fatores medidos pelo Facet5 são: **Determinação, Energia, Afetividade, Controle e Emocionalidade**.',
    ],
  },
  {
    _id: 'coaching',
    title: 'Coaching',
    slug: 'coaching',
    audience: 'profissionais',
    summary: 'Orientação e Desenvolvimento para uma Carreira e Vida com Propósito',
    cardSummary:
      'Desenvolvimento individual para profissionais e empreendedores, auxiliando na definição de objetivos, superação de desafios e aceleração da carreira com estratégias assertivas.',
    image: '/images/services/coaching.png',
    headerImage: '/images/services/coaching-header.jpg',
    tabSections: [
      {
        tabs: [
          {
            label: 'De Carreira',
            body: 'O processo de Coaching de Carreira proporciona uma clareza quanto a opções profissionais a serem adotadas para alcance dos objetivos, trabalhando cenários possíveis através da construção da visão de futuro e do Planejamento de Carreira, possibilitando o desenvolvimento tanto pessoal quanto profissional.',
          },
          {
            label: 'Vocacional',
            body: 'O processo de Coaching Vocacional visa auxiliar os jovens a partir dos 14 anos de idade que busquem definir ou redefinir o direcionamento de sua carreira.',
          },
          {
            label: 'De Vida',
            body: 'Visa trabalhar o autoconhecimento para o alcance do equilíbrio em todas as áreas da vida, resultando em uma melhoria relevante na administração do tempo, na definição de prioridades e no alcance de objetivos.',
          },
        ],
      },
    ],
  },
  {
    _id: 'assessoria',
    title: 'Assessoria',
    slug: 'assessoria',
    audience: 'profissionais',
    summary: 'Redirecionamento Profissional Estratégico para Novas Oportunidades e Crescimento',
    cardSummary:
      'Suporte personalizado para estruturar e impulsionar sua trajetória profissional ou empreendedora, com orientação prática e estratégica.',
    image: '/images/services/assessoria.png',
    body: [
      '**Assessoria Outplacement (preparação para novo emprego) · Transição de Carreira – Mudando de Rumo com Segurança.** A transição para um novo emprego exige planejamento e preparação. Nosso processo de outplacement auxilia o profissional a se posicionar de forma competitiva no mercado, utilizando ferramentas e estratégias que aceleram a conquista de novas oportunidades, aumentando a confiança e a assertividade na busca por recolocação.',
    ],
  },
  {
    _id: 'mentoring',
    title: 'Mentoring',
    slug: 'mentoring',
    audience: 'profissionais',
    summary: 'Aceleração de Carreiras e Negócios com Estratégias Práticas e Direcionamento Claro',
    cardSummary:
      'Acompanhamento com mentores experientes para orientar decisões, compartilhar conhecimentos e acelerar o crescimento profissional e empresarial.',
    image: '/images/services/mentoring.png',
    body: [
      '**Para empreendedores · Para coaches.** Visa guiar o empreendedor nos processos de definição e abertura de um novo negócio, bem como no desenvolvimento de um negócio já existente de forma segura e sustentável.',
    ],
  },
  {
    _id: 'treinamentos-abertos',
    title: 'Treinamentos Abertos',
    slug: 'treinamentos-abertos',
    audience: 'profissionais',
    summary: 'Capacitação para Impulsionar sua Carreira',
    cardSummary:
      'Capacitações dinâmicas e acessíveis para profissionais que buscam atualização, novas habilidades e crescimento na carreira.',
    image: '/images/services/treinamentos-abertos.png',
    body: [
      'Nossos treinamentos abertos são voltados para profissionais que desejam aprimorar suas habilidades, expandir suas oportunidades e alcançar novos patamares na carreira e nos negócios. Com uma abordagem prática e aplicada, trabalhamos temas essenciais para o desenvolvimento profissional e pessoal.',
    ],
    highlights: [
      '**Liderança Coach – Liderança para Resultados.** Estratégias para liderar com eficiência, inspirar equipes e alcançar metas com alta performance.',
      '**Inovação e Criatividade.** Como desenvolver soluções inovadoras e se destacar em um mercado competitivo.',
      '**Planejamento de Carreira.** Construção de um caminho profissional sólido e alinhado aos seus objetivos e talentos.',
      '**Empreendedorismo.** Mentalidade, ferramentas e estratégias para iniciar ou expandir um negócio de sucesso.',
      '**Plano de Desenvolvimento Individual (PDI).** Definição de metas claras e um plano estruturado para seu crescimento profissional.',
      '**Gestão de Mudanças.** Adaptabilidade e resiliência para enfrentar transformações no ambiente de trabalho.',
      '**Inteligência Emocional.** Desenvolvimento do autoconhecimento e do controle emocional para melhor desempenho e bem-estar.',
      '**Planejamento Estratégico.** Metodologias para traçar estratégias eficazes e alcançar objetivos organizacionais e pessoais.',
    ],
  },
]

export type SeedTestimonial = {
  _id: string
  name: string
  roleAndCompany: string
  quote: string
  photo: string
}

export const seedTestimonials: SeedTestimonial[] = [
  {
    _id: 'seed-testimonial-gladson',
    name: 'Gladson Dias de Freitas',
    roleAndCompany: 'Gerente de Projetos',
    photo: '/images/testimonials/gladson-dias-de-freitas.jpg',
    quote:
      'Passado todo esse processo, eu penso que não somente eu mas todos os executivos que querem evoluir na carreira deveriam ter a oportunidade e o privilégio de passar um trabalho como esse de autoconhecimento e mudança interna que tocou muito além do trabalho, mas todas as áreas da minha vida. Ao final do processo percebo que estou muito mais preparado para lidar com os desafios de gestão e relacionamento empresarial. Muito obrigado, mestre e amigo Gilvan por me acompanhar nessa caminhada de transição. Você fez a diferença!',
  },
  {
    _id: 'seed-testimonial-michel',
    name: 'Michel Jaques Burman',
    roleAndCompany: 'Strategy and Performance Manager, Iron Ore Brazil',
    photo: '/images/testimonials/michel-burman.jpg',
    quote:
      'Um aspecto fundamental no Processo de Coaching é a empatia, confiança e inspiração do Coachee para com o Coach. Através do brilhante profissional e pessoa que é Gilvan Silva, explorei as mais diversas e amplas dimensões da carreira profissional, sem deixar de lado a forma pragmática de obtenção de resultados concretos em um curto período de tempo.',
  },
  {
    _id: 'seed-testimonial-flavia',
    name: 'Flávia Amaral Cornélio',
    roleAndCompany: 'Jornalista | Assessora de Imprensa',
    photo: '/images/testimonials/flavia-cornelio.jpg',
    quote:
      'Foi com o processo de Coaching que eu me reinventei, em um momento muito importante na minha vida profissional, o que refletiu na minha vida pessoal. O que fica de lição é que eu consigo, eu posso, eu mereço tudo de bom e a vida é boa sim… Sempre praticando a empatia!',
  },
  {
    _id: 'seed-testimonial-lilian',
    name: 'Lilian Alvares',
    roleAndCompany: 'Comunicadora Social',
    photo: '/images/testimonials/lilian-alvares.jpg',
    quote:
      'Após passar por um momento de significativas mudanças em minha vida pessoal e profissional, estava com inúmeras ideias em mente e não sabia o quê, nem como exatamente desenvolver, o que me gerava uma enorme ansiedade que me paralisava. Foi então que conheci o Master Coach Gilvan Silva e comecei a realizar com o mesmo um trabalho de Coaching de Carreira. A partir do autoconhecimento proporcionado pelo processo, consegui definir os meus objetivos atuais e de longo prazo.',
  },
]

export type SeedClientLogo = {
  _id: string
  name: string
  logo: string
}

export const seedClientLogos: SeedClientLogo[] = [
  { _id: 'seed-client-senac', name: 'Senac', logo: '/images/clients/senac.png' },
  { _id: 'seed-client-vale', name: 'Vale', logo: '/images/clients/vale.png' },
  { _id: 'seed-client-fdc', name: 'Fundação Dom Cabral', logo: '/images/clients/fdc.png' },
  { _id: 'seed-client-fundacao-renova', name: 'Fundação Renova', logo: '/images/clients/fundacao-renova.png' },
  { _id: 'seed-client-arcelor-mittal', name: 'ArcelorMittal / Bekaert', logo: '/images/clients/arcelor-mittal.png' },
  { _id: 'seed-client-ocemg', name: 'Sistema Ocemg', logo: '/images/clients/ocemg.png' },
  { _id: 'seed-client-lhh', name: 'Lee Hecht Harrison', logo: '/images/clients/lhh.png' },
  { _id: 'seed-client-valor-da-logistica', name: 'Valor da Logística', logo: '/images/clients/valor-da-logistica.png' },
  { _id: 'seed-client-anglo-american', name: 'Anglo American', logo: '/images/clients/anglo-american.png' },
  { _id: 'seed-client-una', name: 'Una', logo: '/images/clients/una.png' },
  { _id: 'seed-client-sebrae', name: 'Sebrae', logo: '/images/clients/sebrae.png' },
  { _id: 'seed-client-fiemg', name: 'Sistema Fiemg', logo: '/images/clients/fiemg.png' },
  { _id: 'seed-client-minas-tenis-clube', name: 'Minas Tênis Clube', logo: '/images/clients/minas-tenis-clube.png' },
  { _id: 'seed-client-puc-minas', name: 'PUC Minas', logo: '/images/clients/puc-minas.png' },
]

export type SeedPage = {
  _id: string
  title: string
  slug: string
  intro?: string
  body: string[]
}

/**
 * A URL /quemsomos/ em si, no site atual, nunca foi preenchida (ainda
 * mostra o texto de exemplo padrão do WordPress). Mas o dropdown "Quem
 * Somos" do menu linka para /a-valorizarte/, que tem o conteúdo
 * institucional real (Sobre a Marca, Missão, Visão, Valores) — é esse
 * texto, coletado verbatim, que usamos abaixo como conteúdo de
 * "quemsomos" nesta reconstrução.
 *
 * A política de privacidade abaixo também é o texto real e completo,
 * coletado verbatim da página em produção.
 */
export const seedPages: SeedPage[] = [
  {
    _id: 'seed-quemsomos',
    title: 'Quem Somos',
    slug: 'quemsomos',
    body: [
      '## Sobre a Marca',
      'O **Diamante** simboliza a verdade, a pureza e a perfeição. Exprime a lapidação inerente a todo processo de desenvolvimento. Uma fina associação ao processo de se lapidar a pedra bruta para se tornar um diamante, que também simboliza as virtudes humanas. É o lapidar do ser para que aflore o seu melhor em essência, resultando em eficiência e grandes conquistas.',
      'O nome **"Valorizarte"** promove a ideia de valorizar "a ti", sendo este "ti" a empresa ou o profissional que se investe no processo de desenvolvimento, passando pela autovalorização. Simboliza então o despertar da autovalorização, por meio do reconhecimento e do desenvolvimento de diferenciais competitivos tanto empresariais quanto profissionais, possibilitando o alcance de excelência nos resultados.',
      '## Missão',
      'Promover o desenvolvimento empresarial e profissional de forma sistêmica e inovadora visando crescimento contínuo e sustentável.',
      '## Visão',
      'Ser referência a nível nacional em desenvolvimento empresarial e profissional.',
      '## Valores',
      'Ética, transparência, respeito, excelência, desenvolvimento.',
    ],
  },
  {
    _id: 'seed-politicas-de-privacidade',
    title: 'Políticas de Privacidade',
    slug: 'politicas-de-privacidade',
    body: [
      'A sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos e protegemos as informações pessoais fornecidas pelos visitantes do site Valorizarte.',
      '1. Informações que coletamos — Coletamos informações pessoais que você nos fornece voluntariamente, como nome e e-mail, ao assinar nossa newsletter ou se inscrever em cursos/mentorias. Podemos também, futuramente, coletar informações de forma automática por meio de cookies, ferramentas de análise de tráfego (como Google Analytics) e pixels de redes sociais, com o objetivo de melhorar a experiência do usuário e personalizar conteúdos e anúncios.',
      '2. Como utilizamos seus dados — As informações coletadas podem ser utilizadas para: enviar conteúdos e atualizações do blog; enviar comunicações sobre cursos, mentorias e eventos; entrar em contato por motivos comerciais; melhorar a experiência de navegação no site; realizar campanhas de marketing e remarketing em plataformas de anúncios.',
      '3. Compartilhamento de informações — Seus dados podem ser compartilhados com serviços de terceiros que nos auxiliam em atividades de marketing, análise de desempenho do site e envio de e-mails. Isso inclui, por exemplo, plataformas de anúncios (Google Ads, Facebook Ads) e ferramentas de e-mail marketing.',
      '4. Armazenamento e segurança — As informações fornecidas são armazenadas em plataformas seguras de terceiros. Embora adotemos boas práticas de segurança, não podemos garantir a proteção absoluta contra acessos não autorizados.',
      '5. Direitos do usuário — Atualmente, não oferecemos uma área de gerenciamento automático de dados. Caso queira solicitar a exclusão ou alteração de suas informações, entre em contato conosco pelo e-mail indicado abaixo.',
      '6. Cookies — Poderemos implementar cookies no futuro para fins de estatísticas, personalização de anúncios e melhoria da navegação.',
      '7. Contato — Se tiver dúvidas sobre esta Política de Privacidade ou desejar solicitar informações sobre seus dados, entre em contato pelo e-mail: gilvan@valorizarte.com.br',
    ],
  },
]
