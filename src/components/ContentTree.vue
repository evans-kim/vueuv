<template>
  <draggable tag="ul" v-if="hasContents(value)"
             group="content-tree"
             ghost-class="ghost"

             animation="300"
             :value="value"
             @input="handleValue">
    <li class="pl-3" v-for="(com, idx) in value" :key="idx">
      <div v-if="com && typeof com === 'string'" :class="{'selected-tag':isFocused(com)}" class="node">
        <span class="node-handler p-2" @click.stop="setSelectedContentById(com)"
              @dblclick.stop="setEditingContentById(com)"> :: </span>
        {{ com }}
      </div>
      <div v-if="com && com.id" :class="{'selected-tag':isFocused(com.id)}" class="node" :style="getStyle(com)">
        <span class="node-handler p-2" @click.stop="setSelectedContentById(com)"
              @dblclick.stop="setEditingContentById(com.id)"> :: </span>
        {{ com.tag }}#{{ com.id }}
        <span v-if="hasChildren(com)" class="toggle" @click="()=>{ isOpen = !isOpen }"> {{ isOpen ? '-' : '+' }} </span>
      </div>

      <content-tree v-model="com.contents" v-show="isOpen"></content-tree>

    </li>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: "ContentTree",
  components: {
    draggable
  },
  inject: ['$editor'],
  data() {
    return {
      isOpen: true
    }
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
  },
  computed: {
    getStates() {
      return this.$editor.states;
    }
  },
  methods: {
    isFocused(id) {
      return this.getStates.focusedContent && this.getStates.focusedContent.id === id;
    },
    isSelected(id) {
      return this.getStates.selectedContent && this.getStates.selectedContent === id;
    },
    hasContents(com) {
      return com && Array.isArray(com);
    },
    getStyle(com) {
      const styles = {};
      if (this.isFocused(com.id)) {
        styles.background = 'green';
        styles.color = 'white';
      }
      if (this.isSelected(com.id)) {
        styles.background = 'green';
        styles.color = 'white';
      }
      return styles;
    },
    /**
     *
     * @param {string|object} content
     */
    setSelectedContentById(content) {
      if (!content) {
        return;
      }
      if(typeof content === 'string'){
        const parent = this.$editor.getContentRenderHas(content);
        if(!parent){
          console.warn('Not found Content render : ' + content);
          return;
        }
        content = parent.id;
      }
      let contentId = content;
      if(typeof content === 'object'){
        contentId = content.id;
      }
      const contentRender = this.$editor.getContentRenderById(contentId, this.$editor.$refs.render);

      contentRender.setFocusedContent();
    },
    setEditingContentById(id) {
      if (!id) {
        return;
      }
      const contentRender = this.$editor.getContentRenderById(id, this.$editor.$refs.render);
      contentRender.setEditingContent();
    },
    hasChildren(com) {
      return com.contents && com.contents.length;
    },
    handleValue(val){
      this.$editor.setRollBackPoint();
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.node {
  outline: #42b983 1px dashed;
  padding: 0.5rem;
}

.node-handler {
  cursor: pointer;
}

.toggle {
  cursor: pointer;
  border-radius: 5px;
  background-color: #606060;
  width: 20px;
  height: 20px;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  color: white;
}
</style>