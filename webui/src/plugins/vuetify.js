import Vue from 'vue';
import Vuetify, {
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VFadeTransition,
} from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';
import colors from 'vuetify/es5/util/colors';
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
  theme: {
    primary: colors.lightBlue.darken3,
  },
});
