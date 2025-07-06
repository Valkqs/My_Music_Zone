<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-bold mb-12 text-white text-center">我的博客</h1>

    <!-- 加载与错误状态 -->
    <div v-if="pending" class="text-center text-gray-300">正在加载文章...</div>
    <div v-else-if="error" class="text-center text-red-400">加载文章失败: {{ error.message }}</div>

    <!-- 文章列表 -->
    <div v-else-if="articles && articles.length" class="space-y-12">
      <div v-for="article in articles" :key="article._path">
        <NuxtLink :to="article._path" class="block group">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <!-- 封面图 -->
            <div class="md:col-span-1 w-full aspect-video rounded-lg overflow-hidden">
              <CldImage
                :src="article.cover || 'my-music-site/blog-placeholder'"
                :alt="article.title"
                width="400"
                height="225"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                format="auto"
                quality="auto"
              />
            </div>
            <!-- 文字内容 -->
            <div class="md:col-span-2">
              <p class="text-sm text-gray-400">{{ formatDate(article.date) }}</p>
              <h2 class="text-2xl font-bold text-white mt-2 group-hover:text-teal-400 transition-colors">
                {{ article.title }}
              </h2>
              <p class="mt-4 text-gray-300 leading-relaxed line-clamp-2">
                {{ article.description }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-400">暂无文章。</div>
  </div>
</template>

<script setup>
// 移除了 "import { queryContent } from '#content'"，让 Nuxt 自动导入

// 获取所有 /blog 目录下的文章，并按日期倒序排列
const { data: articles, pending, error } = await useAsyncData('all-articles', () => 
  queryContent('/blog').sort({ date: -1 }).find()
)

// 格式化日期的辅助函数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
