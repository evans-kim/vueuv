<template>
  <component :is="'style'" type="text/css">
    <template v-for="style in getContentStyles">
      {{ style.selector }} {
        {{ CssPropertyToText(style.property) }}
      }
    </template>
  </component>
</template>

<script>
export default {
  name: "ContentStyle",
  computed: {
    /**
     *
     * @returns {ContentStyle}
     */
    getContentStyles() {
      return this.$store.getters.getStyles;
    }
  },
  methods:{
    CssPropertyToText(style){
      return Object.keys(style).map(prop => {
        return prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`) + ` : ${style[prop]};`
      }).join("\n")
    }
  }
}
</script>