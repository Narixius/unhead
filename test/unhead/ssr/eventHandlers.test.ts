import { renderSSRHead } from '@unhead/ssr'
import { useHead } from 'unhead'
import { describe, it } from 'vitest'
import { createServerHeadWithContext } from '../../util'

describe('ssr event handlers', () => {
  it('basic', async () => {
    const head = createServerHeadWithContext()

    useHead({
      script: [
        {
          src: 'https://js.stripe.com/v3/',
          defer: true,
          // eslint-disable-next-line no-console
          onload: () => console.log('loaded stripe'),
        },
      ],
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<script src="https://js.stripe.com/v3/" defer onload="this.dataset.onloadfired = true"></script>",
        "htmlAttrs": "",
      }
    `)
  })
})
