<template>
  <div class="home">
    <h1 v-if="!isStarted">The quiz haven't started yet.</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
  data: function () {
    return {
      isStarted: false,
    };
  },
  mounted: function () {
    console.log(`Checkstate`);
    this.$socket.emit(`checkstate`, {});
    this.sockets.subscribe(`changestate`, (data: any) => {
      console.log(`State changed. State: ${JSON.stringify(data)}`);
      this.isStarted = data.isStarted;
      if (this.isStarted) {
        window.location.assign(
          this.$router.resolve({
            path: `/setname`,
          }).href
        );
      }
    });
  },
  beforeDestroy: function () {
    this.sockets.unsubscribe(`changestate`);
  },
});
</script>

<style lang="scss">
.home {
  background-image: linear-gradient(to bottom right,#222f3e, #1c2836);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
</style>
