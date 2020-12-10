export interface ContentModel {

    tag: string;
    id: string;
    class: string[];
    style?: object;
    cssText?: string;
    cssObject: {
        desktop: object;
        tablet: object;
        mobile: object;
        extra?: object;
    };
    props?: object;
    attrs?: object;
    isRootContent?: boolean;
    contents?: Array<ContentModel>;
}

import ContentRender from "@/components/ContentRender.vue";

export interface StatedContentRender {
    id: string;
    component: ContentRender;
}

export interface EditorStates {
    dragBlock?: object;
    selectedContent?: StatedContentRender;
    focusedContent?: StatedContentRender;
    editingContent?: StatedContentRender;
    isSorting?: boolean;
}

export interface ModalProp {
    color?: string;
    title?: string;
    body?: string;
    yesButton?: string;
    noButton?: string;
    visible?: boolean;
}