<template>
  <v-app>
    <v-toolbar color="transparent" class="elevation-0">
      <v-toolbar-side-icon v-if="showBackNav()" @click="goBack">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-layout justify-center>
        <v-toolbar-title>Read My Mind</v-toolbar-title>
      </v-layout>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-icon large color="grey lighten-1">help_outline</v-icon>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
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
