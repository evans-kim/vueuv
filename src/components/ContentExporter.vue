<script lang="ts">
import {VNode} from "vue";
import {ContentModel} from "@/types/VueuvTypes";
import {CombinedVueInstance} from "vue/types/vue";
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class ContentExporter extends Vue{
  @Prop({type: [Object, String], required: true}) readonly value!: string;

  render(h) {

    const vm = this as CombinedVueInstance<any, any, any, any, any>;
    const value = vm.value as string | ContentModel;

    if (typeof value === 'string') {
      return vm._v(value)

    } else {

      const children = value.contents || [];
      const childrenNode = children.map((child: any, idx: any) => {
        return h('content-exporter', {props: {value: child}, key: child.id})
      }) as VNode[];

      return h(value.tag || 'div', {
        class: value.class || [],
        attrs: Object.assign( {}, vm.$attrs, value.attrs ||{}, {id:value.id}),
        props: value.props || {},
      }, childrenNode)
    }
  }
}
</script>