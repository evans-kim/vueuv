import {cloneAll} from "@/lib/createUniqueId";
import {Editor} from "@/types/VueuvTypes";
import Vue from "vue/types/umd";
import cssToObject from 'css-to-object';

export default class CssHandler {
    private value: any;
    private $editor: Editor;

    constructor(value, $editor) {
        this.value = value
        this.$editor = $editor;
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
}