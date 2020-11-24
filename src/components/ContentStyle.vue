<template>
  <component :is="'style'" type="text/css">
    {{ parseContentStyles }}
  </component>
</template>

<script>
import * as flattenDeep from 'lodash/flattenDeep';
export default {
  name: "ContentStyle",
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
      const deep = flattenDeep(this.getCssText(this.content.contents));

      return [this.content.cssText, ...deep].join("\n\n");
    }
  },
  methods:{
    getCssText(contents){
      return contents.map(content=>{
        if(content.contents && content.contents.length){
          return this.getCssText(content.contents)
        }
        return content.cssText || null;
      })
    }
  }
}
</script>