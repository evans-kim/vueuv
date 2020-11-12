<template>
  <div id="app" class="relative bg-gray-200 min-h-screen">
    <vueuv-editor v-model="html"/>
  </div>
</template>
<script>


import VueuvEditor from "@/components/VueuvEditor";

export default {
  name: 'VuePageBuilder',
  components: {
    VueuvEditor,
  },
  data() {
    return {
      html: '<div id="main" title="ㅎㅎㅎ">TESTER <div class="p-2 m-2 bg-orange-100"> 중첩된 녀석 </div> </div>'
    }
  }
}
</script>
<style lang="scss">

.you-custom-theme-class .margin {
  background-color: rgba(148, 80, 129, .2);
}

.you-custom-theme-class .border {
  background-color: rgba(60, 60, 60, 0.2);
}

.you-custom-theme-class .padding {
  background-color: rgb(35, 91, 36, 0.2);
}

.you-custom-theme-class .content {
  background-color: rgba(50, 50, 180, 0.2);
}

</style>