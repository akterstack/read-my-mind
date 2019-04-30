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
                  v-model="questionOrWord"
                  :placeholder="placeholder"
                  @keydown.enter.prevent="askQuestion"
                  :disabled="hints.length > 0 && !latestHint.answer"
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

function parseWord(word) {
  const parsed = word.trim().match(/\[(.*?)]/i);
  return parsed ? parsed[1] : '';
}

export default {
  data() {
    return {
      game: {},
      hints: [],
      latestHint: {},
      questionOrWord: '',
    };
  },
  computed: {
    placeholder() {
      return this.hints.length && !this.latestHint.answer
        ? `Waiting for response`
        : this.latestHint.isAllHintsRedeemed
        ? `Commit the final [word]`
        : `Ask hint or commit the [word] wrapping square brackets`;
    },
  },
  methods: {
    loadHints() {
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
          gameId: this.game.id,
        },
        result({ data }) {
          this.hints = data.hints;
          if (this.hints && this.hints.length) {
            this.latestHint = this.hints[this.hints.length - 1];
            if (this.hints.length === this.game.maxHint) {
              this.latestHint.isAllHintsRedeemed = true;
            }
          }
        },
      });
    },
    askQuestion() {
      if (
        parseWord(this.questionOrWord) ||
        this.latestHint.isAllHintsRedeemed
      ) {
        this.commitWord();
        return;
      }
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
          gameId: this.game.id,
          question: this.questionOrWord,
        },
        update: (cache, { data }) => {
          this.hints.push(data.askQuestion);
          this.latestHint = data.askQuestion;
          this.questionOrWord = '';
        },
      });
    },
    subscribeAnswer() {
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
          gameId: this.game.id,
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
          word: parseWord(this.questionOrWord) || this.questionOrWord,
          gameId: this.game.id,
        },
        update: (cache, { data }) => {
          this.$store.commit(
            'setCelebration',
            data.commitWord.word === data.commitWord.game.word
          );
          this.$router.push('/game/celebrate');
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
            maxHint
          }
        }
      `,
      result: ({ data }) => {
        this.game = data.gameInSession;
        this.loadHints();
        this.subscribeAnswer();
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
        console.log('onsubssess');
        console.log(data.gameInSessionSubscribe);
        this.game = data.gameInSessionSubscribe;
        this.loadHints();
        this.subscribeAnswer();
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
