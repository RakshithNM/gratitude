export type WealthCategory = 'survival' | 'health' | 'information' | 'freedom' | 'time'

export type AnswerScore = 0 | 1 | 2

export interface CategoryDefinition {
  id: WealthCategory
  label: string
  shortLabel: string
  description: string
  reflection: string
}

export interface Question {
  id: string
  category: WealthCategory
  prompt: string
  guidance: string
}

export interface GlobalFact {
  id: string
  value: string
  label: string
  context: string
  year: string
  sourceName: string
  sourceUrl: string
  triggerQuestionIds: string[]
}

export interface Source {
  name: string
  detail: string
  url: string
}

export const categories: CategoryDefinition[] = [
  {
    id: 'survival',
    label: 'Survival wealth',
    shortLabel: 'Survival',
    description: 'Water, power, food choice, and a safe place to rest.',
    reflection: 'The foundations that let the rest of life begin.',
  },
  {
    id: 'health',
    label: 'Health wealth',
    shortLabel: 'Health',
    description: 'Care, prevention, and the ability to recover.',
    reflection: 'Support for your body when it needs attention.',
  },
  {
    id: 'information',
    label: 'Information wealth',
    shortLabel: 'Information',
    description: 'Literacy, devices, and meaningful access to knowledge.',
    reflection: 'The tools to learn, connect, and make informed choices.',
  },
  {
    id: 'freedom',
    label: 'Freedom wealth',
    shortLabel: 'Freedom',
    description: 'A voice in your relationships, beliefs, and community.',
    reflection: 'Room to shape a life that feels like your own.',
  },
  {
    id: 'time',
    label: 'Time wealth',
    shortLabel: 'Time',
    description: 'Rest, attention, and space beyond survival or work.',
    reflection: 'The often invisible luxury of unclaimed hours.',
  },
]

export const questions: Question[] = [
  {
    id: 'water',
    category: 'survival',
    prompt: 'Can you get safe drinking water whenever you need it?',
    guidance: 'Think about reliability, distance, and whether you trust it to be safe.',
  },
  {
    id: 'electricity',
    category: 'survival',
    prompt: 'Does your home have reliable electricity?',
    guidance: 'Brief, occasional outages can still count as reliable.',
  },
  {
    id: 'shelter',
    category: 'survival',
    prompt: 'Do you have a place to sleep where you feel physically safe?',
    guidance: 'Answer for your current living situation, not an ideal one.',
  },
  {
    id: 'food-choice',
    category: 'survival',
    prompt: 'Did you have a real choice in what you ate today?',
    guidance: 'A choice between available options, rather than simply whether food existed.',
  },
  {
    id: 'doctor',
    category: 'health',
    prompt: 'If you became sick tomorrow, could you see a qualified health professional?',
    guidance: 'Consider cost, travel, waiting time, and whether care is realistically available.',
  },
  {
    id: 'dentist',
    category: 'health',
    prompt: 'If you developed a severe toothache, could you get dental care?',
    guidance: 'Not necessarily immediately, but before the problem became dangerous.',
  },
  {
    id: 'preventive-care',
    category: 'health',
    prompt: 'Can you access basic vaccines and preventive health checks?',
    guidance: 'Think about services available to you, even if you do not use every one.',
  },
  {
    id: 'literacy',
    category: 'information',
    prompt: 'Can you read and understand this sentence without help?',
    guidance: 'Any language counts. This is about access to written information.',
  },
  {
    id: 'internet',
    category: 'information',
    prompt: 'Can you use the internet regularly on a device you can access?',
    guidance: 'Consider affordability, reliability, restrictions, and privacy.',
  },
  {
    id: 'learning',
    category: 'information',
    prompt: 'Could you learn a new subject online or from books this week?',
    guidance: 'Think about both access to material and enough control to use it.',
  },
  {
    id: 'personal-choice',
    category: 'freedom',
    prompt: 'Do you have a meaningful say in whom you love or marry?',
    guidance: 'Social pressure matters too; answer for what feels realistically possible.',
  },
  {
    id: 'belief',
    category: 'freedom',
    prompt: 'Can you practice a religion, change it, or practice none without fear?',
    guidance: 'Consider legal, family, and community consequences.',
  },
  {
    id: 'civic-voice',
    category: 'freedom',
    prompt: 'Can you safely express a political view and participate in civic life?',
    guidance: 'Voting is one form of participation, but not the only one.',
  },
  {
    id: 'free-time',
    category: 'time',
    prompt: 'Do you usually have some time each week that belongs only to you?',
    guidance: 'Time for rest, a hobby, a walk, a book, or simply doing nothing.',
  },
  {
    id: 'small-luxury',
    category: 'time',
    prompt: 'Could you spend a little time or money on something purely for enjoyment?',
    guidance: 'The amount does not matter. What matters is having a genuine margin for it.',
  },
]

