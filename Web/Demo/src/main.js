import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
  position: 'top-center',
  duration: 2000,
});

Vue.config.productionTip = false;

Vue.prototype.$EventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
