"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber'; // Removed useFrame
import { Stars } from '@react-three/drei'; // Removed OrbitControls, DreiText, Html
// Removed useLenis as it's not used in this file
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image'; // Using Next.js Image component

gsap.registerPlugin(ScrollTrigger);

// Placeholder for a subtle 3D element or SVG animation
const AnimatedServiceIcon = ({ iconType }: { iconType: string }) => {
  // In a real scenario, this would be a more complex SVG or a simple Three.js component
  let pathData = "M13 10V3L4 14h7v7l9-11h-7z"; // Default lightning bolt
  if (iconType === 'strategy') pathData = "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"; // Placeholder for strategy (GitHub icon)
  if (iconType === 'traffic') pathData = "M12 1v22m-6-6l6 6 6-6"; // Placeholder for traffic (arrow)
  if (iconType === 'seo') pathData = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"; // Placeholder for SEO (magnifying glass)

  return (
    <svg className="w-12 h-12 text-accent group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={pathData}></path>
    </svg>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  iconType: string;
  imageSrc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, iconType, imageSrc }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <div ref={cardRef} className="group bg-background-alt p-8 rounded-xl shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-start">
      <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
        <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="mb-4 p-3 bg-primary/10 rounded-full">
        <AnimatedServiceIcon iconType={iconType} />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-primary-dark mb-3 font-display">{title}</h3>
      <p className="text-text/80 leading-relaxed text-left">{description}</p>
    </div>
  );
};

