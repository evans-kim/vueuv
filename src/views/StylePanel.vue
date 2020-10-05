<template>
  <div v-if="selectedComponent">
    <h2>{{ getContentName }}#{{ selectedComponent.uid }}</h2>
    <style-property-input @submit="addStyle"></style-property-input>
  </div>
  <div v-else>
    <h2> 먼저 선택해 주세요! </h2>
  </div>
</template>

<script>

import StylePropertyInput from "@/components/StylePropertyInput";
export default {
  name: "StylePanel",
  components: {StylePropertyInput},
  computed:{
    getContentName(){
      return this.selectedComponent.option.name;
    },
    getProp(){
      return this.selectedComponent.styleProps;
    },
    getPropKeys(){
      return Object.keys( this.selectedComponent.styleProps );
    },
    selectedComponent(){
      return this.$store.getters.getSelectedContent
    }
  },

  methods: {
    handler(key, val) {
      let target = key;
      let value = val;
      if(Array.isArray(key)){
        const obj = this.getProp[key[0]]
        target = key[0]
        obj[key[1]] = val;
        value = obj;
      }

      this.$store.commit('setStyle', {target, value})

    },
    addStyle({selector, property}) {
      this.$store.commit('setStyle', {selector, property})
    }
  }
}
</script>