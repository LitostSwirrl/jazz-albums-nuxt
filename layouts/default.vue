<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-950 text-white">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:rounded focus:outline-none"
    >
      Skip to main content
    </a>
    <LayoutHeader />
    <main id="main-content" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
