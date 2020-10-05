<template>
  <div class="flex items-stretch content-center ">
    <label v-for="(option, idx) in options" @click="(ev)=>{select(option,ev)}" :key="idx" :class="getClass(option)"
      class="flex items-center first:rounded-l last:rounded-r border-r-0 last:border-r border bg-white px-2 py-1 focus:bg-blue-600 focus:text-white focus:outline-none transition duration-200 ease-in-out cursor-pointer"
    >
      <input type="radio" class="w-0 h-0 overflow-hidden"/>
      <span v-html="getLabel(option)"></span>
    </label>
  </div>
</template>

<script>

export default {
  name: "EvRadioGroup",
  props:{
    options:{
      type:Array
    },
    value:{
      type:null
    }
  },
  data(){
    return {

    }
  },
  methods: {
    getValue(option){
      return option.value || (typeof option === 'object') ? option.value : option;
    },
    getLabel(option) {
      return option.label || option;
    },
    select(option,ev) {
      console.log(option);
      ev.preventDefault();
      this.$emit('input', this.getValue(option));
      ev.stopPropagation();
    },
    getClass(option) {
      const hasValue = this.value === this.getValue(option);
      if(hasValue){
        return ['bg-blue-600', 'text-white']
      }
    }
  },
  computed: {

  }
}
</script>

<style scoped>
  .is-selected{

  }
</style>