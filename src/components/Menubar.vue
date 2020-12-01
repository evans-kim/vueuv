<template>
  <div class="flex border shadow p-2 bg-white">
    <div class="bold text-2xl">
      Vueuv Editor
    </div>
    <div class="mx-2">
      Contents
      <div class="flex" ref="sortable">
        <div class="bg-white p-1 shadow-md border inline-block"
             v-for="(block,i) in getBlocks" :key="i" :data-block-index="i"
        > {{ block.label }}
        </div>
      </div>
    </div>
    <div class="mx-2">
      Media
      <toggle-group v-model="$editor.media" unique></toggle-group>
    </div>
    <div class="mx-2">
      Config
      <toggle-group v-model="$editor.config"></toggle-group>
    </div>
    <div class="mx-2">
      Action
      <div>
        <vu-button @click="exportEditor">
          save
        </vu-button>
        <vu-button @click="undoContent">
          undo
        </vu-button>
        <vu-button @click="()=>{ $editor.showDocument = true; }">
          help
        </vu-button>
      </div>
    </div>
    <div class="mx-2">
      Templates
      <div class="flex items-center" ref="template">
        <div  class="bg-white p-1 shadow-md border inline-block" @click="deleteTemplate(template)"
             v-for="(template,i) in getTemplates" :key="'template'+i" :data-block-index="i"
        > {{ template.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import createUid, {cloneContent} from "@/lib/createUniqueId.ts";
import VuButton from "@/components/VuButton";
import * as clone from "lodash/cloneDeep"
import SortableContent from "@/lib/SortableContent";
import Vue from 'vue';
import LocalStore from "@/lib/LocalStore";
import ToggleGroup from "@/components/ToggleGroup";

export default {
  name: "Menubar",
  inject: ['$editor'],
  components: {
    ToggleGroup,
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
    },
    getTemplates() {
      const items = new LocalStore().getAll();
      return items || [];
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
      this.$editor.exportHtml();
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
          sortable.editor.states.dragBlock = block;
        },
        onEnd() {
          sortable.editor.states.dragBlock = null;
          sortable.editor.refreshKey();
        }
      });
      sortable.init(this.$refs['sortable']);
    },
    initTemplateDraggable()
    {
      const sortable = new SortableContent(this, {
        sort: true,
        group: {name: 'content-render', pull: 'clone', put: false},
        setData(dataTransfer, draggedElement) {
          const index = draggedElement.getAttribute('data-block-index');
          const template = sortable.vue.getTemplates[index];

          sortable.editor.states.dragBlock = cloneContent(template.value);
        },
        onEnd() {
          sortable.editor.states.dragBlock = null;
          console.log(sortable.editor.states.dragBlock);
        }
      });
      sortable.init(this.$refs['template']);
    },
    deleteTemplate(template) {
      this.$vueuvModal.show({
        color:'yellow',
        title: '템플릿 삭제',
        body: '"'+template.label+'" 을 삭제합니다.'
      }).then(
          ()=>{
            this.$editor.$refs['templateSaver'].deleteTemplate(template);
          }
      )

    },
    toggleGuide() {
      this.$editor.config.showGuide = !this.$editor.config.showGuide;
    }
  },
  mounted() {
    this.initSorting();
    this.initTemplateDraggable();
  },
  data() {
    return {
      showDocument: false
    }
  }
}
</script>

<style scoped>

</style>