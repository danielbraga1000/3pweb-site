"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Lenis, useLenis } from "@studio-freight/react-lenis";

import Hero3D from "@/components/three/Hero3D";

// Placeholder for a content section
const ContentSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <section className="min-h-screen py-20 container mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center font-display text-primary">{title}</h2>
      <div className="text-lg">
        {children}
      </div>
    </section>
  );
};

const SmoothScrollWrapper = ({ children }: { children: React.ReactNode }) => {
  // This hook could be used to sync Lenis with GSAP ScrollTrigger if needed
  // const lenis = useLenis(ScrollTrigger.update);
  return <>{children}</>;
}

export default function HomePage() {
  return (
    <Lenis root options={{ lerp: 0.07, smoothWheel: true }}>
      <SmoothScrollWrapper>
        <div className="relative w-full h-screen">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-primary">Loading 3D Experience...</div>}>
            <Canvas
              shadows
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="!absolute top-0 left-0 w-full h-full"
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              {/* Hero3D will contain the main interactive 3D scene for the hero */}
              <Hero3D /> 
            </Canvas>
          </Suspense>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-4 pointer-events-none">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-fadeIn font-display">
              3PWeb: Sculpting Digital Futures.
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fadeIn animation-delay-300">
              Pioneering AI & Web3 Marketing Solutions from Dubai to the Globe.
            </p>
            <button 
              className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 animate-fadeIn animation-delay-600 pointer-events-auto"
              onClick={() => console.log("Explore Our Vision clicked")}
            >
              Explore Our Vision
            </button>
          </div>
        </div>

        <ContentSection title="Our Value Proposition">
          <p>Introducing the core values and unique selling points of 3PWeb. This section will feature dynamic content and subtle 3D elements that animate on scroll, showcasing our expertise in AI, Web3, and global marketing strategies. We aim to create an engaging narrative that highlights our innovative approach and commitment to client success.</p>
        </ContentSection>

        <ContentSection title="Key Services">
          <p>A glimpse into our main service offerings. Each service will be presented with interactive cards or modules, incorporating 3D icons or abstract visuals. Hover effects will reveal more information or trigger subtle animations, providing an intuitive and engaging way for users to explore what 3PWeb has to offer. This section will be designed to be both informative and visually captivating.</p>
        </ContentSection>

        <ContentSection title="Dive Deeper">
          <p>A visually compelling call-to-action teaser for our "About Us" page. This section will feature a preview of the immersive 3D background or an interactive element that hints at the unique horizontal scrolling experience of the About page, encouraging users to explore further and learn more about our story and vision.</p>
        </ContentSection>
      </SmoothScrollWrapper>
    </Lenis>
  );
}

