import Image from "next/image";

const teamMembers = [
  { id: 1, name: "Acar", role: "Company Vision & Marketing", image: "/Group%208296.png" },
  { id: 2, name: "Tim", role: "Finance & Business Strategy", image: "/Group%208297.png" },
  { id: 3, name: "Aaron", role: "Compliance & Risk", image: "/Group%208298.png" },
  { id: 4, name: "Anastasia", role: "Full Stack Engineer", image: "/Group%208299.png" },
  { id: 5, name: "Constance", role: "Product & User Experience", image: "/Group%208300.png" },
];

const principles = [
  {
    id: "01",
    title: "Transparency",
    description:
      "We are dedicated to making sure you always know exactly what you're investing in. Every strategy on Vega is described in plain language, reviewed by our team, and locked once published. So what you see is always what you get.",
  },
  {
    id: "02",
    title: "Accessibility",
    description:
      "We are committed to breaking down the barriers that have kept sophisticated investing out of reach for most people. No minimum wealth, no accreditation requirements, no jargon. If you can use a banking app, you can use Vega.",
  },
  {
    id: "03",
    title: "Integrity",
    description:
      "We believe trust is the only real foundation a financial platform can be built on. We don't publish strategies we haven't reviewed, we don't make claims we can't back up, and we're always upfront about risk, even when it's not what you want to hear.",
  },
];

export function AboutUsSection() {
  return (
    <section className="relative w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-[184px] py-12 md:py-16 lg:py-20">
        {/* Our team */}
        <p className="font-dm-mono font-normal text-[#531cb3] text-base md:text-xl tracking-[2px] leading-tight">
          // OUR TEAM
        </p>
        <h2 className="font-maven-pro font-extrabold text-[#111] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-tight mt-4 max-w-[800px]">
          Who are we?
        </h2>

        <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full overflow-hidden bg-[#f0edff] shrink-0">
                <Image
                  src={member.image}
                  alt={`${member.name} profile`}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
              <h3 className="font-maven-pro font-bold text-[#531cb3] text-2xl md:text-3xl tracking-tight">
                {member.name}
              </h3>
              <p className="font-maven-pro font-medium text-[#333] text-base md:text-xl leading-snug">
                {member.role}
              </p>
            </article>
          ))}
        </div>

        {/* Our mission */}
        <div className="mt-16 md:mt-24">
          <p className="font-dm-mono font-normal text-[#531cb3] text-base md:text-xl tracking-[2px] leading-tight">
            // OUR MISSION
          </p>
          <p className="font-maven-pro font-semibold text-[#111] text-2xl sm:text-3xl md:text-[50px] tracking-[-2px] leading-[1.2] mt-4 max-w-[900px]">
            To make sophisticated investing{" "}
            <span className="text-[#793de1]">accessible to everyone</span> — not
            just the 0.7%.
          </p>
        </div>

        <div className="mt-8 md:mt-10 space-y-6 max-w-[900px]">
          <p className="font-maven-pro font-normal text-black text-base md:text-xl leading-relaxed">
            Algorithms are a faster, smarter, and more efficient way of investing.
            They have been the most powerful tool in finance for decades. Hedge
            funds have used algorithmic trading to generate returns that
            consistently outperform the market. But access has always been gated
            behind enormous wealth requirements, typically £200,000 or more.
          </p>
          <p className="font-maven-pro font-normal text-black text-base md:text-xl leading-relaxed">
            Vega changes that. We connect everyday investors directly with
            talented quant developers, turning sophisticated trading strategies
            into something you can invest in — transparently, safely, and from
            as little as £1.
          </p>
        </div>

        {/* What we stand for */}
        <div className="mt-16 md:mt-24">
          <p className="font-dm-mono font-normal text-[#531cb3] text-base md:text-xl tracking-[2px] leading-tight">
            // WHAT WE STAND FOR
          </p>
          <h2 className="font-maven-pro font-semibold text-[#111] text-2xl sm:text-3xl md:text-[50px] tracking-[-2px] leading-tight mt-4">
            Built on three core principles.
          </h2>
        </div>

        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {principles.map((principle) => (
            <article
              key={principle.id}
              className="rounded-[20px] border border-[#793de1] bg-[#f0edff80] p-6 md:p-8 flex flex-col"
            >
              <span className="font-dm-mono font-light text-[#531cb3] text-lg md:text-xl tracking-[2.21px] leading-tight">
                {principle.id}
              </span>
              <h3 className="font-maven-pro font-bold text-[#333] text-xl md:text-[22px] tracking-[-0.55px] leading-tight mt-4">
                {principle.title}
              </h3>
              <p className="font-dm-sans font-light text-[#333] text-sm md:text-[15px] leading-6 mt-4 flex-1">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
