import { AnimateOnScroll } from "./AnimateOnScroll";

export function VideoBlockSection() {
  return (
    <section className="relative w-full bg-white/30 py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <AnimateOnScroll>
          <div className="relative w-full aspect-[16/9] rounded-2xl bg-[#d9d9d9] flex items-center justify-center overflow-hidden shadow-lg">
            <div className="text-center">
              <p className="font-dm-sans text-[#888] text-lg md:text-2xl font-light">
                Video coming soon
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
