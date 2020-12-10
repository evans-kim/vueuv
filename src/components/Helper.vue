<template>
  <div v-if="isLayoutComponent" v-show="!isEditing" :style="getStyle">
    <div class="m-2">
      <div class="flex">
        <label>
          <input type="range" v-model="getStyle.opacity" min="0.1" max="1" step="0.01">
        </label>
      </div>
      <div class="flex justify-between mb-1">
        <div>
          <button :class="activeClass('style')" @click="activeTab = 'style';"
                  class="helper-button rounded border mr-1 bg-white shadow focus:outline-none">Style
          </button>
          <button :class="activeClass('controller')" @click="activeTab = 'controller';"
                  class="helper-button rounded border mr-1 bg-white shadow focus:outline-none">Layout
          </button>
        </div>
        <div>
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
      </div>
      <div class="panel-body p-2 bg-white shadow rounded" style="max-width: 40rem;">
        <div v-if="activeTab === 'style'">
          <style-text-editor ref="style-editor"></style-text-editor>
        </div>
        <div v-if="activeTab === 'controller'">
          <style-controller ref="style-controller"></style-controller>
        </div>
      </div>
      <div ref="structure" class="p-1 border shadow mt-2 bg-white" style="max-height: 300px; overflow-y: auto;">
        <content-tree v-model="$editor.contentModel.contents"></content-tree>
      </div>
    </div>
  </div>

</template>

<script lang="ts">

import createUid, {cloneContent} from "@/lib/createUniqueId.ts";
import ContentTree from "@/components/ContentTree.vue";
import StyleController from "@/components/StyleController.vue";
import StyleTextEditor from "@/components/StyleTextEditor.vue";
import {Component, Inject, InjectReactive, Watch} from "vue-property-decorator";
import Vue from "vue";
import ContentRender from "@/components/ContentRender.vue";
import TemplateSaver from "@/components/TemplateSaver.vue";
import VueuvEditor from "@/components/VueuvEditor.vue";

@Component({
  components: {StyleTextEditor, StyleController, ContentTree},
  data() {
    return {}
  },
  watch: {}
})
export default class Helper extends Vue {
  @Inject('$editor') readonly $editor!: VueuvEditor

  //DATA
  activeTab = 'style';
  getStyle = {
    display: 'none',
    justifyContent: 'baseline',
    position: 'absolute',
    minWidth: '500px',
    left: 0 as number | string,
    right: 'auto' as number | string,
    top: 0 as number | string,
    zIndex: 10,
    opacity: 1
  };
  pointer = {
    x: 0,
    y: 0
  };

  //watch
  @Watch('editorMedia')
  watchEditorMedia(media) {
    if (!this.getFocusedContent) {
      return;
    }
    this.$nextTick(() => {
      setTimeout(() => {
        if(!this.getFocusedContent){
          return;
        }
        if(!this.getFocusedContent.component){
          return;
        }
        this.setPosition(this.getFocusedContent.component.$el);
        this.scrollMoveToSelectedContent();
      }, 400)
    })
  }

  @Watch('contentFocused')
  watchContentFocused(element) {
    if (!this.isLayoutComponent) {
      this.hide();
      return;
    }
    this.setPosition(element.component.$el);
    this.$nextTick(() => {
      this.scrollMoveToSelectedContent();
    })
  }

  @Watch('focusedContentValue', {deep: true})
  watchFocusedContentValue() {
    this.resetPosition();
  }

  get focusedContent(): ContentRender | null {

    if(!this.$editor.contentStates.focusedContent || !this.$editor.contentStates.focusedContent.component){
      return null;
    }
    return this.$editor.contentStates.focusedContent.component;
  }

  get focusedContentValue() {
    if (!this.focusedContent) return '';

    return this.focusedContent.value;
  }

  get editorMedia() {
    return this.$editor.getCurrentMedia
  }

  get getContentModel() {
    return this.$editor.contentModel
  }

