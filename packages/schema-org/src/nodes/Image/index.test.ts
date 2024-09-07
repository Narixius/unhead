import { expect } from 'vitest'
import { defineImage, useSchemaOrg } from '../../'
import { injectSchemaOrg, useSetup } from '../../../.test'

describe('defineImage', () => {
  it('can be registered', async () => {
    await useSetup(async () => {
      useSchemaOrg([
        defineImage({
          url: '/image.png',
        }),
      ])

      const graphNodes = await injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/4f5963e",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/image.png",
          },
        ]
      `)
    })
  })
})
