import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import Vueuv from "@/plugin";
import TextContent from "@/Contents/TextContent.vue"

/**
 * Set your plugins like below
 */
Vue.use(Vueuv, {
    plugins:  [TextContent]
});

import './assets/tailwind.css'
import '@/assets/icofont.css'

Vue.config.productionTip = false

const VM = new Vue({
    render: h => h(App)
}).$mount('#app')

export default VM;