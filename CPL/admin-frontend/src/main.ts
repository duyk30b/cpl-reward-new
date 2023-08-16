import { createApp } from 'vue'
import App from './App.vue'

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import 'reflect-metadata'
import router from './router'
import store from './store'
import filters from './filters'
import libs from './libs'
import i18n from '@/core/plugins/i18n'
import '@/core/rules'

//imports for app initialization
import ApiService from '@/core/services/ApiService'
import { initApexCharts } from '@/core/plugins/apexcharts'
import { initInlineSvg } from '@/core/plugins/inline-svg'
import { initVeeValidate } from '@/core/plugins/vee-validate'
import { Notify } from 'element-plus'
import { getConfigVariables } from '@/config'
import initDirectives from '@/core/plugins/directives'

import '@/core/plugins/prismjs'
import 'bootstrap'
import { Store } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import BigNumber from 'bignumber.js'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toastr: Notify
    $store: Store<any>
  }
}

const app = createApp(App)
initDirectives(app)

app.use(store)
app.use(filters)
app.use(i18n)
app.use(libs)
initApexCharts(app)
initInlineSvg(app)
initVeeValidate()

BigNumber.config({ EXPONENTIAL_AT: [-256, 256] })

getConfigVariables().then(async () => {
  ApiService.init(app)
  // Check authenticate and refresh access token before start app
  await store.dispatch(Actions.REFRESH_ACCESS_TOKEN)

  app.use(router)
  app.mount('#app')
})
