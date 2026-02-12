'use client';

import Navigation from '@/components/Navigation';
import TropicalNordicHero from '@/components/TropicalNordicHero';
import Sponsors from '@/components/Sponsors';
import Events from '@/components/Events';
import About from '@/components/About';
import Membership from '@/components/Membership';
import InfoHub from '@/components/InfoHub';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Fixed Navigation */}
      <Navigation />

      {/* Hero Section */}
      <TropicalNordicHero />

      {/* Sponsor Carousel - Right after Hero */}
      <Sponsors />

      {/* Upcoming Events - Blog Style */}
      <Events />

      {/* About Us */}
      <About />

      {/* Membership */}
      <Membership />

      {/* Information Hub */}
      <InfoHub />

      {/* Gallery */}
      <Gallery />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
