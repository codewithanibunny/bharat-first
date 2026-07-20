import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.isPublished) {
    return { title: "Page Not Found - Bharat First" };
  }

  return {
    title: `${page.seoTitle || page.title} - Bharat First`,
    description: page.seoDesc || page.excerpt,
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <PublicHeader />

      <main className="flex-grow">
        {page.layout === "full-width" ? (
          <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            {page.layout !== "minimal" && (
              <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  {page.title}
                </h1>
                {page.excerpt && (
                  <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    {page.excerpt}
                  </p>
                )}
              </header>
            )}
            
            <div 
              className="prose prose-invert prose-orange max-w-none prose-headings:font-bold prose-a:text-orange-500 hover:prose-a:text-orange-400 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: page.content }} 
            />
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
