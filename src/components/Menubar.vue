<template>
  <div class="fixed right-0 z-30 max-w-2xl" :style="{opacity: opacityValue}">
    <div class="flex flex-col border shadow p-2 bg-white">
      <div class="bold text-2xl text-center">
        Vueuv Editor
      </div>
      <div class="mx-2">
        Contents
        <div class="flex" ref="contentBlocks">
          <div class="bg-white p-1 shadow-md border inline-block"
               v-for="(block,i) in getBlocks" :key="i" :data-block-index="i"
          > {{ block.label }}
          </div>
        </div>
      </div>
      <div class="mx-2">
        Media
        <toggle-group v-model="getEditor.media" unique></toggle-group>
      </div>
      <div class="mx-2">
        Config
        <toggle-group v-model="getEditor.options"></toggle-group>
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
          <vu-button @click="()=>{ getEditor.showDocument = true; }">
            help
          </vu-button>
        </div>
      </div>
      <div class="mx-2">
        Templates
        <div class="flex items-center" ref="template">
          <div class="bg-white p-1 shadow-md border inline-block" @click="deleteTemplate(template)"
               v-for="(template,i) in getTemplates" :key="'template'+i" :data-block-index="i"
          > {{ template.label }}
          </div>
        </div>
      </div>
      <div class="mx-2">
        <label>
          <input type="range" v-model="opacityValue" min="0.1" max="1" step="0.01">
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VuButton from "@/components/VuButton.vue";
import cloneDeep from "lodash/cloneDeep"
import SortableContent, {SortableVue} from "@/lib/SortableContent";
import LocalStore from "@/lib/LocalStore";
import ToggleGroup from "@/components/ToggleGroup.vue";
import {Component, Inject, Ref, Vue} from "vue-property-decorator";
import VueuvEditor from "@/components/VueuvEditor.vue";

@Component({
  name: "Menubar",
  components: {
    ToggleGroup,
    VuButton
  },
})
export default class Menubar extends Vue {

  opacityValue = 1;

  @Inject('$editor') readonly $editor!: VueuvEditor;

  get getEditor(){
    return this.$editor;
  }
  get getBlocks() {
    return Vue.$vueuePlugins || [];
  }

  get getTemplates() {
    const items = new LocalStore().getAll();
    return items || [];
  }

  exportEditor() {
    this.$editor.exportHtml();
  }

  undoContent() {
    this.$editor.undo();
  }

  camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  @Ref() readonly contentBlocks!: HTMLElement
  initSorting() {
    const component = ()=>{
      return this;
    };

    const sortable = new SortableContent(this as unknown as SortableVue, {
      sort: false,
      group: {name: 'content-render', pull: 'clone', put: false},
      setData(dataTransfer, draggedElement) {
        const index = draggedElement.getAttribute('data-block-index');
        if(!index){
          console.warn('Data-block-index not found')
          return;
        }
        const block = cloneDeep(component().getBlocks[index].contentDefault);
        block.tag = component().camelToSnakeCase(component().getBlocks[index].name).substring(1);
        component().$editor.contentStates.dragBlock = block;
      },
      onEnd() {
        component().$editor.contentStates.dragBlock = undefined;
      }
    });
    sortable.init(this.contentBlocks);
  }

  @Ref() readonly template!: HTMLElement;
  initTemplateDraggable() {
    const component = ()=>{
      return this;
    };

    const sortable = new SortableContent(this as unknown as SortableVue, {
      sort: true,
      group: {name: 'content-render', pull: 'clone', put: false},
      setData(dataTransfer, draggedElement) {
        const index = draggedElement.getAttribute('data-block-index');
        if(!index){
          console.warn('Data-block-index not found')
          return;
        }
        sortable.editor.contentStates.dragBlock = component().getTemplates[index].value;
      },
      onEnd() {
        sortable.editor.contentStates.dragBlock = undefined;
      }
    });
    sortable.init(this.template);
  }


  deleteTemplate(template) {
    Vue.$vueuvModal.show({
      color: 'yellow',
      title: '템플릿 삭제',
      body: '"' + template.label + '" 을 삭제합니다.'
    }).then(
        () => {
          this.$editor.templateSaver.deleteTemplate(template);
        }
    )

  }

  toggleGuide() {
    this.$editor.options.showGuide = !this.$editor.options.showGuide;
  }


  mounted() {
    this.initSorting();
    this.initTemplateDraggable();
  }
}
</script>

<style scoped>

</style>