import cloneDeep from "lodash/cloneDeep";
import {ContentModel, Editor} from "@/types/VueuvTypes";
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
    if(!content.id){
        content.id = createUid();
    }

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
        const regexp = new RegExp("#"+oldId, 'ig');
        content.cssText = content.cssText.replace(regexp,  "#"+content.id )
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

export function cloneAll(content): ContentModel {
    return cloneDeep(content);
}

export function cloneContent(content): ContentModel {

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

export function attributeToCss(attribute, depth = 1) {
    const spaces = "  ".repeat(depth);
    return Object.keys(attribute).map(k => {
        const v = attribute[k];
        if (typeof v === 'object') {
            const toCss = attributeToCss(v, depth+1);
            return `${spaces}${k} {\n  ${toCss}\n  }\n`;
        }
        return `${spaces}${k}: ${v};\n`;
    }).join("")
}
export function cssObjectToCssText(content, $editor: Editor) {

    if(typeof content === 'string'){
        return null;
    }
    const styles = Object.entries(content.cssObject).map( ([media, value]) => {

        if (!value) {
            return null;
        }
        if(media === 'desktop'){
            return attributeToCss({['#'+content.id]:value})
        }
        const mediaQuery = $editor.mediaQuery[media]
        return [mediaQuery + "{\n", attributeToCss({['#'+content.id]:value}), "}\n"].join("");
    });

    if( !content.contents || !content.contents.length){
        return styles;
    }

    return [styles, ...content.contents.map(content=>{
        return cssObjectToCssText(content, $editor);
    }) ]
}