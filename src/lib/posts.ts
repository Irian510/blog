import { getCollection, type CollectionEntry } from 'astro:content';

// 过滤草稿 + 按日期倒序 — 所有出口（首页/标签/归档/RSS/sitemap）只用它
// 任何地方不得直接 getCollection('posts') 绕过草稿过滤

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const all = await getCollection('posts');
  return all
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.data.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export async function getPostsByTag(tag: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.tags.includes(tag));
}

export async function getPostsByYear(): Promise<Record<number, CollectionEntry<'posts'>[]>> {
  const posts = await getPublishedPosts();
  const grouped: Record<number, CollectionEntry<'posts'>[]> = {};
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    (grouped[year] ||= []).push(post);
  }
  return grouped;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}
