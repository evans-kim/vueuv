<template>

    <draggable
        v-if="value.contents"
        :tag="getTag"
        data-type="drag-body"
        group="content-tree"
        ghost-class="ghost"
        animation="300"
        :value="value.contents"
        :component-data="getData"
        @input="(val)=>{ $emit('input', val) }"
    >
      <content-viewer
          v-for="(content, idx) in value.contents"
          :key="idx"
          :value="content"
          @input="(val)=>{ value.contents[idx] = val }"
      >
      </content-viewer>
    </draggable>
    <component v-else :is="getTag" v-on="getSelectorEvent"/>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: "ContentViewer",
  inject:["$editor"],
  components: { draggable},
  props: {
    value: [Object, String]
  },
  computed: {
    getTag() {
      return this.value.tag || 'div'
    },
    getSelectorEvent(){
      return {
        dblclick: this.setEditingContent,
        click: this.setFocusedContent,
        mouseover: this.setSelectedContent,
      };
    },
    getData() {
      const keys = Object.keys(this.value.props || {});
      let events =  {
        dblclick: this.setEditingContent,
        click: this.setFocusedContent,
        mouseover: this.setSelectedContent,
      };
      if(keys.length){
        events = Object.fromEntries( keys.map((key) => {
          return ["update:" + key, (val) => {
            console.log(val)
            this.$set(this.value.props, key, val);
          }];
        }) )
      }

      return {
        attrs:{

          class: this.value.class || []
        },
        on: Object.assign(  events, this.getSelectorEvent),
        props:Object.assign( this.value.props || {}, {is:this.getTag})
      }
    }
  },
  methods:{
    setEditingContent(event){
      this.$editor.states.editingContent = {id:this.value.id, component: this};
      event.stopPropagation();
    },
    setFocusedContent(event){
      this.$editor.states.focusedContent = {id:this.value.id, component: this};
      event.stopPropagation();
    },
    setSelectedContent(event){
      this.$editor.states.selectedContent = {id:this.value.id, component: this};
      event.stopPropagation();
    }
  }
}
</script>

<style scoped>

</style>