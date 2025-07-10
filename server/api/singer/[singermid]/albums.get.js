// server/api/singer/[singermid]/albums.get.js
// 修正：使用 album_mid 来手动构建专辑封面链接

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const singermid = event.context.params.singermid;
  const query = getQuery(event);
  const page = parseInt(query.page || '1');
  const pageSize = 20; // 每页显示20张专辑

  const headers = { 'Cookie': fullUserCookieString };
  const apiUrl = `${apiBaseUrl}/singer/album?singermid=${singermid}&pageSize=${pageSize}&pageNo=${page}`;

  try {
    const response = await $fetch(apiUrl, { headers });

    if (response?.data?.list) {
      const albumList = response.data.list.map(album => {
        // 使用 album_mid 来构建完整的图片链接
        const albumPicUrl = album.album_mid 
          ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${album.album_mid}.jpg`
          : null;

        return {
          album_name: album.album_name,
          album_pic: albumPicUrl, // 使用新构建的链接
          singer_name: album.singer_name,
          album_mid: album.album_mid,
        };
      });
      
      const total = response?.data?.total || 0;

      return {
        list: albumList,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      };
    }
    
    return { list: [], currentPage: page, totalPages: 1 };

  } catch (error) {
    console.error(`[API Proxy] 获取歌手专辑失败 (singermid: ${singermid}, page: ${page}):`, error);
    return { list: [], currentPage: page, totalPages: 1 };
  }
});
