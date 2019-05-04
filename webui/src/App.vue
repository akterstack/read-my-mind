<template>
  <v-app>
    <v-toolbar color="transparent" class="elevation-0">
      <v-toolbar-side-icon>
        <v-icon v-if="showBackNav()" @click="goBack">arrow_back</v-icon>
        <v-icon v-else>none</v-icon>
      </v-toolbar-side-icon>
      <v-layout justify-center>
        <v-toolbar-title>
          <v-btn round flat large color="light-blue darken-3" to="/">
            <v-avatar size="32px" style="margin-right: 10px">
              <img src="@/assets/logo.png" alt="read-my-mind-logo" />
            </v-avatar>
            <v-spacer></v-spacer>
            Read My Mind</v-btn
          >
        </v-toolbar-title>
      </v-layout>
      <UserMenu />
    </v-toolbar>
    <v-content>
      <transition>
        <router-view @notify="notify" />
      </transition>
    </v-content>
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="notification.timeout"
      top
    >
      {{ notification.message }}
      <v-btn dark flat @click="notification.show = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
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
      notification: {
        show: false,
        message: '',
        color: 'error',
        timeout: 6000,
      },
    };
  },
  methods: {
    showBackNav() {
      return this.$router.currentRoute.path !== '/';
    },
    goBack() {
      this.$router.go(-1);
    },
    notify(notification) {
      this.notification = { ...this.notification, show: true, ...notification };
    },
  },
  mounted() {
    this.$root.$on('notify', this.notify);
  },
};
</script>
<style scoped>
.v-btn:before {
  opacity: 0;
}
</style>
