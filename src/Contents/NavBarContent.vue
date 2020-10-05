<template>
  <nav class="level">
    <div v-for="(nav, idx) in navs" class="level-item has-text-centered" :key="idx">
      <div v-html="nav"></div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBarContent",
  icon: 'icofont-interface',
  props:{
    navs:{
      type: Array,
      default(){
        return [
          `<a class="link is-info">Home</a>`,
          `<a class="link is-info">Menu</a>`,
          `<img src="https://bulma.io/images/bulma-type.png" alt="" style="height: 30px;">`,
          `<a class="link is-info">Reservations</a>`,
          `<a class="link is-info">Contact</a>`
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>