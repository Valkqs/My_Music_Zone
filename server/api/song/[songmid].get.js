// server/api/song/[songmid].get.js
// 更新：从配置文件导入 Cookie 和 API 地址

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const songmid = event.context.params.songmid;
  const headersWithCookie = { 'Cookie': fullUserCookieString };
  const quality = "320";

  if (!songmid) {
    throw createError({ statusCode: 400, statusMessage: 'Song MID is required' });
  }

  const parsePlayUrl = (response, mid) => {
    if (!response) return null;
    if (response.result === 100 && typeof response.data === 'string' && response.data.startsWith('http')) {
      return response.data;
    }
    if (response.req_0?.data?.midurlinfo?.[0]?.purl) {
      return response.req_0.data.midurlinfo[0].purl;
    }
    if (response[mid]) {
      return response[mid];
    }
    return null;
  };

  try {
    const detailsResponse = await $fetch(`${apiBaseUrl}/song?songmid=${songmid}`, { headers: headersWithCookie });

    let actualPlayUrl = null;
    const playUrlResponseWithCookie = await $fetch(`${apiBaseUrl}/song/url?id=${songmid}&type=${quality}`, { headers: headersWithCookie });
    actualPlayUrl = parsePlayUrl(playUrlResponseWithCookie, songmid);

    if (!actualPlayUrl) {
      const playUrlResponseWithoutCookie = await $fetch(`${apiBaseUrl}/song/url?id=${songmid}&type=${quality}`);
      actualPlayUrl = parsePlayUrl(playUrlResponseWithoutCookie, songmid);
    }

    let albumArt = null;
    const albumMid = detailsResponse?.data?.track_info?.album?.mid;
    if (albumMid) {
      albumArt = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg`;
    }

    return {
      url: actualPlayUrl,
      albumArt: albumArt,
    };

  } catch (error) {
    console.error(`[API Proxy] 获取歌曲数据时发生严重错误 (songmid: ${songmid}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch song data from backend.',
    });
  }
});
