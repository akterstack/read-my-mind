import Vue from 'vue';
import Vuetify, {
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VFadeTransition,
} from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition,
  },
  directives: {
    Ripple,
  },
});
