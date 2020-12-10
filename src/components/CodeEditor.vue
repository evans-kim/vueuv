<template>
  <textarea :value="value" @change="handleInput" @keydown.exact.tab="applyTab" @keydown.shift.tab="backTab" class="code-viewer w-full" rows="10"></textarea>
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
  backTab(event: Event){
    event.preventDefault();
    const target = event.target as HTMLTextAreaElement;

    let value = target.value;
    const selectionStart = target.selectionStart;
    const startText = value.slice(0, selectionStart - 2)
    const endText = value.slice(selectionStart)

    value = `${startText}${endText}`
    target.value = value;
    target.selectionEnd = selectionStart - 2
  }

  applyTab(event){
    event.preventDefault();
    let value = event.target.value;
    const selectionStart = event.target.selectionStart;
    const startText = value.slice(0, selectionStart)
    const endText = value.slice(selectionStart)
    value = `${startText}  ${endText}`
    event.target.value = value;
    event.target.selectionEnd = selectionStart + 2

  }

  handleInput(e){
    const text = e.target.value
    this.$emit('input', text)
  }
}
</script>