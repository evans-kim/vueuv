

export interface ContentModel {
    tag: string;
    id?: string;
    class: string[];
    cssText: string;
    props: object;
    contents?: Array<ContentModel>;
}
import Vue from 'vue';
interface StatedContentRender{
    id: string;
    component: Vue;
}

export interface EditorStates{
    selectedContent: object | null,
    focusedContent: StatedContentRender | null,
    editingContent: StatedContentRender | null,
    isSorting: boolean
}