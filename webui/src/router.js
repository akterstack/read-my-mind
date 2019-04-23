import Vue from 'vue';
import Router from 'vue-router';
import { Home, CreateGame, Signup, Login } from './pages';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        public: true,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        public: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        public: true,
      },
    },
    {
      path: '/game/create',
      name: 'createGame',
      component: CreateGame,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './pages/About.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => !record.meta.public) &&
    !store.getters['auth/isLoggedIn']
  ) {
    store.commit('redirectTo', to.path);
    next('/login');
    return;
  }
  next();
});

export default router;
