import { createStore } from 'vuex'
import { config } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/AuthModule'
import BodyModule from '@/store/modules/BodyModule'
import BreadcrumbsModule from '@/store/modules/BreadcrumbsModule'
import CommonSettingModule from '@/store/modules/CommonSettingModule'
import ConfigModule from '@/store/modules/ConfigModule'
import HighLowModule from '@/store/modules/HighLowModule'

config.rawError = true

const store = createStore({
  modules: {
    AuthModule,
    BodyModule,
    BreadcrumbsModule,
    ConfigModule,
    CommonSettingModule,
    HighLowModule,
  },
})

export default store
