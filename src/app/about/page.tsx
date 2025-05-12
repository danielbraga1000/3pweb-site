"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Icosahedron as DreiIcosahedron } from '@react-three/drei'; // Removed Scroll, Html
// Removed useLenis as it's not used in this specific file structure for horizontal scroll
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AboutPanelProps {
  title: string;
  children: React.ReactNode;
  image?: string;
  imagePosition?: 'left' | 'right';
  panelId: string;
  bgColor?: string;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ title, children, image, imagePosition = 'right', panelId, bgColor = 'bg-background' }) => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !sectionRef.current) return;

    const elementsToAnimate = sectionRef.current.querySelectorAll(".animate-in");
    const titleElement = sectionRef.current.querySelector(".panel-title");

    if (titleElement && panelId === "panel-1") { // Specific animation for Panel 1 title
      const split = new SplitText(titleElement, { type: "chars,words" });
      gsap.from(split.chars, {
        opacity: 0,
        x: -50,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: ScrollTrigger.getById("mainScroll"), // Link to horizontal scroll animation
          start: "left 80%", // Trigger when 80% of the panel is in view from the left
          toggleActions: "play none none none",
        }
      });
    } else if (titleElement) {
       gsap.from(titleElement, { 
        opacity: 0, y: 50, duration: 0.8, ease: "power3.out", 
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: ScrollTrigger.getById("mainScroll"),
          start: "left 80%", 
          toggleActions: "play none none none",
        }
      });
    }
    
    elementsToAnimate.forEach((el, index) => {
      if (el === titleElement && panelId === "panel-1") return; // Skip if it's panel 1 title (already animated)
      gsap.from(el, {
        opacity: 0,
        y: panelId === "panel-2" ? 0 : 50, // No y-offset for panel 2 cards, they stagger in
        x: panelId === "panel-2" ? 20 : 0, // x-offset for panel 2 cards
        duration: 0.8,
        ease: "power3.out",
        stagger: panelId === "panel-2" ? 0.2 : 0, // Stagger for panel 2 cards
        delay: panelId !== "panel-1" && el === titleElement ? 0 : (panelId === "panel-2" ? 0.3 + index * 0.1 : 0.3), // Delay for non-title elements or panel 2 cards
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: ScrollTrigger.getById("mainScroll"),
          start: "left 75%",
          toggleActions: "play none none none",
        }
      });
    });

    if (panelId === "panel-4" && !isReducedMotion) {
      const avatars = sectionRef.current.querySelectorAll<HTMLElement>(".team-avatar-container");
      avatars.forEach(avatar => {
        gsap.set(avatar.querySelector("img"), { transformOrigin: "center" });
        avatar.addEventListener('mouseenter', () => gsap.to(avatar.querySelector("img"), { scale: 1.1, rotationY: 15, rotationX: -10, duration: 0.3, ease: "power2.out" }));
        avatar.addEventListener('mouseleave', () => gsap.to(avatar.querySelector("img"), { scale: 1, rotationY: 0, rotationX: 0, duration: 0.3, ease: "power2.out" }));
      });
    }

  }, [isReducedMotion, panelId]);

  return (
    <div ref={sectionRef} className={`w-screen h-screen flex-shrink-0 flex items-center justify-center p-8 md:p-16 snap-center ${bgColor} ${image && imagePosition === 'left' ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
      <div className={`w-full md:w-1/2 ${image && (imagePosition === 'left' ? 'md:pl-8 lg:pl-16' : 'md:pr-8 lg:pr-16')} flex flex-col justify-center text-center md:text-left`}>
        <h2 className="panel-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary font-display">{title}</h2>
        <div className="text-lg md:text-xl text-text/90 space-y-4 animate-in">
          {children}
        </div>
      </div>
      {image && (
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center mt-8 md:mt-0 animate-in">
          {isReducedMotion ? (
            <img src={image} alt={title} className="max-w-full max-h-[50vh] md:max-h-[60vh] object-contain rounded-lg shadow-2xl" />
          ) : (
            <div className="w-full h-full relative">
              {/* Placeholder for more complex 3D image/scene if needed, for now, simple image */}
              <img src={image} alt={title} className="max-w-full max-h-[50vh] md:max-h-[60vh] object-contain rounded-lg shadow-2xl" />
              {panelId === "panel-3" && <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Background3DScene = () => {
  const { viewport } = useThree(); // Removed size as it's not used
  const scroll = useScroll();
  const icosahedronRef = useRef<THREE.Mesh>(null!);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame(() => {
    if (isReducedMotion || !icosahedronRef.current) return;
    const progress = scroll.offset;
    icosahedronRef.current.position.x = gsap.utils.mapRange(0, 1, -viewport.width / 1.5, viewport.width * 1.5, progress);
    icosahedronRef.current.position.y = Math.sin(progress * Math.PI * 2) * 0.5; // Gentle bobbing
    icosahedronRef.current.rotation.x = progress * Math.PI * 1;
    icosahedronRef.current.rotation.y = progress * Math.PI * 1.5;
    icosahedronRef.current.rotation.z = progress * Math.PI * 0.5;
  });

  if (isReducedMotion) return null;

  return (
    <DreiIcosahedron ref={icosahedronRef} args={[0.8, 1]} position={[0, 0, -3]}>
      <meshStandardMaterial color="#2ECC71" emissive="#27AE60" roughness={0.3} metalness={0.1} transparent opacity={0.6} wireframe={false} />
    </DreiIcosahedron>
  );
};

export default function AboutPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null!);
  const horizontalScrollContainerRef = useRef<HTMLDivElement>(null!);
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQueryReducedMotion.matches);
    const handleChangeReducedMotion = () => setIsReducedMotion(mediaQueryReducedMotion.matches);
    mediaQueryReducedMotion.addEventListener('change', handleChangeReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQueryReducedMotion.removeEventListener('change', handleChangeReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (isMobile || isReducedMotion || !horizontalScrollContainerRef.current || !mainContainerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(".snap-center");
    if (sections.length === 0) return;

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: mainContainerRef.current, // The main viewport height container
        pin: true,
        scrub: 0.5,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.5 },
          delay: 0.1,
          ease: "power1.inOut"
        },
        end: () => "+=" + (horizontalScrollContainerRef.current.offsetWidth - window.innerWidth),
        id: "mainScroll", // ID for other ScrollTriggers to link to
        // markers: true, // For debugging
      }
    });
    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill()); // Clean up all ScrollTriggers
    };
  }, [isMobile, isReducedMotion]);

  if (isMobile || isReducedMotion) {
    // Vertical Layout for Mobile / Reduced Motion
    return (
      <div className="flex flex-col bg-background">
        <AboutPanel panelId="panel-1" title="Our Genesis" bgColor="bg-background-alt">
          <p>3PWeb was forged in the vibrant innovation hub of Dubai, born from a collective ambition to redefine digital frontiers. We envisioned a future where technology and creativity intertwine, crafting online experiences that are not just viewed, but felt. Our journey started with a dedicated team, passionate about pushing the limits of web development and AI-driven marketing, aiming to deliver transformative results for a global clientele. We believe in the power of immersive storytelling to connect brands with their audiences in truly meaningful ways.</p>
        </AboutPanel>
        <AboutPanel panelId="panel-2" title="Mission & Vision" bgColor="bg-background">
          <ul className="list-disc list-inside space-y-3">
            <li><strong>Mission:</strong> To empower businesses with pioneering AI and Web3 marketing solutions, creating unparalleled digital engagement and measurable growth on a global scale.</li>
            <li><strong>Vision:</strong> To be the leading architect of immersive digital futures, where every interaction is an opportunity for profound connection and brand elevation.</li>
            <li>We strive to make cutting-edge technology accessible and impactful, transforming complex challenges into elegant, user-centric digital experiences that captivate and convert.</li>
          </ul>
        </AboutPanel>
        <AboutPanel panelId="panel-3" title="Dubai Hub Advantage" image={isReducedMotion ? "/assets/about/skyline.jpg" : undefined} bgColor="bg-background-alt">
          <p>Strategically based in Dubai, 3PWeb leverages the city&apos;s dynamic ecosystem, world-class infrastructure, and status as a global nexus for innovation. The forward-thinking regulatory environment and proactive support for tech enterprises, particularly within its specialized free zones, provide an unparalleled launchpad for businesses aiming for international reach. This unique advantage allows us to connect our clients with diverse markets, fostering growth and opportunity at the very crossroads of the world, where East meets West and tradition meets tomorrow.</p>
        </AboutPanel>
        <AboutPanel panelId="panel-4" title="Team & Culture" bgColor="bg-background">
          <p>Our strength lies in our diverse team of strategists, designers, developers, and AI specialists. We cultivate a culture of relentless innovation, radical transparency, and unwavering client-centricity. Collaboration is at our core, fostering an environment where creative ideas flourish and technical excellence is paramount. We are committed to continuous learning, adapting to the ever-evolving digital landscape to ensure our partners always stay ahead. Meet the minds dedicated to sculpting your digital success story with passion and precision.</p>
          {isReducedMotion && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <img src="/assets/about/team1.jpg" alt="Team Member 1" className="rounded-lg shadow-md" />
              <img src="/assets/about/team2.jpg" alt="Team Member 2" className="rounded-lg shadow-md" />
              <img src="/assets/about/team3.jpg" alt="Team Member 3" className="rounded-lg shadow-md" />
              <img src="/assets/about/team4.jpg" alt="Team Member 4" className="rounded-lg shadow-md" />
            </div>
          )}
        </AboutPanel>
      </div>
    );
  }

  // Horizontal Scroll Layout for Desktop
  return (
    <div ref={mainContainerRef} className="w-full h-screen overflow-hidden bg-background">
      <div ref={horizontalScrollContainerRef} className="flex w-max h-screen"> {/* Inner container for all sections */}
        <AboutPanel panelId="panel-1" title="Our Genesis" bgColor="bg-background-alt">
          <p>3PWeb was forged in the vibrant innovation hub of Dubai, born from a collective ambition to redefine digital frontiers. We envisioned a future where technology and creativity intertwine, crafting online experiences that are not just viewed, but felt. Our journey started with a dedicated team, passionate about pushing the limits of web development and AI-driven marketing, aiming to deliver transformative results for a global clientele. We believe in the power of immersive storytelling to connect brands with their audiences in truly meaningful ways.</p>
        </AboutPanel>
        <AboutPanel panelId="panel-2" title="Mission & Vision" bgColor="bg-background">
          <ul className="list-none space-y-4">
            <li className="animate-in"><strong className='text-primary-dark'>Mission:</strong> To empower businesses with pioneering AI and Web3 marketing solutions, creating unparalleled digital engagement and measurable growth on a global scale.</li>
            <li className="animate-in"><strong className='text-primary-dark'>Vision:</strong> To be the leading architect of immersive digital futures, where every interaction is an opportunity for profound connection and brand elevation.</li>
            <li className="animate-in">We strive to make cutting-edge technology accessible and impactful, transforming complex challenges into elegant, user-centric digital experiences that captivate and convert.</li>
          </ul>
        </AboutPanel>
        <AboutPanel panelId="panel-3" title="Dubai Hub Advantage" image="/assets/about/skyline.jpg" bgColor="bg-background-alt">
          <p>Strategically based in Dubai, 3PWeb leverages the city&apos;s dynamic ecosystem, world-class infrastructure, and status as a global nexus for innovation. The forward-thinking regulatory environment and proactive support for tech enterprises, particularly within its specialized free zones, provide an unparalleled launchpad for businesses aiming for international reach. This unique advantage allows us to connect our clients with diverse markets, fostering growth and opportunity at the very crossroads of the world, where East meets West and tradition meets tomorrow.</p>
        </AboutPanel>
        <AboutPanel panelId="panel-4" title="Team & Culture" bgColor="bg-background">
          <p>Our strength lies in our diverse team of strategists, designers, developers, and AI specialists. We cultivate a culture of relentless <strong className='text-accent'>Innovation</strong>, radical <strong className='text-accent'>Transparency</strong>, and unwavering <strong className='text-accent'>Client-Centricity</strong>. Collaboration is at our core, fostering an environment where creative ideas flourish and technical excellence is paramount. We are committed to continuous learning, adapting to the ever-evolving digital landscape to ensure our partners always stay ahead. Meet the minds dedicated to sculpting your digital success story with passion and precision.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="team-avatar-container animate-in aspect-square bg-gray-700 rounded-lg overflow-hidden shadow-lg perspective-1000">
                <img src={`/assets/about/team${i}.jpg`} alt={`Team Member ${i}`} className="w-full h-full object-cover transition-transform duration-300 ease-out" />
              </div>
            ))}
          </div>
        </AboutPanel>
      </div>

      {/* 3D Background Canvas - only for non-mobile, non-reduced-motion */}
      {!isMobile && !isReducedMotion && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
          <Suspense fallback={null}>
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[0, 5, 10]} intensity={1.2} />
              <ScrollControls pages={4} horizontal damping={0.2} distance={1}>
                <Background3DScene />
              </ScrollControls>
            </Canvas>
          </Suspense>
        </div>
      )}
    </div>
  );
}

