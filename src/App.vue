<template>
  <div id="app" class="relative bg-gray-100 min-h-screen">
    <vueuv-editor target="test-promotion-page"></vueuv-editor>
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