<template>
  <div class="bg-cyan-700 text-white min-h-screen antialiased">
    <!-- Header: 网站头部和导航 -->
    <header class="sticky top-0 z-50 bg-cyan-700/80 backdrop-blur-sm border-b border-gray-800">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- 网站Logo/名称 -->
          <div class="flex-shrink-0">
            <a href="/" class="flex items-center space-x-2">
              <!-- 音符SVG图标 -->
              <svg class="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
              </svg>
              <span class="font-bold text-xl text-white">My Music Zone</span>
            </a>
          </div>
          <!-- 导航链接 -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">首页</a>
              <a href="/music" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">音乐库</a>
              <a href="/blog" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">博客</a>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content: 页面内容渲染区 -->
    <main>
      <!-- NuxtPage会根据当前路由，自动渲染pages/目录下的对应页面 -->
      <NuxtPage />
    </main>

    <!-- Footer / Global Music Player: 页脚或全局音乐播放器 -->
    <footer class="fixed bottom-0 left-0 right-0 z-50">
      <!-- 这是一个播放器的占位符，您可以之后在这里实现一个真正的播放器组件 -->
      <div class="bg-cyan-700/90 backdrop-blur-sm border-t border-gray-700 shadow-lg text-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="h-20 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img class="h-12 w-12 rounded" src="https://placehold.co/100x100/1f2937/7dd3fc?text=Cover" alt="专辑封面">
              <div>
                <h3 class="font-semibold">未选择歌曲</h3>
                <p class="text-sm text-gray-400">表演者</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
               <!-- 播放控制SVG图标 -->
               <svg class="h-6 w-6 cursor-pointer hover:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
               <svg class="h-10 w-10 cursor-pointer hover:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <svg class="h-6 w-6 cursor-pointer hover:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </div>
             <!-- 社交媒体链接 -->
            <div class="flex items-center space-x-4">
                <a href="#" class="text-gray-400 hover:text-white">网易云音乐</a>
                <a href="#" class="text-gray-400 hover:text-white">Bilibili</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 添加一个占位块，防止底部内容被播放器遮挡 -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
// 这里可以写您的JS逻辑，比如获取用户信息，管理播放器状态等。
// 为了让页面看起来更完整，我们在这里设置一个页面标题
useHead({
  title: 'My Music Zone - 首页',
  meta: [
    { name: 'description', content: '欢迎来到我的个人音乐空间' }
  ],
  // 引入一个漂亮的字体和 Tailwind CSS
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap' }
  ],
  script: [
    { src: 'https://cdn.tailwindcss.com' }
  ],
  htmlAttrs: {
    lang: 'zh-CN'
  },
  bodyAttrs: {
    // 修正这里的背景色，与模板保持一致
    class: 'bg-cyan-700'
  }
})
</script>

<style>
/* 这是您选择的、将要被应用的全局字体 */
body {
  font-family: "Lora", "Georgia", "Noto Serif SC", "思源宋体", serif;
}
</style>
