import Vue from 'vue';
import VueApollo from 'vue-apollo';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidate from 'vee-validate';
import apolloClient from '@/apollo';
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

Vue.use(VueApollo);
Vue.use(VeeValidate);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
