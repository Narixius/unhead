import type { SafeBodyAttr, SafeHtmlAttr, SafeLink, SafeMeta, SafeNoscript, SafeScript } from '@unhead/schema'
import type { ReactiveHead } from './schema'
import type { MaybeComputedRef, ResolvableArray } from './util'

export interface HeadSafe extends Pick<ReactiveHead, 'title' | 'titleTemplate' | 'templateParams'> {
  meta?: ResolvableArray<SafeMeta>[]
  link?: ResolvableArray<SafeLink>[]
  noscript?: ResolvableArray<SafeNoscript>[]
  script?: ResolvableArray<SafeScript>[]
  htmlAttrs?: ResolvableArray<SafeHtmlAttr>
  bodyAttrs?: ResolvableArray<SafeBodyAttr>
}

export type UseHeadSafeInput = MaybeComputedRef<HeadSafe>
