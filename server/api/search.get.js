// server/api/search.get.js
// 修正：从中央配置文件导入 Cookie 和 API 地址

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = query.key || ''
  const searchMode = query.type || 'song'
  const limit = 20

  const typeMap = {
    song: 0,
    album: 8,
    singer: 9,
  };
  const searchTypeParam = typeMap[searchMode] || 0;

  const searchUrl = `${apiBaseUrl}/search?key=${encodeURIComponent(keyword)}&limit=${limit}&t=${searchTypeParam}`;

  // 定义一个函数来清理HTML标签
  const cleanupName = (name) => name ? name.replace(/<em>|<\/em>/g, '') : '';

  try {
    const response = await $fetch(searchUrl, {
      headers: { 'Cookie': fullUserCookieString }
    });
    
    if (response?.data?.list) {
      if (searchMode === 'song') {
        return response.data.list.map(song => ({
          type: 'song',
          name: cleanupName(song?.songname_hilight || song?.songname),
          singers: song?.singer?.map(s => ({ name: s.name, mid: s.mid })) || [],
          songmid: song?.songmid,
          albummid: song?.albummid,
          albumname: cleanupName(song?.albumname_hilight || song?.albumname),
        }));
      } 
      else if (searchMode === 'album') {
        return response.data.list.map(album => ({
            type: 'album',
            album_name: cleanupName(album?.albumName_hilight || album?.albumName),
            album_pic: album?.albumPic,
            singer_name: cleanupName(album?.singerName_hilight || album?.singerName),
            album_mid: album?.albumMID,
        }));
      }
      else if (searchMode === 'singer') {
        return response.data.list.map(singer => ({
          type: 'singer',
          singer_name: cleanupName(singer?.singerName_hilight || singer?.singerName),
          singer_pic: singer?.singerPic,
          singer_mid: singer?.singerMID,
        }));
      }
    }
    return [];
  } catch (error) {
    console.error(`[API Proxy] 请求失败 (searchMode: ${searchMode}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch search results from backend.',
    });
  }
});
