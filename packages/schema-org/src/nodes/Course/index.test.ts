import { expect } from 'vitest'
import { defineCourse, useSchemaOrg } from '../../'
import { injectSchemaOrg, useSetup } from '../../../test'

describe('defineCourse', () => {
  it('can be registered', async () => {
    await useSetup(async () => {
      useSchemaOrg([
        defineCourse({
          name: 'Introduction to Computer Science and Programming',
          description: 'Introductory CS course laying out the basics.',
          provider: {
            name: 'University of Technology - Eureka',
            sameAs: 'http://www.ut-eureka.edu',
          },
        }),
      ])

      const graphNodes = await injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/course/2c0273",
            "@type": "Course",
            "description": "Introductory CS course laying out the basics.",
            "name": "Introduction to Computer Science and Programming",
            "provider": {
              "@id": "https://example.com/#/schema/organization/4db941",
            },
          },
          {
            "@id": "https://example.com/#/schema/organization/4db941",
            "@type": "Organization",
            "name": "University of Technology - Eureka",
            "sameAs": "http://www.ut-eureka.edu",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
