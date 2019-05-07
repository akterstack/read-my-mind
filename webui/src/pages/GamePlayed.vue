<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-icon>rowing</v-icon>
          <v-toolbar-title>My Played Games</v-toolbar-title>
        </v-toolbar>

        <v-list three-line class="scroll-y">
          <v-list-tile
            v-show="games.length"
            v-for="{ id, word, host } in games"
            :key="id"
            avatar
            @click="javascript(0)"
          >
            <v-list-tile-avatar>
              <Avatar :username="host.username" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ word }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-show="!games.length" avatar>
            <v-list-tile-content>
              <v-list-tile-title style="text-align: center"
                >No games yet</v-list-tile-title
              >
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { executeGraphQL } from '@/http';
import { Avatar } from '@/components';

export default {
  components: { Avatar },
  data() {
    return {
      games: [],
    };
  },
  async beforeMount() {
    const data = await executeGraphQL(`
      query {
        playedGames {
          id
          word
          updated
          host {
            username
          }
        }
      }
    `);
    this.games = data.playedGames;
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
