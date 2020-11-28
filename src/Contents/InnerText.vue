<template>
  <div v-html="value" :contentEditable="isEdited" v-vueuv-content></div>
</template>
<script>
export default {
  name: "InnerText",
  label: "기본텍스트",
  contentDefault:null,
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      isEdited: false
    }
  },
  methods: {
    enableEdit() {

      this.isEdited = true;
    },
    disableEdit() {
      const args = this.$el.innerHTML;
      this.$emit('update:value', args);
      this.isEdited = false;
    },
  }
}
</script>

<style scoped>

</style>