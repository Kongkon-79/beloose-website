import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-[#120805] text-white sm:min-h-[720px] lg:min-h-[840px]">
      <Image
        src="/assets/images/hero.png"
        alt="Premium cigar humidor showroom"
        fill
        priority
        sizes="100vw"
        className="z-[-3] object-cover object-[52%_48%]"
      />

      <div className="absolute inset-0 z-[-2] bg-[#1a0902]/55" />
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,rgba(120,63,18,0.16)_0%,rgba(18,8,5,0.10)_34%,rgba(18,8,5,0.58)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#090402]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090402]/55 to-transparent" />

      <div className="container flex min-h-[640px] items-center justify-center px-4 pb-16 pt-32 text-center sm:min-h-[720px] sm:pt-36 lg:min-h-[840px] lg:pt-40">
        <div className="mx-auto max-w-[1024px]">
          <p className="mb-2 text-xs md:text-sm font-normal uppercase leading-relaxed tracking-[0.14em] text-[#F7E4B3]">
            The digital operating platform for premium cigar retailers
          </p>

          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#F7E4B3] leading-normal drop-shadow-[0_4px_18px_rgba(0,0,0,0.48)] ">
            Spend Less Time Managing Your{" "}
            <span className="text-[#CBA24A]">Humidor, Spend More</span> Time
            Selling Cigars.
          </h1>

          <p className="mx-auto mt-5 text-balance text-sm leading-relaxed text-[#F7E4B3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-base">
            Humidor411 helps premium cigar retailers organize inventory, <br className="hidden md:block"/> guide
            customers to the right cigars, and increase sales through a smarter
            in-store experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
