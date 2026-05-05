import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Hero.module.css";

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
      const isLaptop = w >= 1025 && w <= 1440;
      const isMobile = w <= 768;

      if (isLaptop) {
        // Deterministic positions for laptop view (percentage-based)
        const fixedLaptop: Record<string, { left: number; top: number; rotation: number; z: number }> = {
          "404error.png": { left: 12, top: 42, rotation: 12, z: 18 },
          "code.png": { left: 5, top: 6, rotation: 14, z: 20 },
          "codeon.png": { left: 5, top: 75, rotation: -18, z: 16 },
          "eatsleep.png": { left: 68, top: 20, rotation: 0, z: 17 },
          "fullstack.png": { left: 50, top: 45, rotation: 8, z: 19 },
          "justcodeit.png": { left: 60, top: 60, rotation: -8, z: 15 },
          "ihate.png": { left: 40, top: 4, rotation: 8, z: 19 },
          "coffee.png": { left: 80, top: 50, rotation: -8, z: 15 },
        };

        setStickerStyles(fixedLaptop);
        return;
      }

      const isTablet = w > 768 && w <= 1024;
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

      // Default: don't absolutely position stickers for mid sizes
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
    const apiKey = "e90e94bed1d6e98959602bbbddbab40a";

    const loadWeather = async () => {
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

      <div className={styles.heroBottomSectionWithGrid}>
        <div className={styles.stickersContainer}>
          {/* Render stickers; on laptop breakpoint we apply absolute randomized placement/rotation */}
          {(() => {
            const list = [
              "404error.png",
              "code.png",
              "codeon.png",
              "eatsleep.png",
              "fullstack.png",
              "justcodeit.png",
              "ihate.png",
              "coffee.png",
            ];

            return list.map((name) => {
              const s = stickerStyles[name];
              const style = s
                ? {
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  transform: `rotate(${s.rotation}deg)`,
                  zIndex: s.z,
                }
                : undefined;

              const className = s
                ? `${styles.sticker} ${styles.stickerAbsolute}`
                : styles.sticker;

              return (
                <img
                  key={name}
                  src={`/stickers/${name}`}
                  alt={name.replace(/\.png$/, "")}
                  className={className}
                  style={style}
                />
              );
            });
          })()}
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
