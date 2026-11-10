// 项目站点子路径 base 拼接
// 所有内部链接必须走它，这是 GitHub Pages 项目站点 404 的最常见坑

export function withBase(path: string): string {
  if (!path) return path;
  const base = import.meta.env.BASE_URL;
  // 已含 base 的不重复拼
  if (path.startsWith(base)) return path;
  // 绝对 URL 不动
  if (/^https?:\/\//.test(path)) return path;
  // 确保 base 末尾有 /，path 开头有 /
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return normalizedBase + normalizedPath.slice(1);
}
