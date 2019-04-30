<template>
  <h1>
    {{ $store.state.isWinner ? 'Winner!' : 'Loser :/' }}
  </h1>
</template>
<script>
export default {
  data() {
    return {
      celebrationText: 'Celebrating...',
    };
  },
};
</script>
