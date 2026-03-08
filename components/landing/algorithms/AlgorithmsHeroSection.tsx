"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

/** Black and purple moving gradient — same pattern as homepage hero (iframe + overlay). */
const COLORFLOW_SRC =
  "https://colorflow.ls.graphics/embed.html#N4IgbgpgTgzglgewHYgFwEYAMAaEBzKOAEzVCgQHcY0BWXAYwQBtrUAWXABwTiQBdWAbUGhiaEACs8PCgEcAnCFzkKaHCEZM1XBPD6IUqUAA80AWkwA6dACZ5ANlwBPc1YDMNTDYC+DZgihSEEDUKxtcPDVLcJAAIyiYgEM0dF8QAAtEpCImCFZQTOzcgBkIADM+INNQ5zU0wpyIACU4PHTKoxBqq3Re9FrQ+qzGgFVOKqjML3kBi2iAdkwADiGiiAARSkMTV0spuwGwxZXcPidOCHEYAFsEBD50kG9fURJUEHR6WPtr68VlSjaDTMFI6PQGCaoGz2eZ7JaYDggFyoMxYSzw9AnYFMAJBEJhCIJXDxULRXDJDCrRr5DLDErlDo7FE9PqHKm5FptRldKJ9fpIuq4Bq5MaQuY0NxufnIub2ew+IV0jZbSFWCVSw6WOUKkBnC5XW73R7PbCvcQ2ADWYCgiRoqgBqhq2LQMW44OQkPVlho83mMwFgz8OJCZEmcvmhNJmHDxLDMPJKXZeSCwogpQqYpZvTZirWnPaqusrIDmCTos61TmmHmjgDc3QbBobCTmwo2x5UZrmobTbSesu7xudweTxeIDE7wArrEnLJG5EHUDNGg3GC4PoPRW0PD1MjS0HcZ18XsY-g4xG4ueE5Tc9SU0r09zK1npYLaXnWgWt0692Xxt-dzfVNW3bbpNWWSU+3OAcQCHI1RwAXWwERxzeEAIEwRIyhsb4lGCQEMCDIE3XXCFv1RKwlnmNwYmRWx0EseRGx1TRD1DUkaJoOgz1JLB5CWWNSUWJJE1vXIaVTR9MzhJZuJlHoliWZsxOaT8n0mNh5FXEs9nQeYdVTcsmSsKZ0Dk3YERseYWxVAC9imASdK8PSoP1QdDRHE0zXeGg4DATgykSR5F0I51QpIjdQJdTFLA8GhaJSBx0RhayDxDYIrx4kzTxJbL4xAClUhUiSHwZaT0H419mT2Gw7CTfN1KjGwzPAvSivfUZ-yZKsbEwbT5L2Nx5BoGy20LLx5XAvrUt1aDxEYKAkGgUdTVQ8R+GMMAkEnFAQv5ZcoTXSLPRoexrBSgY9LO+KfTSVj0uPaN8siKMcsywqkxKtYpPIkyaNrAbMHQew3HqtTxvmLipvkGbDK6jsTKmczqsweLYaVEDpKmVHwLR1yYLgzyxwnJE4Bo9ILRsPCVFBMLtIisimXhGhYvkWrLvmJZvXsBE7v8B7MpevKL1yk98o+4r72+srfusJYQdmEy2CBsGuULTEFac5X2rh1VFZqtxlI63JMYA8CbEN-GDWHY1vCQlCSetKAbCYTgLWpgiYgO9QGc3bq3FhJYbBoRzkWDhiJTqtK8SJLKyUvUkRJvY3k06SSZe6sJtf1-YsVTBrCxsbOnK8POlSMhGc6WSCVNN4zwOr0HTjm9ybZW7yQBYAAvew2DABd8MdL2QXC3RSL9jtavkRi2CogYaIj4ajfumPeMlbShesdfBJ6beCtElOvsaH7M6LfipuB1Wv2M6xlkRQHepGlSK+feze-1ht7CflO64RvYYeRmEKY8grbvAWktQIXk1rvCoOUCQ6QqYhWHloQ6IBfZRVQJ4WE8xbD+mRJKSi8UsQryPILTKosnoXglofKWx8M4dirIpBKKMvAGSVAXOyywg5TVqn+caCIP7QiNsBWyp8pj315EI0BsEPK21WiTKA6A+CxCYIkUwSCiKoHpmPY6354Rcw8LPeewNLCNj6nzYMq9d6SkjNY7Sot0B72oamI+9IMyyz5DmFOHD64lj4ZwoGzCqyzzYWsX+r9TLMKVkHaRhNbb2w7mwWIbhrj0AoAgD2jptLeyOozBhwdYpuHysiNgNFTGyQsWxDKpI2DzEbLY6IpT+SiyYYiZxSpXFpnoWBPxKkfF-08b0lOL8gSA0bqNDBgEozjObm5GRbcoEkyIG4WI6QkBf0ySuTR-J0GQgDmdeUtgBhsHsNPfR7USHsWFg0yhO8xZUIPi42hbjGr1kNlVRGRcr6NV3mwKqVYvDCPLvDCJpcP5uHMbXURf9c7dghU3Wacy4nt2gSAeQsgwB8E4IkCQmytGaNdDovJ1R7COMaUpY5w10Sz0qQLV6z1yHvUeR055XT3Gn0xOzJy1FQmNH6d0OWXLAY8v8TfTA8g2b62hDrDG0KIkSqidEUlsTZEopJsYWIYALSJFtHi7JI9tHugwUHaemIlhVRoGZb0pSWL8ysfcm5b16UPOTk8tOpV2UMJfF4-O4MzZDN1pwz+UrbC8pNnKiywadLNV4bMgmqrngJNRXwRIshtowjxYiHJaCiUTwFcDHGAYeY9B5t-S51SCRxxiKLJOMq1idJPpXAN7C-U30Gb+Z+ILRkWRmT-CNP43z9mtvBRZaElhpIQHgeYwVB5oCzSPHZuaMHQmurU0OtAJXonNRcu1pCOLB24pvPijlRbCWvHWu87rpaetfu2oCLa1Z2TvYGYZXaB0o17SIsa-qO2IvjQs4maEED0DwNceYsRxghXnSgwlRrPRlPkG1AYNBN1UQqdHPd7gD0NOPXcs9+9XUsqvXQm9uxn37m8a2gZxZf2BrbUHD50RHEXvDd+jlDGQ1ShVQB+RaE2CyAoHgCQXd3ZQc0Ya8exqbBc0cadAYvc2CmMtWW3dVzYrYbjrhhOVh8PtPrayxtt6aP3o-I+3xtHgV6zrCZT9sq2NNt-UO1uI67ZIRABQYgI5UA7iFBAP1xa+wIG4DiPAyJggQHoCmpAeBch4XugASX4NAYLiRdGd3oDOsocBjAAFEiB4FToFFgEByQwAuJFpoqXEBBE4FAPIEAOggDYFovCHmiBecROkPzj6EXlDKBFgQaBBBufugAYQCHVyLeSIDGDdJOOrS5kB8BtDADo6h0iTgHOoGAqX5tVc3OoJgaklowFYBR2IiR6AWgIAgHaRBxuWNQNtJgTBTgzb4MURIThoBCDc1kOA1x9vthJvYLuUAliTjaHhJAiRrgwQAArkHoBAIge2mAAAIACCSAAdA7wrcIgMFavAZR2jvCMAGv6GizSVHNpdEQqmLgMonBWAQtwDiIL4gOeQYKpOPgCB4eqOREVinaQLQQCcGUG0cPfu4Ap7kSLKOADSEupew4gPFogsvdQ2iuyj+HPB+Da+J8j2niQmDjaQFll6oAsu5fy6nZbm2dC8D4AAWQQJAOH-BeTcVTB7r3EAfeJzSgAZV23Tsi6h7rFGO3kM7aUAASm2gQQESPAaLNW6sU8a0dpaiRIG4DN-T7GcuLgo6iIiG02QEDXBO2d70cuIAV60c1NIF2Keh5hyz9I9w8SUFYNxTQrBETcFd0IFCuyPF2ABrsDwXhaX2piJvatsc9OXoKB6n5PqH3X2o9mZtawRlRmmFK44Eysan+jefuNw6iarSn0yaEsJlgCLrGiDExDVMVvjivu5tbPoDNukyNjMX1fUzN98PlRUvVvRJR-krBtQL87J1RGNEDb9nN79QBH8OwvQfQ-QvFy1HpTxN5bltMHUCMWNU5N9r1XlvVD8+UqN81QCKM6MYDqxZ9qoewgUwl+0TIuwdIuDuMXMH8l1IQfMhlCCyFnU7lSD19xIgDSNODmDvkrMLMj830pkWC7NJkG4a4-0794lkIsDRDyIP8eVLpmoZ54pF9MN1MoZNNxUT0ohdNmV9NiMXksZFJkZ6xFJuCGCICBUEQtJWp9JoDAigZvClYrIkCxUHJzYXJ0D5lhDjC4NvwLYWZUY9IOYDF5AF8MM1NSCSCnVrkKDAD3C2VaCmMKVrN7JeY+lGCNJMQc5UY-CRQND7IhULIUMQEoV7NwiA5zY-lpFwFlooFsDqguJFMGxqJLoUMtRL58if9CjGVpDSjJZyjDMLIIVFVxEEVwC99AiZiaigZxUwjJgY0c5PAw1lQ+iLILinIrihDMCc1UimZUZWZOiMBOZuY6jsQqkiCGVViKFTw5CqCU5NjOD5Z+oLJtYVCn0oTwJYTO1VC7jLZeidCnILYjYnMkiiYk1xjzAA50Rg510oRLVYCo4-i6VK0-8yCAD1jqCSNKii4gZmjpM4Sb4WTGNc4zj31GE9Cv0MS9w4Q9CcTkUxiTCn8ykGxqx543AuZlZTkbC1NHEbFNM94HEnFXCN9wTgDODapIjdIlgejKMAjeRlDkTZYJo8EyNNJKDwlzTSSgEilhiAgIEUUCTMFoRTEbTW9p4+pehlSljiCViSjQSG09T6wLTTSDjzSD81DOp+FJoaiGwtIYi2DoxFVUyEUxSE0xxPT9FYomxSSpQzozEEVJC141Sj0NTeQtTCM3DGSPCPFoz9jt96C2j+EjljiQl0zQVuzhSEQYlEjxS7YjCXjJMxQClJRik50ylZ4VNHs1Nal6kq0mk7lWlz0yimyKiUSwDd8fkix4yTNEyf0e0BTtC9ybNRSW5cS5EUjJzvwPBsFIZkZakGIMRFz-ipCSjgTxZtT5CNjIy6CEyOQGjeJWzLMrTUYgkehqw9jLyAl4pux4Knj7yJzdEmQUMzpZJ+DkRLVFMmwhogyASLwij8o-yXVKCIzFD6x5QdjPBWjVIzTeJ6LLjfjWDDj34aii5Az0SsYawJFE4-l2pcyeMHzMKOwTU5ZzVkMrUiLbUlzgzATfymUGydT05aKQKTywKWLNDeSTIo0BoY1riHSUYjKEhQ00LEJxzPSS1C1kRi1zpUYSLY5aSa0tyGTdTFD9L6i9KjyoDLTzNzyEKeDbj30KMxLkiMLiUXQ5RrVOZkNUNt1XL917Cj1HC8MvBPKaEgKtKAqd9TNYyILjz9z1C9z+TQrGgzLfL9CMD0LPTI5GIkMAxuj0ROYvzqS7DD1eRMqyCXD1LAKdyISozSqtCirDzyMDLBVGNmouN+KPEOMeLmNrKJTXipLpMt45Mi02BFNGwzJUqsN0rerz5+rsq1jcrhrgKCqOzmLirarOLu0P0LywqhTB1bzRyEIEI0hOAhcLsrtQ8U0+ACZ+dOALgSAGB5s6t+AAAVAHLbNIOAGAbHXHSKD3QnNAJ3ErccJLXXfQSAHLMofrSLX7bwIAA";

