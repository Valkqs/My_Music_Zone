// server/api/song-details/[songmid].get.js
// 这个接口负责根据 songmid 获取歌曲的基本信息（歌名、歌手、封面等）

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const songmid = event.context.params.songmid;
  const headers = { 'Cookie': fullUserCookieString };

  if (!songmid) {
    throw createError({ statusCode: 400, statusMessage: 'Song MID is required' });
  }

  const apiUrl = `${apiBaseUrl}/song?songmid=${songmid}`;

  try {
    const response = await $fetch(apiUrl, { headers });

    if (response?.data?.track_info) {
      const trackInfo = response.data.track_info;
      const albumMid = trackInfo.album?.mid;
      const albumArt = albumMid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg` : null;

      return {
        name: trackInfo.name || '未知歌曲',
        singer: trackInfo.singer?.map(s => s.name).join(', ') || '未知歌手',
        albumArt: albumArt,
      };
    }
    
    throw createError({ statusCode: 404, statusMessage: 'Song details not found' });

  } catch (error) {
    console.error(`[API Proxy] 获取歌曲详情失败 (songmid: ${songmid}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch song details from backend.',
    });
  }
});
