<template>
  <transition name="fade-in-out" mode="out-in">
    <div v-if="isLayoutComponent" v-show="!isSorting" :style="getStyle">
      <div class="m-2">
        <div class="flex justify-start mb-1">
          <button :class="activeClass('class')" @click="activeTab = 'class';"
                  class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">클래스
          </button>
          <button :class="activeClass('style')" @click="activeTab = 'style';"
                  class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">스타일
          </button>
          <button :class="activeClass('controller')" @click="activeTab = 'controller';"
                  class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">레이아웃
          </button>
          <button :class="activeClass('tree')" @click="activeTab = 'tree';"
                  class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">구조
          </button>
          <btn @click.stop="addContents"><i class="icofont icofont-sub-listing"></i></btn>
          <btn color="orange" @click.stop="deleteContents"><i class="icofont icofont-delete"></i></btn>
        </div>
        <div class="panel-body p-2 bg-white shadow rounded" style="max-width: 40rem;">
          <div v-if="activeTab === 'class'">
            <class-tag-input :value="getTargetClasses" @input="classHandler"></class-tag-input>
          </div>
          <div v-if="activeTab === 'style'">
            <div style="min-width: 10rem;">
              클래스 : {{ getTargetClasses }}
              ID : #{{ getTargetComponent.value.id }}
            </div>
            <code-editor v-model="getTargetStyleText"></code-editor>
          </div>
          <div v-if="activeTab === 'controller'">
            <btn @click="toggleDisplay"> flex</btn>
            |
            <btn @click="setStyle('justify-content', 'flex-start')"> left</btn>
            <btn @click="setStyle('justify-content', 'center')"> center</btn>
            <btn @click="setStyle('justify-content', 'flex-end')"> right</btn>
            <btn @click="setStyle('justify-content', 'space-between')"> around</btn>
            <btn @click="setStyle('justify-content', 'space-around')"> between</btn>
            |
            <btn @click="setStyle('align-items', 'flex-start')"> top</btn>
            <btn @click="setStyle('align-items', 'baseline')"> Baseline</btn>
            <btn @click="setStyle('align-items', 'center')"> center</btn>
            <btn @click="setStyle('align-items', 'flex-end')"> bottom</btn>
            <btn @click="setStyle('align-items', 'stretch')"> stretch</btn>
            |
            <btn @click="setStyle('flex-direction', 'row')"> Row</btn>
            <btn @click="setStyle('flex-direction', 'column')"> Column</btn>
          </div>
          <div v-if="activeTab === 'tree'" ref="structure" style="max-height: 300px; overflow-y: auto">
            <content-tree :value="$editor.contentModel"></content-tree>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import ClassTagInput from "@/components/ClassTagInput";
import CodeEditor from "@/components/CodeEditor";
import Btn from "@/components/Btn";
import createUid from "@/lib/createUniqueId";
import ContentTree from "@/components/ContentTree";

