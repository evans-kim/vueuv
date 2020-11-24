import {CombinedVueInstance} from "vue/types/vue";
import Vue from "vue/types/umd";

export interface ContentModel {
    tag: string;
    id?: string;
    class?: string[];
    style?: object;
    cssText?: string;
    props?: object;
    attrs?: object;
    contents?: Array<ContentModel>;
}


interface StatedContentRender {
    id: string;
    component: CombinedVueInstance<any, any, any, any, any>;
}

export interface EditorStates {
    dragBlock: object;
    selectedContent: object | null,
    focusedContent: StatedContentRender | null,
    editingContent: StatedContentRender | null,
    isSorting: boolean,
}

export interface Editor {
    keys: { ctrl: boolean, alt: boolean };
    config: { showGrid: boolean, mode: string };
    states: EditorStates;

    getContentValueById(id: string | null): CombinedVueInstance<any, any, any, any, any>;

    refreshKey(): void;

    hasDragBlock(): Boolean;

    setRollBackPoint(): void;
}

export interface ContentRender extends Vue {
    blocks: any;
    $editor: Editor;
    value: any;

    move(contents: any, oldIndex: number, newIndex: number): void;

    updateContents(value: any): void;
}