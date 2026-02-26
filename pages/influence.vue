<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { Handle, Position } from '@vue-flow/core'
import artistsData from '~/data/artists.json'
import albumsData from '~/data/albums.json'
import erasData from '~/data/eras.json'
import type { Artist, Era, Album } from '~/types'
import {
  useInfluenceGraph,
  findShortestPath,
  eraColors,
} from '~/composables/useInfluenceGraph'
import { useGraphLayout } from '~/composables/useGraphLayout'

const artists = artistsData as Artist[]
const albums = albumsData as Album[]
const eras = erasData as Era[]

useHead({
  title: 'Artist Influence Network',
  meta: [
    {
      name: 'description',
      content:
        'Explore how jazz musicians influenced each other across generations. Discover connections between artists and trace the evolution of jazz.',
    },
  ],
})

// Focus state
const focusArtist = ref<Artist | null>(null)
const focusDepth = ref(2)

// Path finding state
const currentPath = ref<string[] | null>(undefined as unknown as string[] | null)
const pathSearched = ref(false)

// Era filter state - default to bebop
const eraFilter = ref<string | null>('bebop')

// Genre filter state
const genreFilter = ref<string | null>(null)

// Instructions visibility
const showInstructions = ref(true)

// Get graph data with filters
const filter = computed(() => ({
  focusArtistId: focusArtist.value?.id,
  depth: focusArtist.value ? focusDepth.value : undefined,
  eraFilter: eraFilter.value || undefined,
  genreFilter: genreFilter.value || undefined,
}))

const graphData = computed(() => {
  const result = useInfluenceGraph(artists, eras, albums, filter.value)
  return result.value
})

// Apply dagre layout
const layoutData = computed(() => {
  const result = useGraphLayout(graphData.value.nodes, graphData.value.edges)
  return result.value
})

// Apply path highlighting
const pathSet = computed(() => {
  if (!currentPath.value || currentPath.value.length < 2) return new Set<string>()
  const set = new Set<string>()
  for (let i = 0; i < currentPath.value.length - 1; i++) {
    set.add(`${currentPath.value[i]}->${currentPath.value[i + 1]}`)
    set.add(`${currentPath.value[i + 1]}->${currentPath.value[i]}`)
  }
  return set
})

const enhancedNodes = computed(() => {
  const lnodes = layoutData.value.nodes
  if (!currentPath.value) return lnodes
  const pathNodeSet = new Set(currentPath.value)
  return lnodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isPathNode: pathNodeSet.has(node.id),
      dimmed: currentPath.value!.length > 0 && !pathNodeSet.has(node.id),
    },
  }))
})

const enhancedEdges = computed(() => {
  return layoutData.value.edges.map((edge) => {
    const isPathEdge =
      pathSet.value.has(edge.id) ||
      pathSet.value.has(`${edge.target}->${edge.source}`)
    return {
      ...edge,
      style: {
        stroke: isPathEdge ? '#fbbf24' : '#f59e0b',
        strokeWidth: isPathEdge ? 4 : 2,
        opacity: 1,
      },
      animated: isPathEdge,
    }
  })
})

// Handle search selection
function handleSearchSelect(artist: Artist) {
  const node = enhancedNodes.value.find((n) => n.id === artist.id)
  if (node) {
    // Use the vue-flow instance from the component
    const vfInstance = document.querySelector('.vue-flow')
    if (vfInstance) {
      // Simple scroll to center approach
    }
  }
}

// Handle focus on artist
function handleFocusArtist(artist: Artist) {
  focusArtist.value = artist
  currentPath.value = null
  pathSearched.value = false
}

// Handle path finding
function handleFindPath(startId: string, endId: string) {
  const path = findShortestPath(startId, endId, graphData.value.artistMap)
  currentPath.value = path
  pathSearched.value = true
}

function handleClearPath() {
  currentPath.value = null
  pathSearched.value = false
}

function handleClearFocus() {
  focusArtist.value = null
}

// Node click handler
function onNodeClick({ node }: { node: { id: string } }) {
  // Highlight connections
}

