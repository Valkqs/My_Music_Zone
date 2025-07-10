// server/api/album/[albummid].get.js
// 更新：从配置文件导入 Cookie 和 API 地址

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const albummid = event.context.params.albummid;
  const headers = { 'Cookie': fullUserCookieString };

  if (!albummid) {
    throw createError({ statusCode: 400, statusMessage: 'Album MID is required' });
  }

  try {
    const songsResponse = await $fetch(`${apiBaseUrl}/album/songs?albummid=${albummid}`, { headers });

    const firstSong = songsResponse?.data?.list?.[0];
    const albumInfo = {
      name: firstSong?.album?.name || '未知专辑',
      singers: firstSong?.singer?.map(s => ({ name: s.name, mid: s.mid })) || [],
      picUrl: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg`,
      publicTime: firstSong?.album?.time_public || '',
    };

    const songList = songsResponse?.data?.list?.map(song => ({
      type: 'song',
      name: song.name,
      singer: song.singer.map(s => s.name).join(', '),
      songmid: song.mid,
      albummid: albummid,
    })) || [];

    return { albumInfo, songList };

  } catch (error) {
    console.error(`[API Proxy] 获取专辑数据失败 (albummid: ${albummid}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch album data from backend.',
    });
  }
});
