<template>
  <component ref="contentBody"
             v-if="isRenderObject"
             :data-title="getTag"
             @dblclick="activeContent" @click="focusContent" @mouseover="selectContent"
             :is="getTag" v-bind.sync="value.props"
             :class="getClass"
             :style="(!isSimpleText) ? value.style : {}">
    <draggable v-if="value.contents && value.contents.length > 0" tag="div"
               :style="(isSimpleText) ? value.style : {}"
               :class="(isSimpleText) ? value.class : {}"
               v-model="value.contents" group="content-sort" animation="200" ghost-class="ghost"
               @start="isSorting = true" @end="isSorting = false">
      <content-render v-for="(child,idx) in value.contents" :value="child"
                      @input="(val)=>{ value.contents[idx]=val; }"
                      :key="idx"
      ></content-render>
    </draggable>
  </component>
  <div v-else ref="contentBody" :data-title="getTag" @dblclick="activeContent" @click="focusContent" @mouseover="selectContent"
       v-html="value"
       @blur="blurHandler"
       :contenteditable="isEditable"
       :class="getClass">
  </div>
</template>
<script>
import AppAccess from "@/mixins/AppAccess";

export default {
  name: 'ContentRender',
  mixins: [
    AppAccess
  ],
  props: {
    value: {
      type: [Object, String],
      required: true
    }
  },
  watch:{
    isEditable(val){
      if(this.isSimpleText){
        this.$nextTick(()=>{
          this.$el.focus();
        })
      }
    }
  },
  data() {
    return {
      uid: null,
      isLabelBottom: false
    }
  },
  computed: {
    isSimpleText(){
      return this.getTag === 'text'
    },
    isRenderObject() {
      return typeof this.value === 'object' && this.value.tag
    },
    isEditable() {
      return this.editingContent && this.editingContent.uid === this.getUid;
    },
    isFocused() {
      return this.focusedContent && this.focusedContent.uid === this.getUid;
    },
    isSorted() {
      return this.isSorting
    },
    isSelected() {
      if (this.isFocused) {
        return true;
      }
      return this.selectedContent && this.selectedContent.uid === this.getUid;
    },
    getClass() {
      return Object.assign({
        'is-editable': this.isEditable,
        'is-selected': this.isSelected,
        'label-bottom' : this.isLabelBottom
      }, this.value.class || {}) || {}
    },
    getTag() {
      return this.value.tag || 'text';
    },
    showLabel() {
      return this.isSelected  || this.isFocused || this.isEditable
    }
  },
  methods: {
    setUid() {
      this.uid = Math.random().toString(36).substr(2, 9);
    },
    labelStyle() {
      const rect = this.$el.getBoundingClientRect();
      this.isLabelBottom = rect.y < 20;
    },
    selectContent(event) {
      if (this.$store.getters.isSorting) {
        return false;
      }
      this.selectedContent = {uid: this.getUid, node: this};

      this.$nextTick(() => {
         this.labelStyle();
      });

      event.stopPropagation();
    },
    inputHandler(e) {
      const data = e.target.innerHTML;
      this.$emit('input', data);
    },
    unFocusContent(e) {
      this.inputHandler(e);
      this.focusedContent = null;
      this.editingContent = null;
    },
    inactiveContent(e){
      const data = e.target.innerHTML;
      this.$emit('input', data);
      this.editingContent = null;
    },
    activeContent(e) {
      if (this.isEditable) {
        this.editingContent = null;
        e.stopPropagation();
        return;
      }
      this.$nextTick(() => {

        if (this.$refs['contentBody'].setEditable) {
          this.$refs['contentBody'].setEditable();
        }
        if (!this.$refs['contentBody'].$el) {
          this.setEditable();
        }
      })
      e.stopPropagation();
    },
    setEditable(){
      this.editingContent = {uid:this.getUid, node : this};
    },
    focusContent(e) {
      if(this.editingContent && !this.isEditable){
        this.editingContent = null;
      }
      if(this.isFocused){
        this.focusedContent = null;
      }else{
        this.focusedContent = {uid: this.getUid, node: this};
      }
      e.stopPropagation();
    },
    blurHandler(e) {
      this.$emit('input', e.target.innerHTML);
    }
  }
}
</script>
<style lang="scss" scoped>

.ghost {
  background-color: #e1e2e3;
  opacity: .5;
}

.is-selected, .is-editable {
  position: relative;
  outline: #42b983 2px solid;
  display: flow-root;
}
.is-selected:before, .is-editable:before{
  content: attr(data-title);
  position: absolute;
  left: -2px;
  top: -20px;
  background-color: #42b983;
  color: white;
  font-size: 9px;
  padding: 2px 6px;
  z-index: 100;
}
.is-selected.label-bottom:before{
  left: -2px;
  top: unset !important;
  bottom: -20px !important;
}
.is-editable{
  outline: orange 2px solid;
}
.is-editable:before{
  background-color: orange !important;
}

</style>