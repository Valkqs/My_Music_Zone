<template>
  <div class="flex justify-center space-x-2 rounded-full bg-gray-800 p-1 mb-8">
    <button
      @click="selectType('song')"
      :class="[
        'px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200',
        modelValue === 'song' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700'
      ]"
    >
      歌曲
    </button>
    <button
      @click="selectType('album')"
      :class="[
        'px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200',
        modelValue === 'album' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700'
      ]"
    >
      专辑
    </button>
    <button
      @click="selectType('singer')"
      :class="[
        'px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200',
        modelValue === 'singer' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700'
      ]"
    >
      歌手
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const selectType = (type) => {
  emit('update:modelValue', type)
}
</script>
