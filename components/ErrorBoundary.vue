<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err: Error) => {
  hasError.value = true;
  errorMessage.value = err.message;
  console.error('ErrorBoundary caught an error:', err);
  return false;
});

function reloadPage() {
  window.location.reload();
}
</script>

<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-zinc-950">
    <div class="text-center p-8 max-w-md">
      <div class="text-6xl mb-4 text-amber-400">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-white mb-4">
        Something went wrong
      </h1>
      <p class="text-zinc-400 mb-6">
        We hit a wrong note. Please try refreshing the page.
      </p>
      <button
        @click="reloadPage"
        class="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        Reload page
      </button>
      <details v-if="errorMessage" class="mt-6 text-left">
        <summary class="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400">
          Technical details
        </summary>
        <pre class="mt-2 p-3 bg-zinc-900 rounded text-xs text-red-400 overflow-auto">{{ errorMessage }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>
