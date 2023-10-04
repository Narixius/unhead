import { createSSRApp, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import type { MergeHead } from '@unhead/schema'
import { createHead, useHead } from '@unhead/vue'
import { renderSSRHead } from '@unhead/ssr'

describe('vue ssr custom augmentation', () => {
  it('link auto-completion', async () => {
    interface CustomHead extends MergeHead {
      link: {
        href: 'link-one' | 'link/two' | 'link/number/three'
        CUSTOM_FIELD: 10
      }
    }

    const head = createHead<CustomHead>()
    const app = createSSRApp({
      setup() {
        const title = ref('')
        useHead<CustomHead>({
          title: title.value,
          link: [
            {
              'data-test': () => 'test',
              'href': 'link-one',
              'CUSTOM_FIELD': 10,
            },
          ],
        })
        title.value = 'hello'
        return () => '<div>hi</div>'
      },
    })
    app.use(head)
    await renderToString(app)

    const headResult = await renderSSRHead(head)
    expect(headResult.headTags).toMatchInlineSnapshot(
      `
      "<title></title>
      <link data-test=\\"test\\" href=\\"link-one\\" CUSTOM_FIELD=\\"10\\">"
    `,
    )
  })
})
