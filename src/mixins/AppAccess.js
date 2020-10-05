export default {
    computed:{
        isDragging(){
            return !!this.dragComponent
        },
        dragComponent: {
            // getter
            get: function () {
                return this.$store.getters.getDragComponent;
            },
            // setter
            set: function (component) {
                this.$store.commit('setDragComponent', component);
            }
        },
        selectedContent: {
            get: function (){
                return this.$store.getters.getSelectedContent || null;
            },
            set: function (component){
                this.$store.commit('setSelectedContent', component);
            }
        },
    }
}