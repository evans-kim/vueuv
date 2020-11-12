<template>
  <div :class="getClass">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tag",
  props:{
    color:{
      type: String,
      default : 'gray'
    }
  },

  computed: {
    getClass() {
      return `m-1 mt-0 p-1 border rounded bg-${this.color}-200 cursor-pointer hover:bg-${this.color}-300 shadow inline`;
    }
  }
}
</script>

<style scoped>

</style>