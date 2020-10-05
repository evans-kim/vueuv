<template>
  <input
         class="border p-2 rounded w-full border-gray-600 outline-none hover:shadow-outline active:shadow-outline transition-all transition-1000 ease-in-out"
         v-on="$listeners"
         v-bind="$attrs"
  >
</template>

<script>
export default {
  name: "EvInput",
  computed:{
    getType(){
      return this.$attrs.type || 'text'
    }
  }
}
</script>

<style scoped>

</style>