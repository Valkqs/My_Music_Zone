<template>
  <!-- 只有在有当前歌曲时才显示播放器 -->
  <div v-if="playerStore.currentSong" class="relative bg-cyan-700/90 backdrop-blur-sm border-t border-gray-700 shadow-lg text-white">
    <!-- 播放进度条 -->
    <input
      type="range"
      :value="currentTime"
      :max="duration"
      @input="onSeek"
      class="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
      style="--thumb-color: #2dd4bf;"
    >

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-20 flex items-center justify-between">
        <!-- 歌曲信息 -->
        <div class="flex items-center space-x-4 w-1/3 overflow-hidden">
          <img
            v-if="playerStore.currentSong.albumArt"
            :src="playerStore.currentSong.albumArt"
            class="h-12 w-12 rounded flex-shrink-0 object-cover"
            alt="专辑封面"
          />
          <img 
            v-else
            src="https://placehold.co/100x100/0891b2/ffffff?text=Art" 
            class="h-12 w-12 rounded flex-shrink-0" 
            alt="专辑封面占位图"
          >
          <div>
            <h3 class="font-semibold truncate">{{ playerStore.currentSong.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ playerStore.currentSong.singer }}</p>
          </div>
        </div>

        <!-- 播放控制 -->
        <div class="flex items-center space-x-4">
          <button @click="playerStore.playPrev()" class="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button @click="playerStore.togglePlay()" class="w-12 h-12 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white rounded-full text-2xl transition-transform transform hover:scale-110">
            <svg v-if="!playerStore.isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" /></svg>
          </button>
          <button @click="playerStore.playNext()" class="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- 音量和其他控制 -->
        <div class="flex items-center space-x-4 w-1/3 justify-end">
          <span class="text-xs">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          <div class="flex items-center space-x-2">
            <button @click="toggleMute">
              <svg v-if="volume > 0" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" /></svg>
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              :value="volume"
              @input="onVolumeChange"
              class="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
              style="--thumb-color: #ffffff;"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 隐藏的 Audio 元素 -->
    <audio ref="audioElement" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="playerStore.playNext()"></audio>
    
    <!-- 新增：错误信息遮罩层 -->
    <div v-if="playerStore.currentSongError" class="absolute inset-0 bg-black/70 flex items-center justify-center">
      <p class="text-red-400 text-center px-4">{{ playerStore.currentSongError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const playerStore = usePlayerStore()
const audioElement = ref(null)

const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
let lastVolume = 1

onMounted(() => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
})

watch(() => playerStore.currentSong, (newSong) => {
  if (newSong && newSong.url && audioElement.value) {
    audioElement.value.src = newSong.url
    audioElement.value.volume = volume.value
    if (playerStore.isPlaying) {
      audioElement.value.play().catch(e => console.error("播放失败:", e));
    }
  }
}, { deep: true })

watch(() => playerStore.isPlaying, (isPlaying) => {
  if (!audioElement.value) return
  // 只有在没有错误时才响应播放/暂停
  if (!playerStore.currentSongError) {
    if (isPlaying) {
      audioElement.value.play().catch(e => console.error("播放失败:", e));
    } else {
      audioElement.value.pause()
    }
  }
})

const onTimeUpdate = (e) => {
  currentTime.value = e.target.currentTime
}

const onLoadedMetadata = (e) => {
  duration.value = e.target.duration
}

const onSeek = (e) => {
  if (audioElement.value) {
    audioElement.value.currentTime = e.target.value
  }
}

const onVolumeChange = (e) => {
  volume.value = parseFloat(e.target.value)
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
}

const toggleMute = () => {
  if (volume.value > 0) {
    lastVolume = volume.value
    volume.value = 0
  } else {
    volume.value = lastVolume
  }
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
}

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style>
/* 自定义 range input 的样式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--thumb-color, #2dd4bf);
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--thumb-color, #2dd4bf);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
