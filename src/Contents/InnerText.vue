<template>
  <div v-html="value" :contentEditable="isEdited" @click="$listeners.click" @mouseover="$listeners.mouseover" @dblclick="$listeners.dblclick"></div>
</template>
<script>
export default {
  name: "InnerText",
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
      console.log('on')
      this.isEdited = true;
    },
    disableEdit() {
      const args = this.$el.innerHTML;
      console.log(args);
      this.$emit('update:value', args);
      this.isEdited = false;
    },
  },
  mounted() {
    console.log(this.$listeners)
  }
}
</script>

<style scoped>

</style>