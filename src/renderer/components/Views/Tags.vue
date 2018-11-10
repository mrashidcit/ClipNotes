<template>
  <transition name="fade">
    <v-chip v-if="!closable">
      {{tag.title}}
    </v-chip>
    <v-chip v-if="closable"
      @click="onClickChip"
      :disabled="state"
      close v-model="chip">
      {{tag.title}}
    </v-chip>
  </transition>
</template>

<script>
import helper from '../../assets/helper.js'

export default {
  name: 'tags',
  props: ['tag', 'closable', 'delegateId'],
  data () {
    return {
      state: helper.isTagFree(this.tag, this.$store.state.notes.filter),
      chip: true
    }
  },
  computed: {
    onChipChange: function () {
      return this.chip
    }
  },
  watch: {
    onChipChange: function (state) {
      if (!state) {
        this.$root.$emit(
          `${this.delegateId}`,
          {
            id: this.tag.id,
            delegateId: this.delegateId
          }
        )
      }
    }
  },
  methods: {
    onClickChip: function () {
      if (this.state) {
        this.$store.dispatch('setState', {
          name: 'snackbar',
          state: true,
          message: `This tag "${this.tag.title}" is in use.`,
          position: 'bottom',
          align: 'right',
          mode: 'multi-line',
          background: 'white',
          color: 'black--text',
          timeout: 4000
        })
      }
    }
  }
}
</script>