const genres = [
  'modal jazz',
  'hard bop',
  'bebop',
  'free jazz',
  'fusion',
  'cool jazz',
  'soul jazz',
  'post-bop',
  'avant-garde',
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-4xl font-bold mb-2">Artist Influence Network</h1>
      <p class="text-zinc-400 mb-4">
        Explore how jazz musicians influenced each other across generations. Search
        for an artist, find connections between two musicians, or click to explore.
      </p>

      <!-- Getting Started Panel -->
      <div
        v-if="showInstructions"
        class="mb-4 p-4 rounded-lg bg-gradient-to-r from-amber-900/20 to-zinc-900 border border-amber-500/30"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-amber-400">Getting Started</h3>
          <button
            class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            @click="showInstructions = false"
          >
            Hide
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0"
            >
              <span class="text-amber-400 font-bold text-sm">1</span>
            </div>
            <div>
              <p class="text-white font-medium text-sm">Choose an Era</p>
              <p class="text-xs text-zinc-400">
                Filter by jazz period (starts with Bebop)
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0"
            >
              <span class="text-amber-400 font-bold text-sm">2</span>
            </div>
            <div>
              <p class="text-white font-medium text-sm">Click Any Artist</p>
              <p class="text-xs text-zinc-400">Highlight their connections</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0"
            >
              <span class="text-amber-400 font-bold text-sm">3</span>
            </div>
            <div>
              <p class="text-white font-medium text-sm">Find Connections</p>
              <p class="text-xs text-zinc-400">
                Trace paths between two musicians
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0"
            >
              <span class="text-amber-400 font-bold text-sm">4</span>
            </div>
            <div>
              <p class="text-white font-medium text-sm">Explore Freely</p>
              <p class="text-xs text-zinc-400">Drag to pan, scroll to zoom</p>
            </div>
          </div>
        </div>
        <p class="mt-3 text-xs text-zinc-500">
          Tip: Arrows flow from <em>influencer</em> to <em>influenced</em>. Click
          "All Eras" to see the full network.
        </p>
      </div>
      <button
        v-if="!showInstructions"
        class="mb-4 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        @click="showInstructions = true"
      >
        Show instructions
      </button>
    </div>

    <!-- Controls Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm text-zinc-400 mb-2">Search &amp; Center</label>
        <GraphSearchPanel
          :artists="artists"
          placeholder="Search artist to center view..."
          @select="handleSearchSelect"
        />
      </div>

      <div>
        <label class="block text-sm text-zinc-400 mb-2">Filter by Era</label>
        <div class="flex flex-wrap gap-2">
          <button
            class="px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="
              !eraFilter
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            "
            @click="eraFilter = null"
          >
            All Eras
          </button>
          <button
            v-for="era in eras"
            :key="era.id"
            class="px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="
              eraFilter === era.id
                ? 'text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            "
            :style="
              eraFilter === era.id ? { backgroundColor: eraColors[era.id] } : {}
            "
            @click="eraFilter = eraFilter === era.id ? null : era.id"
          >
            {{ era.name.split(' ')[0] }}
          </button>
        </div>
      </div>
    </div>

    <!-- Genre/Style Filter -->
    <div class="mb-6">
      <label class="block text-sm text-zinc-400 mb-2">Filter by Style</label>
      <div class="flex flex-wrap gap-2">
        <button
          class="px-3 py-1.5 rounded-full text-sm transition-colors"
          :class="
            !genreFilter
              ? 'bg-amber-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          "
          @click="genreFilter = null"
        >
          All Styles
        </button>
        <button
          v-for="genre in genres"
          :key="genre"
          class="px-3 py-1.5 rounded-full text-sm transition-colors capitalize"
          :class="
            genreFilter === genre
              ? 'bg-amber-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          "
          @click="genreFilter = genreFilter === genre ? null : genre"
        >
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Focus Controls -->
    <div class="mb-4">
      <GraphFocusControls
        :focus-artist="focusArtist"
        :depth="focusDepth"
        @depth-change="focusDepth = $event"
        @clear-focus="handleClearFocus"
      />
    </div>

    <!-- Path Finder -->
    <div class="mb-6">
      <GraphPathFinder
        :artists="artists"
        :current-path="
          pathSearched
            ? currentPath
            : (undefined as unknown as string[] | null)
        "
        :artist-map="graphData.artistMap"
        @find-path="handleFindPath"
        @clear="handleClearPath"
      />
    </div>

    <!-- Era Legend -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        v-for="era in eras"
        :key="era.id"
        class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        @click="
          () => {
            const a = artists.find((a) => a.eras[0] === era.id)
            if (a) handleFocusArtist(a)
          }
        "
      >
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: eraColors[era.id] }"
        />
        <span class="text-sm text-zinc-400">{{ era.name }}</span>
      </button>
    </div>

    <!-- Graph Container -->
    <div
      class="h-[600px] rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950"
    >
      <VueFlow
        :nodes="enhancedNodes"
        :edges="enhancedEdges"
        :default-edge-options="{
          type: 'smoothstep',
          style: { stroke: '#f59e0b', strokeWidth: 2 },
          animated: false,
        }"
        fit-view-on-init
        :min-zoom="0.2"
        :max-zoom="2"
        :edges-updatable="false"
        @node-click="onNodeClick"
      >
        <template #node-artist="nodeProps">
          <GraphArtistNode
            :data="nodeProps.data"
            :selected="nodeProps.selected"
          />
        </template>
        <Controls class="bg-zinc-900 border-zinc-700" />
      </VueFlow>
    </div>

    <!-- Stats -->
    <div class="mt-4 flex items-center gap-6 text-sm text-zinc-500">
      <span>Showing {{ enhancedNodes.length }} artists</span>
      <span>{{ enhancedEdges.length }} connections</span>
      <span v-if="focusArtist">Focused on {{ focusArtist.name }}</span>
    </div>

    <!-- Instructions -->
    <div class="mt-6 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
      <h3 class="font-semibold text-amber-400 mb-2">How to Explore</h3>
      <ul class="text-sm text-zinc-400 space-y-1">
        <li>
          <strong>Search</strong> - Find an artist and center the view on them
        </li>
        <li>
          <strong>Find Connection</strong> - Discover how two artists are linked
        </li>
        <li>
          <strong>Click artist</strong> - Highlight their direct connections
        </li>
        <li>
          <strong>Click artist name</strong> - Visit their full profile
        </li>
        <li><strong>Drag/Scroll</strong> - Pan and zoom the graph</li>
        <li>
          Arrows flow from <em>influencer</em> to <em>influenced</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
</style>
