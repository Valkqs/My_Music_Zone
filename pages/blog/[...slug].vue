<template>
  <main class="py-12">
    <div v-if="pending" class="text-center text-gray-300 py-20">正在加载文章...</div>
    <div v-else-if="error" class="text-center text-red-400 py-20">
        <p>抱歉，加载文章失败或文章不存在。</p>
        <p class="text-sm mt-2">错误: {{ error.message }}</p>
    </div>
    <div v-else-if="doc" class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
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
        <!-- 遍历内容块 -->
        <div v-for="(block, index) in doc.content" :key="index">
          <!-- 如果是 HTML 块，用 v-html 渲染 -->
          <div v-if="block.type === 'html'" v-html="block.content"></div>
          <!-- 如果是播放器块，渲染 InlinePlayer 组件 -->
          <InlinePlayer v-if="block.type === 'player'" :songmid="block.props.songmid" />
          <!-- 新增：如果是图片块，渲染 CldImage 组件 -->
          <CldImage
            v-if="block.type === 'cld-image'"
            :src="block.props.src"
            :alt="block.props.alt || '博客中的图片'"
            :width="block.props.width || 800"
            :height="block.props.height || 600"
            class="my-6 rounded-lg shadow-lg mx-auto"
            format="auto"
            quality="auto"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const { data: doc, pending, error } = await useFetch(`/api/articles/${route.params.slug}`);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

useHead({
  title: () => doc.value?.title || '博客文章',
  meta: [
    { name: 'description', content: () => doc.value?.description || '' }
  ]
});
</script>

<style>
/* 为文章内容提供更好的样式 */
.prose { color: #d1d5db; }
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: #ffffff; }

/* 新增：为二级和三级标题设置不同的大小和间距 */
.prose h2 {
  font-size: 1.875rem; /* 等同于 text-3xl */
  line-height: 2.25rem;
  margin-top: 2em;
  margin-bottom: 1em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #4b5563; /* border-gray-600 */
}

.prose h3 {
  font-size: 1.5rem; /* 等同于 text-2xl */
  line-height: 2rem;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}

.prose a { color: #2dd4bf; text-decoration: none; }
.prose a:hover { text-decoration: underline; }
.prose blockquote { border-left-color: #5eead4; color: #9ca3af; }
.prose code { color: #f9fafb; background-color: #374151; padding: 0.2em 0.4em; border-radius: 0.25rem; }
.prose p { margin-top: 1.25em; margin-bottom: 1.25em; }
.prose ul, .prose ol { margin-top: 1.25em; margin-bottom: 1.25em; }
</style>
