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
                <v-card flat>
                  <v-card-title>sdfsaf</v-card-title>
                </v-card>
                <v-divider></v-divider>
                <v-text-field v-model="hint" placeholder="Ask hint or tell the [word] with squire brackets"></v-text-field>
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
      hint: '',
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
  methods: {
    askHint() {
      this.$apollo.mutate({
        mutation: gql`
mutation AskHint($gameId: Int!, $question: String!) {

}
`
      })
    }
  }
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
