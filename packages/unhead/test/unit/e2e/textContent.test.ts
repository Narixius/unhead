import { useHead } from 'unhead'
import { renderDOMHead } from 'unhead/client'
import { renderSSRHead } from 'unhead/server'
import { describe, it } from 'vitest'
import { createClientHeadWithContext, useDom } from '../../util'

describe('unhead e2e textContent', () => {
  it('pretend json', async () => {
    // scenario: we are injecting root head schema which will not have a hydration step,
    // but we are also injecting a child head schema which will have a hydration step
    const ssrHead = createClientHeadWithContext()
    // i.e App.vue
    useHead(ssrHead, {
      style: [
        {
          textContent: '.test { color: red; }',
        },
      ],
    })

    const data = await renderSSRHead(ssrHead)

    expect(data).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<style>.test { color: red; }</style>",
        "htmlAttrs": "",
      }
    `)

    const dom = useDom(data)

    const csrHead = createClientHeadWithContext()
    csrHead.push({
      style: [
        {
          textContent: '.test { color: red; }',
        },
      ],
    })

    await renderDOMHead(csrHead, { document: dom.window.document })

    expect(dom.serialize()).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html><head>
      <style>.test { color: red; }</style>
      </head>
      <body>

      <div>
      <h1>hello world</h1>
      </div>



      </body></html>"
    `)
  })
})
