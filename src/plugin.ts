import Vue,{ ComponentOptions, VueConstructor, PluginObject} from "vue";

import VueuvEditor from '@/components/VueuvEditor.vue';
import InnerText from "@/Contents/InnerText.vue"
interface VueuvOption {
    plugins: ComponentOptions<any>[];
}

interface ContentRenderMouseEvents{
    click: Function;
    dblclick: Function;
    mouseover: Function;
}


declare module 'vue/types/vue' {
    // 3. Vue에 보강할 내용을 선언하세요.
    interface VueConstructor {
        $vueuePlugins: Array<ComponentOptions<any>>;
    }
}

export {VueuvEditor};

export default {
    install(Vue: VueConstructor, options: VueuvOption) {
        // 데이터를 위한 플러그인이 있다면 컴포넌트로 등록합니다.
        if (options.plugins.length > 0) {

            options.plugins.map((option: ComponentOptions<any>) => {
                if (!option.methods || !option.methods.enableEdit || !option.methods.disableEdit) {
                    console.warn(option.name + ' cannot be registered. Vueuv Plugin must have [enableEdit, disableEdit] methods.');
                    return;
                }

                if (!option.name) {
                    console.warn('No name component. It cannot be registered.');
                    return;
                }
                Vue.component(option.name, option);
            });
            //VueuvEditor.customContents = options.plugins;
            Vue.$vueuePlugins = options.plugins;
        }
        Vue.component(InnerText.name, InnerText);
        Vue.component(VueuvEditor.name, VueuvEditor);
        /**
         * 커스텀 컴포넌트에 셀렉트에 필요한 이벤트를 추가하는 다이렉티브
         */
        Vue.directive('vueuv-content', {
            bind(el, binding, vnode, oldVnode) {
                // Content Render에서 상속되는 listener 를 추가합니다. "
                const events = vnode.context?.$listeners as unknown as ContentRenderMouseEvents;
                ['click', 'dblclick', 'mouseover'].map((k) => {
                    // 필요에 따라 대체할 수 있습니다.
                    if (binding.value && binding.value[k]) {
                        el.addEventListener(k, binding.value[k]);
                        return;
                    }
                    if (events[k]) {
                        el.addEventListener(k, events[k]);
                    }
                });
            }
        });
    }
} as unknown as PluginObject<any>