import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

type BlogPost = {
  slug: string;
  href?: string;
  title: string;
  description: string;
  date?: string;
  author?: string;
};

const blogDir = join(process.cwd(), "content", "blog");

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const parseFrontmatter = (source: string) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);

  if (!match) {
    return {} as Record<string, string>;
  }

  const entries = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");

      if (separator === -1) {
        return null;
      }

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");

      return [key, value] as const;
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);

  return Object.fromEntries(entries);
};

const getPosts = async (): Promise<BlogPost[]> => {
  const files = (await readdir(blogDir)).filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(join(blogDir, file), "utf8");
      const frontmatter = parseFrontmatter(source);
      const slug = file.replace(/\.md$/, "");

      return {
        slug,
        href: frontmatter.href,
        title: frontmatter.title ?? slug,
        description: frontmatter.description ?? "",
        date: frontmatter.date,
        author: frontmatter.author,
      } satisfies BlogPost;
    }),
  );

  return posts.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;

    return bTime - aTime;
  });
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const basePath = config.app.baseURL.replace(/\/$/, "");
  const siteRoot = `${config.public.siteUrl}${basePath}`;
  const posts = await getPosts();
  const lastBuildDate = posts[0]?.date
    ? new Date(posts[0].date).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const relativePath = post.href ?? `/blog/${post.slug}`;
      const url = `${siteRoot}${relativePath.replace(basePath, "")}`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      ${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ""}
      <description>${escapeXml(post.description)}</description>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Charles Turner blog</title>
    <link>${escapeXml(siteRoot)}</link>
    <description>Notes, experiments, and project writeups from Charles Turner.</description>
    <language>en-au</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteRoot}/feed.xml`)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");

  return xml;
});
