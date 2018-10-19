<template>
  <div class="glass-view"
    v-if="$store.state.config.about.state">
    <div class="wrapper hero-x-y" style="text-align: center;">
      <img style="width: auto; height: 120px;display: block;margin: auto;padding: 10px;"
        src="../../assets/logo-hero.png">
      <p style="padding: 10px;font-size: 18px;">
        <strong>ClipNotes</strong> is a free and open-source
        desktop application for Windows and Mac.
      </p>
      <a @click="openLink('https://github.com/xplorebits/ClipNotes')">Download Original Source Code</a> | <a>Download ClipNotes</a>
      <p>Released under <a @click="openLink('https://opensource.org/licenses/MIT')">MIT License</a></p>
      <p>Copyright &copy; 2018 <a @click="openLink('https://github.com/saikksub')">@saikksub</a>. All Rights Reserved.</p>
      <v-btn depressed color="secondary"
        @click="$store.dispatch('setState', {
          name: 'about',
          state: false
        })">
        <v-icon left>clear</v-icon> Close
      </v-btn>
    </div>
  </div>
</template>

<script>
const { shell } = require('electron')

export default {
  name: 'about',
  methods: {
    openLink (url) {
      shell.openExternal(url)
    }
  }
}
</script>

