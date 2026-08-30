import type { Metadata } from 'next';
import { AudioProvider } from '@/lib/AudioContext';
import GridBackground from '@/components/layout/GridBackground';
import VolumeControl from '@/components/ui/VolumeControl';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Portfolio - Creative Works',
  description: 'Interactive portfolio showcasing creative works and designs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AudioProvider>
          <GridBackground />
          <main className="relative z-10">
            {children}
          </main>
          <VolumeControl />
        </AudioProvider>
      </body>
    </html>
  );
}
