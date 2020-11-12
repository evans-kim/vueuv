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
    <button class="bg-white p-2 shadow-md border inline-block outline-none shadow-md" @click="toggleGrid">
      <i class="icofont-2x icofont-eye"></i>
    </button>
  </div>
</template>

<script>
import createUid from "@/lib/createUniqueId";
import StoreSelector from "@/lib/StoreSelector";
import _ from "lodash"
export default {
  name: "Menubar",
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
        return StoreSelector.isSorting
      },
      set(val){
        StoreSelector.isSorting = val;
      }
    }
  },
  methods: {
    toggleGrid() {
      const now = this.$store.getters.getEditorMode.showGrid;
      this.$store.commit('setToggleEditorMode', {key: 'showGrid', value: !now})
    },
    addContent(value) {
      const cloneDeep = _.cloneDeep(value);
      cloneDeep.id = createUid();
      return cloneDeep;
    }
  }
}
</script>

<style scoped>

</style>