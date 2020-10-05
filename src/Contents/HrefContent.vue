<template>
  <a :href="href">{{innerHTML}}</a>
</template>

<script>
export default {
  name: "HrefContent",
  icon: 'icofont-interface',
  props:{
    href:{
      type: String,
      default: '/'
    },
    innerHTML: {
      type:String,
      default:'Link to '
    }
  }
}
</script>

<style scoped>

</style>