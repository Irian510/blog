#!/usr/bin/env node
// 新建文章：npm run new -- "标题" [--tags 标签1,标签2] [--publish]
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src', 'content', 'posts');

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith('--')) ?? '';

if (!title) {
  console.error('用法: npm run new -- "文章标题" [--tags 随笔,记录] [--publish]');
  process.exit(1);
}

const tagsIdx = args.indexOf('--tags');
const tags =
  tagsIdx !== -1 && args[tagsIdx + 1]
    ? args[tagsIdx + 1].split(',').map((t) => t.trim()).filter(Boolean)
    : [];
const publish = args.includes('--publish');

// slug: 中文保留，空格转短横线，去掉非法字符
const slug = title
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[/\\?%*:|"<>]/g, '')
  .replace(/-+/g, '-');

const dir = join(postsDir, slug);

try {
  await access(dir);
  console.error(`目录已存在，换一个标题或先删除：${dir}`);
  process.exit(1);
} catch {}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const frontmatter = `---
title: ${title}
date: "${date}"
description: ""
tags: [${tags.join(', ')}]
draft: ${publish ? 'false' : 'true'}
---

在这里开始写正文。

`;

await mkdir(dir, { recursive: true });
await writeFile(join(dir, 'index.md'), frontmatter, 'utf8');

console.log(`已创建：src/content/posts/${slug}/index.md`);
console.log(`状态：${publish ? '已发布' : '草稿（draft: true，线上不会出现）'}`);
console.log(`本地预览：npm run dev`);
