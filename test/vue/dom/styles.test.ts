import { renderDOMHead } from '@unhead/dom'
import { createHead, setHeadInjectionHandler, useHead } from '@unhead/vue'
import { describe, it } from 'vitest'
import { computed, ref } from 'vue'
import { useDom } from '../../fixtures'

describe('vue dom styles', () => {
  it('empty style', async () => {
    const dom = useDom()

    const head = createHead({ document: dom.window.document })
    setHeadInjectionHandler(() => head)

    const isNavActive = ref(false)

    useHead({
      bodyAttrs: {
        style: computed(() => {
          return isNavActive.value ? 'background-color: red' : ''
        }),
      },
    })

    await renderDOMHead(head, { document: dom.window.document })
    expect(dom.window.document.body.getAttribute('style')).toEqual(null)
    isNavActive.value = true

    // wait 100ms
    await new Promise(resolve => setTimeout(resolve, 100))
    await renderDOMHead(head, { document: dom.window.document })
    expect(dom.window.document.body.getAttribute('style')).toEqual('background-color: red;')
  })
  it('url style', async () => {
    const dom = useDom()

    const head = createHead({ document: dom.window.document })
    setHeadInjectionHandler(() => head)

    useHead({
      bodyAttrs: {
        style: '--cover-image: url(\'https://example-url-to-image.com\')',
      },
    })

    await renderDOMHead(head, { document: dom.window.document })
    expect(dom.window.document.body.getAttribute('style')).toEqual('--cover-image: url(\'https://example-url-to-image.com\');')
  })
  it('array style', async () => {
    const dom = useDom()

    const head = createHead({ document: dom.window.document })
    setHeadInjectionHandler(() => head)

    useHead({
      bodyAttrs: {
        style: [
          'background-color: red',
          'color: white',
        ],
      },
    })

    await renderDOMHead(head, { document: dom.window.document })

    expect(dom.window.document.body.getAttribute('style')).toEqual(`background-color: red; color: white;`)
  })
  it('object style', async () => {
    const dom = useDom()

    const head = createHead({ document: dom.window.document })
    setHeadInjectionHandler(() => head)

    const isNavActive = ref(false)

    useHead({
      bodyAttrs: {
        style: {
          'color': 'white',
          'background-color': () => isNavActive.value ? 'red' : '',
        },
      },
    })

    await renderDOMHead(head, { document: dom.window.document })
    expect(dom.window.document.body.getAttribute('style')).toEqual('color: white;')

    isNavActive.value = true

    // wait 100ms
    await new Promise(resolve => setTimeout(resolve, 100))
    await renderDOMHead(head, { document: dom.window.document })
    expect(dom.window.document.body.getAttribute('style')).toEqual('color: white; background-color: red;')
  })
})
