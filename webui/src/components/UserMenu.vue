<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <Avatar />
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-tile>
            <v-list-tile-avatar>
              <Avatar />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ title() }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ subtitle() }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile @click="hostHistory" prepend-icon="accessible_forward">
            <v-list-tile-title>My host history</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="playerHistory">
            <v-list-tile-title>My player history</v-list-tile-title>
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
    title() {
      return this.$store.state.auth.user.username || 'Hello, Guest!';
    },
    subtitle() {
      return this.isLoggedIn() ? 'Online' : 'Please login';
    },
    isLoggedIn() {
      return this.$store.state.auth.user;
    },
    logout() {
      this.menu = false;
      this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'login' });
    },
    hostHistory() {},
    playerHistory() {},
  },
};
</script>
