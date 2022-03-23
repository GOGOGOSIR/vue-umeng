# vue-umeng

基于 `vue3` 封装友盟统计

## 安装

```bash
yarn add vue-umeng
# or with npm
npm install vue-umeng
```

## 使用

```js
// main.ts
import uMeng from 'vue-umeng'
·
// ...

app.use(uMeng, {
  router, // vue-router 的实例
  mode: '当前的运行环境', // vite 使用 import.meta.env， webpack 使用 process.env.NODE_ENV 判断生产和测试环境，仅有 mode === 'production' 才会执行友盟的统计
  options: {
    appKey: '622872ea317aa8778288ca34b', // 友盟的appKey，这里可以根据不同的环境传入不同的 appKey
  },
})
```

## 配置参数

- mode 模式（必传）， type: 'production' | 'development'。
  仅在 mode 为 production 时执行友盟统计

- router 路由实例（必传）， type: Router
- options
  - appKey 友盟的 appKey 值(必传)，type: string
  - autoSendPv 是否自动发送 PV(非必传)， type: boolean，default: false
    由于友盟对于单页应用需要手动发送 pv，因此这里默认值是 false，该插件会自动在 router.afterEach 中调用 sendPv 的方法
  - debug 是否开启 debug 模式（非必传），type: boolean, default: false， [参考友盟文档](https://developer.umeng.com/docs/147615/detail/290919)
  - globalproperty 是否设置全局属性 (非必传），type: Record<string, unknown>, [参考友盟文档](https://developer.umeng.com/docs/147615/detail/290919)
  - injectGlobalMixins 是否将友盟的事件方法全局注册到 mixin 中（非必传），type: boolean, default: false
    注册的方法有：[参考友盟文档](https://developer.umeng.com/docs/147615/detail/290919)
    - sendPVByUMeng 发送 pv， type: (params: Record<string, unknown>): void
    - trackEvenByUMeng 事件上报，type: (eventCode: string, eventParams: Record<string, unknown>, eventType?: string): void
      - eventCode: 事件 ID 或 事件编码
      - eventParams: 为本次事件中上报的事件参数。其取值为一个 JSON 对象（平铺的简单对象，不能多层嵌套）
      - eventType: 事件类型，默认是方法 'CLK'

## 方法

- sendPV 同上述的 sendPVByUMeng

使用：

```js
import { sendPV } from 'vue-umeng'
```

- trackEvent 同上述的 trackEvenByUMeng

使用：

```js
import { trackEvent } from 'vue-umeng'
```

## License

[MIT](http://opensource.org/licenses/MIT)
