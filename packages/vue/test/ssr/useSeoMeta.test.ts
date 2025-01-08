import { renderSSRHead } from '@unhead/ssr'
import { useSeoMeta } from '@unhead/vue'
import { describe, it } from 'vitest'
import { ssrVueAppWithUnhead } from '../util'

describe('useSeoMeta vue ssr', () => {
  it('handles objects', async () => {
    const head = await ssrVueAppWithUnhead(() => {
      useSeoMeta({
        viewport: {
          width: 'device-width',
          initialScale: 1,
        },
        robots: {
          index: true,
          follow: true,
        },
        refresh: {
          seconds: 60,
          url: 'https://example.com',
        },
      })
    })
    expect(await renderSSRHead(head)).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="index, follow">
      <meta http-equiv="refresh" content="60;url=https://example.com">",
        "htmlAttrs": "",
      }
    `)
  })
  it('ssr reactivity', async () => {
    const head = await ssrVueAppWithUnhead(() => {
      const data = {
        value: 'foo',
      }
      useSeoMeta({
        robots: () => data.value,
      })
      data.value = 'bar'
    })
    expect(await renderSSRHead(head)).toMatchInlineSnapshot(`
      {
        "bodyAttrs": "",
        "bodyTags": "",
        "bodyTagsOpen": "",
        "headTags": "<meta name="robots" content="bar">",
        "htmlAttrs": "",
      }
    `)
  })
})
