<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 lg6>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Ask Hints (Max {{ game.maxHint }})</v-toolbar-title>
        </v-toolbar>
        <v-layout align-center justify-center row fill-height>
          <v-flex>
            <h1 v-if="game.status !== 'started'">Waiting...</h1>
            <v-layout v-else row align-center justify-center>
              <v-flex xs11>
                <v-card
                  v-for="{ id, question, answer } in hints"
                  :key="id"
                  :color="
                    answer === 'y' ? 'green' : answer === 'n' ? 'red' : ''
                  "
                  flat
                >
                  <v-card-title
                    >{{ question }}
                    {{
                      !answer ? '' : answer === 'y' ? '(YES)' : '(NO)'
                    }}</v-card-title
                  >
                </v-card>
                <v-divider></v-divider>
                <v-text-field
                  v-model="newQuestion"
                  :placeholder="placeholder"
                  @keydown.enter.prevent="askQuestion"
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
        : this.latestHint.isAllHintsRedeemed
        ? `Commit the final [word] wrapping square brackets`
        : `Ask hint or commit the [word] wrapping square brackets`;
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
              answer
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
    askQuestion() {
      if (!this.newQuestion) return; // todo show some error message
      this.$apollo.mutate({
        mutation: gql`
          mutation AskQuestion($gameId: Int!, $question: String!) {
            askQuestion(gameId: $gameId, question: $question) {
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
          this.hints.push(data.askQuestion);
          this.latestHint = data.askQuestion;
          this.newQuestion = '';
        },
      });
    },
    subscribeAnswer(gameId) {
      this.$apollo.addSmartSubscription('onGameHintAnswer', {
        query: gql`
          subscription OnGameHintAnswer($gameId: Int!) {
            onGameHintAnswer(gameId: $gameId) {
              answer
              isAllHintsRedeemed
            }
          }
        `,
        variables: {
          gameId,
        },
        result: ({ data }) => {
          this.latestHint.answer = data.onGameHintAnswer.answer;
          this.latestHint.isAllHintsRedeemed =
            data.onGameHintAnswer.isAllHintsRedeemed;
        },
      });
    },
    commitWord() {
      this.$apollo.mutate({
        mutation: gql`
          mutation CommitWord($word: String!, $gameId: Int!) {
            commitWord(word: $word, gameId: $gameId) {
              word
              game {
                word
              }
            }
          }
        `,
        variables: {
          word: this.newQuestion,
          gameId: +this.game.id,
        },
        update: (cache, { data }) => {

        }
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
            maxHint
          }
        }
      `,
      result: ({ data }) => {
        this.game = data.gameInSession;
        this.loadHints(+this.game.id);
        this.subscribeAnswer(+this.game.id);
      },
    });
    this.$apollo.addSmartSubscription('gameInSessionSubscribe', {
      query: gql`
        subscription {
          gameInSessionSubscribe {
            id
            status
            maxHint
          }
        }
      `,
      result: ({ data }) => {
        this.game = data.gameInSessionSubscribe;
        this.loadHints(+this.game.id);
        this.subscribeAnswer(+this.game.id);
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
