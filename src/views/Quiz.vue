<template>
  <div class="quiz">
    <div class="countdown" v-if="isCool && !isAnn">
      <h1>{{ countdown }}</h1>
      <h3>{{ facts[answerId] }}</h3>
    </div>
    <div class="question" v-if="!isCool && !isAnn">
      <div class="heading">
        <h1>{{ cooldown }}</h1>
        <v-progress-linear :value="100 - (cooldown * 10)"></v-progress-linear>
      </div>
      <h1>{{ title }}</h1>
      <div class="btns">
        <div class="btn" 
          v-bind:key="answer"
          v-for="answer in answers">
          <v-btn
          v-on:click="click(answer)"
          >{{ answer }}</v-btn
        >
        </div>
      </div>
    </div>
    <div class="annuancement" v-if="isAnn">
      Question {{annNum}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: `Quiz`,
  data: () => ({
    isCool: false,
    title: ``,
    answers: [],
    facts: [],
    countdown: 3,
    answerId: 0,
    isAnn: false,
    annNum: 0
  }),
  mounted() {
    this.sockets.subscribe(`updatequestion`, (data) => {
      this.title = data.title;
      this.answers = data.answers;
      this.facts = data.facts;
    });
    this.sockets.subscribe(`startquestion`, () => {
      this.isCool = false;
    });
    this.sockets.subscribe(`update-countdown`, (data) => {
      this.countdown = data;
    });
    this.sockets.subscribe(`setcooldown`, (data) => {
      this.isCool = data;
    });
    this.sockets.subscribe(`setCurrState`, (data: number) => {
      switch (data) {
        case 0:
          this.isCool = true;
          break;
        case 1:
          this.isCool = false;
          break
        case 2:
          window.location.assign(
          this.$router.resolve({
            path: `/end`,
          }).href
        );
      }
    });
    this.sockets.subscribe(`annuance`, (data: number) => {
      this.annNum = data
      this.isAnn = true
      setTimeout(() => {
        this.isAnn = false
      }, 1000)
    })
    this.sockets.subscribe(`changestate`, (data) => {
      if (!data.isStarted) {
        window.location.assign(
          this.$router.resolve({
            path: `/`,
          }).href
        );
      } else if (data.isReady) {
        window.location.assign(
          this.$router.resolve({
            path: `/setname`,
          }).href
        );
      }
    })
    this.$socket.emit(`getquestion`, {});
  },
  beforeDestroy() {
    this.sockets.unsubscribe(`updatequestion`);
    this.sockets.unsubscribe(`startquestion`);
    this.sockets.unsubscribe(`setcooldown`);
    this.sockets.unsubscribe(`update-countdown`);
    this.sockets.unsubscribe(`setCurrState`);
    this.sockets.unsubscribe(`annuance`);
    this.sockets.unsubscribe(`changestate`);
  },
  methods: {
    click(answ: string) {
      console.log(answ);
    }
  }
});
</script>

<style lang="scss">
.quiz {
  display: flex;
  background-image: linear-gradient(to bottom right,#222f3e, #1c2836);
  color: #fff;
  height: 100%;
  width: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  .btns {
    display: flex;
    .btn {
      margin: 15px;
    }
  }
}
</style>
