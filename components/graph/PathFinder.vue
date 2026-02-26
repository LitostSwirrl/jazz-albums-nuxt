<script setup lang="ts">
import { ref } from 'vue'
import type { Artist } from '~/types'

const props = defineProps<{
  artists: Artist[]
  currentPath: string[] | null
  artistMap: Map<string, Artist>
}>()

const emit = defineEmits<{
  findPath: [startId: string, endId: string]
  clear: []
}>()

const startArtist = ref<Artist | null>(null)
const endArtist = ref<Artist | null>(null)
const isExpanded = ref(false)

function handleFindPath() {
  if (startArtist.value && endArtist.value) {
    emit('findPath', startArtist.value.id, endArtist.value.id)
  }
}

function handleClear() {
  startArtist.value = null
  endArtist.value = null
  emit('clear')
}
</script>

<template>
  <div class="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
    <button
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <span class="font-medium text-amber-400">Find Connection</span>
      <svg
        class="w-5 h-5 text-zinc-400 transition-transform"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div v-if="isExpanded" class="p-4 border-t border-zinc-700 space-y-4">
      <div>
        <label class="block text-sm text-zinc-400 mb-1">From Artist</label>
        <div
          v-if="startArtist"
          class="flex items-center justify-between px-3 py-2 bg-zinc-800 rounded-lg"
        >
          <span class="text-white">{{ startArtist.name }}</span>
          <button
            class="text-zinc-500 hover:text-white"
            @click="startArtist = null"
          >
            <svg
              class="w-4 h-4"
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
        <GraphSearchPanel
          v-else
          :artists="artists"
          placeholder="Select starting artist..."
          @select="startArtist = $event"
        />
      </div>

      <div>
        <label class="block text-sm text-zinc-400 mb-1">To Artist</label>
        <div
          v-if="endArtist"
          class="flex items-center justify-between px-3 py-2 bg-zinc-800 rounded-lg"
        >
          <span class="text-white">{{ endArtist.name }}</span>
          <button
            class="text-zinc-500 hover:text-white"
            @click="endArtist = null"
          >
            <svg
              class="w-4 h-4"
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
        <GraphSearchPanel
          v-else
          :artists="artists"
          placeholder="Select ending artist..."
          @select="endArtist = $event"
        />
      </div>

      <div class="flex gap-2">
        <button
          :disabled="!startArtist || !endArtist"
          class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors font-medium"
          @click="handleFindPath"
        >
          Find Path
        </button>
        <button
          class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
          @click="handleClear"
        >
          Clear
        </button>
      </div>

      <div v-if="currentPath" class="mt-4 p-3 bg-zinc-800 rounded-lg">
        <div class="text-sm text-amber-400 mb-2">
          Connection found! ({{ currentPath.length - 1 }} degree{{
            currentPath.length > 2 ? 's' : ''
          }}
          of separation)
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="(id, index) in currentPath"
            :key="id"
            class="flex items-center"
          >
            <span class="text-white font-medium">{{
              artistMap.get(id)?.name || id
            }}</span>
            <svg
              v-if="index < currentPath.length - 1"
              class="w-4 h-4 mx-1 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>

      <div
        v-if="currentPath === null && startArtist && endArtist"
        class="mt-4 p-3 bg-zinc-800 rounded-lg text-zinc-400"
      >
        No connection found between these artists.
      </div>
    </div>
  </div>
</template>
