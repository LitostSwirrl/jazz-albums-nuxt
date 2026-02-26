<script setup lang="ts">
import erasData from '~/data/eras.json'
import artistsData from '~/data/artists.json'
import albumsData from '~/data/albums.json'
import type { Era, Artist, Album } from '~/types'

const eras = erasData as Era[]
const artists = artistsData as Artist[]
const albums = albumsData as Album[]

const route = useRoute()
const id = route.params.id as string

const era = computed(() => eras.find((e) => e.id === id))
const eraArtists = computed(() =>
  era.value ? artists.filter((a) => a.eras.includes(era.value!.id)) : []
)
const eraAlbums = computed(() =>
  era.value ? albums.filter((a) => a.era === era.value!.id) : []
)

useHead({
  title: computed(() =>
    era.value ? `${era.value.name} Era (${era.value.period})` : 'Era not found'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        era.value ? era.value.description.slice(0, 160) : ''
      ),
    },
  ],
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Not found state -->
    <div v-if="!era" class="text-center">
      <h1 class="text-2xl font-bold text-red-400">Era not found</h1>
      <NuxtLink
        to="/eras"
        class="text-amber-400 hover:underline mt-4 inline-block"
      >
        &larr; Back to Eras
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="mb-6">
        <NuxtLink to="/eras" class="text-zinc-500 hover:text-zinc-300">
          Eras
        </NuxtLink>
        <span class="text-zinc-600 mx-2">/</span>
        <span class="text-zinc-300">{{ era.name }}</span>
      </div>

      <!-- Header -->
      <header
        class="p-8 rounded-lg mb-8"
        :style="{
          backgroundColor: era.color + '20',
          borderLeft: `4px solid ${era.color}`,
        }"
      >
        <h1 class="text-4xl font-bold mb-2">{{ era.name }}</h1>
        <p class="text-xl text-zinc-400 font-mono">{{ era.period }}</p>
      </header>

      <!-- Description -->
      <section class="mb-12">
        <p class="text-lg text-zinc-300 leading-relaxed">
          {{ era.description }}
        </p>
      </section>

      <!-- Characteristics -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Characteristics</h2>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="char in era.characteristics"
            :key="char"
            class="px-4 py-2 rounded-full text-sm"
            :style="{
              backgroundColor: era.color + '30',
              color: era.color,
            }"
          >
            {{ char }}
          </span>
        </div>
      </section>

      <!-- Key Artists -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Key Artists</h2>
        <div
          v-if="eraArtists.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <NuxtLink
            v-for="artist in eraArtists"
            :key="artist.id"
            :to="`/artists/${artist.id}`"
            class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group"
          >
            <h3
              class="font-semibold text-white group-hover:text-amber-400 transition-colors"
            >
              {{ artist.name }}
            </h3>
            <p class="text-sm text-zinc-500">
              {{ artist.instruments.join(', ') }}
            </p>
          </NuxtLink>
        </div>
        <p v-else class="text-zinc-500">
          No artists listed yet for this era.
        </p>
      </section>

      <!-- Albums from this Era -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Essential Albums</h2>
        <div
          v-if="eraAlbums.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <NuxtLink
            v-for="album in eraAlbums"
            :key="album.id"
            :to="`/albums/${album.id}`"
            class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group"
          >
            <div class="mb-3 group-hover:scale-105 transition-transform">
              <AlbumCover
                :cover-url="album.coverUrl"
                :title="album.title"
                size="sm"
              />
            </div>
            <h3
              class="font-semibold text-white group-hover:text-amber-400 transition-colors"
            >
              {{ album.title }}
            </h3>
            <p class="text-zinc-400">{{ album.artist }}</p>
            <p class="text-sm text-zinc-500">{{ album.year }}</p>
          </NuxtLink>
        </div>
        <p v-else class="text-zinc-500">
          No albums listed yet for this era.
        </p>
      </section>
    </template>
  </div>
</template>
