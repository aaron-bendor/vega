"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { DemoCTADropdown } from "./DemoCTADropdown";

export function HeroVideoSection() {
  const router = useRouter();

  const handleTryItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/vega-financial");
  };

  const colorflowSrc =
    "https://colorflow.ls.graphics/embed.html#N4IgbgpgTgzglgewHYgFwEYAMAaEBzKOAEzVCgQHcY0BWXAYwQBtrUAWXABwTiQBdWAbUGhiaEACs8PCgEcAnCFzkKaHCEZM1XBPD6IUqUAA80AWkwA6dACZ5ANlwBPc1YDMNTDYC+DZgihSEEDUdxsaOnw1a0x5AA5cACNogHYvXABDNHRfEAALDKQiJghWUAKikoAZCAAzPiDTUOc1XIriiAAlODw8hqMQJqt0EfQW0LbCjoBVTkbozC95cYtLGzS4ycqIABFKQxNXS0W7cat1zE3cPidOCHEYAFsEBD48kG9fURJUEHR6RL2R6PRTKSjaDTMbI6PQGeaoGz2eyWOI2DggFyhax2ey5TQBIIhKw0BxjKJYthIlJJaJxdAOTLZLYdMr5KbVOr9Q6oVajMmYzDMkrdXpcwbRPlnIUQWbw1b2WLLDFHCLoNjSvYUA7irEK+RKgWWVXq663e6-J4vN4fL4gMS-GwAazAUAyNFUYNUzUhWgRMLg+mQ8JobjclkpbilfiYBIGRKNpNweGilPs1JAySxdIZICyGGlrPaHPqcuGoyjbO2Ir68LLIwrRZlcwGTVWmBSjmVPOGbBoJsrHU12qGxw7Z2svf7NzuD2er3en2w33EAFdEk5ZL3k56IZo0JGQNxYUGW2g4osK-iQmRom5wpFk1isPEaVi0jZGfncI3C+yIDUS1PbtrHLLtBW-P9qzFIYGz-WUgPUAUNX2Wtx0uUNcmnc0QEtecbQAXWwEQ7R+EAIEwDJahsQElGCcEMGjCEjwDOEgLMOJjkwGh00xdA0iNNgbByaNYxvCkUl7JNojRNwyUzKw4lRdE82EgcSl-bYAOgo5LjiSJMV5RT+0bKDa2ONh5APQ1MD4nwIO2eDuSsRZ0H0nTBJSZCtTMxZLjQoTPNNGcLTna1F2XX4aDgMBOFqDJ3h3BifWhQ9dBYk9uXvI1uPRXj7A4lJXNxETr2CFMJIfaS2Fk18FKUz9VJ-IJGy00s1mq3KFhGYzIJ6GsEOOJEEi7NtbOlRydWctUVmcuILK84cdMufkFgs1SsPERgoCQaAbSXEjxH4YwwCQFcUESsk9z9VLj0W1AaHsNg1k8TteLcDikXQYqfVEsqsRDFID0fKwUiEzt5JREZhpUgtmr-Vq2OcwSDQWOw3GlUyBsubiZuODx5HG5snPM+wVuAzB7DsBa2swSkyecymCaC7DcLC217QxOA7zyR0bFolQUqug9mMDO7zxoSw3HkGwPy7PiOIe2m8X8Ur4wBoHUjB2rIfQaGmXslk4c0zk2t1+wrPcmyMb67Snzic20LYK2DZKCaYJG5ybDcHrtiHVCwOOL2pzNWcrQXbxCOIjmXSgGwmE4R1+fo2WrvUEXWO5Mw3BSSx5DYfPxnCdBwzVfsr0JW97ykp9YmGiH3wa2GBhak2ENgqsbbMyUwMJ-2DNmjCXd2FC24D9D0eZ0O8PCg7fhYAAvR6wG3OivRTqEkvTjKdURJ73pR1APGRRFUWVmNVcriJq+GWvtYb3N9bU0ojY6BHM+c+JXp08JrdFHzP-8jQXuiNjg0HpLjdAbgkTUwGmqC2T55AjEwiHX4W0dqBBnhzKgdQJB5D5oldevpZZbzuiGZEKR5AU3GKGeQlgFQpECj9C+4lJLknONVOStJ6oPy-E-DSr9W7v2xNnXGNkqZD0xsTWwIix62CZk-N2S00wQNJvIxsfssYUx4hKVRyDgo4VCuHfaHMoDoD4IkJgGRTAEMYoff0ot4R0hsJYd8X9D6uTofIIBJUK7-UTGw8MVJtbZk7DDIe-Diy215KBJCEjO6j1iQoomk1OK2FEWwU+Q8NFCJcrLayGS7IgA2iFMOBEiIRRAGwRIbhHj0AoAgJOXoDyp3sRnSa4xezgSYb4qwbAKrX3ajVDMXC0SN3CS-SJfdWhxL-rAmJ0yklTPJnEQeT9sntLHisieRSUEGNKZg0iRA3CJDyEgewNBGn7lsWSEh8JvY5xlnktAdM1jtm2eXOM0R1YDNBl9YJUMxl8Imf+QROo2zxE6liMRjCTLxOJrXSFo11jAPhe2Ny5M87fXUSPHJaK0KYr0SzQxe0KnyFkGAPgnAMgSEuXY5K11blAW4sfbO6KaBojoYVMuKsemSyrgE58ddUjpB4Y1P8ESQWASEZA0GaF3pio7rMqR2cnnk3lSilJFM2Bk1WGDBVg4cVgoZtq8cerCVTzZsY0ixhEhgEdBkN0tLmkb2FmlBxQFUS0N1nScYYCJZ9jvGfX68Y+msOBoMzhWZuFhKBc3eGoLWx1npr-fqTl24zGSSOGylJcZCRljAnJao3HnFsIU4pezp4R3KbPIpGRZCnTTLS9ELSbrpTuohNACoukfLEsSbOGs3xa2GVmAFoqm7lHjVKjZiTYVKpSd3GdcFM0Qn7scLZBbp0LPLazIxFS4h1IQHgFICVV7POua07eTRETIiRMorsXag3MN6f0gJMlI11VGWO8ZcbjZTsTSBesPcZmpvnfMiYQ9FHelXePDd7tEnbuJQc8QCB6B4EeCkRIcxErNo3sQt1bSmghmcYgwqvr9QohSHpR9vK7xXwFbfYdIMRUxqaj+gRf6jgLoWbOkDI4uPgcWbA1E9M1iQP1SUdZ-7dZCVzWJ81JTK1WvEGwWQFA8ASHnonbDtjXW3UcTYDikCHrjEek9XsrlqOfKxLRyqNcXyMZccxx+rGJ2-qiUm9Nwo4WboE42SDHblmrOxd5BJW7dk7oIoREAFBiDWlQOedQeQIDxIfdcBA3AYx4ExMECA9A+CFDwCUWiV4ACS-BoAZYyO6kATB6AntqHAYwABRIgeBn6oDiiwCAmQYB3Dy50KriAgicCgKUCA-RKmH1ojFogcX0RJfidsuotRcsCDQIIKLV4ADCARRt5baRAYwR4Vyjd3MgPgroYD9ESyuc06gYBVZO4Nk86gmA2x2jAVgXTEgZHoI6AgCAzpEB2+fNAp0mBMGuIdvgVQMhOGgEIKLhQ4CPGe9qDm9h55QDiCuXotEkAZEeNhAACuQegEAiBPaYAAAgAIJIBR2j2izwiDYRGyhinVPaIwHG-oJAeBWSU9dO6twvlcC1E4KwUXuAYzpfELLrDuYVx8AQMTyxmJOs89yI6CAThaiuiJ4jhgJ3Rv8AACoo7u1wdXP2-sAGV8t8BZirzgdwSC4B5yUPLFOADSuv9eE4gCVogRuimuj+xT4nPB+Ch-Z+ToXGQmA7aQA1x8oAGvNda+1i7t2dC8D4AAWQQJAIn-AJSREbEXkvEAy9YkIQEO3j3hesXUFeKo73ShfZKgACVuxCCAGR4D8+G6NnnE23s7QyBg3ACeRdi5wncCnKZlBTAQI8D7X2jQe4gEvw+Qlcg-Z53bgnku8ivEJJQVgkRNCsHRNwfPQhiKMulTiXGHgvCWd7Xyuj4bBV3yc7wi5k-G-D5l0jxrbB5kBoJqiqcB7GsBsLBktLAYaBcFcDsvohFjPM-jvEiCiJ+oaHIt9D2n9MSP4uGqmOmBDCEoCkAS3BxsBPxmAb1HOnxmBkwQ5MusBHqAfKsMaIgbqIqOOHwZPAppaqANgYRqGIEvAt2jylZqQaTAMhQf8jmCxuKsCiAVJmwSmhAQBsmhBpwW2GOHAWqH2Pwc5MYQQZOPJhWmIa2u6tyAlpeHIV-jZgMn-g5vfGodsBKpoZxtocBhAZ5k2EsuwQaiFmmpsqsghvslWk-vhpeuYBxIsDjHLPxH2Pvj4vIeGC+uGm+sEtGs5uoWxpMiArpOioZHNDoT5BZDIccGNAYT5DZBUUjMilkoalmosMNNZAFDYZgbaBIWgF7BLFxHxOMPLJLJQoUsQSGrkVVEMlQYUYAcUa5uxu5qJnNKIosD7B0JIpqtqt0UtGYY0ZojLKIiSGon+JJgsJgDIj0dqjYWgrtFgQkaQiGCiL2Oiq5F6iSGgTMV8v2j8kOlQaOt4YbCUZKusbcSKtZLTNsuAT5IDKIs+BqlmnmucR-u0REUaoHGkmPJ4GWuFohgMa8Y4lxJMWcWkQrAqNyqDtkd8gEr8uDLSKCUUT4RoQmpxvbPAm2E7OJl0N5nxtyY7M7NAT5m2EHOYf5N7H0cSZHOIaSWxNnLnPnJCkXCXPnJ-iQd-rZjfPZvXAAfyb4ZyVBtxswbxhKAEWKXBjpOulie2mhHaegUSrEftIMQiBJHQr2KqqGBLB2NxFqfGG4fRvqcKrLGCepByfQdEoBouoqhaU+FaX5oYZ7PYDwT2IguYSBIcXXrcd9OWk8RgiSXpkyoiOGAfHeLQrcUglkV-qGrqRGgUZ+hGe1qsaUdKkmeaboYwaiTcZTBArUfwW2BTKqhmdsjEYpgqSWY4bYI5oiNQh4mmd4t0vSWQSmEEg5tQV+rGm2ZCabJ2fGUEVAcmU0XidBgUkOc5GIo7Jks6RauHPKfYQRius8p4IGeVGGvMe+iiEsUaVGUeXGbsYKZabGWaRwUsm2E6cFg6VEeOUSa6VOW2nctxJypAh0oVHQvjO+f9ICYycCSybrDQSscASaTGfoU-HsawaBb5kujTFxKqryG8lmSkaOTEIDLKQhU+YkfdA4C4oJG4mAk9AGvIv8dZvyr-gxgaeGWyeCbuX4QwZTKxVxErIEV3IpRiTsa7JwRYY9LmtqvydceTB2JCuwjWXeaIbulxWLHYNYIpGTH6gJIGrWdqfWQMvkZub+eOiRdGZAYBV5iwS+TReBVjEWrJvmvaTTKFQHHmoSRgXKdWu6QFqliuV-gyeGkyf8oRdubQZOgBWBUBQFYmdRWEVpRBQPPCVcR0YFV0hOXYe6denQhuZiMlaJc+p+XXhwk2cpDJZGRCfJWRcEZRSBeRSeaFoFhVb7FVaaQJrVZZe6URrnHxPZeRnEJRsua1Tqe4ZJWGUReyX1aRb5flf5QmYdUFRml3MJqanJhFSAtJjqiWrJBxZOVZfpoZkfCZvnOGH6thWED-hKNtW+IaV5XQesT2apWNSVSEWNZBUFpVdiTaTNfBZWvhPhIuHaDAPTozqLEXqzmgDnt1naOVuHvoJAE1rUCtnlojt4EAA";

  return (
    <section
      className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden bg-black pt-20"
      aria-label="Hero"
    >
      {/* Same colorflow background on all viewports; GPU layer + containment for mobile performance */}
      <div
        className="absolute inset-0 z-0 pointer-events-none [contain:strict] [transform:translateZ(0)]"
        aria-hidden
      >
        <iframe
          src={colorflowSrc}
          title="Hero background animation"
          className="absolute left-1/2 top-1/2 h-[140vh] w-[140vw] -translate-x-1/2 -translate-y-1/2 scale-110 border-0 opacity-90 min-h-[100vh] min-w-[100vw] max-h-[none] max-w-[none] md:min-h-0 md:min-w-0"
          loading="eager"
          tabIndex={-1}
        />
      </div>

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-[#070b1a]/15 to-black/25 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* SiteHeader (marketing nav) is rendered once by (landing) layout with variant="hero" */}

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-4 md:px-8 max-w-7xl mx-auto w-full py-6 md:py-8 min-h-0 min-w-0">
          {/* Phone — desktop, full device visible (524×1063), no crop */}
          <AnimateOnScroll
            direction="right"
            duration={700}
            className="hidden lg:flex flex-shrink-0 items-center justify-center min-w-0"
          >
            <Image
              src="/appHero.png?v=2"
              alt="Vega Financial mobile app"
              width={524}
              height={1063}
              className="w-[min(360px,25vw)] h-auto max-h-[85vh] object-contain object-top drop-shadow-2xl"
              sizes="(max-width: 1024px) 0px, 360px"
              priority
            />
          </AnimateOnScroll>

          {/* Content */}
          <div className="flex flex-col items-center text-center flex-1 min-w-0 max-w-[839px]">
            <h1 className="font-syne text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-[-3px] leading-[1.05]">
              <AnimateOnScroll delay={0} duration={700}>
                Algorithmic
                <br />
                trading,
              </AnimateOnScroll>
              <AnimateOnScroll
                delay={650}
                duration={950}
                distance={18}
                scaleFrom={0.97}
                className="inline-block"
              >
                finally for
                <br />
                you.
              </AnimateOnScroll>
            </h1>

            <AnimateOnScroll delay={160}>
              <p className="font-dm-sans mt-4 text-white/90 text-base md:text-[19px] font-light leading-[1.7] max-w-[527px]">
                Invest in trading algorithms built by verified developers.
                <br className="hidden sm:inline" />
                Access the same tools that move 70% of financial markets.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={140}>
              <div className="mt-6 flex flex-col items-center gap-2">
                <DemoCTADropdown onInvest={handleTryItNow} variant="hero" />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
