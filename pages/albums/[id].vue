<script setup lang="ts">
import albumsData from '~/data/albums.json'
import artistsData from '~/data/artists.json'
import erasData from '~/data/eras.json'
import type { Album, Artist, Era } from '~/types'

const allAlbums = albumsData as Album[]
const artists = artistsData as Artist[]
const eras = erasData as Era[]

const route = useRoute()
const id = route.params.id as string

const album = computed(() => allAlbums.find((a) => a.id === id))
const artist = computed(() =>
  album.value ? artists.find((a) => a.id === album.value!.artistId) : undefined
)
const era = computed(() =>
  album.value ? eras.find((e) => e.id === album.value!.era) : undefined
)

const relatedAlbums = computed(() => {
  if (!album.value) return []
  return allAlbums
    .filter(
      (a) =>
        a.id !== album.value!.id &&
        (a.era === album.value!.era || a.artistId === album.value!.artistId)
    )
    .slice(0, 4)
})

useHead({
  title: computed(() =>
    album.value
      ? `${album.value.title} by ${album.value.artist}`
      : 'Album not found'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        album.value ? album.value.description.slice(0, 160) : ''
      ),
    },
  ],
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Not found state -->
    <div v-if="!album" class="text-center">
      <h1 class="text-2xl font-bold text-red-400">Album not found</h1>
      <NuxtLink
        to="/albums"
        class="text-amber-400 hover:underline mt-4 inline-block"
      >
        &larr; Back to Albums
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="mb-6">
        <NuxtLink to="/albums" class="text-zinc-500 hover:text-zinc-300">
          Albums
        </NuxtLink>
        <span class="text-zinc-600 mx-2">/</span>
        <span class="text-zinc-300">{{ album.title }}</span>
      </div>

      <!-- Header -->
      <header class="flex flex-col md:flex-row gap-8 mb-12">
        <div class="flex-shrink-0">
          <AlbumCover
            :cover-url="album.coverUrl"
            :title="album.title"
            size="lg"
          />
        </div>
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ album.title }}</h1>
          <NuxtLink
            :to="`/artists/${album.artistId}`"
            class="text-2xl text-amber-400 hover:text-amber-300 transition-colors"
          >
            {{ album.artist }}
          </NuxtLink>

          <div
            class="flex flex-wrap items-center gap-4 mt-4 text-zinc-400"
          >
            <NuxtLink
              :to="`/albums?year=${album.year}`"
              class="hover:text-amber-400 transition-colors"
            >
              {{ album.year }}
            </NuxtLink>
            <span>&middot;</span>
            <NuxtLink
              :to="`/albums?label=${encodeURIComponent(album.label)}`"
              class="hover:text-amber-400 transition-colors"
            >
              {{ album.label }}
            </NuxtLink>
            <template v-if="era">
              <span>&middot;</span>
              <NuxtLink
                :to="`/eras/${era.id}`"
                class="px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity"
                :style="{
                  backgroundColor: era.color + '30',
                  color: era.color,
                }"
              >
                {{ era.name }}
              </NuxtLink>
            </template>
          </div>

          <div class="flex flex-wrap gap-2 mt-4">
            <NuxtLink
              v-for="genre in album.genres"
              :key="genre"
              :to="`/albums?genre=${encodeURIComponent(genre)}`"
              class="px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
            >
              {{ genre }}
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Description -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">About This Album</h2>
        <p class="text-lg text-zinc-300 leading-relaxed mb-6">
          {{ album.description }}
        </p>

        <h3 class="text-xl font-semibold mb-3 text-amber-400">
          Why It Matters
        </h3>
        <p class="text-zinc-300 leading-relaxed">
          {{ album.significance }}
        </p>
      </section>

      <!-- Critics Reviews -->
      <section
        v-if="album.reviews && album.reviews.length > 0"
        class="mb-12"
      >
        <h2 class="text-2xl font-bold mb-4">What Critics Said</h2>
        <div class="space-y-4">
          <blockquote
            v-for="(review, index) in album.reviews"
            :key="index"
            class="p-4 rounded-lg bg-zinc-900 border-l-4 border-amber-500"
          >
            <p class="text-zinc-300 italic mb-2">
              "{{ review.quote }}"
            </p>
            <footer class="text-sm text-zinc-500">
              &mdash;
              <template v-if="review.author">{{ review.author }}, </template>
              <a
                v-if="review.url"
                :href="review.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-amber-400 hover:underline"
              >
                {{ review.source }}
              </a>
              <span v-else>{{ review.source }}</span>
              <span v-if="review.rating" class="ml-2 text-amber-400">
                ({{ review.rating }}/5)
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      <!-- Key Tracks -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Key Tracks</h2>
        <ul class="space-y-2">
          <li
            v-for="(track, index) in album.keyTracks"
            :key="track"
            class="flex items-center gap-4 p-3 rounded bg-zinc-900 border border-zinc-800"
          >
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 text-sm"
            >
              {{ index + 1 }}
            </span>
            <span class="text-white">{{ track }}</span>
          </li>
        </ul>
      </section>

      <!-- Listen & Learn More -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Listen &amp; Learn More</h2>

        <!-- Streaming Links -->
        <div
          v-if="album.spotifyUrl || album.youtubeUrl"
          class="flex flex-wrap gap-4 mb-4"
        >
          <a
            v-if="album.spotifyUrl"
            :href="album.spotifyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] text-black font-medium hover:bg-[#1ed760] transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
            Listen on Spotify
          </a>
          <a
            v-if="album.youtubeUrl"
            :href="album.youtubeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF0000] text-white font-medium hover:bg-[#cc0000] transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
            Watch on YouTube
          </a>
        </div>

        <!-- Reference Links -->
        <div class="flex flex-wrap gap-4">
          <a
            v-if="album.discogs"
            :href="album.discogs"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            View on Discogs &rarr;
          </a>
          <a
            v-if="album.allMusic"
            :href="album.allMusic"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            View on AllMusic &rarr;
          </a>
        </div>
      </section>

      <!-- Artist info -->
      <section
        v-if="artist"
        class="mb-12 p-6 rounded-lg bg-zinc-900 border border-zinc-800"
      >
        <h2 class="text-xl font-bold mb-4">About the Artist</h2>
        <NuxtLink
          :to="`/artists/${artist.id}`"
          class="flex items-center gap-4 group"
        >
          <ArtistPhoto
            :image-url="artist.imageUrl"
            :name="artist.name"
            size="lg"
          />
          <div>
            <h3
              class="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors"
            >
              {{ artist.name }}
            </h3>
            <p class="text-zinc-500">
              {{ artist.instruments.join(', ') }}
            </p>
          </div>
        </NuxtLink>
      </section>

      <!-- Related Albums -->
      <section v-if="relatedAlbums.length > 0">
        <h2 class="text-2xl font-bold mb-6">Discover More</h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <NuxtLink
            v-for="related in relatedAlbums"
            :key="related.id"
            :to="`/albums/${related.id}`"
            class="group p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
          >
            <div class="mb-3 group-hover:scale-105 transition-transform">
              <AlbumCover
                :cover-url="related.coverUrl"
                :title="related.title"
                size="sm"
              />
            </div>
            <h3
              class="font-semibold text-white group-hover:text-amber-400 transition-colors text-sm"
            >
              {{ related.title }}
            </h3>
            <p class="text-zinc-400 text-sm">{{ related.artist }}</p>
            <p class="text-xs text-zinc-500">{{ related.year }}</p>
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>
