<template>
  <component :is="'style'" type="text/css">
    {{ parseContentStyles }}
  </component>
</template>

<script>
import * as flattenDeep from 'lodash/flattenDeep';
export default {
  name: "ContentStyle",
  inject: ['$editor'],
  props: {
    content: {
      type: Object
    },
    rawCss:{
      type: String
    }
  },
  computed:{
    parseContentStyles() {
      const cssTexts = this.getCssText(this.$editor.contentModel.contents);

      const deep = flattenDeep(cssTexts).filter(item=>item);

      return [this.$editor.contentModel.cssText || null, ...deep].join("\n");
    }
  },
  methods:{
    getCssText(contents){
      return contents.map(content=>{
        if(content.contents && content.contents.length){
          return [content.cssText, ...this.getCssText(content.contents)]
        }
        return content.cssText || null;
      })
    }
  }
}
</script>