"use client";

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TorusKnot, Html, Points, PointMaterial } from '@react-three/drei';
import { useLenis } from "@studio-freight/react-lenis";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, SplitText);

const PlaceholderIcon = ({ className = "w-12 h-12 text-brandAccent" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

// Enhanced Particle System Component
const InteractiveParticles = ({ count = 2000, color = "#8E44AD", size = 0.015 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * (viewport.width + 5); // Spread particles wider
    }
    return pos;
  }, [count, viewport.width]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003; // Slow rotation
      // Subtle mouse follow effect for the whole particle system
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.3 + Math.abs(mousePosition.x * 0.4), 0.08); // Opacity reacts to mouse X
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mousePosition.x * 0.15, 0.03);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mousePosition.y * 0.15, 0.03);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
};


const TorusKnotScene = () => {
  const knotRef = useRef<THREE.Mesh>(null!);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Custom Shader Material for Lusion-like effects
  const customShaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color("#7F00FF") }, // brandPrimary
      emissiveColor: { value: new THREE.Color("#5E00B3") }, // brandPrimaryDark
      noiseScale: { value: 0.6 },
      pulseSpeed: { value: 0.4 },
      clickEffect: { value: 0.0 }, // For click interaction
      mousePos: { value: new THREE.Vector2(0,0) } // For mouse move interaction on shader
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vNoise;
      uniform float time;
      uniform float noiseScale;
      uniform vec2 mousePos;
      
      // Basic Simplex Noise (replace with a more robust version if needed)
      float snoise(vec3 uv) {
        return fract(sin(dot(uv, vec3(12.9898, 78.233, 151.7182))) * 43758.5453123);
      }

      void main() {
        vUv = uv;
        vec3 pos = position;
        // Noise displacement
        float displacement = snoise(pos * noiseScale + time * 0.15) * 0.08;
        // Mouse interaction: push vertices away from mouse
        float mouseDistance = length(pos.xy - mousePos * 2.0); // Adjust multiplier for effect radius
        displacement += (1.0 - smoothstep(0.0, 0.5, mouseDistance)) * -0.18; // Push effect

        pos += normal * displacement;
        vNoise = displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vNoise;
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 emissiveColor;
      uniform float pulseSpeed;
      uniform float clickEffect;

      void main() {
        float pulse = (sin(time * pulseSpeed + vUv.y * 2.8) * 0.5 + 0.5) * 0.25 + 0.75; // Pulse effect
        vec3 finalColor = baseColor * pulse;
        finalColor += emissiveColor * (0.45 + vNoise * 1.6); // Emissive based on noise
        finalColor += vec3(clickEffect * 0.65); // Click flash effect
        gl_FragColor = vec4(finalColor, clamp(1.0 - abs(vNoise * 2.8), 0.3, 1.0)); // Modulate alpha by noise
      }
    `,
    transparent: true,
  }), []);
  const [mouse2D, setMouse2D] = useState(new THREE.Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Update for knot rotation
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
      // Update for shader interaction
      setMouse2D(new THREE.Vector2(event.clientX / window.innerWidth, 1.0 - (event.clientY / window.innerHeight)));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (knotRef.current) {
      // Base rotation
      knotRef.current.rotation.x += 0.002;
      knotRef.current.rotation.y += 0.003;

      // Mouse follow rotation (lerped for smoothness)
      const targetRotationX = knotRef.current.rotation.x + mousePosition.y * 0.2;
      const targetRotationY = knotRef.current.rotation.y + mousePosition.x * 0.2;
      knotRef.current.rotation.x = THREE.MathUtils.lerp(knotRef.current.rotation.x, targetRotationX, 0.04);
      knotRef.current.rotation.y = THREE.MathUtils.lerp(knotRef.current.rotation.y, targetRotationY, 0.04);

      // Update shader uniforms
      if (customShaderMaterial.uniforms) {
        customShaderMaterial.uniforms.time.value = clock.getElapsedTime();
        customShaderMaterial.uniforms.clickEffect.value = THREE.MathUtils.lerp(customShaderMaterial.uniforms.clickEffect.value, 0.0, 0.08); // Fade out click effect
        customShaderMaterial.uniforms.mousePos.value.lerp(mouse2D, 0.05); // Lerp mouse position for shader
      }
    }
  });

  const handleClick = () => {
    if (customShaderMaterial.uniforms) {
        customShaderMaterial.uniforms.clickEffect.value = 1.0; // Trigger click effect
    }
  };

  return (
    <TorusKnot ref={knotRef} args={[1.2, 0.3, 250, 28]} scale={1.2} onClick={handleClick}>
      <primitive object={customShaderMaterial} />
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
    if (isReducedMotion) {
      // Simplified animations for reduced motion
      gsap.utils.toArray<HTMLElement>('.animate-on-scroll').forEach(el => {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.7, scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
      return;
    }

    if (headlineRef.current) {
      const splitHeadline = new SplitText(headlineRef.current, { type: "chars,words" });
      gsap.from(splitHeadline.chars, {
        opacity: 0, y: 70, stagger: 0.03, duration: 1.1, ease: "power4.out", delay: 0.4
      });
    }
    if (subHeadlineRef.current) {
      gsap.from(subHeadlineRef.current, { opacity: 0, y: 50, duration: 1.1, ease: "power4.out", delay: 1 });
    }
    if (ctaRef.current) {
      gsap.from(ctaRef.current, { opacity: 0, scale: 0.65, duration: 1.1, ease: "elastic.out(1, 0.7)", delay: 1.3 });
      // Enhanced CTA hover
      const ctaButton = ctaRef.current;
      const ctaTimeline = gsap.timeline({ paused: true });
      ctaTimeline.to(ctaButton, { scale: 1.08, duration: 0.25, ease: "power2.out" })
                 .to(ctaButton.style, { boxShadow: "0 0 25px 5px rgba(var(--color-primary-rgb), 0.5)", duration: 0.25 }, "-=0.25"); // Using primary color for glow
      ctaButton.addEventListener('mouseenter', () => ctaTimeline.play());
      ctaButton.addEventListener('mouseleave', () => ctaTimeline.reverse());
    }

    const cards = gsap.utils.toArray<HTMLElement>('.edge-card');
    cards.forEach((card: HTMLElement) => {
      gsap.set(card, { transformPerspective: 1200 }); // For 3D-like hover
      const cardTimeline = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" }
      });
      cardTimeline.from(card, {
        opacity: 0, y: 80, rotationX: -25, duration: 0.9, ease: "power3.out"
      });
      // Enhanced card hover
      const hoverTimeline = gsap.timeline({ paused: true });
      hoverTimeline.to(card, { y: -18, rotationX: 6, scale: 1.04, duration: 0.35, ease: "power2.out" })
                   .to(card.style, { boxShadow: "0 20px 35px -12px rgba(0, 0, 0, 0.4)", background: "linear-gradient(135deg, #1A1A1A 0%, #222222 100%)", duration: 0.35 }, "-=0.35");
      card.addEventListener('mouseenter', () => hoverTimeline.play());
      card.addEventListener('mouseleave', () => hoverTimeline.reverse());
    });

    const parallaxBg = dubaiRef.current?.querySelector<HTMLElement>('.parallax-bg-dubai');
    if (dubaiRef.current && parallaxBg) {
      gsap.to(parallaxBg, {
        backgroundPosition: "50% 120%", // Enhanced parallax effect
        scale: 1.15, // Slight zoom on scroll
        ease: "none",
        scrollTrigger: { trigger: dubaiRef.current, start: "top bottom", end: "bottom top", scrub: 1.8 }
      });
      // Animate text in Dubai section
      const dubaiHeadline = dubaiRef.current?.querySelector('h2');
      const dubaiParagraph = dubaiRef.current?.querySelector('p');
      if(dubaiHeadline) {
        gsap.from(dubaiHeadline, { opacity: 0, y:40, scrollTrigger: { trigger: dubaiHeadline, start: "top 80%"}, duration: 0.9, ease: "power3.out"});
      }
      if(dubaiParagraph) {
        gsap.from(dubaiParagraph, { opacity: 0, y:40, scrollTrigger: { trigger: dubaiParagraph, start: "top 80%"}, duration: 0.9, ease: "power3.out", delay: 0.25});
      }
    }
  }, [isReducedMotion]);

  const handleCtaClick = () => {
    if (ourEdgeRef.current && lenis) {
      lenis.scrollTo(ourEdgeRef.current, { duration: 1.8, easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }); // Smoother ease
    }
  };

  return (
    <>
      <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-brandBackground text-brandText overflow-hidden">
        {/* Enhanced Background with Gradient Animation */}
        <div className="absolute inset-0 z-0 bg-hero-gradient bg-400% animate-gradientShift"></div>
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={<Html center><p className='text-brandTextSecondary/70 text-sm'>Loading Immersive Experience...</p></Html>}>
            <Canvas shadows camera={{ position: [0, 0.5, 5.5], fov: 55 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 5, 2]} intensity={1.0} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
              <pointLight position={[-5, -2, -5]} intensity={0.8} color="#FF007F" /> {/* brandSecondary color light */}
              {!isReducedMotion && <InteractiveParticles count={1800} color="#00FFFF" size={0.012} />}
              <TorusKnotScene />
            </Canvas>
          </Suspense>
        </div>
        <div className="relative z-10 p-4 md:p-8 animate-fadeIn">
          <h1 ref={headlineRef} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary mb-6 leading-tight">
            Elevate Digital Reality
          </h1>
          <p ref={subHeadlineRef} className="text-lg md:text-xl lg:text-2xl text-brandTextSecondary max-w-3xl mx-auto mb-10">
            3PWeb crafts immersive Web3 and AI-powered experiences that transcend the ordinary, forging the future of digital engagement from Dubai to the Globe.
          </p>
          <button
            ref={ctaRef}
            className="bg-brandPrimary text-brandBackground font-bold py-3 px-8 md:py-4 md:px-10 rounded-lg text-lg md:text-xl shadow-lg hover:bg-brandPrimaryDark transition-all duration-300 ease-in-out transform hover:scale-105 animate-pulseGlow"
            onClick={handleCtaClick}
          >
            Explore our Genesis
          </button>
        </div>
      </section>

      <section ref={ourEdgeRef} className="py-20 md:py-32 bg-brandBackgroundAlt text-brandText">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brandPrimary mb-5 animate-on-scroll">Our Edge</h2>
          <p className="text-lg md:text-xl text-brandTextSecondary mb-16 md:mb-20 max-w-3xl mx-auto animate-on-scroll">
            We blend cutting-edge technology with strategic insight to deliver unparalleled digital marketing solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {[{
              title: "AI-Driven WhatsApp Automation",
              description: "Revolutionize customer engagement with intelligent, automated WhatsApp solutions that feel personal and drive conversions.",
              icon: <PlaceholderIcon className="w-14 h-14 text-brandAccent" />
            }, {
              title: "Web3 Commerce & Payments",
              description: "Step into the future of commerce with seamless Web3 integrations, enabling secure crypto payments and innovative tokenized experiences.",
              icon: <PlaceholderIcon className="w-14 h-14 text-brandAccent" />
            }, {
              title: "Global Growth Campaigns",
              description: "Expand your reach and impact with data-driven global marketing campaigns, tailored to connect with diverse audiences worldwide.",
              icon: <PlaceholderIcon className="w-14 h-14 text-brandAccent" />
            }].map((card, index) => (
              <div key={index} className="edge-card bg-brandCard p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-brandBorder/50 hover:border-brandPrimary transition-all duration-300 ease-in-out animate-on-scroll">
                <div className="mb-7 p-4 bg-brandPrimary/15 rounded-full">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold text-brandPrimary mb-4 font-display">{card.title}</h3>
                <p className="text-brandTextSecondary leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={dubaiRef} className="relative py-24 md:py-40 bg-brandBackground text-brandText overflow-hidden">
        {/* Using Next/Image for parallax background for optimization */}
        <div className="parallax-bg-dubai absolute inset-0 z-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/assets/dubai_skyline_placeholder.jpg')" }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-brandBackground via-transparent to-brandBackground opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brandPrimary mb-6 animate-on-scroll">From Dubai to the Globe</h2>
          <p className="text-lg md:text-xl text-brandTextSecondary max-w-2xl mx-auto animate-on-scroll">
            Our strategic location in Dubai, a global hub of innovation, empowers us to deliver cutting-edge digital solutions to clients worldwide. We are at the forefront of the Web3 and AI revolution, helping businesses like yours navigate the future of digital engagement.
          </p>
        </div>
      </section>
    </>
  );
};

export default HomePage;