// Main Services Page Component
const ServicesPage = () => {
  const pageTitleRef = useRef<HTMLHeadingElement>(null);
  const introTextRef = useRef<HTMLParagraphElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // GSAP Animations for page title and intro text
  useEffect(() => {
    if (isReducedMotion) return;
    if (pageTitleRef.current) {
      gsap.from(pageTitleRef.current, { opacity: 0, y: -50, duration: 1, ease: "power3.out", delay: 0.3 });
    }
    if (introTextRef.current) {
      gsap.from(introTextRef.current, { opacity: 0, y: 50, duration: 1, ease: "power3.out", delay: 0.6 });
    }
  }, [isReducedMotion]);

  // Horizontal Scroll for a specific section
  useEffect(() => {
    if (isReducedMotion || !horizontalScrollRef.current || !horizontalContainerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(".horizontal-panel");
    if (sections.length === 0) return;

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalContainerRef.current, // The container that pins
        pin: true,
        scrub: 0.5,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + (horizontalScrollRef.current!.offsetWidth - window.innerWidth),
        // markers: true, // For debugging
      }
    });
    return () => {
      scrollTween.kill();
      // Ensure to check if horizontalContainerRef.current exists before accessing it in cleanup
      const currentTrigger = horizontalContainerRef.current;
      ScrollTrigger.getAll().forEach(st => { if(st.trigger === currentTrigger) st.kill() });
    };
  }, [isReducedMotion]);

  const coreServices = [
    {
      title: "Strategic Digital Blueprinting",
      description: "We don't just execute; we architect. Our process begins with a deep dive into your brand, market, and objectives to forge a bespoke digital strategy. This comprehensive blueprint acts as your North Star, guiding every subsequent action to ensure cohesive, impactful, and measurable results across all digital touchpoints. From market research and competitor analysis to audience segmentation and journey mapping, we lay the groundwork for sustainable digital supremacy.",
      iconType: "strategy",
      imageSrc: "/assets/services/estrategia.jpg"
    },
    {
      title: "Precision-Targeted Paid Traffic",
      description: "Leverage the full power of paid media with campaigns meticulously engineered for maximum ROI. Our experts navigate the complexities of Google Ads, Meta Ads, LinkedIn Ads, and emerging platforms, employing data-driven insights and continuous optimization. We transform ad spend into tangible conversions, driving qualified leads and accelerating your sales pipeline with unparalleled precision and efficiency.",
      iconType: "traffic",
      imageSrc: "/assets/services/trafego.jpg"
    },
    {
      title: "Organic Dominance via Advanced SEO",
      description: "Ascend search engine rankings and capture sustained organic traffic with our holistic SEO strategies. We combine technical on-page optimization, authoritative content creation, strategic link building, and local SEO mastery to enhance your visibility and credibility. Our approach ensures your brand is not just found, but preferred, establishing long-term digital authority in your niche.",
      iconType: "seo",
      imageSrc: "/assets/services/seo.jpg"
    }
  ];

  const specializedServices = [
    {
      title: "Immersive Content & Storytelling",
      description: "Captivate your audience with compelling narratives and high-impact content that resonates and converts. From cinematic video production and interactive web experiences to persuasive copywriting and engaging social media content, we craft stories that elevate your brand and foster deep customer loyalty. Our content isn't just seen; it's experienced.",
      iconType: "content",
      imageSrc: "/assets/services/conteudo.jpg"
    },
    {
      title: "Web3 & Emerging Tech Integration",
      description: "Navigate the next digital frontier with confidence. 3PWeb specializes in integrating Web3 technologies, including blockchain, NFTs, and metaverse experiences, into your marketing strategy. We also harness the power of AI for advanced analytics, personalized customer journeys, and automated efficiencies, future-proofing your brand and unlocking new dimensions of engagement.",
      iconType: "tech",
      imageSrc: "/assets/services/tech.jpg"
    },
    {
      title: "Global Expansion & Market Entry",
      description: "Positioned in the global hub of Dubai, we are your strategic partners for international growth. Our expertise in cross-cultural marketing, localized campaign execution, and navigating diverse regulatory landscapes empowers your brand to successfully penetrate new markets and achieve global resonance. We turn ambition into international market leadership.",
      iconType: "global",
      imageSrc: "/assets/services/global.jpg"
    }
  ];

  return (
    <div className="bg-background text-text min-h-screen">
      {/* Hero Section for Services Page */}
      <section className="relative py-20 md:py-32 text-center bg-gradient-to-b from-background-dark to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10 z-0">
          <Suspense fallback={null}>
            <Canvas>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              {/* <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} /> */}
            </Canvas>
          </Suspense>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 ref={pageTitleRef} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-6">
            Our Services: Architecting Digital Excellence
          </h1>
          <p ref={introTextRef} className="text-lg md:text-xl lg:text-2xl text-text/80 max-w-3xl mx-auto">
            At 3PWeb, we offer a symphony of specialized digital marketing services, meticulously orchestrated to elevate your brand and achieve unparalleled growth. Discover how our expertise can transform your digital presence.
          </p>
        </div>
      </section>

      {/* Core Services Section - Standard Vertical Scroll */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-16 text-center font-display">Core Digital Accelerators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {coreServices.map((service, index) => (
              <ServiceCard key={`core-${index}`} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section for Specialized Services */}
      <section ref={horizontalContainerRef} className="h-screen bg-background-alt overflow-hidden">
        <div ref={horizontalScrollRef} className="flex w-max h-full">
          {/* Panel 1: Intro to Specialized Services */}
          <div className="horizontal-panel w-screen h-full flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-r from-primary-dark to-accent">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-8 font-display animate-in-horizontal">
              Beyond the Horizon: Specialized Solutions
            </h2>
            <p className="text-xl md:text-2xl text-background/90 max-w-2xl mx-auto animate-in-horizontal delay-200">
              We delve deeper, offering cutting-edge services that push boundaries and define market leadership. Explore our innovative capabilities designed for visionary brands.
            </p>
          </div>

          {/* Panels for each specialized service */}
          {specializedServices.map((service, index) => (
            <div key={`specialized-${index}`} className="horizontal-panel w-screen h-full flex items-center justify-center p-8 md:p-16 bg-background-alt">
              <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
                <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl animate-in-horizontal">
                  <Image src={service.imageSrc} alt={service.title} layout="fill" objectFit="cover" />
                </div>
                <div className="text-left animate-in-horizontal delay-300">
                  <div className="mb-4 p-3 bg-accent/10 rounded-full w-max">
                     <AnimatedServiceIcon iconType={service.iconType} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-accent mb-4 font-display">{service.title}</h3>
                  <p className="text-text/80 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-display">Ready to Elevate Your Digital Reality?</h2>
          <p className="text-lg md:text-xl text-text/80 max-w-2xl mx-auto mb-10">
            Partner with 3PWeb and let us architect a digital strategy that not only meets your goals but redefines what&apos;s possible. Your journey to digital excellence starts here.
          </p>
          <a href="/contact" className="bg-accent hover:bg-accent/90 text-background font-semibold py-4 px-10 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-accent/50">
            Consult Our Experts
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

