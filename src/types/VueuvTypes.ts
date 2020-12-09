import {CombinedVueInstance} from "vue/types/vue";
import {ComponentOptions} from "vue";
import TemplateSaver from "@/components/TemplateSaver.vue";
import {Vue} from 'vue-property-decorator';

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
    component: ContentRender;
}

export interface EditorStates {
    dragBlock?: object;
    selectedContent?: object | null;
    focusedContent?: StatedContentRender;
    editingContent?: StatedContentRender | null;
    isSorting?: boolean;
}

interface EditorRefs {
    [key: string]: Vue | Element | Vue[] | Element[];
    'template-saver': TemplateSaver;
}

export interface Editor extends Vue {
    $refs: EditorRefs;
    getCurrentMedia: 'desktop' | 'mobile' | 'tablet';
    keys: { ctrl: boolean; alt: boolean };
    frame: {
        backgroundColor: string;
        width: string;
        height: string;
        
    };
    mediaQuery: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
    media: {
        mobile: boolean;
        tablet: boolean;
        desktop: boolean;
    };
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
    value: ContentModel;
    isContentRender?: boolean;
    getValue: ContentModel;
    parent: ContentRender;

    move(contents: any, oldIndex: number, newIndex: number): void;

    updateContents(value: any): void;

    setCssObject(value: unknown, desktop: string): void;

    updateContentValue(value): void;
}

export interface ModalProp {
    color?: string;
    title?: string;
    body?: string;
    yesButton?: string;
    noButton?: string;
    visible?: boolean;
}