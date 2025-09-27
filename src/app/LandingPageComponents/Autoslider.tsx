"use client";
import { useEffect, useState } from "react";

type Slide = { src: string; alt?: string };

export default function AutoSlider({
  slides,
  interval = 4000, // ms
  className = "",
}: {
  slides: Slide[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // autoplay
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval, paused]);

  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* viewport */}
      <div className="overflow-hidden rounded-xl">
        {/* track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div key={idx} className="w-full shrink-0">
              <img src={s.src} alt={s.alt ?? `slide ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      {slides.length > 1 && (
        <div className="absolute -bottom-4 left-0 right-0 flex items-center justify-center gap-2">
          {slides.map((_, d) => (
            <button
              key={d}
              onClick={() => go(d)}
              aria-label={`Go to slide ${d + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                d === i ? "bg-gray-900" : "bg-gray-400 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
