// Metadata for SEO
export async function generateMetadata() {
  return {
    title: "About Us | 3PWeb - Pioneering Digital Futures",
    description: "Discover the mission, vision, and innovative spirit of 3PWeb. We are a modern digital marketing agency crafting impactful experiences and driving growth through strategy, technology, and creativity.",
  };
}

"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Icosahedron, TorusKnot, Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// Assuming Lenis is globally available or configured in layout
// import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Placeholder for a 3D element
const FloatingShape = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2;
    }
  });
  return (
    <Icosahedron ref={meshRef} args={[0.8, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#5E17EB" emissive="#3D0F9C" roughness={0.2} metalness={0.6} wireframe={false} />
    </Icosahedron>
  );
};

const AboutPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !pageRef.current) return;

    // GSAP Animations
    const sections = gsap.utils.toArray<HTMLElement>(".content-section");
    sections.forEach((section, index) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 100 }, 
        {
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Animate h2 and p tags within each section
      const h2Element = section.querySelector("h2");
      if (h2Element) {
        const splitHeadline = new SplitText(h2Element, { type: "words,chars" });
        gsap.from(splitHeadline.chars, {
          duration: 0.8,
          opacity: 0,
          y: 20,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: h2Element,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      }

      const paragraphs = section.querySelectorAll("p, li");
      gsap.from(paragraphs, {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          toggleActions: "play none none reverse"
        }
      });
    });

  }, [isReducedMotion]);

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Hero Section */} 
      <section className="content-section min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {!isReducedMotion && (
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <Suspense fallback={null}>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <FloatingShape />
              </Suspense>
            </Canvas>
          )}
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-in-title">
            Forging Digital Realities.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 animate-in-subtitle">
            At 3PWeb, we don&apos;t just navigate the digital landscape; we sculpt it. We are a Dubai-based nexus of innovation, strategy, and creative prowess, dedicated to elevating brands into digital powerhouses.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */} 
      <section className="content-section py-20 px-8 bg-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-purple-400">Our Mission & Vision</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-pink-500">Mission</h3>
                <p className="text-lg text-gray-300">
                  To empower businesses with transformative digital marketing strategies, leveraging cutting-edge technology and data-driven insights. We craft bespoke solutions in paid traffic, branding, and high-conversion landing pages that deliver measurable results and sustainable growth.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-pink-500">Vision</h3>
                <p className="text-lg text-gray-300">
                  To be the architects of tomorrow&apos;s digital success stories. We envision a future where every brand interaction is impactful, every campaign is intelligent, and every client achieves unparalleled digital eminence through our strategic partnership.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-64 md:h-auto relative">
            {!isReducedMotion ? (
              <div className="w-full h-full flex items-center justify-center">
                 <Canvas camera={{ position: [0, 0, 3], fov: 35 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} />
                    <Suspense fallback={null}>
                        <TorusKnot args={[0.6, 0.15, 128, 16]} scale={1.2}>
                            <meshStandardMaterial color="#8A2BE2" emissive="#4B0082" roughness={0.1} metalness={0.7} />
                        </TorusKnot>
                    </Suspense>
                 </Canvas>
              </div>
            ) : (
              <Image src="/assets/about/mission_vision_placeholder.jpg" alt="Mission and Vision Abstract" width={500} height={400} className="rounded-lg shadow-2xl object-cover w-full h-full" />
            )}
          </div>
        </div>
      </section>

      {/* Our Approach / Differentiators Section */} 
      <section className="content-section py-20 px-8 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-purple-400">The 3PWeb Edge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover-lift transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-pink-500">Strategic Precision</h3>
              <p className="text-lg text-gray-300">
                Our strategies are not guesswork. We dive deep into market analytics, audience behavior, and your unique brand DNA to architect bespoke marketing blueprints. From hyper-targeted paid campaigns to compelling brand narratives, every move is calculated for maximum impact.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover-lift transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-pink-500">Creative Alchemy</h3>
              <p className="text-lg text-gray-300">
                We blend artistry with analytics. Our team crafts stunning landing pages, captivating branding, and engaging content that not only looks exceptional but converts. We believe in design that drives desire and communication that commands attention.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover-lift transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-pink-500">Future-Forward Tech</h3>
              <p className="text-lg text-gray-300">
                Embracing the forefront of digital innovation, we integrate advanced tools and platforms to optimize campaigns, enhance user experiences, and unlock new avenues for growth. We are constantly exploring emerging trends to keep your brand ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Conceptual - No fake names) */} 
      <section className="content-section py-20 px-8 bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-purple-400">Our Collective Genius</h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-12">
            3PWeb is powered by a diverse collective of strategists, creatives, data scientists, and technologists. We foster a culture of radical collaboration, continuous learning, and an unwavering commitment to our clients&apos; success. Our strength lies in our shared passion for pushing boundaries and achieving the extraordinary.
          </p>
          <div className="w-full h-80 relative">
            {!isReducedMotion ? (
              <div className="w-full h-full flex items-center justify-center">
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[-5, 5, 5]} intensity={0.7} />
                    <Suspense fallback={null}>
                        <Sphere args={[1, 32, 32]} scale={1.1}>
                            <meshStandardMaterial color="#FF1493" emissive="#C71585" roughness={0.3} metalness={0.4} wireframe />
                        </Sphere>
                    </Suspense>
                </Canvas>
              </div>
            ) : (
              <Image src="/assets/about/team_placeholder.jpg" alt="Our Team Abstract" width={600} height={400} className="rounded-lg shadow-2xl object-cover mx-auto" />
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */} 
      <section className="content-section py-24 px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Redefine Your Digital Presence?</h2>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100 mb-10">
          Let&apos;s collaborate to build something truly remarkable. Partner with 3PWeb and unlock the full potential of your brand in the digital age.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-white text-purple-700 font-bold text-lg py-4 px-10 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
        >
          Start Your Transformation
        </a>
      </section>

      <style jsx global>{`
        .hover-lift:hover {
          transform: translateY(-10px);
        }
        .animate-in-title, .animate-in-subtitle {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-in-title {
          animation-delay: 0.2s;
        }
        .animate-in-subtitle {
          animation-delay: 0.5s;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

