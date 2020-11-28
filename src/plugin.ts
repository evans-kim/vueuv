import Vue, {ComponentOptions, VueConstructor, PluginObject} from "vue";

import VueuvEditor from '@/components/VueuvEditor.vue';
import InnerText from "@/Contents/InnerText.vue"
import ContentExporter from "@/components/ContentExporter.vue";
import ContentRender from "@/components/ContentRender.vue";
import ContentStyle from "@/components/ContentStyle.vue";
import Modal from "@/components/Modal.vue";
import {CombinedVueInstance, ExtendedVue} from "vue/types/vue";
import {ModalProp} from "@/types/VueuvTypes";

interface VueuvOption {
    plugins: ComponentOptions<any>[];
}

interface ContentRenderMouseEvents {
    click: Function;
    dblclick: Function;
    mouseover: Function;
}

export {VueuvEditor};


export class ModalPlugin {

    private Component: ExtendedVue<Vue, unknown, { hide(): void; exec(): void }, unknown, {
        visible: boolean; body: string; yesButton: string; noButton: string; title: string;
    }> = Vue.extend(Modal);

    private options: ModalProp = {};
    public instance?: any;

    show(options: ModalProp) {

        this.options = Object.assign(options, {visible:true});
        return this.render();
    }

    render() {
        return new Promise((resolve, reject) => {

            this.instance = new this.Component({propsData: this.options});
            this.instance.$on('update:visible', (value)=>{
                this.instance.visible = false;

            })
            this.instance.$on('success', (event) => {
                resolve(true);
                setTimeout(()=>{
                    this.instance.$destroy();
                }, 1000)
            })
            this.instance.$on('fail', (event) => {
                reject(false);
                setTimeout(()=>{
                    this.instance.$destroy();
                }, 1000)
            })
            this.instance.$mount();
            document.body.appendChild(this.instance.$el);
        })
    }

}

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

            Vue.$vueuePlugins = options.plugins;
            Vue.prototype.$vueuvModal = new ModalPlugin();
        }

        Vue.component(InnerText.name, InnerText);
        Vue.component(ContentRender.name, ContentRender);
        Vue.component(VueuvEditor.name, VueuvEditor);
        Vue.component(ContentStyle.name, ContentStyle);
        Vue.component(ContentExporter.name, ContentExporter);

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
