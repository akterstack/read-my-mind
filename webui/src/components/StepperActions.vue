<template>
  <v-layout align-end justify-start reverse row>
    <div v-if="showNextButton">
      <v-btn color="primary" @click="stepNext">
        {{ nextButtonLabel }}
      </v-btn>
    </div>
    <div v-if="showBackButton">
      <v-btn flat @click="stepBack">Back</v-btn>
    </div>
  </v-layout>
</template>
<script>
export default {
  props: {
    stepName: {
      type: String,
      required: true,
    },
    showNextButton: {
      type: Boolean,
      default: true,
    },
    showBackButton: {
      type: Boolean,
      default: true,
    },
    nextButtonLabel: {
      type: String,
      default: 'Next',
    },
  },
  methods: {
    stepNext() {
      this.$emit(`stepNext`, this.stepName);
    },
    stepBack() {
      this.$emit(`stepBack`, this.stepName);
    },
  },
};
</script>
