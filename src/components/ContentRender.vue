<script lang="ts">

import VueuvEditor from "@/components/VueuvEditor.vue";
import {Component, Inject, Prop, Vue} from "vue-property-decorator";
import cssToObject from '@/lib/CssParser';
import {ContentModel, StatedContentRender} from "@/types/VueuvTypes";
import {cloneAll, contentModelFactory} from "@/lib/createUniqueId";
import SortableContent, {SortableVue} from "@/lib/SortableContent";

interface EditableContent extends Vue{

  enableEdit(): void;
  disableEdit(render: ContentRender);
}


@Component
export default class ContentRender extends Vue {

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
    if (typeof value === 'string') {
      // 일반 텍스트는 랜더러에서 직접 수정할 수 있게 합니다.
      return h('inner-text', {props: {value: value, contentRender: this}, on: SelectorEvents});
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
  }

  @Inject('$editor') readonly $editor!: VueuvEditor;
  @Prop({
    type: [Object, String],
    required: true
  }) readonly value!: ContentModel;
  @Prop({
    type: Object
  }) readonly parent!: ContentRender | null

  uid = null;
  isEdited = false;
  isLabelBottom = false;
  isGuided = false;
  sortable = null as SortableContent | null;

  get isContentRender() {
    return true;
  }

  get getValue() {
    return this.value as ContentModel;
  }

  get getState() {
    return this.$editor.contentStates;
  }

  get selectedContent() {
    return this.getState.selectedContent;
  }

  set selectedContent(component) {
    if (this.isSorting) {
      return;
    }
    this.getState.selectedContent = component;
  }


  get focusedContent() {
    return this.getState.focusedContent as StatedContentRender | undefined;
  }

  set focusedContent(component) {
    this.getState.focusedContent = component;
  }

  get isSorting() {
    return this.getState.isSorting;
  }

  set isSorting(value) {
    this.getState.isSorting = value;
  }

  get editingContent() {
    return this.getState.editingContent || undefined;
  }

  set editingContent(val) {
    this.getState.editingContent = val;
  }

  get getCssObject() {
    if (!this.value || typeof this.value === 'string') {
      return {}
    }
    return this.value.cssObject;
  }

  get contentStyleObject() {
    if (typeof this.value === 'string') {
      return {};
    }
    const mainCss = this.getCssObject[this.$editor.getCurrentMedia];

    return Object.assign({}, this.getCssObject['mobile'], this.getCssObject['tablet'], mainCss);
  }

  set contentStyleObject(value) {
    this.$editor.setRollBackPoint();
    this.setCssObject(value);
    this.updateContentValue(this.value);
  }

  get getClass() {
    return [...this.getValue.class || [], ...this.selectorClass()];
  }

  get getTag() {
    return this.getValue.tag || 'div';
  }

  get contentId() {
    return this.getValue.id;
  }

  get isSelectedContent() {
    return this.selectedContent && this.selectedContent.id === this.contentId;
  }

  get isFocusedContent(): boolean {
    if (!this.focusedContent) {
      return false;
    }
    return this.focusedContent.component === this as ContentRender;
  }

  get isEditing() {
    if (!this.editingContent) {
      return false
    }
    return this.editingContent && this.editingContent.component === this;

  }

  get getUid() {
    return this.getValue.id;
  }

  get isStringType() {
    return typeof this.value === 'string';
  }

  get getAttrs() {
    return Object.assign(this.getValue.attrs || {}, this.getValue.props || {})
  }

  get parentValue() {
    if (!this.parent)
      return null;

    return this.parent.value as ContentModel;
  }

  get getIndexFromParent() {
    if (!this.parentValue || !this.parentValue.contents?.length) {
      return null;
    }
    return this.parentValue.contents.map(content => content.id).indexOf(this.getValue.id)
  }

  attributeToCss(attribute, depth = 1) {
    return Object.entries(attribute).map(([k, v]) => {
      const spaces = "  ".repeat(depth);
      if (typeof v === 'object') {
        const toCss = this.attributeToCss(v, depth + 1);
        return `${spaces}${k} {\n  ${toCss}\n  }\n`;
      }
      return `${spaces}${k}: ${v};\n`;
    })
  }


