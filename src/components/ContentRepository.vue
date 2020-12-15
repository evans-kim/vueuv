<template>
  <div v-if="dump" class="whitespace-pre p-2 border bg-white shadow rounded m-2 inline-block">
    {{ this.model }}
  </div>
</template>
<script lang="ts">

import VueuvEditor from "@/components/VueuvEditor.vue";
import {Component, Inject, Prop, Vue} from "vue-property-decorator";
import {ContentModel} from "@/types/VueuvTypes";
import cloneDeep from "lodash/cloneDeep";

/**
 * This Component is a repository for Vueuv Content Model.
 * This Component help you control whole data easily
 */
@Component
export default class ContentRepository extends Vue{
  @Inject('$editor') readonly $editor!: VueuvEditor
  @Prop({type: Boolean, default:false}) dump?: boolean;

  mounted(){
    this.$emit('load', true);
  }
  setModel(model: ContentModel){
    this.model = model;
  }

  model: ContentModel = {
    tag: 'div',
    id: 'vueuv-content-root',
    isRootContent: true,
    class: [],
    cssObject: {
      desktop: {},
      tablet: {},
      mobile: {},
      extra:{}
    },
    contents: []
  };

  get defaultModel(){
    return{
      tag: '',
      id: '',
      class: [],
      cssObject: {
        desktop: {},
        tablet: {},
        mobile: {},
        extra: {},
      }
    }
  }

  createUid(): string {
    return "vueuv-" + Math.random().toString(36).substr(2, 6);
  }

  reactive(data: object) {
    if (typeof data !== 'object') {
      return;
    }
    Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object') {
        this.reactive(value)
      } else {
        Vue.set(data, key, value);
      }
    })
  }

  factory(content?: ContentModel ) {

    if(!content){
      content = this.defaultModel;
    }

    if(!content.id){
      content.id = this.createUid();
    }

    if (!content.class) {
      content.class = [];
    }

    if (!content.cssObject) {
      content.cssObject = {
        'desktop': {},
        'tablet': {},
        'mobile': {},
        'extra' : {}
      };
    }

    if(!content.tag){
      content.tag = 'div';
    }

    this.reactive(content);

    if (content.contents && content.contents.length) {
      content.contents.map(con => {
        this.factory(con);
      });
    }
    return content;
  }

  appendTo(id, model){
    this.getModelById(id)?.contents.push(model)
  }

  move(arr, fromIndex, toIndex) {
    const item = arr[fromIndex];
    this.$delete(arr, fromIndex)
    arr.splice(toIndex, 0, item);
  }
  refreshId(content: ContentModel){
    content.id = this.createUid();
    if(!content.contents){
      return;
    }
    content.contents.map((child)=>{
      this.refreshId(child)
    })
  }
  makeClone(model: ContentModel){

    const content = cloneDeep(model);
    this.refreshId(content);

    return this.factory(content);
  }

  getModelById(id, parent?: ContentModel){
    if(!parent){
      parent = this.model;
    }
    if(parent.id === id){
      return parent;
    }
    if( !parent.contents || parent.contents.length === 0 ){
      return undefined;
    }
    for (let i = 0; i < parent.contents.length; i++) {
      const result = this.getModelById(id, parent.contents[i])
      if(result){
        return result;
      }
    }

  }
}
</script>