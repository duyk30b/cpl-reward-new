import { FixedNumber } from 'ethers'

export default {
  mounted(el, binding) {
    const minPrecision = binding.value?.minPrecision || 0
    const maxPrecision = binding.value?.maxPrecision || 10
    const minUnit = binding.value?.minUnit || 0
    const maxUnit = binding.value?.maxUnit || 15

    const regexString = `^([0-9]{${minUnit},${maxUnit}}(\\.[0-9]{${minPrecision},${maxPrecision}})?)$`
    const regex = new RegExp(regexString)

    el.addEventListener('compositionupdate', (e) => {
      e.view.getSelection().removeAllRanges()
    })

    el.addEventListener('beforeinput', (e) => {
      const updatedString =
        e.target.value.substring(0, e.target.selectionStart) +
        (e.data ? e.data : '') +
        e.target.value.substring(e.target.selectionEnd, e.target.value.length)

      if (!regex.test(updatedString)) {
        e.preventDefault()
        return
      }
    })

    el.addEventListener('change', (e) => {
      const min = e.target.getAttribute('data-min')
        ? e.target.getAttribute('data-min')
        : 'undefined'
      const max = e.target.getAttribute('data-max')
        ? e.target.getAttribute('data-max')
        : 'undefined'

      const currentValue = FixedNumber.from(el.value || 0, 'fixed256x26')

      if (max != 'undefined') {
        const maxValue = FixedNumber.from(String(max), 'fixed256x26')
        const subValue = currentValue.subUnsafe(maxValue).toUnsafeFloat()

        if (subValue >= 0) {
          el.value = max
          el.dispatchEvent(new CustomEvent('updated'))
          return
        }
      }

      if (min == 'undefined') {
        return
      }

      const minValue = FixedNumber.from(String(min), 'fixed256x26')
      const subValue = currentValue.subUnsafe(minValue).toUnsafeFloat()

      if (subValue <= 0) {
        el.value = min
        el.dispatchEvent(new CustomEvent('updated'))
        return
      }
    })
  },
  updated(el, binding) {
    if (binding.value?.max == undefined && binding.value?.min == undefined) {
      return
    }

    if (JSON.stringify(binding.oldValue) === JSON.stringify(binding.value)) {
      return
    }

    el.setAttribute('data-min', binding.value?.min)
    el.setAttribute('data-max', binding.value?.max)
    el.dispatchEvent(new Event('change'))
  },
}
