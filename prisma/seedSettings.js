const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultSettings = [
  // GENERAL
  { key: 'site_name', value: 'Bharat First', group: 'GENERAL', type: 'TEXT' },
  { key: 'site_tagline', value: 'Truth. Research. Bharat First.', group: 'GENERAL', type: 'TEXT' },
  { key: 'site_description', value: 'Independent Open Source Intelligence, defence analysis, and geopolitical research platform.', group: 'GENERAL', type: 'TEXT' },
  
  // CONTACT
  { key: 'contact_email', value: 'bharatfirst111@gmail.com', group: 'CONTACT', type: 'TEXT' },
  { key: 'media_email', value: 'bharatfirst111@gmail.com', group: 'CONTACT', type: 'TEXT' },
  { key: 'secure_email', value: 'bharatfirst111@gmail.com', group: 'CONTACT', type: 'TEXT' },
  { key: 'office_address', value: 'New Delhi, India\n(Exact coordinates redacted for security)', group: 'CONTACT', type: 'TEXT' },
  
  // BRANDING
  { key: 'logo_url', value: '', group: 'BRANDING', type: 'IMAGE' },
  { key: 'favicon_url', value: '', group: 'BRANDING', type: 'IMAGE' },
  { key: 'primary_color', value: '#FF6B00', group: 'THEME', type: 'COLOR' },
  { key: 'secondary_color', value: '#0D0D0D', group: 'THEME', type: 'COLOR' },
  
  // SEO
  { key: 'meta_title', value: 'Bharat First — Independent Intelligence & Research Platform', group: 'SEO', type: 'TEXT' },
  { key: 'meta_description', value: 'India\'s premier independent OSINT, defence, cybersecurity, and geopolitical research platform.', group: 'SEO', type: 'TEXT' },
  
  // SOCIAL
  { key: 'twitter_url', value: 'https://twitter.com/bharatfirst', group: 'SOCIAL', type: 'TEXT' },
  { key: 'telegram_url', value: 'https://t.me/bharatfirst', group: 'SOCIAL', type: 'TEXT' }
];

async function seedSettings() {
  console.log('Seeding default settings...');
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('Default settings seeded successfully.');
}

seedSettings()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
