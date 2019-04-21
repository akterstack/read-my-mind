<template>
  <v-layout align-end justify-start reverse row>
    <div v-if="displayNextButton !== 'hide'">
      <v-btn
        color="primary"
        :disabled="displayNextButton === 'disable'"
        @click="stepNext"
      >
        {{ nextButtonLabel }}
      </v-btn>
    </div>
    <div v-if="displayBackButton !== 'hide'">
      <v-btn flat :disabled="displayBackButton === 'disable'" @click="stepBack"
        >Back</v-btn
      >
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
    displayNextButton: {
      type: String,
      default: 'show',
    },
    displayBackButton: {
      type: String,
      default: 'show',
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
