<template>
  <div class="dashboard align-center">
    <h1>Dashboard</h1>
    <div class="btn-group">
      <v-btn-toggle v-model="state">
        <v-btn color="#1dd1a1" elevation="6">Open</v-btn>
        <v-btn color="#1dd1a1" elevation="6">Start</v-btn>
        <v-btn color="#1dd1a1" elevation="6">Stop</v-btn>
        <v-btn color="#1dd1a1" elevation="6">End</v-btn>
        <v-btn color="#1dd1a1" elevation="6">Reset</v-btn>
      </v-btn-toggle>
    </div>
    <div class="players">
      Waiting: {{ waitUsers }}<br />
      InGame: {{ pCount }} <br />
      Players:
      <ul>
        <li v-bind:key="player" v-for="player in players">
          {{ player }}
          <v-btn v-on:click="kick(player)" color="#1dd1a1" elevation="8"
            >Kick</v-btn
          >
        </li>
      </ul>
      Question: {{question == `` ? `----` : question}} <br>
      <p v-for="(answ, index) in answers" v-bind:key="index">
        {{right == n ? `<b>${answ}</b>` : answ}}: {{aCount[n]}}
      </p>
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
    state: 2,
    question: ``,
    answers: [],
    aCount: [],
    right: 0
  }),
  computed: {
    pCount: function (): number {
      return this.players.length;
    },
  },
  watch: {
    state(val: number) {
      switch (val) {
        case 0:
          this.open();
          break;
        case 1:
          this.start();
          break;
        case 2:
          this.stop();
          break;
        case 3:
          this.end();
          break;
        case 4:
          this.reset();
          break;
      }
    }
  },
  methods: {
    open() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: false,
        isEnded: false,
      });
    },
    start() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: true,
        isEnded: false,
      });
    },
    stop() {
      this.$socket.emit(`setquizstate`, {
        isStarted: false,
        isReady: false,
        isEnded: false,
      });
    },
    end() {
      this.$socket.emit(`setquizstate`, {
        isStarted: true,
        isReady: true,
        isEnded: true,
      });
    },
    reset() {
      this.$socket.emit(`reset_quiz`, {})
      this.state = 2
    },
    kick(player: string) {
      this.$socket.emit(`kick_player`, player);
    },
  },
  mounted() {
    this.$socket.emit(`dash`, {});
    this.sockets.subscribe(`waiting`, (data) => {
      this.waitUsers = data.notReadyPlayers;
    });
    this.sockets.subscribe(`update_players`, (data) => {
      this.players = data;
    });
    this.sockets.subscribe(`changestate`, (data: any) => {
      if (!data.isStarted && !data.isReady && !data.isEnded) {
        this.state = 2
      } else if (data.isEnded) {
        this.state = 3
      } else if (data.isReady) {
        this.state = 1
      } else {
        this.state = 0
      }
    })
    this.sockets.subscribe(`updatequestion`, (data: any) => {
      this.question = data.title;
      this.answers = data.answers;
      this.answers.forEach((e) => {
        this.aCount.push((0 as never))
      })
    })
    this.$socket.emit(`querry_players`, {});
    this.$socket.emit(`checkstate`, {});
  },
  beforeDestroy() {
    this.sockets.unsubscribe(`waiting`);
    this.sockets.unsubscribe(`update_players`);
    this.sockets.unsubscribe(`changestate`);
    this.sockets.unsubscribe(`updatequestion`)
  },
});
</script>

<style lang="scss">
.dashboard {
  background-image: linear-gradient(to bottom right, #222f3e, #1c2836);
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .btn-group {
    flex-direction: row;
    margin: 10px;
  }
  .players {
    flex-direction: column;
  }
}
</style>
