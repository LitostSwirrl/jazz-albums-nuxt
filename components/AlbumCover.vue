<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  coverUrl?: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  eraColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  className: '',
});

const imageError = ref(false);
const imageLoading = ref(true);

const sizeClasses: Record<string, string> = {
  sm: 'w-full aspect-square',
  md: 'w-full aspect-square',
  lg: 'w-64 h-64',
};

const iconSizes: Record<string, string> = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
};

function getInitials(title: string): string {
  return title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getTitleColor(title: string): string {
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
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getProxiedUrl(url: string): string {
  if (url.includes('archive.org')) {
    return url;
  }
  if (url.includes('/wikipedia/commons/')) {
    return url;
  }
  if (url.includes('upload.wikimedia.org')) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=400&output=jpg`;
  }
  return url;
}

const hasValidUrl = computed(() => {
  return (
    props.coverUrl &&
    props.coverUrl.startsWith('http') &&
    !props.coverUrl.match(/coverartarchive\.org\/release\/[a-z][a-z0-9-]+\/front$/) &&
    !props.coverUrl.includes('-39f8-4c5e-9e5c-1f9c2d8b8d8d')
  );
});

const showFallback = computed(() => !hasValidUrl.value || imageError.value);

const color = computed(() => props.eraColor || getTitleColor(props.title));
const initials = computed(() => getInitials(props.title));
const proxiedUrl = computed(() => (props.coverUrl ? getProxiedUrl(props.coverUrl) : ''));

const containerStyle = computed(() => ({
  backgroundColor: showFallback.value ? `${color.value}15` : '#27272a',
  borderColor: showFallback.value ? `${color.value}40` : 'transparent',
  borderWidth: showFallback.value ? '1px' : '0',
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
    :class="['rounded-lg flex items-center justify-center overflow-hidden relative', sizeClasses[size], className]"
    :style="containerStyle"
  >
    <img
      v-if="!showFallback && coverUrl"
      loading="lazy"
      :src="proxiedUrl"
      :alt="`${title} album cover`"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      :class="['w-full h-full object-cover transition-opacity duration-300', imageLoading ? 'opacity-0' : 'opacity-100']"
      @error="onImageError"
      @load="onImageLoad"
    />
    <div v-if="showFallback" class="flex flex-col items-center justify-center">
      <div
        :class="['font-bold', iconSizes[size]]"
        :style="{ color: color }"
      >
        {{ initials }}
      </div>
      <div :class="[size === 'lg' ? 'text-sm' : 'text-xs', 'text-zinc-500 mt-1']">
        <template v-if="size === 'lg'">Album</template>
      </div>
    </div>
    <div
      v-if="!showFallback && imageLoading"
      class="absolute inset-0 flex items-center justify-center bg-zinc-800"
    >
      <div :class="['animate-pulse', iconSizes[size]]" :style="{ color: color }">
        {{ initials }}
      </div>
    </div>
  </div>
</template>
