<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 lg8 xl6>
        <v-stepper v-model="el">
          <v-stepper-header>
            <v-stepper-step :complete="el > 1" step="1">Word</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="el > 2" step="2">Options</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Publish</v-stepper-step>
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
                    autofocus
                    @keydown.enter="el = 2"
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
                    autofocus
                    @keydown.enter="el = 3"
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
                    @keydown.enter="el = 3"
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
              <div class="display-4 font-weight-black text-xs-center">
                {{ word }}
              </div>
              <div class="caption text-xs-center">
                Maximum {{ maxPlayer }} player{{ maxPlayer > 1 ? 's' : '' }} can
                join
              </div>
              <div class="caption text-xs-center mb-3">
                Each can ask {{ maxHint }} hint{{ maxHint > 1 ? 's' : '' }}
                (yes/no question) maximum
              </div>
              <v-divider class="mb-3"></v-divider>
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

function mapGetterSetter(props) {
  return props.reduce((propsGetterSetter, prop) => {
    propsGetterSetter[prop] = {
      get() {
        return this.$store.state.game[prop];
      },
      set(val) {
        this.$store.commit('setGame', { [prop]: val });
      },
    };
    return propsGetterSetter;
  }, {});
}

export default {
  components: {
    StepperActions,
  },
  data() {
    return {
      el: 0,
    };
  },
  computed: {
    ...mapGetterSetter(['word', 'maxPlayer', 'maxHint']),
  },
  methods: {
    async publish() {
      this.$store.commit('setGame', { status: 'published' });
      await this.$emit('beforeGamePublish', this.$store.state.game);
      await this.$store.dispatch('createGame');
      await this.$store.commit('clearGame');
      this.$emit('gamePublish', this.$store.state.game);
      this.$router.push('/game/hosted');
    },
  },
};
</script>
<style scoped>
.v-message {
  display: none;
}
</style>
