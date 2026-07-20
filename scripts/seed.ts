import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create category
  const category = await prisma.category.upsert({
    where: { slug: 'osint-research' },
    update: {},
    create: {
      name: 'OSINT Research',
      slug: 'osint-research',
      description: 'Open source intelligence reports and deep dives.',
    },
  });

  // Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@bharatfirst.com' },
    update: {},
    create: {
      email: 'admin@bharatfirst.com',
      password: '$2a$10$X7...', // dummy hash for seed
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  // Create article
  await prisma.article.upsert({
    where: { slug: 'test-intelligence-report' },
    update: {},
    create: {
      title: 'Global Cybersecurity Threat Landscape: Q3 Analysis',
      slug: 'test-intelligence-report',
      excerpt: 'A comprehensive deep dive into emerging nation-state actors and their latest offensive capabilities targeting critical infrastructure.',
      content: 'This is a securely verified intelligence report generated for testing the CMS framework.\n\n### Key Findings\n- Increased APT activity observed in the Asia-Pacific region.\n- Novel malware variants bypassing traditional EDR solutions.\n- Supply chain vulnerabilities remain the primary vector of compromise.',
      status: 'PUBLISHED',
      featured: true,
      breaking: true,
      isOSINT: true,
      categoryId: category.id,
      authorId: user.id,
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    }
  });

  // Create short
  await prisma.shortNews.create({
    data: {
      title: 'UNUSUAL NAVAL ACTIVITY DETECTED',
      summary: 'Satellite imagery confirms uncharacteristic naval deployments in the South China Sea. Monitoring ongoing.',
      type: 'GEOINT',
      priority: 'high',
      location: 'SOUTH CHINA SEA',
      categoryId: category.id,
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
