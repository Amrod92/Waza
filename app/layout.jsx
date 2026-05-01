import { Inter } from 'next/font/google';
import '../styles/globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Layout from '../components/Layout';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Waza',
  description: 'Find people to work with on shops, startups, personal projects, local ideas, creative work, and anything worth building together.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={inter.className}>
      <body className='min-h-screen bg-background text-foreground antialiased'>
        <AppProviders>
          <Layout>{children}</Layout>
        </AppProviders>
      </body>
    </html>
  );
}
