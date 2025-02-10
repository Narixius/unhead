import { createHead, renderSSRHead } from '@unhead/ssr'
import { useHead } from 'unhead'
import { describe, expect, it } from 'vitest'
import { defineWebSite, useSchemaOrg } from '../../../src/schema-org'

describe('schema.org i18n', () => {
  it('basic websites', async () => {
    const ssrHead = createHead()

    useHead(ssrHead, {
      templateParams: {
        schemaOrg: {
          host: 'https://example.com',
        },
      },
    })

    useSchemaOrg(ssrHead, [
      defineWebSite({
        '@id': '/#en-website',
        'url': '/',
        'inLanguage': 'en',
        'name': 'hello',
        'workTranslation': [
          {
            '@type': 'WebSite',
            '@id': '/fr#website',
          },
        ],
      }),
      defineWebSite({
        '@id': '/fr#fr-website',
        'url': '/fr',
        'inLanguage': 'fr',
        'name': 'bonjour',
        'translationOfWork': {
          '@type': 'WebSite',
          '@id': '/#website',
        },
      }),
    ])

    const data = await renderSSRHead(ssrHead)
    expect(data.bodyTags).toMatchInlineSnapshot(`
      "<script type="application/ld+json" data-hid="schema-org-graph">{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://example.com/#en-website",
            "@type": "WebSite",
            "inLanguage": "en",
            "name": "hello",
            "url": "/",
            "workTranslation": {
              "@id": "https://example.com/fr#website"
            }
          },
          {
            "@id": "https://example.com/fr#fr-website",
            "@type": "WebSite",
            "inLanguage": "fr",
            "name": "bonjour",
            "url": "/fr",
            "translationOfWork": {
              "@id": "https://example.com/#website"
            }
          }
        ]
      }</script>"
    `)
  })
})
