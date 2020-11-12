import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export type MediaOption = 'sm' | 'md' | 'lg' | 'xl' | 'all';

export interface ContentStyle {
    uid: string;
    media: MediaOption;
    selector: Array<string>;
    property: CSSStyleDeclaration; // {width:'100px',borderColor:'red'}
}

interface EditorMode {
    [key: string]: boolean;
    showGrid: boolean;
}

interface StoredContent {
    id: string;
    component: Vue;
}

interface State {
    selectedElement: HTMLElement | null;
    editingContent: StoredContent | null;
    focusedContent: StoredContent | null;
    selectedContent: StoredContent | null;
    sorting: boolean;
    dragComponent: object | null;
    media: MediaOption;
    styles: Array<ContentStyle>;
    editorMode: EditorMode;
}

export default new Vuex.Store({
    state: {
        editorMode: {
            showGrid: false
        },
        selectedElement: null,
        editingContent: null,
        sorting: false,
        dragComponent: null,
        selectedContent: null,
        focusedContent: null,
        media: 'all',
        styles: []
    } as State,
    getters: {
        getEditorMode(state) {
            return state.editorMode;
        },
        getAll(state) {
            return state;
        },
        getSelectedElement(state) {
            return state.selectedElement;
        },
        getEditingContent(state) {
            return state.editingContent;
        },
        isSorting(state) {
            return state.sorting;
        },
        getFocusedContent(state) {
            return state.focusedContent;
        },
        getDragComponent(state) {
            return state.dragComponent;
        },
        getSelectedContent(state) {
            return state.selectedContent;
        },
        getMedia: state => {
            return state.media;
        },
        getStyles: state => {
            return state.styles;
        }
    },
    mutations: {
        setToggleEditorMode(state, {key, value}) {
            Vue.set(state.editorMode, key, value);
        },
        setSelectedElement(state, payload) {
            state.selectedElement = payload;
        },
        resetEditingContent(state) {
            state.editingContent = null;
        },
        setEditingContent(state, payload) {
            state.editingContent = payload;
        },
        setSorting(state, payload) {
            state.sorting = payload;
        },
        setFocusedContent(state, payload) {
            state.focusedContent = payload;
        },
        setDragComponent(state, payload) {
            state.dragComponent = payload;
        },
        setSelectedContent(state, payload) {
            state.selectedContent = payload;
        }
    },
    actions: {}
    ,
    modules: {}
})
