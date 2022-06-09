import type { LoadScriptOptions } from './globalExtensions'

const noop = () => {
  //
}

export default function loadScript(
  src: string,
  onLoaded: (el: HTMLScriptElement) => void = noop,
  options: LoadScriptOptions = {}
) {
  const {
    immediate = true,
    manual = false,
    type = 'text/javascript',
    async = true,
    crossOrigin,
    referrerPolicy,
    noModule,
    defer,
    document = window.document,
    attrs = {}
  } = options

  let scriptTag: HTMLScriptElement | null = null
  let _promise: Promise<HTMLScriptElement | boolean> | null = null

  const createScript = (
    waitForScriptLoad: boolean
  ): Promise<HTMLScriptElement | boolean> =>
    new Promise((resolve, reject) => {
      const resolveWithElement = (el: HTMLScriptElement) => {
        scriptTag = el
        resolve(el)
        return el
      }

      if (!document) {
        resolve(false)
        return
      }

      let shouldAppend = false

      let el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)

      if (!el) {
        el = document.createElement('script')
        el.type = type
        el.async = async
        el.src = src

        if (defer)
          el.defer = defer

        if (crossOrigin)
          el.crossOrigin = crossOrigin

        if (noModule)
          el.noModule = noModule

        if (referrerPolicy)
          el.referrerPolicy = referrerPolicy

        Object.entries(attrs).forEach(([name, value]) =>
          el?.setAttribute(name, value)
        )

        shouldAppend = true
      } else if (el.hasAttribute('data-loaded')) {
        resolveWithElement(el)
      }

      // Event listeners
      el.addEventListener('error', event => reject(event))
      el.addEventListener('abort', event => reject(event))
      el.addEventListener('load', () => {
        if (el) {
          el.setAttribute('data-loaded', 'true')

          onLoaded(el)
          resolveWithElement(el)
        }
      })

      if (shouldAppend)
        el = document.head.appendChild(el)

      if (!waitForScriptLoad)
        resolveWithElement(el)
    })

  const load = (
    waitForScriptLoad = true
  ): Promise<HTMLScriptElement | boolean> => {
    if (!_promise)
      _promise = createScript(waitForScriptLoad)

    return _promise
  }

  const unload = () => {
    if (!document)
      return

    _promise = null

    if (scriptTag)
      scriptTag = null

    const el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (el)
      document.head.removeChild(el)
  }

  if (immediate && !manual)
    load()

  return { scriptTag, load, unload }
}
