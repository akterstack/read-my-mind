<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-icon>card_travel</v-icon>
          <v-toolbar-title>My Games</v-toolbar-title>
        </v-toolbar>

        <v-list three-line class="scroll-y">
          <v-list-tile
            v-show="hasGame()"
            v-for="{
              id,
              word,
              maxPlayer,
              maxHint,
              status,
              players,
            } in Object.values(gameIdMap)"
            :key="id"
            avatar
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ word }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <span class="subheading">#{{ id }} - {{ status }}</span>
                <span class="mr-1"> - </span>
                <span class="subheading mr-2">joined {{ players.length }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-layout align-end>
                <v-btn flat color="primary" @click="start(+id)">Start</v-btn>
                <v-icon @click="remove(+id)" large>delete_forever</v-icon>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-show="!hasGame()" avatar>
            <v-list-tile-content>
              <v-list-tile-title
                style="text-align: center"
                v-text="
                  $apollo.queries.hostedGames.loading
                    ? 'Loading...'
                    : 'No games yet'
                "
              ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      gameIdMap: {},
    };
  },
  methods: {
    hasGame() {
      return !!Object.keys(this.gameIdMap).length;
    },
    async remove(id) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation GameDelete($id: Int!) {
            gameDelete(id: $id) {
              id
            }
          }
        `,
        variables: {
          id,
        },
      });
      this.$delete(this.gameIdMap, id);
    },
    async start(id) {
      try {
        this.$emit('beforeGameStart', this.$store.state.game);
        await this.$store.dispatch('updateGame', { id, status: 'started' });
        await this.$store.commit('clearGame');
        this.$router.push('/game/host');
        this.$emit('gameStart', this.$store.state.game);
      } catch (e) {
        if (e.length) {
          e.forEach(({ message }) => {
            if (message === 'GAME_IN_SESSION') {
              this.$router.push('/game/host');
            }
          });
        }
      }
    },
  },
  async created() {
    this.$apollo.addSmartQuery('hostedGames', {
      query: gql`
        query {
          hostedGames {
            id
            word
            status
            updated
            maxPlayer
            maxHint
            players {
              id
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      result({ data }) {
        data.hostedGames.forEach(game => {
          this.$set(this.gameIdMap, game.id, game);
        });
      },
    });
    this.$apollo.addSmartSubscription('onJoinGame', {
      query: gql`
        subscription JoinGame {
          onJoinGame {
            id
            word
            status
            updated
            maxPlayer
            maxHint
            players {
              id
            }
          }
        }
      `,
      result({ data }) {
        this.gameIdMap[data.onJoinGame.id] = data.onJoinGame;
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
