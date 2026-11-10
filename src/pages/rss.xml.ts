import { getPublishedPosts } from '../lib/posts';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR, AUTHOR_EMAIL } from '../consts';
import rss from '@astrojs/rss';

export async function GET(context: { site: URL }) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? new URL(SITE_URL),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/posts/${post.id}/`,
    })),
    customData: `<language>zh-CN</language><managingEditor>${AUTHOR_EMAIL} (${AUTHOR})</managingEditor>`,
  });
}
