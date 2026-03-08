"use client";

import { AnimateOnScroll } from "./AnimateOnScroll";

export function VideoBlockSection() {
  return (
    <section className="relative w-full bg-white/30 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <AnimateOnScroll>
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-black shadow-lg">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/S3RvN5GlsIw"
              title="Vega Financial video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
