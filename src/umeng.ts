import type { Options, Window } from './globalExtensions'

export function initUMeng(options: Options) {
  const { aplus_queue } = window as Window
  if (!aplus_queue) {
    return
  }

  const { appKey, autoSendPv = false, debug = false, globalproperty } = options

  console.log('>>>> init umeng <<<<')

  aplus_queue.push({
    action: 'aplus.setMetaInfo',
    arguments: ['appKey', appKey],
  })

  if (!autoSendPv) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['aplus-waiting', 'MAN'],
    })
  }

  if (debug) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['DEBUG', true],
    })
  }

  if (globalproperty) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['globalproperty', globalproperty],
    })
  }
}

export function sendPV(params: Record<string, unknown>) {
  const { aplus_queue } = window as Window
  if (!aplus_queue) {
    return
  }

  aplus_queue.push({
    action: 'aplus.sendPV',
    arguments: [{ is_auto: false }, params],
  })
}

export function trackEvent(
  eventCode: string,
  eventParams: Record<string, unknown>,
  eventType = 'CLK',
) {
  const { aplus_queue } = window as Window
  if (!aplus_queue) {
    return
  }
  console.log('触发事件日志')
  aplus_queue.push({
    action: 'aplus.record',
    arguments: [eventCode, eventType, eventParams],
  })
}
