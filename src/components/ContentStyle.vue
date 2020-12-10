<script lang="ts">

import {Component, Inject, Vue} from "vue-property-decorator";
import VueuvEditor from '@/components/VueuvEditor.vue';

@Component
export default class ContentStyle extends Vue{
  @Inject('$editor') readonly $editor!: VueuvEditor

  render(h){
    return h("style",{attrs:{type:'text/css', id:'content-styler'},domProps:{innerHTML:this.getCode}})
  }

  get responsibleStyles(){
    if(!this.$editor.options.editable){
      return '/** non-editable **/\n';
    }
    const desktopCss = this.getCssByMedia(this.$editor.contentModel, 'desktop');
    const tablet = this.getCssByMedia(this.$editor.contentModel, 'tablet');
    const mobile = this.getCssByMedia(this.$editor.contentModel, 'mobile');
    const extra = this.getCssByMedia(this.$editor.contentModel, 'extra');
    switch (this.$editor.getCurrentMedia) {
      case "tablet":
        return [mobile, desktopCss, tablet, extra].join('')
      case "mobile":
        return [tablet, desktopCss, mobile, extra].join('')
      default:
        return [mobile, tablet, desktopCss, extra].join('')
    }
  }

  get parseContentStyles() {
    if(this.$editor.options.editable){
      return '/** editable **/';
    }
    const desktopCss = this.getCssByMedia(this.$editor.contentModel, 'desktop');
    const tablet = this.$editor.mediaQuery.tablet + "{\n  " + this.getCssByMedia(this.$editor.contentModel, 'tablet') + "\n}";
    const mobile = this.$editor.mediaQuery.mobile + "{\n" + this.getCssByMedia(this.$editor.contentModel, 'mobile') + "\n}";
    const extra = this.getCssByMedia(this.$editor.contentModel, 'extra');
    return [desktopCss, tablet, mobile, extra].join("\n");
  }

  get getCode() {
    return this.responsibleStyles + this.parseContentStyles
  }

  getCssText(contents) {
    return contents.map(content => {
      if(typeof content === 'string'){
        return null;
      }
      if (content.contents && content.contents.length) {
        return [content.cssText, ...this.getCssText(content.contents)]
      }
      return content.cssText || null;
    })
  }

  getCssTextWithObject(content, media){
    if(!content.cssObject || !content.cssObject[media] || Object.keys(content.cssObject[media]).length === 0){
      return null;
    }
    if(media === 'extra'){
      return (content.cssObject[media]) ? this.attributeToCss(content.cssObject[media]) : null;
    }
    return (content.cssObject[media]) ? this.attributeToCss({['#' + content.id]: content.cssObject[media]}) : null;
  }

  getCssByMedia(content, media='desktop') {
    if(typeof content === 'string'){
      return [null];
    }
    if (content.contents && content.contents.length > 0) {
      return [this.getCssTextWithObject(content, media), ...content.contents.map(child => {
        return  this.getCssByMedia(child, media)
      })].join("\n")
    }else{
      return this.getCssTextWithObject(content, media);
    }
  }

  attributeToCss(attribute, depth = 1) {
    const spaces = "  ".repeat(depth);
    return Object.keys(attribute).map(k => {
      const v = attribute[k];
      if (typeof v === 'object') {
        const toCss = this.attributeToCss(v, depth + 1);
        return `${spaces}${k} {\n  ${toCss}\n  }\n`;
      }
      return `${spaces}${k}: ${v};\n`;
    }).join("")
  }

  getCssObjectToString(content) {
    return Object.entries(this.$editor.mediaQuery).map(([media, query])=>{
      if(media === 'desktop'){
        return this.attributeToCss({['#'+content.id]:content.cssObject.desktop})
      }
      return [query + "{\n", this.attributeToCss({['#'+content.id]:content.cssObject[media]}, 2), "}\n"].join("");
    }).join("\n")
  }

  cssObjectToCssText(content) {

    if(typeof content === 'string'){
      return null;
    }
    const styles = this.getCssObjectToString(content);

    if( !content.contents || !content.contents.length){
      return [styles];
    }

    return [styles, ...content.contents.map(content=>{
      return this.cssObjectToCssText(content);
    }) ]
  }
}
</script>