<template>
  <div v-if="isEdited" class="relative" v-vueuv-content.stop="{dblclick:(e)=>{ e.stopPropagation(); }}">
    <img :alt="alt" :src="src"/>

    <div class="absolute" :style="getEditorStyle" style=" height:80px; z-index: 100; background: rgba(0,0,0, .5)">
      <div class="flex justify-center items-center h-full p-2">
        <input id="src" class="w-full" :value="src" @change="(e)=>{ $emit('update:src', e.target.value) }"/>
        <vu-button @click.stop="disableEdit"> Save</vu-button>
      </div>
    </div>
  </div>
  <img v-else :alt="alt" :src="src" v-vueuv-content/>
</template>

<script>
import VuButton from "@/components/VuButton";

export default {
  name: "BasicImage",
  label: "이미지",
  components: {VuButton},
  contentDefault:{
    class:['p-2'],
    props:{
      src:'https://via.placeholder.com/150',
      alt:'Image'
    }
  },
  props: {
    alt: String,
    src: String
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
        width: this.$el.clientWidth + 'px',
      }
    }
  }
}
</script>

<style scoped>

</style>