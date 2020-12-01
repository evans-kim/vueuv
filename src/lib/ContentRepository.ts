import {ContentModel, ContentRender} from "@/types/VueuvTypes";
import createUid, {cloneAll} from "@/lib/createUniqueId";
import cloneDeep from "lodash/cloneDeep";
import cssToObject from 'css-to-object';
import Vue from "vue";

class ContentRepository {
    private model: ContentModel;

    constructor(model: ContentModel) {
        this.model = model;
    }

    create(model) {

    }

    toClone() {
        return cloneDeep(this.model);
    }

    clone(content: ContentModel) {

        content.id = createUid();
        if (!content.cssObject) {
            Vue.set(content, 'cssObject', {});
        }
        if (content.cssText) {
            content.cssText = content.cssText.replace(/#.*{?/ig, "#" + content.id + " {")
            const value = cssToObject(content.cssText, {
                camelCase: false,
                numbers: false
            });

            Vue.set(content, 'cssObject', value);
        }
        if (content.contents) {
            Object.entries(content.contents).forEach(([id, model]) => {
                this.clone(model)
            })
        }

    }
}