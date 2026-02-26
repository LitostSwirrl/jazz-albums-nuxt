<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Artist } from '~/types'

const props = withDefaults(
  defineProps<{
    artists: Artist[]
    placeholder?: string
  }>(),
  {
    placeholder: 'Search artists...',
  },
)

const emit = defineEmits<{
  select: [artist: Artist]
}>()

const query = ref('')
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)

const filteredArtists = computed(() => {
  if (!query.value.trim()) return []
  const lowerQuery = query.value.toLowerCase()
  return props.artists
    .filter(
      (artist) =>
        artist.name.toLowerCase().includes(lowerQuery) ||
        artist.instruments.some((i) => i.toLowerCase().includes(lowerQuery)),
    )
    .slice(0, 8)
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(target) &&
    inputRef.value &&
    !inputRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function handleSelect(artist: Artist) {
  emit('select', artist)
  query.value = ''
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2 pl-10 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        @input="isOpen = true"
        @focus="isOpen = true"
      />
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <div
      v-if="isOpen && filteredArtists.length > 0"
      ref="dropdownRef"
      class="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
    >
      <button
        v-for="artist in filteredArtists"
        :key="artist.id"
        class="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between"
        @click="handleSelect(artist)"
      >
        <div>
          <div class="text-white font-medium">{{ artist.name }}</div>
          <div class="text-xs text-zinc-500">
            {{ artist.instruments.slice(0, 2).join(', ') }}
          </div>
        </div>
        <span class="text-xs text-zinc-600">
          {{ artist.influences.length + artist.influencedBy.length }} connections
        </span>
      </button>
    </div>

    <div
      v-if="isOpen && query && filteredArtists.length === 0"
      class="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 text-center text-zinc-500"
    >
      No artists found
    </div>
  </div>
</template>
