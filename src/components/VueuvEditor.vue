<template>
  <div class="transit">
    <menubar/>
    <content-render ref="editor" v-if="isEditable" v-model="contentModel"></content-render>
    <content-exporter ref="exporter" v-else :value="contentModel"></content-exporter>
    <content-style ref="style" :value="contentModel"></content-style>
    <layout-helper/>
  </div>
</template>

<script>
import ContentStyle from "@/components/ContentStyle.vue";
import ContentRender from "@/components/ContentRender.vue";
import ContentExporter from "@/components/ContentExporter.vue";
import LayoutHelper from "@/components/LayoutHelper.vue";
import Menubar from "@/components/Menubar";
import createUid from "@/lib/createUniqueId";

export default {
  name: "VueuvEditor",
  components: {Menubar, LayoutHelper, ContentExporter, ContentRender, ContentStyle},
  props: {
    value:{
      type: String
    }
  },
  data() {
    return {
      config: {
        mode: 'editable',
        showGrid: false,
      },
      states: {
        selectedContent: null,
        focusedContent: null,
        editingContent: null,
        isSorting: false,
      },
      contentModel: {}
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
    }
  },
  methods: {
    async showRawCode(){
      this.config.mode = 'export';
      const code = {
        html : '',
        css : '',
      }
      await this.$nextTick(()=>{
        code.html = this.getHtml();
        code.css = this.getCSS();
      })
      console.log(code);
      this.$emit('input', code);
    },
    getHtml() {
      const ref = this.$refs['exporter'];
      return ref.$el.outerHTML
    },
    getCSS() {
      const ref = this.$refs['style'];
      return ref.$el.innerText;
    },
    parseNode(e){
      switch (e.nodeType) {
        case 3:  return this.parseTextElement(e)
        default: return this.parseElement(e)
      }
    },
    parseTextElement(e){
      return e.textContent;
    },
    parseElement(e){
      const attrs = Object.fromEntries( Array.from(e.attributes, ({name, value}) => {
        if (name === 'class'){
          return [name, value.split(' ') ]
        }
        return [name, value]
      }) );
      return {
        tag: e.tagName,
        id: attrs.id || createUid(),
        class: attrs.class || [],
        contents: Array.from(e.childNodes, this.parseNode)
      }
    },
    parseHtml(element){
      return this.parseNode(element)
    },
    convertValueProp(){
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(this.value, 'text/html');
      const body = htmlDoc.getElementsByTagName('body');
      const content = this.parseHtml(body[0]).contents[0];
      this.contentModel = Object.assign({}, content);
    }
  },
  mounted() {
    if( this.value && typeof this.value === 'string') {
      this.convertValueProp();
    }
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