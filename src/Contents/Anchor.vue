<template>
  <v-popover
      v-if="isEdited" v-vueuv-content
      trigger="manual"
      :open="isEdited"
      offset="16"
      :auto-hide="false"
  >
    <a><slot>{{text}}</slot></a>
    <template slot="popover">
      <ev-form :value="{href,text}">
        <ev-input label="Href" :value="href" @change="(v)=>{$emit('update:href', v); disableEdit();}"/>
        <ev-input label="Text" :value="text" @change="(v)=>{$emit('update:text', v); disableEdit();}"/>
      </ev-form>
    </template>
  </v-popover>
  <!-- To prevent anchor click event execution, the href attribute has been removed.  -->
  <a v-else-if="$editor.config.editable" v-vueuv-content v-tooltip="{content: 'Address:' + href}">
    <slot>{{text}}</slot>
  </a>
  <!-- This will be shown on export mode -->
  <a v-else :href="href">
    <slot>{{text}}</slot>
  </a>
</template>

<script>

import EvInput from "@/components/forms/EvInput";
export default {
  name: "Anchor",
  components: { EvInput},
  inject:['$editor'],
  label: '링크',
  contentDefault: {
    class: ['p-2'],
    props: {
      href: '/test',
      text:'링크'
    },
    contents:[]
  },
  props: {
    href: String,
    text: String
  },
  computed: {
    getAttrs() {
      return this.value
    }
  },
  data() {
    return {
      isEdited: false
    }
  },
  methods: {
    enableEdit() {
      this.isEdited = true;
    },
    disableEdit() {
      this.isEdited = false;
    },
    changeHref(e){
      this.$emit('update:href', e.target.value);
      this.disableEdit();
    }
  },
}
</script>

<style>
a{
  display: inline-block;
}
.tooltip {
  display: block !important;
  z-index: 100;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(0,0,0 , .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>