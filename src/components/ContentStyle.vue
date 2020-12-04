<script>
import * as flattenDeep from 'lodash/flattenDeep';

export default {
  name: "ContentStyle",
  inject: ['$editor'],
  render(h){
    return h("style",{attrs:{type:'text/css', id:'content-styler'},domProps:{innerHTML:this.getCode}})
  },
  computed: {
    responsibleStyles(){
      if(!this.$editor.config.editable){
        return '/** non-editable **/\n';
      }
      const desktopCss = this.getCssByMedia(this.$editor.contentModel, 'desktop');

      if(this.$editor.getCurrentMedia === 'tablet'){
        desktopCss.push( this.getCssByMedia(this.$editor.contentModel, 'tablet') );
      }
      if(this.$editor.getCurrentMedia === 'mobile'){
        desktopCss.push( this.getCssByMedia(this.$editor.contentModel, 'mobile') );
      }

      const array = flattenDeep(desktopCss).filter(item => item);
      return array.join(" \n ");
    },
    parseContentStyles() {
      if(this.$editor.config.editable){
        return '/** editable **/';
      }
      const cssTexts = this.cssObjectToCssText(this.$editor.contentModel);

      const style = flattenDeep(cssTexts).filter(item => item);

      return style.join(" \n ");
    },
    getCode() {
      return this.responsibleStyles + this.parseContentStyles
    }
  },
  methods: {

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
    },
    getCssTextWithObject: function (content, media) {
      if(!content.cssObject){
        return null;
      }
      return (content.cssObject[media]) ? this.attributeToCss({['#' + content.id]: content.cssObject[media]}) : null;
    },
    getCssByMedia(content, media='desktop') {
      if(typeof content === 'string'){
        return [null];
      }
      if (content.contents && content.contents.length > 0) {
        return [this.getCssTextWithObject(content, media), ...content.contents.map(child => {
          return  this.getCssByMedia(child, media)
        })]
      }else{
        return [this.getCssTextWithObject(content, media)]
      }
    },
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
    },
    /**
     *
     * @param {ContentModel} content
     * @return {*}
     */
    cssObjectToCssText(content) {

      if(typeof content === 'string'){
        return null;
      }
      const styles = Object.entries(content.cssObject).map( ([media, value]) => {

        if (!value) {
          return null;
        }
        if(media === 'desktop'){
          return this.attributeToCss({['#'+content.id]:value})
        }
        const mediaQuery = this.$editor.mediaQuery[media]
        return [mediaQuery + "{\n", this.attributeToCss({['#'+content.id]:value}), "}\n"].join("");
      });
      if( !content.contents || !content.contents.length){
        return styles;
      }

      return [styles, ...content.contents.map(content=>{
        return this.cssObjectToCssText(content);
      }) ]


    },
  }
}
</script>