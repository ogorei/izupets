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
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PetSpot（ペットスポット）｜全国のペット同伴OK宿・レストラン・施設まとめ',
  description: 'PetSpot（ペットスポット）は、全国のペットと一緒に泊まれる宿、食べられるレストラン、行ける病院、遊べる施設を厳選した情報サイトです。犬・猫と快適に過ごせるお出かけ先を紹介しています。',
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
  const logo: string = "https://i.gyazo.com/d35303bcb9904798cea25cf2db558d9c.png"

  return (
    <QueryProvider>
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col">
          <Header logo={logo} />
          <main className="flex-1">
            {children}
            <SanityLive />
          </main>
          <Footer/>
        </div>
      </NextIntlClientProvider>
    </QueryProvider>
  )
}