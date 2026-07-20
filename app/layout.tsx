import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";
import { NextAuthProvider } from "@/providers/SessionProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";
import prisma from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.setting.findMany({ where: { group: 'SEO' } });
    const getSetting = (k: string, defaultVal: string) => settings.find(s => s.key === k)?.value || defaultVal;
    
    const baseUrl = process.env.NEXTAUTH_URL || 'https://bharatfirst.in';
    const title = getSetting('meta_title', 'Bharat First — Independent Intelligence & Research Platform');
    const description = getSetting('meta_description', "India's premier independent OSINT, defence, cybersecurity, and geopolitical research platform. Truth. Research. Bharat First.");
    const ogImage = getSetting('og_image', `${baseUrl}/og-default.png`);

    return {
      title: { default: title, template: '%s | Bharat First' },
      description,
      keywords: ['OSINT', 'India', 'Defence', 'Cybersecurity', 'Geopolitics', 'Intelligence', 'Research', 'Bharat First'],
      authors: [{ name: 'Bharat First', url: baseUrl }],
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: baseUrl,
        types: { 'application/rss+xml': `${baseUrl}/feed.xml` },
      },
      openGraph: {
        title,
        description,
        siteName: 'Bharat First',
        type: 'website',
        url: baseUrl,
        images: [{ url: ogImage, width: 1200, height: 630, alt: 'Bharat First' }],
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
        site: '@bharatfirst',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
      },
    };
  } catch {
    return {
      title: { default: 'Bharat First — Independent Intelligence & Research Platform', template: '%s | Bharat First' },
      description: "India's premier independent OSINT, defence, cybersecurity, and geopolitical research platform.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let primaryColor = '#FF6B00';
  let secondaryColor = '#0D0D0D';
  let fontHeading = 'Playfair Display';
  let fontBody = 'Inter';

  try {
    const settings = await prisma.setting.findMany({ where: { group: 'THEME' } });
    const getSetting = (k: string, defaultVal: string) => settings.find(s => s.key === k)?.value || defaultVal;
    primaryColor = getSetting('primary_color', '#FF6B00');
    secondaryColor = getSetting('secondary_color', '#0D0D0D');
    fontHeading = getSetting('font_heading', 'Playfair Display');
    fontBody = getSetting('font_body', 'Inter');
  } catch {
    // Use defaults if DB is unavailable
  }

  const customThemeCSS = `
    :root {
      --bhagwa: ${primaryColor};
      --accent: ${primaryColor};
      --font-inter: "${fontBody}", system-ui, -apple-system, sans-serif;
      --font-playfair: "${fontHeading}", Georgia, serif;
    }
    html[data-theme="dark"] {
      --background: ${secondaryColor};
    }
  `;

  // Encode fonts for Google Fonts API
  const encodedHeading = fontHeading.replace(/ /g, '+');
  const encodedBody = fontBody.replace(/ /g, '+');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${encodedBody}:wght@300;400;500;600;700&family=${encodedHeading}:wght@400;500;600;700;800;900&display=swap`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="Bharat First RSS Feed" href="/feed.xml" />
        <style dangerouslySetInnerHTML={{ __html: customThemeCSS }} />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsMediaOrganization',
            name: 'Bharat First',
            url: process.env.NEXTAUTH_URL || 'https://bharatfirst.in',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.NEXTAUTH_URL || 'https://bharatfirst.in'}/favicon.ico`,
            },
            description: "India's premier independent OSINT, defence, cybersecurity, and geopolitical research platform.",
            foundingDate: '2024',
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'bharatfirst111@gmail.com',
              contactType: 'editorial',
            },
            sameAs: [],
          }) }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter)' }}>
        <NextAuthProvider>
          <AppProvider>
            {children}
            <CookieConsent />
          </AppProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
