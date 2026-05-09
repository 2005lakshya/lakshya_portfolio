import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceData } from '../data/portfolio';
import styles from './Experience.module.css';

const Experience = () => {
    const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const { scrollYProgress: sectionScrollProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"],
    });

    useMotionValueEvent(sectionScrollProgress, "change", (latest) => {
        setScrollProgress(latest);
    });

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        const updateScrollDir = () => {
            const scrollY = window.pageYOffset;
            setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener('scroll', updateScrollDir);
        return () => window.removeEventListener('scroll', updateScrollDir);
    }, []);

    // Variants for consistent animations - refined for smoother center-oriented motion
    const leftSlideVariants = {
        hidden: { opacity: 0, x: -80, y: 100 },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: { duration: 1.2 }
        }
    };

    const rightSlideVariants = {
        hidden: { opacity: 0, x: 80, y: 100 },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: { duration: 1.2 }
        }
    };

    const nestedVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8 }
        }
    };

    // Calculate scroll-based animation values for left items (come from bottom-left)
    const getLeftItemAnimation = (itemIndex: number) => {
        const itemOffset = itemIndex * 0.25;
        const progress = Math.max(0, Math.min(1, (scrollProgress - itemOffset) / 0.25));
        const isScrollingDown = scrollDir === 'down';
        
        if (!isScrollingDown) {
            return { x: 0, y: 0, opacity: 1 };
        }
        
        const x = -80 * (1 - progress);
        const y = 100 * (1 - progress);
        const opacity = progress;
        
        return { x, y, opacity };
    };

    // Calculate scroll-based animation values for right items (come from bottom-right)
    const getRightItemAnimation = (itemIndex: number) => {
        const itemOffset = itemIndex * 0.25;
        const progress = Math.max(0, Math.min(1, (scrollProgress - itemOffset) / 0.25));
        const isScrollingDown = scrollDir === 'down';
        
        if (!isScrollingDown) {
            return { x: 0, y: 0, opacity: 1 };
        }
        
        const x = 80 * (1 - progress);
        const y = 100 * (1 - progress);
        const opacity = progress;
        
        return { x, y, opacity };
    };

    // Extract data from portfolio.ts with more robust case-insensitive search
    const nttData = experienceData.find(e => e.title.toUpperCase().includes("NTT")) || experienceData[0];
    const ieeeData = experienceData.find(e => e.title.toUpperCase().includes("IEEE")) || experienceData[1];
    const havellsData = experienceData.find(e => e.title.toUpperCase().includes("HAVELLS")) || experienceData[2];

    // If scrolling up, we bypass the hidden state to keep items at their position
    const isScrollingUp = scrollDir === 'up';

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // animate title on load
        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        const container = itemsContainerRef.current || sectionRef.current;
        const createdTriggers: any[] = [];
        if (container) {
            const cards = container.querySelectorAll('.exp-card');
            cards.forEach((card: Element, index: number) => {
                const isEven = index % 2 === 0;

                const anim = gsap.fromTo(
                    card,
                    { opacity: 0, x: isEven ? -100 : 100, y: 50 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
                if (anim && anim.scrollTrigger) createdTriggers.push(anim.scrollTrigger);

                const contentEls = card.querySelectorAll('.content-element');
                const animContent = gsap.fromTo(
                    contentEls,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        delay: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
                if (animContent && animContent.scrollTrigger)
                    createdTriggers.push(animContent.scrollTrigger);
            });
        }

        return () => {
            createdTriggers.forEach((t) => t && t.kill && t.kill());
        };
    }, []);

    return (
        <div id="experience" className={styles.experience} ref={(el) => { sectionRef.current = el; itemsContainerRef.current = el; }}>
            <motion.div 
                ref={titleRef}
                className={`exp-title ${styles.experience2}`}
                initial={isScrollingUp ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
            >
                EXPERIENCE
            </motion.div>

            {/* Entry 1 (NTT DATA) */}
            <div className={`exp-card ${styles.experienceItem2}`}>
                <div className={styles.container5}>
                    <div className={styles.container6}>
                        <b className={styles.text}>.01</b>
                    </div>
                    <img
                        src="/nttdata.png"
                        alt="NTT DATA"
                        className={`content-element ${styles.companyLogo}`}
                    />
                </div>
                <div className={styles.verticalborder2}>
                    <div className={styles.container4}>
                        <div className={`content-element ${styles.may2025}`}>{nttData.date}</div>
                    </div>
                    <div className={styles.heading4}>
                        <b className={`content-element ${styles.summerIntern}`}>{nttData.role}</b>
                    </div>
                    <div className={styles.backgroundborder2} />
                </div>
            </div>

            {/* Entry 2 (IEEE-TEMS) */}
            <div 
                className={`exp-card ${styles.experienceItem23}`}>
                <div className={styles.verticalborder5}>
                    <div className={styles.container22}>
                        <div className={`content-element ${styles.january2026}`}>{ieeeData.date}</div>
                    </div>
                    <div className={styles.heading45}>
                        <b className={`content-element ${styles.secretary}`}>{ieeeData.role}</b>
                    </div>
                    <div className={styles.overlayborder5}>
                        <div 
                            className={`content-element ${styles.spearheadedTheDevelopment}`} 
                            dangerouslySetInnerHTML={{ __html: ieeeData.description }} 
                        />
                    </div>
                    <div className={styles.backgroundborder9} />
                </div>
                <div className={styles.container23}>
                    <div className={styles.container24}>
                        <b className={styles.text}>.02</b>
                    </div>
                    <img
                        src="/ieeetems.png"
                        alt="IEEE-TEMS"
                        className={`content-element ${styles.companyLogo}`}
                    />
                </div>
            </div>

            {/* Entry 3 (Havells) */}
            <div className={`exp-card ${styles.experienceItem1}`}>
                <div className={styles.container}>
                    <img
                        src="/havells.png"
                        alt="Havells India Limited"
                        className={`content-element ${styles.companyLogo}`}
                    />
                </div>
                <div className={styles.verticalborder}>
                    <div className={styles.container4}>
                        <div className={`content-element ${styles.may2025}`}>{havellsData.date}</div>
                    </div>
                    <div className={styles.heading4}>
                        <b className={`content-element ${styles.summerIntern}`}>{havellsData.role}</b>
                    </div>
                    <div className={styles.overlayborder}>
                        <div className={`content-element ${styles.developedAStudent}`}>{havellsData.description}</div>
                    </div>
                    <div className={styles.backgroundborder2} />
                </div>
            </div>
        </div>
    );
};

export default Experience;
