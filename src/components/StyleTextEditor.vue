<template>
  <div>
    <class-tag-input :value="getTargetClasses" @input="classHandler"></class-tag-input>

    <div class="my-1 p-1">
      <div class="flex items-baseline flex-1">
        <ev-tag>Class</ev-tag>
        <ev-tag color="green" v-for="(cls, idx) in getTargetClasses" :key="idx"
                @click.stop="addClassToCssText(cls)">
          {{ cls }}
        </ev-tag>
      </div>
      <div>
        <ev-tag>ID</ev-tag>
        <ev-tag color="green" @click.stop="addIdSelectorToCssText">#{{ focusedContent.value.id }}</ev-tag>
      </div>
    </div>
    <h4>Style</h4>
    <code-editor v-model="getTargetStyleText"></code-editor>
  </div>
</template>

<script lang="ts">
import {attributeToCss} from "@/lib/createUniqueId";
import CodeEditor from "@/components/CodeEditor.vue";

import Vue from "vue";
import ContentRender from "@/components/ContentRender.vue";
import cssToObject from '@/lib/CssParser'
import ClassTagInput from "@/components/ClassTagInput.vue";
import {Component, Inject} from "vue-property-decorator";
import VueuvEditor from "@/components/VueuvEditor.vue";
import EvTag from "@/components/forms/EvTag.vue";

@Component({
  name: "StyleTextEditor",
  components: {EvTag, ClassTagInput, CodeEditor}
})
export default class StyleTextEditor extends Vue {
  @Inject('$editor') readonly $editor!: VueuvEditor;

  get focusedContent(): ContentRender {
    if(!this.$editor.contentStates.focusedContent || !this.$editor.contentStates.focusedContent.component){
      throw new Error('focusedContent could not be found.');
    }
    return this.$editor.contentStates.focusedContent.component;
  }

  get getCssObjectToString() {
    if (!this.focusedContent) {
      return '';
    }
    const content = this.focusedContent.value;

    return Object.entries(this.$editor.mediaQuery).map(([media, query]) => {
      if (!content.cssObject) {
        return '';
      }
      if (media === 'desktop') {
        return attributeToCss({['#' + content.id]: content.cssObject.desktop})
      }
      if (media === 'extra'){
        if(content.cssObject.extra)
          return attributeToCss(content.cssObject.extra)
        else
          return ;
      }
      return attributeToCss({[query]:{['#' + content.id]: content.cssObject[media]}})
    }).join("\n")
  }
  get getTargetClasses(){
    return this.focusedContent.value.class || []
  }
  get getTargetStyleText() {
    return this.getCssObjectToString || ''
  }

  set getTargetStyleText(value) {

    //this.focusedContent.value.cssText = value;

    const object = cssToObject(value || '', {
      camelCase: false,
      numbers: false
    }) as object;

    this.focusedContent.value.cssObject.extra = {};

    Object.entries(object).map(([key, value]) => {
      if(!value){
        return;
      }
      const id = "#" + this.focusedContent.value.id;
      if (key === id) {
        this.focusedContent.setCssObject(value, 'desktop')
      }else if (key === this.$editor.mediaQuery.tablet) {
        this.focusedContent.setCssObject(value[id], 'tablet')
      }else if (key === this.$editor.mediaQuery.mobile) {
        this.focusedContent.setCssObject(value[id], 'mobile')
      }else{
        this.focusedContent.setCssObject({[key] : value}, 'extra')
      }
    });


  }

  addIdSelectorToCssText() {
    let cssText = "#" + this.focusedContent.value.id + "{\n  \n}";
    if (this.$editor.media.mobile) {
      cssText = this.$editor.mediaQuery.mobile + "{\n" +
          "  #" + this.focusedContent.value.id + "{\n" +
          "  \n" +
          "  }\n" +
          "}";
    }
    if (this.focusedContent.value.cssText) {
      this.focusedContent.value.cssText += cssText;
    } else {
      this.getTargetStyleText = cssText;
    }
  }

  addClassToCssText(cls) {
    const cssText = "\n." + cls + "{\n  \n}";
    if (this.focusedContent.value.cssText) {
      this.focusedContent.value.cssText += cssText;
    } else {
      this.getTargetStyleText = cssText;
    }
  }

  classHandler(values) {
    this.updateFocusedValue(values, 'class')
  }

  updateValue(value) {
    this.focusedContent.updateContentValue(value);
  }

  updateFocusedValue(value, key) {
    this.$editor.setRollBackPoint();

    const oldValue = this.focusedContent.value;

    if (!key) {
      this.updateValue(value)
      return;
    }

    if(!oldValue[key]){
      this.$set(oldValue, key, value);
    }else{
      oldValue[key] = value;
    }

    this.updateValue(oldValue)

  }
}
</script>