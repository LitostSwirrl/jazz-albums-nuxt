<script setup lang="ts">
import type { Album } from '~/types'
import { getRelatedAlbums } from '~/utils/discovery'

const props = defineProps<{
  currentAlbum: Album
  allAlbums: Album[]
}>()

const related = computed(() => getRelatedAlbums(props.currentAlbum, props.allAlbums, 4))

const sections = computed(() =>
  [
    { title: `More from ${props.currentAlbum.artist}`, albums: related.value.artist },
    {
      title: `More ${props.currentAlbum.genres[0] || 'Jazz'}`,
      albums: related.value.genre,
    },
    { title: `More from ${props.currentAlbum.label}`, albums: related.value.label },
    { title: `Albums from ${props.currentAlbum.year}`, albums: related.value.year },
  ].filter((section) => section.albums.length > 0),
)
</script>

<template>
  <div v-if="sections.length > 0" class="space-y-8">
    <div v-for="section in sections.slice(0, 2)" :key="section.title">
      <h3 class="text-lg font-semibold text-zinc-300 mb-4">{{ section.title }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="album in section.albums.slice(0, 4)"
          :key="album.id"
          :to="`/albums/${album.id}`"
          class="group"
        >
          <div class="mb-2 group-hover:scale-105 transition-transform">
            <AlbumCover :cover-url="album.coverUrl" :title="album.title" size="sm" />
          </div>
          <h4
            class="text-sm font-medium text-white group-hover:text-amber-400 transition-colors truncate"
          >
            {{ album.title }}
          </h4>
          <p class="text-xs text-zinc-500 truncate">{{ album.artist }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
