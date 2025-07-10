<template>
  <div>
    <!-- Hero Section: Floating Album Covers -->
    <section class="relative w-full h-[500px] overflow-hidden bg-slate-200 flex items-center justify-center">
      <!-- Cloudinary Background Image -->
      <CldImage
        src="JinHua_wvkasl"
        alt="网站背景图"
        width="1920"
        height="1080"
        class="absolute inset-0 w-full h-full object-cover z-0"
        format="auto"
        quality="auto"
        :modifiers="{ effect: 'blur:100' }"
      />

      <!-- Floating images container -->
      <div class="absolute inset-0 z-10 opacity-80">
        <!-- Album Cover 1 -->
        <div 
          class="absolute w-40 h-40 md:w-52 md:h-52" 
          style="top: 10%; left: 5%; animation: float 8s ease-in-out infinite;"
        >
          <CldImage 
            src="album1_47_grk5bt" 
            width="208"
            height="208"
            alt="浮动专辑封面1"
            class="w-full h-full rounded-lg shadow-2xl transform -rotate-12"
            format="auto" quality="auto"
          />
        </div>
        <!-- ... 其他浮动专辑封面 ... -->
        <div 
          class="absolute w-32 h-32 md:w-40 md:h-40" 
          style="top: 15%; right: 10%; animation: float 12s ease-in-out infinite; animation-delay: -2s;"
        >
          <CldImage 
            src="album2_pmt9fb"
            width="160"
            height="160"
            alt="浮动专辑封面2"
            class="w-full h-full rounded-lg shadow-2xl transform rotate-6"
            format="auto" quality="auto"
          />
        </div>
        <div 
          class="absolute w-28 h-28 md:w-36 md:h-36" 
          style="bottom: 10%; left: 20%; animation: float 10s ease-in-out infinite; animation-delay: -5s;"
        >
          <CldImage 
            src="album3_xe8x8y"
            width="144"
            height="144"
            alt="浮动专辑封面3"
            class="w-full h-full rounded-lg shadow-2xl transform rotate-3"
            format="auto" quality="auto"
          />
        </div>
        <div 
          class="absolute w-36 h-36 md:w-48 md:h-48" 
          style="bottom: 15%; right: 25%; animation: float 9s ease-in-out infinite; animation-delay: -7s;"
        >
          <CldImage 
            src="darkside_qphm4u"
            width="192"
            height="192"
            alt="浮动专辑封面4"
            class="w-full h-full rounded-lg shadow-2xl transform -rotate-3"
            format="auto" quality="auto"
          />
        </div>
        <div 
          class="absolute w-32 h-32 hidden md:block" 
          style="top: 60%; left: 8%; animation: float 11s ease-in-out infinite; animation-delay: -3s;"
        >
          <CldImage 
            src="album6_rxitq7"
            width="128"
            height="128"
            alt="浮动专辑封面5"
            class="w-full h-full rounded-lg shadow-2xl transform rotate-12"
            format="auto" quality="auto"
          />
        </div>
        <div 
          class="absolute w-32 h-32 hidden lg:block" 
          style="top: 55%; right: 12%; animation: float 13s ease-in-out infinite; animation-delay: -1s;"
        >
          <CldImage 
            src="album5_ptz4jw"
            width="128"
            height="128"
            alt="浮动专辑封面6"
            class="w-full h-full rounded-lg shadow-2xl transform -rotate-6"
            format="auto" quality="auto"
          />
        </div>
      </div>

      <!-- Overlay Text -->
      <div class="relative z-20 text-center px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.6);">Welcome</h1>
        <p class="mt-4 max-w-2xl mx-auto text-lg text-white" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.6);">to Valk's music zone</p>
      </div>
    </section>

    <!-- Self-introduction Section: 自我介绍 -->
    <section id="about" class="py-20 sm:py-32">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <!-- 个人照片 -->
          <div class="md:col-span-1 flex justify-center">
            <div class="w-64 h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-teal-400/50">
               <CldImage 
                 src="head_i3v0do" 
                 width="256"
                 height="256"
                 alt="个人照片"
                 class="w-full h-full object-cover"
                 :modifiers="{
                    effect: 'sharpen',
                    gravity: 'face',
                    zoom: 0.8
                 }"
                 format="auto"
                 quality="auto"
               />
            </div>
          </div>
          <!-- 自我介绍文本 -->
          <div class="md:col-span-2">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">About</h2>
            <p class="mt-6 text-lg leading-8 text-gray-300">
              你好，欢迎来到我的音乐空间。我是青衫，一名音乐爱好者，热衷于探索摇滚、爵士和古典。
            </p>
            <p class="mt-4 text-lg leading-8 text-gray-300">
              这个网站是我与世界分享作品的角落。你可以在这里听到我最近在听的专辑，阅读专辑背后的故事，或者只是随意逛逛。希望音乐能为你带来片刻的宁静或一丝共鸣。
            </p>
            <p class="mt-4 text-lg leading-8 text-gray-300">
              搜索请点击右上角音乐库。
            </p>
          </div>
        </div>
      </div>
    </section>

     <!-- Featured Music Section: 最近收藏的专辑 -->
    <section class="bg-cyan-700 py-20 sm:py-32">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">最近收藏</h2>
          <p class="mt-4 text-lg leading-8 text-gray-300">一些我最近收藏的专辑。</p>
        </div>
        
        <!-- 加载与错误状态处理 -->
        <div v-if="pending" class="text-center text-white mt-16">正在加载收藏...</div>
        <div v-else-if="error" class="text-center text-red-300 mt-16">加载收藏失败: {{ error.message }}</div>
        
        <!-- 专辑列表 -->
        <div v-else-if="collectedAlbums && collectedAlbums.length" class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AlbumCard v-for="album in collectedAlbums.slice(0, 3)" :key="album.album_mid" :album="album" />
        </div>

        <div v-else class="text-center text-gray-300 mt-16">暂无收藏专辑。</div>
      </div>
    </section>

  </div>
</template>

<script setup>
// 使用 useFetch 来获取收藏的专辑数据
const { data: collectedAlbums, pending, error } = await useFetch('/api/user/collected-albums');
</script>

<style>
/* 定义浮动动画 */
@keyframes float {
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(-20px);
	}
	100% {
		transform: translatey(0px);
	}
}
</style>
