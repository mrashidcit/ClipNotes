<template>
  <v-dialog v-model="state" persistent
    width="500" height="200">
    <v-card color="normal">
      <v-card-text style="text-align: center;">
        <img width="auto" height="100px"
          style="display: block; margin: auto;padding: 10px;"
          src="../../assets/briefnote-hero.png">
        <p style="margin: 10px 0;font-size: 18px;text-decoration: underline;cursor: pointer;"
          @click="openLink('https://github.com/xplorebits/briefnote')"
          class="primary--text">
          briefnote
        </p>
        <p style="margin: 10px 0;font-size: 15px;">
          Version 0.0.1 (Beta)
        </p>
        <p style="margin: 10px 0;font-size: 11px;">
          Copyright &copy; 2018 XploreBits Technologies.
          <br/>All rights reserved.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed small
          @click="onClickClose"
          color="secondary">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const { shell } = require('electron')

export default {
  name: 'about',
  props: [
    'state'
  ],
  methods: {
    openLink (_link) {
      if (_link) {
        shell.openExternal(_link)
      }
    },
    onClickClose () {
      this.$root.$emit('closeDialog', {
        name: 'about'
      })
    }
  }
}
</script>

<style scoped>
</style>
