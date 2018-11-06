<template>
  <transition>
  <div class="glass-view"
    v-if="$store.state.config.genericMessage.state">
    <div class="wrapper hero-x-y">
      <v-card width="500" flat color="transparent">
        <v-card-text>
          <p style="padding: 10px;font-size: 18px;">
            {{ $store.state.config.genericMessage.data }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="secondary"
            @click="$store.dispatch('setState', {
              name: 'genericMessage',
              state: false
            })">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
  </transition>
</template>
