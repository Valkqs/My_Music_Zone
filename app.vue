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
      <NuxtPage />
    </main>

    <!-- Footer / Global Music Player -->
    <footer class="fixed bottom-0 left-0 right-0 z-50">
      <!-- 这里被替换成了我们创建的全局播放器组件 -->
      <GlobalPlayer />
    </footer>

    <!-- 添加一个占位块，防止底部内容被播放器遮挡 -->
    <div class="h-20"></div> 
  </div>
</template>

<script setup>
useHead({
  title: 'Valk\'s Music Zone',
  meta: [
    { name: 'description', content: '欢迎来到我的个人音乐空间' }
  ],
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
    class: 'bg-cyan-700'
  }
})
</script>

<style>
body {
  font-family: "Lora", "Georgia", "Noto Serif SC", "思源宋体", serif;
}
</style>
