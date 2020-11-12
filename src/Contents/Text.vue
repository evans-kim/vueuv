<template>
  <div v-html="value" :contenteditable="isEdited"></div>
</template>

<script>
export default {
  name: "TextContent",
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
      this.isEdited = false;
      this.$emit('update:value', this.$el.innerHTML);
    },
  }
}
</script>

<style scoped>

</style>