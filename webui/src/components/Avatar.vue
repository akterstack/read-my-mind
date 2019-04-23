<template>
  <span>
    <img v-if="username()" :src="avatarSrc()" :alt="username()" />
    <v-icon v-else color="primary" dark>
      account_circle
    </v-icon>
  </span>
</template>
<script>
export default {
  methods: {
    username() {
      return this.$store.state.auth.user.username;
    },
    avatarSrc() {
      return `http://i.pravatar.cc/50?u=${this.username}`;
    },
  },
};
</script>
