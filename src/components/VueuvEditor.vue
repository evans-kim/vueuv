<template>
  <div style="position: relative;" :class="getEditorClass">
    <menubar/>
    <content-render ref="render" v-if="isEditable" :value="contentModel" @input="handleRenderInput" :key="renderKey"></content-render>
    <content-exporter ref="exporter" v-if="!isEditable" :value="contentModel"></content-exporter>
    <content-style ref="style" :content="contentModel" :raw-css="css"></content-style>
    <layout-helper ref="helper"/>
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
import LayoutHelper from "@/components/LayoutHelper.vue";
import Menubar from "@/components/Menubar";
import createUid from "@/lib/createUniqueId";
import PopLabel from "@/components/PopLabel";
import ContentRender from "@/components/ContentRender";
import * as cloneDeep from "lodash/cloneDeep"

export default {
  name: "VueuvEditor",
  components: {ContentRender, PopLabel, Menubar, LayoutHelper, ContentExporter, ContentStyle},
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
    undoStep:{
      type: [Number,String],
      default: 10
    }
  },
  watch:{
    config:{
      deep:true,
      handler(val,old){
        console.log(val,old);
        this.transit = true;
        setTimeout(()=>{
          this.transit = false;
        }, 1000)
      }
    }
  },
  data() {
    return {
      transit:false,
      config: {
        mode: 'editable',
        showGrid: true,
      },
      states: {
        selectedContent: null,
        focusedContent: null,
        editingContent: null,
        isSorting: false,
      },
      contentModel: {
        contents:[]
      },
      logs:[],
      keys:{
        ctrl:false,
        alt:false,
      },
      renderKey:'default'
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
    hasEditingContent(){
      return !!this.states.editingContent
    },
    getEditorClass() {
      return {
        'fade-in-out-leave-active' : this.transit
      }
    }
  },
  methods: {
    refreshKey(){
      this.renderKey = createUid();
    },
    undo(){
      if(!this.logs.length){
        return ;
      }
      const log = this.logs.pop();
      console.log(log);
      this.contentModel = log;
      console.log('복구');
    },
    getContentValueById(id)
    {
      return this.getContentRenderById(id, this.$refs.render).value || {};
    },
    getContentRenderById(id, vue) {
      if(!vue || typeof vue !== 'object'){
        return;
      }
      if (vue.contentId === id) {
        return vue;
      }
      let result;
      for (let i = 0; i < vue.$children.length; i++) {
        result = this.getContentRenderById(id, vue.$children[i])
        if(result){
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
        props: { value: e.textContent },
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
        props: attrs,
      }

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

      this.contentModel = content.contents[0];
    },
    handleRenderInput(val) {

      this.contentModel = val;
    }
  },
  mounted() {
    if (this.target) {
      const target = document.getElementById(this.target);
      this.convertValueProp(target.outerHTML);
      target.style.display = 'none';
    }
    if (this.value && typeof this.value === 'string') {
      this.convertValueProp(this.value);
    }

    document.addEventListener('keydown', (e) => {

      if(e.code === 'MetaLeft'){
        this.keys.ctrl = true;
      }
    })

    document.addEventListener('keyup', (e) => {

      if(e.code === 'MetaLeft'){
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