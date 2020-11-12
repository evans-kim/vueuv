import Store from '@/lib/StoreSelector';

export default {
    computed: {
        dragComponent: {
            get: function () {
                return Store.dragComponent;
            },
            set: function (component) {
                Store.dragComponent = component;
            }
        },
        selectedContent: {
            get: function () {
                return Store.selectedContent;
            },
            set: function (component) {
                if (this.isDragging) {
                    return false;
                }
                Store.selectedContent = component;
            }
        },
        focusedContent: {
            get: function () {
                return Store.focusedContent;
            },
            set: function (component) {
                if (this.isDragging) {
                    return false;
                }
                Store.focusedContent = component;
            }
        },
        isSorting: {
            get: function () {
                return Store.isSorting;
            },
            set: function (value) {
                Store.isSorting = value;
            }
        },
        editingContent: {
            get() {
                return Store.editingContent;
            },
            set(val) {
                Store.editingContent = val;
            }
        },
        selectedElement: {
            get: function () {
                return Store.selectedElement;
            },
            set: function (component) {
                if (this.isDragging) {
                    return false;
                }
                Store.selectedElement = component;
            }
        }
    }
}