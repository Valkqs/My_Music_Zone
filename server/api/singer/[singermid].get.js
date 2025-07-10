// server/api/singer/[singermid].get.js
// 这个接口现在只负责获取歌手的描述信息

import { apiBaseUrl, fullUserCookieString } from '~/server/utils/config';

export default defineEventHandler(async (event) => {
  const singermid = event.context.params.singermid;
  const headers = { 'Cookie': fullUserCookieString };

  if (!singermid) {
    throw createError({ statusCode: 400, statusMessage: 'Singer MID is required' });
  }

  try {
    const singerInfoResponse = await $fetch(`${apiBaseUrl}/singer/desc?singermid=${singermid}`, { headers });
    const songsResponse = await $fetch(`${apiBaseUrl}/singer/songs?singermid=${singermid}&num=50`, { headers });
    
    return {
      name: singerInfoResponse?.data?.singername || songsResponse?.data?.singer?.name || '未知歌手',
      pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg`,
      desc: singerInfoResponse?.data?.desc || '暂无简介',
    };

  } catch (error) {
    console.error(`[API Proxy] 获取歌手描述失败 (singermid: ${singermid}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch singer description from backend.',
    });
  }
});
