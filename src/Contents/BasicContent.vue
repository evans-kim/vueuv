<template>
  <div v-html="innerHTML" class="w-full" @click="selectContent" :dataId="getDataId" v-bind="$attrs" ></div>
</template>

<script>
export default {
  name: "BasicContent",
  icon: 'icofont-interface',
  styleProps:{
    all : {
      'display':'block',
      'width':"100%",
      'border':'1px solid red'
    }
  },
  props: {
    innerHTML: {
      type: String,
      default: '<p>내용을 입력하세요.</p>'
    }
  },
  computed: {
    getDataId() {
      return '';
    }
  },
  methods: {
    selectContent(ev) {
      this.$emit('content-selected', this);
      ev.stopPropagation();
    }
  }
}
</script>

<style scoped>

</style>