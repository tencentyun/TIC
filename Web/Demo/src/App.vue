<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html, body {
  height: 100%;
  width: 100%;
  overflow: hidden !important;
}
</style>

<script>

export default {
  name: 'App',

  data: () => ({
  }),
};
</script>
