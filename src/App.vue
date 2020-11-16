<template>
  <div id="app" class="relative bg-gray-200 min-h-screen">
    <vueuv-editor target="test-promotion-page" v-model="html"></vueuv-editor>
    <SmallPage id="test-promotion-page"/>
  </div>
</template>
<script>

import SmallPage from "@/views/SmallPage";

export default {
  name: 'VuePageBuilder',
  components: {
    SmallPage
  },
  data() {
    return {
      html: null
    }
  }
}
</script>
<style>

</style>