<script setup lang="ts">
import albumsData from '~/data/albums.json'
import erasData from '~/data/eras.json'
import type { Album, Era } from '~/types'

const albums = albumsData as Album[]
const eras = erasData as Era[]

const route = useRoute()
const router = useRouter()

useHead({
  title: 'Essential Jazz Albums',
  meta: [
    {
      name: 'description',
      content:
        'Explore 100+ essential jazz albums that define the genre, from bebop classics to contemporary masterpieces. Filter by era, genre, and label.',
    },
  ],
})

const selectedEra = ref<string | null>(
  (route.query.era as string) || null
)
const selectedGenre = ref<string | null>(
  (route.query.genre as string) || null
)
const selectedLabel = ref<string | null>(
  (route.query.label as string) || null
)
const selectedYear = ref<number | null>(
  route.query.year ? parseInt(route.query.year as string) : null
)

// Sync from URL query changes
watch(
  () => route.query,
  (query) => {
    selectedEra.value = (query.era as string) || null
    selectedGenre.value = (query.genre as string) || null
    selectedLabel.value = (query.label as string) || null
    selectedYear.value = query.year ? parseInt(query.year as string) : null
  }
)

function getEra(eraId: string): Era | undefined {
  return eras.find((e) => e.id === eraId)
}

const allGenres = computed(() => {
  const genreSet = new Set<string>()
  albums.forEach((album) => {
    album.genres.forEach((genre) => genreSet.add(genre))
  })
  return Array.from(genreSet).sort()
})

const allLabels = computed(() => {
  const labelSet = new Set<string>()
  albums.forEach((album) => labelSet.add(album.label))
  return Array.from(labelSet).sort()
})

const filteredAlbums = computed(() => {
  let result = [...albums]

  if (selectedGenre.value) {
    result = result.filter((album) =>
      album.genres.some(
        (g) => g.toLowerCase() === selectedGenre.value!.toLowerCase()
      )
    )
  }

  if (selectedEra.value) {
    result = result.filter((album) => album.era === selectedEra.value)
  }

  if (selectedLabel.value) {
    result = result.filter(
      (album) =>
        album.label.toLowerCase() === selectedLabel.value!.toLowerCase()
    )
  }

  if (selectedYear.value) {
    result = result.filter((album) => album.year === selectedYear.value)
  }

  return result.sort((a, b) => a.year - b.year)
})

const hasActiveFilters = computed(
  () =>
    selectedGenre.value ||
    selectedEra.value ||
    selectedLabel.value ||
    selectedYear.value
)

function updateFilter(key: string, value: string | null) {
  const query: Record<string, string> = {}
  const currentQuery = { ...route.query } as Record<string, string>

  if (value) {
    currentQuery[key] = value
  } else {
    delete currentQuery[key]
  }

  for (const [k, v] of Object.entries(currentQuery)) {
    if (v) query[k] = v
  }

  router.push({ query })
}

function clearFilters() {
  router.push({ query: {} })
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Essential Albums</h1>
      <p class="text-zinc-400">
        {{ filteredAlbums.length }} albums
        {{
          hasActiveFilters
            ? 'matching your filters'
            : 'that define jazz history'
        }}
      </p>
    </div>

    <!-- Era Filter -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-zinc-500 mb-2">Filter by Era</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="era in eras"
          :key="era.id"
          class="px-3 py-1.5 text-sm rounded-full border transition-all"
          :class="
            selectedEra === era.id
              ? 'border-transparent text-black font-medium'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          "
          :style="selectedEra === era.id ? { backgroundColor: era.color } : {}"
          @click="updateFilter('era', selectedEra === era.id ? null : era.id)"
        >
          {{ era.name.split(' ')[0] }}
        </button>
      </div>
    </div>

    <!-- Genre Filter -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-zinc-500 mb-2">
        Filter by Genre
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="genre in allGenres"
          :key="genre"
          class="px-3 py-1.5 text-sm rounded-full border transition-all"
          :class="
            selectedGenre?.toLowerCase() === genre.toLowerCase()
              ? 'bg-amber-500 border-amber-500 text-black font-medium'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          "
          @click="
            updateFilter(
              'genre',
              selectedGenre?.toLowerCase() === genre.toLowerCase()
                ? null
                : genre
            )
          "
        >
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Label Filter -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-zinc-500 mb-2">
        Filter by Label
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="label in allLabels.slice(0, 12)"
          :key="label"
          class="px-3 py-1.5 text-sm rounded-full border transition-all"
          :class="
            selectedLabel?.toLowerCase() === label.toLowerCase()
              ? 'bg-cyan-500 border-cyan-500 text-black font-medium'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          "
          @click="
            updateFilter(
              'label',
              selectedLabel?.toLowerCase() === label.toLowerCase()
                ? null
                : label
            )
          "
        >
          {{ label }}
        </button>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="mb-6 flex items-center gap-3">
      <span class="text-sm text-zinc-500">Active filters:</span>
      <span
        v-if="selectedEra"
        class="px-2 py-1 text-xs rounded-full"
        :style="{
          backgroundColor: getEra(selectedEra)?.color + '30',
          color: getEra(selectedEra)?.color,
        }"
      >
        {{ getEra(selectedEra)?.name }}
      </span>
      <span
        v-if="selectedGenre"
        class="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400"
      >
        {{ selectedGenre }}
      </span>
      <span
        v-if="selectedLabel"
        class="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400"
      >
        {{ selectedLabel }}
      </span>
      <span
        v-if="selectedYear"
        class="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400"
      >
        {{ selectedYear }}
      </span>
      <button
        class="text-sm text-zinc-500 hover:text-white underline"
        @click="clearFilters"
      >
        Clear all
      </button>
    </div>

    <!-- Albums Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="album in filteredAlbums"
        :key="album.id"
        :to="`/albums/${album.id}`"
        class="group p-6 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
      >
        <div class="mb-4 group-hover:scale-105 transition-transform">
          <AlbumCover
            :cover-url="album.coverUrl"
            :title="album.title"
            size="md"
          />
        </div>

        <h2
          class="text-lg font-bold text-white group-hover:text-amber-400 transition-colors"
        >
          {{ album.title }}
        </h2>

        <p class="text-zinc-400">{{ album.artist }}</p>

        <div class="flex items-center justify-between mt-3">
          <span class="text-zinc-500">{{ album.year }}</span>
          <span
            v-if="getEra(album.era)"
            class="px-2 py-0.5 text-xs rounded"
            :style="{
              backgroundColor: getEra(album.era)!.color + '30',
              color: getEra(album.era)!.color,
            }"
          >
            {{ getEra(album.era)!.name.split(' ')[0] }}
          </span>
        </div>

        <!-- Genre tags -->
        <div class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="genre in album.genres.slice(0, 2)"
            :key="genre"
            class="text-xs text-zinc-600"
          >
            {{ genre }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAlbums.length === 0" class="text-center py-12">
      <p class="text-zinc-500">No albums match your filters.</p>
      <button
        class="mt-4 text-amber-400 hover:text-amber-300"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
