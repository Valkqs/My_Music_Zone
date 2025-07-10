// server/api/articles/[slug].get.js
// 更新：智能解析 Markdown，拆分内容块

import fs from 'fs/promises';
import path from 'path';
import fm from 'front-matter';
import { marked } from 'marked';

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug;
  const filePath = path.join(process.cwd(), `content/blog/${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { attributes, body } = fm(fileContent);
    
    // 使用正则表达式拆分文章内容
    const contentBlocks = [];
    const playerRegex = /::player\[songmid=([a-zA-Z0-9]+)\]/g;
    
    let lastIndex = 0;
    let match;

    while ((match = playerRegex.exec(body)) !== null) {
      // 添加播放器前面的文本块
      if (match.index > lastIndex) {
        const text = body.substring(lastIndex, match.index);
        contentBlocks.push({
          type: 'html',
          content: marked(text),
        });
      }
      // 添加播放器块
      contentBlocks.push({
        type: 'player',
        songmid: match[1], // 提取出的 songmid
      });
      lastIndex = match.index + match[0].length;
    }

    // 添加最后一个文本块
    if (lastIndex < body.length) {
      const text = body.substring(lastIndex);
      contentBlocks.push({
        type: 'html',
        content: marked(text),
      });
    }

    return {
      ...attributes,
      content: contentBlocks, // 返回结构化的内容块数组
    };
  } catch (error) {
    console.error(`Article not found for slug: ${slug}`, error);
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
    });
  }
});
