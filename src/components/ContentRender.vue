<template>
  <div :data-title="getTag"
       :data-id="getUid"
       data-type="selector"
       style="position: relative"
       :class="selectorClass"
       @dblclick="activeContent"
       @click="focusContent"
       @mouseover="selectContent">
    <template v-if="value.contents && value.hasOwnProperty('contents')">
      <draggable tag="div"
                 :data-title="getTag"
                 :data-id="getUid"
                 data-type="sorter"
                 :style=" value.style || {}"
                 class="transitional"
                 :id="getUid"
                 :class=" getClass "
                 :value="value.contents"
                 @input="updateContents"
                 group="content-render" animation="200" ghost-class="ghost"
                 @start="()=>{isSorting = true;}" @end="()=>{isSorting = false;}">
        <content-render v-for="(child,idx) in value.contents"
                        :value="child"
                        :parent="value"
                        @input="(val)=>{ value.contents[idx]=val; }"
                        :key="idx"
        ></content-render>
      </draggable>
    </template>
    <template v-else-if="isRenderObject">
      <component ref="content"
                 :is="getTag"
                 :data-title="getTag"
                 :data-id="getUid"
                 :id="getUid"
                 :key="getUid"
                 v-bind.sync="value.props"
                 :class="getClass"
                 :style="value.style || {}">
      </component>
    </template>
    <template v-else-if="isStringType">
      {{ value }}
    </template>
  </div>
</template>
<script>

import CodeEditor from "@/components/CodeEditor";
import createUniqueId from "@/lib/createUniqueId";
import Draggable from 'vuedraggable';

