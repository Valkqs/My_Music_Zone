// server/api/log.post.js
// 这个接口接收 POST 请求，并将收到的信息打印到服务器终端

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const songName = body.name || '未知歌曲';
    const songmid = body.mid || '未知MID';

    // 这部分内容将会显示在您的终端窗口中
    console.log(`\n\n- - - - - - - - - - - - - - - -`);
    console.log(`[播放记录] 正在播放: ${songName}`);
    console.log(`[播放记录] Song MID: ${songmid}`);
    console.log(`[博客代码] ::player[songmid=${songmid}]`);
    console.log(`- - - - - - - - - - - - - - - -\n`);

    return { status: 'ok', message: 'Log received' };
  } catch (error) {
    console.error('[API Log] 处理日志请求时出错:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error while logging.',
    });
  }
});
