<template>
  <span class="v-avatar">
    <img v-if="username" :src="avatarSrc()" :alt="username" />
    <v-icon v-else color="primary" dark>
      account_circle
    </v-icon>
  </span>
</template>
<script>
export default {
  props: {
    username: String,
  },
  methods: {
    avatarSrc() {
      return `http://i.pravatar.cc/50?u=${this.username}`;
    },
  },
};
</script>
