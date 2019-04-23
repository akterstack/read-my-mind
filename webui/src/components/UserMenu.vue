<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-icon color="primary" dark v-on="on">
          account_circle
        </v-icon>
      </template>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <Avatar />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
              <v-list-tile-sub-title
                >Founder of Vuetify.js</v-list-tile-sub-title
              >
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>favorite</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable messages</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable hints</v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="!isLoggedIn()">
            <v-btn flat @click="menu = false" to="/signup"
              >Create account</v-btn
            >
            <v-btn color="primary" flat @click="menu = false" to="/login"
              >Login</v-btn
            >
          </template>
          <template v-else>
            <v-btn flat @click="logout">Logout</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { Avatar } from '@/components/index';

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
    };
  },
  methods: {
    isLoggedIn() {
      return this.$store.getters['auth/isLoggedIn'];
    },
    logout() {
      this.menu = false;
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
