<template>
  <div class="m-2">
    <div class="flex justify-start mb-1">
      <button :class="activeClass('class')" @click="activeTab = 'class';"
              class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">클래스
      </button>
      <button :class="activeClass('style')" @click="activeTab = 'style';"
              class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">스타일
      </button>
      <button :class="activeClass('controller')" @click="activeTab = 'controller';"
              class="rounded border mr-1 bg-white shadow p-2 focus:outline-none">컨트롤
      </button>
      <btn @click.stop="addContents"><i class="icofont icofont-sub-listing"></i></btn>
      <btn color="orange" @click.stop="deleteContents"><i class="icofont icofont-delete"></i></btn>
    </div>
    <div class="panel-body p-2 bg-white shadow rounded" style="max-width: 40rem;">
      <div v-if="activeTab === 'class'">
        <class-tag-input :value="getTargetClasses" @input="classHandler"></class-tag-input>
      </div>
      <div v-if="activeTab === 'style'">
        <div style="min-width: 10rem;">
          클래스 : {{ getTargetClasses }}
          ID : #{{ getTargetComponent.value.id }}
        </div>
        <code-editor v-model="getTargetStyleText"></code-editor>
      </div>
      <div v-if="activeTab === 'controller'">
        <btn @click="toggleDisplay"> flex</btn>
        |
        <btn @click="setStyle('justify-content', 'flex-start')"> left</btn>
        <btn @click="setStyle('justify-content', 'center')"> center</btn>
        <btn @click="setStyle('justify-content', 'flex-end')"> right</btn>
        <btn @click="setStyle('justify-content', 'space-between')"> around</btn>
        <btn @click="setStyle('justify-content', 'space-around')"> between</btn>
        |
        <btn @click="setStyle('align-items', 'flex-start')"> top</btn>
        <btn @click="setStyle('align-items', 'baseline')"> Baseline</btn>
        <btn @click="setStyle('align-items', 'center')"> center</btn>
        <btn @click="setStyle('align-items', 'flex-end')"> bottom</btn>
        <btn @click="setStyle('align-items', 'stretch')"> stretch</btn>
        |
        <btn @click="setStyle('flex-direction', 'row')"> Row</btn>
        <btn @click="setStyle('flex-direction', 'column')"> Column</btn>
      </div>
    </div>
  </div>
</template>

<script>
import ClassTagInput from "@/components/ClassTagInput";
import CodeEditor from "@/components/CodeEditor";
import Store from "@/lib/StoreSelector";
import createUid from "@/lib/createUniqueId";

export default {
  name: "TabPanel",
  components: {CodeEditor, ClassTagInput},
  props: {
    title: String,
  },
  computed: {
    getTargetComponent() {
      return (Store.focusedContent) ? Store.focusedContent.component : null;
    },
    getTargetClasses() {
      return this.getTargetComponent.value.class || []
    },
    getTargetStyleText: {
      get() {
        return this.getTargetComponent.value.cssText || ''
      },
      set(value) {
        if(!this.getTargetComponent.value.cssText){
          this.$set(this.getTargetComponent.value, 'cssText', value);
        }else{
          this.getTargetComponent.value.cssText = value;
        }
      }
    }
  },
  data() {
    return {
      activeTab: 'class'
    }
  },
  methods: {
    classHandler(values) {
      this.getTargetComponent.value.class = values;
    },
    activeClass(id) {
      if (this.activeTab === id) {
        return ['text-green-600'];
      } else {
        return ['hover:text-green-600'];
      }
    },
    setStyle(key, value) {
      if (!this.getTargetComponent.value.style) {
        this.$set(this.getTargetComponent.value, 'style', {});
      }
      this.$set(this.getTargetComponent.value.style, key, value);
    },
    toggleDisplay() {
      if (this.getTargetComponent.value.style && this.getTargetComponent.value.style.display === 'flex') {
        this.setStyle('display', 'flow-root')
      } else {
        this.setStyle('display', 'flex')
      }
    },
    addContents() {

      this.$set(this.getTargetComponent.value.contents, this.getTargetComponent.value.contents.length, {
        tag: 'div',
        id: createUid(),
        class: ['p-2'],
        contents: []
      });
      this.$store.commit('setToggleEditorMode', {key: 'showGrid', value: true})

    },
    deleteContents() {
      this.getTargetComponent.deleteContent();
    }
  }
}
</script>

<style scoped>

</style>