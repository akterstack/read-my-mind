<template>
  <v-app>
    <v-toolbar color="transparent" class="elevation-0">
      <v-toolbar-side-icon v-if="showBackNav()" @click="goBack">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-layout justify-center>
        <v-toolbar-title>
          <router-link to="/">Read My Mind</router-link>
        </v-toolbar-title>
      </v-layout>
      <UserMenu />
    </v-toolbar>
    <v-content>
      <transition>
        <router-view />
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import { UserMenu } from '@/components';

export default {
  name: 'App',
  components: {
    UserMenu,
  },
  data() {
    return {
      //
    };
  },
  methods: {
    showBackNav() {
      return this.$router.currentRoute.path !== '/';
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
