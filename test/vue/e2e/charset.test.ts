import { renderDOMHead } from '@unhead/dom'
import { renderSSRHead } from '@unhead/ssr'
import { createHead, setHeadInjectionHandler, useHead } from '@unhead/vue'
import { describe, it } from 'vitest'
import type { ReactiveHead } from '@unhead/vue'
import { useDom } from '../../fixtures'

describe('vue e2e charset', () => {
  it('ssr / csr hydration', async () => {
    const AppSchema: ReactiveHead = {
      title: 'My app',
      meta: [
        {
          charset: 'utf-8',
        },
      ],
    }

    const IndexSchema: ReactiveHead = {
      title: 'Home page',
      meta: [
        {
          charset: () => 'utf-8',
        },
      ],
    }

    const AboutSchema: ReactiveHead = {
      title: 'About page',
    }

    // ssr render on the index page
    const ssrHead = createHead()
    setHeadInjectionHandler(() => ssrHead)

    useHead(AppSchema)
    useHead(IndexSchema)

    const data = await renderSSRHead(ssrHead)

    expect(data).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta charset="utf-8">
      <title>Home page</title>",
        "htmlAttrs": "",
      }
    `)

    // mount client side with same data
    const dom = useDom(data)
    const csrHead = createHead({
      document: dom.window.document,
    })
    setHeadInjectionHandler(() => csrHead)

    useHead(AppSchema)
    const index = csrHead.push(IndexSchema)

    await renderDOMHead(csrHead, { document: dom.window.document })

    expect(dom.serialize()).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>Home page</title>
      </head>
      <body>

      <div>
      <h1>hello world</h1>
      </div>



      </body></html>"
    `)

    index.dispose()

    const about = csrHead.push(AboutSchema)

    await renderDOMHead(csrHead, { document: dom.window.document })

    expect(dom.serialize()).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>About page</title>
      </head>
      <body>

      <div>
      <h1>hello world</h1>
      </div>



      </body></html>"
    `)

    about.dispose()

    useHead(IndexSchema)

    await renderDOMHead(csrHead, { document: dom.window.document })

    expect(dom.serialize()).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>Home page</title>
      </head>
      <body>

      <div>
      <h1>hello world</h1>
      </div>



      </body></html>"
    `)
  })
})
