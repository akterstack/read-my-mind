<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Give Answers</v-toolbar-title>
        </v-toolbar>
        <v-layout align-center justify-center row fill-height>
          <v-flex xs4>
            <v-list dense three-line class="scroll-y">
              <v-list-tile
                v-show="game.id"
                v-for="{ id, username } in game.players"
                :key="id"
                avatar
                :to="`/game/host/${id}`"
              >
                <v-list-tile-avatar>
                  <Avatar :username="username" />
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ username }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon v-show="pendingAnswerFor[id]" color="green"
                    >star</v-icon
                  >
                </v-list-tile-action>
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
import Vue from 'vue';
import gql from 'graphql-tag';
import { Avatar } from '@/components';

export default {
  components: { Avatar },
  data() {
    return {
      game: {},
      pendingAnswerFor: {},
    };
  },
  created() {
    this.$apollo.addSmartQuery('gameInSession', {
      query: gql`
        query {
          gameInSession {
            id
            status
            players {
              id
              username
            }
          }
        }
      `,
      result({ data }) {
        this.game = data.gameInSession;
      },
    });
    this.$root.$on('hint', hint => {
      Vue.set(this.pendingAnswerFor, hint.player.id, !hint.answer);
    });
  },
  beforeDestroy() {
    this.$root.$off('hint');
  },
};
</script>
<style scoped>
v-list {
  max-height: 400px;
}
</style>
