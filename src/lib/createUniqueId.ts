import cloneDeep from "lodash/cloneDeep";
import {ContentModel} from "@/types/VueuvTypes";
import Vue from "vue";

export default function createUid(): string {
    return "vv" + Math.random().toString(36).substr(2, 6);
}

export function reactive(data: object) {
    if (typeof data !== 'object') {
        return;
    }
    Object.entries(data).map(([key, value]) => {
        if (typeof value === 'object') {
            reactive(value)
        } else {
            Vue.set(data, key, value);
        }
    })
}

export function contentModelFactory(content: ContentModel | string) {
    if (typeof content === 'string') {
        return;
    }

    const oldId = content.id;

    content.id = createUid();
    if (!content.class) {
        content.class = [];
    }

    if (!content.cssObject) {
        content.cssObject = {
            'desktop': {},
            'tablet': {},
            'mobile': {}
        };
    }
    if(!content.tag){
        content.tag = 'div';
    }
    if (content.cssText && oldId) {

        const idregexp = new RegExp(oldId, 'ig');
        content.cssText = content.cssText.replace(idregexp,  content.id )
    } else {
        content.cssText = '';
    }
    reactive(content);
    if (content.contents && content.contents.length) {
        content.contents.map(con => {
            contentModelFactory(con);
        });
    }
    return content;
}

export function createDefaultContentModel() {
    const data = {};

}

export function cloneAll(content) {
    return cloneDeep(content);
}

export function cloneContent(content) {

    const duplicate = cloneDeep(content);
    contentModelFactory(duplicate);
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