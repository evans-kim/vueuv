<template>
  <component :is="'style'" type="text/css">
    {{ (rawCss) ? rawCss : parseContentStyles(content) }}
  </component>
</template>

<script>
import * as flatMapDeep from 'lodash/flatMapDeep';
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
  methods: {
    parseContentStyles(obj) {
      const css = flatMapDeep(obj.contents, (o)=>{
        return o.cssText || null;
      })

      return [obj.cssText, ...css].filter(i=>i).join("\n\n");

    }
  }
}
</script>