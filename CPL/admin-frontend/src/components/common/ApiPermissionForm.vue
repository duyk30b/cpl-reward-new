<template>
  <div class="section-block">
    <template v-if="!loading">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
        role="tablist"
      >
        <!--        <li class="nav-item">-->
        <!--          <a-->
        <!--            class="nav-link active"-->
        <!--            data-bs-toggle="tab"-->
        <!--            href="#by-feature"-->
        <!--            role="tab"-->
        <!--          >-->
        <!--            {{ $t('permissionByFeature') }}-->
        <!--            <el-tooltip-->
        <!--              effect="dark"-->
        <!--              :content="$t('permissionByFeatureTooltip')"-->
        <!--            >-->
        <!--              <i class="fas fa-info-circle ms-2"></i>-->
        <!--            </el-tooltip>-->
        <!--          </a>-->
        <!--        </li>-->
        <li class="nav-item active">
          <a
            class="nav-link active"
            data-bs-toggle="tab"
            href="#by-api"
            role="tab"
          >
            {{ $t('permissionByApi') }}
            <el-tooltip effect="dark" :content="$t('permissionByApiTooltip')">
              <i class="fas fa-info-circle ms-2"></i>
            </el-tooltip>
          </a>
        </li>
      </ul>
      <div class="tab-content py-8 border-start border-end border-bottom px-6">
        <!--        <div class="tab-pane active" id="by-feature">-->
        <!--          <div-->
        <!--            class="d-flex align-items-center justify-content-start pb-3 mb-3 border-bottom"-->
        <!--          >-->
        <!--            <label-->
        <!--              v-if="!disabled"-->
        <!--              for="feature-check-all"-->
        <!--              class="d-flex align-items-center cursor-pointer me-5"-->
        <!--            >-->
        <!--              <input-->
        <!--                type="checkbox"-->
        <!--                id="feature-check-all"-->
        <!--                class="me-3"-->
        <!--                v-model="featureCheckAll"-->
        <!--                :disabled="disabled"-->
        <!--              />-->
        <!--              {{ $t(`checkAll`) }}-->
        <!--            </label>-->
        <!--            <label-->
        <!--              for="feature-expand-all"-->
        <!--              class="d-flex align-items-center cursor-pointer"-->
        <!--            >-->
        <!--              <input-->
        <!--                type="checkbox"-->
        <!--                id="feature-expand-all"-->
        <!--                class="me-5"-->
        <!--                v-model="featureExpandAll"-->
        <!--              />-->
        <!--              {{ $t(`expandAll`) }}-->
        <!--            </label>-->
        <!--          </div>-->
        <!--          <el-collapse v-model="expandFeatures">-->
        <!--            <div class="row">-->
        <!--              <div-->
        <!--                class="col-lg-6 col-xl-4"-->
        <!--                v-for="(permissions, feature) in FEATURE_MAP"-->
        <!--                :key="feature"-->
        <!--              >-->
        <!--                <el-collapse-item :name="feature">-->
        <!--                  <template #title>-->
        <!--                    <div-->
        <!--                      class="permission-group"-->
        <!--                      :class="{ active: featurePermissionCount(feature) > 0 }"-->
        <!--                    >-->
        <!--                      <input-->
        <!--                        type="checkbox"-->
        <!--                        class="me-3"-->
        <!--                        :checked="isFeatureChecked(feature)"-->
        <!--                        @click="$event.stopPropagation()"-->
        <!--                        @change="toggleFeature($event, feature)"-->
        <!--                        :disabled="disabled"-->
        <!--                      />-->
        <!--                      {{ $t(`featureValue.${feature}`) }}-->
        <!--                      <span class="permission-group-badge">{{-->
        <!--                        featurePermissionCount(feature)-->
        <!--                      }}</span>-->
        <!--                    </div>-->
        <!--                  </template>-->
        <!--                  <div v-for="permission in permissions" :key="permission">-->
        <!--                    <label-->
        <!--                      :for="`permission-select-${permission}`"-->
        <!--                      class="flex-grow-1 d-flex align-items-center cursor-pointer pb-2 ps-3"-->
        <!--                    >-->
        <!--                      <input-->
        <!--                        type="checkbox"-->
        <!--                        :id="`permission-select-${permission}`"-->
        <!--                        :value="permission"-->
        <!--                        :true-value="[]"-->
        <!--                        class="me-3"-->
        <!--                        v-model="inputVal"-->
        <!--                        :disabled="disabled"-->
        <!--                      />-->
        <!--                      {{ $t(`permissionValue.${permission}`) }}-->
        <!--                    </label>-->
        <!--                  </div>-->
        <!--                </el-collapse-item>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </el-collapse>-->
        <!--        </div>-->
        <div class="tab-pane active" id="by-api">
          <div
            class="d-flex align-items-center justify-content-start pb-3 mb-3 border-bottom"
          >
            <label
              v-if="!disabled"
              for="module-check-all"
              class="d-flex align-items-center cursor-pointer me-5"
            >
              <input
                type="checkbox"
                id="module-check-all"
                class="me-3"
                v-model="moduleCheckAll"
                :disabled="disabled"
              />
              {{ $t(`checkAll`) }}
            </label>
            <label
              for="module-expand-all"
              class="d-flex align-items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="module-expand-all"
                class="me-3"
                v-model="moduleExpandAll"
              />
              {{ $t(`expandAll`) }}
            </label>
          </div>
          <el-collapse v-model="expandModules">
            <div class="row">
              <div
                class="col-lg-6 col-xl-4"
                v-for="(permissions, module) in modules"
                :key="module"
              >
                <el-collapse-item :name="module">
                  <template #title>
                    <div
                      class="permission-group"
                      :class="{ active: modulePermissionCount(module) > 0 }"
                    >
                      <input
                        type="checkbox"
                        class="me-3"
                        :checked="isModuleChecked(module)"
                        @click="$event.stopPropagation()"
                        @change="toggleModule($event, module)"
                        :disabled="disabled"
                      />
                      {{ $t(`permissionModule.${module}`) }}
                      <span class="permission-group-badge">{{
                        modulePermissionCount(module)
                      }}</span>
                    </div>
                  </template>
                  <div v-for="permission in permissions" :key="permission.id">
                    <label
                      :for="`permission-select-${permission.id}`"
                      class="flex-grow-1 d-flex align-items-center cursor-pointer pb-2 ps-3"
                    >
                      <input
                        type="checkbox"
                        :id="`permission-select-${permission.id}`"
                        :value="permission.id"
                        :true-value="[]"
                        class="me-3"
                        v-model="inputVal"
                        :disabled="disabled"
                      />
                      {{ $t(`permissionValue.${permission.id}`) }}
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
import { PermissionDto } from '@/models/admin-permission/Permission'
import { PermissionService } from '@/services/PermissionService'
import { FEATURE_MAP } from '@/core/variables/common.const'
import { arrayUnique } from '@/core/helpers/common.helper'

