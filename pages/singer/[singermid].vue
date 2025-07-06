<template>
  <div class="min-h-screen">
    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center h-screen">
      <p class="text-white text-lg">正在加载歌手信息...</p>
    </div>
    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
       <p class="text-red-400 text-lg">加载歌手失败: {{ error.message }}</p>
    </div>
    <!-- 歌手内容 -->
    <div v-else-if="singerData" class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 歌手信息头部 -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <img :src="singerData.singerInfo.pic" class="w-48 h-48 md:w-56 md:h-56 rounded-full shadow-2xl flex-shrink-0 object-cover" alt="歌手照片">
        <div class="text-center md:text-left">
          <h2 class="text-sm uppercase tracking-widest text-gray-300">歌手</h2>
          <h1 class="text-4xl md:text-6xl font-bold text-white mt-2">{{ singerData.singerInfo.name }}</h1>
          
          <!-- 更新后的简介部分 -->
          <div class="text-gray-300 mt-4 max-w-2xl">
            <p :class="{ 'line-clamp-3': !isDescExpanded }" style="white-space: pre-wrap;">
              {{ singerData.singerInfo.desc }}
            </p>
            <button 
              v-if="singerData.singerInfo.desc && singerData.singerInfo.desc.length > 150" 
              @click="isDescExpanded = !isDescExpanded" 
              class="text-teal-400 hover:text-teal-300 font-semibold mt-2"
            >
              {{ isDescExpanded ? '收起' : '展开' }}
            </button>
          </div>

           <button @click="playFirstSong" class="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
            <span>播放热门歌曲</span>
          </button>
        </div>
      </div>

      <!-- 热门歌曲列表 -->
      <h3 class="text-2xl font-bold text-white mb-4">热门歌曲</h3>
      <div class="space-y-2">
        <div 
          v-for="(song, index) in singerData.songList" 
          :key="song.songmid"
          @click="play(song)"
          class="flex items-center p-3 bg-gray-800/20 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div class="text-gray-400 w-8 text-center">{{ index + 1 }}</div>
           <img :src="getAlbumArt(song.albummid)" class="w-10 h-10 rounded ml-4 object-cover" alt="专辑封面" />
          <div class="ml-4 flex-grow overflow-hidden">
            <div class="font-semibold text-white truncate">{{ song.name }}</div>
            <NuxtLink 
                v-if="song.albummid && song.albumname"
                :to="`/album/${song.albummid}`" 
                @click.stop 
                class="text-sm text-gray-400 truncate hover:underline hover:text-teal-400"
              >
                {{ song.albumname }}
              </NuxtLink>
          </div>
          <button @click.stop="downloadSong(song)" :disabled="downloadingSongId === song.songmid" class="p-2 rounded-full hover:bg-gray-600 ml-4">
            <svg v-if="downloadingSongId === song.songmid" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const playerStore = usePlayerStore()
const singermid = route.params.singermid

// 获取歌手数据
const { data: singerData, pending, error } = await useFetch(`/api/singer/${singermid}`)

const downloadingSongId = ref(null)
const isDescExpanded = ref(false) // 新增：控制简介是否展开的状态

// 播放指定歌曲
const play = (song) => {
  playerStore.playSong(song, singerData.value.songList)
}

// 播放第一首歌
const playFirstSong = () => {
    if (singerData.value && singerData.value.songList.length > 0) {
        play(singerData.value.songList[0])
    }
}

// 下载歌曲
const downloadSong = async (song) => {
  if (downloadingSongId.value) return
  downloadingSongId.value = song.songmid

  try {
    const songData = await $fetch(`/api/song/${song.songmid}`)
    if (songData && songData.url) {
      const link = document.createElement('a')
      link.href = songData.url
      const fileName = `${song.singer} - ${song.name}.mp3`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('无法获取下载链接，请稍后再试。')
    }
  } catch (err) {
    console.error('下载失败:', err)
    alert('下载失败，请查看控制台获取更多信息。')
  } finally {
    downloadingSongId.value = null
  }
}

const getAlbumArt = (albummid) => {
  if (!albummid) return 'https://placehold.co/100x100/0891b2/ffffff?text=Art'
  return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg`
}
</script>
