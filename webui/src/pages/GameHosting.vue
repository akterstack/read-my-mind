<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Give Answers</v-toolbar-title>
        </v-toolbar>
        <v-layout align-center justify-center row fill-height>
          <v-flex xs4>
            <v-list v-show="games.length" three-line class="scroll-y">
              <v-list-tile
                v-for="{ id, word, host } in games"
                :key="id"
                avatar
                :to="`/game/host/${host.username}`"
              >
                <v-list-tile-avatar>
                  <Avatar :username="host.username" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ word }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
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
        gameList {
          id
          word
          updated
          host {
            username
          }
          players {
            id
          }
        }
      }
    `);
    this.games = data.gameList;
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
