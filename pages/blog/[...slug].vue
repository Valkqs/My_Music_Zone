<template>
  <main class="py-12">
    <!-- 调试信息框 -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-6 bg-red-900/50 p-4 rounded-lg border border-red-700">
      <h2 class="text-white font-bold text-lg mb-2">调试信息</h2>
      <p class="text-sm text-white">当前路径 (path): <code class="text-yellow-300 font-mono">{{ path }}</code></p>
      <p class="text-sm text-white">数据加载中 (pending): <code class="text-yellow-300 font-mono">{{ pending }}</code></p>
      <p class="text-sm text-white">是否有错误 (error): <code class="text-yellow-300 font-mono">{{ !!error }}</code></p>
      <p class="text-sm text-white">获取到的文档 (doc): <code class="text-yellow-300 font-mono">{{ doc ? '存在' : '不存在 (null)' }}</code></p>
      <pre v-if="error" class="text-red-300 mt-2 text-xs bg-black/20 p-2 rounded">{{ error }}</pre>
    </div>

    <div v-if="doc" class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <!-- 文章头部 -->
      <div class="text-center mb-12">
        <p class="text-gray-400">{{ formatDate(doc.date) }}</p>
        <h1 class="text-4xl md:text-5xl font-bold text-white mt-2">{{ doc.title }}</h1>
      </div>
      
      <!-- 文章封面 -->
      <div class="w-full aspect-video rounded-lg overflow-hidden mb-12">
        <CldImage
          :src="doc.cover || 'my-music-site/blog-placeholder'"
          :alt="doc.title"
          width="1200"
          height="675"
          class="w-full h-full object-cover"
          format="auto"
          quality="auto"
        />
      </div>

      <!-- 文章内容渲染区域 -->
      <div class="prose prose-invert prose-lg max-w-none">
        <ContentRenderer :value="doc" />
      </div>
    </div>
     <!-- 添加一个错误状态的显示 -->
    <div v-else class="text-center text-gray-300 py-20">
      <p>抱歉，加载文章失败或文章不存在。</p>
    </div>
  </main>
</template>

<script setup>
// 明确导入所有需要的函数
import { useRoute } from 'vue-router'
import { useAsyncData, useHead } from '#app'
import { queryContent, ContentRenderer } from '#content'

console.log('[Blog Detail] 页面脚本开始执行...');

const route = useRoute();
const path = route.path;

console.log(`[Blog Detail] 从 useRoute 获取到的路径: ${path}`);

// 将 error 也解构出来，方便在模板中显示
const { data: doc, pending, error } = await useAsyncData(`content-${path}`, () => {
  console.log(`[Blog Detail] useAsyncData 正在执行查询: queryContent().where({ _path: "${path}" })`);
  return queryContent().where({ _path: path }).findOne();
});

console.log('[Blog Detail] useAsyncData 执行完毕。');
console.log('[Blog Detail] pending 状态:', pending.value);
console.log('[Blog Detail] error 对象:', error.value);
console.log('[Blog Detail] doc 数据:', doc.value);


// 格式化日期的辅助函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 设置页面 SEO 元数据
useHead({
  title: () => doc.value?.title || '博客文章',
  meta: [
    { name: 'description', content: () => doc.value?.description || '' }
  ]
});
</script>

<style>
/* 为文章内容提供更好的样式 */
.prose {
  color: #d1d5db; /* text-gray-300 */
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: #ffffff;
}
.prose a {
  color: #2dd4bf; /* text-teal-400 */
  text-decoration: none;
}
.prose a:hover {
  text-decoration: underline;
}
.prose blockquote {
  border-left-color: #5eead4; /* border-teal-300 */
  color: #9ca3af; /* text-gray-400 */
}
.prose code {
  color: #f9fafb; /* text-gray-50 */
  background-color: #374151; /* bg-gray-700 */
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}
</style>
