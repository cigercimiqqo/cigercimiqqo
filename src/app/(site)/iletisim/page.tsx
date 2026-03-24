'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import { useSettingsStore } from '@/store/settingsStore';
import { addContact } from '@/lib/firebase/firestore';
import { getDefaultContent } from '@/lib/defaultContent';
import { getGoogleMapsEmbedSrc } from '@/lib/googleMapsEmbed';
import { toast } from '@/lib/toast';

function formatWh(wh: { open: string; close: string; isClosed: boolean } | undefined): string {
  if (!wh || wh.isClosed) return 'Kapalı';
  return `${wh.open} - ${wh.close}`;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const contact = content.contactPage ?? getDefaultContent().contactPage!;

  const phones = settings?.general?.phone || [];
  const address = settings?.general?.address || '';
  const mapsEmbedSrc = getGoogleMapsEmbedSrc(settings?.general?.googleMapsLink);
  const wh = settings?.ordering?.workingHours;
  const weekdays = wh?.mon ? formatWh(wh.mon) : '11:00 - 23:00';
  const weekend = wh?.sat ? formatWh(wh.sat) : '10:00 - 00:00';
  const workingHoursStr = `Hafta içi: ${weekdays} / Hafta sonu: ${weekend}`;

  const contactInfo: { icon: typeof Phone; label: string; value: string; href?: string }[] = [];
  if (phones[0]) contactInfo.push({ icon: Phone, label: 'Telefon', value: phones[0], href: `tel:${phones[0]}` });
  if (address) contactInfo.push({ icon: MapPin, label: 'Adres', value: address });
  contactInfo.push({ icon: Clock, label: 'Çalışma Saatleri', value: workingHoursStr });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    setIsSubmitting(true);
    try {
      await addContact({ name, phone, email, subject, message });
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative pt-32 pb-16 bg-surface-950">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
                {contact.tagline}
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
                {contact.title}
              </h1>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-surface-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <AnimateOnScroll>
                  <h2 className="font-heading text-2xl font-bold text-surface-100 mb-6">
                    {contact.infoLabel}
                  </h2>
                </AnimateOnScroll>
                {contactInfo.map((info, i) => (
                  <AnimateOnScroll key={info.label} delay={i * 0.1}>
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-900 border border-surface-800/50">
                      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                        <info.icon size={18} className="text-brand-500" />
                      </div>
                      <div>
                        <p className="text-surface-500 text-xs uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-surface-200 hover:text-brand-400 transition-colors text-sm"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-surface-200 text-sm">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              <AnimateOnScroll variant="fadeRight" className="lg:col-span-3">
                <div className="bg-surface-900 rounded-2xl border border-surface-800/50 p-6 md:p-8">
                  <h2 className="font-heading text-2xl font-bold text-surface-100 mb-6">
                    {contact.formTitle}
                  </h2>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-surface-100 font-heading text-xl font-semibold mb-2">
                        {contact.formSuccessTitle}
                      </h3>
                      <p className="text-surface-400">{contact.formSuccessMessage}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-surface-400 mb-2">Ad Soyad</label>
                          <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="Adınız"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-surface-400 mb-2">Telefon</label>
                          <input
                            name="phone"
                            type="tel"
                            className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="05xx xxx xx xx"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-surface-400 mb-2">E-posta</label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                          placeholder="ornek@mail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-surface-400 mb-2">Konu</label>
                        <select
                          name="subject"
                          className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option value="">Seçiniz</option>
                          <option value="rezervasyon">Rezervasyon</option>
                          <option value="siparis">Sipariş</option>
                          <option value="oneri">Öneri / Şikayet</option>
                          <option value="diger">Diğer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-surface-400 mb-2">Mesajınız</label>
                        <textarea
                          name="message"
                          rows={5}
                          required
                          className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                          placeholder="Mesajınızı buraya yazın..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-60"
                      >
                        <Send size={16} />
                        {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                      </button>
                    </form>
                  )}
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll className="mt-12">
              <div id="harita" className="h-80 md:h-96 rounded-2xl overflow-hidden bg-surface-900 border border-surface-800/50 relative">
                {mapsEmbedSrc ? (
                  <iframe
                    src={mapsEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 320 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Konum"
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-500 p-6 text-center">
                    <MapPin size={32} className="mb-3 text-surface-600" />
                    <p className="text-sm">Admin → Ayarlar → Genel → Google Harita Linki alanına mekan linkinizi girin</p>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
