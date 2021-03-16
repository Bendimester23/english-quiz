<template>
  <v-app class="app">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  components: {
  },
  beforeDestroy: function() {
    this.$socket.emit(`disconnect`, {})
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

.app {
  background-color: #222f3e;
  color: #fff;
  margin: 0px;
  padding: 0px;
}

* {
  font-family: 'Nunito', sans-serif;
}
</style>
