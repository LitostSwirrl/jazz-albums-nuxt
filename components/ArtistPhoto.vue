<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  className: '',
});

const imageError = ref(false);
const imageLoading = ref(true);

const sizeClasses: Record<string, string> = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getNameColor(name: string): string {
  const colors = [
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#ec4899', // pink
    '#f43f5e', // rose
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const hasValidUrl = computed(() => props.imageUrl && props.imageUrl.startsWith('http'));
const showFallback = computed(() => !hasValidUrl.value || imageError.value);

const color = computed(() => getNameColor(props.name));
const initials = computed(() => getInitials(props.name));

const containerStyle = computed(() => ({
  backgroundColor: showFallback.value ? `${color.value}20` : '#27272a',
  borderColor: `${color.value}60`,
  borderWidth: '2px',
}));

function onImageError() {
  imageError.value = true;
}

function onImageLoad() {
  imageLoading.value = false;
}
</script>

<template>
  <div
    :class="['rounded-full flex items-center justify-center overflow-hidden relative', sizeClasses[size], className]"
    :style="containerStyle"
  >
    <img
      v-if="!showFallback"
      loading="lazy"
      :src="imageUrl"
      :alt="`${name} photo`"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      :class="['w-full h-full object-cover transition-opacity duration-300', imageLoading ? 'opacity-0' : 'opacity-100']"
      @error="onImageError"
      @load="onImageLoad"
    />
    <div v-if="showFallback" class="flex flex-col items-center justify-center">
      <div
        :class="['font-bold', textSizes[size]]"
        :style="{ color: color }"
      >
        {{ initials }}
      </div>
    </div>
    <div
      v-if="!showFallback && imageLoading"
      class="absolute inset-0 flex items-center justify-center bg-zinc-800"
    >
      <div :class="['animate-pulse', textSizes[size]]" :style="{ color: color }">
        {{ initials }}
      </div>
    </div>
  </div>
</template>
