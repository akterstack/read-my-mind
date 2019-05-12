<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-icon>gamepad</v-icon>
          <v-toolbar-title>Join Games</v-toolbar-title>
        </v-toolbar>

        <v-list three-line class="scroll-y">
          <v-list-tile
            v-show="hasGame()"
            v-for="{ id, word, updated, host, players } in Object.values(
              gameIdMap
            )"
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
              <v-btn flat color="primary" @click="join(+id)">Join</v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-show="!hasGame()" avatar>
            <v-list-tile-content>
              <v-list-tile-title
                style="text-align: center"
                v-text="
                  $apollo.queries.gamesToJoin.loading
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
import { Avatar } from '@/components';

export default {
  components: { Avatar },
  data() {
    return {
      gameIdMap: {},
    };
  },
  methods: {
    hasGame() {
      return !!Object.entries(this.gameIdMap).length;
    },
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
        });
        this.$router.push('/game/play');
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
      fetchPolicy: 'no-cache',
      result({ data }) {
        data.gamesToJoin.forEach(game => {
          this.$set(this.gameIdMap, game.id, game);
        });
      },
    });
    this.$apollo.addSmartSubscription('onGameCreate', {
      query: gql`
        subscription OnGameCreate {
          onGameCreate {
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
        this.$set(this.gameIdMap, `${data.onGameCreate.id}`, data.onGameCreate);
      },
    });
    this.$apollo.addSmartSubscription('onGameUpdate', {
      query: gql`
        subscription OnGameCreate {
          onGameUpdate {
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
        this.$set(this.gameIdMap, `${data.onGameUpdate.id}`, data.onGameUpdate);
      },
    });
    this.$apollo.addSmartSubscription('onGameDelete', {
      query: gql`
        subscription OnGameDelete {
          onGameDelete {
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
        this.$delete(this.gameIdMap, `${data.onGameDelete.id}`);
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