export default {
  name: 'ContentRender',
  components: {CodeEditor, Draggable:Draggable},
  inject: ['$editor'],
  props: {
    value: {
      type: [Object, String],
      required: true
    },
    parent: {
      type: Object
    }
  },
  data() {
    return {
      uid: null,
      isLabelBottom: false
    }
  },
  computed: {
    /**
     * @return {EditorStates}
     * */
    getState(){
      return this.$editor.states;
    },
    selectedContent: {
      get: function () {
        return this.getState.selectedContent;
      },
      set: function (component) {
        if (this.isDragging) {
          return false;
        }
        this.getState.selectedContent = component;
      }
    },
    focusedContent: {
      get: function () {
        return this.getState.focusedContent;
      },
      set: function (component) {
        if (this.isDragging) {
          return false;
        }
        this.getState.focusedContent = component;
      }
    },
    isSorting: {
      get: function () {
        return this.getState.isSorting;
      },
      set: function (value) {
        this.getState.isSorting = value;
      }
    },
    editingContent: {
      get() {
        return this.getState.editingContent || null;
      },
      set(val) {
        this.getState.editingContent = val;
      }
    },
    selectedElement: {
      get: function () {
        return this.getState.selectedElement;
      },
      set: function (component) {
        if (this.isDragging) {
          return false;
        }
        this.getState.selectedElement = component;
      }
    },
    isRenderObject() {
      return typeof this.value === 'object' && this.value.tag
    },
    selectorClass(){
      const classes = [];
      if( this.isEditing){
        classes.push('is-editable');
      }
      if( this.isSelectedContent || this.isFocusedContent){
        classes.push('is-selected');
      }
      if( this.isLabelBottom){
        classes.push('label-bottom');
      }
      if( this.$editor.config.showGrid ){
        classes.push('show-guide');
      }
      return classes;
    },
    getClass() {
      return [ ...this.value.class];
    },
    getTag() {
      return this.value.tag || 'text';
    },
    contentId() {
      return this.value.id;
    },
    isDragging() {
      return !!this.dragComponent
    },
    isSelectedContent() {
      return this.selectedContent === this.contentId
    },
    isFocusedContent() {
      return this.focusedContent && this.focusedContent.component === this;
    },
    isEditing() {
      if (!this.editingContent) {
        return false
      }
      return this.editingContent && this.editingContent.component === this;

    },
    getUid() {
      return this.value.id;
    },
    getContent() {
      return this.$refs['content']
    },
    isStringType() {
      return typeof this.value === 'string';
    }
  },
  methods: {
    setUid() {
      if(this.isStringType){
        return ;
      }
      if (!this.value.id) {
        this.$set(this.value, 'id', this.createUid())
      }
    },
    deleteContent(){

      if(!this.parent){
        console.warn('Root cannot be removed');
        return false;
      }
      this.parent.contents = this.parent.contents.filter((content)=>{
        return content.id !== this.value.id;
      });
    },
    getDataIdFrom(event) {
      return event.target.getAttribute('data-id');
    },
    /**
     *
     * @param {HTMLElement} element
     */
    getParentContentRender(element) {

      const parent = element.parentNode;
      if (!parent) {
        return null;
      }
      if (parent !== this.$el) {
        return this.getParentContentRender(parent);
      } else {
        return this.$el;
      }
    },
    selectContent(event) {

      if (!event.target !== this.$el) {
        const parentContentRender = this.getParentContentRender(event.target);

        if (parentContentRender) {
          this.selectedContent = parentContentRender.getAttribute('data-id');
          event.stopPropagation();
          return;
        }
      }
      if (this.getState.isSorting) {
        return false;
      }

      this.selectedContent = this.getDataIdFrom(event);

      this.$nextTick(() => {
        this.labelStyle();
      });

      event.stopPropagation();
    },
    activeContent(e) {
      if (this.isEditing) {
        this.unsetEditingContent()
        e.stopPropagation();
        return;
      }
      this.focusedContent = {id: this.getDataIdFrom(e), component: this};
      if (this.$refs['content'] && this.$refs['content'].enableEdit) {
        this.$refs['content'].enableEdit();
      }
      this.setEditingContent()
      e.stopPropagation();
    },
    unsetEditingContent() {
      const component = this.editingContent.component;
      if (component.$refs['content'] && component.$refs['content'].disableEdit) {
        component.$refs['content'].disableEdit(this);
      }
      this.getState.editingContent = null;
    },
    setEditingContent() {
      this.getState.editingContent = {id:this.getUid, component:this};
    },
    focusContent(e) {
      // 이전에 수정중인 컨덴츠가 있다면 비활성화 합니다.
      if ( this.editingContent && !this.isEditing) {
        this.focusedContent = null;
        this.selectedContent = null;
        this.unsetEditingContent();
      }
      if (this.isFocusedContent) {
        this.focusedContent = null;
      } else {
        this.focusedContent = {id: this.getDataIdFrom(e), component: this};
      }
      e.stopPropagation();
    },
    createUid() {
      return createUniqueId();
    },
    labelStyle() {
      const rect = this.$el.getBoundingClientRect();
      this.isLabelBottom = rect.y < 20;
    },
    updateContents(val) {
      this.value.contents = val;
      this.$emit('input', this.value)
      this.isSorting = false;
    },
    updateValue(val){
      this.$emit('input', val);
    }
  },
  created() {
    this.setUid();
  }
}
</script>
<style lang="scss" scoped>
.transitional{
  transition: all ease-in-out 0.3ms;
}
.ghost {
  background-color: #e1e2e3;
  opacity: .5;
}

.is-selected, .is-editable {
  position: relative;
  outline: #42b983 2px solid;

}

.is-selected:before, .is-editable:before {
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

.is-selected.label-bottom:before {
  left: -2px;
  top: unset !important;
  bottom: -20px !important;
}

.is-editable {
  outline: orange 2px solid;
}

.is-editable:before {
  background-color: orange !important;
}

.show-guide *[data-type='sorter'] {
  outline: 1px dashed #606060;
  padding: 1rem;
  transition: all ease-in-out 300ms;
}

.hide-guide *[data-type='sorter'] {
  transition: all ease-in-out 300ms;
}
</style>