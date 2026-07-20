const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'India', slug: 'india' },
  { name: 'World', slug: 'world' },
  { name: 'Defence', slug: 'defence' },
  { name: 'OSINT', slug: 'osint' },
  { name: 'Cyber', slug: 'cyber' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Business', slug: 'business' },
  { name: 'Opinion', slug: 'opinion' },
  { name: 'Fact Check', slug: 'fact-check' },
];

async function seed() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
