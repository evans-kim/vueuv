<script>

import CodeEditor from "@/components/CodeEditor";
import createUniqueId from "@/lib/createUniqueId";
import InnerText from "@/Contents/InnerText";
import SortableContent from "@/lib/SortableContent";
import * as cloneDeep from "lodash/cloneDeep"

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
      mouseover: this.selectContent
    };
    const props = value.props || {};
    const keys = Object.keys(props);
    let propsEvents = {};

    if (keys.length) {
      propsEvents = this.getPropsEvents(keys)
    }

    const children = value.contents || [];

    const childrenNode = children.map((child) => {
      if (typeof child === 'string') {
        return child;
      }
      return this.createChild(h, child)
    });

    let tag = value.tag || 'div';

    if (value.tag === 'img') {
      tag = 'basic-image';
    }

    const selectorAttrs = {
      id: this.getUid,
      'data-id': this.getUid,
      'data-title': this.getTag
    };
    const listeners = Object.assign(propsEvents, SelectorEvents);

    const attrs = Object.assign(value.attrs || {}, props, selectorAttrs);

    const data = {
      class: [...value.class || [], ...this.selectorClass()],
      style: value.style || {},
      attrs: attrs,
      props: props,
      on: listeners,
      ref: 'content',
      key: value.id
    };

    return h(tag, data, childrenNode)
  },
  components: {InnerText, CodeEditor},
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
      isGuided: false,
      sortable: null
    }
  },
  computed: {
    getValue() {
      return this.value;
    },
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
      if (!this.focusedContent) {
        return false;
      }
      return this.focusedContent.component === this;
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
    },
    getIndexFromParent() {
      if (!this.parent) {
        return null;
      }
      return this.parent.value.contents.map(content => content.id).indexOf(this.value.id)
    }
  },
  methods: {
    getPropsEvents(keys) {
      return Object.fromEntries(keys.map((key) => {
        return ["update:" + key, (val) => {

          this.$editor.setRollBackPoint();
          this.$set(this.value.props, key, val);
        }];
      }));
    },
    updateContentValue(value) {
      this.$set(this.parent.value.contents, this.getIndexFromParent, value);
    },
    createChild(h, child) {
      return h('content-render', {props: {value: child, parent: this}, key: child.id});
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
      if (this.$editor.config.showGrid || this.$editor.states.isSorting) {
        classes.push('show-guide');
      }
      if (this.isGuided) {
        classes.push('hide-guide');
      }
      return classes;
    },
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

      this.parent.value.contents = this.parent.value.contents.filter((content) => {
        return content.id !== this.value.id;
      });

      this.focusedContent = null;
      this.editingContent = null;
      this.selectedContent = null;
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

      if (this.focusedContent) {
        return;
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
    activeContent(e) {

      if (this.isEditing) {
        this.unsetEditingContent()
        e.stopPropagation();
        return;
      }
      this.setEditingContentAsThis();

      e.stopPropagation();
    },
    setEditingContentAsThis() {
      this.focusedContent = {id: this.contentId, component: this};

      this.setEditingContent()
    },
    unsetEditingContent() {
      const component = this.editingContent.component;

      if (component.$refs['content'] && component.$refs['content'].disableEdit) {
        component.$refs['content'].disableEdit(this);
      } else {
        this.isEdited = false;

        this.$emit('update:value', component.$el.innerHTML);
      }
      this.getState.editingContent = null;
    },
    setEditingContent() {
      this.selectedContent = null;
      this.editingContent = null;

      this.getState.editingContent = {id: this.getUid, component: this};
      if (this.$refs['content'] && this.$refs['content'].enableEdit) {
        this.$refs['content'].enableEdit();
      } else {
        this.isEdited = true;
      }
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

      if (this.focusedContent && this.focusedContent.id === this.contentId) {
        this.focusedContent = null;
        this.selectedContent = null;
      } else {
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
      this.$emit('input', val);
    },
    move(arr, fromIndex, toIndex) {
      const item = arr[fromIndex];
      this.$delete(arr, fromIndex)
      arr.splice(toIndex, 0, item);
    },
    initSorting() {
      if (this.value.contents) {
        this.sortable = new SortableContent(this)
        this.sortable.init();
      }
    }
  },
  created() {
    this.setUid();
  },
  mounted() {
    this.initSorting();
  }
}
</script>
<style lang="scss">
.sortable-chosen {
  transition: all ease-in-out 0.3ms;
}

.ghost, .vueuv-ghost {
  background-color: #e1e2e3;
  opacity: .5;
}

.is-selected, .is-editable {
  outline: #42b983 2px solid;
}

/*
.is-selected:before{
  content: attr(data-title);
  position: absolute;
  background-color: #42b983;
  padding: 0.2rem 0.4rem;
  z-index: 10;
  color: white;
  font-size: 9px;
  transform: translate(-2px, -22px);

}
*/
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

.hide-guide {
  transition: all ease-in-out 300ms;
}
</style>