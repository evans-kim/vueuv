<template>
    <div v-if="isLayoutComponent" v-show="!isSorting" :style="getStyle">
      <div class="m-2">
        <div class="flex">
          <label>
            <input type="range" v-model="getStyle.opacity" min="0.1" max="1" step="0.01">
          </label>
        </div>
        <div class="flex justify-start mb-1">
          <button :class="activeClass('class')" @click="activeTab = 'class';"
                  class="helper-button rounded border mr-1 bg-white shadow focus:outline-none">Class
          </button>
          <button :class="activeClass('style')" @click="activeTab = 'style';"
                  class="helper-button rounded border mr-1 bg-white shadow focus:outline-none">Style
          </button>
          <button :class="activeClass('controller')" @click="activeTab = 'controller';"
                  class="helper-button rounded border mr-1 bg-white shadow focus:outline-none">Layout
          </button>
          <button class="helper-button rounded border mr-1 bg-white shadow focus:outline-none"
                  @click.stop="addContents">Add
          </button>
          <button class="helper-button rounded border mr-1 bg-white shadow focus:outline-none"
                  @click.stop="deleteContents">Remove
          </button>
          <button class="helper-button rounded border mr-1 bg-white shadow focus:outline-none" @click.stop="copy">
            Copy
          </button>
          <button class="helper-button rounded border mr-1 bg-white shadow focus:outline-none"
                  @click.stop="keepAsTemplate">
            Keep
          </button>
        </div>
        <div class="panel-body p-2 bg-white shadow rounded" style="max-width: 40rem;">
          <div v-if="activeTab === 'class'">
            <class-tag-input :value="getTargetClasses" @input="classHandler"></class-tag-input>
          </div>
          <div v-if="activeTab === 'style'">
            <div style="min-width: 10rem;">
              클래스 :
              <vu-button v-for="(cls, idx) in getTargetClasses" :key="idx" @click.stop="addClassToCssText(cls)">{{
                  cls
                }}
              </vu-button>
              ID :
              <vu-button @click.stop="addIdSelectorToCssText">#{{ focusedContent.value.id }}</vu-button>
            </div>
            <code-editor v-model="getTargetStyleText"></code-editor>
          </div>
          <div v-if="activeTab === 'controller'">
            <div v-for="(group, idx) in Object.keys(control)" :key="'control'+idx + $editor.renderKey">
              <h4 class="text-lg bold py-1">{{ group }}</h4>
              <vu-button v-for="(css , x) in control[group]" :key="'btn'+x" :color="hasStyle(group, control[group][x])" @click="setStyle(group, control[group][x])">
                {{ css }}
              </vu-button>
            </div>
          </div>
        </div>
        <div ref="structure" class="p-1 border shadow mt-2 bg-white" style="max-height: 300px; overflow-y: auto;">
          <content-tree v-model="$editor.contentModel.contents"></content-tree>
        </div>
      </div>
    </div>

</template>

<script>

import ClassTagInput from "@/components/ClassTagInput";
import CodeEditor from "@/components/CodeEditor";
import VuButton from "@/components/VuButton";
import createUid from "@/lib/createUniqueId.ts";
import ContentTree from "@/components/ContentTree";
import {cloneContent} from "@/lib/createUniqueId.ts";
import cssToObject from 'css-to-object'

