<template>
  <div class="flex">
    <draggable
        class="flex"
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
    <btn @click="toggleGrid">
      <i class="icofont-2x icofont-eye"></i>
    </btn>
    <btn @click="exportEditor">
      <i class="icofont-2x icofont-save"></i>
    </btn>
  </div>
</template>

<script>
import createUid from "@/lib/createUniqueId";
import Btn from "@/components/Btn";
import * as clone from "lodash/cloneDeep"
import Draggable from 'vuedraggable';

export default {
  name: "Menubar",
  inject:['$editor'],
  components:{
    Btn, Draggable
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
    }
  }
}
</script>

<style scoped>

</style>