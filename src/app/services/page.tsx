"use client";

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Stars, TorusKnot } from '@react-three/drei'; // Added TorusKnot for potential use
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
// import Lenis from '@studio-freight/lenis'; // Assuming Lenis is integrated elsewhere or will be

gsap.registerPlugin(ScrollTrigger, SplitText);

interface ServiceShowcaseProps {
  title: string;
  description: string;
  benefits: string[];
  imageSrc: string;
  imageAlt: string;
  learnMoreLink?: string;
  index: number; // To alternate layouts or animations
  isFeatured?: boolean;
}

const ServiceShowcaseSection: React.FC<ServiceShowcaseProps> = ({
  title,
  description,
  benefits,
  imageSrc,
  imageAlt,
  learnMoreLink = "#",
  index,
  isFeatured
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Animate when 70% of the section is in view
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          // markers: true, // for debugging
        }
      });

      const imageElement = sectionRef.current.querySelector(".service-image-container");
      const textElements = sectionRef.current.querySelectorAll(".service-text-content > *");

      tl.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.inOut" })
        .fromTo(imageElement, 
          { opacity: 0, [index % 2 === 0 ? 'x' : 'x']: index % 2 === 0 ? -100 : 100, scale: 1.1 },
          { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power3.out" }, 
          "-=0.2"
        )
        .fromTo(textElements, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
          "-=0.5"
        );
        
      // Featured animation with 3D element
      if (isFeatured) {
        const featured3DElement = sectionRef.current.querySelector(".featured-3d-element");
        if (featured3DElement) {
            gsap.fromTo(featured3DElement, 
                { opacity: 0, scale: 0.5, rotationY: -90 },
                { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "elastic.out(1, 0.5)", delay: 0.5,
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse",
                  }
                }
            );
        }
      }
    }
  }, [index, isFeatured]);

  return (
    <section 
      ref={sectionRef} 
      className={`service-showcase-item min-h-[80vh] md:min-h-screen py-16 md:py-24 px-6 md:px-12 flex items-center ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'} overflow-hidden relative`}>
      <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${index % 2 === 0 ? '' : 'md:grid-flow-row-dense'}`}>
        <div className={`service-image-container relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
          <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" className="transform transition-transform duration-1000 ease-out group-hover:scale-110" />
           {isFeatured && (
            <div className="featured-3d-element absolute inset-0 flex items-center justify-center opacity-0">
              <Canvas style={{ width: '60%', height: '60%' }} camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                  <TorusKnot args={[1, 0.3, 128, 16]} scale={0.8}>
                    <meshStandardMaterial color="#8A2BE2" emissive="#4B0082" roughness={0.1} metalness={0.7} wireframe={false} />
                  </TorusKnot>
                </Suspense>
              </Canvas>
            </div>
          )}
        </div>
        <div className={`service-text-content ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-purple-400 leading-tight">{title}</h2>
          <p className="text-gray-300 mb-6 text-lg md:text-xl leading-relaxed">{description}</p>
          <ul className="list-none space-y-3 mb-8">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start text-gray-400">
                <svg className="w-5 h-5 mr-3 mt-1 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                {benefit}
              </li>
            ))}
          </ul>
          <Link href={learnMoreLink} legacyBehavior>
            <a className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-lg">
              Discover More
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};


const ServicesPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !pageRef.current) return;

    const heroTitle = pageRef.current.querySelector(".hero-title");
    const heroSubtitle = pageRef.current.querySelector(".hero-subtitle");
    const heroCta = pageRef.current.querySelector(".hero-cta-button");

    if (heroTitle) {
      const splitHeadline = new SplitText(heroTitle, { type: "words,chars" });
      gsap.from(splitHeadline.chars, {
        duration: 0.8, opacity: 0, y: 30, ease: "power3.out", stagger: 0.04, delay: 0.3
      });
    }
    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        duration: 1, opacity: 0, y: 20, ease: "power3.out", delay: 0.7
      });
    }
     if (heroCta) {
      gsap.from(heroCta, {
        duration: 1, opacity: 0, y: 20, ease: "bounce.out", delay: 1.0
      });
    }
    
    const finalCtaSection = pageRef.current.querySelector(".final-cta-section");
    if (finalCtaSection) {
        gsap.fromTo(finalCtaSection.querySelectorAll("h2, p, a"),
            { opacity:0, y:50 },
            { opacity:1, y:0, stagger:0.2, duration:1, ease: "power3.out",
                scrollTrigger: {
                    trigger: finalCtaSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

  }, [isReducedMotion]);

  const servicesData: Omit<ServiceShowcaseProps, 'index'>[] = [
    {
      title: "Paid Traffic Management (Meta Ads + Google Ads)",
      description: "Amplify your reach and ROI with meticulously crafted ad campaigns on Meta and Google. Our data-centric strategies pinpoint your ideal demographic, supercharge conversions, and drive sustainable business expansion.",
      benefits: [
        "Precision audience hyper-segmentation",
        "Relentless A/B testing & iterative optimization",
        "Crystal-clear reporting & actionable performance insights",
        "Exponential growth in qualified leads & sales"
      ],
      imageSrc: "/assets/services/paid_traffic.jpg",
      imageAlt: "Dynamic graph showing ad performance",
      isFeatured: true,
      learnMoreLink: "/services/paid-traffic"
    },
    {
      title: "High-Conversion Landing Page Creation",
      description: "Convert casual browsers into committed customers with bespoke landing pages engineered for peak performance. We fuse compelling narrative, intuitive user experience, and persuasive visual design to catapult your conversion rates.",
      benefits: [
        "Tailor-made designs reflecting your unique brand identity",
        "Flawlessly responsive, mobile-first architecture",
        "Blazing-fast load times & superior user experience",
        "Irresistible CTAs & streamlined lead capture mechanisms"
      ],
      imageSrc: "/assets/services/landing_pages.jpg", 
      imageAlt: "Stunning landing page design example",
      learnMoreLink: "/services/landing-pages"
    },
    {
      title: "WhatsApp Automation & Intelligent Sales Funnels",
      description: "Unlock the potential of WhatsApp for hyper-personalized customer journeys and automated sales mastery. We construct intelligent chatbots and sophisticated funnels that nurture prospects and convert leads, 24/7.",
      benefits: [
        "Automated lead scoring & dynamic follow-up sequences",
        "Elevated customer support & proactive engagement",
        "Seamless CRM & marketing stack integration",
        "Dramatically increased sales velocity & operational scalability"
      ],
      imageSrc: "/assets/services/whatsapp_automation.jpg",
      imageAlt: "Illustration of WhatsApp automation flow",
      learnMoreLink: "/services/whatsapp-automation"
    },
    {
      title: "SEO Consulting & Authority-Building Content Strategy",
      description: "Ascend search engine summits and attract a torrent of organic traffic with our elite SEO counsel and scalable content ecosystems. We architect a resilient foundation for enduring growth and digital dominance.",
      benefits: [
        "Forensic keyword intelligence & competitive landscape analysis",
        "Comprehensive technical SEO audits & remediation",
        "Premium, resonant content that captivates & converts",
        "Strategic link acquisition & digital PR for authority"
      ],
      imageSrc: "/assets/services/seo_content.jpg",
      imageAlt: "Graph showing SEO growth",
      learnMoreLink: "/services/seo-consulting"
    },
    {
      title: "Visual Identity & Immersive Digital Branding",
      description: "Forge an unforgettable brand identity that captivates your target audience and commands market presence. We sculpt holistic visual systems, from iconic logos to comprehensive brand guidelines, ensuring unwavering consistency and powerful recognition across every digital frontier.",
      benefits: [
        "Unique, compelling brand narratives that resonate deeply",
        "World-class logo design & cohesive visual asset creation",
        "Consistent, impactful brand voice & messaging strategy",
        "Cultivation of profound brand loyalty & market distinction"
      ],
      imageSrc: "/assets/services/branding.jpg",
      imageAlt: "Showcase of a strong brand identity",
      learnMoreLink: "/services/digital-branding"
    },
    {
      title: "Strategic Immersion for Local Market Dominance",
      description: "Empower your local enterprise with bespoke digital marketing blueprints engineered for neighborhood supremacy. We deploy laser-focused local SEO, geo-targeted advertising, and authentic community engagement to drive tangible foot traffic and amplify local sales.",
      benefits: [
        "Pristinely optimized Google Business Profiles & local listings",
        "Hyper-efficient localized paid advertising campaigns",
        "Proactive reputation management & customer review cultivation",
        "Authentic hyperlocal content & robust community building"
      ],
      imageSrc: "/assets/services/local_business.jpg",
      imageAlt: "Map highlighting local business reach",
      learnMoreLink: "/services/local-strategy"
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      <section className="min-h-[70vh] md:min-h-screen py-20 md:py-32 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        {!isReducedMotion && (
            <div className="absolute inset-0 z-0 opacity-20">
                <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 10, 10]} intensity={0.7} color="#8A2BE2" />
                    <Suspense fallback={null}>
                        <Stars radius={200} depth={80} count={7000} factor={6} saturation={0} fade speed={1.5} />
                    </Suspense>
                </Canvas>
            </div>
        )}
        <div className="relative z-10 max-w-4xl">
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Our Digital Arsenal
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
                Unleash unparalleled growth with 3PWeb&apos;s suite of transformative services. We fuse strategic foresight, creative brilliance, and technological mastery to architect your digital triumph.
            </p>
            <Link href="#services-showcase" legacyBehavior>
                <a className="hero-cta-button inline-block bg-white text-purple-700 font-bold text-lg py-4 px-12 rounded-lg shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    Explore Our Solutions
                </a>
            </Link>
        </div>
      </section>

      <div id="services-showcase">
        {servicesData.map((service, index) => (
          <ServiceShowcaseSection key={service.title} {...service} index={index} />
        ))}
      </div>
      
      <section className="final-cta-section py-20 md:py-32 px-6 text-center bg-gradient-to-tr from-purple-700 via-pink-700 to-red-700 relative">
         {!isReducedMotion && (
            <div className="absolute inset-0 z-0 opacity-15">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10,10,5]} intensity={0.5} />
                    <Suspense fallback={null}>
                        <TorusKnot args={[10, 1, 256, 32]} rotation={[0.5,0.5,0]} scale={0.3}>
                             <meshStandardMaterial color="#FFFFFF" emissive="#CCCCCC" roughness={0.5} metalness={0.2} wireframe opacity={0.3} transparent />
                        </TorusKnot>
                    </Suspense>
                </Canvas>
            </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Ignite Your Business&apos;s Marketing Engine?
            </h2>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed">
                Connect with a 3PWeb strategist today. Let&apos;s co-create your brand&apos;s extraordinary digital future.
            </p>
            <Link href="https://wa.me/5511992914799?text=Hello%203PWeb%2C%20I&apos;d%20like%20to%20discuss%20my%20marketing%20needs."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-700 font-bold text-lg py-4 px-12 rounded-lg shadow-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
                Speak With An Expert
            </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

