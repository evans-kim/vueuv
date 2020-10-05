<template>
  <div @drop="(ev)=>{dropHandler(ev,dragComponent)}" @dragover="dragOverHandler" class="cc">
    <draggable
        :list="contents"
        :disabled="!enabled"
        :class="getContainerClass"
        @start="dragging = true"
        @end="dragging = false"
    >
      <component v-for="content in contents" :is="content.option.name"
                 :ref="content.uid"
                 :key="content.uid"
                 @content-selected="()=>{setSelectedContent(content)}"
                 v-bind.sync="content.data"
                 :id="content.uid"
                 :class="contentClass(content)"
      >
      </component>
    </draggable>
  </div>
</template>

<script>
import AppAccess from "@/mixins/AppAccess";
import ContentStyle from "@/Contents/ContentStyle";
import ContentFactory from "@/mixins/ContentFactory.ts";

export default {
  name: "ContentContainer",
  components: {ContentStyle},
  icon: 'icofont-interface',
  props: {
    enabled: {type: Boolean, default: true, required: false},
  },
  data() {
    return {
      /**
       * @var {Array<ContentFactory>}
       */
      contents: [],
      dragging: false
    }
  },
  mixins:[AppAccess],
  computed: {
    getStyles(){
      return this.contents.map((content)=>{
        // TODO :: 사용자가 클래스를 추가해 셀렉트할 수 있게 합니다. 셀렉트가 없다면 id 값을 셀렉터로 합니다.
        const obj = {};
        obj['#'+content.uid] =   content.styleProps;
        return obj
      });
    },
    isSelectedContainer() {
      return this.selectedContent === this;
    },
    getContainerClass() {
      return {
        'is-selected-container': this.isSelectedContainer,
        'drop-here' : this.isDragging,
        'container-guide' : this.isSelectedContainer,
        'empty-container' : this.contents.length === 0
      }
    }
  },
  methods: {
    dropHandler(ev, component) {

      if (!component) {
        return;
      }

      const content = new ContentFactory(component)

      content.appendContent(this)
      ev.stopPropagation();
    },
    dragOverHandler(ev) {
      ev.preventDefault();
    },
    setSelectedContent(content) {
      console.log(content);
      this.selectedContent = content;
    },
    contentClass(content) {
      const ContentStyle = this.$store.getters.getStyleById(content.uid);
      console.log(ContentStyle);
      if (this.selectedContent === content) {
        return ['shadow-outline']
      }
    },
    getStyleByMedia(style) {
      return Object.keys(style).filter(s=>{
        return ['sm','md','lg','xl','all'].includes(s);
      })
    }
  }
}
</script>

<style lang="scss">
.cc{
  .is-selected-container {
    box-shadow: 0 0 0 3px rgba(66, 225, 206, 0.5);
  }
  .drop-here{
    box-shadow: 0 0 0 3px rgb(229, 66, 66, .5);
  }
  .container-guide:hover{
    >*:hover{
      box-shadow: 0 0 0 3px rgba(66, 106, 225, 0.5);
    }
  }
  .empty-container:before{
    text-align: center;
    font-weight: 600;
    padding: 10px;
    content: 'Drop Content Here';
    width: 100%;
    min-height: 100px;
    border: 2px dashed #606060;
  }
}
</style>