<template>
  <div class="tag-input-wrapper bg-white p-2 border shadow flex justify-start flex-wrap" @click.stop="focusInput">
    <span v-for="(item, idx) in value" :key="idx"
          @click.stop="removeItem(idx)"
          class="m-1 mt-0 p-1 border rounded bg-gray-200 cursor-pointer hover:bg-gray-300 shadow">
      {{ item }}
    </span>
    <input ref="input" type="text" class="tag-input-input" @keydown.enter="inputHandler"/>
  </div>
</template>

<script>
import * as uniq from 'lodash/uniq'
export default {
  name: "ClassTagInput",
  props: {
    value: {
      type: Array
    }
  },
  methods: {
    inputHandler(e) {
      const value = e.target.value;
      this.$emit('input', uniq([...this.value, value].filter(item=>item)));
      e.target.value = '';

    },
    removeItem(idx) {
      this.value.splice(idx, 1);

    },
    focusInput(e) {
      this.$refs['input'].focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-input-wrapper{
  transition: ease-in-out all 0.5ms;
}
.tag-input-input {
  height: 34px;
  width: 100%;
  padding-left: 0.5rem;
}
.tag-input-input:focus{
  outline: none;

}
</style>