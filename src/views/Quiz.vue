<template>
  <div class="quiz">
    <div class="countdown" v-if="isCool && !isAnn">
      <h1>{{ isCool ? countdown + 3 : countdown }}</h1>
      <h3>{{ facts[answerId] }}</h3>
    </div>
    <div class="question" v-if="!isCool && !isAnn">
      <h1>{{ title }}</h1>
      <div class="btns">
        <v-btn
          v-bind:key="answer"
          v-for="answer in answers"
          v-on:click="click(answer)"
          >{{ answer }}</v-btn
        >
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
    isPre: false,
    title: ``,
    answers: [],
    facts: [],
    countdown: 10,
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
          this.isPre = true;
          break;
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
});
</script>

<style lang="scss">
.quiz {
  display: flex;
  background-color: #222f3e;
  color: #fff;
  height: 100%;
  width: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}
</style>
