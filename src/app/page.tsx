"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Html } from '@react-three/drei'; // Removed OrbitControls, DreiText
import { useLenis } from "@studio-freight/react-lenis"; // Removed Lenis
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import * as THREE from 'three'; // Added for THREE.Mesh type

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Placeholder for SVG Icons - to be replaced with actual SVGs or animated components
const PlaceholderIcon = ({ className = "w-12 h-12 text-accent" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const TorusKnotScene = () => {
  const knotRef = useRef<THREE.Mesh>(null!); // Changed any to THREE.Mesh and ensured it's not null initially for simplicity, or use (null) and check
  useFrame(({ clock }) => {
    if (knotRef.current) {
      knotRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      knotRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <TorusKnot ref={knotRef} args={[1.2, 0.3, 200, 22]} scale={1.2}>
      <meshStandardMaterial color="#8E44AD" emissive="#5B2C6F" roughness={0.1} metalness={0.8} />
    </TorusKnot>
  );
};

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subHeadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ourEdgeRef = useRef<HTMLDivElement>(null);
  const dubaiRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    // Hero Animations
    if (headlineRef.current) {
      const splitHeadline = new SplitText(headlineRef.current, { type: "chars,words" });
      gsap.from(splitHeadline.chars, {
        opacity: 0,
        y: 50,
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5
      });
    }
    if (subHeadlineRef.current) {
      gsap.from(subHeadlineRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 1.2 });
    }
    if (ctaRef.current) {
      gsap.from(ctaRef.current, { opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(1.7)", delay: 1.5 });
    }

    // "Our Edge" Section Card Animations
    const cards = gsap.utils.toArray<HTMLElement>('.edge-card'); // Changed any to HTMLElement
    cards.forEach((card: HTMLElement) => { // Changed any to HTMLElement
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        duration: 0.6,
        ease: "power3.out"
      });
      // Hover lift effect (can be enhanced with GSAP)
    });

    // Dubai Advantage Parallax
    // Ensure the selector targets an HTMLElement or null
    const parallaxBg = dubaiRef.current?.querySelector<HTMLElement>('.parallax-bg-dubai');
    if (dubaiRef.current && parallaxBg) {
      gsap.to(parallaxBg, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: dubaiRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }

  }, [isReducedMotion]);

  const handleCtaClick = () => {
    if (ourEdgeRef.current && lenis) {
      lenis.scrollTo(ourEdgeRef.current, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-background via-background to-background/90 text-text overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<Html center><p className='text-text/50'>Loading 3D Experience...</p></Html>}> {/* Escaped apostrophe */}
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 5, 10]} intensity={1.5} castShadow />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8E44AD" />
              <TorusKnotScene />
              {/* <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} /> */}
            </Canvas>
          </Suspense>
        </div>
        <div className="relative z-10 p-4 md:p-8">
          <h1 ref={headlineRef} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-dark mb-6 leading-tight">
            Elevate Digital Reality
          </h1>
          <p ref={subHeadlineRef} className="text-lg md:text-xl lg:text-2xl text-text/80 max-w-2xl mx-auto mb-10">
            3PWeb crafts immersive Web3 and AI-powered experiences that transcend the ordinary, forging the future of digital engagement from Dubai to the Globe.
          </p>
          <button
            ref={ctaRef}
            onClick={handleCtaClick}
            className="bg-primary hover:bg-primary-dark text-background font-semibold py-3 px-8 md:py-4 md:px-10 rounded-lg text-lg md:text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-primary/50"
          >
            Explore our Genesis
          </button>
        </div>
      </section>

      {/* Our Edge Section */}
      <section ref={ourEdgeRef} className="py-16 md:py-24 bg-background-alt">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Our Edge</h2>
          <p className="text-lg md:text-xl text-text/70 mb-12 md:mb-16 max-w-3xl mx-auto">
            We blend cutting-edge technology with strategic insight to deliver unparalleled digital marketing solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[{
              title: "AI-Driven WhatsApp Automation",
              description: "Revolutionize customer engagement with intelligent, automated WhatsApp solutions that feel personal and drive conversions.",
              icon: <PlaceholderIcon />
            }, {
              title: "Web3 Commerce & Payments",
              description: "Step into the future of commerce with seamless Web3 integrations, enabling secure crypto payments and innovative tokenized experiences.",
              icon: <PlaceholderIcon />
            }, {
              title: "Global Growth Campaigns",
              description: "Expand your reach and impact with data-driven global marketing campaigns, tailored to connect with diverse audiences worldwide.",
              icon: <PlaceholderIcon />
            }].map((card, index) => (
              <div key={index} className="edge-card bg-background p-8 rounded-xl shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center">
                <div className="mb-6 p-3 bg-primary/10 rounded-full">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold text-primary-dark mb-3 font-display">{card.title}</h3>
                <p className="text-text/80 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai Advantage Section */}
      <section ref={dubaiRef} className="relative py-20 md:py-32 bg-background text-text">
        <div
          className="parallax-bg-dubai absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/dubai_skyline_placeholder.jpg')" }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">The Dubai Advantage</h2>
          <p className="text-lg md:text-xl text-text/80 max-w-3xl mx-auto leading-relaxed">
            Leveraging Dubai&apos;s dynamic ecosystem and global connectivity, 3PWeb is perfectly positioned to propel your brand onto the international stage. Experience innovation at the crossroads of the world.
          </p>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 bg-background-dark text-text/60 text-center">
        <div className="container mx-auto px-4">
          <p className="font-display text-lg mb-2">3PWeb</p>
          <div className="flex justify-center space-x-4 mb-4">
            {/* Placeholder Social Icons */}
            <a href="#" className="hover:text-accent transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.48 2.03998 2 6.51998 2 12.04C2 17.08 5.64 21.22 10.44 21.92V14.88H7.9V12.04H10.44V9.80005C10.44 7.28005 11.92 5.92005 14.22 5.92005C15.32 5.92005 16.46 6.12005 16.46 6.12005V8.52005H15.18C13.94 8.52005 13.56 9.38005 13.56 10.18V12.04H16.34L15.88 14.88H13.56V21.92C15.9604 21.589 18.1423 20.5077 19.8221 18.8279C21.5019 17.1481 22.5832 14.9662 22.92 12.46C22.96 12.04 23 12.04 23 12.04C23 6.51998 18.52 2.03998 12 2.03998Z" /></svg></a>
            <a href="#" className="hover:text-accent transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.48 2.03998 2 6.51998 2 12.04C2 17.08 5.64 21.22 10.44 21.92V14.88H7.9V12.04H10.44V9.80005C10.44 7.28005 11.92 5.92005 14.22 5.92005C15.32 5.92005 16.46 6.12005 16.46 6.12005V8.52005H15.18C13.94 8.52005 13.56 9.38005 13.56 10.18V12.04H16.34L15.88 14.88H13.56V21.92C15.9604 21.589 18.1423 20.5077 19.8221 18.8279C21.5019 17.1481 22.5832 14.9662 22.92 12.46C22.96 12.04 23 12.04 23 12.04C23 6.51998 18.52 2.03998 12 2.03998Z" /></svg></a>
            <a href="#" className="hover:text-accent transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.48 2.03998 2 6.51998 2 12.04C2 17.08 5.64 21.22 10.44 21.92V14.88H7.9V12.04H10.44V9.80005C10.44 7.28005 11.92 5.92005 14.22 5.92005C15.32 5.92005 16.46 6.12005 16.46 6.12005V8.52005H15.18C13.94 8.52005 13.56 9.38005 13.56 10.18V12.04H16.34L15.88 14.88H13.56V21.92C15.9604 21.589 18.1423 20.5077 19.8221 18.8279C21.5019 17.1481 22.5832 14.9662 22.92 12.46C22.96 12.04 23 12.04 23 12.04C23 6.51998 18.52 2.03998 12 2.03998Z" /></svg></a>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} 3PWeb. All rights reserved. Sculpting Digital Futures.</p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;

