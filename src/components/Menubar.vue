<template>
  <div class="flex border shadow mb-4 p-2 bg-white">
    <div class="bold text-2xl px-2">
      Vueuv Editor
    </div>
    <div class="flex" ref="sortable">
      <div class="bg-white p-2 shadow-md border inline-block"
           v-for="(block,i) in getBlocks" :key="i" :data-block-index="i"
      > {{ block.label }}
      </div>
    </div>

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
import SortableContent from "@/lib/SortableContent";
import Vue from 'vue';

export default {
  name: "Menubar",
  inject: ['$editor'],
  components: {
    VuButton
  },
  computed: {
    getBlocks() {
      return Vue.$vueuePlugins;
    },
    isSorting: {
      get() {
        return this.$editor.states.isSorting
      },
      set(val) {
        this.$editor.states.isSorting = val;
      }
    }
  },
  methods: {
    toggleGrid() {
      this.$editor.config.showGrid = !this.$editor.config.showGrid;
    },
    deepCopy(value) {
      const cloneDeep = clone(value);
      cloneDeep.id = createUid();
      return cloneDeep;
    },
    exportEditor() {
      if (this.$editor.config.mode === 'editable') {
        this.$editor.showRawCode();
      } else {
        this.$editor.config.mode = 'editable';
      }
    },
    undoContent() {
      this.$editor.undo();
    },
    camelToSnakeCase(str) {
      return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    },

    initSorting() {
      const sortable = new SortableContent(this, {
        sort: false,
        group: {name: 'content-render', pull: 'clone', put: false},
        setData(dataTransfer, draggedElement) {
          const index = draggedElement.getAttribute('data-block-index');
          const block = clone(sortable.vue.getBlocks[index].contentDefault);
          block.id = createUid();
          block.tag = sortable.vue.camelToSnakeCase(sortable.vue.getBlocks[index].name).substring(1);
          console.log(block);

              sortable.vue.$editor.states.dragBlock = block;
        },
        onEnd() {
          sortable.vue.$editor.states.dragBlock = null;
          sortable.vue.$editor.refreshKey();
        }
      });
      sortable.init(this.$refs['sortable']);
    }
  },
  mounted() {
    this.initSorting();
  }
}
</script>

<style scoped>

</style>