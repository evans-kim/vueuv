<template>
  <div>
    <class-tag-input :value="getTargetClasses" @input="classHandler"></class-tag-input>
    <div class="my-1 p-1">
      <div class="flex items-baseline flex-1">
        <ev-tag>Class</ev-tag>
        <div>
          <button class="btn btn-green" v-for="(cls, idx) in getTargetClasses" :key="idx"
                  @click.stop="addClassToCssText(cls)">
            {{ cls }}
          </button>
        </div>
      </div>
      <div>
        <ev-tag>ID</ev-tag>
        <button class="btn btn-green" @click.stop="addIdSelectorToCssText">#{{ focusedContent.value.id }}</button>
      </div>
    </div>
    <code-editor v-model="getTargetStyleText"></code-editor>
  </div>
</template>

<script lang="ts">
import {attributeToCss} from "@/lib/createUniqueId";
import CodeEditor from "@/components/CodeEditor.vue";

import Vue from "vue";
import {ContentRender} from "@/types/VueuvTypes";
import cssToObject from 'css-to-object'
import ClassTagInput from "@/components/ClassTagInput.vue";
import {Component, Inject} from "vue-property-decorator";
import VueuvEditor from "@/components/VueuvEditor.vue";
import EvTag from "@/components/forms/EvTag.vue";

@Component({
  name: "StyleTextEditor",
  components: {EvTag, ClassTagInput, CodeEditor},
})
export default class StyleTextEditor extends Vue {
  @Inject('$editor') readonly $editor!: VueuvEditor;

  get focusedContent(): ContentRender {
    if(!this.$editor.contentStates.focusedContent || !this.$editor.contentStates.focusedContent.component){
      throw new Error('focusedContent cound not be found.');
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
      return [query + "{\n", attributeToCss({['#' + content.id]: content.cssObject[media]}, 2), "}\n"].join("");
    }).join("\n")
  }
  get getTargetClasses(){
    return this.focusedContent.value.class || []
  }
  get getTargetStyleText() {
    const text = this.focusedContent.value.cssText || ''
    if (!text) {
      return this.getCssObjectToString;
    }
    return text;
  }

  set getTargetStyleText(value) {
    this.focusedContent.value.cssText = value;

    const object = cssToObject(value || '', {
      camelCase: false,
      numbers: false
    }) as object;

    Object.entries(object).map(([key, value]) => {
      const id = "#" + this.focusedContent.value.id;
      if (key === id) {
        this.focusedContent.setCssObject(value, 'desktop')
      }
      if (key === this.$editor.mediaQuery.tablet) {
        this.focusedContent.setCssObject(value[id], 'tablet')
      }
      if (key === this.$editor.mediaQuery.mobile) {
        this.focusedContent.setCssObject(value[id], 'mobile')
      }
    });

    console.log('getTargetStyleText', object);

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