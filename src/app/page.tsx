import Header from '@/components/Header';
import FooterWidgets from '@/components/FooterWidgets';
import InteractiveGrid from '@/components/InteractiveGrid';
import ShaderBackground from '@/components/ShaderBackground';
import ScrollDeformedCanvas from '@/components/ScrollDeformedCanvas';

import HeroSection from '@/components/HeroSection';
import Bio from '@/components/Bio';
import WorkGrid from '@/components/WorkGrid';
import CursorShowcase from '@/components/CursorShowcase';
import ContactFooter from '@/components/ContactFooter';

export default function Home() {
  return (
    <div className="page-content-wrapper flex flex-col min-h-screen">
      {/* Background WebGL Shader Waves & Pixel mouse trail */}
      <ShaderBackground />

      {/* WebGL scroll image deformation canvas */}
      <ScrollDeformedCanvas />

      {/* Interactive dotted grid overlay */}
      <InteractiveGrid />

      {/* Site Navigation Header */}
      <Header />

      {/* Bottom corner widgets (Clock, Coordinates, Globe) */}
      <FooterWidgets />

      {/* Main scroll content */}
      <main className="relative z-10 w-full flex-1">
        {/* Full-screen Hero from source */}
        <HeroSection />

        {/* Full-width interactive sections */}
        <Bio />
        <WorkGrid />

        {/* Full-width scroll sequence and footer */}
        <CursorShowcase />
        <ContactFooter />
      </main>
    </div>
  );
}
