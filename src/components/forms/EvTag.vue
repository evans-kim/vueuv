<template>
    <span v-on="$listeners"
          :class="getStatusClass"
          class=" cursor-pointer text-sm shadow select-none m-1 rounded ml-1 first:ml-2 border py-1 px-2 whitespace-no-wrap"
    >
        <slot></slot>
    </span>
</template>

<script>
export default {
  name: "EvTag",
  props: {
    color: {
      default: 'gray'
    }
  },
  data() {
    return {}
  },
  computed: {
    getStatusClass() {
      const color = this.color;
      return [
        `bg-${color}-100`,
        `hover:bg-${color}-200`,
        `active:bg-${color}-300`,
        `text-${color}-800`,
        `border-${color}-400`,
      ];
    }
  }
}
</script>

<style scoped>

</style>