export function AlgorithmsHeroSection(): JSX.Element {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col bg-black pt-20"
      aria-label="Algorithms hero"
    >
      {/* Same moving-background pattern as homepage: full-viewport iframe, no overlay so gradient stays clear */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <iframe
          src={COLORFLOW_SRC}
          title="Algorithms page background animation"
          className="absolute left-1/2 top-1/2 h-[160vh] w-[180vw] -translate-x-1/2 -translate-y-1/2 scale-110 border-0 opacity-90 md:h-[140vh] md:w-[140vw] md:opacity-95"
          loading="eager"
          tabIndex={-1}
        />
      </div>
      <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-visible">
        {/* Layout matches reference: image left (975px equiv, ~64–68% width), text right (label, 80px headline, 3xl subtitle) */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-0 px-0 md:px-4 lg:px-5 max-w-[1520px] mx-auto w-full py-6 md:py-8 min-h-0">
          {/* Left: iMac — reference 975×830, aspect 1.33; make it bigger (~65% width), flush left on desktop */}
          <div className="flex-shrink-0 w-full lg:w-[65%] xl:w-[67%] order-2 lg:order-1 lg:min-h-[830px] relative">
            <div className="relative w-full h-full min-h-[55vh] lg:min-h-[82vh] max-h-[90vh]">
              <Image
                src="/page1algo.png"
                alt="iMac displaying algorithmic trading interface"
                fill
                className="object-contain object-left-top"
                sizes="(max-width: 1024px) 100vw, 67vw"
                priority
              />
            </div>
          </div>
          {/* Right: label, headline, subtitle — text block moved slightly toward centre (inset from right edge) */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-end justify-center text-center lg:text-right w-full lg:w-[33%] xl:w-[31%] lg:pl-4 xl:pl-6 lg:pr-10 xl:pr-14 2xl:pr-20 order-1 lg:order-2 py-8 lg:py-0">
            <AnimateOnScroll direction="up" delay={100} duration={700} distance={16}>
            <p className="font-dm-mono font-normal text-[#793de1] text-xl tracking-[2px] leading-[17.6px] whitespace-nowrap">
              {"// WHAT IS AN ALGORITHM"}
            </p>
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[1.05] tracking-[0] mt-4 text-white max-w-[673px]">
              <span className="text-white">The engine behind </span>
              <span className="text-[#793de1]">modern markets.</span>
            </h1>
            <p className="font-maven-pro font-normal text-white text-base md:text-lg leading-normal mt-10 max-w-[690px]">
              Algorithmic trading has driven financial markets for decades. Here&apos;s
              what it actually means and why it matters for you.
            </p>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
