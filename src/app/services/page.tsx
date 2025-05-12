"use client";

import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, TorusKnot, Html, PointMaterial, Points } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, SplitText);

const InteractiveParticles = ({ count = 1000, color = "#1F2937", size = 0.02 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * (viewport.width + 5);
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

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00015;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.3 + Math.abs(mousePosition.x * 0.2), 0.06);
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mousePosition.x * 0.08, 0.02);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mousePosition.y * 0.08, 0.02);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
};

interface ServiceShowcaseProps {
  title: string;
  description: string;
  benefits: string[];
  imageSrc: string;
  imageAlt: string;
  learnMoreLink?: string;
  index: number;
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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const featuredKnotRef = useRef<THREE.Mesh>(null!);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame(({ clock, mouse }) => {
    if (isFeatured && featuredKnotRef.current && !isReducedMotion) {
      const elapsedTime = clock.getElapsedTime();
      featuredKnotRef.current.rotation.x = THREE.MathUtils.lerp(featuredKnotRef.current.rotation.x, mouse.y * Math.PI * 0.15, 0.04) + elapsedTime * 0.06;
      featuredKnotRef.current.rotation.y = THREE.MathUtils.lerp(featuredKnotRef.current.rotation.y, mouse.x * Math.PI * 0.15, 0.04) + elapsedTime * 0.09;

      const pulseFactor = Math.sin(elapsedTime * 1.2) * 0.03 + 1; // Pulse between 0.97 and 1.03
      featuredKnotRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);

      const material = featuredKnotRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = Math.sin(elapsedTime * 0.8) * 0.4 + 1.0; // Pulse emissive intensity between 0.6 and 1.4
      }
    }
  });

  useEffect(() => {
    if (sectionRef.current && !isReducedMotion) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      });

      const imageElement = sectionRef.current.querySelector(".service-image-container");
      const textElements = sectionRef.current.querySelectorAll(".service-text-content > *:not(.learn-more-button)");
      const buttonElement = sectionRef.current.querySelector(".learn-more-button");

      tl.fromTo(sectionRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(imageElement, 
          { opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 1.05 },
          { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "power4.out" }, 
          "-=0.5"
        )
        .fromTo(textElements, 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" },
          "-=0.7"
        );
      if (buttonElement) {
        tl.fromTo(buttonElement, 
            { opacity:0, scale: 0.8 }, 
            { opacity:1, scale:1, duration:0.7, ease: "back.out(1.4)"}, 
            "-=0.4"
        );
        const btnHover = gsap.timeline({ paused: true });
        btnHover.to(buttonElement, { scale: 1.08, duration: 0.2, ease: "power1.inOut" })
                .to(buttonElement, { boxShadow: "0 0 20px 3px rgba(var(--color-primary-rgb), 0.4)", duration: 0.2 }, "-=0.2");
        buttonElement.addEventListener('mouseenter', () => btnHover.play());
        buttonElement.addEventListener('mouseleave', () => btnHover.reverse());
      }
        
      if (isFeatured && imageContainerRef.current) {
        const featured3DCanvas = imageContainerRef.current.querySelector(".featured-3d-canvas-container");
        if (featured3DCanvas) {
            gsap.fromTo(featured3DCanvas, 
                { opacity: 0, scale: 0.6, rotationY: -60 },
                { opacity: 1, scale: 1, rotationY: 0, duration: 1.2, ease: "elastic.out(1, 0.6)", delay: 0.3,
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 65%",
                    toggleActions: "play none none reverse",
                  }
                }
            );
        }
      }
      if(imageContainerRef.current){
        const imgElement = imageContainerRef.current.querySelector('img');
        if (imgElement) {
            const imgHover = gsap.timeline({paused: true});
            imgHover.to(imgElement, {scale: 1.08, duration: 0.4, ease: "power2.out"});
            imageContainerRef.current.addEventListener('mouseenter', () => imgHover.play());
            imageContainerRef.current.addEventListener('mouseleave', () => imgHover.reverse());
        }
      }
    }
  }, [index, isFeatured, isReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      className={`service-showcase-item min-h-[90vh] md:min-h-screen py-20 md:py-32 px-6 flex items-center ${index % 2 === 0 ? 'bg-brandBackgroundAlt' : 'bg-brandBackground'} text-brandText overflow-hidden relative`}>
      <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${index % 2 === 0 ? '' : 'md:grid-flow-row-dense'}`}>
        <div ref={imageContainerRef} className={`service-image-container relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-xl overflow-hidden shadow-xl group ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
          <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" quality={80} className="transition-transform duration-700 ease-out" />
           {isFeatured && !isReducedMotion && (
            <div className="featured-3d-canvas-container absolute inset-0 flex items-center justify-center opacity-0">
              <Canvas style={{ width: '70%', height: '70%' }} camera={{ position: [0, 0, 4.5], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 5, 5]} intensity={1} />
                <pointLight position={[-3, -3, -3]} intensity={0.6} color="#FF007F" />
                <Suspense fallback={<Html center><p className='text-brandTextSecondary/70 text-xs'>Carregando 3D...</p></Html>}>
                  <TorusKnot ref={featuredKnotRef} args={[0.9, 0.25, 160, 20]} /* Scale is handled by useFrame */ >
                    <meshStandardMaterial color="#7F00FF" emissive="#5E00B3" roughness={0.1} metalness={0.8} />
                  </TorusKnot>
                </Suspense>
              </Canvas>
            </div>
          )}
        </div>
        <div className={`service-text-content prose prose-lg max-w-none ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} text-brandText`}>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary leading-tight font-display">{title}</h2>
          <p className="text-brandTextSecondary mb-6 text-lg md:text-xl leading-relaxed">{description}</p>
          <ul className="list-none space-y-3 mb-8">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start text-brandTextSecondary/90">
                <svg className="w-6 h-6 mr-3 mt-1 text-brandPrimary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                {benefit}
              </li>
            ))}
          </ul>
          <Link href={learnMoreLink} legacyBehavior>
            <a className="learn-more-button inline-block bg-brandPrimary text-brandBackground font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-brandPrimaryDark transition-all duration-300 transform hover:scale-105 text-lg">
              Descubra Mais
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Component for the animated TorusKnot in the final CTA section
const FinalCtaKnot = () => {
  const knotRef = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    if (knotRef.current) {
      knotRef.current.rotation.set(0.3, 0.6, 0); // Initial rotation
    }
  }, []);

  useFrame(() => {
    if (knotRef.current) {
      knotRef.current.rotation.x += 0.0003;
      knotRef.current.rotation.y += 0.0004;
    }
  });
  return (
    <TorusKnot ref={knotRef} args={[12, 1.2, 300, 36]} scale={0.25}>
        <meshStandardMaterial color="#FFFFFF" emissive="#E0E0E0" roughness={0.6} metalness={0.15} wireframe opacity={0.25} transparent />
    </TorusKnot>
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
    if (!pageRef.current || isReducedMotion) return;

    const heroTitle = pageRef.current.querySelector(".hero-title");
    const heroSubtitle = pageRef.current.querySelector(".hero-subtitle");
    const heroCta = pageRef.current.querySelector(".hero-cta-button");

    if (heroTitle) {
      const splitHeadline = new SplitText(heroTitle, { type: "words,chars" });
      gsap.from(splitHeadline.chars, {
        duration: 0.9, opacity: 0, y: 40, ease: "power4.out", stagger: 0.035, delay: 0.2
      });
    }
    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        duration: 1.1, opacity: 0, y: 30, ease: "power4.out", delay: 0.6
      });
    }
    if (heroCta) {
      gsap.from(heroCta, {
        duration: 1.1, opacity: 0, scale: 0.7, ease: "elastic.out(1, 0.7)", delay: 0.9
      });
      const ctaHover = gsap.timeline({ paused: true });
      ctaHover.to(heroCta, { scale: 1.08, duration: 0.25, ease: "power2.out" })
              .to(heroCta, { boxShadow: "0 0 25px 5px rgba(var(--color-primary-rgb), 0.5)", duration: 0.25 }, "-=0.25");
      heroCta.addEventListener('mouseenter', () => ctaHover.play());
      heroCta.addEventListener('mouseleave', () => ctaHover.reverse());
    }
    
    const finalCtaSection = pageRef.current.querySelector(".final-cta-section");
    if (finalCtaSection) {
        gsap.fromTo(finalCtaSection.querySelectorAll("h2, p, a"),
            { opacity:0, y:60 },
            { opacity:1, y:0, stagger:0.18, duration:1.1, ease: "power3.out",
                scrollTrigger: {
                    trigger: finalCtaSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        const finalCtaButton = finalCtaSection.querySelector('a');
        if(finalCtaButton){
            const finalBtnHover = gsap.timeline({ paused: true });
            finalBtnHover.to(finalCtaButton, { scale: 1.08, duration: 0.25, ease: "power2.out" })
                         .to(finalCtaButton, { boxShadow: "0 0 25px 5px rgba(var(--color-primary-rgb),0.3)", duration: 0.25 }, "-=0.25");
            finalCtaButton.addEventListener('mouseenter', () => finalBtnHover.play());
            finalCtaButton.addEventListener('mouseleave', () => finalBtnHover.reverse());
        }
    }

  }, [isReducedMotion]);

  const servicesData: Omit<ServiceShowcaseProps, 'index'>[] = [
    {
      title: "Gestão de Tráfego Pago (Meta Ads + Google Ads)",
      description: "Amplifique seu alcance e ROI com campanhas de anúncios meticulosamente elaboradas no Meta e Google. Nossas estratégias centradas em dados identificam seu público ideal, potencializam conversões e impulsionam a expansão sustentável do seu negócio.",
      benefits: [
        "Hipersegmentação precisa de audiência",
        "Testes A/B incansáveis e otimização iterativa",
        "Relatórios transparentes e insights de performance acionáveis",
        "Crescimento exponencial em leads qualificados e vendas"
      ],
      imageSrc: "/assets/services/paid_traffic.jpg",
      imageAlt: "Gráfico dinâmico mostrando performance de anúncios",
      isFeatured: true,
      learnMoreLink: "/services/paid-traffic"
    },
    {
      title: "Criação de Landing Pages de Alta Conversão",
      description: "Transforme visitantes casuais em clientes engajados com landing pages personalizadas, projetadas para máxima performance. Unimos narrativa persuasiva, experiência de usuário intuitiva e design visual impactante para catapultar suas taxas de conversão.",
      benefits: [
        "Designs sob medida que refletem sua identidade de marca única",
        "Arquitetura mobile-first, perfeitamente responsiva",
        "Tempos de carregamento ultrarrápidos e experiência de usuário superior",
        "CTAs irresistíveis e mecanismos de captura de leads otimizados"
      ],
      imageSrc: "/assets/services/landing_pages.jpg", 
      imageAlt: "Exemplo de design de landing page impactante",
      learnMoreLink: "/services/landing-pages"
    },
    {
      title: "Automação de WhatsApp e Funis de Venda Inteligentes",
      description: "Desbloqueie o potencial do WhatsApp para jornadas de cliente hiperpersonalizadas e maestria em vendas automatizadas. Construímos chatbots inteligentes e funis sofisticados que nutrem prospects e convertem leads, 24/7.",
      benefits: [
        "Lead scoring automatizado e sequências de follow-up dinâmicas",
        "Suporte ao cliente elevado e engajamento proativo",
        "Integração fluida com CRM e stack de marketing",
        "Aumento drástico na velocidade de vendas e escalabilidade operacional"
      ],
      imageSrc: "/assets/services/whatsapp_automation.jpg",
      imageAlt: "Ilustração de fluxo de automação no WhatsApp",
      learnMoreLink: "/services/whatsapp-automation"
    },
    {
      title: "Consultoria SEO e Estratégia de Conteúdo de Autoridade",
      description: "Conquiste o topo dos motores de busca e atraia uma avalanche de tráfego orgânico com nossa consultoria SEO de elite e ecossistemas de conteúdo escaláveis. Arquitetamos uma fundação resiliente para crescimento duradouro e domínio digital.",
      benefits: [
        "Inteligência de palavras-chave forense e análise competitiva",
        "Auditorias técnicas de SEO abrangentes e remediação",
        "Conteúdo premium e ressonante que cativa e converte",
        "Aquisição estratégica de links e PR digital para autoridade"
      ],
      imageSrc: "/assets/services/seo_content.jpg",
      imageAlt: "Gráfico mostrando crescimento SEO",
      learnMoreLink: "/services/seo-consulting"
    },
    {
      title: "Identidade Visual e Branding Digital Imersivo",
      description: "Crie uma identidade de marca inesquecível que cative seu público-alvo e comande presença de mercado. Esculpimos sistemas visuais holísticos, de logotipos icônicos a guias de marca abrangentes, garantindo consistência inabalável e reconhecimento poderoso em todas as fronteiras digitais.",
      benefits: [
        "Narrativas de marca únicas e atraentes que ressoam profundamente",
        "Design de logotipo de classe mundial e criação de ativos visuais coesos",
        "Voz de marca e estratégia de mensagens consistentes e impactantes",
        "Cultivo de lealdade profunda à marca e distinção de mercado"
      ],
      imageSrc: "/assets/services/branding.jpg",
      imageAlt: "Mostruário de uma forte identidade de marca",
      learnMoreLink: "/services/digital-branding"
    },
    {
      title: "Imersão Estratégica para Domínio do Mercado Local",
      description: "Capacite sua empresa local com planos de marketing digital sob medida, projetados para a supremacia no bairro. Implementamos SEO local focado, publicidade geolocalizada e engajamento comunitário autêntico para impulsionar o tráfego físico e ampliar as vendas locais.",
      benefits: [
        "Perfis do Google Business e listagens locais otimizados",
        "Campanhas de publicidade paga localizadas e hiper eficientes",
        "Gerenciamento proativo de reputação e cultivo de avaliações de clientes",
        "Conteúdo hiperlocal autêntico e construção robusta de comunidade"
      ],
      imageSrc: "/assets/services/local_business.jpg",
      imageAlt: "Mapa destacando alcance de negócios locais",
      learnMoreLink: "/services/local-strategy"
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-brandBackground text-brandText font-sans selection:bg-brandPrimary selection:text-brandBackground overflow-x-hidden">
      <section className="min-h-[70vh] md:min-h-screen py-20 md:py-32 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-brandPrimary/10 via-brandAccent/5 to-brandSecondary/10 bg-300% animate-gradientShift relative overflow-hidden">
        {!isReducedMotion && (
            <div className="absolute inset-0 z-0 opacity-60">
                <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[0, 5, 5]} intensity={0.9} color="#00E5FF" />
                    <Suspense fallback={<Html center><p className='text-brandTextSecondary/70 text-xs'>Carregando...</p></Html>}>
                        <InteractiveParticles count={1200} color="#6B7280" size={0.015} />
                    </Suspense>
                </Canvas>
            </div>
        )}
        <div className="relative z-10 max-w-4xl animate-fadeIn">
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary">
                Nosso Arsenal Digital
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-brandTextSecondary mb-10 leading-relaxed">
                Desencadeie um crescimento incomparável com o conjunto de serviços transformadores da 3PWeb. Fundimos visão estratégica, brilho criativo e maestria tecnológica para arquitetar seu triunfo digital.
            </p>
            <Link href="#services-showcase" legacyBehavior>
                <a className="hero-cta-button inline-block bg-brandPrimary text-brandBackground font-bold text-lg py-4 px-12 rounded-lg shadow-xl hover:bg-brandPrimaryDark transition-all duration-300 transform hover:scale-105">
                    Explore Nossas Soluções
                </a>
            </Link>
        </div>
      </section>

      <div id="services-showcase">
        {servicesData.map((service, index) => (
          <ServiceShowcaseSection key={service.title} {...service} index={index} />
        ))}
      </div>
      
      <section className="final-cta-section py-24 md:py-36 px-6 text-center bg-brandText text-brandBackground relative overflow-hidden">
         {!isReducedMotion && (
            <div className="absolute inset-0 z-0 opacity-10">
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[8,8,3]} intensity={0.5} />
                    <Suspense fallback={<Html center><p className='text-brandBackground/70 text-xs'>Carregando...</p></Html>}>
                        <FinalCtaKnot />
                    </Suspense>
                </Canvas>
            </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary via-brandAccent to-brandSecondary">
                Pronto para Impulsionar o Marketing da Sua Empresa?
            </h2>
            <p className="text-xl md:text-2xl text-brandBackground/90 mb-10 leading-relaxed">
                Conecte-se com um estrategista da 3PWeb hoje. Vamos co-criar o extraordinário futuro digital da sua marca.
            </p>
            <Link href="https://wa.me/5511992914799?text=Ol%C3%A1%203PWeb%2C%20gostaria%20de%20discutir%20minhas%20necessidades%20de%20marketing."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brandPrimary text-brandText font-bold text-lg py-4 px-12 rounded-lg shadow-xl hover:bg-brandPrimaryDark transition-all duration-300 transform hover:scale-105">
                Inicie Seu Projeto
            </Link>
        </div>
      </section>
      <style jsx global>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeInAnimation 1s ease-out forwards 0.3s;
        }
        @keyframes fadeInAnimation {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;

