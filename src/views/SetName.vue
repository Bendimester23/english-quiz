<template>
  <div class="setname">
    <v-sheet
      class="form align-center"
      rounded
      elevation="8"
      color="#1dd1a1"
      v-if="!isWaiting"
    >
      <h1>The quiz has started, please choose a name!</h1>
      <v-spacer></v-spacer>
      <v-text-field placeholder="Name" ref="username"></v-text-field>
      <v-btn elevation="8" v-on:click="ready()">Start</v-btn>
    </v-sheet>
    <v-sheet
      v-if="isWaiting"
      class="form align-center"
      rounded
      elevation="8"
      color="#1dd1a1"
    >
      <h1>Waiting for {{ waitUsers }} users!</h1>
      <h2>Players</h2>
      <ul>
        <li v-bind:key="player" v-for="player in players">{{ player }}</li>
      </ul>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: `SetName`,
  data: () => ({
    isWaiting: false,
    waitUsers: 0,
    players: [],
  }),
  methods: {
    ready() {
      this.$socket.emit(`ready`, {
        name: (this.$refs.username as any).lazyValue,
      });
      this.isWaiting = true;
    },
  },
  mounted() {
    this.sockets.subscribe(`waiting`, (data) => {
      this.waitUsers = data.notReadyPlayers;
    });
    this.sockets.subscribe(`update_players`, (data) => {
      this.players = data;
    });
    this.sockets.subscribe(`changestate`, (data: any) => {
      console.log(`State changed. State: ${JSON.stringify(data)}`);
      if (!data.isStarted) {
        window.location.assign(
          this.$router.resolve({
            path: `/`,
          }).href
        );
        return
      }
      if (data.isReady) {
        window.location.assign(
          this.$router.resolve({
            path: `/quiz`,
          }).href
        );
      }
    });
    this.$socket.emit(`checkstate`, {});
  },
  beforeDestroy() {
    this.sockets.unsubscribe(`waiting`);
    this.sockets.unsubscribe(`update_players`);
    this.sockets.unsubscribe(`changestate`);
  },
});
</script>

<style lang="scss">
.setname {
  background-color: #222f3e;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  .form {
    justify-self: center;
    align-self: center;
    display: flex;
    padding: 5px;
    flex-direction: column;
    width: 500px;
  }
}
</style>
