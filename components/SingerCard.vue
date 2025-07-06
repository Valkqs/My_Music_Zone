<template>
  <NuxtLink :to="`/singer/${singer.singer_mid}`" class="block">
    <div class="text-center group">
      <div class="relative w-full aspect-square rounded-full overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
        <img 
          :src="singer.singer_pic || 'https://placehold.co/300x300/0891b2/ffffff?text=Singer'" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          alt="歌手照片" 
        />
      </div>
      <div class="mt-4">
        <h3 class="font-semibold text-white truncate">{{ singer.singer_name }}</h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  singer: Object
})
</script>
