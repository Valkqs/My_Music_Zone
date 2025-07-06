// server/api/singer/[singermid].get.js
// 修正了数据解析逻辑以匹配真实的 API 响应

export default defineEventHandler(async (event) => {
  const singermid = event.context.params.singermid;

  // 您的后端 API 地址和 Cookie
  const apiBaseUrl = "http://localhost:3300";
  const fullUserCookieString = "ptcz=e97b3a0a15dd32444b2a775948ddd1012f9032f7e1caee4daf72dba4d450c62a; pgv_pvid=3366873485; _qimei_q36=; fqm_pvqid=856bd5ec-8ffe-4492-9fa0-fbf0de5bb7bf; ts_uid=4635437155; suid=user_0_5F97yeKy0dnEH; _clck=3928533487|1|fvi|0; RK=MPkcs0kqRM; eas_sid=n197G4W8Q6m753l6p3e4I8O6V2; _qimei_uuid42=19617123815100ca848457f48e347462695e901dc7; _qimei_fingerprint=8c6d3b400d828b5aa48094d943725a13; _qimei_i_3=62e955849408548ec691fb6308d073b2a3e9f1f3175f5183bcd92c092e94286c63373f43c89e2968cf4; _qimei_h38=; fqm_sessionid=a4c28058-23be-4873-882c-ed08036c3e61; pgv_info=ssid=s1951970000; ts_last=y.qq.com/; ts_refer=www.bing.com/; _qpsvr_localtk=0.28673906336487076; login_type=1; psrf_qqrefresh_token=D96008E4C5BE9A9037C22F4BD6647323; uin=673451014; psrf_qqopenid=24DFB61333DB1AAC7EF9E7C4CFE1D7E2; psrf_qqunionid=029F50493A36BBD9ACE1DC5B37461E6E; psrf_access_token_expiresAt=1756709123; music_ignore_pskey=202306271436Hn@vBj; wxrefresh_token=; wxunionid=; tmeLoginType=2; euin=7wSi7e45oe6P; qm_keyst=Q_H_L_63k3Nw8Wv-yc0bVZvHNLwx8S2V5Oi2bHFUVPB2Cfe3vwBAW_Yb08F95y36jPcFlcdTC1XU479Oauv8BtqEU0_YZAo; qqmusic_key=Q_H_L_63k3Nw8Wv-yc0bVZvHNLwx8S2V5Oi2bHFUVPB2Cfe3vwBAW_Yb08F95y36jPcFlcdTC1XU479Oauv8BtqEU0_YZAo; psrf_qqaccess_token=6CB6459B6CA1E8C07A8A0EBC9AD3B1D0; wxopenid=; psrf_musickey_createtime=1751525124; _qimei_i_1=45b948d8ca00";
  const headers = { 'Cookie': fullUserCookieString };

  if (!singermid) {
    throw createError({ statusCode: 400, statusMessage: 'Singer MID is required' });
  }

  try {
    const [singerInfoResponse, songsResponse] = await Promise.all([
      $fetch(`${apiBaseUrl}/singer/desc?singermid=${singermid}`, { headers }),
      $fetch(`${apiBaseUrl}/singer/songs?singermid=${singermid}&num=50`, { headers })
    ]);

    // 格式化歌手信息，使用正确的路径
    const singerInfo = {
      // 从 /singer/songs 响应中获取名字，更可靠
      name: songsResponse?.data?.singer?.name || '未知歌手',
      pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg`,
      // 从 /singer/desc 响应中获取简介
      desc: singerInfoResponse?.data?.desc || '暂无简介',
    };

    // 格式化歌曲列表
    const songList = songsResponse?.data?.list?.map(song => ({
      type: 'song',
      name: song.name,
      singer: singerInfo.name, // 使用上面获取到的歌手名
      songmid: song.mid,
      albummid: song.album.mid,
      albumname: song.album.name,
    })) || [];

    return { singerInfo, songList };

  } catch (error) {
    console.error(`[API Proxy] 获取歌手数据失败 (singermid: ${singermid}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch singer data from backend.',
    });
  }
});
