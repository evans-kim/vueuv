<template>
  <div id="app" class="relative bg-gray-200 min-h-screen">
    <div class="flex items-stretch">
      <div ref="renderer" class="min-h-screen w-full">
        <div class="relative w-full bg-white border-gray-200 shadow-md" :style="responsiveWidth">
          <content-container></content-container>
        </div>
      </div>
      <div class="border-l border-gray-200 shadow-md p-4 bg-gray-200 min-h-screen" :style="panelStyle">
        <div>
          <ev-radio-group :value="media" @input="setMedia" :options="[
              {label:'<i class=\'icofont-responsive icofont-2x\'></i>', value:'ALL'},
              'SM',
              'MD',
              'LG',
              'XL'
          ]" class="mb-2"/>

          <ul class='flex cursor-pointer'>
            <li class='py-2 px-4 bg-white rounded-t-lg' :class="getActivePanelClass('Contents')"
                @click="()=>{section = 'Contents'}">Contents
            </li>
            <li class='py-2 px-4 bg-white rounded-t-lg' :class="getActivePanelClass('Panel')"
                @click="()=>{section = 'Panel'}">Control
            </li>
            <li class='py-2 px-4 bg-white rounded-t-lg' :class="getActivePanelClass('Style')"
                @click="()=>{section = 'Style'}">Style
            </li>
          </ul>
        </div>
        <div class="bg-white p-2" style="min-height: 600px">
          <contents v-if="section === 'Contents'"></contents>
          <panel v-if="section === 'Panel'" :content="selectedContent"></panel>
          <style-panel v-if="section === 'Style'" :content="selectedContent"></style-panel>
        </div>
      </div>
    </div>
    <toolbar class="hidden"></toolbar>
    <content-style></content-style>
  </div>
</template>
<script>
import Toolbar from "@/components/Toolbar";
import EvRadioGroup from "@/components/EvRadioGroup";
import AppAccess from "@/mixins/AppAccess";
import StylePanel from "@/views/StylePanel";
import ContentStyle from "@/Contents/ContentStyle";

export default {
  name: 'VuePageBuilder',
  components: {
    ContentStyle,
    StylePanel,
    EvRadioGroup,
    Toolbar,
  },
  mixins:[
    AppAccess
  ],
  data() {
    return {
      section: 'Contents',
      selectedContainer : null,
      contents:[],
      screenMode: 'AL',
      testProp: { '.ev-title' : { backgroundColor : 'yellow' , width:'100%', minHeight : '200px' } },
      testPropSm: { '.ev-title' : { backgroundColor : 'green' , width:'50%', minHeight : '100px' } }
    }
  },
  computed: {
    media(){
      return this.$store.getters.getMedia.toUpperCase();
    },
    panelStyle() {
      const height = window.innerHeight;
      return {
        height: (height - 100) + 'px',
        width: '360px'
      }
    },
    responsiveWidth() {
      const widther = {
        AL : '100%',
        SM : '400px',
        MD : '768px',
        LG : '1024px',
        XL : '1280px',
      }
      return { width : widther[this.screenMode], marginLeft : 'auto', marginRight : 'auto' }
    }
  },
  methods: {
    getActivePanelClass(name) {
      return {'text-gray-500': this.section !== name, 'bg-gray-200': this.section !== name}
    },
    setMedia(value) {
      console.log('app', value)
      this.$store.commit('setMedia', value.toLowerCase());
    }
  }
}
</script>