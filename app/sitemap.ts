import { MetadataRoute } from 'next'
import { languages } from '@/i18n/config'
import { SUPPORTED_GUIDE_LENGTHS } from '@/lib/guide-lengths'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://termo-jogo.com'
  const currentDate = new Date().toISOString()

  const basePages = [
    {
      url: '',
      priority: 1.0,
      changeFrequency: 'weekly' as const,
    },
    {
      url: 'guia-termo',
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    },
    {
      url: 'buscador-termo',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: 'privacy',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
    {
      url: 'terms',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
    {
      url: 'dados',
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    },
    {
      url: 'atualizacoes',
      priority: 0.65,
      changeFrequency: 'weekly' as const,
    },
    {
      url: 'sobre',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
  ]

  const lengthPages = Array.from({ length: 9 }, (_, index) => index + 3).flatMap((length) => [
    {
      url: `termo-${length}-letras`,
      priority: 0.9,
      changeFrequency: 'weekly' as const,
    },
    {
      url: `buscador-termo-${length}-letras`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    },
  ])

  const guidePages = SUPPORTED_GUIDE_LENGTHS.map((length) => ({
    url: `guia-termo-${length}-letras`,
    priority: 0.75,
    changeFrequency: 'monthly' as const,
  }))

  const pages = [...basePages, ...lengthPages, ...guidePages]

  const sitemap: MetadataRoute.Sitemap = []

  pages.forEach((page) => {
    languages.forEach((language) => {
      let url: string

      if (page.url === '') {
        if (language.value === 'pt') {
          url = baseUrl
        } else {
          url = `${baseUrl}/${language.value}`
        }
      } else {
        if (language.value === 'pt') {
          url = `${baseUrl}/${page.url}`
        } else {
          url = `${baseUrl}/${language.value}/${page.url}`
        }
      }

      sitemap.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    })
  })

  return sitemap
}
