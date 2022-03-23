import Vue from 'vue'
import store from './store';
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSocketIO from 'vue-socket.io'
import VueSweetalert2 from 'vue-sweetalert2';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css';


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

console.log(process.env.VUE_APP_SOCKET_URL);
Vue.use(new VueSocketIO({
    debug: true,
    connection: process.env.VUE_APP_SOCKET_URL,
}))
Vue.use(VueSweetalert2);

Vue.config.productionTip = false
new Vue({
  router,
  store:store,
  render: h => h(App)
}).$mount('#app')
