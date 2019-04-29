<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Ask Hints</v-toolbar-title>
        </v-toolbar>
        <v-layout align-center justify-center row fill-height>
          <v-flex>
            <h1 v-if="game.status !== 'started'">Waiting...</h1>
            <v-layout v-else row align-center justify-center>
              <v-flex xs11>
                <v-card
                  v-for="{ id, question, answer } in hints"
                  :key="id"
                  flat
                >
                  <v-card-title>{{ question }}</v-card-title>
                  <v-card-text>{{ answer }}</v-card-text>
                </v-card>
                <v-divider></v-divider>
                <v-text-field
                  v-model="newQuestion"
                  :placeholder="placeholder"
                  @keydown.enter.prevent="askHint"
                  :disabled="latestHint && !latestHint.answer"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      game: {},
      hints: [],
      latestHint: null,
      newQuestion: '',
    };
  },
  computed: {
    placeholder() {
      return this.latestHint && !this.latestHint.answer
        ? `Waiting for response`
        : `Ask hint or tell the [word] with squire brackets`;
    },
  },
  methods: {
    loadHints(gameId) {
      if (!gameId) return;
      this.$apollo.addSmartQuery('hints', {
        query: gql`
          query AllHints($gameId: Int!) {
            hints(gameId: $gameId) {
              id
              question
            }
          }
        `,
        variables: {
          gameId: gameId,
        },
        result({ data }) {
          this.hints = data.hints;
          if (this.hints && this.hints.length) {
            this.latestHint = this.hints[this.hints.length - 1];
          }
        },
      });
    },
    askHint() {
      if (!this.newQuestion) return; // todo show some error message
      this.$apollo.mutate({
        mutation: gql`
          mutation AskHint($gameId: Int!, $question: String!) {
            askHint(gameId: $gameId, question: $question) {
              id
              question
              answer
            }
          }
        `,
        variables: {
          gameId: +this.game.id,
          question: this.newQuestion,
        },
        update: (cache, { data }) => {
          this.hints.push(data.askHint);
          this.latestHint = data.askHint;
          this.newQuestion = '';
        },
      });
    },
  },
  created() {
    this.$apollo.addSmartQuery('gameInSession', {
      query: gql`
        query {
          gameInSession {
            id
            status
          }
        }
      `,
      result: ({ data }) => {
        this.game = data.gameInSession;
        this.loadHints(+this.game.id);
      },
    });
    this.$apollo.addSmartSubscription('gameInSessionSubscribe', {
      query: gql`
        subscription {
          gameInSessionSubscribe {
            id
            status
          }
        }
      `,
      result: ({ data }) => {
        this.game = data.gameInSessionSubscribe;
        this.loadHints(+this.game.id);
      },
    });
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
