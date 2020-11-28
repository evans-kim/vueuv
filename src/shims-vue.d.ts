import {ComponentOptions} from "vue";
import {ModalPlugin} from "@/plugin";
import {Editor} from "@/types/VueuvTypes";

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $editor: Editor
  }
  // 3. Vue에 보강할 내용을 선언하세요.
  interface VueConstructor {
    $vueuePlugins: Array<ComponentOptions<any>>;
    $vueuvModal: ModalPlugin;
  }
}