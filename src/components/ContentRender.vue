<script>

import CodeEditor from "@/components/CodeEditor";
import createUniqueId from "@/lib/createUniqueId";
import Draggable from 'vuedraggable';
import InnerText from "@/Contents/InnerText";
import Sortable from "sortablejs";
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
      mouseover: this.selectContent,
    };
    const props = value.props || {};
    const keys = Object.keys(props);
    let propsEvents = {};
    if (keys.length) {
      propsEvents = Object.fromEntries(keys.map((key) => {
        return ["update:" + key, (val) => {
          this.$set(this.value.props, key, val);
        }];
      }))
    }

    const children = value.contents || [];

    const childrenNode = children.map((child) => {
      if (typeof child === 'string') {
        return child;
      }
      return h('content-render', {props: {value: child, parent: this}, key: child.id})
    });

    let tag = value.tag || 'div';

    if (value.tag === 'img') {
      tag = 'basic-image';
    }

    const selectorAttrs = {
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
      isGuided: false,
      sortable: null
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
    },
    getGroupOption() {
      return {name: 'content-render', pull: (this.$editor.keys.ctrl) ? 'clone' : true, put: true}
    }
  },
  methods: {
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
    setEditingContentAsThis() {
      this.focusedContent = {id: this.contentId, component: this};

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
      this.value.contents = val;
      this.$emit('input', this.value)
      this.isSorting = false;
    },
    updateValue(val) {
      this.$emit('input', val);
    },
    move(arr, fromIndex, toIndex) {
      const item = arr[fromIndex];
      this.$delete(arr, fromIndex)
      arr.splice(toIndex, 0, item);
    },
    initSorting() {

      if (this.value.contents && this.value.contents.length) {

        const _render = {vue: this};
        const editor = this.$editor;

        this.sortable = Sortable.create(this.$el, {
          group: 'content-render',
          ghostClass: 'ghost',
          animation: 200,
          onAdd: function (/**Event*/ evt) {
            const point = {
              type: 'add',
              item: evt.item.getAttribute('data-id'),
              from: evt.from.getAttribute('data-id'),
              to: evt.to.getAttribute('data-id'),
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            };
            const contentValue = editor.getContentValueById(point.item);
            _render.vue.value.contents.splice(point.newIndex, 0, contentValue)
          },
          onRemove: function (/**Event*/ evt) {
            const point = {
              type: 'remove',
              item: evt.item.getAttribute('data-id'),
              from: evt.from.getAttribute('data-id'),
              to: evt.to.getAttribute('data-id'),
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            };

            if (_render.vue.$editor.keys.ctrl) {
              console.log('복제하기')
              const idRecreate = function (content) {
                content.id = createUniqueId();
                if (content.contents)
                  content.contents.map(con => {
                    idRecreate(con);
                  });
              }

              const contentValue = cloneDeep(editor.getContentValueById(point.item));
              console.log(contentValue)
              idRecreate(contentValue);

              _render.vue.$set(_render.vue.value.contents, point.oldIndex, contentValue)
              _render.vue.$editor.refreshKey();

              console.log('복제위해 새로운 데이터를 넣습니다.', contentValue, _render.vue.value);
              return;
            }

            _render.vue.value.contents.splice(point.oldIndex, 1)

          },
          onUpdate: function (/**Event*/ evt) {
            const point = {
              type: 'update',
              item: evt.item.getAttribute('data-id'),
              from: evt.from.getAttribute('data-id'),
              to: evt.to.getAttribute('data-id'),
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            };

            _render.vue.move(_render.vue.value.contents, point.oldIndex, point.newIndex)

          }
        })
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
<style lang="scss" scoped>
.sortable-chosen {
  transition: all ease-in-out 0.3ms;
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

.hide-guide {
  transition: all ease-in-out 300ms;
}
</style>