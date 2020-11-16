<template>
  <draggable tag="ul" v-if="hasContents(value)"
             group="content-tree"
             ghost-class="ghost"
             handle=".node-handler"
             animation="300"
             :value="value"
             @input="(val)=>{ $emit('input', val) }" >
    <li class="pl-2" v-for="(com, idx) in value" :key="idx">
      <div v-if="com && com.id" :class="{'selected-tag':isFocused(com.id)}" class="node" :style="getStyle(com)">
        <span class="node-handler p-2" @click.stop="setSelectedContentId(com)"> :: </span>
        {{ com.tag }}#{{ com.id }}
        <span v-if="hasChildren(com)" class="toggle" @click="()=>{ isOpen = !isOpen }"> {{ isOpen ? '-' : '+' }} </span>
      </div>
      <template v-if="hasChildren(com)">
        <content-tree v-model="com.contents" v-show="isOpen"></content-tree>
      </template>
    </li>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: "ContentTree",
  components:{
    draggable
  },
  inject: ['$editor'],
  data(){
    return{
      isOpen : true
    }
  },
  props:{
    value : {
      type: Array,
      default(){return[]}
    },
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
      return  com && com.length > 0;
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
    },
    hasChildren(com) {
      return com.contents && com.contents.length;
    }
  }
}
</script>

<style scoped>
  .node{
    outline: #42b983 1px dashed;
    padding: 0.2rem;
  }
  .node-handler{
    cursor: pointer;
  }
  .toggle{
    cursor: pointer;
    border-radius: 5px;
    background-color: #606060;
    width: 20px;
    height: 20px;
    display: inline-block;
    text-align: center;
    line-height: 20px;
    color: white;
  }
</style>