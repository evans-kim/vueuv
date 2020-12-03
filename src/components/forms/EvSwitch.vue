<template>
  <div :class="getStatusClass"
       class="relative transition-all ease-in-out duration-300 border border-gray-200 cursor-pointer w-12 h-6 focus:outline-none focus:shadow-outline"
       style="width: 46px; border-radius: 46px;"
       tabindex="0"
       @click="toggle" @keypress.space.enter="handleSpace"
  >
    <span
        :class="getStatusPosition"
        class="absolute left-0 transition-all ease-in-out duration-300 rounded-full border w-4 h-4 border-gray-300 shadow-inner bg-white shadow"></span>
  </div>
</template>

<script>
export default {
  name: "EvSwitch",
  props: {
    value: null,
    activeValue: {
      default: true
    },
    inactiveValue: {
      default: false
    }
  },
  computed: {
    isActive() {
      return this.value == this.activeValue;
    },
    getStatusClass() {
      if (this.isActive) {
        return ['bg-main-300']
      } else {
        return ['bg-main-200']
      }
    },
    getStatusPosition() {
      if (this.isActive) {
        return ['switch-on']
      } else {
        return ['switch-off']
      }
    }
  },
  methods: {
    handleSpace(e) {
      this.toggle();
    },
    toggle() {

      if (this.value == this.activeValue) {
        this.$emit('input', this.inactiveValue);
      } else {
        this.$emit('input', this.activeValue);
      }
    }
  }
}
</script>

<style scoped>
.switch-on {
  top: 50%;
  transform: translateY(-50%) translateX(150%);

}

.switch-off {
  top: 50%;
  transform: translateY(-50%) translateX(20%);
}
</style>
