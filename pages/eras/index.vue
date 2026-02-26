<script setup lang="ts">
import erasData from '~/data/eras.json'
import type { Era } from '~/types'

const eras = erasData as Era[]

useHead({
  title: 'Jazz Eras',
  meta: [
    {
      name: 'description',
      content:
        'Explore the evolution of jazz through eight distinct periods, from early jazz and swing to bebop, hard bop, free jazz, fusion, and contemporary styles.',
    },
  ],
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-2">Jazz Eras</h1>
    <p class="text-zinc-400 mb-8">
      Explore the evolution of jazz through eight distinct periods
    </p>

    <!-- Timeline -->
    <div class="relative">
      <!-- Timeline line -->
      <div
        class="absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-800 hidden md:block"
      />

      <div class="space-y-8">
        <NuxtLink
          v-for="era in eras"
          :key="era.id"
          :to="`/eras/${era.id}`"
          class="group block relative pl-0 md:pl-20"
        >
          <!-- Timeline dot -->
          <div
            class="absolute left-6 top-6 w-4 h-4 rounded-full border-2 border-zinc-800 hidden md:block group-hover:scale-150 transition-transform"
            :style="{ backgroundColor: era.color }"
          />

          <div
            class="p-6 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-600 transition-all"
            :style="{ borderLeftColor: era.color, borderLeftWidth: '4px' }"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
            >
              <h2
                class="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors"
              >
                {{ era.name }}
              </h2>
              <span class="text-zinc-500 font-mono">{{ era.period }}</span>
            </div>

            <p class="text-zinc-400 mb-4">{{ era.description }}</p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="char in era.characteristics.slice(0, 3)"
                :key="char"
                class="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-400"
              >
                {{ char }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
