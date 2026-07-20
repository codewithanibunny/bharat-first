const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding default homepage sections...');

  const defaultSections = [
    { name: 'Featured Hero Banner', type: 'HERO', order: 0, isVisible: true },
    { name: 'Latest Shorts Grid', type: 'SHORTS_GRID', order: 1, isVisible: true },
    { name: 'Latest Reports Desk', type: 'LATEST_REPORTS', order: 2, isVisible: true },
    { name: 'Ad Banner Slot', type: 'AD', order: 3, isVisible: true },
    { name: 'Newsletter Signup', type: 'NEWSLETTER', order: 4, isVisible: true }
  ];

  await prisma.pageSection.deleteMany();

  for (const s of defaultSections) {
    await prisma.pageSection.create({ data: s });
  }

  console.log('Sections seeded successfully.');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
