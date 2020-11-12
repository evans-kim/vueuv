<template>
  <div id="app" class="relative bg-gray-200 min-h-screen">
    <div class="w-full p-4">
      <menubar></menubar>
    </div>
    <div class="flex items-stretch">
      <div ref="renderer" class="min-h-screen w-full">

        <div id="document-editor" class="relative w-full" :class="editorClass" @drop="addContent" @dragover.prevent>
          <content-render v-model="doc" />
        </div>
        <layout-helper :document="doc"></layout-helper>
        <div class="flex m-2 p-2 bg-white shadow border rounded">
          <h2></h2>
          <div class="whitespace-pre">
            {{ doc }}
          </div>

        </div>
      </div>
    </div>

    <content-style :value="doc"></content-style>
  </div>
</template>
<script>

import ContentStyle from "@/Contents/ContentStyle";
import AppAccess from "@/mixins/AppAccess";
import Menubar from "@/components/Menubar";
import LayoutHelper from "@/components/LayoutHelper";

export default {
  name: 'VuePageBuilder',
  components: {
    LayoutHelper,
    Menubar,
    ContentStyle
  },
  mixins: [
    AppAccess
  ],
  data() {
    return {
      section: 'Contents',
      /**
       *
       **/
      doc: {

        tag: 'div',
        class: ['p-2'],
        id: 'test-main-layout',
        cssText: '#test-main-layout{ background: #e1e2e3; }',
        contents: [
          {
            tag: 'text-content',
            class: ['p-2'],
            props: {
              value: '새로운 텍스트 에디터 -1',
            }
          },
          {
            tag: 'text-content',
            class: ['p-2'],
            props: {
              value: '새로운 텍스트 에디터 -6',
            }
          }
        ]
      },
      hideGuide: null,
      styleText: '#app { color: blue; border: 1px solid #606060 }'
    }
  },
  computed: {
    HasSelected() {
      return this.selectedContent;
    },
    media() {
      return this.$store.getters.getMedia.toUpperCase();
    }
    ,
    panelStyle() {
      const height = window.innerHeight;
      return {
        height: (height - 100) + 'px',
        width: '360px'
      }
    },
    editorClass() {
      return{
        'show-guide' : this.$store.getters.getEditorMode.showGrid || this.$store.getters.isSorting,
        'hide-guide' : this.hideGuide
      }
    }
  },
  watch:{
    editorClass(val,old){
      if(old['show-guide'] && !val['show-guide']){
        this.hideGuide = true;
        setTimeout(()=>{
          this.hideGuide = false;
        },1000);
      }
    }
  },
  methods: {
    showGuide(e){

      if(e.keyCode === 71){
        this.isGuideShown = !this.isGuideShown
      }
    },
    getActivePanelClass(name) {
      return {'text-gray-500': this.section !== name, 'bg-gray-200': this.section !== name}
    }
    ,
    setMedia(value) {
      this.$store.commit('setMedia', value.toLowerCase());
    },
    addContent(ev) {
      if (!this.dragComponent) {
        return;
      }
      this.doc.contents.push(this.$store.getters.getDragComponent);
      this.dragComponent = null;
      ev.stopPropagation();
    }
  }
}
</script>
<style lang="scss">

.you-custom-theme-class .margin {
  background-color: rgba(148, 80, 129, .2);
}

.you-custom-theme-class .border {
  background-color: rgba(60, 60, 60, 0.2);
}

.you-custom-theme-class .padding {
  background-color: rgb(35, 91, 36, 0.2);
}

.you-custom-theme-class .content {
  background-color: rgba(50, 50, 180, 0.2);
}

.show-guide *[data-type='sorter']{
  outline: 1px dashed #606060;
  padding: 18px;
  transition: all ease-in-out 300ms;
}
.hide-guide *[data-type='sorter']{
  transition: all ease-in-out 300ms;
}
.fade-in-out-enter-active, .fade-in-out-leave-active {
  transition: all .3s ease-in-out;
}
.fade-in-out-enter, .fade-in-out-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>