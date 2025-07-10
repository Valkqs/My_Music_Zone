<template>
  <div class="my-6">
    <div v-if="pending" class="text-center text-gray-400">正在加载音乐...</div>
    <div v-else-if="error" class="text-center text-red-400">加载失败</div>
    <div v-else-if="songDetails" class="flex items-center p-4 bg-gray-800/50 rounded-lg">
      <img :src="songDetails.albumArt || 'https://placehold.co/100x100/0891b2/ffffff?text=Art'" class="w-16 h-16 rounded object-cover" alt="专辑封面" />
      <div class="ml-4 flex-grow overflow-hidden">
        <div class="font-bold text-white text-lg truncate">{{ songDetails.name }}</div>
        <div class="text-sm text-gray-400 truncate">{{ songDetails.singer }}</div>
      </div>
      <button @click="play" class="ml-4 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-transform transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  songmid: String
})

const playerStore = usePlayerStore()

// 请求我们新创建的、正确的接口
const { data: songDetails, pending, error } = await useFetch(`/api/song-details/${props.songmid}`)

const play = () => {
  if (songDetails.value) {
    // 构建一个完整的 song 对象以传递给播放器
    const songToPlay = {
      songmid: props.songmid,
      name: songDetails.value.name,
      singer: songDetails.value.singer,
      albumArt: songDetails.value.albumArt,
      // url 会在 playSong action 中被获取
    }
    playerStore.playSong(songToPlay)
  }
}
</script>
