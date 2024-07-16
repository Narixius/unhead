import { defineHeadPlugin } from '@unhead/shared'
import { resolveUnrefHeadInput } from '../utils'

export default defineHeadPlugin({
  hooks: {
    'entries:resolve': (ctx) => {
      for (const entry of ctx.entries)
        entry.resolvedInput = resolveUnrefHeadInput(entry.input)
    },
  },
})
