import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import store from './store'
import './assets/tailwind.css'
import '@/assets/icofont.css'

import Draggable from 'vuedraggable';
import ContentRender from '@/components/ContentRender.vue';
import Btn from '@/components/Btn.vue';
import Text from '@/Contents/Text.vue';

Vue.component(Draggable.name, Draggable);
Vue.component(ContentRender.name, ContentRender);
Vue.component(Btn.name, Btn);
Vue.component(Text.name, Text);
Vue.config.productionTip = false

const VM = new Vue({
    store,
    render: h => h(App)
}).$mount('#app')

export default VM;