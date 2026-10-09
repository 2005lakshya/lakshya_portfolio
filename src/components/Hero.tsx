import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Hero.module.css";
import DraggableSticker from "./hero/DraggableSticker";
import { NEW_STICKER_SVG } from "./hero/stickerArt";

const STICKERS = [
  { file: "404error.png", label: "Error 404 sticker" },
  { file: "code.png", label: "Code sticker" },
  { file: "codeon.png", label: "Code on sticker" },
  { file: "eatsleep.png", label: "Eat, sleep, code, repeat sticker" },
  { file: "fullstack.png", label: "Full-stack developer sticker" },
  { file: "justcodeit.png", label: "Just code it sticker" },
  { file: "ihate.png", label: "I hate programming sticker" },
  { file: "coffee.png", label: "Coffee and coding sticker" },
];

/** How far each sticker rises as the hero scrolls away; uneven, so they peel off at their own speeds. */
const DRIFT = [-220, -120, -300, -80, -180, -260, -140, -60, -240];

/** The drawn stickers, placed on the graph paper as fractions of a 1250 x 648 sheet. */
const EXTRA_STICKERS = [
  { id: "git", label: "git push --force sticker", x: 230, y: 128, w: 200, r: -6, z: 21 },
  { id: "hello", label: "Hello, World! sticker", x: 648, y: 40, w: 180, r: 6, z: 21 },
  { id: "ctrlz", label: "Ctrl + Z sticker", x: 38, y: 352, w: 190, r: -4, z: 21 },
  { id: "bug", label: "Not a bug, it's a feature sticker", x: 890, y: 468, w: 170, r: -6, z: 23 },
  { id: "vit", label: "VIT Vellore pennant sticker", x: 250, y: 14, w: 190, r: -8, z: 22 },
  { id: "works", label: "It works on my machine sticker", x: 10, y: 112, w: 124, r: -8, z: 22 },
];

type WeatherState = {
  temperature: number;
};

