"use client";

import { useState } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const YT_EMBED = "https://www.youtube-nocookie.com/embed/_Z8Au7fB_TU";
const YT_THUMB = "https://img.youtube.com/vi/_Z8Au7fB_TU/hqdefault.jpg";

export function VideoBlockSection() {
  const [loadMobileVideo, setLoadMobileVideo] = useState(false);

  return (
    <section className="relative w-full bg-white/30 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <AnimateOnScroll>
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-black shadow-lg">
            {/* Desktop: unchanged behaviour */}
            <div className="hidden md:block absolute inset-0">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={YT_EMBED}
                title="Vega Financial video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Mobile: click-to-load */}
            <div className="md:hidden absolute inset-0">
              {loadMobileVideo ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={YT_EMBED}
                  title="Vega Financial video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLoadMobileVideo(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center text-white"
                  style={{ backgroundImage: `url(${YT_THUMB})` }}
                  aria-label="Load and play video"
                >
                  <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
                    Tap to play
                  </span>
                </button>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
