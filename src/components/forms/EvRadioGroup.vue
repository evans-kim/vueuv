<template>
  <div class="flex items-center flex-no-wrap overflow-scroll">
    <label v-for="(option,idx) in options" :key="idx" :class="getActiveClass(option)"
           class="py-1 px-2 border-r-0 last:border-r text-xs cursor-pointer whitespace-nowrap">
      <input :value="getValue(option)" class="hidden" name="payment_type" type="radio" @input="inputHandler">
      {{ getLabel(option) }}
    </label>
  </div>
</template>

<script>
export default {
  name: "EvRadioGroup",
  props: {
    name: {required: true},
    value: null,
    options: {
      required: true,
      default() {
        return []
      }
    },
    valueKey: {
      default: 'value'
    },
    labelKey: {
      default: 'label'
    }
  },
  methods: {
    getValue(option) {
      if (typeof option === 'object') {
        return option[this.valueKey];
      }
      return option;
    },
    getActiveClass(option) {
      if (this.isActive(option)) {
        return ['bg-green-300', 'text-white']
      } else {
        return ['bg-white', 'border', 'text-black', 'border-main-200']
      }
    },
    isActive(option) {
      if (typeof option === 'object') {
        return option[this.valueKey] == this.value;
      }
      return option == this.value;
    },
    getLabel(option) {
      if (typeof option === 'object') {
        return option[this.labelKey];
      }
      return option;
    },
    inputHandler(e) {

      this.$emit('input', e.target.value);
    }
  }
}
</script>

<style scoped>

</style>
