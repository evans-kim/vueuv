
<template>
  <div ref="wrap" class="relative">
    <slot></slot>
    <div ref="pop" v-show="visible" :style="popoverStyle" class="border shadow bg-white rounded absolute p-2">
      <slot name="popover">
      </slot>
        {{ popoverStyle }}
      <vu-button @click="()=>{ $emit('update:visible', false) }">x</vu-button>
    </div>
  </div>
</template>

<script>
import VuButton from "@/components/VuButton";
export default {
  name: "Popover",
  components: {VuButton},
  props: {
    title: {type: String, default: null, required: false},
    visible:Boolean,
    gap:{
      type: Number,
      default : 10
    }
  },
  data() {
    return {
      popoverStyle: {
        transition:'all ease-in-out 0.3s'
      }
    }
  },
  methods:{
    getPoints(){
      const rect = this.$refs.wrap.getBoundingClientRect();
      this.$set(this.popoverStyle, 'left', rect.x + 'px');
      this.$set(this.popoverStyle, 'top', rect.y + rect.height + this.gap + 'px');
    },
    handleEnter(event) {

      this.getPoints();
    }
  },
  mounted() {
    this.getPoints();

  }
}
</script>

<style scoped>

</style>