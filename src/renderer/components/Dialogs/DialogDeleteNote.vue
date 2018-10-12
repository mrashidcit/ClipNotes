<template>
  <v-dialog id="id-generic-yes-no" v-model="state"
    fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <div class="hero">
        <v-card color="transparent" flat
          width="550" height="200"
          v-if="state">
          <v-card-title>
            <h1>Deleting Note</h1>
            <p style="font-size: 22px;"> You are about to delete "{{briefnote.title}}" note. <b> Are you sure about this? </b> </p>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="grey"
              @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn depressed color="red"
              @click="confirmDelete"
              class="white--text">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'dialog-delete-note',
  props: [
    'state',
    'briefnote'
  ],
  methods: {
    closeDialog () {
      this.$root.$emit('closeDialogDeleteNote')
    },
    confirmDelete () {
      this.$root.$emit('deleteNote', this.briefnote)
    }
  }
}
</script>

<style scoped>
  .view-card {
    background-color: rgba(255, 255, 255, 0.7);
    height: 100vh;
  }
</style>
