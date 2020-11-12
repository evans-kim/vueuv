<template>
  <component :is="'style'" type="text/css">
    {{ parseContentStyles(value) }}
  </component>
</template>

<script>
import _ from 'lodash';
export default {
  name: "ContentStyle",
  props: {
    value: {
      type: Object
    }
  },
  methods: {
    parseContentStyles(obj) {
      const css =_.flatMapDeep(obj.contents, (o)=>{
        return o.cssText || null;
      })

      return [obj.cssText, ...css].filter(i=>i).join("\n\n");

    }
  }
}
</script>