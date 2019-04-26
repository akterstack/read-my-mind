<template>
  <v-container fluid fill-height gritd-list-xs>
    <v-layout row align-center justify-center>
      <v-flex xs12 md10 lg8 xl6>
        <v-layout>
          <StarterCard v-bind="host" />
          <StarterCard v-bind="player" />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { StarterCard } from '@/components';

export default {
  components: {
    StarterCard,
  },
  data() {
    return {
      host: {
        title: 'Be Host',
        subtitle: 'Give Answers',
        description:
          'Guess your precious word and give answers to your players\' "yes/no" questions',
        link: '/game/new',
        color: 'purple darken-1',
        avatar:
          'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Kurt&hairColor=PastelPink&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Wink&eyebrowType=UpDown&mouthType=Smile&skinColor=Yellow',
      },
      player: {
        title: 'Be Player',
        avatar:
          'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Round&hairColor=Brown&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelOrange&eyeType=Surprised&eyebrowType=Default&mouthType=Default&skinColor=Light',
        subtitle: 'Ask Questions',
        description:
          'Collect hints asking some related questions (yes/no type)',
        link: '/game/join',
        color: 'deep-purple darken-1',
      },
    };
  },
};
</script>
