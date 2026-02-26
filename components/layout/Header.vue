<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showExplore = ref(false);
const mobileMenuOpen = ref(false);

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    mobileMenuOpen.value = false;
    showExplore.value = false;
  }
}

function toggleExplore() {
  showExplore.value = !showExplore.value;
}

function closeExplore() {
  setTimeout(() => {
    showExplore.value = false;
  }, 150);
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <header class="bg-zinc-900 border-b border-zinc-800">
    <nav class="max-w-6xl mx-auto px-4 py-4" aria-label="Main navigation">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-white hover:text-amber-400 transition-colors">
          Jazz Guide
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex gap-6 items-center">
          <NuxtLink to="/" class="text-zinc-300 hover:text-white transition-colors">
            Home
          </NuxtLink>
          <NuxtLink to="/eras" class="text-zinc-300 hover:text-white transition-colors">
            Eras
          </NuxtLink>
          <NuxtLink to="/artists" class="text-zinc-300 hover:text-white transition-colors">
            Artists
          </NuxtLink>
          <NuxtLink to="/albums" class="text-zinc-300 hover:text-white transition-colors">
            Albums
          </NuxtLink>
          <div class="relative">
            <button
              @click="toggleExplore"
              @blur="closeExplore"
              @keydown.escape="showExplore = false"
              :aria-expanded="showExplore"
              aria-haspopup="menu"
              aria-controls="explore-menu"
              class="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
            >
              Explore
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="showExplore"
              id="explore-menu"
              role="menu"
              class="absolute right-0 mt-2 w-48 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl z-50"
            >
              <NuxtLink
                to="/timeline"
                role="menuitem"
                class="block px-4 py-3 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors rounded-t-lg focus:outline-none focus:bg-zinc-700"
              >
                <div class="font-medium">Timeline</div>
                <div class="text-xs text-zinc-500">Jazz through the ages</div>
              </NuxtLink>
              <NuxtLink
                to="/influence"
                role="menuitem"
                class="block px-4 py-3 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors rounded-b-lg focus:outline-none focus:bg-zinc-700"
              >
                <div class="font-medium">Influence Network</div>
                <div class="text-xs text-zinc-500">Artist connections</div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <svg v-if="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="md:hidden mt-4 pt-4 border-t border-zinc-800"
      >
        <div class="flex flex-col space-y-3">
          <NuxtLink
            to="/"
            @click="closeMobileMenu"
            class="text-zinc-300 hover:text-white transition-colors py-2"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/eras"
            @click="closeMobileMenu"
            class="text-zinc-300 hover:text-white transition-colors py-2"
          >
            Eras
          </NuxtLink>
          <NuxtLink
            to="/artists"
            @click="closeMobileMenu"
            class="text-zinc-300 hover:text-white transition-colors py-2"
          >
            Artists
          </NuxtLink>
          <NuxtLink
            to="/albums"
            @click="closeMobileMenu"
            class="text-zinc-300 hover:text-white transition-colors py-2"
          >
            Albums
          </NuxtLink>
          <NuxtLink
            to="/timeline"
            @click="closeMobileMenu"
            class="text-amber-400 hover:text-amber-300 transition-colors py-2"
          >
            Timeline
          </NuxtLink>
          <NuxtLink
            to="/influence"
            @click="closeMobileMenu"
            class="text-amber-400 hover:text-amber-300 transition-colors py-2"
          >
            Influence Network
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>
