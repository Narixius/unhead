import { useHead, useSeoMeta } from 'unhead'
import { renderSSRHead } from 'unhead/server'
import { transformHtmlTemplate } from 'unhead/server/transformHtmlTemplate'
import { extractTagsFromHtml } from 'unhead/server/util/extractTagsFromHtml'
import { describe, it } from 'vitest'
import { basicSchema } from '../../fixtures'
import { createServerHeadWithContext } from '../../util'

describe('ssr', () => {
  it('basic', async () => {
    const head = createServerHeadWithContext()

    head.push({
      ...basicSchema,
      htmlAttrs: {
        lang: 'de',
      },
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": " class="dark"",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta charset="utf-8">
      <script src="https://cdn.example.com/script.js"></script>
      <link rel="icon" type="image/x-icon" href="https://cdn.example.com/favicon.ico">",
        "htmlAttrs": " lang="de"",
      }
    `)
  })

  it('number title', async () => {
    const head = createServerHeadWithContext()

    head.push({
      title: 12345,
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<title>12345</title>",
        "htmlAttrs": "",
      }
    `)
  })

  it('object title', async () => {
    const head = createServerHeadWithContext()

    head.push({
      title: {
        foo: 'bar',
      },
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<title foo="bar"></title>",
        "htmlAttrs": "",
      }
    `)
  })

  it ('boolean props', async () => {
    const head = createServerHeadWithContext()

    head.push({
      script: [
        {
          defer: true,
          async: false,
          src: 'https://cdn.example.com/script.js',
        },
      ],
    })

    const ctx = await renderSSRHead(head)

    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<script defer src="https://cdn.example.com/script.js"></script>",
        "htmlAttrs": "",
      }
    `)
  })

  it('remove break lines', async () => {
    const head = createServerHeadWithContext()

    head.push({
      script: [
        {
          src: 'https://cdn.example.com/script-1.js',
        },
        {
          src: 'https://cdn.example.com/script-2.js',
        },
      ],
    })

    const ctx = await renderSSRHead(head, { omitLineBreaks: true })

    expect(ctx).toMatchInlineSnapshot(`
    {
      "bodyAttrs": "",
      "bodyTags": "",
      "bodyTagsOpen": "",
      "headTags": "<script src="https://cdn.example.com/script-1.js"></script><script src="https://cdn.example.com/script-2.js"></script>",
      "htmlAttrs": "",
    }
  `)
  })

  it('useSeoMeta', async () => {
    const head = createServerHeadWithContext()

    useSeoMeta(head, {
      title: 'page name',
      titleTemplate: '%s - site',
      charset: 'utf-8',
      description: 'test',
      ogLocaleAlternate: ['fr', 'zh'],
      twitterCard: 'summary_large_image',
      ogImage: [
        {
          url: 'https://example.com/image.png',
          width: 800,
          height: 600,
          alt: 'My amazing image',
        },
      ],
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta charset="utf-8">
      <title>page name - site</title>
      <meta property="og:locale:alternate" content="fr">
      <meta property="og:locale:alternate" content="zh">
      <meta property="og:image" content="https://example.com/image.png">
      <meta property="og:image:alt" content="My amazing image">
      <meta property="og:image:width" content="800">
      <meta property="og:image:height" content="600">
      <meta name="description" content="test">
      <meta name="twitter:card" content="summary_large_image">",
        "htmlAttrs": "",
      }
    `)
  })

  it('useSeoMeta alt', async () => {
    const head = createServerHeadWithContext()

    useSeoMeta(head, {
      description: 'This is my amazing site, let me tell you all about it.',
      ogDescription: 'This is my amazing site, let me tell you all about it.',
      ogTitle: 'My Amazing Site',
      ogImage: 'https://example.com/image.png',
      twitterCard: 'summary_large_image',
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta name="description" content="This is my amazing site, let me tell you all about it.">
      <meta property="og:description" content="This is my amazing site, let me tell you all about it.">
      <meta property="og:title" content="My Amazing Site">
      <meta property="og:image" content="https://example.com/image.png">
      <meta name="twitter:card" content="summary_large_image">",
        "htmlAttrs": "",
      }
    `)
  })

  it('title function', async () => {
    const head = createServerHeadWithContext()

    useHead(head, {
      title: 'my default title',
    })

    useHead(head, {
      title: () => {
        return undefined
      },
    })

    const ctx = await renderSSRHead(head)
    expect(ctx).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<title>my default title</title>",
        "htmlAttrs": "",
      }
    `)
  })
  it('vite template', async () => {
    const html = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
    <!--app-head-->
    </head>
    <body>
    <div id="app"><!--app-html--></div>
      <script type="module" src="/src/entry-client.ts"></script>
      </body>
      </html>`
    const head = createServerHeadWithContext()
    head.push({
      title: 'new title',
      meta: [
        { charset: 'utf-16' },
      ],
    })
    expect(await transformHtmlTemplate(head, html)).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
      <head>
      <!--app-head-->
      <meta charset="utf-16">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>new title</title>
      <link rel="icon" type="image/svg+xml" href="/vite.svg"></head>
      <body>
      <div id="app"><!--app-html--></div>
      <script type="module" src="/src/entry-client.ts"></script>
      </body>
      </html>"
    `)
  })
  it('random template', async () => {
    const html = `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link rel="stylesheet" href="style.css">
          <script src="script.js" async type="module"></script>
        </head>
        <body style="accent-color: red;">
          <div>hello</div>
          <script src="ssr.test.ts"></script>
          <script>
          console.log('hello')
</script>
        </body>
      </html>
    `
    const head = createServerHeadWithContext()
    head.push({
      title: 'new title',
      bodyAttrs: {
        style: 'background-color: blue;',
      },
      meta: [
        { charset: 'utf-16' },
      ],
    })
    expect(await transformHtmlTemplate(head, html)).toMatchInlineSnapshot(`
      "
      <html lang="en">
      <head>
      <meta charset="utf-16">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>new title</title>
      <link rel="stylesheet" href="style.css">
      <script src="script.js" type="module"></script></head>
      <body style="background-color: blue; accent-color: red">
      <div>hello</div>
      <script src="ssr.test.ts"></script>
      <script>
      console.log('hello')
      </script>
      </body>
      </html>
      "
    `)
  })
})
