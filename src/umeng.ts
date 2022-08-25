/* eslint-disable camelcase */
import type { Options, Window } from './globalExtensions'

export function initUMeng(options: Options) {
  const global = window as Window
  const { aplus_queue } = global
  if (!aplus_queue)
    return

  const { appKey, autoSendPv = false, debug = false, globalproperty, beforeSendPv, beforeTrackEvent, afterSendPv, afterTrackEvent } = options

  aplus_queue.push({
    action: 'aplus.setMetaInfo',
    arguments: ['appKey', appKey]
  })

  if (!autoSendPv) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['aplus-waiting', 'MAN']
    })
  }

  if (debug) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['DEBUG', true]
    })
  }

  if (globalproperty) {
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['globalproperty', globalproperty]
    })
  }

  beforeSendPv && (global._VM_BEFORE_SEND_PV = beforeSendPv)
  beforeTrackEvent && (global._VM_BEFORE_TRACK_EVENT = beforeTrackEvent)
  afterSendPv && (global._VM_AFTER_SEND_PV = afterSendPv)
  afterTrackEvent && (global._VM_AFTER_TRACK_EVENT = afterTrackEvent)
}

export async function sendPV(params: Record<string, unknown>, callBack?: {
  beforeSendPv?: (params: Record<string, any>) => void
  afterSendPv?: (params: Record<string, any>) => void
}) {
  const global = window as Window
  const { aplus_queue } = global
  if (!aplus_queue)
    return

  const { beforeSendPv, afterSendPv } = callBack || {}

  const beforeCallback = beforeSendPv || global._VM_BEFORE_SEND_PV
  const afterCallback = afterSendPv || global._VM_AFTER_SEND_PV

  let flag = true
  try {
    if (beforeCallback) {
      const res = beforeCallback(params)
      if (res.then) {
        await res.then()
        flag = true
      } else {
        flag = res
      }
    }
  } catch (err) {
    flag = false
    console.error('vue-umeng beforeSendPv error: ', err)
  }

  if (flag) {
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{ is_auto: false }, params]
    })

    try {
      afterCallback && afterCallback(params)
    } catch (err) {
      console.error('vue-umeng afterSendPv error: ', err)
    }
  }
}

export async function trackEvent(
  eventCode: string,
  eventParams: Record<string, unknown>,
  eventType = 'CLK',
  callBack?: {
    beforeTrackEvent?: (eventCode: string, eventParams: Record<string, any>) => void
    afterTrackEvent?: (eventCode: string, eventParams: Record<string, any>) => void
  }
) {
  const global = window as Window
  const { aplus_queue } = global
  if (!aplus_queue)
    return

  const { beforeTrackEvent, afterTrackEvent } = callBack || {}

  const beforeCallback = beforeTrackEvent || global._VM_BEFORE_TRACK_EVENT
  const afterCallback = afterTrackEvent || global._VM_AFTER_TRACK_EVENT

  let flag = true
  try {
    if (beforeCallback) {
      const res = beforeCallback(eventCode, eventParams)
      if (res.then) {
        await res.then()
        flag = true
      } else {
        flag = res
      }
    }
  } catch (err) {
    flag = false
    console.error('vue-umeng beforeTrackEvent error: ', err)
  }

  if (flag) {
    aplus_queue.push({
      action: 'aplus.record',
      arguments: [eventCode, eventType, eventParams]
    })

    try {
      afterCallback && afterCallback(eventCode, eventParams)
    } catch (err) {
      console.error('vue-umeng afterSendPv error: ', err)
    }
  }
}
