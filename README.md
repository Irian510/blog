# Irian 个人博客

基于 [Astro](https://astro.build/) 的静态博客，自动部署到 GitHub Pages。

- 线上地址：https://irian510.github.io/blog/
- 仓库：https://github.com/Irian510/blog

## 快速开始

```bash
npm install
npm run dev      # 本地预览 http://localhost:4321/blog/
npm run build    # 构建到 dist/
```

## 写一篇新文章

```bash
npm run new -- "文章标题"
npm run new -- "文章标题" --tags 随笔,记录
npm run new -- "文章标题" --publish     # 直接发布（默认是草稿）
```

会生成 `src/content/posts/<slug>/index.md`，目录名就是文章地址，**建好之后不要改**。

## 文章目录结构

```
src/content/posts/
└── hello-world/
    ├── index.md      ← 正文 + frontmatter
    └── cover.svg     ← 配图，和正文同目录
```

正文里直接写相对路径引用图片，Astro 会在构建期自动优化：

```markdown
![说明](./cover.svg)
```

## frontmatter 规则

```yaml
---
title: 文章标题                      # 必填
date: "2026-11-10"                  # 必填，必须加引号，格式 YYYY-MM-DD
description: 一句话摘要              # 可选，用于 SEO 和 RSS
tags: [随笔, 记录]                   # 可选
draft: true                         # 可选，true = 草稿，线上不出现
---
```

日期**必须加引号**。YAML 会把未加引号的非法日期（如 `2026-13-45`）静默溢出成别的日期，加了引号后构建会直接失败并指出文件，这是刻意设计的。

## 发布

```bash
git add .
git commit -m "post: 新文章"
git push
```

推送后 GitHub Actions 自动构建并发布，约 1 分钟上线。查看进度：

```bash
gh run list -R Irian510/blog
```

## 三条红线

1. **草稿不会发布** —— `draft: true` 的文章本地可见、线上不出现
2. **图片必须放文章同目录** —— 不要堆到 `public/`
3. **文章目录名 = 地址** —— 改目录名等于换链接，已分享出去的会 404

## 图片建议

单张压缩到 1MB 以内，长边不超过 2000px，避免仓库膨胀。

## 目录说明

| 路径 | 用途 |
|---|---|
| `src/consts.ts` | 站点名、描述、导航，改文案只改这里 |
| `src/lib/url.ts` | `withBase()` 拼接子路径，内部链接必须走它 |
| `src/lib/posts.ts` | `getPublishedPosts()` 统一过滤草稿 |
| `src/content.config.ts` | 内容集合 schema 与日期校验 |
| `src/pages/` | 所有页面路由 |
| `src/styles/global.css` | 全站样式与暗色变量 |
| `public/` | 静态资源（favicon、robots.txt、OG 图） |
| `scripts/new-post.mjs` | 新建文章脚本 |
