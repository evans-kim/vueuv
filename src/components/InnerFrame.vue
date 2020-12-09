<template>
  <iframe ref="iframe" :width="frame.width" :height="frame.height" class="border shadow p-2 mx-auto relative"
          :style="getStyle"></iframe>
</template>

<script lang="ts">
import {Component, Inject, Prop, Ref, Vue} from "vue-property-decorator";
import VueuvEditor from "@/components/VueuvEditor.vue";

@Component
export default class InnerFrame extends Vue{
  @Inject('$editor') readonly $editor!: VueuvEditor;
  @Prop({type: Boolean}) readonly cleanStyle!: boolean;



  @Ref() readonly iframe!: HTMLIFrameElement;

  get getFrame(): Window {
    if(!this.iframe.contentWindow){
      return null;
    }
    return this.iframe.contentWindow;
  }

  get frame() {
    return this.$editor.frame
  }

  get getStyle() {
    return {
      backgroundColor: (this.frame.backgroundColor || 'none'),
      transition: 'all ease-in-out 0.3s'
    }
  }

  appendToBody(element) {
    return this.appendToFrame(element, 'body');
  }

  appendToHead(element) {
    return this.appendToFrame(element, 'head');
  }

  appendToFrame(element, target = 'head') {
    if (typeof element === 'string') {
      this.getFrame.document[target].appendChild(this.htmlToElement(element))
      return;
    }
    this.getFrame.document[target].appendChild(element);
  }

  scrapLinks() {
    return [...document.head.getElementsByTagName('link'), ...document.body.getElementsByTagName('link')];
  }

  /**
   * note: href 값도 포함해야되지 않을까?
   */
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
  }

  public renderComponent?: null | Vue;
  lunch() {

    //헤더
    this.appendToHead('<meta name="viewport" content="width=device-width,initial-scale=1.0">');

    if (!this.cleanStyle) {
      // 컴포넌트 CSS 적용
      const str = this.scrapStyles();
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = str;
      this.appendToHead(style);

      // 도큐먼트의 css 를 스크랩
      const links = this.scrapLinks();
      links.map(link => {
        const newLink = document.createElement('link');
        newLink.href = link.href || '';
        newLink.rel = link.rel || '';
        newLink.as = link.as || '';
        this.appendToHead(newLink);
      })
    }

    this.appendToBody("<div id='render-frame' style='margin: 5px;'></div>")

    const Editor = this.$editor;

    const element = this.getFrame.document.getElementById('render-frame');

    this.renderComponent = new Vue({
      provide() {
        return {
          '$editor': Editor
        }
      },
      render(h) {
        const tagName = (Editor.options.editable) ? 'content-render' : 'content-exporter'
        return h('div', {}, [
          h(tagName, {
            props: {value: Editor.contentModel}
          }),
          h('content-style')
        ]);
      }
    }).$mount(element || this.getFrame.document.body);

  }
  htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }
  mounted() {
    this.lunch();
  }
}
</script>