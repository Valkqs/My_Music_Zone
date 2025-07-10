import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playlist: [], // 播放列表
    currentSongIndex: -1, // 当前歌曲在播放列表中的索引
    isPlaying: false, // 是否正在播放
    currentSongError: null, // 用于存储当前歌曲的播放错误信息
  }),

  getters: {
    // 获取当前歌曲对象
    currentSong(state) {
      return state.currentSongIndex > -1 ? state.playlist[state.currentSongIndex] : null
    },
  },

  actions: {
    // 播放一首歌（可以是列表中的，也可以是新歌）
    async playSong(song, songList = null) {
      // 开始播放新歌时，清除上一个错误信息
      this.currentSongError = null;

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

      // --- 新增：调用日志接口 ---
      // 在获取播放链接前，就将歌曲信息发送到后端进行打印
      try {
        await $fetch('/api/log', {
          method: 'POST',
          body: {
            name: this.currentSong.name,
            mid: this.currentSong.songmid,
          }
        });
      } catch (e) {
        // 即便日志记录失败，也不影响正常播放，只在浏览器控制台给出警告
        console.warn('无法记录播放信息到服务器:', e);
      }
      // --- 日志功能结束 ---


      // 如果当前歌曲没有播放链接，则去获取
      if (!this.currentSong.url) {
        try {
          const songData = await $fetch(`/api/song/${this.currentSong.songmid}`)
          if (songData && songData.url) {
            this.currentSong.url = songData.url
            this.currentSong.albumArt = songData.albumArt
            this.isPlaying = true
          } else {
            // 获取链接失败，设置错误信息并准备播放下一首
            this.isPlaying = false
            this.currentSongError = '无法获取播放链接，3秒后将播放下一首。';
            console.error('获取播放链接失败，API未返回有效URL。', songData);
            setTimeout(() => {
              // 检查错误是否仍然是当前歌曲的，防止用户已经手动切歌
              if (this.currentSong?.songmid === song.songmid && this.currentSongError) {
                this.playNext();
              }
            }, 3000);
          }
        } catch (error) {
           // 请求本身出错，设置错误信息并准备播放下一首
           this.isPlaying = false
           this.currentSongError = '请求歌曲资源时出错，3秒后将播放下一首。';
           console.error('请求歌曲链接时出错:', error)
           setTimeout(() => {
              if (this.currentSong?.songmid === song.songmid && this.currentSongError) {
                this.playNext();
              }
            }, 3000);
        }
      } else {
        // 如果已经有链接了，直接播放
        this.isPlaying = true
      }
    },

    togglePlay() {
      if (!this.currentSong || this.currentSongError) return // 如果有错误，则禁止切换播放状态
      this.isPlaying = !this.isPlaying
    },

    playNext() {
      if (this.playlist.length === 0) return
      let nextIndex = this.currentSongIndex + 1
      if (nextIndex >= this.playlist.length) {
        nextIndex = 0 // 循环播放
      }
      this.playSong(this.playlist[nextIndex])
    },

    playPrev() {
      if (this.playlist.length === 0) return
      let prevIndex = this.currentSongIndex - 1
      if (prevIndex < 0) {
        prevIndex = this.playlist.length - 1 // 循环播放
      }
      this.playSong(this.playlist[prevIndex])
    },
  },
})
