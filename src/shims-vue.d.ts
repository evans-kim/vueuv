import {ComponentOptions} from "vue";
import {ModalPlugin} from "@/plugin";

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    $vueuePlugins: Array<ComponentOptions<any>>;
    $vueuvModal: ModalPlugin;
  }
}
