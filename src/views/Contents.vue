<template>
  <div class="home">
    <div class="flex flex-wrap">
      <div v-for="(content,index) in contents" :key="index" class="flex flex-col border bg-white p-2 justify-center items-center rounded cursor-pointer"
           draggable="true"
           @dragstart="(ev)=>{dragStartHandler(content)}"
           @dragend="(ev)=>{dragEndHandler()}"
      >
        <i class="icofont icofont-2x" :class="content.icon"></i>
        <div class="text-sm">{{ content.name }}</div>

      </div>
    </div>
  </div>
</template>

<script>
import BasicContent from "@/Contents/BasicContent";
import ContentContainer from "@/Contents/ContentContainer";
import AppAccess from "@/mixins/AppAccess";
import HrefContent from "@/Contents/HrefContent";
import NavBarContent from "@/Contents/NavBarContent";
export default {
  name: 'Contents',
  mixins:[
    AppAccess
  ],
  data(){
    return{
      contents : [
        BasicContent,
        ContentContainer,
        HrefContent,
        NavBarContent
      ]
    }
  },
  methods: {
    dragStartHandler(content) {
      this.dragComponent = content;
    },
    dragEndHandler() {
      if(this.dragComponent){
        this.dragComponent = null;
      }
    }
  }
}
</script>
