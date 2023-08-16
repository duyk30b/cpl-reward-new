<template>
  <div class="section-block">
    <template v-if="!loading">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
        role="tablist"
      >
        <li class="nav-item">
          <a
            class="nav-link active"
            data-bs-toggle="tab"
            href="#by-screen"
            role="tab"
          >
            {{ $t('screenAccessPermissions') }}
            <el-tooltip effect="dark" :content="$t('screenByApiTooltip')">
              <i class="fas fa-info-circle ms-2"></i>
            </el-tooltip>
          </a>
        </li>
      </ul>
      <div class="tab-content py-8 border-start border-end border-bottom px-6">
        <div class="tab-pane active" id="by-screen">
          <div
            class="d-flex align-items-center justify-content-start pb-3 mb-3 border-bottom"
          >
            <label
              v-if="!disabled"
              for="module-screen-check-all"
              class="d-flex align-items-center cursor-pointer me-5"
            >
              <input
                type="checkbox"
                id="module-screen-check-all"
                class="me-3"
                v-model="moduleScreenCheckAll"
                :disabled="disabled"
              />
              {{ $t(`checkAll`) }}
            </label>
            <label
              for="module-screen-expand-all"
              class="d-flex align-items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="module-screen-expand-all"
                class="me-3"
                v-model="moduleScreenExpandAll"
              />
              {{ $t(`expandAll`) }}
            </label>
          </div>
          <el-collapse v-model="expandModules">
            <div class="row">
              <div
                class="col-lg-6 col-xl-4"
                v-for="(screens, module) in modules"
                :key="module"
              >
                <el-collapse-item :name="module">
                  <template #title>
                    <div
                      class="permission-group"
                      :class="{ active: moduleScreenCount(module) > 0 }"
                    >
                      <input
                        type="checkbox"
                        class="me-3"
                        :checked="isModuleChecked(module)"
                        @click="$event.stopPropagation()"
                        @change="toggleModule($event, module)"
                        :disabled="disabled"
                      />
                      <!-- Bỏ đoạn comment này nếu dùng tên theo name ở router/index.js, hiện dùng theo tên ở Menu {{ $t(`screenModule.${module}`) }}-->
                      {{ $t(`${module}`) }}
                      <span class="permission-group-badge">{{
                        moduleScreenCount(module)
                      }}</span>
                    </div>
                  </template>
                  <div
                    v-for="screen in screens"
                    :key="screen.id"
                    class="mb-1 screen-item"
                  >
                    <label
                      :for="`screen-select-${screen.id}`"
                      class="flex-grow-1 d-flex align-items-center cursor-pointer pb-2 ps-3"
                    >
                      <input
                        type="checkbox"
                        :id="`screen-select-${screen.id}`"
                        :value="screen.id"
                        :true-value="[]"
                        class="me-3"
                        v-model="inputVal"
                        :disabled="disabled"
                      />
                      <div>
                        <strong>{{
                          // $t(`screenValue.${screen.id}`)
                          $t(`${screen.heading}`)
                        }}</strong>
                        <div>
                          <small>
                            * {{ $t('requireApiScreens') }}:
                            <ul class="pl-1">
                              <li v-for="apiPr in screen.apiPrs" :key="apiPr">
                                {{ $t(`permissionValue.${apiPr}`) }}
                              </li>
                            </ul>
                          </small>
                        </div>
                      </div>
                    </label>
                  </div>
                </el-collapse-item>
              </div>
            </div>
          </el-collapse>
        </div>
      </div>
    </template>
    <div
      class="d-flex align-items-center justify-content-center py-10"
      v-if="loading"
    >
      <i class="fas fa-spinner fa-spin me-3"></i> {{ $t('loading') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ScreenDto } from '@/models/admin-permission/Screen'
import { FEATURE_MAP } from '@/core/variables/common.const'
import { arrayUnique } from '@/core/helpers/common.helper'
import routes from '@/router/index'
import DocMenuConfig from '@/core/config/MainMenuConfig'
export default defineComponent({
  emits: ['update:modelValue'],
  async mounted() {
    await this.getData()
    this.moduleScreenExpandAll = false
  },
  props: {
    modelValue: {
      type: Array as PropType<Array<number>>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    allModules() {
      return Object.keys(this.modules)
    },
    allScreenIds() {
      return this.allScreens.map((e) => e.id)
    },
    allFeatures() {
      return Object.keys(FEATURE_MAP)
    },
    inputVal: {
      get() {
        return this.modelValue || []
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    moduleScreenCheckAll: {
      get() {
        return this.inputVal?.length == this.allScreens.length
      },
      set(newValue) {
        this.inputVal = newValue ? this.allScreenIds : []
      },
    },
    moduleScreenExpandAll: {
      get() {
        return this.allModules.length == this.expandModules.length
      },
      set(newValue) {
        this.expandModules = newValue ? this.allModules : []
      },
    },
  },
  data() {
    return {
      modules: {} as any,
      allScreens: [] as ScreenDto[],
      loading: false,
      expandModules: [] as any[],
      expandFeatures: [] as any[],
      allFeatureScreenIds: arrayUnique(
        Object.values(FEATURE_MAP).reduce((result, screens) => {
          return [...result, ...screens]
        }, []),
      ),
      FEATURE_MAP,
    }
  },
  methods: {
    async getAllScreens() {
      const menuRoutes = [] as any
      let menuItems = {} as any

      try {
        let menuPages = DocMenuConfig[0].pages as any
        for (let m = 0; m < menuPages.length; m++) {
          if (!menuPages[m].sub && menuPages[m].route) {
            menuRoutes.push(menuPages[m].route)
            menuItems[menuPages[m].route] = {
              heading: menuPages[m].heading,
              sectionTitle: menuPages[m].heading,
            }
          } else {
            for (let ms = 0; ms < menuPages[m].sub.length; ms++) {
              if (!menuPages[m].sub[ms].sub && menuPages[m].sub[ms].route) {
                menuRoutes.push(menuPages[m].sub[ms].route)
                menuItems[menuPages[m].sub[ms].route] = {
                  heading: menuPages[m].sub[ms].heading,
                  sectionTitle: menuPages[m].sectionTitle,
                }
              } else {
                for (let mx = 0; mx < menuPages[m].sub[ms].sub.length; mx++) {
                  menuRoutes.push(menuPages[m].sub[ms].sub[mx].route)
                  menuItems[menuPages[m].sub[ms].sub[mx].route] = {
                    heading: menuPages[m].sub[ms].sub[mx].heading,
                    sectionTitle: menuPages[m].sub[ms].sectionTitle,
                  }
                }
              }

            }
          }
        }
      } catch (e) {
        console.log('Main menu is empty!')
      }

      let screens = [] as any
      const allRoutes = routes.getRoutes()
      for (let i = 0; i < allRoutes.length; i++) {
        // Chỉ xét các route ở menu, nếu xét tất cả route thì bỏ đoạn code này
        const route = allRoutes[i]

        const screen = route.meta.screen ?? null
        const metaPermissions = (route.meta.permissions ?? []) as number[]

        const menuUsed = menuRoutes.filter((menuRoute) => {
          const resolved = this.$router.resolve(menuRoute)
          return resolved.name == route.name
        })

        if (!menuUsed.length) {
          continue
        }

        // Lấy tên module dựa vào route.name, tuy nhiên hiện sửa để chỉ lấy từ menu nên tận dụng sectionTitle ở menu
        // let module = 'Others'
        // if (route.name) {
        //   module = route.name.toString().split('.')[0]
        // }
        menuUsed.forEach((menu) => {
          const module = menuItems[menu].sectionTitle

          if (screen) {
            screens.push({
              id: screen,
              heading: menuItems[menu].heading,
              module: module,
              description: screen,
              apiPrs: metaPermissions,
            })
          }
        })
      }
      this.allScreens = screens
      this.modules = this.allScreens.reduce((acc, cur) => {
        if (!acc[cur.module]) acc[cur.module] = []
        acc[cur.module] = [...acc[cur.module], cur]
        return acc
      }, {})
    },
    async getData() {
      await this.getAllScreens()
    },
    moduleScreenCount(module) {
      if (!this.inputVal?.length) return 0
      return this.modules[module].filter((screen) =>
        this.inputVal.find((val) => val == screen.id),
      ).length
    },
    isModuleChecked(module) {
      if (!this.inputVal?.length) return false
      return this.modules[module].every((screen) =>
        this.inputVal.find((val) => val == screen.id),
      )
    },
    toggleModule(event, module) {
      const checked = event.target.checked
      const moduleScreenIds = this.modules[module].map((screen) => screen.id)
      if (checked) {
        this.inputVal = arrayUnique([...this.inputVal, ...moduleScreenIds])
      } else {
        this.inputVal = this.inputVal.filter(
          (val) => !moduleScreenIds.includes(val),
        )
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.screen-item {
  border: 1px solid #eee;
  padding: 5px;
}

.permission-group {
  color: #cbcbcb;
  display: flex;
  display: -webkit-flex;
  align-items: center;

  .permission-group-badge {
    text-align: center;
    color: white;
    background-color: #00db00;
    border-radius: 50%;
    padding: 2px 6px;
    margin-left: 3px;
    display: none;
    font-size: 0.8em;
  }

  &.active {
    color: black;

    .permission-group-badge {
      display: inline;
    }
  }
}
</style>
