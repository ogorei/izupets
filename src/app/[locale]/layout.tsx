import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NotFound from './not-found';
//@ts-ignore:
import { routing } from '@/i18n/routing';
import Header from "../../components/home/Header";
import { SanityLive } from '../../../sanity/lib/live';
import Footer from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'スマコス',
  description: 'コスメのフタ、科学の目でオープン！',
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate the locale
  if (!routing.locales.includes(locale as any)) {
    return <NotFound locale={locale} />;
  }

  // Load i18n messages
  const messages = await getMessages()
  const logo: string = "/logo-ja.png"

  return (
    <NextIntlClientProvider messages={messages}>
      <Header logo={logo} />
      <main className="pt-36 md:pt-40">
        {children}
        <SanityLive />
      </main>
      <Footer logo={logo} />
    </NextIntlClientProvider>
  )
}