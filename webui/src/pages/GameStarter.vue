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
            <v-stepper-step step="3">Publish the Game</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-layout align-center justify-center fill-height>
                <v-flex>
                  <v-text-field
                    outline
                    label="Your precious word"
                    prepend-inner-icon="place"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <StepperActions
                step-name="word"
                :showBackButton="false"
                @stepNext="el = 2"
              />
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                class="mb-5"
                color="grey lighten-1"
                height="200px"
              ></v-card>
              <StepperActions
                step-name="options"
                @stepNext="el = 3"
                @stepBack="el = 1"
              />
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-5" color="grey lighten-1" height="200px">
                <v-card-title>hhhhh</v-card-title>
              </v-card>
              <StepperActions
                stepName="publish"
                nextButtonLabel="Publish"
                @stepBack="el = 2"
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
    };
  },
};
</script>
