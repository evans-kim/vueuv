<template>
  <button class="border bg-white rounded px-2 py-1 focus:bg-blue-600 focus:text-white focus:outline-none transition duration-200 ease-in-out"
          v-on="$listeners"
          v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "EvButton"
}
</script>

<style scoped>

</style>