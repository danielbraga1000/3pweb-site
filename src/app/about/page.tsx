"use client";

import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Icosahedron, TorusKnot, Stars, Html, PointMaterial, Points } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Re-usable InteractiveParticles component (similar to homepage, can be centralized later)
const InteractiveParticles = ({ count = 1500, color = "#FFFFFF", size = 0.018 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * (viewport.width + 4);
    }
    return pos;
  }, [count, viewport.width]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.25 + Math.abs(mousePosition.x * 0.3), 0.07);
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mousePosition.x * 0.1, 0.025);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mousePosition.y * 0.1, 0.025);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation={true} depthWrite={false} opacity={0.25} />
    </Points>
  );
};


const FloatingShape = ({ shapeType = "icosahedron", color = "#8A2BE2", emissiveColor = "#4B0082" }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.004;
      // Subtle mouse follow
      const targetRotationX = meshRef.current.rotation.x + mousePosition.y * 0.1;
      const targetRotationY = meshRef.current.rotation.y + mousePosition.x * 0.1;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);
      // Bobbing motion
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.15;
    }
  });

  const geometry = useMemo(() => {
    switch (shapeType) {
      case "torusknot":
        return <TorusKnot args={[0.7, 0.12, 150, 20]} />;
      case "sphere":
        return <Sphere args={[0.9, 32, 32]} />;
      case "icosahedron":
      default:
        return <Icosahedron args={[1, 0]} />;
    }
  }, [shapeType]);

  return (
    <mesh ref={meshRef} scale={shapeType === "sphere" ? 0.9 : 0.8}>
      {geometry}
      <meshStandardMaterial color={color} emissive={emissiveColor} roughness={0.15} metalness={0.75} wireframe={shapeType === "sphere"} />
    </mesh>
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
    if (!pageRef.current) return;

    const commonScrollTriggerConfig = {
      start: "top 85%",
      toggleActions: "play none none reverse",
    };

    // Animate sections
    const sections = gsap.utils.toArray<HTMLElement>(".content-section");
    sections.forEach((section) => {
      const animationProps = isReducedMotion 
        ? { opacity: 1, duration: 0.01 } // Instant for reduced motion
        : { opacity: 1, y: 0, duration: 1, ease: "power4.out" }; 
      gsap.fromTo(section, 
        { opacity: 0, y: isReducedMotion ? 0 : 80 }, 
        {
          ...animationProps,
          scrollTrigger: {
            trigger: section,
            ...commonScrollTriggerConfig,
          }
        }
      );

      if (!isReducedMotion) {
        const h2Element = section.querySelector("h2");
        if (h2Element) {
          const splitHeadline = new SplitText(h2Element, { type: "words,chars" });
          gsap.from(splitHeadline.chars, {
            duration: 0.7,
            opacity: 0,
            y: 25,
            ease: "power3.out",
            stagger: 0.025,
            scrollTrigger: { trigger: h2Element, ...commonScrollTriggerConfig, start: "top 90%" }
          });
        }

        const paragraphsAndLists = section.querySelectorAll("p, li");
        gsap.from(paragraphsAndLists, {
          duration: 0.9,
          opacity: 0,
          y: 35,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.15,
          scrollTrigger: { trigger: section, ...commonScrollTriggerConfig, start: "top 88%" }
        });

        // Card hover effects for "The 3PWeb Edge" section
        if (section.classList.contains("edge-section")) {
          const edgeCards = section.querySelectorAll<HTMLElement>(".edge-card-item");
          edgeCards.forEach(card => {
            gsap.set(card, { transformPerspective: 1000 });
            const hoverTimeline = gsap.timeline({ paused: true });
            hoverTimeline.to(card, { y: -15, scale: 1.03, duration: 0.3, ease: "power2.out" })
                         .to(card.style, { boxShadow: "0 15px 30px -10px rgba(0,0,0,0.3)", background: "linear-gradient(145deg, var(--color-card-hover-start, #2C2C2C), var(--color-card-hover-end, #1E1E1E))" }, "-=0.3");
            card.addEventListener("mouseenter", () => hoverTimeline.play());
            card.addEventListener("mouseleave", () => hoverTimeline.reverse());
          });
        }
      }
    });

  }, [isReducedMotion]);

  return (
    <div ref={pageRef} className="min-h-screen bg-brandBackground text-brandText font-sans selection:bg-brandPrimary selection:text-brandBackground">
      {/* Hero Section */}
      <section className="content-section min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-hero-gradient bg-300% animate-gradientShift"></div>
        <div className="absolute inset-0 z-0 opacity-60">
          {!isReducedMotion && (
            <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <Suspense fallback={<Html center><p className=\'text-brandTextSecondary/70 text-sm\'>Loading...</p></Html>}>
                <InteractiveParticles count={1200} color="#00E5FF" size={0.015} />
                <FloatingShape shapeType="icosahedron" color="#7F00FF" emissiveColor="#5E00B3" />
              </Suspense>
            </Canvas>
          )}
        </div>
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary">
            Forging Digital Realities.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-brandTextSecondary">
            At 3PWeb, we don&apos;t just navigate the digital landscape; we sculpt it. We are a Dubai-based nexus of innovation, strategy, and creative prowess, dedicated to elevating brands into digital powerhouses.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="content-section py-20 md:py-28 px-6 bg-brandBackgroundAlt">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="prose prose-lg prose-invert max-w-none text-brandTextSecondary">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-brandPrimary font-display">Our Mission & Vision</h2>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-brandAccent">Mission</h3>
              <p>
                To empower businesses with transformative digital marketing strategies, leveraging cutting-edge technology and data-driven insights. We craft bespoke solutions in paid traffic, branding, and high-conversion landing pages that deliver measurable results and sustainable growth.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-3 text-brandAccent">Vision</h3>
              <p>
                To be the architects of tomorrow&apos;s digital success stories. We envision a future where every brand interaction is impactful, every campaign is intelligent, and every client achieves unparalleled digital eminence through our strategic partnership.
              </p>
            </div>
          </div>
          <div className="w-full h-80 md:h-[450px] relative rounded-xl overflow-hidden shadow-2xl">
            {!isReducedMotion ? (
              <div className="w-full h-full flex items-center justify-center bg-brandCard/30">
                 <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[3, 3, 3]} intensity={1} />
                    <Suspense fallback={<Html center><p className=\'text-brandTextSecondary/70 text-xs\'>...</p></Html>}>
                        <FloatingShape shapeType="torusknot" color="#FF007F" emissiveColor="#B30059" />
                    </Suspense>
                 </Canvas>
              </div>
            ) : (
              <Image src="/assets/about/mission_vision_placeholder.jpg" alt="Mission and Vision Abstract" layout="fill" objectFit="cover" className="rounded-lg" />
            )}
          </div>
        </div>
      </section>

      {/* Our Approach / Differentiators Section */}
      <section className="content-section edge-section py-20 md:py-28 px-6 bg-brandBackground">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-brandPrimary font-display">The 3PWeb Edge</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[{
                title: "Strategic Precision",
                description: "Our strategies are not guesswork. We dive deep into market analytics, audience behavior, and your unique brand DNA to architect bespoke marketing blueprints. From hyper-targeted paid campaigns to compelling brand narratives, every move is calculated for maximum impact.",
                icon: "🎯" // Placeholder, replace with actual icon component
            },{
                title: "Creative Alchemy",
                description: "We blend artistry with analytics. Our team crafts stunning landing pages, captivating branding, and engaging content that not only looks exceptional but converts. We believe in design that drives desire and communication that commands attention.",
                icon: "🎨" // Placeholder
            },{
                title: "Future-Forward Tech",
                description: "Embracing the forefront of digital innovation, we integrate advanced tools and platforms to optimize campaigns, enhance user experiences, and unlock new avenues for growth. We are constantly exploring emerging trends to keep your brand ahead of the curve.",
                icon: "🚀" // Placeholder
            }].map((item, index) => (
                <div key={index} className="edge-card-item bg-brandCard p-8 rounded-xl shadow-xl border border-brandBorder/50 transition-all duration-300 flex flex-col items-start">
                    <div className="text-4xl mb-5 text-brandAccent">{item.icon}</div>
                    <h3 className="text-2xl font-semibold mb-4 text-brandPrimaryDark font-display">{item.title}</h3>
                    <p className="text-brandTextSecondary leading-relaxed">{item.description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Conceptual) */}
      <section className="content-section py-20 md:py-28 px-6 bg-brandBackgroundAlt">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-brandPrimary font-display">Our Collective Genius</h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-brandTextSecondary mb-12">
            3PWeb is powered by a diverse collective of strategists, creatives, data scientists, and technologists. We foster a culture of radical collaboration, continuous learning, and an unwavering commitment to our clients&apos; success. Our strength lies in our shared passion for pushing boundaries and achieving the extraordinary.
          </p>
          <div className="w-full h-80 md:h-96 relative rounded-xl overflow-hidden shadow-xl">
            {!isReducedMotion ? (
              <div className="w-full h-full flex items-center justify-center bg-brandCard/30">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[-3, 3, 3]} intensity={0.9} />
                    <Suspense fallback={<Html center><p className=\'text-brandTextSecondary/70 text-xs\'>...</p></Html>}>
                        <FloatingShape shapeType="sphere" color="#00E5FF" emissiveColor="#00A3B3" />
                    </Suspense>
                </Canvas>
              </div>
            ) : (
              <Image src="/assets/about/team_placeholder.jpg" alt="Our Team Abstract" layout="fill" objectFit="cover" className="rounded-lg" />
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="content-section py-24 md:py-32 px-6 bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary text-center">
        <div className="animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-brandBackground">Ready to Redefine Your Digital Presence?</h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-brandBackground/90 mb-10">
            Let&apos;s collaborate to build something truly remarkable. Partner with 3PWeb and unlock the full potential of your brand in the digital age.
          </p>
          <a 
            href="/contact" // Assuming a contact page will exist
            className="inline-block bg-brandBackground text-brandPrimary font-bold text-lg py-4 px-10 rounded-lg shadow-lg hover:bg-brandBackground/95 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Start Your Transformation
          </a>
        </div>
      </section>

      {/* Minimal style block for keyframe animations if not handled by Tailwind globally */}
      <style jsx global>{`
        :root {
          --color-card-hover-start: #2C2C2C; /* Example, adjust if needed */
          --color-card-hover-end: #1E1E1E;   /* Example, adjust if needed */
        }
        .prose-invert h2, .prose-invert h3 {
          color: inherit; /* Let Tailwind classes handle color */
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-hero-gradient {
          background: linear-gradient(270deg, #0d0d0d, #1a0a1f, #0d0d0d, #1f0a1a);
          background-size: 300% 300%;
        }
        .animate-gradientShift {
          animation: gradientShift 15s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

