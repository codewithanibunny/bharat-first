import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /feed.xml
 *
 * RSS 2.0 feed of the latest published articles.
 * Used by feed readers, news aggregators, and Google News.
 */
export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://bharatfirst.in';

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      excerpt: true,
      imageUrl: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  const items = articles
    .map((article) => {
      const pubDate = new Date(article.publishedAt || article.createdAt).toUTCString();
      const url = `${baseUrl}/article/${article.id}`;
      const description = article.excerpt
        ? `<![CDATA[${article.excerpt}]]>`
        : '';
      const imageTag = article.imageUrl
        ? `<media:content url="${article.imageUrl}" medium="image" />`
        : '';

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <author>${article.author?.name || 'Bharat First Editorial'}</author>
      <category>${article.category?.name || 'General'}</category>
      ${imageTag}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bharat First — Intelligence &amp; Research Platform</title>
    <link>${baseUrl}</link>
    <description>India's premier independent OSINT, defence, cybersecurity, and geopolitical research platform.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>bharatfirst111@gmail.com (Bharat First)</managingEditor>
    <webMaster>bharatfirst111@gmail.com (Bharat First)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>Bharat First</title>
      <link>${baseUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
