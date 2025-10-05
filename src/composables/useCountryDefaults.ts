import { ref, computed } from 'vue'

export interface ContentGuideline {
  id: string
  name: string
  description: string
  category: 'safety' | 'legal' | 'cultural' | 'age'
  enabled: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface RatingLevel {
  id: string
  name: string
  description: string
  ageRestriction?: number
  color: string
  detailedCriteria?: {
    themeContent?: string
    violence?: string
    nuditySexual?: string
    drugs?: string
    horror?: string
    language?: string
    dangerousBehavior?: string
  }
}

export interface RatingSystem {
  id: string
  name: string
  country: string
  authority: string
  levels: RatingLevel[]
  reference: string
  effectiveDate: string
}

export interface CountryDefaults {
  country: string
  ratingSystem: string
  guidelines: ContentGuideline[]
  reference: {
    title: string
    source: string
    date: string
    url?: string
    details?: string
  }
}

// Vietnam defaults based on Thông tư số 05/2023/TT-BVHTTDL (Complete Official Document)
const vietnamDefaults: CountryDefaults = {
  country: 'Vietnam',
  ratingSystem: 'vietnam',
  guidelines: [
    // Official 7 Criteria from Vietnam Film Classification Regulation
    {
      id: 'themeContent',
      name: 'Chủ đề, nội dung (Theme & Content)',
      description:
        "Evaluate content impact on emotional, ideological, aesthetic formation and understanding for different age groups. Must not cause distorted perception of moral values, family relationships, ethnicity, religion, children's rights, discrimination, and sensitive topics.",
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'violence',
      name: 'Bạo lực (Violence)',
      description:
        'Detect realistic violence situations, presence of children/women in violent scenes, animal abuse, violence encouragement, characters enjoying pain, glorifying violence, gratuitous violence, detailed crime and violence with weapons, painful/bloody images.',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'nuditySexual',
      name: 'Khỏa thân, tình dục (Nudity & Sexual Content)',
      description:
        'Identify nudity and sexual activities not for pornographic purposes, sexual stimulation behaviors, sexual violence including rape and forced sexual violence, direct/indirect portrayal methods, frequency of sexual content, age of characters in sexual scenes.',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'drugs',
      name: 'Ma túy, chất kích thích (Drugs & Substances)',
      description:
        'Detect drug use, stimulants, and addictive substances. Must not guide production, illegal use, advertising, marketing, buying/selling, transportation, storage or other illegal purposes except when condemning such behavior.',
      category: 'legal',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'horror',
      name: 'Kinh dị (Horror)',
      description:
        "Identify horror elements causing tension, stimulation, or threatening feelings affecting viewers' psychology and health. Assess impact of realistic, stimulating, and continuous horror sound/image effects, overall film atmosphere, duration and frequency of horror scenes.",
      category: 'safety',
      enabled: true,
      priority: 'medium',
    },
    {
      id: 'language',
      name: 'Ngôn ngữ thô tục (Crude Language)',
      description:
        'Detect rude gestures, images, sounds, crude language, insults, vulgarity, profanity including slang. Assess vulgarity level, context usage, community sensitivity, cultural and social aspects related to crude language use, dialogue stimulating sexual abuse interest, discriminatory language violating human rights.',
      category: 'age',
      enabled: true,
      priority: 'medium',
    },
    {
      id: 'dangerousBehavior',
      name: 'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)',
      description:
        'Identify detailed descriptions of crime techniques, violence, weapon usage instructions for easily accessible weapons like knives, sharp objects, harmful items. Detect direct/indirect encouragement of imitable actions like drug use, weapons, suicide, self-harm, school violence, or other illegal activities.',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
  ],
  reference: {
    title:
      'Thông tư số 05/2023/TT-BVHTTDL quy định tiêu chí phân loại phim và thực hiện hiển thị mức phân loại phim, cảnh báo',
    source: 'Bộ Văn hóa, Thể thao và Du lịch (Ministry of Culture, Sports and Tourism)',
    date: '2023-05-20',
    url: 'https://bvhttdl.gov.vn/',
    details:
      'Complete official regulation with detailed criteria for each rating level (P, K, T13, T16, T18, C) and comprehensive guidelines for content classification based on 7 main criteria.',
  },
}

// US defaults (MPAA)
const usDefaults: CountryDefaults = {
  country: 'United States',
  ratingSystem: 'mpaa',
  guidelines: [
    {
      id: 'violence',
      name: 'Violent or Graphic Content',
      description: 'Detect scenes with violence, gore, or disturbing imagery',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'adult',
      name: 'Adult & Explicit Content',
      description: 'Identify sexual content, nudity, and explicit material',
      category: 'age',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'language',
      name: 'Strong Language',
      description: 'Detect profanity, offensive language, or inappropriate dialogue',
      category: 'age',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'drugUse',
      name: 'Drug Use & Substance Abuse',
      description: 'Detect depiction of illegal drug use or substance abuse',
      category: 'legal',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'hateSpeech',
      name: 'Hate Speech & Discrimination',
      description: 'Detect content that promotes hatred, violence, or discrimination',
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'harassment',
      name: 'Harassment & Bullying',
      description: 'Identify content that harasses, bullies, or intimidates individuals',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'selfHarm',
      name: 'Self-Harm & Suicide',
      description: 'Detect content depicting or promoting self-harm or suicide',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'dangerousActivities',
      name: 'Dangerous Activities',
      description: 'Identify risky behaviors that could be imitated by viewers',
      category: 'safety',
      enabled: true,
      priority: 'medium',
    },
  ],
  reference: {
    title: 'Motion Picture Association of America (MPAA) Rating System',
    source: 'Motion Picture Association of America',
    date: '1968',
    url: 'https://www.mpaa.org/',
  },
}

// UK defaults (BBFC)
const ukDefaults: CountryDefaults = {
  country: 'United Kingdom',
  ratingSystem: 'bbfc',
  guidelines: [
    {
      id: 'violence',
      name: 'Violent or Graphic Content',
      description: 'Detect scenes with violence, gore, or disturbing imagery',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'adult',
      name: 'Adult & Explicit Content',
      description: 'Identify sexual content, nudity, and explicit material',
      category: 'age',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'language',
      name: 'Strong Language',
      description: 'Detect profanity, offensive language, or inappropriate dialogue',
      category: 'age',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'drugUse',
      name: 'Drug Use & Substance Abuse',
      description: 'Detect depiction of illegal drug use or substance abuse',
      category: 'legal',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'hateSpeech',
      name: 'Hate Speech & Discrimination',
      description: 'Detect content that promotes hatred, violence, or discrimination',
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'harassment',
      name: 'Harassment & Bullying',
      description: 'Identify content that harasses, bullies, or intimidates individuals',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'selfHarm',
      name: 'Self-Harm & Suicide',
      description: 'Detect content depicting or promoting self-harm or suicide',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'dangerousActivities',
      name: 'Dangerous Activities',
      description: 'Identify risky behaviors that could be imitated by viewers',
      category: 'safety',
      enabled: true,
      priority: 'medium',
    },
    {
      id: 'discrimination',
      name: 'Discrimination',
      description: 'Detect content that discriminates against protected characteristics',
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
  ],
  reference: {
    title: 'British Board of Film Classification (BBFC) Guidelines',
    source: 'British Board of Film Classification',
    date: '1912',
    url: 'https://www.bbfc.co.uk/',
  },
}

// Germany defaults (FSK)
const germanyDefaults: CountryDefaults = {
  country: 'Germany',
  ratingSystem: 'fsk',
  guidelines: [
    {
      id: 'violence',
      name: 'Violent or Graphic Content',
      description: 'Detect scenes with violence, gore, or disturbing imagery',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'adult',
      name: 'Adult & Explicit Content',
      description: 'Identify sexual content, nudity, and explicit material',
      category: 'age',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'language',
      name: 'Strong Language',
      description: 'Detect profanity, offensive language, or inappropriate dialogue',
      category: 'age',
      enabled: true,
      priority: 'medium',
    },
    {
      id: 'drugUse',
      name: 'Drug Use & Substance Abuse',
      description: 'Detect depiction of illegal drug use or substance abuse',
      category: 'legal',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'hateSpeech',
      name: 'Hate Speech & Discrimination',
      description: 'Detect content that promotes hatred, violence, or discrimination',
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'harassment',
      name: 'Harassment & Bullying',
      description: 'Identify content that harasses, bullies, or intimidates individuals',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'selfHarm',
      name: 'Self-Harm & Suicide',
      description: 'Detect content depicting or promoting self-harm or suicide',
      category: 'safety',
      enabled: true,
      priority: 'high',
    },
    {
      id: 'dangerousActivities',
      name: 'Dangerous Activities',
      description: 'Identify risky behaviors that could be imitated by viewers',
      category: 'safety',
      enabled: true,
      priority: 'medium',
    },
    {
      id: 'naziContent',
      name: 'Nazi Content',
      description: 'Detect content related to Nazi ideology or symbols',
      category: 'cultural',
      enabled: true,
      priority: 'high',
    },
  ],
  reference: {
    title: 'Freiwillige Selbstkontrolle der Filmwirtschaft (FSK) Guidelines',
    source: 'Freiwillige Selbstkontrolle der Filmwirtschaft',
    date: '1949',
    url: 'https://www.fsk.de/',
  },
}

// Vietnam Rating System with Detailed Criteria
export const vietnamRatingSystem: RatingSystem = {
  id: 'vietnam',
  name: 'Vietnam Film Classification',
  country: 'Vietnam',
  authority: 'Bộ Văn hóa, Thể thao và Du lịch (Ministry of Culture, Sports and Tourism)',
  reference: 'Thông tư số 05/2023/TT-BVHTTDL',
  effectiveDate: '2023-05-20',
  levels: [
    {
      id: 'P',
      name: 'P - Phổ cập',
      description: 'Suitable for all ages',
      color: 'green',
      detailedCriteria: {
        themeContent:
          'Educational, entertaining content encouraging positive moral values and social relationships.',
        violence:
          'No threatening, intimidating, or beating scenes except when appropriate to film content and described at light level.',
        nuditySexual:
          'No nudity images, no sexual activity descriptions. Special content like historical, war documentaries may have rear nudity at light level.',
        drugs: 'No drug use, stimulants, or addictive substances.',
        horror: 'No horror images, sounds, or language.',
        language: 'No crude language, sounds, or images.',
        dangerousBehavior:
          'No encouraging or stimulating imitable behaviors like drug use, suicide, school violence, weapons, or illegal activities.',
      },
    },
    {
      id: 'K',
      name: 'K - Kèm theo',
      description: 'Viewers under 13 admitted when accompanied by parents or guardians',
      color: 'blue',
      detailedCriteria: {
        themeContent:
          'Content requiring parental guidance described at light level with minimal impact on viewers.',
        violence:
          'Violence described at light level, not detailed, not frequent, with light impact and appropriate to film content.',
        nuditySexual:
          'May have rear nudity but not detailed, not frequent, not prolonged, and not related to sexual activity.',
        drugs:
          'May show drug use but for condemnation purposes or educational messages, described subtly and appropriate to content.',
        horror:
          'Horror elements at light level, not detailed, not prolonged, not frequent, with minimal impact and reassuring results.',
        language:
          'May have crude language at light level, not frequent, appropriate to content, such as slang used humorously.',
        dangerousBehavior:
          'No encouraging imitable behaviors except when appropriate to content with clear educational messages.',
      },
    },
    {
      id: 'T13',
      name: 'T13 - Tuổi 13',
      description: 'Not suitable for viewers under 13 years old',
      color: 'yellow',
      detailedCriteria: {
        themeContent:
          'Content not causing distorted perception, psychological disturbance, or negative impact on character formation for viewers 13+.',
        violence:
          'Violence at light level, not detailed, not frequent, with light impact and appropriate to film content. No detailed wound descriptions.',
        nuditySexual:
          'May have rear nudity at light level, not detailed, not prolonged, not frequent, not related to sexual activity.',
        drugs:
          'May show drug use for condemnation or educational purposes, at light level, not detailed, not frequent, appropriate to content.',
        horror:
          'Horror at medium level, not detailed, not frequent, creating light threatening feeling with reassuring results.',
        language: 'Same as K level.',
        dangerousBehavior:
          'No detailed descriptions of dangerous behaviors that viewers 13+ could imitate, except when shown safely or humorously.',
      },
    },
    {
      id: 'T16',
      name: 'T16 - Tuổi 16',
      description: 'Not suitable for viewers under 16 years old',
      color: 'orange',
      detailedCriteria: {
        themeContent:
          "Addresses adult issues like politics, society, psychology, crime but appropriate for 16+ viewers' cognition and psychology.",
        violence:
          'Violence like killing, causing pain, injury, bleeding at light level, not frequent, not prolonged, causing tension and medium impact.',
        nuditySexual:
          'Nudity at medium level, not frequent, not prolonged, not close-up, not detailed genitals, not related to sexual activity.',
        drugs:
          'Drug-related content not detailed, not frequent, not prolonged, appropriate to content. No promotion or detailed guidance.',
        horror:
          'Horror at strong level, not prolonged, not deeply exploited, causing medium tension or threatening feeling.',
        language:
          'Crude language at medium level but not frequent, appropriate to content. Antagonists may use profanity without harming individuals.',
        dangerousBehavior:
          'May show imitable behaviors at light level, not detailed, not frequent, with light impact and condemnation messages.',
      },
    },
    {
      id: 'T18',
      name: 'T18 - Tuổi 18',
      description: 'Not suitable for viewers under 18 years old',
      color: 'red',
      detailedCriteria: {
        themeContent:
          'Addresses adult issues, may be described at strong level, detailed but not prolonged, not frequent, appropriate to content.',
        violence:
          'Violence from strong to excessive level, may be strong but not prolonged, medium frequency, appropriate to film genre.',
        nuditySexual:
          'Full body nudity at medium level, not prolonged, not close-up, not detailed genitals, appropriate to content but not exploiting nudity.',
        drugs:
          'Same as T16 level. No detailed drug trafficking, production, storage except when condemning such behavior.',
        horror:
          'Horror, terrifying, frightening, tense content at strong level with continuous threatening feeling but not prolonged, not excessive psychological impact.',
        language:
          'Crude language stronger than T16 but not harming individuals or communities, not used for sexual harassment.',
        dangerousBehavior:
          'Dangerous imitable content must be thoroughly handled with educational messages and prevention. Not detailed, not frequent, medium impact.',
      },
    },
    {
      id: 'C',
      name: 'C - Cấm',
      description: 'Prohibited from screening',
      color: 'red-900',
      detailedCriteria: {
        themeContent:
          'Violates Article 9 of Cinema Law. Prohibited content and behaviors in cinema activities.',
        violence: 'All criteria described at excessive level.',
        nuditySexual: 'All criteria described at excessive level.',
        drugs: 'All criteria described at excessive level.',
        horror: 'All criteria described at excessive level.',
        language: 'All criteria described at excessive level.',
        dangerousBehavior: 'All criteria described at excessive level.',
      },
    },
  ],
}

// All country defaults
const countryDefaults: Record<string, CountryDefaults> = {
  vietnam: vietnamDefaults,
  us: usDefaults,
  uk: ukDefaults,
  germany: germanyDefaults,
}

export function useCountryDefaults() {
  const selectedCountry = ref<string>('vietnam')

  const currentDefaults = computed(() => {
    return countryDefaults[selectedCountry.value] || countryDefaults.vietnam
  })

  const availableCountries = computed(() => {
    return Object.keys(countryDefaults).map((key) => ({
      id: key,
      name: countryDefaults[key].country,
      ratingSystem: countryDefaults[key].ratingSystem,
    }))
  })

  const getGuidelinesForCountry = (countryId: string) => {
    return countryDefaults[countryId]?.guidelines || []
  }

  const getRatingSystemForCountry = (countryId: string) => {
    return countryDefaults[countryId]?.ratingSystem || 'vietnam'
  }

  const getReferenceForCountry = (countryId: string) => {
    return countryDefaults[countryId]?.reference || null
  }

  const setCountry = (countryId: string) => {
    if (countryDefaults[countryId]) {
      selectedCountry.value = countryId
    }
  }

  const getGuidelinesByCategory = (countryId: string) => {
    const guidelines = getGuidelinesForCountry(countryId)
    return {
      safety: guidelines.filter((g) => g.category === 'safety'),
      legal: guidelines.filter((g) => g.category === 'legal'),
      cultural: guidelines.filter((g) => g.category === 'cultural'),
      age: guidelines.filter((g) => g.category === 'age'),
    }
  }

  const getHighPriorityGuidelines = (countryId: string) => {
    return getGuidelinesForCountry(countryId).filter((g) => g.priority === 'high')
  }

  const getDetailedRatingSystem = (countryId: string) => {
    if (countryId === 'vietnam') {
      return vietnamRatingSystem
    }
    return null
  }

  return {
    selectedCountry,
    currentDefaults,
    availableCountries,
    getGuidelinesForCountry,
    getRatingSystemForCountry,
    getReferenceForCountry,
    setCountry,
    getGuidelinesByCategory,
    getHighPriorityGuidelines,
    getDetailedRatingSystem,
    countryDefaults,
    vietnamRatingSystem,
  }
}
