<template>
  <textarea ref="editor"></textarea>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  async mounted() {
    const editor = await (window as any).ClassicEditor.create(
      this.$refs.editor,
      {},
    )
    editor.model.document.on('change:data', () => {
      this.inputVal = editor.getData()
    })
    if (this.modelValue != null) editor.setData(this.modelValue)
  },
  props: {
    modelValue: {
      type: String,
    },
    placeholder: {
      default: '',
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
})
</script>
