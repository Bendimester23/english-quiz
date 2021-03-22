<template>
  <div class="quiz">
    <div class="countdown" v-if="isCool && !isAnn">
      <h1>{{ cooldown }}</h1>
      <h3>{{ facts[answer.id] }}</h3>
    </div>
    <div class="question" v-if="!isCool && !isAnn">
      <div class="heading">
        <h1>{{ cooldown }}</h1>
        <v-progress-linear :value="cooldown * 10"></v-progress-linear>
      </div>
      <h1>{{ title }}</h1>
      <v-spacer></v-spacer>
      <div class="btns" v-if="!answer.has">
        <div class="col">
          <div class="btn">
            <v-btn color="#10ac84" height="100%" @click="answ(0)">{{
              answers[0]
            }}</v-btn>
          </div>
          <div class="btn">
            <v-btn color="#1dd1a1" height="100%" @click="answ(1)">{{
              answers[1]
            }}</v-btn>
          </div>
        </div>
        <div class="spacer"></div>
        <div class="col">
          <div class="btn">
            <v-btn color="#1dd1a1" height="100%" @click="answ(2)">{{
              answers[2]
            }}</v-btn>
          </div>
          <div class="btn">
            <v-btn color="#10ac84" height="100%" @click="answ(3)">{{
              answers[3]
            }}</v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="announcement" v-if="isAnn">
      <h1>Question {{ annNum }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: `Quiz`,
  data: () => ({
    isCool: true,
    title: ``,
    answers: [],
    facts: [],
    cooldown: 5,
    answer: {
      id: 0,
      has: false,
    },
    isAnn: false,
    annNum: 0,
  }),
  mounted() {
    this.sockets.subscribe(`updatequestion`, (data) => {
      if (data == null || data == undefined) {
        window.location.assign(
            this.$router.resolve({
              path: `/end`,
            }).href
          );
        return
      }
      this.title = data.title;
      this.answers = data.answers;
      this.facts = data.facts;
    });
    this.sockets.subscribe(`startquestion`, () => {
      this.isCool = false;
    });
    this.sockets.subscribe(`update-countdown`, (data) => {
      this.cooldown = data;
    });
    this.sockets.subscribe(`setcooldown`, (data) => {
      this.isCool = data;
    });
    this.sockets.subscribe(`setCurrState`, (data: number) => {
      switch (data) {
        case 0:
          this.isCool = true;
          this.cooldown = 5;
          break;
        case 1:          
          this.isCool = false;
          this.cooldown = 10;
          this.answer.id = 0
          this.answer.has = false
          break;
        case 2:
          window.location.assign(
            this.$router.resolve({
              path: `/end`,
            }).href
          );
      }
    });
    this.sockets.subscribe(`annuance`, (data: number) => {
      this.annNum = data;
      this.isAnn = true;
      setTimeout(() => {
        this.isAnn = false;
      }, 1000);
    });
    this.sockets.subscribe(`changestate`, (data) => {
      if (!data.isReady) {
        window.location.assign(
          this.$router.resolve({
            path: `/`,
          }).href
        );
      } else if (!data.isStarted) {
        window.location.assign(
          this.$router.resolve({
            path: `/setname`,
          }).href
        );
      }
    });
    this.$socket.emit(`getquestion`, {});
    this.$socket.emit(`checkstate`, {})
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
    answ(answ: number) {
      this.$socket.emit(`answer`, answ);
      this.answer.id = answ
      this.answer.has = true
    },
  },
});
</script>

<style lang="scss">
.quiz {
  display: flex;
  background-image: linear-gradient(to bottom right, #222f3e, #1c2836);
  color: #fff;
  height: 100%;
  width: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: flex-start;
  margin: 0px;
  .announcement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }
  .question {
    display: flex;
    margin: 0px;
    flex-direction: column;
    height: 100%;
    .heading {
      margin-top: 0px;
      flex-grow: 1;
    }
    .btns {
      display: flex;
      height: 80vh;
      align-content: flex-end;
      flex-direction: row;
      flex-grow: 2;
      margin: 10px;
      .spacer {
        max-width: 20%;
        flex-grow: 50;
      }
      .col {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 40%;
        .btn {
          display: flex;
          flex-direction: column;
          height: 20vh;
          margin: 5px;
          width: 100%;
          button span {
            color: #000;
            font-size: 20px;
            font-weight: 800;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .quiz {
    .question {
      .btns {
        flex-direction: column !important;
        .spacer {
          display: none !important;
        }
        .col {
          margin-top: 0px;
          padding-top: 0px;
          margin-bottom: 0px;
          padding-bottom: 0px;
          width: 100%;
          justify-content: flex-start;
          .btn {
            height: 50%;
          }
        }
      }
    }
  }
}
</style>