  get getFocusedContent() {
    return this.$editor.contentStates.focusedContent;
  }

  get isEditing() {
    return this.$editor.contentStates.editingContent;
  }

  get isLayoutComponent() {

    return this.getFocusedContent && !this.isEditing;
  }

  get getIndexFromParent() {
    if (!this.focusedContent) {
      return null;
    }
    if(!this.focusedContent.parentValue?.contents){
      return null;
    }
    return this.focusedContent.parentValue?.contents.map(content => content.id).indexOf(this.focusedContent.getValue.id)
  }

  resetPosition() {

    if (this.isLayoutComponent) {
      this.$nextTick(() => {
        if(!this.getFocusedContent){
          return;
        }
        this.setPosition(this.getFocusedContent.component.$el)
        this.scrollMoveToSelectedContent();
      })
    }
  }

  hide() {
    this.getStyle.display = 'none';
  }

  /**
   *
   * @param {HTMLElement} element
   */
  async setPosition(element) {
    if (!element || !this.$el) {
      return;
    }
    await this.$nextTick();

    const editorRect = this.$editor.$el.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const me = this.$el.getBoundingClientRect();

    this.getStyle.position = 'absolute';
    let pointX = rect.x + (rect.width / 2) - (me.width / 2) - editorRect.x;
    if (pointX < 10) {
      pointX = 10;
    }
    this.getStyle.left = pointX + 'px';
    this.getStyle.right = 'auto';
    this.getStyle.top = rect.y - editorRect.y + rect.height + 20 + 'px';
    this.getStyle.opacity = 1;

    await this.$nextTick(() => {


      // 화면을 왼쪽으로 넘어 간다면?
      const number = window.innerWidth - (pointX + me.width);
      if (number < 0) {
        this.getStyle.left = "auto";
        this.getStyle.right = '20px';
      } else {
        this.getStyle.right = 'auto';
      }
    });
  }

  scrollMoveToSelectedContent() {

    const div = this.$refs['structure'] as HTMLElement;
    if (!div) {
      return;
    }
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
  }

  activeClass(id) {
    if (this.activeTab === id) {
      return ['active'];
    } else {
      return [];
    }
  }

  addContents() {
    if(!this.focusedContent){
      return;
    }

    this.$editor.setRollBackPoint();

    if (!this.focusedContent.getValue.contents) {

      this.parentContents.map((item, index) => {
        if ( this.focusedContent && item.id === this.focusedContent.getValue.id) {
          this.parentContents.splice(index + 1, 0, cloneContent({
            tag: 'div',
            class: ['p-2'],
            contents: []
          }))
        }
      })
      this.$editor.options.showGrid = true;
      return;
    }
    this.$set(this.focusedContent.getValue.contents, this.focusedContent.getValue.contents.length, cloneContent({
      tag: 'div',
      id: createUid(),
      class: ['p-2'],
      contents: []
    }));
    this.$editor.options.showGrid = true;
  }
  get parentContents(){
    if(!this.focusedContent || !this.focusedContent.parentValue?.contents){
      return [];
    }
    return this.focusedContent.parentValue.contents;
  }
  deleteContents() {
    this.$editor.setRollBackPoint();
    let i = 0;
    this.parentContents.map((content, index) => {
      if (this.focusedContent && this.focusedContent.getValue === content) {
        i = index;
      }
    })
    this.parentContents.splice(i, 1)
  }

  copy() {
    this.$editor.setRollBackPoint();
    let i = 0;
    this.parentContents.map((content, index) => {
      if (this.focusedContent && this.focusedContent.value === content) {
        i = index;
      }
    })
    const deep = cloneContent(this.focusedContent && this.focusedContent.value);

    this.parentContents.splice(i, 0, deep)
  }

  keepAsTemplate() {
    const saver = this.$editor.$refs['templateSaver'] as TemplateSaver;
    saver.show();
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