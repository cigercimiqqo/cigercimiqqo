'use client';

import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Flame, Users, Award, Heart } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import { useSettingsStore } from '@/store/settingsStore';

const VALUES = [
  {
    icon: Flame,
    title: 'Geleneksel Pişirme',
    desc: 'Kömür ateşinde, sabırla ve ustalıkla pişirme geleneğimizi sürdürüyoruz.',
  },
  {
    icon: Heart,
    title: 'Taze Malzeme',
    desc: 'Her gün en taze malzemeleri tedarik ediyor, kaliteden asla ödün vermiyoruz.',
  },
  {
    icon: Users,
    title: 'Aile Mirası',
    desc: 'Kuşaktan kuşağa aktarılan tarifler ve değişmeyen lezzet anlayışı.',
  },
  {
    icon: Award,
    title: 'Kalite Taahhüdü',
    desc: 'Her tabağımız, misafirlerimize olan saygımızın ve kalite anlayışımızın yansımasıdır.',
  },
];

export default function AboutPage() {
  const { settings } = useSettingsStore();
  const storyImage = settings?.appearance?.storyImage;
  const description = settings?.general?.siteDescription || '';

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative pt-32 pb-20 bg-surface-950">
          <div className="absolute inset-0 opacity-10">
            {storyImage ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${storyImage})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-brand-900 to-surface-950" />
            )}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
                Bizi Tanıyın
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
                Hakkımızda
              </h1>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-surface-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimateOnScroll variant="fadeLeft">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  {storyImage ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${storyImage})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-surface-900" />
                  )}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeRight" delay={0.1}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-brand-500" />
                  <span className="text-brand-500 text-sm tracking-[0.2em] uppercase font-medium">
                    Hikayemiz
                  </span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-surface-100 mb-6">
                  Bir Tutkunun <span className="text-brand-500">Hikayesi</span>
                </h2>
                <div className="space-y-4 text-surface-400 leading-relaxed">
                  <p>
                    {description ||
                      'Kuşaktan kuşağa aktarılan tariflerle, ateşle olan bağımızı hiç koparmadan yolumuza devam ediyoruz. Kurucumuz, yılların birikimi ve ustalardan öğrendiği tekniklerle lezzetleri bir sanata dönüştürdü.'}
                  </p>
                  <p>
                    Her gün taze seçilen malzemeler, özel baharat karışımımız ve kömür ateşinin
                    büyüsüyle hazırlanan lezzetlerimiz, bugün binlerce damağın favorisi olmaya
                    devam ediyor.
                  </p>
                  <p>
                    Geleneklerimizi korurken modern hizmet anlayışını benimsiyoruz. Her
                    misafirimize evinde hissettirecek bir atmosfer, her tabakta ise kuşakların
                    biriktirdiği lezzeti sunuyoruz.
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-surface-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-surface-100">
                Değerlerimiz
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => (
                <AnimateOnScroll key={v.title} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800/50 text-center hover:border-brand-500/30 transition-all group h-full">
                    <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                      <v.icon size={24} className="text-brand-500" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-surface-100 mb-2">
                      {v.title}
                    </h3>
                    <p className="text-surface-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
