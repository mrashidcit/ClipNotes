<template>
  <transition>
    <div class="glass-view"
      v-if="$store.state.config.actionDialog.state">
        <div class="hero-x-y">
          <v-card width="500" flat color="transparent">
            <v-card-text>
              <h1>{{ $store.state.config.actionDialog.title }}</h1>
              <p style="padding: 10px 0;font-size: 18px;">
                {{ $store.state.config.actionDialog.message }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn depressed color="secondary"
                @click="$store.state.config.actionDialog.nCallback">
                {{ $store.state.config.actionDialog.nLabel || 'No' }}
              </v-btn>
              <v-btn depressed color="red" class="white--text"
                @click="$store.state.config.actionDialog.pCallback">
                {{ $store.state.config.actionDialog.pLabel || 'Yes' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
    </div>
  </transition>
</template>
