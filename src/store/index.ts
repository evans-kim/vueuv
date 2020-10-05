import Vue from 'vue'
import Vuex from 'vuex'
import ContentFactory from "@/mixins/ContentFactory";

Vue.use(Vuex)
export type MediaOption = 'sm' | 'md' | 'lg' | 'xl' | 'all';

export interface ContentStyle {
    uid: string;
    media: MediaOption;
    selector: string;
    property: CSSStyleDeclaration; // {width:'100px',borderColor:'red'}
}

interface State {
    dragComponent: Vue | null;
    selectedContent: ContentFactory | null;
    media: MediaOption;
    styles: Array<ContentStyle>;
}

export default new Vuex.Store({
    state: {
        dragComponent: null,
        selectedContent: null,
        media: 'all',
        styles: []
    } as State,
    getters: {
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
        },
        getStyleById: (state) => (uid: string) => {
            return state.styles.find(style => style.uid === uid);
        }
    },
    mutations: {
        setDragComponent(state, payload) {
            state.dragComponent = payload;
        },
        setSelectedContent(state, payload) {
            state.selectedContent = payload;
        },
        setData(state, {target, value}) {
            if (!state.selectedContent) {
                return;
            }
            state.selectedContent.data[target] = value;
        },
        setStyle: (state, {selector, property}: { selector: string; property: CSSStyleDeclaration }) => {
            if (!state.selectedContent) {
                return;
            }

            const style: ContentStyle = {
                uid: state.selectedContent.uid,
                media: state.media,
                selector: selector,
                property: property
            }

            const isUpdated = state.styles.filter((st) => {
                return (st.uid === style.uid && st.selector === style.selector)
            }).map((st) => {
                st.property = style.property;
                return st;
            }).length > 0;

            if (!isUpdated) {
                state.styles.push(style);
            }

        },
        setMedia(state, payload) {
            state.media = payload.toLowerCase();
        }
    },
    actions: {}
    ,
    modules: {}
})
