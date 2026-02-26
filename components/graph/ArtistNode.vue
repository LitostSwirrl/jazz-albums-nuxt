<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { Artist, Era } from '~/types'
import { eraColors } from '~/composables/useInfluenceGraph'

const props = defineProps<{
  data: {
    artist: Artist
    era: Era | undefined
    influenceCount: number
    size: 'sm' | 'md' | 'lg' | 'xl'
    highlighted?: boolean
    dimmed?: boolean
    isPathNode?: boolean
  }
  selected?: boolean
}>()

const sizeClasses: Record<string, string> = {
  sm: 'min-w-[120px] p-2',
  md: 'min-w-[140px] p-3',
  lg: 'min-w-[160px] p-3',
  xl: 'min-w-[180px] p-4',
}

const textSizeClasses: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

const borderColor = computed(() => {
  return props.data.era ? eraColors[props.data.era.id] || '#71717a' : '#71717a'
})
</script>

<template>
  <Handle type="target" :position="Position.Top" class="!bg-zinc-600 !w-2 !h-2" />
  <NuxtLink
    :to="`/artists/${data.artist.id}`"
    class="block rounded-lg bg-zinc-900 border-2 text-center transition-all duration-200 hover:scale-105"
    :class="[
      sizeClasses[data.size],
      data.dimmed ? 'opacity-30' : 'opacity-100',
      (data.highlighted || selected) &&
        'ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-950',
      data.isPathNode &&
        'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950',
    ]"
    :style="{ borderColor }"
  >
    <div
      class="font-semibold text-white truncate"
      :class="textSizeClasses[data.size]"
    >
      {{ data.artist.name }}
    </div>
    <div class="text-xs text-zinc-500 truncate">
      {{ data.artist.instruments.slice(0, 2).join(', ') }}
    </div>
    <div
      v-if="data.era"
      class="text-xs mt-1 px-2 py-0.5 rounded inline-block"
      :style="{
        backgroundColor: borderColor + '30',
        color: borderColor,
      }"
    >
      {{ data.era.name.split(' ')[0] }}
    </div>
    <div v-if="data.influenceCount > 0" class="text-xs text-zinc-600 mt-1">
      {{ data.influenceCount }} connections
    </div>
  </NuxtLink>
  <Handle type="source" :position="Position.Bottom" class="!bg-zinc-600 !w-2 !h-2" />
</template>
