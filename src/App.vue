<template>
  <div id="app" class="relative bg-gray-200 min-h-screen">
    <div class="flex items-stretch">
      <div ref="renderer" id="renderer" class="relative w-full bg-white border-gray-200 shadow-md min-h-screen"
           @drop="dropHandler" @dragover="dragOverHandler">
        <draggable
            :list="contents"
            :disabled="!enabled"
            class="list-group"
            ghost-class="ghost"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
        >
          <component v-for="content in contents" :is="content.option.name"
                     :ref="content.uid"
                     :key="content.uid"
                     @content-selected="()=>{setSelectedContent(content)}"
                     v-bind.sync="content.data"
                     :class="contentClass(content)"
          >
          </component>
        </draggable>

      </div>
      <div class="border-l border-gray-200 shadow-md p-4 bg-gray-200 min-h-screen" :style="panelStyle">
        <div>
          <ul class='flex cursor-pointer'>
            <li class='py-2 px-6 bg-white rounded-t-lg' :class="getActivePanelClass('Contents')"
                @click="()=>{section = 'Contents'}">컨덴츠
            </li>
            <li class='py-2 px-6 bg-white rounded-t-lg' :class="getActivePanelClass('Panel')"
                @click="()=>{section = 'Panel'}">패널
            </li>
          </ul>
        </div>
        <div class="bg-white p-2" style="min-height: 600px">
          <component :is="section" @drag:component="setDragComponent" :content="selectedContent"></component>
        </div>
      </div>
    </div>
    <toolbar class="hidden"></toolbar>
  </div>
</template>
<script>
import Toolbar from "@/components/Toolbar";
import Contents from "@/views/Contents";
import Panel from "@/views/Panel";

export default {
  name: 'VuePageBuilder',
  components: {
    Contents,
    Toolbar,
    Panel
  },
  data() {
    return {
      section: 'Contents',
      contents: [],
      contentData: {},
      dragComponent: null,
      selectedContent: null,
      enabled: true,
      dragging: false,
    }
  },
  computed: {
    getBinder() {
      return this.$store.getters.getBind;
    },
    panelStyle() {
      const height = window.innerHeight;
      return {
        height: (height - 100) + 'px',
        width: '360px'
      }
    }
  },
  methods: {
    getUniqueName() {
      return Math.random().toString(36).substr(2, 9);
    },
    createContent(component) {
      const content = {
        option: component,
        component: null,
        uid: this.getUniqueName(),
        listeners: {},
      }
      const props = Object.keys(this.dragComponent.props)
      this.$set(content, 'data', {});

      props.map((prop) => {
        const property = this.dragComponent.props[prop];
        let d = '';
        if (property.default) {
          switch (typeof property.default) {
            case "function":
              d = property.default();
              break;
            default :
              d = property.default;
          }
        }
        this.$set(content['data'], prop, d)
      })

      return content;
    },
    contentClass(content) {
      if (this.selectedContent === content) {
        return ['shadow-outline']
      }
    },
    dropHandler() {
      if(!this.dragComponent){

        return;
      }
      const content = this.createContent(this.dragComponent)
      this.contents.push(content);

      this.dragComponent = null;

      this.$nextTick(() => {
        content.component = this.$refs[content.uid][0];
      })
    },
    setSelectedContent(content) {
      this.selectedContent = content;
      this.$nextTick(() => {
        this.section = 'Panel';
      })
    },
    /**
     *
     * @param {Event} ev
     */
    dragOverHandler(ev) {
      ev.preventDefault();
    },
    setDragComponent(component) {
      this.dragComponent = component;
    },
    getActivePanelClass(name) {
      return {'text-gray-500': this.section !== name, 'bg-gray-200': this.section !== name}
    },
    checkMove(e) {
      console.log("Future index: " + e.draggedContext.futureIndex);
    }
  }
}
</script>

<style lang="scss">

.draggable.dragging {
  opacity: .3;
  background-color: #a1a2a3;
}

.drop-target {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.inspectable:hover {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);

  > * {
    border: 2px dashed #cccccc;
  }
}
</style>