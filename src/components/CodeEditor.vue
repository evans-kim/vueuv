<template>
  <textarea :value="value" @change="handleInput" class="my-editor w-full" rows="10"></textarea>
</template>

<script>

export default {
  name: "CodeEditor",
  props:{
    value:{
      type: String
    }
  },
  methods: {
    handleInput(e){
      const text =e.target.innerText

      this.$emit('input', text)
    }
  }
}
</script>

<style>
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #303030;
  color: #eeeeee;
  margin-top: 1rem;
  min-width: 20rem;
  max-width: 40rem;


  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

</style>