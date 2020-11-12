<template>
  <transition name="fade-in-out" mode="out-in">
    <div v-if="isLayoutComponent" v-show="!isSorting" :style="getStyle">
      <tab-panel/>
    </div>
  </transition>
</template>

<script>
import Store from "@/lib/StoreSelector";
import TabPanel from "@/components/TabPanel";

export default {
  name: "LayoutHelper",
  components: { TabPanel},
  props: {
    document: {
      type: Object
    }
  },
  watch: {
    contentFocused(element) {
      if (!this.isLayoutComponent) {
        this.hide();
        return;
      }
      this.setPosition(element.component.$el);
    },
    getEditorMode(val,old){
      if (!this.isLayoutComponent) {
        this.hide();
        return;
      }
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.setPosition(this.contentFocused.component.$el)
        }, 300)
      });
    },
    isSorting(val){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.setPosition(this.contentFocused.component.$el)
        }, 100)
      });
    }
  },
  computed: {
    getEditorMode(){
      return this.$store.getters.getEditorMode.showGrid || this.$store.getters.isSorting;
    },
    contentFocused() {
      return Store.focusedContent;
    },
    isSorting(){
      return Store.isSorting;
    },
    getTargetComponent(){
      return (this.contentFocused) ? this.contentFocused.component : null;
    },
    isLayoutComponent() {

      return this.contentFocused && this.getTargetComponent;
    }
  },
  data() {
    return {
      getStyle: {
        display: 'none',
        justifyContent: 'baseline',
        position: 'fixed',
        padding: '0.5rem',
        left: 0,
        right:'auto',
        top: 0,
        zIndex: 10
      }
    }
  },
  methods: {
    hide() {
      this.getStyle.display = 'none';
    },
    /**
     *
     * @param {HTMLElement} element
     */
    setPosition(element) {
      const rect = element.getBoundingClientRect();

      this.getStyle.left = rect.x + 'px';
      this.getStyle.right = 'auto';
      this.getStyle.top = rect.y + rect.height + 10 + 'px';
      this.getStyle.display = 'flex'

      this.$nextTick(()=>{
        const me = this.$el.getBoundingClientRect();
        // 화면을 왼쪽으로 넘어 간다면?
        const number = window.innerWidth - ( me.x + me.width ) - 100;
        if( number < 0 ){
          this.getStyle.left = "auto";
          this.getStyle.right = '20px';
        }else{
          this.getStyle.right = 'auto';
        }
      });
    },
    hideOnScroll(e) {
      console.log(e, e.target);
    }
  }
}
</script>

<style scoped>

</style>