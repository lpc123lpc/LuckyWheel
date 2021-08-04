import Vue from 'vue'
import App from "./App"
import router from './router'
import ElementUi from 'element-ui'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css';
import user from "./common/user";
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.use(VueCookies)
Vue.prototype.user = user
// new Vue({
//   el: '#app',
//   Router,
//   component: {App},
//   template: '<App></App>'
// })
new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
