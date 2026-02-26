<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow, Handle, Position } from '@vue-flow/core'
import type { Artist, Era } from '~/types'
import { eraColors } from '~/composables/useInfluenceGraph'

const props = defineProps<{
  artist: Artist
  allArtists: Artist[]
  eras: Era[]
}>()

const artistMap = computed(() => new Map(props.allArtists.map((a) => [a.id, a])))
const eraMap = computed(() => new Map(props.eras.map((e) => [e.id, e])))

const graphData = computed(() => {
  const influencers = props.artist.influencedBy
    .map((id) => artistMap.value.get(id))
    .filter((a): a is Artist => !!a)
    .slice(0, 5)

  const influenced = props.artist.influences
    .map((id) => artistMap.value.get(id))
    .filter((a): a is Artist => !!a)
    .slice(0, 5)

  const centerX = 150
  const centerY = 100

  const nodes = [
    {
      id: props.artist.id,
      type: 'miniArtist',
      position: { x: centerX, y: centerY },
      data: {
        artist: props.artist,
        era: eraMap.value.get(props.artist.eras[0]),
        isCenter: true,
      },
    },
  ]

  influencers.forEach((inf, i) => {
    const offset = (i - (influencers.length - 1) / 2) * 90
    nodes.push({
      id: inf.id,
      type: 'miniArtist',
      position: { x: centerX + offset, y: 20 },
      data: {
        artist: inf,
        era: eraMap.value.get(inf.eras[0]),
        isCenter: false,
      },
    })
  })

  influenced.forEach((inf, i) => {
    const offset = (i - (influenced.length - 1) / 2) * 90
    nodes.push({
      id: inf.id,
      type: 'miniArtist',
      position: { x: centerX + offset, y: 180 },
      data: {
        artist: inf,
        era: eraMap.value.get(inf.eras[0]),
        isCenter: false,
      },
    })
  })

  const edges = [
    ...influencers.map((inf) => ({
      id: `${inf.id}->${props.artist.id}`,
      source: inf.id,
      target: props.artist.id,
      type: 'smoothstep',
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      animated: true,
    })),
    ...influenced.map((inf) => ({
      id: `${props.artist.id}->${inf.id}`,
      source: props.artist.id,
      target: inf.id,
      type: 'smoothstep',
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      animated: true,
    })),
  ]

  return { nodes, edges }
})

const hasConnections = computed(
  () => props.artist.influences.length > 0 || props.artist.influencedBy.length > 0,
)

function getBorderColor(era: Era | undefined): string {
  return era ? eraColors[era.id] || '#71717a' : '#71717a'
}
</script>

<template>
  <div
    v-if="!hasConnections"
    class="text-center text-zinc-500 py-8"
  >
    No documented influence connections for this artist.
  </div>
  <div
    v-else
    class="h-[250px] rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950"
  >
    <VueFlow
      :nodes="graphData.nodes"
      :edges="graphData.edges"
      :default-edge-options="{
        type: 'smoothstep',
        style: { stroke: '#f59e0b', strokeWidth: 2 },
      }"
      fit-view-on-init
      :pan-on-drag="false"
      :zoom-on-scroll="false"
      :zoom-on-pinch="false"
      :zoom-on-double-click="false"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      :prevent-scrolling="false"
    >
      <template #node-miniArtist="{ data }">
        <Handle
          type="target"
          :position="Position.Top"
          class="!bg-transparent !border-0 !w-0 !h-0"
        />
        <NuxtLink
          :to="`/artists/${data.artist.id}`"
          class="block px-2 py-1 rounded text-center transition-all duration-200 hover:scale-105"
          :class="data.isCenter ? 'bg-zinc-800 border-2' : 'bg-zinc-900 border'"
          :style="{ borderColor: getBorderColor(data.era) }"
        >
          <div
            class="text-xs font-medium text-white truncate max-w-[80px]"
            :class="{ 'text-sm': data.isCenter }"
          >
            {{ data.artist.name }}
          </div>
        </NuxtLink>
        <Handle
          type="source"
          :position="Position.Bottom"
          class="!bg-transparent !border-0 !w-0 !h-0"
        />
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>
