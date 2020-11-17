<template>
  <div v-if="isEdited" class="relative" v-on="$listeners">
    <img :alt="alt" :src="src" />

    <div class="absolute" :style="getEditorStyle">
      <div class="flex justify-center items-center h-full p-2">
        <label for="src" class="text-white">Source</label>
        <input id="src" class="w-full" :value="src" @change="(e)=>{ $emit('update:src', e.target.value) }" />
      </div>
    </div>
  </div>
  <img v-else :alt="alt" :src="src" v-on="$listeners"/>
</template>

<script>
export default {
name: "BasicImage",
  props:{
    alt:String,
    src:String
  },
  data() {
    return {
      isEdited: false
    }
  },
  methods: {
    enableEdit() {

      this.isEdited = true;
    },
    disableEdit() {
      this.isEdited = false;
    },
  },
  computed: {
    getEditorStyle() {
      return {
        top: 0,
        width: this.$el.clientWidth + 'px',
        height: this.$el.clientHeight + 'px',
        background: 'rgba(0,0,0, .5)'
      }
    }
  }
}
</script>

<style scoped>

</style>