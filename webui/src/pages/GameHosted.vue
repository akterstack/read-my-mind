<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>My Games</v-toolbar-title>
        </v-toolbar>

        <v-list v-show="games.length" three-line class="scroll-y">
          <v-list-tile
            v-for="{ id, word, status } in games"
            :key="id"
            avatar
            @click="javascript(0)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ word }}</v-list-tile-title>
              <v-list-tile-sub-title> {{ status }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
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
          players {
            id
          }
        }
      }
    `);
    this.games = data.hostedGames;
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
