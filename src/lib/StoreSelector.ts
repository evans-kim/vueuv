import Store from "@/store";

class StoreSelector {

    get isDragging() {
        return !!this.dragComponent
    }

    get dragComponent() {
        return Store.getters.getDragComponent
    }
    set dragComponent(component: string) {
        Store.commit('setDragComponent', component);
    }

    get selectedContent() {
        return Store.getters.getSelectedContent || null;
    }

    set selectedContent(component: string | null) {
        Store.commit('setSelectedContent', component);
    }

    get focusedContent() {
        return Store.getters.getFocusedContent || null;
    }

    set focusedContent(component) {
        Store.commit('setFocusedContent', component);
    }

    get isSorting() {
        return Store.getters.isSorting || null;
    }

    set isSorting(value) {
        Store.commit('setSorting', value);
    }

    get editingContent() {
        return Store.getters.getEditingContent || null;
    }

    set editingContent(component) {
        if (this.isDragging) {
            return ;
        }
        Store.commit('setEditingContent', component);
    }

    get selectedElement() {
        return Store.getters.getSelectedElement || null;
    }

    set selectedElement(component) {
        if (this.isDragging) {
            return ;
        }
        Store.commit('setSelectedElement', component);
    }

    isEditing(uid: string)
    {
        return this.editingContent && this.editingContent === uid
    }
}

export default new StoreSelector()

