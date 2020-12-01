import {cloneAll} from "@/lib/createUniqueId";
import {Editor} from "@/types/VueuvTypes";
import Vue from "vue/types/umd";
import cssToObject from 'css-to-object';
import * as flattenDeep from 'lodash/flattenDeep';

export default class CssHandler {
    private value: any;
    private $editor: Editor;

    constructor($editor: Editor) {
        this.$editor = $editor;
        this.value = $editor.contentModel
    }

    attributeToCss(attribute, depth = 1) {
        return Object.entries(attribute).map(([k, v]) => {
            const spaces = "  ".repeat(depth);
            if (typeof v === 'object') {
                const toCss = this.attributeToCss(v, depth + 1);
                return `${spaces}${k} {\n  ${toCss}\n  }\n`;
            }
            return `${spaces}${k}: ${v};\n`;
        })
    }

    objectToCss() {
        if (!this.value.cssObject) return '';

        const map = Object.entries(this.value.cssObject).map(([key, value]) => {
            if (!value) {
                return '';
            }
            return [key + "{\n", this.attributeToCss(value), "}\n"];
        });
        return map.join("").replace(/,/ig, '');
    }

    getCssTextToObject() {
        return this.cssToObject(this.value.cssText);
    }

    cssToObject(cssText) {
        return cssToObject(cssText || {}, {
            camelCase: false,
            numbers: false
        })
    }

    /**
     * @param {CSSStyleDeclaration} style
     */
    setCssObject(style) {

        const id = "#" + this.value.id;
        let media = '';
        if (this.$editor.media.mobile) {
            media = this.$editor.mediaQuery.mobile;
        }
        if (this.$editor.media.tablet) {
            media = this.$editor.mediaQuery.tablet;
        }
        const newStyle = {};
        if (media) {
            const obj = {};
            const oldCssObject = cloneAll(this.value.cssObject);
            if (!oldCssObject[media]) {
                obj[id] = style;
                newStyle[media] = obj;
            } else {
                newStyle[media] = {};
                newStyle[media][id] = Object.assign({}, oldCssObject[media][id], style);
            }
        } else {
            newStyle[id] = Object.assign(cloneAll(this.value.cssObject[id] || {}), style);
        }

        Vue.set(this.value, 'cssObject', Object.assign(this.value.cssObject, newStyle));
        Vue.set(this.value, 'cssText', this.objectToCss());
    }

    getCssObjectByMedia(media: string | 'mobile' | 'desktop' | 'tablet') {
        return this.value.cssObject[this.$editor.mediaQuery[media]]["#"+this.value.id];
    }

    toCssString(){
        const cssTexts = this.getCssText(this.$editor.contentModel.contents);
        const deep = flattenDeep(cssTexts).filter(item => item);
        return [this.$editor.contentModel.cssText || null, ...deep].join("\n");
    }
    getCssText(contents) {
        return contents.map(content => {
            if (content.contents && content.contents.length) {
                return [content.cssText, ...this.getCssText(content.contents)]
            }
            return content.cssText || null;
        })
    }
    toResponsivelyCssString(){
        const cssTexts = this.getCssTextResponsive(this.$editor.contentModel.contents);
    }
    getCssTextResponsive(contents) {
        return contents.map(content => {
            if (content.contents && content.contents.length) {
                return [content.cssObject, ...this.getCssTextResponsive(content.contents)]
            }
            return content.cssObject || null;
        })
    }
    objectToCssByMedia(content) {
        if (!content.cssObject) return '';
        const media = this.$editor.getCurrentMedia
        if(media === 'desktop'){
            return '';
        }
        const map = Object.entries(content.cssObject[this.$editor.mediaQuery[media]]).map(([key, value]) => {
            if (!value) {
                return '';
            }
            return [key + "{\n", this.attributeToCss(value), "}\n"];
        });
        return map.join("").replace(/,/ig, '');
    }
}