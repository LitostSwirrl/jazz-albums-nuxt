<script setup lang="ts">
import erasData from '~/data/eras.json'
import albumsData from '~/data/albums.json'
import artistsData from '~/data/artists.json'
import type { Era, Album, Artist } from '~/types'

const eras = erasData as Era[]
const albums = albumsData as Album[]
const artists = artistsData as Artist[]

useHead({
  title: 'Your Jazz Library',
  meta: [
    {
      name: 'description',
      content:
        'A curated guide to 100 essential jazz albums from New Orleans to today. Explore jazz history, discover artists, and understand how they shaped each other.',
    },
  ],
})

function getFeaturedAlbums(): Album[] {
  const eraAlbums: Album[] = []
  eras.forEach((era) => {
    const eraAlbum = albums.find((a) => a.era === era.id)
    if (eraAlbum) eraAlbums.push(eraAlbum)
  })
  return eraAlbums.slice(0, 4)
}

function getInfluentialArtists(): Artist[] {
  return artists
    .filter((a) => a.influences.length > 0 || a.influencedBy.length > 0)
    .slice(0, 6)
}

const featuredAlbums = getFeaturedAlbums()
const influentialArtists = getInfluentialArtists()

function getEra(eraId: string): Era | undefined {
  return eras.find((e) => e.id === eraId)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Hero Section -->
    <section class="text-center mb-16">
      <h1
        class="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
      >
        Your Jazz Library
      </h1>
      <p class="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
        A curated guide to jazz history -- from New Orleans to today. Explore albums,
        understand the music, and discover how artists shaped each other.
      </p>
      <div class="flex justify-center gap-4">
        <NuxtLink
          to="/timeline"
          class="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          Start with the Timeline
        </NuxtLink>
        <NuxtLink
          to="/albums"
          class="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors"
        >
          Browse Albums
        </NuxtLink>
      </div>
    </section>

    <!-- Learning Paths -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold mb-6">Where to Begin</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          to="/eras/bebop"
          class="p-6 rounded-xl bg-gradient-to-br from-lime-900/30 to-zinc-900 border border-lime-800/30 hover:border-lime-700/50 transition-all group"
        >
          <h3 class="text-xl font-bold text-lime-400 mb-2">New to Jazz?</h3>
          <p class="text-zinc-400 text-sm">
            Start with Bebop -- the revolutionary sound that made jazz an art form.
            Charlie Parker, Dizzy Gillespie, and the birth of modern jazz.
          </p>
          <span
            class="text-lime-400 text-sm mt-3 inline-block group-hover:underline"
          >
            Explore Bebop &rarr;
          </span>
        </NuxtLink>

        <NuxtLink
          to="/eras/hard-bop"
          class="p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-blue-800/30 hover:border-blue-700/50 transition-all group"
        >
          <h3 class="text-xl font-bold text-blue-400 mb-2">Want Soul &amp; Groove?</h3>
          <p class="text-zinc-400 text-sm">
            Hard Bop brought blues and gospel back into jazz. Art Blakey, Horace
            Silver, and music that swings hard.
          </p>
          <span
            class="text-blue-400 text-sm mt-3 inline-block group-hover:underline"
          >
            Explore Hard Bop &rarr;
          </span>
        </NuxtLink>

        <NuxtLink
          to="/eras/free-jazz"
          class="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 hover:border-purple-700/50 transition-all group"
        >
          <h3 class="text-xl font-bold text-purple-400 mb-2">Ready to Go Deep?</h3>
          <p class="text-zinc-400 text-sm">
            Free Jazz broke all the rules. Ornette Coleman, John Coltrane's later
            work, and pure expression.
          </p>
          <span
            class="text-purple-400 text-sm mt-3 inline-block group-hover:underline"
          >
            Explore Free Jazz &rarr;
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Era Journey -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">The Jazz Journey</h2>
        <NuxtLink
          to="/timeline"
          class="text-amber-400 hover:text-amber-300 text-sm"
        >
          Full Timeline &rarr;
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="era in eras"
          :key="era.id"
          :to="`/eras/${era.id}`"
          class="p-4 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all hover:scale-105"
          :style="{ borderLeftColor: era.color, borderLeftWidth: '4px' }"
        >
          <h3 class="font-semibold text-white">{{ era.name }}</h3>
          <p class="text-sm text-zinc-500">{{ era.period }}</p>
          <p class="text-xs text-zinc-600 mt-2 line-clamp-2">
            {{ era.characteristics.slice(0, 2).join(', ') }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Albums by Era -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">One Album Per Era</h2>
        <NuxtLink
          to="/albums"
          class="text-amber-400 hover:text-amber-300 text-sm"
        >
          View all {{ albums.length }} albums &rarr;
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="album in featuredAlbums"
          :key="album.id"
          :to="`/albums/${album.id}`"
          class="group p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
        >
          <div class="mb-3 group-hover:scale-105 transition-transform">
            <AlbumCover
              :cover-url="album.coverUrl"
              :title="album.title"
              size="md"
            />
          </div>
          <h3
            class="font-semibold text-white group-hover:text-amber-400 transition-colors text-sm"
          >
            {{ album.title }}
          </h3>
          <p class="text-zinc-400 text-sm">{{ album.artist }}</p>
          <span
            v-if="getEra(album.era)"
            class="inline-block mt-2 px-2 py-0.5 text-xs rounded"
            :style="{
              backgroundColor: getEra(album.era)!.color + '20',
              color: getEra(album.era)!.color,
            }"
          >
            {{ getEra(album.era)!.name }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Artist Connections -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">How Artists Connect</h2>
          <p class="text-zinc-500 text-sm">
            Jazz is a conversation across generations
          </p>
        </div>
        <NuxtLink
          to="/influence"
          class="text-amber-400 hover:text-amber-300 text-sm"
        >
          View Influence Map &rarr;
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="artist in influentialArtists"
          :key="artist.id"
          :to="`/artists/${artist.id}`"
          class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all text-center group"
        >
          <div class="mx-auto mb-3">
            <ArtistPhoto
              :image-url="artist.imageUrl"
              :name="artist.name"
              size="lg"
            />
          </div>
          <h3
            class="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors"
          >
            {{ artist.name }}
          </h3>
          <p class="text-xs text-zinc-500 mt-1">
            {{ artist.instruments.slice(0, 1).join(', ') }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- Educational Quote -->
    <section
      class="p-8 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700"
    >
      <blockquote class="text-xl text-zinc-300 italic mb-4">
        "Jazz is not just music, it's a way of life, it's a way of being, a way of
        thinking."
      </blockquote>
      <cite class="text-amber-400">-- Nina Simone</cite>
      <p class="text-zinc-500 text-sm mt-4">
        This guide is your companion to understanding that way of thinking. Each album
        tells a story. Each artist is part of a tradition. Explore, listen, and let
        the music speak.
      </p>
    </section>
  </div>
</template>
