<template>
  <div v-if="getLabel" :style="tagStyle">
    <div style="position: relative;">
      <span class="pop-tag" :style="{backgroundColor:color}">{{getLabel.value.tag}}#{{getLabel.value.id}}</span>
      <div v-if="bordered" class="pop-border" :style="topBorder" ></div>
      <div v-if="bordered" class="pop-border" :style="rightBorder"></div>
      <div v-if="bordered" class="pop-border" :style="bottomBorder"></div>
      <div v-if="bordered" class="pop-border" :style="leftBorder"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopLabel",
  inject:['$editor'],
  props:{
    content:{
      type:[Object,String]
    },
    color:{
      type: String,
      default: '#42b983'
    },
    bordered:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    getLabel(val){

      if(!val){
        return;
      }

      const editorRect = this.$editor.$el.getBoundingClientRect();
      const rect = this.content.component.$el.getBoundingClientRect();

      this.tagStyle.top = rect.y + editorRect.y - 10 + 'px';
      this.tagStyle.left = rect.x + editorRect.x + 7 + 'px' ;
    }
  },
  computed:{
    getLabel(){
      if(!this.content)
        return null;

      return this.content.component
    }
  },
  data() {
    return {
      offset: {
        x: 2,
        y: 18
      },
      labelStyle: {},
      tagStyle:{
        position:'absolute',
        color:'white',
        fontSize:'12px'
      },
      topBorder: {},
      leftBorder: {},
      rightBorder: {},
      bottomBorder: {}
    }
  }
}
</script>

<style scoped>
.pop-border{
  position: absolute;
}
.pop-tag{
  position: absolute;
  z-index: 10;
  padding-left: 4px;
  padding-right: 4px;
  white-space: nowrap;
}

.pop-label-wrapper {
  position: absolute;
  outline: 2px solid;
  z-index: -1;
}

</style>