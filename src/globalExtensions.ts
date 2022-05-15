import { sendPV, trackEvent } from './umeng'

type ReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

type Guard = (to: { fullPath: string }, from: { fullPath: string }) => any

export interface Config {
  mode: 'production' | 'development'
  router: {
    afterEach(guard: Guard): () => void
  }
  options: {
    appKey: string // appKey
    autoSendPv?: boolean // Whether to automatically send pv, the default is false
    debug?: boolean // Whether to enable debug mode, the default is false
    globalproperty?: Record<string, unknown> // Global properties, after setting global properties, custom events and PVs will be reported with
    injectGlobalMixins?: boolean // Whether to register some public methods of Umeng into the global mixin
  }
}

export type Options = Config['options']

export type UMengMixinPropertiesType = {
  sendPV: typeof sendPV
  trackEvent: typeof trackEvent
}

export interface Window {
  [key: string]: any
}

export interface LoadScriptOptions {
  /**
   * Load the script immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Add `async` attribute to the script tag
   *
   * @default true
   */
  async?: boolean

  /**
   * Script type
   *
   * @default 'text/javascript'
   */
  type?: string

  /**
   * Manual controls the timing of loading and unloading
   *
   * @default false
   */
  manual?: boolean

  crossOrigin?: 'anonymous' | 'use-credentials'
  referrerPolicy?: ReferrerPolicy

  noModule?: boolean

  defer?: boolean

  /**
   * Add custom attribute to the script tag
   *
   */
  attrs?: Record<string, string>
  document?: Document
}
