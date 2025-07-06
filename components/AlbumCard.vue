<template>
  <!-- 用 NuxtLink 包裹整个卡片，并使用计算属性来确保链接正确 -->
  <NuxtLink v-if="albumId" :to="`/album/${albumId}`" class="block">
    <div class="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer group">
      <div class="w-full aspect-square overflow-hidden">
        <img 
          :src="album.album_pic || 'https://placehold.co/300x300/0891b2/ffffff?text=Album'" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          alt="专辑封面" 
        />
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-white truncate">{{ album.album_name }}</h3>
        <p class="mt-1 text-sm text-gray-400 truncate">{{ album.singer_name }}</p>
      </div>
    </div>
  </NuxtLink>
  <!-- 如果没有有效的ID，则显示为一个不可点击的卡片 -->
  <div v-else class="block">
     <div class="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg">
      <div class="w-full aspect-square overflow-hidden">
        <img 
          :src="album.album_pic || 'https://placehold.co/300x300/0891b2/ffffff?text=Album'" 
          class="w-full h-full object-cover" 
          alt="专辑封面" 
        />
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-white truncate">{{ album.album_name }}</h3>
        <p class="mt-1 text-sm text-gray-400 truncate">{{ album.singer_name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  album: Object
});

// 创建一个计算属性来智能获取专辑ID
const albumId = computed(() => {
  if (!props.album) return null;
  // 依次尝试从不同的可能字段中获取ID
  return props.album.album_mid || props.album.albumMID || props.album.mid;
});
</script>
