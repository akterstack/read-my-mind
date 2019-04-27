<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Join Games</v-toolbar-title>
        </v-toolbar>

        <v-list v-show="games.length" three-line class="scroll-y">
          <v-list-tile
            v-for="{ id, word, updated, host, players } in games"
            :key="id"
            avatar
          >
            <v-list-tile-avatar>
              <Avatar :username="host.username" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ host.username }}</v-list-tile-title>
              <v-list-tile-sub-title
                >Joined {{ players.length }}</v-list-tile-sub-title
              >
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn color="primary" @click="join(+id)">Join</v-btn>
            </v-list-tile-action>
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
        gamesToJoin {
          id
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
    this.games = data.gamesToJoin;
  },
  methods: {
    async join(id) {
      console.log(id);
      try {
        await executeGraphQL(
          `mutation GameJoin($id: Int!) {
            gameJoin(id: $id) {
              players {
                id
              }
            }
          }`,
          { id }
        );
        this.$router.push('/game/play');
      } catch (e) {
        if (e.length) {
          e.forEach(({ message }) => {
            this.$root.$emit('notify', {
              message,
            });
          });
        } else {
          this.$root.$emit('notify', {
            message: 'Unknown error occurred. Please contact admin.',
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
