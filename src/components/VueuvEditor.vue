<template>
  <div style="position: relative;" :class="getEditorClass" @click.stop="setDefaultSelect">
    <template v-if="loadedModel">
      <menubar/>
      <div ref="responseFrame" :style="getRenderSectionStyle">
        <content-render ref="render" v-if="options.editable" :value="contentModel"
                        @update:content="handleRenderInput"></content-render>
        <inner-frame v-else ref="iframe"></inner-frame>
      </div>
      <template v-if="options.editable">
        <template-saver ref="templateSaver"></template-saver>
        <helper ref="helper"></helper>
      </template>

      <content-style ref="styler" id="styler"></content-style>

      <document :visible.sync="showDocument"></document>
    </template>
    <!-- Repository Pattern -->
    <content-repository dump ref="repository" @load="()=>{loadedModel = true;}"></content-repository>
  </div>
</template>

<script lang="ts">

import Helper from "@/components/Helper.vue";
import Menubar from "@/components/Menubar.vue";
import createUid from "@/lib/createUniqueId.ts";
import cloneDeep from "lodash/cloneDeep"
import TemplateSaver from "@/components/TemplateSaver.vue";
import Document from "@/components/Document.vue";
import InnerFrame from "@/components/InnerFrame.vue";
import {Component, Prop, Ref, Vue, Watch} from "vue-property-decorator";
import {ContentModel, EditorStates} from "@/types/VueuvTypes";
import ContentStyle from "@/components/ContentStyle.vue";
import ContentRepository from "@/components/ContentRepository.vue";

@Component({
  name: "VueuvEditor",
  components: {ContentRepository, InnerFrame, Document, TemplateSaver, Menubar, Helper},
  provide(){
    return {['$editor']: this}
  }
})
export default class VueuvEditor extends Vue {

  @Prop(String) readonly html: string | undefined;
  @Prop({type: String}) readonly css;
  @Prop({type: [String, Object]}) readonly target;
  @Prop({type: [Number, String], default: 10}) readonly undoStep;

  @Ref('templateSaver') readonly templateSaver!: TemplateSaver

  transit = false;

  frame = {
    width: '100%',
    height: '900px',
    backgroundColor: "#FFFFFF"
  };

  media = {
    mobile: false,
    tablet: false,
    desktop: true
  };

  options = {
    editable: true,
    showGrid: true,
    showGuide: true,
  };

  contentStates = {
    selectedContent: undefined,
    focusedContent: undefined,
    editingContent: undefined,
    dragBlock: undefined,
    isSorting: false,
  } as EditorStates;

  loadedModel = false;
  @Ref('repository') readonly repository!: ContentRepository

  get contentModel(){
    return this.repository?.model;
  }
  set contentModel(value){
    this.repository?.setModel(value);
  }

  logs = [] as Array<Function>;
  showDocument = false;

  @Watch('media', {deep: true})
  watchMediaHandler(media) {
    if (media.mobile) {
      this.frame.width = '480px';
    }
    if (media.desktop) {
      this.frame.width = '100%';
    }
    if (media.tablet) {
      this.frame.width = '1080px';
    }
  }

  get $editor(){
    return this;
  }
  get getCurrentMedia() {
    if (this.media.mobile) {
      return 'mobile'
    }
    if (this.media.tablet) {
      return 'tablet'
    }
    return 'desktop'
  }

  get getRootRender() {
    return this.$refs.render;
  }

  get mediaQuery() {
    return {
      desktop: '#',
      tablet: '@media screen and (max-width: 1080px)',
      mobile: '@media screen and (max-width: 480px)',
      extra: ''
    }
  }

  get getEditorClass() {
    return {
      'fade-in-out-leave-active': this.transit
    }
  }

  get getRenderSectionStyle() {
    const style = {
      'transition': 'all 0.3s ease-in-out'
    };
    if (this.media.desktop) {
      style['width'] = '100%';
      style['margin-left'] = 'auto';
      style['margin-right'] = 'auto';
    }
    if (this.media.mobile) {
      style['width'] = '480px';
      style['margin-left'] = 'auto';
      style['margin-right'] = 'auto';
    }
    if (this.media.tablet) {
      style['width'] = '1020px';
      style['margin-left'] = 'auto';
      style['margin-right'] = 'auto';
    }
    return style;
  }