  setCssObject(style, media?: string) {
    if(!style){
      return;
    }
    if (!media) {
      media = this.$editor.getCurrentMedia;
    }
    const cssObjectElement = this.getCssObject[media];

    for (const [key, value] of Object.entries(style)) {
      if (value) {
        this.$set(cssObjectElement, key, value);
        if(typeof value === 'object'){

          if(value)
          for (const [k,v] of Object.entries(value)) {
            this.$set(cssObjectElement[key], k, v);
          }
        }

        continue;
      }
      if (!value && cssObjectElement[key]) {
        this.$delete(cssObjectElement, key);
      }

    }

    this.changingUpdate()
  }

  getPropsEvents(keys) {

    return Object.fromEntries(keys.map((key) => {
      return ["update:" + key, (val) => {

        this.$editor.setRollBackPoint();
        if (this.getValue.props && this.getValue.props[key]) {
          this.getValue.props[key] = val
        } else {
          if (this.getValue.props)
            this.$set(this.getValue.props, key, val);
        }
        this.refreshValue()
      }];
    }));
  }

  refreshValue() {
    this.$emit('update:content', cloneAll(this.getValue));
  }

  changingUpdate() {
    this.$emit('update:content', cloneAll(this.getValue));
  }

  updateContentValue(value) {
    this.$emit('update:content', cloneAll(value));
  }

  createChild(h, child) {
    return h('content-render', {props: {value: child, parent: this}, key: child.id});
  }

  selectorClass() {
    const classes = [] as Array<string>;

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
  }

  setUid() {
    if (this.isStringType) {
      return;
    }

    this.$editor.repository.factory(this.value)
  }

  deleteContent() {

    if (!this.parentValue || !this.parentValue.contents?.length) {
      return false;
    }
    const index = this.getIndexFromParent;
    if (index)
      this.parentValue.contents.splice(index, 1)

    this.focusedContent = undefined;
    this.editingContent = undefined;
    this.selectedContent = undefined;

  }

  getDataIdFrom(event) {
    return event.target.getAttribute('data-id');
  }

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
  }

  selectContent(event: Event) {
    if (this.focusedContent || this.editingContent) {
      return;
    }
    if (event.target !== this.$el) {
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
  }

  focusContent(e) {
    // 이전에 수정중인 컨덴츠가 있다면 비활성화 합니다.
    if (this.editingContent && !this.isEditing) {
      this.focusedContent = undefined;
      this.selectedContent = undefined;
      this.unsetEditingContent();
    }

    if (this.focusedContent && this.focusedContent.id === this.contentId) {
      this.focusedContent = undefined;
      this.selectedContent = undefined;
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
      this.selectedContent = undefined;
    }

    e.stopPropagation();
  }

  activeContent(e) {

    if (this.isEditing) {
      this.unsetEditingContent()
      e.stopPropagation();
      return;
    }
    this.setEditingContentAsThis();

    e.stopPropagation();
  }

  setEditingContentAsThis() {
    this.focusedContent = {id: this.contentId, component: this};

    this.setEditingContent()
  }

  get refContent() {
    return this.$refs['content'] as unknown as EditableContent
  }

  unsetEditingContent() {
    const component = this.editingContent?.component;
    if (!component) {
      return;
    }
    if (component.refContent && component.refContent.disableEdit) {
      component.refContent.disableEdit(this);
    } else {
      this.isEdited = false;
    }
    this.getState.editingContent = undefined;
  }

  setEditingContent() {
    this.selectedContent = undefined;
    this.editingContent = undefined;

    this.getState.editingContent = {id: this.getUid, component: this};

    if (this.refContent && this.refContent.enableEdit) {
      this.refContent.enableEdit();
    } else {
      this.isEdited = true;
    }
  }

  setFocusedContent() {
    this.selectedContent = undefined;
    this.editingContent = undefined;
    this.getState.focusedContent = {id: this.getUid, component: this};
  }

  labelStyle() {
    const rect = this.$el.getBoundingClientRect();
    this.isLabelBottom = rect.y < 20;
  }

  updateContents(val) {
    this.$editor.setRollBackPoint();
    this.$emit('update:content', cloneAll(val));
  }

  move(arr, fromIndex, toIndex) {
    const item = arr[fromIndex];
    this.$delete(arr, fromIndex)
    arr.splice(toIndex, 0, item);
  }

  initSorting() {

    if (this.getValue.contents || this.getValue.tag === 'div') {
      this.sortable = new SortableContent(this as SortableVue)
      this.sortable.init();
    }
  }

  created() {
    this.setUid();
  }

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
  transition: width, height, padding, margin ease-in-out 300ms;
}

.hide-guide {
  transition: width, height, padding, margin ease-in-out 300ms;
}
</style>