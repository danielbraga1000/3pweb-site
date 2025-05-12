"use client";

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Image as DreiImage, Text as DreiText } from '@react-three/drei';
import { Lenis, useLenis } from "@studio-freight/react-lenis";
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder for individual sections within the horizontal scroll
const AboutSection = ({ title, children, image, imagePosition = 'right' }: {
  title: string;
  children: React.ReactNode;
  image?: string;
  imagePosition?: 'left' | 'right';
}) => {
  const sectionRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current.querySelectorAll(".animate-in"), 
        { opacity: 0, y: 50 }, 
        {
          opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%", // Start animation when 80% of the section is in view
            // toggleActions: "play none none reverse", // Optional: reverse animation on scroll out
          }
        }
      );
    }
  }, []);

  return (
    <div ref={sectionRef} className={`w-screen h-screen flex items-center justify-center p-8 md:p-16 snap-center ${imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-full md:w-1/2 ${imagePosition === 'left' ? 'md:pl-12' : 'md:pr-12'} flex flex-col justify-center`}>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary font-display animate-in">{title}</h2>
        <div className="text-lg md:text-xl text-text/90 space-y-4 animate-in">
          {children}
        </div>
      </div>
      {image && (
        <div className="hidden md:flex w-1/2 h-full items-center justify-center animate-in">
          {/* Placeholder for a 3D interactive image or model later */}
          <img src={image} alt={title} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
};

// Main About Page Component
const AboutPageContent = () => {
  const { width, height } = useThree(state => state.viewport);
  const scroll = useScroll(); // Drei's scroll hook for R3F scroll-based animations

  // Example: Animate a 3D object based on scroll
  const FloatingObject = () => {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame(() => {
      if (mesh.current) {
        // scroll.offset gives a value from 0 to 1 based on scroll progress
        mesh.current.rotation.x = scroll.offset * Math.PI * 2;
        mesh.current.rotation.y = scroll.offset * Math.PI * 1.5;
        mesh.current.position.z = Math.sin(scroll.offset * Math.PI * 2) * 2;
      }
    });
    return (
      <mesh ref={mesh} position={[width / 4, -height / 3, -1]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#2ECC71" emissive="#27AE60" roughness={0.2} metalness={0.7} />
      </mesh>
    );
  };

  return (
    <Scroll>
      {/* This is where the 3D scene for the About page will live */}
      {/* For now, a simple floating object */}
      <FloatingObject />
      {/* You can add more 3D elements here that react to scroll */}
    </Scroll>
  );
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (lenisRef.current && containerRef.current) {
      const sections = gsap.utils.toArray(".snap-center") as HTMLElement[];
      if (sections.length === 0) return;

      // Horizontal scroll with GSAP ScrollTrigger
      // This setup assumes your Lenis instance is handling the main scroll.
      // For a pure GSAP horizontal scroll, you might need a different setup or to disable Lenis on this page.
      // This is a simplified example; Lusion's effect is more complex and tightly integrated.
      
      let ctx = gsap.context(() => {
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 1 / (sections.length - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.1,
              ease: "power1.inOut"
            },
            end: () => "+=" + (containerRef.current.offsetWidth * (sections.length -1 )),
            // markers: true, // for debugging
          }
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <Lenis root options={{ lerp: 0.07, smoothWheel: true, orientation: 'horizontal', gestureOrientation: 'both' }} ref={lenisRef}>
      <div ref={containerRef} className="w-full h-screen overflow-hidden"> {/* Main container for horizontal scroll */}
        <div className="flex w-max h-screen"> {/* Inner container for all sections */}
          <AboutSection title="Our Genesis" image="/assets/placeholder_image_1.jpg">
            <p>3PWeb was born from a vision to redefine digital interaction. We saw a future where technology and creativity converge to create truly immersive online experiences. Our journey began with a small team of passionate innovators, driven by the desire to push the boundaries of what's possible in web development and digital marketing.</p>
            <p>This section will narrate our founding story, inspirations, and the core philosophies that guide us. Expect dynamic visuals and subtle 3D elements that animate as you scroll, drawing you into our world.</p>
          </AboutSection>

          <AboutSection title="The Lusion Inspiration" image="/assets/placeholder_image_2.jpg" imagePosition="left">
            <p>The groundbreaking work of studios like Lusion, particularly their innovative use of WebGL and interactive storytelling, serves as a significant source of inspiration for us. We aim to capture that same sense of wonder and technical excellence, adapting it to our unique brand and client needs.</p>
            <p>Here, we'll delve into how we translate this inspiration into tangible results, creating websites that are not just visually stunning but also deeply engaging and performant. This section will feature interactive elements that respond to your mouse movements, hinting at the depth of our technical capabilities.</p>
          </AboutSection>

          <AboutSection title="Our Core Technologies" image="/assets/placeholder_image_3.jpg">
            <p>At the heart of 3PWeb lies a commitment to leveraging cutting-edge technologies. We specialize in Next.js for robust and scalable applications, Three.js for breathtaking 3D visuals, GSAP for fluid animations, and Sanity CMS for flexible content management. This powerful stack allows us to build digital experiences that are both innovative and reliable.</p>
            <p>This part of the journey will showcase our tech stack through interactive diagrams or abstract 3D representations, making complex concepts accessible and engaging. Scroll-triggered animations will reveal layers of information, highlighting our expertise.</p>
          </AboutSection>
          
          <AboutSection title="Meet the Visionaries" image="/assets/placeholder_image_4.jpg" imagePosition="left">
            <p>Our team is our greatest asset. Composed of designers, developers, strategists, and artists, we are a collective of creative minds dedicated to excellence. We believe in collaboration, continuous learning, and a client-centric approach to every project.</p>
            <p>Discover the people behind 3PWeb. This section might feature stylized team member profiles with hover effects or a dynamic 3D representation of our collaborative spirit. The goal is to convey our passion and expertise through a human-centric lens.</p>
          </AboutSection>
        </div>
      </div>

      {/* The 3D Canvas for scroll-based animations. It's positioned absolutely to overlay the HTML content or integrate with it. */}
      {/* For a true Lusion-like effect, the 3D scene would be more complex and directly tied to the horizontal scroll sections. */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <Suspense fallback={null}>
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 5, 5]} intensity={1.5} castShadow />
            <ScrollControls pages={4} horizontal damping={0.3}> {/* `pages` should match number of sections */}
              <AboutPageContent />
            </ScrollControls>
          </Canvas>
        </Suspense>
      </div>
    </Lenis>
  );
}

