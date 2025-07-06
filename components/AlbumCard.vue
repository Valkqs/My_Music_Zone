<template>
  <NuxtLink :to="`/album/${album.album_mid}`" class="block">
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
</template>

<script setup>
const props = defineProps({
  album: Object
})
</script>
