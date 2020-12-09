<template>
  <textarea :value="value" @change="handleInput" class="code-viewer w-full" rows="10"></textarea>
</template>

<script lang="ts">

import Component from "vue-class-component";
import Vue from "vue";

const Props = Vue.extend({
  props: {
    value: String
  }
})

@Component
export default class CodeEditor extends Props{

  handleInput(e){
    const text = e.target.value
    this.$emit('input', text)
  }
}
</script>