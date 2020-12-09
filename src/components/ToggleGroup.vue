<template>
  <div>
    <vu-button v-for="(key , x) in getOptions" :key="x" :color="(hasValue(key))?color:null" @click="toggle(key)">
      {{ key }}
    </vu-button>
  </div>
</template>

<script>
import VuButton from "@/components/VuButton";

export default {
  name: "ToggleGroup",
  components: {VuButton},
  props:{
    value:{
      type: Object
    },
    color:{
      type: String,
      default: 'green'
    },
    unique:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    getOptions(){
      if(!this.value || typeof this.value !== 'object'){
        return [];
      }
      return Object.keys(this.value);
    }
  },
  methods: {
    hasValue(key) {
      return this.value[key] || false;
    },
    toggle(key) {
      if(this.unique){
        Object.keys( this.value ).map(k=>{
          this.value[k] = false;
        })
        this.value[key] = true;
      }else{
        this.value[key] = !this.value[key];
      }
      this.$emit('input', this.value);
    }
  }
}
</script>

<style scoped>

</style>