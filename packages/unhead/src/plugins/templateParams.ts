import { defineHeadPlugin, processTemplateParams } from '@unhead/shared'
import type { TemplateParams } from '@unhead/schema'

const SupportedAttrs = {
  meta: 'content',
  link: 'href',
  htmlAttrs: 'lang',
} as const

export default defineHeadPlugin(head => ({
  hooks: {
    'tags:resolve': (ctx) => {
      const { tags } = ctx
      // we always process params so we can substitute the title
      const params = (tags.find(tag => tag.tag === 'templateParams')?.props || {}) as TemplateParams
      // ensure a separator exists
      const sep = params.separator || '|'
      delete params.separator
      // pre-process title
      params.pageTitle = processTemplateParams(
        // find templateParams
        params.pageTitle as string || tags.find(tag => tag.tag === 'title')?.textContent || '',
        params,
        sep,
      )
      for (const tag of tags) {
        if (tag.processTemplateParams === false) {
          continue
        }
        // @ts-expect-error untyped
        const v = SupportedAttrs[tag.tag]
        if (v && typeof tag.props[v] === 'string') {
          tag.props[v] = processTemplateParams(tag.props[v], params, sep)
        }
        // everything else requires explicit opt-in
        else if (tag.processTemplateParams === true || tag.tag === 'titleTemplate' || tag.tag === 'title') {
          ['innerHTML', 'textContent'].forEach((p) => {
            // @ts-expect-error untyped
            if (typeof tag[p] === 'string')
              // @ts-expect-error untyped
              tag[p] = processTemplateParams(tag[p], params, sep)
          })
        }
      }
      // resolved template params
      head._templateParams = params
      head._separator = sep
      ctx.tags = tags.filter(tag => tag.tag !== 'templateParams')
    },
  },
}))
