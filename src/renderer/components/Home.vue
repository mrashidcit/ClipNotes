<template>
  <div>
    <!-- Top application bar -->
    <top-bar />
    <!-- Notes -->
    <notes />
  </div>
</template>

<script>
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'

  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    font-family: 'Lato', 'Source Sans Pro', sans-serif;
  }
</style>
