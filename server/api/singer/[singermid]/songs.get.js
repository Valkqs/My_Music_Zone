// server/api/singer/[singermid]/songs.get.js
// 这个接口负责获取分页的歌手热门歌曲

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const singermid = event.context.params.singermid;
  const query = getQuery(event);
  const page = parseInt(query.page || '1');
  const pageSize = 20; // 每页显示20首歌曲

  const headers = { 'Cookie': fullUserCookieString };
  const apiUrl = `${apiBaseUrl}/singer/songs?singermid=${singermid}&num=${pageSize}&page=${page}`;

  try {
    const response = await $fetch(apiUrl, { headers });
    
    const songList = response?.data?.list?.map(song => ({
      type: 'song',
      name: song.name,
      singer: response?.data?.singer?.name || '未知歌手',
      songmid: song.mid,
      albummid: song.album.mid,
      albumname: song.album.name,
    })) || [];
    
    const total = response?.data?.total || 0;

    return {
      list: songList,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };

  } catch (error) {
    console.error(`[API Proxy] 获取歌手歌曲失败 (singermid: ${singermid}, page: ${page}):`, error);
    return { list: [], currentPage: page, totalPages: 1 };
  }
});
