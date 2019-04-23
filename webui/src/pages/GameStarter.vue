<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-stepper v-model="el">
          <v-stepper-header>
            <v-stepper-step :complete="el > 1" step="1"
              >Set Word</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="el > 2" step="2"
              >Change Options</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step step="3">Publish/Start</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-layout align-center justify-center>
                <v-flex>
                  <v-text-field
                    outline
                    label="Your precious word"
                    prepend-inner-icon="place"
                    v-model="word"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <StepperActions
                stepName="word"
                :displayNextButton="word ? 'show' : 'disable'"
                displayBackButton="disable"
                @stepNext="el = 2"
              />
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-layout align-center justify-center>
                <v-flex xs4>
                  <v-label>Max Players</v-label>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    type="number"
                    v-model="maxPlayer"
                    value="1"
                  ></v-text-field>
                  <span class="caption"
                    >Maximum number of players can join</span
                  >
                </v-flex>
              </v-layout>
              <v-layout align-center justify-center>
                <v-flex xs4>
                  <v-label>Max Hints</v-label>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    type="number"
                    v-model="maxHint"
                    value="20"
                  ></v-text-field>
                  <span class="caption"
                    >Maximum yes/no question a player can ask</span
                  >
                </v-flex>
              </v-layout>
              <StepperActions
                stepName="options"
                :displayNextButton="
                  maxPlayer > 0 && maxHint > 0 ? 'show' : 'disable'
                "
                @stepNext="el = 3"
                @stepBack="el = 1"
              />
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-5" color="lime darker-1" height="200px">
                <v-card-title>Start!</v-card-title>
              </v-card>
              <StepperActions
                stepName="publish"
                nextButtonLabel="Publish"
                @stepBack="el = 2"
                @stepNext="publish"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { StepperActions } from '@/components';

export default {
  components: {
    StepperActions,
  },
  data() {
    return {
      el: 0,
      word: null,
      maxPlayer: 1,
      maxHint: 20,
    };
  },
  created() {
    const loggedInUser = this.$store.state.auth.user;
    if (!loggedInUser || !loggedInUser.id) {
      this.$store.state.redirectTo = this.$router.currentRoute.path;
      this.$router.push({ name: 'login' });
    }
  },
  methods: {
    publish() {},
    start() {},
  },
};
</script>
<style scoped>
.v-message {
  display: none;
}
</style>
