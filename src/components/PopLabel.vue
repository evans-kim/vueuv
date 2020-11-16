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
      this.setBorder(rect)

      this.tagStyle.top = rect.y - editorRect.y - 20 + 'px';
      this.tagStyle.left = rect.x - editorRect.x - 2 + 'px' ;
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
  },
  methods:{
    setBorder(rect){
      this.topBorder.top = 18 + 'px';
      this.topBorder.left = 0;
      this.topBorder.height = 2+'px';
      this.topBorder.width = rect.width + 'px';
      this.topBorder.backgroundColor = this.color;

      this.bottomBorder.top = 18 + rect.height + 'px';
      this.bottomBorder.left = 0;
      this.bottomBorder.height = 2 + 'px';
      this.bottomBorder.width = rect.width + 'px';
      this.bottomBorder.backgroundColor = this.color;

      this.leftBorder.top = 18 + 'px';
      this.leftBorder.left = 0;
      this.leftBorder.height = rect.height + 'px';
      this.leftBorder.width = 2 + 'px';
      this.leftBorder.backgroundColor = this.color;

      this.rightBorder.top = 18 + 'px';
      this.rightBorder.left = rect.width + 'px';
      this.rightBorder.height = rect.height + 2 + 'px';
      this.rightBorder.width = 2 + 'px';
      this.rightBorder.backgroundColor = this.color;
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