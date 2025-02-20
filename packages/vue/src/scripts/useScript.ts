import type { ResolvableProperties, VueHeadClient } from '@unhead/vue'
import type { UseScriptOptions as BaseUseScriptOptions, ScriptInstance, UseFunctionType, UseScriptStatus } from 'unhead/scripts'
import type {
  DataKeys,
  HeadEntryOptions,
  SchemaAugmentations,
  ScriptBase,
} from 'unhead/types'
import type { ComponentInternalInstance, Ref, WatchHandle } from 'vue'
import { injectHead } from '@unhead/vue'
import { useScript as _useScript } from 'unhead/scripts'
import { getCurrentInstance, isRef, onMounted, onScopeDispose, ref, watch } from 'vue'

export interface VueScriptInstance<T extends Record<symbol | string, any>> extends Omit<ScriptInstance<T>, 'status'> {
  status: Ref<UseScriptStatus>
}

export type UseScriptInput = string | (ResolvableProperties<Omit<ScriptBase & DataKeys & SchemaAugmentations['script'], 'src'>> & { src: string })
export interface UseScriptOptions<T extends Record<symbol | string, any> = Record<string, any>> extends Omit<HeadEntryOptions, 'head'>, Pick<BaseUseScriptOptions<T>, 'use' | 'eventContext' | 'beforeInit'> {
  /**
   * The trigger to load the script:
   * - `undefined` | `client` - (Default) Load the script on the client when this js is loaded.
   * - `manual` - Load the script manually by calling `$script.load()`, exists only on the client.
   * - `Promise` - Load the script when the promise resolves, exists only on the client.
   * - `Function` - Register a callback function to load the script, exists only on the client.
   * - `server` - Have the script injected on the server.
   * - `ref` - Load the script when the ref is true.
   */
  trigger?: BaseUseScriptOptions['trigger'] | Ref<boolean>
  /**
   * Unhead instance.
   */
  head?: VueHeadClient<any>
}

export type UseScriptContext<T extends Record<symbol | string, any>> = VueScriptInstance<T>

function registerVueScopeHandlers<T extends Record<symbol | string, any> = Record<symbol | string, any>>(script: UseScriptContext<UseFunctionType<UseScriptOptions<T>, T>>, scope?: ComponentInternalInstance | null) {
  if (!scope) {
    return
  }
  const _registerCb = (key: 'loaded' | 'error', cb: any) => {
    if (!script._cbs[key]) {
      cb(script.instance)
      return () => {}
    }
    let i: number | null = script._cbs[key].push(cb)
    const destroy = () => {
      // avoid removing the wrong callback
      if (i) {
        script._cbs[key]?.splice(i - 1, 1)
        i = null
      }
    }
    onScopeDispose(destroy)
    return destroy
  }
  // if we have a scope we should make these callbacks reactive
  script.onLoaded = (cb: (instance: T) => void | Promise<void>) => _registerCb('loaded', cb)
  script.onError = (cb: (err?: Error) => void | Promise<void>) => _registerCb('error', cb)
  onScopeDispose(() => {
    // stop any trigger promises
    script._triggerAbortController?.abort()
  })
}

export type UseScriptReturn<T extends Record<symbol | string, any>> = UseScriptContext<UseFunctionType<UseScriptOptions<T>, T>>

export function useScript<T extends Record<symbol | string, any> = Record<symbol | string, any>>(_input: UseScriptInput, _options?: UseScriptOptions<T>): UseScriptReturn<T> {
  const input = (typeof _input === 'string' ? { src: _input } : _input) as UseScriptInput
  const options = _options || {} as UseScriptOptions<T>
  const head = options?.head || injectHead()
  options.head = head
  const scope = getCurrentInstance()
  options.eventContext = scope
  if (scope && typeof options.trigger === 'undefined') {
    options.trigger = onMounted
  }
  else if (isRef(options.trigger)) {
    const refTrigger = options.trigger as Ref<boolean>
    let off: WatchHandle
    options.trigger = new Promise<boolean>((resolve) => {
      off = watch(refTrigger, (val) => {
        if (val) {
          resolve(true)
        }
      }, {
        immediate: true,
      })
      onScopeDispose(() => resolve(false), true)
    }).then((val) => {
      off?.()
      return val
    })
  }
  // we may be re-using an existing script
  // sync the status, need to register before useScript
  // @ts-expect-error untyped
  head._scriptStatusWatcher = head._scriptStatusWatcher || head.hooks.hook('script:updated', ({ script: s }) => {
    s._statusRef.value = s.status
  })
  // @ts-expect-error untyped
  const script = _useScript(head, input as BaseUseScriptInput, options)
  // @ts-expect-error untyped
  script._statusRef = script._statusRef || ref<UseScriptStatus>(script.status)
  // Note: we don't remove scripts on unmount as it's not a common use case and reloading the script may be expensive
  // @ts-expect-error untyped
  registerVueScopeHandlers(script, scope)
  return new Proxy(script, {
    get(_, key, a) {
      // we can't override status as it will break the unhead useScript API
      return Reflect.get(_, key === 'status' ? '_statusRef' : key, a)
    },
  }) as any as UseScriptReturn<T>
}
