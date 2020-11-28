<template>
  <iframe ref="frame" :width="frame.width" :height="frame.height" class="border shadow p-2 mx-auto" :style="getStyle"></iframe>
</template>

<script>
import Vue from "vue";

export default {
  inject:['$editor'],
  name: "InnerFrame",
  data(){
    return{
      renderComponent:null
    }
  },
  computed:{
    getFrame(){
      return this.$refs.frame.contentWindow;
    },
    frame(){
      return this.$editor.frame
    },
    getStyle() {
      return{
        backgroundColor: (this.frame.backgroundColor || 'none'),
        transition: 'all ease-in-out 0.3s'
      }
    }
  },
  methods:{
    appendToBody(element){
      return this.appendToFrame(element, 'body');
    },
    appendToHead(element){
      return this.appendToFrame(element, 'head');
    },
    appendToFrame(element, target='head'){
      if(typeof element === 'string'){
        this.getFrame.document[target].appendChild(this.htmlToElement(element))
        return ;
      }
      this.getFrame.document[target].appendChild(element);
    },
    scrapStyles() {
      let str = '';
      Array.prototype.forEach.call(document.styleSheets, function (s) {
        if (s.href) {
          return;
        }
        Array.prototype.forEach.call(s.cssRules, function (r) {
          str += r.cssText
        });
      });
      return str;
    },
    lunch() {
      //헤더
      this.appendToHead('<meta name="viewport" content="width=device-width,initial-scale=1.0">');

      // 컴포넌트 CSS 적용
      const str = this.scrapStyles();
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = str;
      this.appendToHead(style)
      this.getFrame.document.body.style.margin = "4px";


      const Editor = this.$editor;

      this.renderComponent = new Vue({
        provide(){
          return{
            '$editor' : Editor
          }
        },
        render(h){
          const tagName = (Editor.config.editable) ? 'content-render' : 'content-exporter'
          return h('div',{}, [
            h('content-style', {props:{content: Editor.contentModel },key:Editor.renderKey + 'menu' }),
            h(tagName, {
              props:{value: Editor.contentModel},
              on:{
                'update:content':Editor.handleRenderInput
              },
              key:Editor.renderKey}),
          ]);
        }
      }).$mount();

      this.appendToBody( this.renderComponent.$el )
    },
    htmlToElement(html) {
      const template = document.createElement('template');
      html = html.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html;
      return template.content.firstChild;
    }
  },
  mounted() {
    this.lunch();
  }
}
</script>