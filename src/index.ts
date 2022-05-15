import { initUMeng, sendPV, trackEvent } from './umeng'
import loadScript from './loadScript'
import type { Config } from './globalExtensions'

export { sendPV, trackEvent } from './umeng'
export * from './globalExtensions'

export default {
  install: async (app: Record<string, any>, config: Config) => {
    const { router, mode, options } = config

    if (!router) {
      throw new Error('router cannot be undefined')
    }

    if (!mode || !['development', 'production'].includes(mode)) {
      throw new Error(
        'please pass in mode, and the value of mode is development or production',
      )
    }

    if (mode === 'development') {
      return
    }

    if (!options.appKey) {
      throw new Error('appKey cannot be undefined')
    }

    if (!window) {
      return
    }

    try {
      // load umeng script
      loadScript(
        'https://d.alicdn.com/alilog/mlog/aplus/203467608.js',
        () => {
          // set appKey
          const { injectGlobalMixins = false } = options
          initUMeng(options)

          if (!options.autoSendPv) {
            router.afterEach((to, from) => {
              sendPV({
                toFullPath: to.fullPath,
                fromFullPath: from.fullPath,
              })
            })
          }

          if (injectGlobalMixins) {
            app.mixin({
              methods: {
                sendPVByUMeng(params: Record<string, unknown>) {
                  sendPV(params)
                },

                trackEventByUMeng(
                  eventCode: string,
                  eventParams: Record<string, unknown>,
                  eventType = 'CLK',
                ) {
                  trackEvent(eventCode, eventParams, eventType)
                },
              },
            })
          }
        },
        {
          attrs: {
            id: 'beacon-aplus',
          },
        },
      )
    } catch (err) {
      console.warn('umeng script load error:', err)
    }
  },
}
