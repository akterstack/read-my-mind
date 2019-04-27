<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>My Games</v-toolbar-title>
        </v-toolbar>

        <v-list v-show="games.length" three-line class="scroll-y">
          <v-list-tile
            v-for="{ id, word, maxPlayer, maxHint, status, players } in games"
            :key="id"
            avatar
            @click="openDialog({ id, word, maxPlayer, maxHint, players })"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ word }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <span class="subheading">{{ status }}</span>
                <span class="mr-1"> · </span>
                <span class="subheading mr-2">joined {{ players.length }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <v-dialog v-model="dialog.show" max-width="450">
        <v-card>
          <v-card-title class="headline">{{ dialog.word }}</v-card-title>
          <v-card-text>
            <p>
              Maximum {{ dialog.maxPlayer }} player{{
                dialog.maxPlayer > 1 ? 's' : ''
              }}
              can join
            </p>
            <p>
              Each can ask {{ dialog.maxHint }} hint{{
                dialog.maxHint > 1 ? 's' : ''
              }}
              (yes/no question) maximum
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="dialog.show = false">
              Close
            </v-btn>
            <v-btn
              v-if="dialog.showStartButton"
              color="primary"
              flat="flat"
              @click="start(dialog.id)"
            >
              Start
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
import { executeGraphQL } from '@/http';

export default {
  data() {
    return {
      games: [],
    };
  },
  async beforeMount() {
    const data = await executeGraphQL(`
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
    `);
    this.games = data.hostedGames;
  },
  methods: {
    openDialog(game) {
      this.dialog = { ...this.dialog, ...game };
      this.dialog.showStartButton = game.players.length > 0;
      this.dialog.show = true;
    },
    async start(id) {
      try {
        this.$emit('beforeGameStart', this.$store.state.game);
        await this.$store.dispatch('updateGame', { id, status: 'started' });
        this.$store.commit('clearGame');
        this.$emit('gameStart', this.$store.state.game);
      } catch (e) {
        if (e.length) {
          e.forEach(({ message }) => {
            this.$root.$emit('notify', {
              message,
            });
          });
        }
      }
    },
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
