import "@/update-checker.js"
import Vue from "vue"
import App from "@/App.vue"
import {store} from "@/store"
import {router} from "@/router.js"
import "@/ui"
import vueWaitConfig from "./vueWaitConfig.js"
import VueCompositionAPI from '@vue/composition-api'


new Vue({
  el: "#app",
  render: h => h(App),
  store,
  router,
  wait: vueWaitConfig
})
Vue.config.productionTip = false
Vue.use(VueCompositionAPI)

if (module.hot) {
  module.hot.accept()
}
