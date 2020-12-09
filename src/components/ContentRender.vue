<script>

import createUniqueId from "@/lib/createUniqueId.ts";
import SortableContent from "@/lib/SortableContent";
import cssToObject from 'css-to-object';
import {cloneAll, contentModelFactory} from "@/lib/createUniqueId";

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
      'update:content': this.updateContentValue
    };
    if( typeof value === 'string'){
      // 일반 텍스트는 랜더러에서 직접 수정할 수 있게 합니다.
      return h('inner-text', {props:{value:value,contentRender:this}, on:SelectorEvents});
    }
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
    const listeners = Object.assign(propsEvents, SelectorEvents, {'update:content': this.updateContents});

    const attrs = Object.assign(value.attrs || {}, selectorAttrs);

    const data = {
      class: [...value.class || [], ...this.selectorClass()],
      //style: this.getCssObjectByMedia,
      attrs: attrs,
      props: props,
      on: listeners,
      ref: 'content',
      key: value.id
    };

    return h(tag, data, childrenNode)
  },
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
    isContentRender() {
      return true;
    },
    getValue() {
      return this.value;
    },
    /**
     * @return {EditorStates}
     * */
    getState() {
      return this.$editor.contentStates;
    },
    selectedContent: {
      get: function () {
        return this.getState.selectedContent;
      },
      set: function (component) {
        if (this.isSorting) {
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
        if (this.isSorting) {
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
        this.getState.selectedElement = component;
      }
    },
    contentStyleObject: {
      get: function () {
        const mainCss = this.value.cssObject[this.$editor.getCurrentMedia];

        return Object.assign({}, this.value.cssObject['mobile'], this.value.cssObject['tablet'], mainCss);
      },
      set: function (value) {
        this.$editor.setRollBackPoint();
        this.setCssObject(value);
        this.updateContentValue(this.value);
      }
    },
    getCssTextToObject() {
      return cssToObject(this.value.cssText || {}, {
        camelCase: false,
        numbers: false
      })
    },
    getClass() {
      return [...this.value.class || [], ...this.selectorClass()];
    },
    getTag() {
      return this.value.tag || 'div';
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
    attributeToCss(attribute, depth = 1) {
      return Object.entries(attribute).map(([k, v]) => {
        const spaces = "  ".repeat(depth);
        if (typeof v === 'object') {
          const toCss = this.attributeToCss(v, depth + 1);
          return `${spaces}${k} {\n  ${toCss}\n  }\n`;
        }
        return `${spaces}${k}: ${v};\n`;
      })
    },

    /**
     * @param {CSSStyleDeclaration} style
     * @param media
     */
    setCssObject(style, media) {
      if(!media){
        media = this.$editor.getCurrentMedia;
      }
      const cssObjectElement = this.value.cssObject[media];
      for (const [key, value] of Object.entries(style)) {
        if(value){
          this.$set( cssObjectElement, key, value);
          continue;
        }
        if( !value && cssObjectElement[key] ){
          this.$delete(cssObjectElement, key);
        }

      }

      this.changingUpdate()
    },
    objectToCss() {
      if (!this.value.cssObject) return '';

      const map = Object.entries(this.value.cssObject).map(([key, value]) => {
        if (!value) {
          return '';
        }
        return [key + "{\n", this.attributeToCss(value), "}\n"].join();
      });
      return map.join("");
    },
    getPropsEvents(keys) {

      return Object.fromEntries(keys.map((key) => {
        return ["update:" + key, (val) => {

          this.$editor.setRollBackPoint();
          if(this.value.props[key]){
            this.value.props[key] = val
          }else{
            this.$set(this.value.props, key, val);
          }
          this.refreshValue()
        }];
      }));
    },
    refreshValue(){
      console.log(3)
      this.$emit('update:content', cloneAll(this.value));
    },
    changingUpdate() {
      console.log(2)
      this.$emit('update:content', cloneAll(this.value));
    },
    updateContentValue(value) {
      console.log(1)
      this.$emit('update:content', cloneAll(value));
    },
    createChild(h, child) {
      return h('content-render', {props: {value: child, parent: this}, key: child.id});
    },
    selectorClass() {
      const classes = [];

      if (this.isEditing && this.$editor.options.showGuide) {
        classes.push('is-editable');
      }
      if ((this.isSelectedContent || this.isFocusedContent) && this.$editor.options.showGuide) {
        classes.push('is-selected');
      }
      if (this.isLabelBottom) {
        classes.push('label-bottom');
      }
      if (this.$editor.options.showGrid || this.$editor.contentStates.isSorting) {
        classes.push('show-guide');
      }

      return classes;
    },
    setUid() {
      if (this.isStringType) {
        return;
      }

      this.$emit('update:content', contentModelFactory(this.value))
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
      this.parent.refreshValue();
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
      if (this.focusedContent || this.editingContent) {
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
        if (e.target !== this.$el) {
          const parentContentRender = this.getParentContentRender(e.target);

          if (parentContentRender) {
            this.focusedContent = {id: this.contentId, component: this};
            e.stopPropagation();
            return;
          }
        }
        this.focusedContent = {id: this.getDataIdFrom(e), component: this};
        this.selectedContent = null;
      }

      e.stopPropagation();
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

    createUid() {
      return createUniqueId();
    },
    labelStyle() {
      const rect = this.$el.getBoundingClientRect();
      this.isLabelBottom = rect.y < 20;
    },
    updateContents(val) {
      this.$editor.setRollBackPoint();
      this.$emit('update:content', cloneAll(val));
    },
    move(arr, fromIndex, toIndex) {
      const item = arr[fromIndex];
      this.$delete(arr, fromIndex)
      arr.splice(toIndex, 0, item);
    },
    initSorting() {

      if (this.value.contents || this.value.tag === 'div') {
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
<style>
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

.is-editable {
  outline-color: orange;
}

.is-editable:before {
  background-color: orange !important;
}

.show-guide {
  border: 1px dashed #606060;
  padding: 1rem;
  transition: width,height,padding,margin ease-in-out 300ms;
}

.hide-guide {
  transition: width,height,padding,margin ease-in-out 300ms;
}
</style>