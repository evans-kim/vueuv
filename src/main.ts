import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)


import store from './store'
import './assets/tailwind.css'
import '@/assets/icofont.css'

import Draggable from 'vuedraggable';
import BasicContent from "@/Contents/BasicContent.vue";
import ContainerPanel from "@/views/ContainerPanel.vue";
import Panel from "@/views/Panel.vue";
import Contents from "@/views/Contents.vue";
import ContentContainer from "@/Contents/ContentContainer.vue";
import HrefContent from "@/Contents/HrefContent.vue";
import NavBarContent from "@/Contents/NavBarContent.vue";

Vue.component(Draggable.name, Draggable);
Vue.component(BasicContent.name, BasicContent);
Vue.component(ContentContainer.name, ContentContainer);
Vue.component(ContainerPanel.name, ContainerPanel);
Vue.component(Panel.name, Panel);
Vue.component(Contents.name, Contents);
Vue.component(HrefContent.name, HrefContent);
Vue.component(NavBarContent.name, NavBarContent);

Vue.config.productionTip = false

new Vue({

    store,
    render: h => h(App)
}).$mount('#app')

