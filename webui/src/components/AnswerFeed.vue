<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex>
      <h1 v-if="game.status !== 'started'">No question yet...</h1>
      <v-layout v-else row align-center justify-center>
        <v-flex xs11>
          <v-card v-for="{ id, question } in hints" :key="id" flat>
            <v-card-title>{{ question }}</v-card-title>
            <v-card-actions>
              <v-btn color="primary" @click="answerYes">Yes</v-btn>
              <v-btn @click="answerNo">No</v-btn>
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
      hints: [],
    };
  },
  methods: {
    loadHints(gameId, playerId) {
      if (!gameId || !playerId) return;
      this.$apollo.addSmartQuery('hints', {
        query: gql`
          query AllHints($gameId: Int!, $playerId: Int) {
            hints(gameId: $gameId, playerId: $playerId) {
              id
              question
            }
          }
        `,
        variables: {
          gameId,
          playerId,
        },
        result({ data }) {
          this.hints = data.hints;
        },
      });
    },
    answerYes() {},
    answerNo() {},
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
        this.loadHints(
          +this.game.id,
          +this.$router.currentRoute.params.playerId
        );
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
        this.loadHints(
          +this.game.id,
          +this.$router.currentRoute.params.playerId
        );
      },
    });
  },
};
</script>