export default {
  name: "Helper",
  inject: ['$editor'],
  components: {ContentTree, CodeEditor, ClassTagInput, VuButton},
  data() {
    return {
      activeTab: 'class',
      getStyle: {
        display: 'none',
        justifyContent: 'baseline',
        position: 'absolute',
        padding: '0.5rem',
        left: 0,
        right: 'auto',
        top: 0,
        zIndex: 10,
        opacity: 1
      },
      pointer: {
        x: 0,
        y: 0
      },
      isShowTemplate: false,
      templateName: null,
      control:{
        display:['block','inline','flex','inline-block','flow-root'],
        'justify-content': [
          'center',
          'flex-start',
          'flex-end',
          'space-between',
          'space-around'
        ],
        'align-items':[
          'flex-start',
          'baseline',
          'center',
          'flex-end',
          'stretch'
        ],
        'flex-direction':[
            'row',
            'column'
        ]
      }
    }
  },
  watch: {
    getStyleObject:{
      deep:true,
      handler(){
        //
      }
    },
    contentFocused(element) {
      if (!this.isLayoutComponent) {
        this.hide();
        return;
      }
      this.setPosition(this.$editor.targetDocument.getElementById(element.id));
      this.$nextTick(() => {
        this.scrollMoveToSelectedContent();
      })
    },
    focusedContentValue:{
      deep: true,
      handler(){
        this.resetPosition();
      }
    },
    isSorting() {
      this.resetPosition();
    }
  },
  computed: {
    focusedContent() {
      return (this.$editor.states.focusedContent) ? this.$editor.states.focusedContent.component : null;
    },
    focusedContentValue() {
      if (!this.focusedContent) return '';
      return this.focusedContent.value;
    },
    getTargetClasses() {
      return this.focusedContent.value.class || []
    },
    getStyleObject(){
      if(!this.focusedContent){
        return {};
      }
      return this.focusedContent.contentStyleObject;
    },
    getTargetStyleText: {
      get() {
        return this.focusedContent.value.cssText || ''
      },
      set(value) {
        console.log(value, 'getTargetStyleText - set');
        const object = cssToObject(value||'', {
          camelCase: false,
          numbers: false
        });
        this.updateFocusedValue(value, 'cssText')
        this.updateFocusedValue(object, 'cssObject')
      }
    },
    getContentModel() {
      return this.$editor.contentModel
    },
    contentFocused() {
      return this.$editor.states.focusedContent;
    },
    isSorting() {
      return this.$editor.states.isSorting || this.$editor.states.editingContent;
    },
    isLayoutComponent() {

      return this.contentFocused && this.focusedContent;
    },
    getIndexFromParent() {
      if (!this.focusedContent.parent) {
        return null;
      }
      return this.focusedContent.parent.value.contents.map(content => content.id).indexOf(this.focusedContent.value.id)
    },
  },
  methods: {
    resetPosition(){

      if (this.contentFocused) {
        this.$nextTick(() => {
          this.setPosition(this.$editor.targetDocument.getElementById(this.contentFocused.id))
          this.scrollMoveToSelectedContent();
        })
      }
    },
    updateValue(value) {
      this.focusedContent.updateContentValue(value);
    },
    updateFocusedValue(value, key = null) {
      this.$editor.setRollBackPoint();

      const oldValue = this.focusedContent.value;

      if (!key) {
        this.updateValue(value)
        return;
      }

      this.$set(oldValue, key, value);
      this.updateValue(oldValue)

    },
    hide() {
      this.getStyle.display = 'none';
    },
    /**
     *
     * @param {HTMLElement} element
     */
    async setPosition(element) {
      if(!element){
        return;
      }

      const editorRect = this.$editor.$refs.frame.$el.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const winY = window.scrollY;

      this.getStyle.display = 'absolute';
      this.getStyle.left = rect.x + editorRect.x + 'px';
      this.getStyle.right = 'auto';

      this.getStyle.top = rect.y + editorRect.y + rect.height + winY + 10 + 'px';
      this.getStyle.display = 'flex'
      this.getStyle.opacity = 1;
      await this.$nextTick(() => {
        const me = this.$el.getBoundingClientRect();
        // 화면을 왼쪽으로 넘어 간다면?
        const number = window.innerWidth - (me.x + me.width) - 100;
        if (number < 0 ) {
          this.getStyle.left = "auto";
          this.getStyle.right = '20px';
        } else {
          this.getStyle.right = 'auto';
        }
      });
    },
    scrollMoveToSelectedContent() {

      const div = this.$refs['structure'];
      const selectedTags = div.getElementsByClassName('selected-tag');
      if (!selectedTags.length) {
        return;
      }
      const tag = selectedTags[0];
      const tagRect = tag.getBoundingClientRect();
      const divRect = div.getBoundingClientRect();

      let top = tagRect.y - divRect.y + div.scrollTop - 20;

      if (top < 0) {
        top = 0;
      }
      div.scrollTo({top: top})
    },
    classHandler(values) {
      this.updateFocusedValue(values, 'class')
    },
    activeClass(id) {
      if (this.activeTab === id) {
        return ['active'];
      } else {
        return [];
      }
    },
    hasStyle(key, value) {
      const obj = this.focusedContent.contentStyleObject

      if (!obj)
        return null;

      if (!obj[key])
        return null;

      if (obj[key] === value){
        return 'green';
      }

      return null;
    },
    setStyle(key, value) {
      this.focusedContent.setCssObject({ [key] : value });
    },
    toggleDisplay() {
      if (this.focusedContent.value.style && this.focusedContent.value.style.display === 'flex') {
        this.setStyle('display', 'flow-root')
      } else {
        this.setStyle('display', 'flex')
      }
    },
    addContents() {
      // 하위 컨덴츠가 없다면
      this.$editor.setRollBackPoint();
      if (!this.focusedContent.value.contents) {
        this.focusedContent.parent.value.contents.map((item, index) => {
          if (item.id === this.focusedContent.value.id) {
            this.focusedContent.parent.value.contents.splice(index + 1, 0, {
              tag: 'div',
              id: createUid(),
              class: ['p-2'],
              contents: []
            })
          }
        })
        this.$editor.config.showGrid = true;
        this.$editor.refreshKey();
        return;
      }
      this.$set(this.focusedContent.value.contents, this.focusedContent.value.contents.length, {
        tag: 'div',
        id: createUid(),
        class: ['p-2'],
        contents: []
      });
      this.$editor.config.showGrid = true;
      this.$editor.refreshKey();

    },
    deleteContents() {
      this.$editor.setRollBackPoint();
      this.focusedContent.deleteContent();
    },
    copy() {
      this.$editor.setRollBackPoint();
      let i = 0;
      this.focusedContent.parent.value.contents.map((content, index) => {
        if (this.focusedContent.value === content) {
          i = index;
        }
      })
      const deep = cloneContent(this.focusedContent.value);

      this.focusedContent.parent.value.contents.splice(i, 0, deep)
    },
    addIdSelectorToCssText() {
      let cssText = "#" + this.focusedContent.value.id + "{\n  \n}";
      if(this.$editor.media.mobile){
        cssText = this.$editor.mediaQuery.mobile + "{\n" +
            "  #"+this.focusedContent.value.id+"{\n" +
            "  \n" +
            "  }\n" +
            "}";
      }
      if (this.focusedContent.value.cssText) {
        this.focusedContent.value.cssText += cssText;
      } else {
        this.getTargetStyleText = cssText;
      }
    },
    addClassToCssText(cls) {
      const cssText = "\n." + cls + "{\n  \n}";
      if (this.focusedContent.value.cssText) {
        this.focusedContent.value.cssText += cssText;
      } else {
        this.getTargetStyleText = cssText;
      }
    },
    keepAsTemplate() {
      this.$editor.$refs['templateSaver'].show();
    }
  }
}
</script>

<style lang="scss" scoped>

.helper-button {
  overflow: hidden;
  font-size: 1rem;
  transition: all ease-in 0.1s;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.helper-button:hover {
  color: rgb(66, 185, 131);
}

.active {
  border-radius: 0.5rem;
  background-color: rgb(66, 185, 131);
  color: white;
  border-color: rgb(56, 165, 121);
}

.active:hover {
  color: white;
}

</style>