<template>
  <div class="flex border shadow mb-4 p-2 bg-white">
    <div class="bold text-2xl px-2">
      Vueuv Editor
    </div>
    <draggable
        class="flex mr-2"
        :list="blocks"
        :group="{ name: 'content-render', pull: 'clone', put: false }"
        :clone="addContent"
        @start="()=>{isSorting = true;}"
    >
      <div class="bg-white p-2 shadow-md border inline-block" draggable="true"
           v-for="(block,i) in blocks" :key="i"
      > {{ block.label }}
      </div>
    </draggable>
    <vu-button @click="toggleGrid">
      <i class="icofont icofont-eye"></i>
    </vu-button>
    <vu-button @click="exportEditor">
      <i class="icofont icofont-save"></i>
    </vu-button>
    <vu-button @click="undoContent">
      <i class="icofont icofont-undo"></i>
    </vu-button>
  </div>
</template>

<script>
import createUid from "@/lib/createUniqueId";
import VuButton from "@/components/VuButton";
import * as clone from "lodash/cloneDeep"
import Draggable from 'vuedraggable';

export default {
  name: "Menubar",
  inject:['$editor'],
  components:{
    VuButton, Draggable
  },
  data() {
    return{
      blocks : [
        {
          'tag': 'text-content',
          'label': '문단',
          class: ['p-2'],
          props: {
            value: '새로운 문단'
          }
        }
      ]
    }
  },
  computed:{
    isSorting:{
      get(){
        return this.$editor.states.isSorting
      },
      set(val){
        this.$editor.states.isSorting = val;
      }
    }
  },
  methods: {
    toggleGrid() {
      this.$editor.config.showGrid = !this.$editor.config.showGrid;
    },
    addContent(value) {
      const cloneDeep = clone(value);
      cloneDeep.id = createUid();
      return cloneDeep;
    },
    exportEditor() {
      if(this.$editor.config.mode==='editable'){
        this.$editor.showRawCode();
      }else{
        this.$editor.config.mode = 'editable';
      }
    },
    undoContent() {
      this.$editor.undo();
    }
  }
}
</script>

<style scoped>

</style>