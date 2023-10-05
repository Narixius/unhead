import { NetworkEvents, hashCode } from '@unhead/shared'
import type { DomRenderTagContext, Head, HeadEntryOptions, Script, ScriptInstance, UseScriptInput, UseScriptOptions } from '@unhead/schema'
import { getActiveHead } from './useActiveHead'

export function useScript<T>(input: UseScriptInput, _options?: UseScriptOptions<T>): T & { $script: ScriptInstance<T> } {
  const options = _options || {}
  const head = options.head || getActiveHead()
  if (!head)
    throw new Error('No active head found, please provide a head instance or use the useHead composable')

  // TODO warn about non-src / non-key input
  const id = input.key || hashCode(input.src || (typeof input.innerHTML === 'string' ? input.innerHTML : ''))
  const key = `use-script.${id}`
  if (head._scripts?.[id])
    return head._scripts[id]

  async function transform(entry: Head): Promise<Head> {
    const script = await (options.transform || (input => input))(entry.script![0] as Script)
    const ctx = { script }
    await head!.hooks.callHook('script:transform', ctx)
    return { script: [ctx.script] }
  }

  const script: ScriptInstance<T> = {
    id,
    status: 'awaitingLoad',
    loaded: false,
    remove: () => {
      if (script.status === 'loaded') {
        script.entry?.dispose()
        script.status = 'removed'
        head.hooks.callHook(`script:updated`, hookCtx)
        delete head._scripts?.[id]
        return true
      }
      return false
    },
    waitForUse: () => new Promise(() => {}),
    load: () => {
      if (script.status !== 'awaitingLoad')
        return script.waitForUse()
      script.status = 'loading'
      head.hooks.callHook(`script:updated`, hookCtx)
      script.entry = head.push({
        script: [
          { ...input, key },
        ],
      }, {
        ...options as any as HeadEntryOptions,
        // @ts-expect-error untyped
        transform,
        head,
      })
      return script.waitForUse()
    },
  }

  const hookCtx = { script }

  NetworkEvents.forEach((fn) => {
    // clone fn
    // @ts-expect-error untyped
    const _fn = typeof input[fn] === 'function' ? input[fn].bind({}) : null
    // @ts-expect-error untyped
    input[fn] = (e: Event) => {
      script.status = fn === 'onload' ? 'loaded' : fn === 'onerror' ? 'error' : 'loading'
      head.hooks.callHook(`script:updated`, hookCtx)
      _fn && _fn(e)
    }
  })

  let trigger = options.trigger
  if (trigger) {
    trigger === 'idle' && (trigger = new Promise<void>(resolve => requestIdleCallback(() => resolve())))
    // never resolves
    trigger === 'manual' && (trigger = new Promise(() => {}))
    // check trigger is a promise
    trigger instanceof Promise && trigger.then(script.load)
  }
  else {
    script.load()
  }

  script.waitForUse = () => new Promise<T>((resolve) => {
    if (typeof options.use === 'function') {
      if (script.status === 'loaded')
        // @ts-expect-error untyped
        resolve(options.use())
      // @ts-expect-error untyped
      head.hooks.hook('script:loaded', ({ script }) => script.id === id && resolve(options.use()))
    }
  })

  function resolveInnerHtmlLoad(ctx: DomRenderTagContext) {
    // we don't know up front if they'll be innerHTML or src due to the transform step
    if (ctx.tag.key === key) {
      if (ctx.tag.innerHTML) {
        // trigger load event
        script.status = 'loaded'
        head!.hooks.callHook('script:updated', hookCtx)
        typeof input.onload === 'function' && input.onload(new Event('load'))
      }
      head!.hooks.removeHook('dom:renderTag', resolveInnerHtmlLoad)
    }
  }
  head.hooks.hook('dom:renderTag', resolveInnerHtmlLoad)

  // 3. Proxy the script API
  const instance = new Proxy({}, {
    get(_, fn) {
      const stub = options.stub?.({ script, fn })
      if (stub)
        return stub
      if (fn === '$script')
        return script
      return (...args: any[]) => {
        // third party scripts only run on client-side, mock the function
        if (head.ssr || !options.use)
          return
        // TODO mock invalid environments
        if (script.loaded) {
          const api = options.use()
          // @ts-expect-error untyped
          return api[fn](...args)
        }
        else {
          return script.waitForUse().then(
            (api) => {
              // @ts-expect-error untyped
              api[fn](...args)
            },
          )
        }
      }
    },
  }) as any as T & { $script: ScriptInstance<T> }
  // 4. Providing a unique context for the script
  head._scripts = head._scripts || {}
  head._scripts[id] = instance
  return instance
}