export default defineComponent({
  emits: ['update:modelValue'],
  async mounted() {
    await this.getData()
    this.moduleExpandAll = false
    this.featureExpandAll = false
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
    allPermissionIds() {
      return this.allPermissions.map((e) => e.id)
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
    moduleCheckAll: {
      get() {
        return this.inputVal?.length == this.allPermissions.length
      },
      set(newValue) {
        this.inputVal = newValue ? this.allPermissionIds : []
      },
    },
    moduleExpandAll: {
      get() {
        return this.allModules.length == this.expandModules.length
      },
      set(newValue) {
        this.expandModules = newValue ? this.allModules : []
      },
    },
    featureCheckAll: {
      get() {
        return (
          this.inputVal &&
          this.allFeaturePermissionIds.every((permissionId) =>
            this.inputVal.find((val) => val == permissionId),
          )
        )
      },
      set(newValue) {
        this.inputVal = newValue ? this.allFeaturePermissionIds : []
      },
    },
    featureExpandAll: {
      get() {
        return this.allFeatures.length == this.expandFeatures.length
      },
      set(newValue) {
        this.expandFeatures = newValue ? this.allFeatures : []
      },
    },
  },
  data() {
    return {
      modules: {} as any,
      allPermissions: [] as PermissionDto[],
      loading: false,
      expandModules: [] as any[],
      expandFeatures: [] as any[],
      allFeaturePermissionIds: arrayUnique(
        Object.values(FEATURE_MAP).reduce((result, permissions) => {
          return [...result, ...permissions]
        }, []),
      ),
      FEATURE_MAP,
    }
  },
  methods: {
    async getAllPermissions() {
      this.loading = true
      this.allPermissions = await PermissionService.getAllPermissions()
      this.modules = this.allPermissions.reduce((acc, cur) => {
        if (!acc[cur.module]) acc[cur.module] = []
        acc[cur.module] = [...acc[cur.module], cur]
        return acc
      }, {})
      this.loading = false
    },
    async getData() {
      await this.getAllPermissions()
    },
    modulePermissionCount(module) {
      if (!this.inputVal?.length) return 0
      return this.modules[module].filter((permission) =>
        this.inputVal.find((val) => val == permission.id),
      ).length
    },
    isModuleChecked(module) {
      if (!this.inputVal?.length) return false
      return this.modules[module].every((permission) =>
        this.inputVal.find((val) => val == permission.id),
      )
    },
    toggleModule(event, module) {
      const checked = event.target.checked
      const modulePermissionIds = this.modules[module].map(
        (permission) => permission.id,
      )
      if (checked) {
        this.inputVal = arrayUnique([...this.inputVal, ...modulePermissionIds])
      } else {
        this.inputVal = this.inputVal.filter(
          (val) => !modulePermissionIds.includes(val),
        )
      }
    },
    featurePermissionCount(feature) {
      if (!this.inputVal?.length) return 0
      return FEATURE_MAP[feature].filter((permissionId) =>
        this.inputVal.find((val) => val == permissionId),
      ).length
    },
    isFeatureChecked(feature) {
      if (!this.inputVal?.length) return false
      return FEATURE_MAP[feature].every((permissionId) =>
        this.inputVal.find((val) => val == permissionId),
      )
    },
    toggleFeature(event, feature) {
      const checked = event.target.checked
      const featurePermissionIds = FEATURE_MAP[feature]
      if (checked) {
        this.inputVal = arrayUnique([...this.inputVal, ...featurePermissionIds])
      } else {
        this.inputVal = this.inputVal.filter(
          (val) => !featurePermissionIds.includes(val),
        )
      }
    },
  },
})
</script>

<style lang="scss" scoped>
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
