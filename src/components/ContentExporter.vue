<template>
  <component :is="value.tag" :id="value.id || _uid" :style="value.style || {}" :class="value.class || {}" v-bind="value.props || {}" >
    <content-exporter v-for="(child, idx) in value.contents" :key="idx" :value="child"></content-exporter>
  </component>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
name: "ContentExporter",
  props:{
    value: {
      type: Object,
      required: true
    }
  },
  methods:{
    exportHtml(): any{
      return this.$el.outerHTML;
    }
  }
})
</script>

<style scoped>

</style>