<script>

import CodeEditor from "@/components/CodeEditor";
import createUniqueId from "@/lib/createUniqueId";
import Draggable from 'vuedraggable';
import InnerText from "@/Contents/InnerText";

export default {
  name: 'ContentRender',
  render(h) {

    const value = this.value;
    if (!value) {
      return;
    }
    const SelectorEvents = {
      dblclick: this.activeContent,
      click: this.focusContent,
      mouseover: this.selectContent,

    };
    const props = value.props || {};
    const keys = Object.keys(props);
    let propsEvents = {};
    if(keys.length){
      propsEvents = Object.fromEntries( keys.map((key) => {
        return ["update:" + key, (val) => {
          console.log(val)
          this.$set(this.value.props, key, val);
        }];
      }) )
    }

    const children = value.contents || [];

    const childrenNode = children.map((child, idx) => {
      if (typeof child === 'string') {
        return child;
      }
      return h('content-render', {props: {value: child, parent: this}, key: idx})
    });

    const tag = value.tag || 'div';

    return h(tag, {
      class: [...value.class || [], this.selectorClass],
      style: value.style || {},
      attrs: Object.assign(value.attrs || {}, props, {
        'data-id': this.getUid,
        'data-title': this.getTag
      }),
      props: props,
      on: Object.assign(propsEvents, SelectorEvents),
      ref: 'content'

    }, childrenNode)
  },
  components: {InnerText, CodeEditor, Draggable: Draggable},
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
      isEdited: false,
      isLabelBottom: false,
    }
  },
  computed: {
    /**
     * @return {EditorStates}
     * */
    getState() {
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
    selectorClass() {
      const classes = [];
      if (this.isEditing) {
        classes.push('is-editable');
      }
      if (this.isSelectedContent || this.isFocusedContent) {
        classes.push('is-selected');
      }
      if (this.isLabelBottom) {
        classes.push('label-bottom');
      }
      if (this.$editor.config.showGrid) {
        classes.push('show-guide');
      }
      return classes;
    },
    getClass() {
      return [...this.value.class];
    },
    getTag() {
      return this.value.tag || 'text';
    },
    contentId() {
      return this.value.id;
    },
    isSelectedContent() {
      return this.selectedContent && this.selectedContent.id === this.contentId;
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
    },
    getAttrs() {
      return Object.assign(this.value.attrs || {}, this.value.props || {})
    }
  },
  methods: {
    setUid() {
      if (this.isStringType) {
        return;
      }
      if (!this.value.id) {
        this.$set(this.value, 'id', this.createUid())
      }
    },
    deleteContent() {

      if (!this.parent) {
        console.warn('Root cannot be removed');
        return false;
      }
      this.parent.contents = this.parent.contents.filter((content) => {
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
      if(this.focusedContent){
        return ;
      }
      if (!event.target !== this.$el) {
        const parentContentRender = this.getParentContentRender(event.target);

        if (parentContentRender) {
          this.selectedContent = {id: this.contentId, component: this};
          event.stopPropagation();
          return;
        }
      }
      if (this.getState.isSorting) {
        return false;
      }

      this.selectedContent = {id: this.contentId, component: this};

      this.$nextTick(() => {
        this.labelStyle();
      });

      event.stopPropagation();
    },
    setEditingContentAsThis() {
      this.focusedContent = {id: this.contentId, component: this};
      console.log(this.$refs['content'], this.$children)
      if (this.$refs['content'] && this.$refs['content'].enableEdit) {
        this.$refs['content'].enableEdit();
      } else {
        this.isEdited = true;

      }

      this.setEditingContent()
    },
    activeContent(e) {

      if (this.isEditing) {
        this.unsetEditingContent()
        e.stopPropagation();
        return;
      }
      this.setEditingContentAsThis();
      e.stopPropagation();
    },
    unsetEditingContent() {
      const component = this.editingContent.component;

      if (component.$refs['content'] && component.$refs['content'].disableEdit) {
        component.$refs['content'].disableEdit(this);
      } else {
        this.isEdited = false;
        console.log(component.$el.innerHTML);
        this.$emit('update:value', component.$el.innerHTML);
      }
      this.getState.editingContent = null;
    },
    setEditingContent() {
      this.selectedContent = null;
      this.focusedContent = null;
      this.getState.editingContent = {id: this.getUid, component: this};
    },
    setFocusedContent() {
      this.selectedContent = null;
      this.editingContent = null;
      this.getState.focusedContent = {id: this.getUid, component: this};
    },
    focusContent(e) {
      // 이전에 수정중인 컨덴츠가 있다면 비활성화 합니다.
      if (this.editingContent && !this.isEditing) {
        this.focusedContent = null;
        this.selectedContent = null;
        this.unsetEditingContent();
      }

      if(this.focusedContent && this.focusedContent.id === this.contentId){
        this.focusedContent = null;
        this.selectedContent = null;
      }else{
        this.selectedContent = null;
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
    updateValue(val) {
      this.$emit('input', val);
    }
  },
  created() {
    this.setUid();
  }
}
</script>
<style lang="scss" scoped>
.sortable-chosen{
  transition: all ease-in-out 0.3ms ;
}

.ghost {
  background-color: #e1e2e3;
  opacity: .5;
}

.is-selected, .is-editable {
  outline: #42b983 2px solid;
}

.is-editable {
  outline-color: orange;
}

.is-editable:before {
  background-color: orange !important;
}

.show-guide {
  outline: 1px dashed #606060;
  padding: 1rem;
  transition: all ease-in-out 300ms;
}

.hide-guide *[data-type='sorter'] {
  transition: all ease-in-out 300ms;
}
</style>