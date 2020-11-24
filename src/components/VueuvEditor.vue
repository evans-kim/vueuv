<template>
  <div style="position: relative;" :class="getEditorClass" @click.stop="setDefaultSelect">
    <menubar/>
    <content-render ref="render" v-if="isEditable" :value="contentModel" @input="handleRenderInput"
                    :key="renderKey"></content-render>
    <content-exporter ref="exporter" v-if="!isEditable" :value="contentModel"></content-exporter>
    <content-style ref="style" :content="contentModel" :raw-css="css"></content-style>
    <helper ref="helper" @update:content-value="updateFocusedContent"></helper>
    <pop-label :content="states.selectedContent" ref="selectLabel"/>
    <pop-label :content="states.focusedContent" ref="label"/>
    <pop-label :content="states.editingContent" color="orange" ref="label"/>
    <div class="whitespace-pre">
      {{ contentModel }}
    </div>
  </div>
</template>

<script>
import ContentStyle from "@/components/ContentStyle.vue";
import ContentExporter from "@/components/ContentExporter.vue";
import Helper from "@/components/Helper.vue";
import Menubar from "@/components/Menubar";
import createUid from "@/lib/createUniqueId";
import PopLabel from "@/components/PopLabel";
import ContentRender from "@/components/ContentRender";
import * as cloneDeep from "lodash/cloneDeep"

export default {
  name: "VueuvEditor",
  components: {ContentRender, PopLabel, Menubar, Helper, ContentExporter, ContentStyle},
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
    config: {
      deep: true,
      handler(val, old) {
        this.transit = true;
        setTimeout(() => {
          this.transit = false;
        }, 1000)
      }
    }
  },
  data() {
    return {
      transit: false,
      config: {
        mode: 'editable',
        showGrid: false,
      },
      states: {
        selectedContent: null,
        focusedContent: null,
        editingContent: null,
        isSorting: false,
        dragBlock: null
      },
      contentModel: {
        isRootContent:true,
        contents: []
      },
      logs: [],
      keys: {
        ctrl: false,
        alt: false,
      },
      renderKey: 'default'
    }
  },
  provide() {
    return {
      $editor: this
    }
  },
  computed: {
    isEditable() {
      return this.config.mode === 'editable'
    },
    hasEditingContent() {
      return !!this.states.editingContent
    },
    getEditorClass() {
      return {
        'fade-in-out-leave-active': this.transit
      }
    }
  },
  methods: {
    hasDragBlock() {
      return !!this.states.dragBlock
    },
    refreshKey() {
      this.renderKey = createUid();
      console.log(this.renderKey)
    },
    undo() {
      if (!this.logs.length) {
        return;
      }
      const rollback = this.logs.pop();
      console.log(rollback);
      rollback();
      this.refreshKey();
    },
    setRollBackPoint() {
      const clone = cloneDeep(this.contentModel);
      this.logs.push(()=>{
        this.contentModel = clone;
      });
    },
    saveLog() {
      if (this.logs.length >= this.undoStep) {
        this.logs.splice(0, 1);
      }
      this.logs.push(JSON.stringify(this.contentModel));
    },
    updateContentById(id, value){

      let oldValue = this.getContentRenderById(id);
      console.log(oldValue, value, oldValue === value);
      oldValue = value;
    },
    getContentValueById(id) {
      return this.getContentRenderById(id, this.$refs.render).value || {};
    },
    getContentRenderById(id, vue) {
      if (!vue || typeof vue !== 'object') {
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
      const ref = this.$refs['exporter'];
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
    },
    updateFocusedContent(val) {
      console.log('focusedContent', val);
    }
  },
  mounted() {
    if (this.target) {
      const target = document.getElementById(this.target);
      this.convertValueProp(target.outerHTML);
      target.style.display = 'none';
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'MetaLeft') {
        this.keys.ctrl = true;
      }
      if (e.metaKey && e.key === 'z') {
        this.undo();
      }
    })

    window.addEventListener('keyup', (e) => {

      if (e.code === 'MetaLeft') {
        this.keys.ctrl = false;
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