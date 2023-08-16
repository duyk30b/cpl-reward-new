<template>
  <div class="layout-wrapper d-flex align-items-center justify-content-around">
    <div class="layout">
      <router-view></router-view>
    </div>
    <div class="layout-footer">© CASTLE OU 2019</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import { getIllustrationsPath } from '@/core/helpers/assets'

export default defineComponent({
  name: 'auth',
  components: {},
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch(Actions.ADD_BODY_CLASSNAME, 'bg-body')
    })

    onUnmounted(() => {
      store.dispatch(Actions.REMOVE_BODY_CLASSNAME, 'bg-body')
    })

    return {
      getIllustrationsPath,
    }
  },
})
</script>

<style lang="scss">
.layout-wrapper {
  background-color: #0e61b5;
  min-height: 100vh;
  width: 100%;
  position: relative;
}
.layout {
  width: 450px;
}
.layout-footer {
  color: #ccc;
  text-align: center;
  position: absolute;
  bottom: 0;
  -webkit-transform: translate(100%, -50%);
  transform: translate(100%, -50%);
  right: 100%;
  width: 100%;
}
</style>
