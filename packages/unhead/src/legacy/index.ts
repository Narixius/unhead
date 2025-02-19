import type {
  CreateHeadOptions,
  Head,
  Unhead,
} from '../types'
import { createHeadCore } from '../createHead'
import { AliasSortingPlugin, DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin } from '../plugins'

export * from '../index'
export * from './useScript'

export const activeHead: { value: Unhead<any> | null } = { value: null }

export function getActiveHead() {
  return activeHead?.value
}

export const unheadComposablesImports = [
  {
    from: 'unhead',
    imports: [
      'useHead',
      'useHeadSafe',
      'useSeoMeta',
    ],
  },
]

export const composableNames = [
  'useHead',
  'useHeadSafe',
  'useSeoMeta',
]

export function createServerHead<T extends Record<string, any> = Head>(options: CreateHeadOptions = {}) {
  return activeHead.value = createHeadCore<T>({
    disableCapoSorting: true,
    ...options,
    // @ts-expect-error untyped
    document: false,
    plugins: [
      ...(options.plugins || []),
      DeprecationsPlugin,
      PromisesPlugin,
      TemplateParamsPlugin,
      AliasSortingPlugin,
    ],
  })
}

export function createHead<T extends Record<string, any> = Head>(options: CreateHeadOptions = {}) {
  return activeHead.value = createHeadCore<T>({
    disableCapoSorting: true,
    ...options,
    plugins: [
      ...(options.plugins || []),
      DeprecationsPlugin,
      PromisesPlugin,
      TemplateParamsPlugin,
      AliasSortingPlugin,
    ],
  })
}

export { createHeadCore }
