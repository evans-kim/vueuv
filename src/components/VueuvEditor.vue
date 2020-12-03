<template>
  <div style="position: relative;" :class="getEditorClass" @click.stop="setDefaultSelect">
    <menubar :key="menubarKey"/>
    <div ref="responseFrame" :style="getRenderSectionStyle">
      <content-render ref="render" v-if="isEditable" :value="contentModel" @update:content="handleRenderInput"></content-render>
      <inner-frame v-else ref="exporter"></inner-frame>
      <!-- 익스포트를 아이프레임 속에 넣으면 될 듯 -->
    </div>
    <template v-if="isEditable">
      <template-saver ref="templateSaver"></template-saver>
      <helper ref="helper"></helper>
    </template>

    <content-style></content-style>
    <div class="whitespace-pre">
      {{ contentModel }}
    </div>
    <document :visible.sync="showDocument"></document>
  </div>
</template>

<script>

import Helper from "@/components/Helper.vue";
import Menubar from "@/components/Menubar";
import createUid from "@/lib/createUniqueId.ts";
import * as cloneDeep from "lodash/cloneDeep"
import TemplateSaver from "@/components/TemplateSaver";
import Document from "@/components/Document";
import InnerFrame from "@/components/InnerFrame";

export default {
  name: "VueuvEditor",
  components: {InnerFrame, Document, TemplateSaver, Menubar, Helper},
  plugins: [],
  props: {
    html: {
      type: String
    },
    css: {
      type: String
    },
    target: {
      type: [String, Object]
    },
    undoStep: {
      type: [Number, String],
      default: 10
    }
  },
  watch: {
    media: {
      deep: true,
      handler(media) {
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
    }
  },
  data() {
    return {
      transit: false,
      frame: {
        width: '100%',
        height: '900px'
      },
      media: {
        mobile: false,
        tablet: false,
        desktop: true
      },
      config: {
        editable: true,
        showGrid: true,
        showGuide: true,
      },
      states: {
        selectedContent: null,
        focusedContent: null,
        editingContent: null,
        isSorting: false,
        dragBlock: null
      },
      contentModel: {
        id:'vueuv-content-root',
        isRootContent: true,
        cssObject:{},
        contents: []
      },
      logs: [],
      keys: {
        ctrl: false,
        alt: false,
      },
      renderKey: 'default',
      menubarKey: 'menubar',
      showDocument: false
    }
  },
  provide() {
    return {
      $editor: this
    }
  },
  computed: {
    getCurrentMedia(){
      if(this.media.mobile){
        return 'mobile'
      }
      if(this.media.tablet){
        return 'tablet'
      }
      return 'desktop'
    },
    getRootRender(){
      return this.$refs.render;
    },

    mediaQuery() {
      return {
        mobile: '@media screen and (max-width: 480px)',
        tablet: '@media screen and (max-width: 1080px)',
        desktop: '#'
      }
    },

    isEditable() {
      return this.config.editable;
    },
    hasEditingContent() {
      return !!this.states.editingContent
    },
    getEditorClass() {
      return {
        'fade-in-out-leave-active': this.transit
      }
    },
    getRenderSectionStyle() {
      const style = {
        'transition' : 'all 0.3s ease-in-out'
      };
      if(this.media.desktop){
        style['width'] = '100%';
        style['margin-left'] = 'auto';
        style['margin-right'] = 'auto';
      }
      if(this.media.mobile){
        style['width'] = '480px';
        style['margin-left'] = 'auto';
        style['margin-right'] = 'auto';
      }
      if(this.media.tablet){
        style['width'] = '1020px';
        style['margin-left'] = 'auto';
        style['margin-right'] = 'auto';
      }
      return style;
    }
  },
  methods: {
    hasDragBlock() {
      return !!this.states.dragBlock
    },
    refreshMenu() {
      this.menubarKey = createUid();
    },
    refreshKey() {

      this.$nextTick(()=>{
        //this.renderKey = createUid();
      })

    },
    undo() {
      if (!this.logs.length) {
        return;
      }
      const rollback = this.logs.pop();

      rollback();
      this.refreshKey();
    },
    setRollBackPoint() {
      const clone = cloneDeep(this.contentModel);
      this.logs.push(() => {
        this.contentModel = clone;
      });
    },
    saveLog() {
      if (this.logs.length >= this.undoStep) {
        this.logs.splice(0, 1);
      }
      this.logs.push(JSON.stringify(this.contentModel));
    },
    updateContentById(id, value) {

      let oldValue = this.getContentRenderById(id);

      oldValue = value;
    },
    getContentValueById(id) {
      const contentRenderById = this.getContentRenderById(id, this.getRootRender);
      return contentRenderById.value || {};
    },
    getContentRenderHas(value, parent=null){
      if(!parent){
        parent = this.contentModel;
      }
      if(!parent || !parent.contents){
        return null;
      }
      for (let i = 0; i < parent.contents.length; i++) {
        console.log(parent.contents[i]);
        const content = parent.contents[i];
        if(value === content){
          return parent;
        }
        return this.getContentRenderHas(value, content)
      }
    },
    /**
     * @param {string} id
     * @param {ContentRender} vue
     */
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
    },
    exportHtml(){
      this.config.editable = false;
      this.$nextTick(()=>{
        let width = parseInt( this.frame.width );
        if(this.frame.width === '100%'){
          width = window.innerWidth;
        }
        const myWindow = window.open("", "export", `width=${width},height=800px`);
        const docu = this.$refs.exporter.$el.contentWindow.document;

        myWindow.document.head.innerHTML = docu.head.innerHTML;
        myWindow.document.body.innerHTML = docu.body.innerHTML;
      })
    },
    async showRawCode() {
      this.config.mode = 'export';
      const code = {
        html: '',
        css: '',
      }
      await this.$nextTick(() => {
        code.html = this.getHtml();
        code.css = this.getCSS();
      })
      this.$emit('input', code.html + `<style type="text/css">${code.css}</style>`);
    },
    getHtml() {
      const ref = this.$refs.frame;
      return ref.$el.outerHTML
    },
    getCSS() {
      const ref = this.$refs['style'];
      return ref.$el.innerText;
    },
    /** Parsing HTML **/
    parseNode(e) {
      switch (e.nodeType) {
        case 3:
          return this.parseTextElement(e)
        default:
          return this.parseElement(e)
      }
    },
    parseTextElement(e) {
      return {
        tag: 'inner-text',
        id: createUid(),
        class: [],
        props: {value: e.textContent},
      }
    },
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
      };

      if (e.childNodes) {
        model.contents = Array.from(e.childNodes, this.parseNode)
      }

      return model;
    },
    /** Parsing HTML END **/
    convertValueProp(htmlString) {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlString, 'text/html');
      const body = htmlDoc.getElementsByTagName('body');
      const content = this.parseNode(body[0]);
      this.$set(this.contentModel.contents, 0, ...content.contents)
      //this.contentModel.contents = content.contents;
    },
    handleRenderInput(val) {
      this.contentModel = val;
    },
    setDefaultSelect() {
      this.states.selectedContent = null;
    }
  },
  mounted() {
    if (this.target) {
      const target = document.getElementById(this.target);
      this.convertValueProp(target.outerHTML);
      target.style.display = 'none';
    }

    document.addEventListener('keydown', (e) => {

      if (e.metaKey && e.key === 'z') {
        this.undo();
      }
    })
  },
  destroyed() {
    //
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