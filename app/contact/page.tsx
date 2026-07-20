import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Mail, MapPin, Shield, Phone, MessageSquare, Send } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getContactSettings() {
  try {
    const settings = await prisma.setting.findMany({
      where: { group: 'CONTACT' }
    });
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    return map;
  } catch {
    return {};
  }
}

export default async function ContactPage() {
  const s = await getContactSettings();

  const contactEmail = s.contact_email || 'bharatfirst111@gmail.com';
  const pressEmail = s.press_email || s.contact_email || 'bharatfirst111@gmail.com';
  const tipsEmail = s.tips_email || s.contact_email || 'bharatfirst111@gmail.com';
  const phone = s.phone || '';
  const whatsapp = s.whatsapp || '';
  const telegramHandle = s.telegram_handle || '';
  const address = s.office_address || 'New Delhi, India';
  const city = s.city || '';

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
      <PublicHeader />

      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-4xl">
        <div className="mb-12 border-b border-[var(--border)] pb-8">
          <h1 className="text-display mb-4">Contact the Directorate</h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl">
            Secure communications and editorial desk information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* General */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
              <div className="flex items-center mb-3">
                <Mail className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                <h3 className="text-subhead">General Inquiries & Tips</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-3">For tips, classified leaks, and general communications.</p>
              <a href={`mailto:${tipsEmail}`} className="text-[var(--bhagwa)] font-medium hover:underline text-sm">{tipsEmail}</a>
            </div>

            {/* Press */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
              <div className="flex items-center mb-3">
                <Shield className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                <h3 className="text-subhead">Press & Media Inquiries</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-3">For syndication, interviews, and official statements.</p>
              <a href={`mailto:${pressEmail}`} className="text-[var(--bhagwa)] font-medium hover:underline text-sm">{pressEmail}</a>
            </div>

            {/* Phone/WhatsApp */}
            {(phone || whatsapp) && (
              <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
                <div className="flex items-center mb-3">
                  <Phone className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                  <h3 className="text-subhead">Phone & Messaging</h3>
                </div>
                {phone && (
                  <a href={`tel:${phone}`} className="text-[var(--bhagwa)] font-medium hover:underline text-sm block mb-2">
                    {phone}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--bhagwa)] font-medium hover:underline text-sm block"
                  >
                    WhatsApp: {whatsapp}
                  </a>
                )}
              </div>
            )}

            {/* Telegram */}
            {telegramHandle && (
              <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
                <div className="flex items-center mb-3">
                  <Send className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                  <h3 className="text-subhead">Telegram</h3>
                </div>
                <a
                  href={`https://t.me/${telegramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--bhagwa)] font-medium hover:underline text-sm"
                >
                  {telegramHandle}
                </a>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
              <div className="flex items-center mb-3">
                <MapPin className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                <h3 className="text-subhead">Headquarters</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{address}</p>
              {city && <p className="text-xs text-[var(--text-subtle)] mt-2">{city}</p>}
            </div>

            {/* Contact Form */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
              <div className="flex items-center mb-4">
                <MessageSquare className="text-[var(--bhagwa)] mr-3 shrink-0" size={20} />
                <h3 className="text-subhead">Send a Message</h3>
              </div>
              <form
                action={`mailto:${contactEmail}`}
                method="get"
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Your Name</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Name & affiliation"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--bhagwa)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Message</label>
                  <textarea
                    name="body"
                    required
                    rows={4}
                    placeholder="Your message..."
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--bhagwa)] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold bg-[var(--bhagwa)] hover:bg-[#e05e00] text-white rounded-sm transition-colors"
                >
                  Open Email Client
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
