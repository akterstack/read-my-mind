import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidate from 'vee-validate';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.config.errorHandler = (err, vm, info) => {
  console.log(vm);
  console.log(err);
  console.log(info);
};
Vue.config.warnHandler = (err, vm, info) => {
  console.log(vm);
  console.log(err);
  console.log(info);
};

Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
