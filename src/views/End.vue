<template>
  <div class="end">
    <h1>The quiz ended!</h1>
    <h2>Leaderboard:</h2>
    <ol>
      <li v-for="u in top" v-bind:key="u">
        {{u.name}}: {{u.points}}pts
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: `End`,
  data: () => ({
    top: []
  }),
  mounted() {
    this.sockets.subscribe(`changestate`, (data) => {
      if (!data.isEnded) {
        if (data.isStarted) {
          window.location.assign(
            this.$router.resolve({
              path: `/quiz`,
            }).href
          );
        } else if (data.isReady) {
          window.location.assign(
            this.$router.resolve({
              path: `/setname`,
            }).href
          );
        } else {
          window.location.assign(
            this.$router.resolve({
              path: `/`,
            }).href
          );
        }
      }
    });
    this.sockets.subscribe(`top`, (data) => {
      this.top = data
    })
    this.$socket.emit(`checkstate`, {});
  },
  beforeDestroy() {
    this.sockets.unsubscribe(`changestate`);
    this.sockets.unsubscribe(`top`)
  },
});
</script>

<style lang="scss">
.end {
  display: flex;
  background-image: linear-gradient(to bottom right, #222f3e, #1c2836);
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 5px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
