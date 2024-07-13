import type { MergeHead } from '@unhead/schema'
import type { UseHeadInput, UseHeadOptions, VueHeadClient } from './types'
import { useHead } from './'

export type VueHeadClientPollyFill<T extends MergeHead> = VueHeadClient<T> & {
  /**
   * @deprecated use `resolveTags`
   */
  headTags: VueHeadClient<T>['resolveTags']
  /**
   * @deprecated use `push`
   */
  addEntry: VueHeadClient<T>['push']
  /**
   * @deprecated use `push`
   */
  addHeadObjs: VueHeadClient<T>['push']
  /**
   * @deprecated use `useHead`
   */
  addReactiveEntry: (input: UseHeadInput<T>, options?: UseHeadOptions) => (() => void)
  /**
   * @deprecated Use useHead API.
   */
  removeHeadObjs: () => void
  /**
   * @deprecated Call hook `entries:resolve` or update an entry
   */
  updateDOM: () => void
  /**
   * @deprecated Access unhead properties directly.
   */
  unhead: VueHeadClient<T>
}

/**
 * @deprecated Will be removed in v2.
 */
export function polyfillAsVueUseHead<T extends MergeHead>(head: VueHeadClient<T>): VueHeadClientPollyFill<T> {
  const polyfilled = head as VueHeadClientPollyFill<T>
  // add a bunch of @vueuse/head compat functions
  polyfilled.headTags = head.resolveTags
  polyfilled.addEntry = head.push
  polyfilled.addHeadObjs = head.push
  polyfilled.addReactiveEntry = (input, options) => {
    const api = useHead(input, options)
    if (api !== undefined)
      return api.dispose
    return () => {}
  }
  // not able to handle this
  polyfilled.removeHeadObjs = () => {}
  // trigger DOM
  polyfilled.updateDOM = () => {
    head.hooks.callHook('entries:updated', head)
  }
  polyfilled.unhead = head
  return polyfilled
}
