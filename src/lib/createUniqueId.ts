import cloneDeep from "lodash/cloneDeep";
import {ContentModel} from "@/types/VueuvTypes";
import cssToObject from 'css-to-object';
import Vue from "vue";

export default function createUid() {
    return Math.random().toString(36).substr(2, 6);
}

export function idRecreate(content: ContentModel) {

    content.id = createUid();
    if(!content.class){
        Vue.set(content, 'class', []);
    }
    if(!content.cssObject){
        Vue.set(content, 'cssObject', {});
    }
    if( content.cssText ){
        content.cssText = content.cssText.replace(/#.*{?/ig, "#"+content.id+" {")
        const value = cssToObject(content.cssText, {
            camelCase: false,
            numbers: false
        });

        Vue.set(content, 'cssObject', value);
    }
    if (content.contents && content.contents.length) {
        content.contents.map(con => {
            idRecreate(con);
        });
    }
}

export function cloneAll(content) {
    return cloneDeep(content);
}

export function cloneContent(content) {

    const duplicate = cloneDeep(content);
    idRecreate(duplicate);
    return duplicate;
}

export function getCssProperties(element: HTMLElement) {

    const targetObjsStyles = window.getComputedStyle(element);

    const tempCopyOfTarget = document.createElement(element.tagName);
    document.body.insertAdjacentElement('afterbegin', tempCopyOfTarget);

    const basicElementsCSS = window.getComputedStyle(tempCopyOfTarget);

    const cleanSetOfStyles = {};
    const exp = /webkit.*/
    Object.entries(targetObjsStyles).forEach((p: any) => {
        if (exp.test(p)) {
            return;
        }
        if (basicElementsCSS[p[0]] !== p[1]) {
            cleanSetOfStyles[p[0]] = p[1];
        }

    });

    tempCopyOfTarget.remove()
    return cleanSetOfStyles;
}