<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="true"
      :nudge-width="250"
      offset-x
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <Avatar :username="$store.state.auth.user.username" />
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-tile>
            <v-list-tile-avatar>
              <Avatar :username="$store.state.auth.user.username" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ title() }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ subtitle() }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile to="/game/new">
            <v-list-tile-avatar>
              <v-icon color="primary">videogame_asset</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Create game</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/game/join">
            <v-list-tile-avatar>
              <v-icon color="primary">gamepad</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Join game</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/game/hosted">
            <v-list-tile-avatar>
              <v-icon color="primary">card_travel</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>My games</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/game/played">
            <v-list-tile-avatar>
              <v-icon color="primary">rowing</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>My playings</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="!isLoggedIn()">
            <v-btn flat @click="menu = false" to="/signup"
              >Create account</v-btn
            >
            <v-btn color="primary" dark flat @click="menu = false" to="/login"
              >Login</v-btn
            >
          </template>
          <template v-else>
            <v-btn color="primary" flat @click="logout">Logout</v-btn>
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
  },
};
</script>
