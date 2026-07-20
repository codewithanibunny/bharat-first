const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding default menus...');

  // Seed Header Menu
  const headerMenu = await prisma.menu.upsert({
    where: { name: 'Main Navigation' },
    update: { location: 'HEADER' },
    create: { name: 'Main Navigation', location: 'HEADER' }
  });

  await prisma.menuItem.deleteMany({ where: { menuId: headerMenu.id } });

  const headerItems = [
    { title: 'India', url: '/category/india' },
    { title: 'World', url: '/category/world' },
    { title: 'Defence', url: '/category/defence' },
    { title: 'OSINT', url: '/osint' },
    { title: 'Cyber', url: '/category/cyber' },
    { title: 'Technology', url: '/category/technology' },
    { title: 'Business', url: '/category/business' },
    { title: 'Opinion', url: '/category/opinion' },
    { title: 'Fact Check', url: '/category/fact-check' }
  ];

  for (let i = 0; i < headerItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        title: headerItems[i].title,
        url: headerItems[i].url,
        order: i,
        menuId: headerMenu.id
      }
    });
  }

  console.log('Menus seeded successfully.');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
