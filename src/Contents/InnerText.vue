<template>
  <span v-html="value" :contentEditable="isEdited" v-vueuv-content></span>
</template>
<script>
export default {
  name: "InnerText",
  provide: ['$editor'],
  label: "기본텍스트",
  contentDefault: null,
  props: {
    value: {
      type: String
    },
    contentRender: {
      type: Object
    }
  },
  render(h) {
    if (!this.$editor.config.editable) {
      return this._v(this.value)
    }
    if (!this.isEdited) {
      return h('span', {
        directives: [
          {
            name: 'vueuv-content'
          }
        ]
      }, [this.value]);
    }
    return h('input', {attrs:{ contenteditable: true, value:this.value, nativeOn:{input:this.inputHandler} }});
  },
  data() {
    return {
      isEdited: false
    }
  },
  methods: {
    getIndexFromParent(){
      return this.contentRender.value.contents.indexOf(this.value);
    },
    enableEdit() {

      this.isEdited = true;
    },
    disableEdit() {
      const args = this.$el.innerHTML;

      this.isEdited = false;
    },
    inputHandler(e) {
      this.contentRender.splice(this.getIndexFromParent(), 1, e.target.value);
      this.contentRender.refreshValue();
    }
  }
}
</script>

<style scoped>

</style>