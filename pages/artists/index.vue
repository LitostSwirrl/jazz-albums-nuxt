<script setup lang="ts">
import artistsData from '~/data/artists.json'
import erasData from '~/data/eras.json'
import type { Artist, Era } from '~/types'

const artists = artistsData as Artist[]
const eras = erasData as Era[]

useHead({
  title: 'Jazz Artists',
  meta: [
    {
      name: 'description',
      content:
        'Discover the legends who shaped jazz history. Explore profiles of 45+ influential jazz musicians from Louis Armstrong to Kamasi Washington.',
    },
  ],
})

function getEraColor(eraId: string): string {
  const era = eras.find((e) => e.id === eraId)
  return era?.color || '#888'
}

function getEraShortName(eraId: string): string {
  const era = eras.find((e) => e.id === eraId)
  return era?.name.split(' ')[0] || eraId
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-2">Jazz Artists</h1>
    <p class="text-zinc-400 mb-8">
      Discover the legends who shaped jazz history
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="artist in artists"
        :key="artist.id"
        :to="`/artists/${artist.id}`"
        class="group p-6 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
      >
        <div class="mb-4 group-hover:scale-110 transition-transform">
          <ArtistPhoto
            :image-url="artist.imageUrl"
            :name="artist.name"
            size="lg"
          />
        </div>

        <h2
          class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors"
        >
          {{ artist.name }}
        </h2>

        <p class="text-zinc-500 text-sm mb-3">
          {{ artist.birthYear }}&ndash;{{ artist.deathYear || 'present' }}
        </p>

        <p class="text-zinc-400 text-sm mb-4">
          {{ artist.instruments.join(', ') }}
        </p>

        <div class="flex flex-wrap gap-1">
          <span
            v-for="eraId in artist.eras"
            :key="eraId"
            class="px-2 py-0.5 text-xs rounded"
            :style="{
              backgroundColor: getEraColor(eraId) + '30',
              color: getEraColor(eraId),
            }"
          >
            {{ getEraShortName(eraId) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
