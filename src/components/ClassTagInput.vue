<template>
  <div class="tag-input-wrapper bg-white p-2 border shadow flex justify-start flex-wrap" @click.stop="focusInput">
    <span v-for="(item, idx) in value" :key="idx"
          @click.stop="removeItem(idx)"
          class="m-1 mt-0 p-1 border rounded bg-gray-200 cursor-pointer hover:bg-gray-300 shadow">
      {{ item }}
    </span>
    <input ref="input" type="text" class="tag-input-input" v-model="temp" @keydown.enter="inputHandler"/>
    <div v-if="temp && autoComplete" class="relative h-0" >
      <ul class="absolute bg-white border shadow p-2 relative" style="top: 10px; max-height: 400px; overflow-y: auto">
        <li v-for="(item, i) in getFiltered" :key="i"> {{ item }} </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as uniq from 'lodash/uniq'
export default {
  name: "ClassTagInput",
  data(){
    return {
      temp: null
    }
  },
  props: {
    value: {
      type: Array
    },
    autoComplete:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    getFiltered(){
      const exp = new RegExp(this.temp);

      return this.getAllClasses.filter(item=>exp.test(item))
    },
    getAllClasses(){
      if(!this.autoComplete){
        return [];
      }
      const allRules = [];
      const sSheetList = document.styleSheets;
      for (let sSheet = 0; sSheet < sSheetList.length; sSheet++)
      {
        const ruleList = document.styleSheets[sSheet].cssRules;
        for (let rule = 0; rule < ruleList.length; rule ++)
        {
          allRules.push( ruleList[rule].selectorText );
        }
      }
      return uniq( allRules );
    }
  },
  methods: {
    inputHandler(e) {

      this.$emit('input', uniq([...this.value, this.temp].filter(item=>item)));
      this.temp = '';

    },
    removeItem(idx) {
      this.value.splice(idx, 1);

    },
    focusInput(e) {
      this.$refs['input'].focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-input-wrapper{
  transition: ease-in-out all 0.5ms;
}
.tag-input-input {
  height: 34px;
  width: 100%;
  padding-left: 0.5rem;
}
.tag-input-input:focus{
  outline: none;

}
</style>