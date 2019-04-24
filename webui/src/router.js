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
      beforeEnter(to, from, next) {
        if (store.state.auth.user) {
          next(store.state.redirectTo || '/');
        }
        next();
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login,
      meta: {
        public: true,
      },
      beforeEnter(to, from, next) {
        store.dispatch('auth/logout');
        next({ name: 'login' });
      },
    },
    {
      path: '/game/create',
      name: 'game',
      component: CreateGame,
    },
    {
      path: '/game/history/(host|player)',
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
    !store.state.auth.user
  ) {
    store.commit('redirectTo', to.path);
    next('/login');
    return;
  }
  next();
});

export default router;
