import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import './assets/tailwind.css'
import '@/assets/icofont.css'

import TextContent from "@/Contents/TextContent.vue"
Vue.component(TextContent.name, TextContent);
Vue.config.productionTip = false

const VM = new Vue({
    render: h => h(App)
}).$mount('#app')

export default VM;