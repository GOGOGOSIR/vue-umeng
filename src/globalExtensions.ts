import { sendPV, trackEvent } from './umeng'
import type { Router } from 'vue-router'

export interface Config {
  mode: 'production' | 'development'
  router: Router
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
