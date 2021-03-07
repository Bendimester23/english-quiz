<template>
  <v-app>
    <v-main>
      <div class="appMain">
        <h1>The quiz haven't started yet.</h1>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
});
</script>

<style lang="scss">
* {
  background-color: #222f3e;
  color: #fff;
}
.appMain {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
</style>