export default {
  name: "LayoutHelper",
  inject:['$editor'],
  components: {ContentTree, CodeEditor, ClassTagInput, Btn},
  data() {
    return {
      activeTab: 'class',
      getStyle: {
        display: 'none',
        justifyContent: 'baseline',
        position: 'absolute',
        padding: '0.5rem',
        left: 0,
        right:'auto',
        top: 0,
        zIndex: 10
      }
    }
  },
  watch: {
    activeTab(val) {
      if (val === 'tree') {
        this.$nextTick(() => {
          //
          this.scrollMoveToSelectedContent();

        })
      }
    },
    isChangedPosition(val, old){

      if(val && val !== old && this.activeTab === 'tree'){
        this.$nextTick(()=>{
          this.scrollMoveToSelectedContent();
        })
      }
    },
    contentFocused(element) {
      if (!this.isLayoutComponent) {
        this.hide();
        return;
      }
      this.setPosition(element.component.$el);
    },
    isSorting(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          if(this.contentFocused)
            this.setPosition(this.contentFocused.component.$el)
        }, 100)
      });
    }
  },
  computed: {
    isChangedPosition(){
      return this.getStyle.left + this.getStyle.right;
    },
    getTargetComponent() {
      return (this.$editor.states.focusedContent) ? this.$editor.states.focusedContent.component : null;
    },
    getTargetClasses() {
      return this.getTargetComponent.value.class || []
    },
    getTargetStyleText: {
      get() {
        return this.getTargetComponent.value.cssText || ''
      },
      set(value) {
        if (!this.getTargetComponent.value.cssText) {
          this.$set(this.getTargetComponent.value, 'cssText', value);
        } else {
          this.getTargetComponent.value.cssText = value;
        }
      }
    },
    getContentModel() {
      return this.$editor.contentModel
    },
    contentFocused() {
      return this.$editor.states.focusedContent;
    },
    isSorting(){
      return this.$editor.states.isSorting;
    },
    isLayoutComponent() {

      return this.contentFocused && this.getTargetComponent;
    }
  },
  methods: {
    hide() {
      this.getStyle.display = 'none';
    },
    /**
     *
     * @param {HTMLElement} element
     */
    async setPosition(element) {
      const editorRect = this.$editor.$el.getBoundingClientRect();
      const rect = element.getBoundingClientRect();

      this.getStyle.left = rect.x + 'px';
      this.getStyle.right = 'auto';

      this.getStyle.top = rect.y - editorRect.y + rect.height + 10 + 'px';
      this.getStyle.display = 'flex'

      await this.$nextTick(()=>{
        const me = this.$el.getBoundingClientRect();
        // 화면을 왼쪽으로 넘어 간다면?
        const number = window.innerWidth - ( me.x + me.width ) - 100;
        if( number < 0 ){
          this.getStyle.left = "auto";
          this.getStyle.right = '20px';
        }else{
          this.getStyle.right = 'auto';
        }
      });
    },
    scrollMoveToSelectedContent() {

      const div = this.$refs['structure'];
      const tag = div.getElementsByClassName('selected-tag')[0];
      const tagRect = tag.getBoundingClientRect();
      const divRect = div.getBoundingClientRect();

      let top = tagRect.y - divRect.y + div.scrollTop - 20;

      if(top < 0){
        top = 0;
      }
      div.scrollTo({top: top})
    },
    recursiveParents(content) {
      content.contents
      if (content.parent) {
        return this.recursiveParents(content.parent);
      }
    },
    classHandler(values) {
      this.getTargetComponent.value.class = values;
    },
    activeClass(id) {
      if (this.activeTab === id) {
        return ['text-green-600'];
      } else {
        return ['hover:text-green-600'];
      }
    },
    setStyle(key, value) {
      if (!this.getTargetComponent.value.style) {
        this.$set(this.getTargetComponent.value, 'style', {});
      }
      this.$set(this.getTargetComponent.value.style, key, value);
    },
    toggleDisplay() {
      if (this.getTargetComponent.value.style && this.getTargetComponent.value.style.display === 'flex') {
        this.setStyle('display', 'flow-root')
      } else {
        this.setStyle('display', 'flex')
      }
    },
    addContents() {
      // 컨덴츠가 없다면
      if (!this.getTargetComponent.value.contents) {
        let data = this.getTargetComponent.value;
        data = {
          tag: 'div',
          id: createUid(),
          class: ['p-2'],
          contents: [
            data
          ]
        }
        this.getTargetComponent.updateValue(data)
        this.$editor.config.showGrid = true;
        return;
      }
      this.$set(this.getTargetComponent.value.contents, this.getTargetComponent.value.contents.length, {
        tag: 'div',
        id: createUid(),
        class: ['p-2'],
        contents: []
      });

      this.$editor.config.showGrid = true;

    },
    deleteContents() {
      this.getTargetComponent.deleteContent();
    }
  }
}
</script>

<style scoped>

</style>