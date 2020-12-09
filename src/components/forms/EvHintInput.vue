<!--suppress ALL -->
<template>
  <div class="relative">
    <ev-input ref="searchInput"
              :value="value"
              @input="inputHandler"
              @click="toggleOptions"
              @blur="closeOptions"
              @keyup.up="startNavigatorFromBack"
              @keyup.down="startNavigator"
              @keyup.enter="submitNavigator"
              placeholder="select or search"
    ></ev-input>
    <div ref="optionsMenu" class="ev-hint-option-panel flex-col absolute z-10 shadow border bg-white " :class="getDisplay">
      <div v-for="(option,idx) in getFilteredOptions"
           :key="idx"
           @click="()=>{ sendValue(option) }"
           class="p-1 text-sm first:border-t-0 border-t whitespace-no-wrap cursor-pointer hover:bg-gray-200 hover:text-black"
           :class="traveler === option ? 'bg-gray-600 text-white' : ''"
      >
        {{ option }}
      </div>
    </div>
    <input ref="navigator" class="absolute" style="z-index: -1; width: 0px; height: 0px; outline: none;"
           tabindex="-1"
           @focus="clearHideOptions"
           @keyup.esc="escHandler"
           @keyup.down="downHandler"
           @keyup.up="upHandler"
           @keyup.enter="enterHandler">
  </div>
</template>

<script>
import EvInput from "@/components/forms/EvInput";

let timer;

export default {
  name: "EvHintInput",
  components:{
    EvInput
  },
  props: {
    value : String,
    options:{
      type: Array
    }
  },
  data(){
    return {
      keyword : '',
      loading : false,
      travelerNo : 1,
      traveler : {},
      showOptions : false,
      availableArrow : true,
      isBounce: false,
    }
  },
  computed:{

    getDisplay(){
      return (this.showOptions) ? 'flex' : 'hidden';
    },
    getMenu() {
      return this.$refs.optionsMenu;
    },
    getButton() {
      if(!this.$refs.searchInput){
        return null;
      }
      return this.$refs.searchInput.$el || null;
    },
    getFilteredOptions() {
      const regexp = new RegExp(this.keyword, "ig");
      return this.options.filter(item=>{
        return regexp.test(item);
      })
    }
  },
  methods:{
    clearHideOptions(){

      if(timer)
        clearTimeout(timer)
    },
    toggleOptions(){

      this.showOptions = !this.showOptions;
    },
    startNavigatorFromBack(e){

      if(this.options.length === 0){
        return ;
      }
      e.target.blur();
      this.$refs['navigator'].focus();
      this.travelerNo = this.options.length;
      this.traveler = this.options[this.travelerNo - 1];
      this.showOptions = true;
    },
    startNavigator(e) {

      if(this.options.length === 0){
        return ;
      }
      e.target.blur();
      this.$refs['navigator'].focus();
      this.travelerNo = 1;
      this.traveler = this.options[this.travelerNo - 1];

      e.stopPropagation();
      this.showOptions = true;
      this.availableArrow = false;
      setTimeout(()=>{
        this.availableArrow = true;
      }, 300);
    },
    downHandler(e) {

      if (!this.options.length || !this.availableArrow) {
        return;
      }

      if (this.travelerNo <= this.options.length) {
        this.travelerNo = this.travelerNo + 1;
      }
      if(this.travelerNo > this.options.length) {
        this.travelerNo = 1;
      }
      this.traveler = this.options[this.travelerNo - 1];
      e.stopPropagation();
    },
    upHandler(e) {

      if (!this.options.length || !this.availableArrow) {
        return;
      }

      if (this.travelerNo > 1) {
        this.travelerNo = this.travelerNo - 1;
      } else {
        this.travelerNo = this.options.length;
      }

      this.traveler = this.options[this.travelerNo - 1];
    },
    enterHandler(e) {

      if(!this.traveler){
        return this.$refs['searchInput'].$el.focus();
      }
      this.sendValue(this.traveler);

      this.traveler = {};
      this.travelerNo = 0;

    },
    escHandler(e) {
      e.target.blur();
      this.$refs['searchInput'].$el.focus();
      this.travelerNo = 0;
      this.traveler = {};
    },
    inputHandler(value){

      if( this.keyword === value ){

        this.$emit('input', value);
        return;
      }else {
        this.searchOpId(value);
      }

      this.$emit('input', value);
    },
    searchOpId(value){
      this.keyword = value;
      if(!this.keyword){
        return;
      }
    },
    sendValue(option) {
      if(timer){
        clearTimeout(timer)
      }
      this.$emit('input', option);
      this.$emit('change', option);
      this.showOptions = false;

    },
    submitNavigator(e) {
      this.$emit('submit', e)
    },
    closeOptions(e) {

      timer = setTimeout(()=>{
        this.showOptions = false;
      }, 300);

    }
  }
}
</script>

<style scoped>

</style>
