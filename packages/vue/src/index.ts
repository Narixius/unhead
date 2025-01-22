import { createHeadCore } from 'unhead'
import { resolveUnrefHeadInput } from './utils'

// composables
export * from './autoImports'

// core
export {
  createHeadCore,
}

// utils
export {
  resolveUnrefHeadInput,
}

export * from './composables'
export {
  headSymbol,
} from './install'
// types
export * from './types'
export * from './VueHeadMixin'
