<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-medium text-white bg-gray-800/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
    >
      上一页
    </button>
    
    <span class="text-gray-300">
      第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
    </span>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 text-sm font-medium text-white bg-gray-800/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
    >
      下一页
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-changed']);

const changePage = (page) => {
  if (page < 1 || page > props.totalPages) return;
  emit('page-changed', page);
};
</script>
