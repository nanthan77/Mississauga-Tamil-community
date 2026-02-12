'use client';

import { SponsorProvider } from '@/contexts/SponsorContext';

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SponsorProvider>
      {children}
    </SponsorProvider>
  );
}