export const answerOptions: { score: AnswerScore; label: string; detail: string }[] = [
  { score: 2, label: 'Yes, reliably', detail: 'This is a dependable part of my life.' },
  { score: 1, label: 'Sometimes', detail: 'It is available, but limited or uncertain.' },
  { score: 0, label: 'Not right now', detail: 'This is currently out of reach.' },
]

export const globalFacts: GlobalFact[] = [
  {
    id: 'water',
    value: '2.2 billion',
    label: 'people lacked safely managed drinking water',
    context: 'Safe water means it is on premises, available when needed, and free from contamination.',
    year: '2022 data',
    sourceName: 'World Health Organization',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
    triggerQuestionIds: ['water'],
  },
  {
    id: 'electricity',
    value: '666 million',
    label: 'people lived without basic electricity access',
    context: 'Almost 92% of the world had access, but the remaining gap was highly concentrated.',
    year: '2023 data',
    sourceName: 'World Bank, Tracking SDG 7',
    sourceUrl:
      'https://www.worldbank.org/en/news/press-release/2025/06/25/energy-access-has-improved-yet-international-financial-support-still-needed-to-boost-progress-and-address-disparities',
    triggerQuestionIds: ['electricity'],
  },
  {
    id: 'health',
    value: '4.5 billion',
    label: 'people were not fully covered by essential health services',
    context: 'Coverage includes a range of essential preventive, treatment, and care services.',
    year: '2021 data',
    sourceName: 'WHO and World Bank',
    sourceUrl:
      'https://www.who.int/news/item/18-09-2023-billions-left-behind-on-the-path-to-universal-health-coverage',
    triggerQuestionIds: ['doctor', 'dentist', 'preventive-care'],
  },
  {
    id: 'internet',
    value: '2.6 billion',
    label: 'people remained offline worldwide',
    context: 'That was roughly one-third of the global population, with the largest gaps in rural areas.',
    year: '2024 estimate',
    sourceName: 'International Telecommunication Union',
    sourceUrl: 'https://www.itu.int/en/mediacentre/Pages/PR-2024-11-27-facts-and-figures.aspx',
    triggerQuestionIds: ['internet', 'learning'],
  },
]

export const sources: Source[] = [
  {
    name: 'WHO: Drinking-water fact sheet',
    detail: 'Safely managed drinking-water coverage, using 2022 data.',
    url: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
  },
  {
    name: 'Tracking SDG 7: Energy Progress Report 2025',
    detail: 'Global electricity access, using 2023 data.',
    url: 'https://www.worldbank.org/en/news/press-release/2025/06/25/energy-access-has-improved-yet-international-financial-support-still-needed-to-boost-progress-and-address-disparities',
  },
  {
    name: 'WHO and World Bank: Universal health coverage',
    detail: 'Essential health service coverage, using 2021 data.',
    url: 'https://www.who.int/news/item/18-09-2023-billions-left-behind-on-the-path-to-universal-health-coverage',
  },
  {
    name: 'ITU: Facts and Figures 2024',
    detail: 'Global internet use estimates for 2024.',
    url: 'https://www.itu.int/en/mediacentre/Pages/PR-2024-11-27-facts-and-figures.aspx',
  },
]
