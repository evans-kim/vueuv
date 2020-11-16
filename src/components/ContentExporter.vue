<script lang="ts">
import Vue, {VNode} from "vue";
import {ContentModel} from "@/types/VueuvTypes";
import {CombinedVueInstance} from "vue/types/vue";

export default Vue.extend({
  name: "ContentExporter",
  props: {
    value: {
      type: [Object, String],
      required: true
    } as object | string
  } as any,
  render(h){
    const vm = this as CombinedVueInstance<any, any, any, any, any>;
    const value = vm.value as string | ContentModel;
    if(typeof value === 'string'){
      return vm._v(value)
    } else {

      const children = value.contents || [];
      const childrenNode = children.map((child: any, idx: any)=>{
        return h('content-exporter', {props:{value:child}, key:idx})
      }) as VNode[];

      return h(value.tag, {
        class: value.class || [],
        style: value.style || {},
        attrs: Object.assign(value.attrs || {}, value.props || {}),
        props: value.props || {},

        }, childrenNode)
    }
  }
})
</script>

<style scoped>

</style>