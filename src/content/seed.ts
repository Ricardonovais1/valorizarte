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
 * cada descrição pelo Studio antes da publicação. Os posts do blog usam
 * o conteúdo real (verbatim) de três posts publicados, coletado via a
 * REST API do WordPress, como demonstração de que a conversão para
 * Portable Text funciona neste conteúdo específico.
 */

export type SeedPost = {
  _id: string
  title: string
  slug: string
  excerpt: string
  categoryTitle: string
  categorySlug: string
  publishedAt: string
  body: string[] // parágrafos simples; o app converte para blocos
}

export type SeedService = {
  _id: string
  title: string
  slug: string
  audience: 'empresas' | 'profissionais'
  summary: string
  image?: string
  highlights?: string[]
  body?: string[] // parágrafos simples; o app converte para blocos
}

export const seedSiteSettings = {
  siteName: 'Valorizarte',
  tagline: 'A VALORIZARTE desenvolve serviços personalizados de acordo com as necessidades de sua empresa.',
  phone: '31 99105-0060',
  email: 'gilvan@valorizarte.com.br',
  social: {
    instagram: 'https://instagram.com/gilvansilva.valorizarte',
    linkedin: 'https://www.linkedin.com/in/gilvan-silva/',
    facebook: undefined,
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
}

export const seedNavigation = [
  { label: 'Início', href: '/' },
  { label: 'Quem Somos', href: '/quemsomos' },
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
    href: '/empresas',
    children: [
      { label: 'Coaching', href: '/empresas/coaching' },
      { label: 'Assessoria', href: '/empresas/assessoria' },
      { label: 'Mentoring', href: '/empresas/mentoring' },
      { label: 'Treinamentos Abertos', href: '/empresas/treinamentos-abertos' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Mídia', href: '/midia' },
]

export const seedServices: SeedService[] = [
  {
    _id: 'conselho-consultivo',
    title: 'Conselho Consultivo',
    slug: 'conselho-consultivo',
    audience: 'empresas',
    summary:
      'Estrutura de governança para empresas que precisam de um olhar externo e experiente sobre suas decisões estratégicas.',
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
    image: '/images/services/palestras-workshops-treinamentos.png',
    body: [
      'Oferecemos uma ampla variedade de palestras, workshops e treinamentos voltados para o desenvolvimento profissional e organizacional. Nossos temas abrangem desde liderança e produtividade até inovação e inteligência emocional, sempre com foco em resultados e na valorização do capital humano.',
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
  },
  {
    _id: 'consultoria-empresarial',
    title: 'Consultoria Empresarial',
    slug: 'consultoria-empresarial',
    audience: 'empresas',
    summary: 'Soluções Estratégicas para o Crescimento e a Eficiência do seu Negócio',
    image: '/images/services/consultoria-empresarial.png',
    body: [
      'Tem como objetivo promover o desenvolvimento empresarial pelo uso de técnicas de melhoria contínua de processos, com os objetivos de alavancar o negócio, reduzir custos, elevar a lucratividade e aumentar a satisfação dos clientes. Na gestão de processos com foco em resultados são utilizadas Metodologias Ágeis.',
      '## Planejamento Estratégico',
      'O Planejamento Estratégico visa a adaptação a mercados em contínua mudança, buscando manter uma flexibilidade viável de seus objetivos, habilidades e recursos enquanto mantém um compromisso com o lucro, o crescimento e sua missão organizacional.',
      '## Inovação e Competitividade',
      'A Consultoria em Inovação e Competitividade tem como objetivo levar a empresa para um novo patamar através da implantação de um Programa de Gestão Estratégica da Inovação e do desenvolvimento das habilidades criativas de seus colaboradores, propiciando a construção de uma Cultura para Inovação disseminada na organização, com vistas a propiciar um aumento na produtividade e na rentabilidade da empresa.',
    ],
  },
  {
    _id: 'coaching-mentoring-empresas',
    title: 'Coaching e Mentoring',
    slug: 'coaching-mentoring',
    audience: 'empresas',
    summary: 'Impulsionando Líderes e Equipes para Alta Performance Empresarial',
    image: '/images/services/coaching-mentoring.png',
    body: [
      '## Coaching',
      '**Executivo · De Liderança · De Equipes · De Negócios.** O Coaching Executivo visa desenvolver nos líderes as competências necessárias para que possam desempenhar suas funções com eficiência, construir equipes de alta performance e se preparar para o processo de sucessão.',
      '## Mentoring',
      '**Mentoria interna · Sucessão.** Implantação do Programa de Mentoria Organizacional Interna: visa o desenvolvimento de líderes e colaboradores, com o intuito de preparar e reter talentos, aumentar a integração entre as áreas e facilitar a gestão do conhecimento, principalmente tácito e empírico, em poder dos mais seniores.',
    ],
  },
  {
    _id: 'programa-aposentadoria',
    title: 'Programa de Aposentadoria',
    slug: 'programa-aposentadoria',
    audience: 'empresas',
    summary: 'Plantando hoje a paz de amanhã',
    image: '/images/services/programa-aposentadoria.png',
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
    image: '/images/services/coaching.png',
    body: [
      '**De Carreira · Vocacional · De Vida.** O processo de Coaching de Carreira proporciona uma clareza quanto a opções profissionais a serem adotadas para alcance dos objetivos, trabalhando cenários possíveis através da construção da visão de futuro e do Planejamento de Carreira, possibilitando o desenvolvimento tanto pessoal quanto profissional.',
    ],
  },
  {
    _id: 'assessoria',
    title: 'Assessoria',
    slug: 'assessoria',
    audience: 'profissionais',
    summary: 'Redirecionamento Profissional Estratégico para Novas Oportunidades e Crescimento',
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

export const seedPosts: SeedPost[] = [
  {
    _id: 'seed-marca-pessoal',
    title: 'Marca pessoal – o ativo invisível que define seu sucesso',
    slug: 'marca-pessoal-o-ativo-invisivel-que-define-seu-sucesso',
    excerpt:
      'Você já parou para pensar o quanto seu nome representa no mercado profissional? Sua marca pessoal é mais valiosa do que qualquer linha do seu currículo.',
    categoryTitle: 'Carreira',
    categorySlug: 'carreira',
    publishedAt: '2025-08-28T21:05:13.000Z',
    body: [
      'Você já parou para pensar o quanto seu nome representa no mercado profissional? No mundo de hoje, onde o digital dita o ritmo das conexões e decisões, sua marca pessoal é mais valiosa do que qualquer linha do seu currículo. Ela é o seu cartão de visitas silencioso. É a narrativa que se espalha quando você não está presente — e que, muitas vezes, decide se portas se abrem ou não.',
      'Durante anos, acompanhei líderes brilhantes, com trajetórias sólidas, perderem espaço simplesmente porque eram desconhecidos no ambiente digital. Ao mesmo tempo, vi profissionais medianos conquistando palco, contratos e influência. Não porque eram melhores, mas porque as pessoas os percebem como tal.',
      'Foi a partir dessa inquietação que venho mergulhando de forma estratégica na construção da minha marca pessoal, tornando minha presença digital um ativo de alto valor agregado para minha carreira profissional.',
      'Este artigo é para você que sabe que precisa ser visto, lembrado e desejado no seu mercado, mas ainda não descobriu como construir esse espaço com autenticidade e propósito.',
    ],
  },
  {
    _id: 'seed-transformacao-digital',
    title: 'Transformação Digital: desafios e soluções',
    slug: 'transformacao-digital-desafios-e-solucoes',
    excerpt:
      'Transformação digital tornou-se um termo que todo mundo repete, mas poucos compreendem em profundidade. O problema não está nas ferramentas, está na forma de pensar.',
    categoryTitle: 'Inovação',
    categorySlug: 'inovacao',
    publishedAt: '2025-09-11T13:21:19.000Z',
    body: [
      'Transformação digital tornou-se um daqueles termos que todo mundo repete, mas poucos compreendem em profundidade. No mundo corporativo, ela aparece como promessa de eficiência, agilidade e modernização. Mas na prática, muitas empresas ainda confundem digitalizar com transformar. O problema não está nas ferramentas, está na forma de pensar. Está no modelo mental que sustenta — ou bloqueia — qualquer tentativa real de inovação.',
      'Neste artigo, compartilho experiências reais vividas em campo, onde acompanhei líderes e equipes enfrentando as dores e delícias de mudar. Mais do que conceitos, trago provocações e caminhos práticos para ajudar instituições a evoluírem com consistência e propósito.',
      'Ao longo de minha trajetória, pude confirmar que transformação digital tem mais a ver com pessoas do que com sistemas. Com mentalidade, muito mais do que com dispositivos. E com cultura organizacional, antes mesmo de processos.',
    ],
  },
  {
    _id: 'seed-aamar',
    title: 'AAMAR – Associação Amar e Renascer comemora seus 20 anos resgatando vidas',
    slug: 'aamar-associacao-amar-e-renascer-comemora-seus-20-anos-resgatando-vidas',
    excerpt:
      'Associação vive de doações e tem alto índice de recuperação de dependentes de substâncias químicas e de bebidas alcoólicas.',
    categoryTitle: 'Beneficência',
    categorySlug: 'beneficencia',
    publishedAt: '2025-12-19T19:43:48.000Z',
    body: [
      'A AAMAR – Associação Amar e Renascer é uma organização de sociedade civil, sem fins lucrativos, atuando como Comunidade Terapêutica, voltada para a prevenção, tratamento, desintoxicação, recuperação e ressocialização de dependentes de álcool e de outras drogas.',
      'A missão da AAMAR é proporcionar uma oportunidade de renovação para aqueles que enfrentam os desafios da dependência química, apoiando-os por meio de um programa terapêutico sólido e multidisciplinar.',
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
