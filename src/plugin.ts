import {ComponentOptions, VueConstructor,PluginObject} from "vue";
import VueuvEditor from '@/components/VueuvEditor.vue';
import {CombinedVueInstance} from "vue/types/vue";
interface VueuvOption {
    plugins: ComponentOptions<any>[];
}

export {VueuvEditor};

export default {
    install(Vue: VueConstructor, options: VueuvOption){
        // 데이터를 위한 플러그인이 있다면 컴포넌트로 등록합니다.
        if( options.plugins.length > 0 ){

            options.plugins.map((option: ComponentOptions<any>)=>{
                if( !option.methods || !option.methods.enableEdit || !option.methods.disableEdit){
                    console.warn(option.name + ' cannot be registered. Vueuv Plugin must have [enableEdit, disableEdit] methods.');
                    return ;
                }

                if(!option.name){
                    console.warn('Non name component. It cannot be registered.')
                    return ;
                }
                Vue.component(option.name, option);
            })
            //VueuvEditor.customContents = options.plugins;
        }
        // 에디터 등록
        Vue.component(VueuvEditor.name, VueuvEditor);

        //다이렉티브 div 안에 있는 raw html 을 기반으로 작업 지원
        // 2. 전역 에셋 추가
        Vue.directive('vueuv', {
            bind (el, binding, vnode, oldVnode) {
                
                console.log(el, vnode, binding);
            }
        })
    }
} as PluginObject<any>