const Hero = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<WeatherState>({
    temperature: 63,
  });

  const [stickerStyles, setStickerStyles] = useState<
    Record<string, { left: number; top: number; rotation: number; z: number }>
  >({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const names = [
      "404error.png",
      "code.png",
      "codeon.png",
      "eatsleep.png",
      "fullstack.png",
      "justcodeit.png",
      "ihate.png",
      "coffee.png",
    ];

    const generate = () => {
      const w = window.innerWidth;
      const isMobile = w <= 768;
      const isTablet = w > 768 && w <= 1024;
      const isSmallLaptop = w >= 1025 && w <= 1399;
      const isLargeLaptop = w >= 1400 && w <= 1999;
      const isXLScreen = w >= 2000;

      if (isMobile) {
        // Deterministic positions for mobile view (percentage-based inside stickersContainer)
        const fixedMobile: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 6, top: 3, rotation: -6, z: 18 },
          "code.png": { left: 23, top: 12, rotation: 6, z: 20 },
          "codeon.png": { left: 50, top: 18, rotation: -8, z: 16 },
          "eatsleep.png": { left: 8, top: 45, rotation: 4, z: 17 },
          "fullstack.png": { left: 30, top: 32, rotation: 10, z: 19 },
          "justcodeit.png": { left: 65, top: 35, rotation: -4, z: 15 },
          "ihate.png": { left: 4, top: 20, rotation: 8, z: 14 },
          "coffee.png": { left: 70, top: 48, rotation: -12, z: 13 },
        };

        setStickerStyles(fixedMobile);
        return;
      }

      if (isTablet) {
        // Deterministic positions for tablet view
        const fixedTablet: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 8, top: 5, rotation: -6, z: 18 },
          "code.png": { left: 10, top: 25, rotation: 10, z: 20 },
          "codeon.png": { left: 75, top: 40, rotation: -12, z: 16 },
          "eatsleep.png": { left: 5, top: 70, rotation: 4, z: 17 },
          "fullstack.png": { left: 40, top: 30, rotation: 8, z: 19 },
          "justcodeit.png": { left: 70, top: 60, rotation: -6, z: 15 },
          "ihate.png": { left: 55, top: 12, rotation: 10, z: 14 },
          "coffee.png": { left: 10, top: 45, rotation: -10, z: 13 },
        };

        setStickerStyles(fixedTablet);
        return;
      }

      if (isSmallLaptop) {
        // Deterministic positions for small laptop view (1025-1399px)
        const fixedSmallLaptop: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 12, top: 42, rotation: 12, z: 18 },
          "code.png": { left: 5, top: 6, rotation: 14, z: 20 },
          "codeon.png": { left: 5, top: 75, rotation: -18, z: 16 },
          "eatsleep.png": { left: 68, top: 20, rotation: 0, z: 17 },
          "fullstack.png": { left: 50, top: 45, rotation: 8, z: 19 },
          "justcodeit.png": { left: 60, top: 60, rotation: -8, z: 15 },
          "ihate.png": { left: 40, top: 4, rotation: 8, z: 19 },
          "coffee.png": { left: 80, top: 50, rotation: -8, z: 15 },
        };

        setStickerStyles(fixedSmallLaptop);
        return;
      }

      if (isLargeLaptop) {
        // Deterministic positions for large laptop view (1400-1999px)
        const fixedLargeLaptop: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 10, top: 35, rotation: 12, z: 18 },
          "code.png": { left: 3, top: 8, rotation: 14, z: 20 },
          "codeon.png": { left: 4, top: 72, rotation: -18, z: 16 },
          "eatsleep.png": { left: 70, top: 18, rotation: 0, z: 17 },
          "fullstack.png": { left: 48, top: 42, rotation: 8, z: 19 },
          "justcodeit.png": { left: 58, top: 58, rotation: -8, z: 15 },
          "ihate.png": { left: 38, top: 5, rotation: 8, z: 19 },
          "coffee.png": { left: 78, top: 48, rotation: -8, z: 15 },
        };

        setStickerStyles(fixedLargeLaptop);
        return;
      }

      if (isXLScreen) {
        // Deterministic positions for XL screen view (2000px+)
        const fixedXLScreen: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 8, top: 32, rotation: 12, z: 18 },
          "code.png": { left: 2, top: 10, rotation: 14, z: 20 },
          "codeon.png": { left: 3, top: 70, rotation: -18, z: 16 },
          "eatsleep.png": { left: 72, top: 16, rotation: 0, z: 17 },
          "fullstack.png": { left: 46, top: 40, rotation: 8, z: 19 },
          "justcodeit.png": { left: 56, top: 56, rotation: -8, z: 15 },
          "ihate.png": { left: 36, top: 6, rotation: 8, z: 19 },
          "coffee.png": { left: 76, top: 46, rotation: -8, z: 15 },
        };

        setStickerStyles(fixedXLScreen);
        return;
      }

      // Default: shouldn't reach here but just in case
      setStickerStyles({});
    };

    generate();
    let t: any;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(generate, 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }).format(now)
      );

      setDate(
        new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        }).format(now)
      );
    };

    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const loadWeather = async () => {
      if (!apiKey) {
        setWeather({ temperature: 63 });
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Gurgaon,IN&appid=${apiKey}&units=metric`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const data = await response.json();
        const temperature = Math.round(Number(data?.main?.temp ?? 0));

        setWeather({ temperature });
      } catch {
        setWeather({ temperature: 63 });
      }
    };

    loadWeather();
    const id = window.setInterval(loadWeather, 15 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(id);
    };
  }, []);
  return (
    <section id="hero-section" className={styles.createProfile}>
      <div className={styles.weatherBlock}>
        <div className={styles.weatherTopRow}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Gurgaon%2C%20Haryana"
            target="_blank"
            rel="noreferrer"
            className={styles.weatherLink}
            aria-label="Open weather page"
          >
            <ArrowUpRight className={styles.weatherIcon} aria-hidden />
          </a>
          <span className={styles.weatherTemp}>{weather.temperature}°C</span>
        </div>

        <div className={styles.weatherMetaRow}>
          <span>{date || "May 5, 2026"}</span>
          <span>{time || "Loading"}</span>
        </div>
      </div>

      <div className={styles.heroBottomSectionWithGrid} data-hero-paper>
        <div className={styles.stickersContainer}>
          {/* Every sticker can be picked up, moved and thrown off the paper. */}
          {STICKERS.map(({ file, label }, i) => {
            const s = stickerStyles[file];
            return (
              <DraggableSticker
                key={file}
                label={label}
                dealAt={0.35 + i * 0.08}
                drift={DRIFT[i % DRIFT.length]}
                rotation={s ? s.rotation : 0}
                className={s ? styles.stickerAbsolute : undefined}
                style={s ? { left: `${s.left}%`, top: `${s.top}%`, zIndex: s.z } : undefined}
              >
                <img src={`/stickers/${file}`} alt="" className={styles.sticker} draggable={false} />
              </DraggableSticker>
            );
          })}
          {EXTRA_STICKERS.map((k, j) => (
            <DraggableSticker
              key={k.id}
              label={k.label}
              dealAt={1 + j * 0.07}
              drift={DRIFT[(j + 3) % DRIFT.length]}
              rotation={k.r}
              className={`${styles.stickerAbsolute} hs-extra`}
              style={{ left: `${(k.x / 1250) * 100}%`, top: `${(k.y / 648) * 100}%`, width: `${(k.w / 1250) * 100}%`, zIndex: k.z }}
            >
              <div dangerouslySetInnerHTML={{ __html: NEW_STICKER_SVG[k.id] }} />
            </DraggableSticker>
          ))}
        </div>
        <img src="/Lakshya.png" alt="Lakshya" className={styles.lakshyaIcon} />
      </div>

      <div className={styles.lakshya}>LAKSHYA</div>
      <div className={styles.quoteContainer}>
        <div className={styles.quote}>
          <span className={styles.quoteLineWhite}>Code and</span>
          <span className={styles.quoteLineWhite}>Grind,</span>
          <span className={styles.quoteLineOff}>Lead</span>
          <span className={styles.quoteLineOff}>the Mind</span>
        </div>
      </div>
      <div className={styles.wrapperFixedInProdYellow}>
        <div className={styles.fixedInProdYellowCaution} aria-hidden />
      </div>
    </section>
  );
};

export default Hero;
