<template>
  <iframe ref="frame" class="w-full"></iframe>
</template>

<script>
import Vue from 'vue';
import ContentContainer from '@/Contents/ContentContainer'
export default {
  name: "Viewer",
  $styleProps:{
    width : '100%'
  },
  props:{
    scripts:{
      type:Array
    },
    styles:{
      type:Array
    }
  },
  computed:{
    getDocument(){
      if(!this.$el){
        return null;
      }
      return this.$el.contentWindow.document || null;
    }
  },
  methods:{
    createElement(tag, props){
      let element = this.getDocument.createElement(tag);
      if(props){
        element = Object.assign(element, props);
      }
      return element;
    },
    /**
     *
     * @param {HTMLElement} target
     */
    appendToHead(target){
      this.getDocument.head.appendChild(target);
    },
    appendToBody(target){
      this.getDocument.body.appendChild(target);
    },
    addScriptTag(src){
      const script = this.createElement('link', {href:src, type:'text/javascript'})
      this.appendToHead(script)
    },
    htmlToElements(html) {
      const template = this.getDocument.createElement('template');
      html = html.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html;
      return template.content.childNodes;
    },
    addElement(tag, props){
      const div = this.createElement(tag, props)
      this.appendToBody(div);
    },
    initVue(){
      const div = this.getDocument.body.querySelector('#viewer');
      console.log(div);
      this.instance = new Vue({
        data(){
          return{
            dragComponent : null
          }
        },
        methods:{

          setSelectedContainer(container) {
            this.selectedContainer = container;
          },
          setSelectedContent(content) {
            this.selectedContent = content;
            if(content){
              this.$nextTick(() => {
                this.section = 'Panel';
              })
            }
          },
          setDragComponent(component) {
            this.dragComponent = component;
          }
        },
        render: h => h(ContentContainer)
      }).$mount(div);
    },

  },
  async mounted() {

    await this.$nextTick();
    this.htmlToElements(window.document.head.innerHTML).forEach(node=>{
      this.getDocument.head.appendChild(node);
    });

    //this.getDocument.head = window.document.head;

    this.addElement('div', {id:'viewer'});
    await this.$nextTick();
    this.initVue();
  },
  data() {
    return {
      instance: null,
      styleProps:{

      }
    }
  }
}
</script>

<style scoped>

</style>