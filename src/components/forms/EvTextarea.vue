<template>
    <textarea
        v-bind="$attrs"
        :rows="getRows"
        class="py-2 px-4 border border-main-200 focus:outline-none focus:border-gray-600 w-full"
        @change="changeHandler"
        @input="inputHandler"
        v-html="value"
    ></textarea>
</template>

<script>
import EvInput from "./EvInput";

export default {
  name: "EvTextarea",
  extends: EvInput,
  props: {
    value: null,
    autosize: {
      type: Object,
      default() {
        return {
          min: 0,
          max: 0
        }
      }
    }
  },
  methods: {
    inputHandler(e) {
      this.$emit('input', e.target.value);
    }
  },
  computed: {
    getRows() {
      if (!this.value) {
        return 0;
      }
      const count = this.value.split("\n").length;
      if (!this.autosize.min || !this.autosize.max) {
        return count;
      }
      if (count <= this.autosize.min) {
        return this.autosize.min;
      } else if (count <= this.autosize.max) {
        return count;
      } else {
        return this.autosize.max;
      }
    }
  }
}
</script>

<style scoped>

</style>
