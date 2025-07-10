// server/api/user/collected-albums.get.js
// 更新：从配置文件导入 Cookie 和 API 地址

import { apiBaseUrl, uin, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const headers = { 'Cookie': fullUserCookieString };
  const apiUrl = `${apiBaseUrl}/user/collect/album?id=${uin}&pageSize=30`;

  try {
    const response = await $fetch(apiUrl, { headers });

    if (response?.data?.list) {
      const sortedList = response.data.list.sort((a, b) => b.ordertime - a.ordertime);

      return sortedList.map(album => {
        const picUrl = album.pic || '';
        const match = picUrl.match(/M000([a-zA-Z0-9]+)/);
        const albumMid = match ? match[1] : null;

        return {
          album_name: album.albumname || '未知专辑',
          album_pic: picUrl,
          singer_name: album.singername || '未知歌手',
          album_mid: albumMid,
        }
      });
    }

    return [];
  } catch (error) {
    console.error('[API Proxy] 获取收藏专辑失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch collected albums.',
    });
  }
});
