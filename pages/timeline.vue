<script setup lang="ts">
import erasData from '~/data/eras.json'
import albumsData from '~/data/albums.json'
import artistsData from '~/data/artists.json'
import type { Era, Album, Artist, EraId } from '~/types'

const eras = erasData as Era[]
const albums = albumsData as Album[]
const artists = artistsData as Artist[]

useHead({
  title: 'Jazz Timeline',
  meta: [
    {
      name: 'description',
      content:
        'Explore 100+ years of jazz evolution from New Orleans to the present day. Discover how each era built on what came before while pushing music into new territory.',
    },
  ],
})

const eraColors: Record<string, string> = {
  'early-jazz': '#f59e0b',
  swing: '#eab308',
  bebop: '#84cc16',
  'cool-jazz': '#22d3ee',
  'hard-bop': '#3b82f6',
  'free-jazz': '#a855f7',
  fusion: '#ec4899',
  contemporary: '#f43f5e',
}

function getEraStats(eraId: EraId) {
  const eraAlbums = albums.filter((a) => a.era === eraId)
  return { albumCount: eraAlbums.length }
}

function getKeyArtists(eraId: EraId): Artist[] {
  return artists.filter((a) => a.eras.includes(eraId)).slice(0, 5)
}

function getKeyAlbums(eraId: EraId): Album[] {
  return albums.filter((a) => a.era === eraId).slice(0, 3)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold mb-4">Jazz Through Time</h1>
      <p class="text-xl text-zinc-400 max-w-2xl mx-auto">
        From New Orleans to the present day, explore 100+ years of jazz
        evolution. Each era built on what came before while pushing music into
        new territory.
      </p>
    </div>

    <!-- Visual Timeline -->
    <div class="relative">
      <!-- Center line -->
      <div
        class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-purple-500 to-rose-500 transform -translate-x-1/2 hidden md:block"
      />

      <div
        v-for="(era, index) in eras"
        :key="era.id"
        class="relative mb-12 md:mb-16"
        :class="index % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'"
      >
        <!-- Timeline dot -->
        <div
          class="hidden md:block absolute left-1/2 top-8 w-6 h-6 rounded-full border-4 transform -translate-x-1/2 z-10"
          :style="{
            backgroundColor: eraColors[era.id],
            borderColor: '#18181b',
          }"
        />

        <!-- Era card -->
        <div
          class="p-6 rounded-xl border-2 bg-zinc-900/80 backdrop-blur transition-all hover:scale-[1.02]"
          :style="{ borderColor: eraColors[era.id] }"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <NuxtLink
                :to="`/eras/${era.id}`"
                class="text-2xl font-bold hover:underline"
                :style="{ color: eraColors[era.id] }"
              >
                {{ era.name }}
              </NuxtLink>
              <div class="text-zinc-500 font-mono text-sm mt-1">
                {{ era.period }}
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-2xl font-bold"
                :style="{ color: eraColors[era.id] }"
              >
                {{ getEraStats(era.id).albumCount }}
              </div>
              <div class="text-xs text-zinc-500">albums</div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-zinc-300 mb-4 leading-relaxed">
            {{ era.description }}
          </p>

          <!-- Characteristics -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="char in era.characteristics.slice(0, 4)"
              :key="char"
              class="px-2 py-1 text-xs rounded-full"
              :style="{
                backgroundColor: eraColors[era.id] + '20',
                color: eraColors[era.id],
              }"
            >
              {{ char }}
            </span>
          </div>

          <!-- Key Artists -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-zinc-400 mb-2">
              Key Artists
            </h4>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="artist in getKeyArtists(era.id)"
                :key="artist.id"
                :to="`/artists/${artist.id}`"
                class="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {{ artist.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Key Albums -->
          <div>
            <h4 class="text-sm font-semibold text-zinc-400 mb-2">
              Essential Albums
            </h4>
            <div class="space-y-2">
              <NuxtLink
                v-for="album in getKeyAlbums(era.id)"
                :key="album.id"
                :to="`/albums/${album.id}`"
                class="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
              >
                <div class="w-10 h-10 flex-shrink-0">
                  <AlbumCover
                    :cover-url="album.coverUrl"
                    :title="album.title"
                    size="sm"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-white group-hover:text-amber-400 truncate transition-colors"
                  >
                    {{ album.title }}
                  </div>
                  <div class="text-xs text-zinc-500 truncate">
                    {{ album.artist }} &middot; {{ album.year }}
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Explore Link -->
          <NuxtLink
            :to="`/eras/${era.id}`"
            class="inline-flex items-center gap-1 mt-4 text-sm font-medium hover:underline"
            :style="{ color: eraColors[era.id] }"
          >
            Explore {{ era.name }} &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Era Connections -->
    <div
      class="mt-16 p-8 rounded-xl bg-zinc-900 border border-zinc-800"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">How Eras Connect</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-lg bg-zinc-800/50">
          <div class="text-amber-400 font-semibold mb-2">
            Early Jazz &rarr; Swing
          </div>
          <p class="text-sm text-zinc-400">
            New Orleans pioneers created the vocabulary; big bands scaled it up
            for dance halls.
          </p>
        </div>
        <div class="p-4 rounded-lg bg-zinc-800/50">
          <div class="text-green-400 font-semibold mb-2">
            Swing &rarr; Bebop
          </div>
          <p class="text-sm text-zinc-400">
            Young rebels turned dance music into art music, emphasizing
            virtuosity and complexity.
          </p>
        </div>
        <div class="p-4 rounded-lg bg-zinc-800/50">
          <div class="text-cyan-400 font-semibold mb-2">
            Bebop &rarr; Cool/Hard Bop
          </div>
          <p class="text-sm text-zinc-400">
            Two paths diverged: West Coast cool sophistication vs. East Coast
            blues-drenched intensity.
          </p>
        </div>
        <div class="p-4 rounded-lg bg-zinc-800/50">
          <div class="text-purple-400 font-semibold mb-2">
            Hard Bop &rarr; Free Jazz
          </div>
          <p class="text-sm text-zinc-400">
            The ultimate rebellion: abandoning chord changes entirely for pure
            expression.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-12 flex justify-center gap-4">
      <NuxtLink
        to="/influence"
        class="px-6 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
      >
        View Influence Network &rarr;
      </NuxtLink>
      <NuxtLink
        to="/albums"
        class="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors"
      >
        Browse All Albums
      </NuxtLink>
    </div>
  </div>
</template>
