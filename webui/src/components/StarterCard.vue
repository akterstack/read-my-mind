<template>
  <v-card class="mx-auto" :color="color" dark max-width="400" :to="link">
    <v-layout align-center justify-center>
      <v-card-title>
        <span class="title font-weight-bold text-lg-center">{{ title }}</span>
      </v-card-title>
    </v-layout>
    <v-img class="elevation-6" min-height="425" :src="avatar"></v-img>
    <v-layout align-center>
      <v-card-text>
        <h3 class="headline font-weight-bold text-xs-center">
          {{ subtitle }}
        </h3>
        <div class="text-xs-center">
          {{ description }}
        </div>
      </v-card-text>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
};
</script>
