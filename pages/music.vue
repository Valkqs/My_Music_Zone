<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-bold mb-8 text-white text-center">音乐库</h1>

    <!-- 搜索类型选择器 -->
    <SearchTypeSelector v-model="searchType" class="max-w-sm mx-auto" />

    <!-- 搜索框 -->
    <div class="mb-8 max-w-lg mx-auto">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="search"
          :placeholder="`搜索${placeholderText}...`"
          class="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button @click="search" class="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div>
      <!-- 加载状态 -->
      <div v-if="pending" class="text-center text-gray-400">正在加载...</div>
      <!-- 错误状态 -->
      <div v-if="error" class="text-center text-red-400">加载失败: {{ error.message }}</div>
      
      <!-- 歌曲列表 -->
      <div v-if="!pending && results.length > 0 && searchType === 'song'" class="space-y-4">
        <div 
          v-for="(song, index) in results" 
          :key="song.songmid"
          @click="play(song)"
          class="flex items-center p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="text-gray-400 w-8 text-center">{{ index + 1 }}</div>
          <img :src="getAlbumArt(song.albummid)" class="w-12 h-12 rounded ml-4 object-cover" alt="专辑封面" />
          <div class="ml-4 flex-grow overflow-hidden">
            <div class="font-semibold text-white truncate">{{ song.name }}</div>
            <div class="text-sm text-gray-400 truncate">
              <span>{{ song.singer }}</span>
              <span v-if="song.albumname" class="mx-1">·</span>
              <NuxtLink 
                v-if="song.albummid && song.albumname"
                :to="`/album/${song.albummid}`" 
                @click.stop 
                class="hover:underline hover:text-teal-400"
              >
                {{ song.albumname }}
              </NuxtLink>
            </div>
          </div>
          <button @click.stop="downloadSong(song)" :disabled="downloadingSongId === song.songmid" class="p-2 rounded-full hover:bg-gray-600 ml-4">
            <svg v-if="downloadingSongId === song.songmid" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          <button @click.stop="play(song)" class="p-2 rounded-full hover:bg-gray-600 ml-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
          </button>
        </div>
      </div>

      <!-- 专辑列表 -->
      <div v-if="!pending && results.length > 0 && searchType === 'album'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AlbumCard v-for="album in results" :key="album.album_mid" :album="album" />
      </div>

      <!-- 歌手列表 -->
      <div v-if="!pending && results.length > 0 && searchType === 'singer'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <SingerCard v-for="singer in results" :key="singer.singer_mid" :singer="singer" />
      </div>

      <!-- 无结果提示 -->
      <div v-if="!pending && results.length === 0" class="text-center text-gray-400 py-10">
        输入关键词开始搜索吧！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const playerStore = usePlayerStore()

const searchQuery = ref('')
const searchType = ref('song') // 'song', 'album', or 'singer'
const results = ref([])
const pending = ref(false)
const error = ref(null)
const downloadingSongId = ref(null)

const placeholderText = computed(() => {
  if (searchType.value === 'song') return '歌曲或艺术家'
  if (searchType.value === 'album') return '专辑'
  if (searchType.value === 'singer') return '歌手'
  return ''
})

watch(searchType, () => {
  results.value = []
})

const search = async () => {
  if (!searchQuery.value.trim()) return
  
  pending.value = true
  error.value = null
  
  // --- 新增日志 ---
  console.log(`[Frontend] 开始搜索, 类型: ${searchType.value}, 关键词: ${searchQuery.value}`);

  try {
    const data = await $fetch('/api/search', {
      params: { 
        key: searchQuery.value,
        type: searchType.value 
      }
    })
    // --- 新增日志 ---
    console.log('[Frontend] 从 API 收到数据:', data);

    results.value = data
    
    // --- 新增日志 ---
    console.log('[Frontend] results 变量已被更新:', results.value);

  } catch (e) {
    error.value = e
    results.value = []
    // --- 新增日志 ---
    console.error('[Frontend] 搜索时发生错误:', e);
  } finally {
    pending.value = false
  }
}

const play = (song) => {
  if (song.type === 'song') {
    playerStore.playSong(song, results.value.filter(item => item.type === 'song'))
  }
}

const downloadSong = async (song) => {
  if (downloadingSongId.value || song.type !== 'song') return
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
