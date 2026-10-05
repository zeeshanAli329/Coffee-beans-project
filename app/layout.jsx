import './globals.css';
import Providers from '@/components/Providers';
import SiteShell from '@/components/SiteShell';

export const metadata = {
  title: { default: "Bean Scene | We've got your morning covered with coffee", template: '%s | Bean Scene' },
  description: 'Bean Scene serves hand-crafted cappuccinos, chai lattes, macchiatos and espresso made from supreme beans. Order ahead and make your morning.',
};
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
