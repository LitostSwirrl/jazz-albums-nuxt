<script setup lang="ts">
import artistsData from '~/data/artists.json'
import albumsData from '~/data/albums.json'
import erasData from '~/data/eras.json'
import type { Artist, Album, Era } from '~/types'

const allArtists = artistsData as Artist[]
const albums = albumsData as Album[]
const eras = erasData as Era[]

const route = useRoute()
const id = route.params.id as string

const artist = computed(() => allArtists.find((a) => a.id === id))

const artistAlbums = computed(() =>
  artist.value ? albums.filter((a) => a.artistId === artist.value!.id) : []
)

const artistEras = computed(() =>
  artist.value
    ? eras.filter((e) => artist.value!.eras.includes(e.id))
    : []
)

const influencedArtists = computed(() =>
  artist.value
    ? allArtists.filter((a) => artist.value!.influences.includes(a.id))
    : []
)

const influencedByArtists = computed(() =>
  artist.value
    ? allArtists.filter((a) => artist.value!.influencedBy.includes(a.id))
    : []
)

useHead({
  title: computed(() =>
    artist.value ? artist.value.name : 'Artist not found'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        artist.value ? artist.value.bio.slice(0, 160) : ''
      ),
    },
  ],
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Not found state -->
    <div v-if="!artist" class="text-center">
      <h1 class="text-2xl font-bold text-red-400">Artist not found</h1>
      <NuxtLink
        to="/artists"
        class="text-amber-400 hover:underline mt-4 inline-block"
      >
        &larr; Back to Artists
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="mb-6">
        <NuxtLink to="/artists" class="text-zinc-500 hover:text-zinc-300">
          Artists
        </NuxtLink>
        <span class="text-zinc-600 mx-2">/</span>
        <span class="text-zinc-300">{{ artist.name }}</span>
      </div>

      <!-- Header -->
      <header class="flex flex-col md:flex-row gap-8 mb-12">
        <ArtistPhoto
          :image-url="artist.imageUrl"
          :name="artist.name"
          size="xl"
          class="flex-shrink-0"
        />
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ artist.name }}</h1>
          <p class="text-xl text-zinc-400 mb-4">
            {{ artist.birthYear }}&ndash;{{ artist.deathYear || 'present' }}
            &middot; {{ artist.instruments.join(', ') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="era in artistEras"
              :key="era.id"
              :to="`/eras/${era.id}`"
              class="px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity"
              :style="{
                backgroundColor: era.color + '30',
                color: era.color,
              }"
            >
              {{ era.name }}
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Biography -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Biography</h2>
        <p class="text-lg text-zinc-300 leading-relaxed">
          {{ artist.bio }}
        </p>
        <a
          v-if="artist.wikipedia"
          :href="artist.wikipedia"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-4 text-amber-400 hover:text-amber-300"
        >
          Read more on Wikipedia &rarr;
        </a>
      </section>

      <!-- Influence Network Visual (placeholder for MiniInfluenceNetwork) -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Influence Network</h2>
          <NuxtLink
            to="/influence"
            class="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
          >
            Explore full network
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </NuxtLink>
        </div>
        <p class="text-zinc-500 text-sm mb-4">
          <template v-if="influencedByArtists.length > 0">
            Influenced by {{ influencedByArtists.length }} artist{{
              influencedByArtists.length > 1 ? 's' : ''
            }}
          </template>
          <template
            v-if="influencedByArtists.length > 0 && influencedArtists.length > 0"
          >
            &middot;
          </template>
          <template v-if="influencedArtists.length > 0">
            Influenced {{ influencedArtists.length }} artist{{
              influencedArtists.length > 1 ? 's' : ''
            }}
          </template>
        </p>
        <GraphMiniInfluenceNetwork
          :artist="artist"
          :all-artists="allArtists"
          :eras="eras"
        />
      </section>

      <!-- Influence Lists -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Influenced By -->
          <div>
            <h3 class="text-lg font-semibold text-zinc-400 mb-4">
              Influenced by
            </h3>
            <div v-if="influencedByArtists.length > 0" class="space-y-2">
              <NuxtLink
                v-for="a in influencedByArtists"
                :key="a.id"
                :to="`/artists/${a.id}`"
                class="block p-3 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <span class="text-white hover:text-amber-400">
                  {{ a.name }}
                </span>
                <span class="text-xs text-zinc-500 ml-2">
                  {{ a.instruments.slice(0, 2).join(', ') }}
                </span>
              </NuxtLink>
            </div>
            <p v-else class="text-zinc-600">No documented influences</p>
          </div>

          <!-- Influenced -->
          <div>
            <h3 class="text-lg font-semibold text-zinc-400 mb-4">
              Influenced
            </h3>
            <div v-if="influencedArtists.length > 0" class="space-y-2">
              <NuxtLink
                v-for="a in influencedArtists"
                :key="a.id"
                :to="`/artists/${a.id}`"
                class="block p-3 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <span class="text-white hover:text-amber-400">
                  {{ a.name }}
                </span>
                <span class="text-xs text-zinc-500 ml-2">
                  {{ a.instruments.slice(0, 2).join(', ') }}
                </span>
              </NuxtLink>
            </div>
            <p v-else class="text-zinc-600">No documented influence</p>
          </div>
        </div>
      </section>

      <!-- Discography -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Key Albums</h2>
        <div
          v-if="artistAlbums.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <NuxtLink
            v-for="album in artistAlbums"
            :key="album.id"
            :to="`/albums/${album.id}`"
            class="group p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
          >
            <div class="mb-3 w-full">
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
            <p class="text-sm text-zinc-500">
              {{ album.year }} &middot; {{ album.label }}
            </p>
          </NuxtLink>
        </div>
        <p v-else class="text-zinc-500">No albums listed yet.</p>
      </section>
    </template>
  </div>
</template>
