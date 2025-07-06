// server/api/album/[albummid].get.js
// 新增：在返回的专辑信息中包含歌手的 mid

export default defineEventHandler(async (event) => {
  const albummid = event.context.params.albummid;

  // 您的后端 API 地址和 Cookie
  const apiBaseUrl = "http://localhost:3300";
  const fullUserCookieString = "ptcz=e97b3a0a15dd32444b2a775948ddd1012f9032f7e1caee4daf72dba4d450c62a; pgv_pvid=3366873485; _qimei_q36=; fqm_pvqid=856bd5ec-8ffe-4492-9fa0-fbf0de5bb7bf; ts_uid=4635437155; suid=user_0_5F97yeKy0dnEH; _clck=3928533487|1|fvi|0; RK=MPkcs0kqRM; eas_sid=n197G4W8Q6m753l6p3e4I8O6V2; _qimei_uuid42=19617123815100ca848457f48e347462695e901dc7; _qimei_fingerprint=8c6d3b400d828b5aa48094d943725a13; _qimei_i_3=62e955849408548ec691fb6308d073b2a3e9f1f3175f5183bcd92c092e94286c63373f943c89e2968cf4; _qimei_h38=; ts_refer=www.bing.com/; fqm_sessionid=30e7e05e-f94e-440d-9117-1b37a659b7f7; pgv_info=ssid=s1396912030; ts_last=y.qq.com/; _qpsvr_localtk=0.3104076506034332; login_type=1; uin=673451014; tmeLoginType=2; euin=7wSi7e45oe6P; music_ignore_pskey=202306271436Hn@vBj; psrf_musickey_createtime=1751784875; wxunionid=; psrf_qqaccess_token=6CB6459B6CA1E8C07A8A0EBC9AD3B1D0; wxopenid=; psrf_qqrefresh_token=D96008E4C5BE9A9037C22F4BD6647323; qm_keyst=Q_H_L_63k3N7natkQ8vfKt1q-n_IzYt7Km_0euZy8gPsWjZdl6H7Ac3b_KuDgvLWS65Szm9k3XlQ4MrQte407VYj-qDcbAH; psrf_qqunionid=029F50493A36BBD9ACE1DC5B37461E6E; qqmusic_key=Q_H_L_63k3N7natkQ8vfKt1q-n_IzYt7Km_0euZy8gPsWjZdl6H7Ac3b_KuDgvLWS65Szm9k3XlQ4MrQte407VYj-qDcbAH; psrf_access_token_expiresAt=1756968875; psrf_qqopenid=24DFB61333DB1AAC7EF9E7C4CFE1D7E2; wxrefresh_token=; _qimei_i_1=56e65fd09d00";
  const headers = { 'Cookie': fullUserCookieString };

  if (!albummid) {
    throw createError({ statusCode: 400, statusMessage: 'Album MID is required' });
  }

  try {
    const songsResponse = await $fetch(`${apiBaseUrl}/album/songs?albummid=${albummid}`, { headers });

    const firstSong = songsResponse?.data?.list?.[0];
    const albumInfo = {
      name: firstSong?.album?.name || '未知专辑',
      // 将歌手信息改为一个包含名字和MID的数组
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
