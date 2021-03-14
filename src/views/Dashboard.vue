<template>
  <div class="dashboard align-center">
    <h1>Dashboard</h1>
    <div class="btn-group">
      <v-btn v-on:click="open()" color="#1dd1a1">Open</v-btn>
      <v-btn v-on:click="start()" color="#1dd1a1">Start</v-btn>
      <v-btn v-on:click="stop()" color="#1dd1a1">Stop</v-btn>
      <v-btn v-on:click="end()" color="#1dd1a1">End</v-btn>
    </div>
    <div class="players">
        Waiting: {{waitUsers}}<br>
        Players: {{players.lenght}}
        <ul>
            <li v-bind:key="player" v-for="player in players">
                {{player}}
                <v-btn v-on:click="kick(player)" color="#1dd1a1" elevation="8">Kick</v-btn>
                </li>
        </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: `Dashboard`,
  data: () => ({
    waitUsers: 0,
    players: [],
  }),
  methods: {
    open() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: false,
        isEnded: false
      });
    },
    start() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: true,
        isEnded: false
      });
    },
    stop() {
      this.$socket.emit(`setquizstate`, {
        isStarted: false,
        isReady: false,
        isEnded: false
      });
    },
    end() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: true,
        isEnded: true
      });
    },
    kick(player: string) {
        this.$socket.emit(`kick_player`, player)
    }
  },
  mounted() {
    this.$socket.emit(`dash`, {});
    this.sockets.subscribe(`waiting`, (data) => {
      this.waitUsers = data.notReadyPlayers;
    });
    this.sockets.subscribe(`update_players`, (data) => {
      this.players = data;
    });
    this.$socket.emit(`querry_players`, {})
  },
  beforeDestroy() {
    this.sockets.unsubscribe(`waiting`);
    this.sockets.unsubscribe(`update_players`);
  },
});
</script>

<style lang="scss">
.dashboard {
  background-image: linear-gradient(to bottom right,#222f3e, #1c2836);
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .btn-group {
    flex-direction: row;
  }
  .players {
      flex-direction: column;
  }
}
</style>
