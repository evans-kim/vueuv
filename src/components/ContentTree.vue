<template>
  <ul v-if="hasContents(value)">
    <li class="pl-2 cursor-pointer" v-for="(com, idx) in value.contents" :key="idx" @click.stop="setSelectedContentId(com)">
      <div v-if="com && com.id" :class="{'selected-tag':isFocused(com.id)}" style="outline: #42b983 1px dashed" :style="getStyle(com)">{{ com.tag }}#{{ com.id }}</div>
      <content-tree :value="com"></content-tree>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ContentTree",
  inject: ['$editor'],
  props:{
    value : [Object, String],
  },
  computed:{
    getStates(){
      return this.$editor.states;
    }
  },
  methods: {
    isFocused(id){
      return this.getStates.focusedContent && this.getStates.focusedContent.id === id;
    },
    isSelected(id){
      return this.getStates.selectedContent && this.getStates.selectedContent === id;
    },
    hasContents(com) {
      return typeof com === 'object' && com.contents && com.contents.length > 0;
    },
    getStyle(com) {
      const styles = {};
      if(this.isFocused(com.id)){
        styles.background = 'green';
        styles.color= 'white';
      }
      if(this.isSelected(com.id)){
        styles.background = 'green';
        styles.color= 'white';
      }
      return styles;
    },
    setSelectedContentId(com) {
      if(com.id){
        const contentRender = this.$editor.getContentRenderById(com.id, this.$editor.$refs.render);
        contentRender.setFocusedContent();
      }
    }
  }
}
</script>

<style scoped>

</style>