<template>
  <div
    class="modal fade"
    id="swap-setting-pairs"
    ref="settingPairsModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t('swapSettingScreen.addPair') }}
          </h5>
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fas fa-times"></i>
          </div>
        </div>

        <div class="modal-body">
          <div class="pick-pair d-flex">
            <ul
              v-for="(pairs, currency) of groupPairs"
              :key="currency"
              class="list-group col-sm-3"
            >
              <li class="list-group-item text-uppercase bg-light rounded-0">
                <div class="d-flex">
                  <label
                    class="form-check form-check-custom form-check-solid cursor-pointer"
                  >
                    <input
                      class="form-check-input"
                      name="pair_item"
                      type="checkbox"
                      :checked="allPairsGroup(currency)"
                      @click="
                        checkAllPairsGroup(currency, $event.target.checked)
                      "
                    />
                    <span class="ms-2">{{ currency }}</span>
                  </label>
                </div>
              </li>

              <li
                v-for="pair of groupPairs[`${currency}`]"
                :key="pair"
                class="list-group-item text-uppercase rounded-0"
              >
                <div class="d-flex">
                  <label
                    class="form-check form-check-custom form-check-solid cursor-pointer"
                  >
                    <input
                      class="form-check-input"
                      name="pair_item"
                      type="checkbox"
                      :value="pair"
                      v-model="checkedPairs"
                      @click="
                        checkPerPair(currency, pair, $event.target.checked)
                      "
                    />
                    <span class="ms-2">{{ pair }}</span>
                  </label>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-10 d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-primary float-right"
              @click="save"
            >
              <span class="indicator-label">
                {{ $t('save') }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { hideModal, showModal } from '@/core/helpers/dom'
import { GroupPairs } from '@/views/apps/swap-setting/definition/swap-setting.dto'

export default defineComponent({
  name: 'SwapSettingPairs',
  data: () => ({
    groupPairs: {} as GroupPairs,
    checkedPairs: [] as string[],
    settingType: '',
  }),
  methods: {
    async checkPerPair(currency, pair, checked) {
      let checkedPairs: string[] = this.checkedPairs
      if (!checked) {
        checkedPairs = this.checkedPairs.filter((pairItem) => {
          return pairItem !== pair
        })
      } else {
        checkedPairs.push(pair)
      }

      checkedPairs = Array.from(new Set(checkedPairs))
      this.checkedPairs = checkedPairs
    },
    allPairsGroup(group) {
      if (group in this.groupPairs) {
        return this.groupPairs[group].every((pair) =>
          this.checkedPairs.includes(pair),
        )
      }
      return false
    },
    checkAllPairsGroup(group, all) {
      // remove old pairs of group
      const checkedPairs = this.checkedPairs.filter((pair) => {
        return !this.groupPairs[group].includes(pair)
      })
      if (all) {
        checkedPairs.push(...this.groupPairs[group])
      }
      this.checkedPairs = checkedPairs
    },
    beforeOpen(groupPairs, checkedPairs) {
      const settingPairsModalRef: HTMLElement = this.$refs
        .settingPairsModalRef as HTMLElement
      showModal(settingPairsModalRef)
      this.groupPairs = { ...groupPairs }
      this.checkedPairs = [...checkedPairs]
    },
    save() {
      this.$emit('updateCheckedPairs', this.checkedPairs)
      const settingPairsModalRef: HTMLElement = this.$refs
        .settingPairsModalRef as HTMLElement
      hideModal(settingPairsModalRef)
    },
  },
})
</script>

<style lang="scss" scoped>
.modal {
  .modal-dialog {
    min-width: 992px;
  }
}
</style>
