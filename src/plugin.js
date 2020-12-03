import VueuvEditor from '@/components/VueuvEditor.vue';
import InnerText from "@/Contents/InnerText.vue"
import ContentExporter from "@/components/ContentExporter.vue";
import ContentRender from "@/components/ContentRender.vue";
import ContentStyle from "@/components/ContentStyle.vue";
import Helper from "@/components/Helper.vue";
import ModalPlugin from "@/lib/ModalPlugin";

export {VueuvEditor};
import VTooltip from 'v-tooltip'

export default {
    install(Vue, options) {
        // 툴팁 플러그인 설치
        Vue.use(VTooltip)
        // 데이터를 위한 플러그인이 있다면 컴포넌트로 등록합니다.
        if (options.plugins.length > 0) {

            options.plugins.map((option) => {
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

            Vue.$vueuePlugins = options.plugins;
            Vue.prototype.$vueuvModal = new ModalPlugin();
        }

        Vue.component(InnerText.name, InnerText);
        Vue.component(ContentRender.name, ContentRender);
        Vue.component(VueuvEditor.name, VueuvEditor);
        Vue.component(ContentStyle.name, ContentStyle);
        Vue.component(ContentExporter.name, ContentExporter);
        Vue.component(Helper.name, Helper);

        /**
         * 커스텀 컴포넌트에 셀렉트에 필요한 이벤트를 추가하는 다이렉티브
         */
        Vue.directive('vueuv-content', {
            bind(el, binding, vnode) {
                // Content Render에서 상속되는 listener 를 추가합니다. "
                const events = vnode.context.$listeners;
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
}
