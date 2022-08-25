<h1 align="center">vue-umeng</h1>
<p>
  <a href='https://www.npmjs.com/package/vue-umeng'>
    <img alt="Version" src="https://img.shields.io/npm/v/vue-umeng?color=41b883&label=npm" />
  </a>
</p>

> vue 集成 umeng 的小程序统计（U-Mini）

### 🏠 [仓库地址](https://github.com/GOGOGOSIR/release-it-free#readme)

## 安装

```sh
yarn add vue-umeng
```

cdn 引入

```js
<script src="https://unpkg.com/vue-umeng/dist/index.min.js"></script>
```

## 使用

配置 main.ts 文件，例子如下所示：

```js
import uMeng from 'vue-umeng'
import router from './router' // 引入 vue-router，具体地址由使用方决定

// ...

app.use(uMeng, {
  router, // vue-router 的实例
  mode: '当前的运行环境', // 只有当 mode 为 production 才会执行友盟的统计方法
  options: {
    appKey: '友盟的appKey'
  },
})
```

## 配置

### mode

模式，该值是必传项。可选值有 `production` 或 `development`。只有当 mode 为 production 才会执行友盟的统计方法。

### router

`vue-router` 实例，该值是必传项。

### options.appKey

友盟的 appKey 值(必传)

### options.autoSendPv

默认值： `false`

是否自动发送pv。**由于友盟对于单页应用需要手动发送 pv，因此这里默认值是 false，该插件会自动在 router.afterEach 中调用 sendPv 的方法。无需使用方调用 `sendPv` 方法**

### options.debug

默认值： `false`

是否开启 debug 模式。详细配置：[参考友盟文档](https://developer.umeng.com/docs/147615/detail/290919)

### options.globalproperty

设置全局属性。详细配置： [参考友盟文档](https://developer.umeng.com/docs/147615/detail/290919#h1-v1p-uni-pic)

### options.injectGlobalMixins

默认值： `false`

是否将 `sendPVByUMeng`（发送 PV 的方法）和 `trackEventByUMeng` （上报自定义事件的方法）注册到全局的 mixin 中。事件方法和 `sendPv` 和 `trackEvent` 一样。

### options.beforeSendPv

默认值： `null`

接收参数：

| 参数名      | 类型 | 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| params      | Record<string, any> | 上报的参数 | |

返回类型： `true` 或 `Promise<boolean>`

在执行 `sendPv` 方法前，执行的全局的回调函数。当函数返回 true 或 resolve 时才会调用友盟的方法。如果返回 false 或 reject 时则不会调用友盟的方法

例子：

```js
options: {
  // ...
  beforeSendPv: () => {
    // return false
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const f = false
        if (!f) {
          resolve(true)
        } else {
          reject()
        }
      }, 2000)
    })
  },
}
```

### options.beforeTrackEvent

默认值： `null`

接收参数：

| 参数名      | 类型 | 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| eventCode      | string | 上报事件名 | |
| eventParams      | Record<string, any> | 上报的参数 | |

返回类型： `true` 或 `Promise<boolean>`

在执行 `trackEvent` 方法前，执行的全局的回调函数。当函数返回 true 或 resolve 时才会调用友盟的方法。如果返回 false 或 reject 时则不会调用友盟的方法

例子：

```js
options: {
  // ...
  beforeTrackEvent: () => {
    // return false
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const f = false
        if (!f) {
          resolve(true)
        } else {
          reject()
        }
      }, 2000)
    })
  },
}
```


### options.afterSendPv

默认值： `null`

接收参数：

| 参数名      | 类型 | 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| params      | Record<string, any> | 上报的参数 | |

在执行 `sendPv` 方法后，执行的全局的回调函数

### options.afterTrackEvent

默认值： `null`

接收参数：

| 参数名      | 类型 | 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| eventCode      | string | 上报事件名 | |
| eventParams      | Record<string, any> | 上报的参数 | |

在执行 `trackEvent` 方法后，执行的全局的回调函数

## 方法

### sendPv

上报 pv 的方法

参数：

| 参数名      | 类型 | 是否必传 | 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |  ----------- |
| params      | Record<string, any> | 是 | 上报的参数 | |
| callback      | Record<string, function> | 否 | 回调函数 | |
| callback.beforeSendPv      |  (params: Record<string, any>) => void | 否 | 执行 sendPv 前的回调函数, 该函数的特性同 options 中配置的 beforeSendPv 一致，但是如果两者都存在，则会已该函数为准 | |
| callback.afterSendPv      |  (params: Record<string, any>) => void | 否 | 执行 sendPv 后的回调函数, 该函数的特性同 options 中配置的 afterSendPv 一致，但是如果两者都存在，则会已该函数为准 | |

用例：

```js
import { sendPV } from 'vue-umeng'

function handleSendPv() {
  const params = {
    // 上报的参数
  }
  sendPv(params, {
    beforeSendPv: () => {
      // ...
      return true
    },
    afterSendPv: () => {
      //
    }
  })
}
```

### trackEvent

自定义事件的上报

接收参数：

| 参数名      | 类型 | 是否必传| 描述 | 默认值 |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| eventCode      | string | 是 | 上报事件名 | |
| eventParams      | Record<string, any> |  是 | 上报的参数 | |
| eventType      | string |  否 | 事件类型 [详细配置参考](https://developer.umeng.com/docs/147615/detail/290919#h2-jxj-pgi-g94) | 'CLK' |
| callback      | Record<string, function> | 否 | 回调函数 | |
| callback.beforeTrackEvent      |  (eventCode: string, eventParams: Record<string, any>) => void | 否 | 执行 trackEvent 前的回调函数, 该函数的特性同 options 中配置的 beforeTrackEvent 一致，但是如果两者都存在，则会已该函数为准 | |
| callback.afterTrackEvent      |   (eventCode: string, eventParams: Record<string, any>) => void  | 否 | 执行 trackEvent 后的回调函数, 该函数的特性同 options 中配置的 afterTrackEvent 一致，但是如果两者都存在，则会已该函数为准 | |

用例：

```js
import { trackEvent } from 'vue-umeng'

function handleTrackEvent() {
 trackEvent(
    'click_client_refresh_button',
    {
      agentId: `ID:${agentId}`,
      eventName: '下拉刷新的触发事件',
    },
    'CLK',
    {
      beforeTrackEvent: () => {
        // ...
        return true
      },
      afterTrackEvent: () => {
        //
      }
    }
  )
}
```

## ts 类型的扩展

如果你开启了全局注册 mixins 则要添加 vue 的类型扩展

```js
// vue-custom.d.ts
import type { UMengMixinPropertiesType } from 'vue-umeng'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly sendPVByUMeng: UMengMixinPropertiesType['sendPV']
    readonly trackEventByUMeng: UMengMixinPropertiesType['trackEvent']
  }
}
```

## 作者

👤 **ericwan**

* Github: [@GOGOGOSIR](https://github.com/GOGOGOSIR)


## 📝 License

Copyright © 2022 [ericwan](https://github.com/GOGOGOSIR).<br />
This project is [MIT](https://github.com/GOGOGOSIR/vue-umeng/blob/master/LICENSE) licensed.

