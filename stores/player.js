import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playlist: [],
    currentSongIndex: -1,
    isPlaying: false,
    // 移除 audio 引用，让组件自己管理 DOM 元素
  }),

  getters: {
    currentSong(state) {
      return state.currentSongIndex > -1 ? state.playlist[state.currentSongIndex] : null
    },
  },

  actions: {
    // playSong 现在是一个 async 函数，专注于获取数据
    async playSong(song, songList = null) {
      if (songList) {
        this.playlist = songList
      }
      
      const index = this.playlist.findIndex(s => s.songmid === song.songmid)

      if (index === -1) {
        this.playlist.unshift(song)
        this.currentSongIndex = 0
      } else {
        this.currentSongIndex = index
      }

      // 如果当前歌曲没有播放链接，则去获取
      if (!this.currentSong.url) {
        try {
          const songData = await $fetch(`/api/song/${this.currentSong.songmid}`)
          if (songData && songData.url) {
            // 将获取到的链接和封面更新到 store 中
            this.currentSong.url = songData.url
            this.currentSong.albumArt = songData.albumArt
            this.isPlaying = true // 设置为播放状态
          } else {
            console.error('获取播放链接失败，API未返回有效URL。')
            this.isPlaying = false
          }
        } catch (error) {
           console.error('请求歌曲链接时出错:', error)
           this.isPlaying = false
        }
      } else {
        // 如果已经有链接了，直接播放
        this.isPlaying = true
      }
    },

    togglePlay() {
      if (!this.currentSong) return
      this.isPlaying = !this.isPlaying
    },

    playNext() {
      if (this.playlist.length === 0) return
      let nextIndex = this.currentSongIndex + 1
      if (nextIndex >= this.playlist.length) {
        nextIndex = 0
      }
      this.playSong(this.playlist[nextIndex])
    },

    playPrev() {
      if (this.playlist.length === 0) return
      let prevIndex = this.currentSongIndex - 1
      if (prevIndex < 0) {
        prevIndex = this.playlist.length - 1
      }
      this.playSong(this.playlist[prevIndex])
    },
  },
})
