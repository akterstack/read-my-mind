<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-icon>gamepad</v-icon>
          <v-toolbar-title>Join Games</v-toolbar-title>
        </v-toolbar>

        <v-list three-line class="scroll-y">
          <v-list-tile
            v-show="games.length"
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
                >ID {{ id }} - Joined {{ players.length }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn color="primary" @click="join(+id)">Join</v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-show="!games.length" avatar>
            <v-list-tile-content>
              <v-list-tile-title style="text-align: center"
                >No game yet</v-list-tile-title
              >
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import gql from 'graphql-tag';
import { Avatar } from '@/components';

export default {
  components: { Avatar },
  data() {
    return {
      games: [],
    };
  },
  created() {
    this.$apollo.addSmartQuery('gamesToJoin', {
      query: gql`
        query GamesToJoin {
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
      `,
      result({ data }) {
        this.games = data.gamesToJoin;
      },
    });
    this.$apollo.addSmartSubscription('gameSubscribe', {
      query: gql`
        subscription GameSubscribe {
          gameSubscribe {
            id
            updated
            host {
              username
            }
            players {
              username
            }
          }
        }
      `,
      result({ data }) {
        this.games.push(data.gameSubscribe);
      },
    });
  },
  methods: {
    async join(id) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation GameJoin($id: Int!) {
              gameJoin(id: $id) {
                players {
                  id
                }
              }
            }
          `,
          variables: { id },
          update: () => {
            this.$router.push('/game/play');
          },
        });
      } catch (e) {
        if (e.length) {
          e.forEach(({ message }) => {
            this.$root.$emit('notify', {
              message,
            });
          });
        } else {
          console.debug(e);
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
