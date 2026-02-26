<script setup lang="ts">
import type { Artist } from '~/types'

defineProps<{
  focusArtist: Artist | null
  depth: number
}>()

const emit = defineEmits<{
  depthChange: [depth: number]
  clearFocus: []
}>()
</script>

<template>
  <div
    v-if="focusArtist"
    class="bg-zinc-900 border border-cyan-500/50 rounded-lg p-4"
  >
    <div class="flex items-center justify-between mb-3">
      <div>
        <span class="text-sm text-zinc-400">Focused on: </span>
        <span class="text-cyan-400 font-semibold">{{ focusArtist.name }}</span>
      </div>
      <button
        class="text-zinc-500 hover:text-white transition-colors"
        title="Clear focus"
        @click="emit('clearFocus')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-sm text-zinc-400">Network depth:</span>
      <div class="flex gap-1">
        <button
          v-for="d in [1, 2, 3]"
          :key="d"
          class="px-3 py-1 rounded text-sm font-medium transition-colors"
          :class="
            depth === d
              ? 'bg-cyan-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          "
          @click="emit('depthChange', d)"
        >
          {{ d }}-hop
        </button>
      </div>
    </div>

    <div class="mt-2 text-xs text-zinc-500">
      Showing artists within {{ depth }} step{{ depth > 1 ? 's' : '' }} of
      {{ focusArtist.name }}
    </div>
  </div>
</template>
