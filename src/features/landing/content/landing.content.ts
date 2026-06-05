export const LANDING_IMAGES = {
  hero: require('../../../../assets/landing/photo-1464802686167-b939a6910659.avif'),
} as const;

export const LANDING_NAV = {
  brand: 'ASTRA',
  cta: 'Entrar',
  aboutLink: 'O que faz',
} as const;

export const LANDING_HERO = {
  badge: 'Mission Control Online',
  headline: ['Cada missão merece um', 'painel de controle'],
  headlineAccent: 'à altura do espaço.',
  primaryCta: 'Entrar no Mission Control',
  secondaryCta: 'Saber mais',
} as const;

export const LANDING_ABOUT_APP = {
  label: 'O que é ASTRA',
  title: 'Mission Control para',
  titleItalic: 'operações espaciais',
  intro:
    'ASTRA é a plataforma mobile e web onde equipas coordenam missões, colónias, alertas e incidentes — com segurança, clareza e decisões em tempo real.',
  features: [
    {
      icon: 'planet' as const,
      title: 'Missões & Colónias',
      description:
        'Planeie, acompanhe e gira missões ativas e o estado de cada colónia num único centro de comando.',
    },
    {
      icon: 'sparkles' as const,
      title: 'Alertas com Prazo',
      description:
        'Crie alertas críticos com deadline, filtre por estado e reconheça eventos antes que escalem.',
    },
    {
      icon: 'shield-checkmark' as const,
      title: 'Segurança em Camadas',
      description:
        'Autenticação segura, MFA, permissões por perfil e RLS em todas as tabelas — zero confiança por defeito.',
    },
    {
      icon: 'time' as const,
      title: 'Incidentes & Audit Log',
      description:
        'Registe incidentes, edite com controlo de acesso e mantenha histórico auditável de cada ação.',
    },
  ],
  cta: 'Aceder à aplicação',
} as const;

export const LANDING_FOOTER = {
  brand: 'ASTRA',
  tagline: 'Mission Control · Global Solution',
  description:
    'Plataforma de operações espaciais para equipas que precisam de visibilidade, segurança e velocidade na tomada de decisão.',
  nav: [
    { label: 'Início', href: 'inicio' },
    { label: 'O que faz', href: 'sobre' },
  ],
  contact: {
    email: 'mission@astra.ops',
    status: 'Sistemas operacionais',
  },
  copyright: `© ${new Date().getFullYear()} ASTRA. Todos os direitos reservados.`,
  loginCta: 'Iniciar sessão',
} as const;
