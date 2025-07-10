// server/api/articles.get.js
// 这个接口负责读取所有博客文章的摘要信息

import fs from 'fs/promises';
import path from 'path';
import fm from 'front-matter';

export default defineEventHandler(async () => {
  try {
    const contentDir = path.join(process.cwd(), 'content/blog');
    const files = await fs.readdir(contentDir);
    
    const articles = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(contentDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          // 解析 Markdown 文件头部的元数据
          const { attributes } = fm(content);
          return {
            ...attributes,
            // 从文件名创建 slug
            slug: file.replace(/\.md$/, ''),
          };
        })
    );

    // 按日期倒序排列
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    return articles;
  } catch (error) {
    console.error('Error reading articles directory:', error);
    // 如果 content/blog 目录不存在或读取失败，返回空数组
    return [];
  }
});
