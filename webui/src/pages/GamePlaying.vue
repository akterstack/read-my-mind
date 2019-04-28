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
            <div v-else>{{ game }}</div>
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
    };
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
      result({ data }) {
        this.game = data.gameInSession;
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
      result({ data }) {
        this.game = data.gameInSessionSubscribe;
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
