<template>
  <div class="bg-blue-600 text-white p-2">
    <slot>
      <i class="icofont icofont-2x icofont-drag" @dragstart="dragHandler"></i>
      <i class="icofont icofont-2x icofont-sort" @dragstart="sortHandler"></i>
    </slot>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  methods: {
    dragHandler() {
      this.$emit('move', true);
    },
    sortHandler() {
      this.$emit('sort', true)
    }
  }
}
</script>

<style scoped>

</style>