  hasDragBlock() {
    return !!this.contentStates.dragBlock
  }

  undo() {
    if (!this.logs.length) {
      return;
    }
    const rollback = this.logs.pop();
    if (rollback) {
      rollback();
    }

  }

  setRollBackPoint() {
    const clone = cloneDeep(this.contentModel);
    this.logs.push(() => {
      this.contentModel = clone;
    });
  }

  getContentValueById(id) {
    const contentRenderById = this.getContentRenderById(id, this.getRootRender);
    return contentRenderById.value || {};
  }

  getContentRenderHas(value, parent: ContentModel | null) {
    if (!parent) {
      parent = this.contentModel;
    }
    if (!parent || !parent.contents) {
      return null;
    }
    for (let i = 0; i < parent.contents.length; i++) {

      const content = parent.contents[i];
      if (value === content) {
        return parent;
      }
      return this.getContentRenderHas(value, content)
    }
  }

  getContentRenderById(id, vue) {

    if (!vue || typeof vue !== 'object') {
      console.warn('this is not vue component');
      return;
    }

    if (vue.contentId === id) {
      return vue;
    }
    let result;

    for (let i = 0; i < vue.$children.length; i++) {
      result = this.getContentRenderById(id, vue.$children[i])
      if (result) {
        return result;
      }
    }
  }

  @Ref() readonly iframe!: InnerFrame

  exportHtml() {
    this.options.editable = false;
    this.$nextTick(() => {
      const width = parseInt( this.frame.width );
      const features = `width=${width},height=800`;

      const myWindow = window.open("", "export", features);
      if (!myWindow) {
        throw new Error('Window not found');
      }
      const docu = this.iframe.getFrame?.document;
      if(docu){
        myWindow.document.head.innerHTML = docu.head.innerHTML;
        myWindow.document.body.innerHTML = docu.body.innerHTML;
      }
    })
  }

  getHtml() {
    return this.iframe.getFrame?.document.body.outerHTML
  }

  @Ref() readonly styler!: ContentStyle

  getCSS() {
    return (this.styler.$el as HTMLElement).innerText;
  }

  /** Parsing HTML **/
  parseNode(e) {
    switch (e.nodeType) {
      case 3:
        return this.parseTextElement(e)
      default:
        return this.parseElement(e)
    }
  }

  parseTextElement(e) {
    return {
      tag: 'inner-text',
      id: createUid(),
      class: [],
      props: {value: e.textContent}
    } as unknown as ContentModel
  }

  /**
   * @param {Element} e
   */
  parseElement(e) {
    const attrs = Object.fromEntries(Array.from(e.attributes, ({name, value}) => {
      return [name, value]
    }));

    const id = attrs.id || createUid();
    const classes = [...e.classList];

    const tag = e.tagName.toLowerCase();

    const model = {
      tag: tag,
      id: id,
      class: classes,
      style: {},
      cssText: null,
      attrs: attrs,
      props: attrs,
      contents: []
    } as unknown as ContentModel;

    if (e.childNodes) {
      model.contents = Array.from(e.childNodes, this.parseNode)
    }

    return model;
  }

  /** Parsing HTML END **/
  convertValueProp(htmlString) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const body = htmlDoc.getElementsByTagName('body');
    this.contentModel = this.parseNode(body[0]);
  }

  handleRenderInput(val) {
    this.contentModel = val;
  }

  setDefaultSelect() {
    this.contentStates.selectedContent = undefined;
  }

  mounted() {

    if (this.target) {
      const target = document.getElementById(this.target);
      if(!target){
        return ;
      }
      this.convertValueProp(target.outerHTML);
      target.style.display = 'none';
    }

    document.addEventListener('keydown', (e) => {

      if (e.metaKey && e.key === 'z') {
        this.undo();
      }
    })
  }
}
</script>

<style scoped>

.fade-in-out-enter-active, .fade-in-out-leave-active {
  transition: all .3s ease-in-out;
}

.fade-in-out-enter, .fade-in-out-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>