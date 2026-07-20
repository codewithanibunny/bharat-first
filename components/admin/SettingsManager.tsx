"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, Globe, Mail, Share2, Palette, Search, ToggleLeft, ToggleRight,
  Radio, Key, Bell, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronRight,
  Megaphone, Shield, BarChart3, Sliders, Type, Phone, MapPin, MessageSquare
} from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  group: string;
  type: string;
}

type SettingsMap = Record<string, string>;

interface SettingSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  fields: SettingField[];
}

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'color' | 'textarea' | 'toggle' | 'number' | 'select';
  placeholder?: string;
  help?: string;
  group: string;
  options?: string[];
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    id: 'general',
    label: 'General',
    icon: <Globe size={16} />,
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Bharat First', group: 'GENERAL' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'Truth · Research · Bharat First', group: 'GENERAL' },
      { key: 'site_description', label: 'Site Description', type: 'textarea', placeholder: 'Independent intelligence & research platform', group: 'GENERAL' },
      { key: 'logo_url', label: 'Logo URL', type: 'url', placeholder: 'https://...', group: 'GENERAL', help: 'Link to your logo image (SVG or PNG)' },
      { key: 'logo_dark_url', label: 'Dark Logo URL', type: 'url', placeholder: 'https://...', group: 'GENERAL' },
      { key: 'favicon_url', label: 'Favicon URL', type: 'url', placeholder: 'https://...', group: 'GENERAL' },
      { key: 'copyright_text', label: 'Copyright Text', type: 'text', placeholder: '© 2025 Bharat First. All rights reserved.', group: 'GENERAL' },
      { key: 'announcement_active', label: 'Show Announcement Bar', type: 'toggle', group: 'GENERAL' },
      { key: 'announcement_text', label: 'Announcement Text', type: 'text', placeholder: 'Breaking: ...', group: 'GENERAL' },
      { key: 'announcement_link', label: 'Announcement Link', type: 'url', placeholder: 'https://...', group: 'GENERAL' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Mail size={16} />,
    fields: [
      { key: 'contact_email', label: 'General Email', type: 'email', placeholder: 'contact@bharatfirst.in', group: 'CONTACT' },
      { key: 'press_email', label: 'Press & Media Email', type: 'email', placeholder: 'press@bharatfirst.in', group: 'CONTACT' },
      { key: 'tips_email', label: 'Tips & Leaks Email', type: 'email', placeholder: 'tips@bharatfirst.in', group: 'CONTACT' },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 ...', group: 'CONTACT' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+91 ...', group: 'CONTACT' },
      { key: 'telegram_handle', label: 'Telegram Handle', type: 'text', placeholder: '@BharatFirst', group: 'CONTACT' },
      { key: 'office_address', label: 'Office Address', type: 'textarea', placeholder: 'New Delhi, India', group: 'CONTACT' },
      { key: 'city', label: 'City', type: 'text', placeholder: 'New Delhi', group: 'CONTACT' },
      { key: 'google_maps_url', label: 'Google Maps URL', type: 'url', placeholder: 'https://maps.google.com/...', group: 'CONTACT' },
    ],
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: <Share2 size={16} />,
    fields: [
      { key: 'twitter_url', label: 'X (Twitter) URL', type: 'url', placeholder: 'https://x.com/BharatFirst', group: 'SOCIAL' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...', group: 'SOCIAL' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...', group: 'SOCIAL' },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'SOCIAL' },
      { key: 'telegram_url', label: 'Telegram Channel URL', type: 'url', placeholder: 'https://t.me/...', group: 'SOCIAL' },
      { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/...', group: 'SOCIAL' },
      { key: 'koo_url', label: 'Koo URL', type: 'url', placeholder: 'https://kooapp.com/...', group: 'SOCIAL' },
      { key: 'sharechat_url', label: 'ShareChat URL', type: 'url', placeholder: 'https://sharechat.com/...', group: 'SOCIAL' },
    ],
  },
  {
    id: 'seo',
    label: 'SEO & Meta',
    icon: <Search size={16} />,
    fields: [
      { key: 'meta_title', label: 'Default Meta Title', type: 'text', placeholder: 'Bharat First — Independent Intelligence & Research', group: 'SEO' },
      { key: 'meta_description', label: 'Default Meta Description', type: 'textarea', placeholder: "India's premier OSINT, defence, and geopolitical research platform", group: 'SEO' },
      { key: 'og_image_url', label: 'Default OG Image URL', type: 'url', placeholder: 'https://...', group: 'SEO', help: 'Used for social media sharing cards' },
      { key: 'robots_txt', label: 'Robots.txt Content', type: 'textarea', placeholder: 'User-agent: *\nAllow: /', group: 'SEO' },
      { key: 'canonical_url', label: 'Canonical Base URL', type: 'url', placeholder: 'https://bharatfirst.in', group: 'SEO' },
      { key: 'schema_org_type', label: 'Schema.org Type', type: 'select', options: ['NewsMediaOrganization', 'Blog', 'WebSite'], group: 'SEO' },
    ],
  },
  {
    id: 'theme',
    label: 'Branding & Theme',
    icon: <Palette size={16} />,
    fields: [
      { key: 'primary_color', label: 'Primary (Bhagwa) Color', type: 'color', group: 'THEME' },
      { key: 'secondary_color', label: 'Dark Background Color', type: 'color', group: 'THEME' },
      { key: 'accent_color', label: 'Accent Color', type: 'color', group: 'THEME' },
      { key: 'font_heading', label: 'Heading Font', type: 'select', options: ['Playfair Display', 'Georgia', 'Merriweather', 'Lora', 'EB Garamond'], group: 'THEME' },
      { key: 'font_body', label: 'Body Font', type: 'select', options: ['Inter', 'Roboto', 'Open Sans', 'Source Sans Pro', 'IBM Plex Sans'], group: 'THEME' },
      { key: 'border_radius', label: 'Border Radius Style', type: 'select', options: ['none', 'sm', 'md', 'lg', 'full'], group: 'THEME' },
      { key: 'default_theme', label: 'Default Theme', type: 'select', options: ['dark', 'light'], group: 'THEME' },
    ],
  },
  {
    id: 'features',
    label: 'Feature Toggles',
    icon: <ToggleLeft size={16} />,
    fields: [
      { key: 'enable_comments', label: 'Comments', type: 'toggle', group: 'FEATURES', help: 'Allow users to comment on articles' },
      { key: 'enable_bookmarks', label: 'Bookmarks', type: 'toggle', group: 'FEATURES', help: 'Allow users to save articles' },
      { key: 'enable_newsletter', label: 'Newsletter', type: 'toggle', group: 'FEATURES', help: 'Show newsletter subscription form' },
      { key: 'enable_search', label: 'Search', type: 'toggle', group: 'FEATURES', help: 'Enable site search functionality' },
      { key: 'enable_dark_mode', label: 'Dark Mode Toggle', type: 'toggle', group: 'FEATURES', help: 'Show dark/light mode switch in header' },
      { key: 'enable_ads', label: 'Advertisements', type: 'toggle', group: 'FEATURES', help: 'Display advertisement placements' },
      { key: 'enable_osint', label: 'OSINT Section', type: 'toggle', group: 'FEATURES' },
      { key: 'enable_shorts', label: 'Intelligence Shorts', type: 'toggle', group: 'FEATURES' },
      { key: 'enable_live_wire', label: 'Live Wire Ticker', type: 'toggle', group: 'FEATURES' },
      { key: 'enable_reading_progress', label: 'Reading Progress Bar', type: 'toggle', group: 'FEATURES' },
      { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle', group: 'FEATURES', help: 'Show maintenance page to all visitors' },
      { key: 'maintenance_message', label: 'Maintenance Message', type: 'textarea', group: 'FEATURES', placeholder: 'We are upgrading our systems. Back soon!' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Tracking',
    icon: <BarChart3 size={16} />,
    fields: [
      { key: 'google_analytics_id', label: 'Google Analytics ID (GA4)', type: 'text', placeholder: 'G-XXXXXXXXXX', group: 'ANALYTICS' },
      { key: 'gtm_id', label: 'Google Tag Manager ID', type: 'text', placeholder: 'GTM-XXXXXXX', group: 'ANALYTICS' },
      { key: 'fb_pixel_id', label: 'Facebook Pixel ID', type: 'text', placeholder: '12345...', group: 'ANALYTICS' },
      { key: 'clarity_id', label: 'Microsoft Clarity ID', type: 'text', placeholder: 'xxxxxxxx', group: 'ANALYTICS' },
      { key: 'hotjar_id', label: 'Hotjar Site ID', type: 'text', placeholder: '1234567', group: 'ANALYTICS' },
    ],
  },
  {
    id: 'apikeys',
    label: 'API Keys & Integrations',
    icon: <Key size={16} />,
    fields: [
      { key: 'smtp_host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com', group: 'API' },
      { key: 'smtp_port', label: 'SMTP Port', type: 'number', placeholder: '587', group: 'API' },
      { key: 'smtp_user', label: 'SMTP Username/Email', type: 'email', placeholder: 'noreply@...', group: 'API' },
      { key: 'smtp_from_name', label: 'Email From Name', type: 'text', placeholder: 'Bharat First', group: 'API' },
      { key: 'cloudinary_cloud_name', label: 'Cloudinary Cloud Name', type: 'text', placeholder: 'your-cloud', group: 'API' },
      { key: 'cloudinary_api_key', label: 'Cloudinary API Key', type: 'text', placeholder: '123...', group: 'API' },
      { key: 'recaptcha_site_key', label: 'reCAPTCHA Site Key', type: 'text', placeholder: '6Le...', group: 'API' },
      { key: 'custom_head_scripts', label: 'Custom <head> Scripts', type: 'textarea', placeholder: '<script>...</script>', group: 'API', help: 'Injected in the <head> of every page' },
      { key: 'custom_body_scripts', label: 'Custom <body> Scripts', type: 'textarea', placeholder: '<!-- scripts -->', group: 'API', help: 'Injected before </body>' },
    ],
  },
];

// ─── Input Field Renderer ────────────────────────────────────────────────────
function FieldInput({ field, value, onChange }: { field: SettingField; value: string; onChange: (key: string, val: string) => void }) {
  const base = "w-full bg-black/60 border border-white/10 rounded-sm px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors text-sm";

  if (field.type === 'toggle') {
    const isOn = value === 'true' || value === '1';
    return (
      <button
        type="button"
        onClick={() => onChange(field.key, isOn ? 'false' : 'true')}
        className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-sm font-medium transition-all ${
          isOn ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00]' : 'bg-black/40 border-white/10 text-gray-400'
        }`}
        aria-pressed={isOn}
      >
        {isOn ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        {isOn ? 'Enabled' : 'Disabled'}
      </button>
    );
  }

  if (field.type === 'color') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#FF6B00'}
          onChange={e => onChange(field.key, e.target.value)}
          className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(field.key, e.target.value)}
          className={`${base} flex-1 font-mono`}
          placeholder="#FF6B00"
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={`${base} h-24 resize-none`}
      />
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <select
        value={value || field.options[0]}
        onChange={e => onChange(field.key, e.target.value)}
        className={`${base} cursor-pointer`}
      >
        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
      value={value || ''}
      onChange={e => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className={base}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const SettingsManager = () => {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = useCallback((key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const allFields = SETTING_SECTIONS.flatMap(s => s.fields);
    const payload = allFields.map(field => ({
      key: field.key,
      value: settings[field.key] || '',
      group: field.group,
      type: field.type === 'color' ? 'COLOR' : field.type === 'toggle' ? 'BOOLEAN' : field.type === 'textarea' ? 'TEXT' : 'TEXT',
    }));

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save settings. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        <Loader2 size={28} className="animate-spin mr-3" /> Loading settings...
      </div>
    );
  }

  const currentSection = SETTING_SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Sliders className="mr-3 text-[#FF6B00]" size={24} /> Configuration Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            All settings are stored in the database and apply instantly across the website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center px-6 py-2.5 text-sm font-semibold rounded-sm transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-[#FF6B00] hover:bg-[#e05e00] text-white'
          } disabled:opacity-60`}
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</>
          ) : saved ? (
            <><CheckCircle size={16} className="mr-2" /> Saved!</>
          ) : (
            <><Save size={16} className="mr-2" /> Save All Changes</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-sm text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-1 sticky top-20">
            {SETTING_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                  activeSection === section.id
                    ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-r-2 border-[#FF6B00]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Panel */}
        <div className="flex-1 bg-[#141414] border border-white/10 rounded-sm p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            {currentSection.icon}
            {currentSection.label}
          </h2>

          <div className="space-y-6">
            {currentSection.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {field.label}
                </label>
                <FieldInput field={field} value={settings[field.key] || ''} onChange={handleChange} />
                {field.help && (
                  <p className="text-xs text-gray-500 mt-1">{field.help}</p>
                )}
              </div>
            ))}
          </div>

          {/* Save at bottom of panel too */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-5 py-2 text-sm font-semibold rounded-sm bg-[#FF6B00] hover:bg-[#e05e00] text-white transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <Save size={15} className="mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
