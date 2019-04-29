<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex>
      <h1 v-if="game.status !== 'started'">No question yet...</h1>
      <v-layout v-else row align-center justify-center>
        <v-flex xs11>
          <v-card
            v-for="{ id, question, answer } in playersHints[
              $route.params.playerId
            ]"
            :key="id"
            :color="answer === 'y' ? 'green' : answer === 'n' ? 'red' : ''"
            flat
          >
            <v-card-title>{{ question }}</v-card-title>
            <v-card-actions v-if="!answer">
              <v-btn color="primary" @click="giveAnswer('yes', id)">Yes</v-btn>
              <v-btn @click="giveAnswer('no', id)">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
import gql from 'graphql-tag';
export default {
  data() {
    return {
      game: {},
      playersHints: {},
    };
  },
  methods: {
    loadAllHints(gameId) {
      this.subscribeQuestion(gameId);
      this.$apollo.addSmartQuery('allPlayersHints', {
        query: gql`
          query AllHints($gameId: Int!) {
            allPlayersHints(gameId: $gameId) {
              id
              question
              answer
              player {
                id
              }
            }
          }
        `,
        variables: {
          gameId,
        },
        result({ data }) {
          this.playersHints = data.allPlayersHints.reduce(
            (playersHints, hint) => {
              const individualHints = playersHints[hint.player.id] || [];
              individualHints.push(hint);
              playersHints[hint.player.id] = individualHints;
              return playersHints;
            },
            {}
          );
        },
      });
    },
    subscribeQuestion(gameId) {
      this.$apollo.addSmartSubscription('onQuestionGameHint', {
        query: gql`
          subscription OnQuestionGameHint($gameId: Int!) {
            onQuestionGameHint(gameId: $gameId) {
              id
              question
              answer
              player {
                id
              }
            }
          }
        `,
        variables: {
          gameId,
        },
        result: ({ data }) => {
          this.playersHints[data.onQuestionGameHint.player.id].push(
            data.onQuestionGameHint
          );
        },
      });
    },
    giveAnswer(answer, hintId) {
      this.$apollo.mutate({
        mutation: gql`
          mutation GiveAnswer($hintId: Int!, $answer: String!) {
            giveAnswer(hintId: $hintId, answer: $answer) {
              answer
              player {
                id
              }
            }
          }
        `,
        variables: {
          hintId,
          answer,
        },
        update: (cache, { data }) => {
          const xHints = this.playersHints[data.giveAnswer.player.id];
          xHints.forEach(hint => {
            if (hint.id === hintId) {
              hint.answer = data.giveAnswer.answer;
            }
          });
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
        this.loadAllHints(+this.game.id);
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
        this.loadAllHints(+this.game.id);
      },
    });
  },
};
</script>
