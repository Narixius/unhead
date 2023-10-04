import { createHead } from 'unhead'
import { renderSSRHead } from '@unhead/ssr'

describe('tagPosition', () => {
  it('head', async () => {
    const head = createHead()
    head.push({
      script: [
        {
          src: '/my-important-script.js',
          tagPosition: 'head',
        },
      ],
    })
    const tags = await renderSSRHead(head)
    expect(tags).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<script src=\\"/my-important-script.js\\"></script>",
        "htmlAttrs": "",
      }
    `)
  })
  it('body: true', async () => {
    const head = createHead()
    head.push({
      script: [
        {
          src: '/my-important-script.js',
          body: true,
        },
      ],
    })
    const tags = await renderSSRHead(head)
    expect(tags).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "<script src=\\"/my-important-script.js\\"></script>",
        "bodyTagsOpen": "",
        "headTags": "",
        "htmlAttrs": "",
      }
    `)
  })
  it('bodyOpen', async () => {
    const head = createHead()
    head.push({
      script: [
        {
          src: '/my-important-script.js',
          tagPosition: 'bodyOpen',
        },
      ],
    })
    const tags = await renderSSRHead(head)
    expect(tags).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "<script src=\\"/my-important-script.js\\"></script>",
        "headTags": "",
        "htmlAttrs": "",
      }
    `)
  })
  it('bodyClose', async () => {
    const head = createHead()
    head.push({
      script: [
        {
          src: '/my-important-script.js',
          tagPosition: 'bodyClose',
        },
      ],
    })
    const tags = await renderSSRHead(head)
    expect(tags).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "<script src=\\"/my-important-script.js\\"></script>",
        "bodyTagsOpen": "",
        "headTags": "",
        "htmlAttrs": "",
      }
    `)
  })
})
