<template>
  <div class="relative">
    <div class="flex items-center">
      <div class="shadow border rounded cursor-pointer inline-block" :style="getStyle" @click="()=>{ showPanel = !showPanel }"></div>
      <div class="text-sm">{{value}}</div>
    </div>
    <div v-show="showPanel" class="absolute z-20" style="padding: 20px" @mouseleave="()=>{ showPanel = false; }">
      <chrome :value="value" @input="(val)=>{handleColor(val)}"></chrome>
    </div>
  </div>
</template>

<script>
import {Chrome} from 'vue-color';
export default {
  name: "EvColorPicker",
  components:{
    Chrome
  },
  props:{
    value:{
      type:String,
      default: '#FFFFFF'
    },
    type:{
      type:String,
      default:'hex'
    }
  },
  data(){
    return{
      showPanel : false,
      bgColor : '#FFFFFF'
    }
  },
  computed: {
    getStyle() {
      return {
        width: '24px',
        height: '24px',
        backgroundColor: this.value
      }
    }
  },
  methods: {
    handleColor(val) {
      switch (this.type) {
        case 'hex':
          this.bgColor = val.hex;
          this.$emit('input', val.hex);
          break;
         case 'rgba':
           this.bgColor = `rgba(${val.rgba.r},${val.rgba.g},${val.rgba.b},${val.rgba.a})`;
           this.$emit('input', this.bgColor)
           break;
      }

    }
  }
}
</script>

<style scoped>

</style>