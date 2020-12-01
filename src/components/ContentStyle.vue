<template>
  <component :is="'style'" type="text/css">
    {{ parseContentStyles }}
    {{ responsibleStyles }}
  </component>
</template>

<script>
import * as flattenDeep from 'lodash/flattenDeep';

export default {
  name: "ContentStyle",
  inject: ['$editor'],
  computed: {
    responsibleStyles(){
      if(!this.$editor.config.editable){
        return '/** non-editable **/\n';
      }
      const desktopCss = this.getCssByMedia(this.$editor.contentModel.contents, 'desktop');

      if(this.$editor.getCurrentMedia === 'tablet'){
        desktopCss.push( this.getCssByMedia(this.$editor.contentModel.contents, 'tablet') );
      }
      if(this.$editor.getCurrentMedia === 'mobile'){
        desktopCss.push( this.getCssByMedia(this.$editor.contentModel.contents, 'mobile') );
      }

      return [flattenDeep(desktopCss).filter(item => item)].join("\n").replace(",", '');
    },
    parseContentStyles() {
      if(this.$editor.config.editable){
        return '/** editable **/';
      }
      const cssTexts = this.cssObjectToCssText(this.$editor.contentModel.contents);

      const deep = flattenDeep(cssTexts).filter(item => item);

      return [this.$editor.contentModel.cssText || null, ...deep].join("\n");
    }
  },
  methods: {

    getCssText(contents) {
      return contents.map(content => {
        if (content.contents && content.contents.length) {
          return [content.cssText, ...this.getCssText(content.contents)]
        }
        return content.cssText || null;
      })
    },
    getCssByMedia(contents, media='desktop') {
      return contents.map(content => {
        if (content.contents && content.contents.length) {
          return [( content.cssObject[media] ) ? this.attributeToCss( { ['#' + content.id]: content.cssObject[media] }) : null, ...this.getCssByMedia(content.contents, media)]
        }
        return ( content.cssObject[media] ) ? this.attributeToCss( { ['#' + content.id]: content.cssObject[media] }) : null;
      })
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
      }).join("\n").replace(",", '')
    },
    cssObjectToCssText(contents) {
      return contents.map(content=>{
        if (!content.cssObject) return null;

        return Object.keys(content.cssObject).map(key => {
          const value = content.cssObject[key];
          if (!value) {
            return null;
          }
          if(key === 'desktop'){
            return this.attributeToCss({['#'+content.id]:value})
          }
          const media = this.$editor.mediaQuery[key]
          return [media + "{\n", this.attributeToCss({['#'+content.id]:value}), "}\n"];
        });
      })
    },
  }
}
</script>
<style>

</style>