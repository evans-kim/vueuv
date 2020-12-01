import Modal from "@/components/Modal.vue";

import {ModalProp} from "@/types/VueuvTypes";
import {ExtendedVue} from "vue/types/vue";
import Vue from 'vue';

export default class ModalPlugin {

    Component: ExtendedVue<Vue, unknown, { hide(): void; exec(): void }, unknown, {
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