<template>
  <label class="custom-label flex py-1 justify-center items-center">
    <div
        class="bg-white border border-main-200 w-5 h-5 p-1 flex justify-center items-center focus:shadow-outline focus:outline-none"
        tabindex="0" @keypress.space.enter="handleSpace">
      <input ref="input" :checked="isChecked" :disabled="disabled" :value="value" class="hidden" type="checkbox"
             @change="handleChange">

      <svg v-show="value" class="text-gray-800 pointer-events-none" height="48" viewBox="0 0 24 24"
           width="48"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z"/>
      </svg>
    </div>
    <span class="select-none">
        <slot name="default"></slot>
    </span>
  </label>
</template>

<script>
export default {
  name: "EvCheckBox",
  data() {
    return {
      mutate: null
    }
  },
  props: {
    value: null,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$refs['input'].checked = this.value;
  },
  methods: {
    handleSpace(e) {
      this.$refs['input'].checked = !this.$refs['input'].checked;
      this.$emit('input', this.$refs['input'].checked);
    },
    handleChange(e) {
      this.$emit('input', e.target.checked);
    }
  },
  computed: {
    isChecked() {
      return (this.value) ? 'checked' : ''
    },
  }
}
</script>
