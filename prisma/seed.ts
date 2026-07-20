import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log('Seeding baseline taxonomy and admin user...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bharatfirst.com' },
    update: {},
    create: {
      email: 'admin@bharatfirst.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create core categories
  const categories = [
    { name: 'Defence & Security', slug: 'defence-security', description: 'National defence and military intelligence' },
    { name: 'Geopolitics', slug: 'geopolitics', description: 'Global political strategy and international relations' },
    { name: 'Cyber Intelligence', slug: 'cyber-intelligence', description: 'Cyber warfare, hacking, and digital threats' },
    { name: 'OSINT Investigations', slug: 'osint', description: 'Open source intelligence reports' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
