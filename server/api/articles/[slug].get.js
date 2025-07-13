// server/api/articles/[slug].get.js
// 更新：支持解析 cld-image 标签，并将 alt 视为可选

import fs from 'fs/promises';
import path from 'path';
import fm from 'front-matter';
import { marked } from 'marked';

// 辅助函数：将 'key=value key2="value 2"' 这样的字符串解析成对象
function parseAttrs(attrsString) {
  const attrs = {};
  const regex = /(\w+)=("([^"]*)"|'([^']*)'|(\S+))/g;
  let match;
  while ((match = regex.exec(attrsString)) !== null) {
    attrs[match[1]] = match[3] || match[4] || match[5];
  }
  return attrs;
}

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug;
  const filePath = path.join(process.cwd(), `content/blog/${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { attributes, body } = fm(fileContent);
    
    // 正则表达式现在可以匹配 player 和 cld-image
    const contentBlocks = [];
    const componentRegex = /::(player|cld-image)\[(.*?)\]/g;
    
    let lastIndex = 0;
    let match;

    while ((match = componentRegex.exec(body)) !== null) {
      // 添加组件前面的文本块
      if (match.index > lastIndex) {
        const text = body.substring(lastIndex, match.index);
        contentBlocks.push({ type: 'html', content: marked(text) });
      }

      // 添加组件块
      const componentType = match[1]; // 'player' or 'cld-image'
      const attrsString = match[2];  // 'key=value ...'

      contentBlocks.push({
        type: componentType,
        props: parseAttrs(attrsString),
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加最后一个文本块
    if (lastIndex < body.length) {
      const text = body.substring(lastIndex);
      contentBlocks.push({ type: 'html', content: marked(text) });
    }

    return {
      ...attributes,
      content: contentBlocks.length > 0 ? contentBlocks : [{ type: 'html', content: marked(body) }],
    };
  } catch (error) {
    console.error(`Article not found for slug: ${slug}`, error);
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
    });
  }
});
