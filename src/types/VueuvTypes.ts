import Vue, {CombinedVueInstance, ExtendedVue} from "vue/types/vue";
import {ComponentOptions} from "vue";

interface VueuvOption {
    plugins: ComponentOptions<any>[];
}

interface ContentRenderMouseEvents {
    click: Function;
    dblclick: Function;
    mouseover: Function;
}

export interface ContentModel {

    tag: string;
    id?: string;
    class?: string[];
    style?: object;
    cssText?: string;
    cssObject?: {
        desktop: object;
        tablet: object;
        mobile: object;
    };
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
    selectedContent: object | null;
    focusedContent: StatedContentRender | null;
    editingContent: StatedContentRender | null;
    isSorting: boolean;

    refreshMenu(): void;
}

export interface Editor {
    getCurrentMedia: 'desktop' | 'mobile' | 'tablet';
    keys: { ctrl: boolean; alt: boolean };
    frame: {
        width: string;
        height: string;
    }
    mediaQuery: {
        mobile: string;
        tablet: string;
        desktop: string;
    }
    media: {
        mobile: boolean;
        tablet: boolean;
        desktop: boolean;
    }
    config: {
        editable: boolean;
        showGrid: boolean;
        showGuide: boolean;
    };
    contentModel: any;
    states: EditorStates;

    getContentValueById(id: string | null): CombinedVueInstance<any, any, any, any, any>;

    refreshKey(): void;

    hasDragBlock(): boolean;

    setRollBackPoint(): void;
}

export interface ContentRender extends Vue {
    blocks: any;
    $editor: Editor;
    value: any;
    isContentRender?: boolean;
    getValue: ContentModel;

    move(contents: any, oldIndex: number, newIndex: number): void;

    updateContents(value: any): void;
}

export interface ModalProp {
    color?: string;
    title?: string;
    body?: string;
    yesButton?: string;
    noButton?: string;
    visible?: boolean;
}