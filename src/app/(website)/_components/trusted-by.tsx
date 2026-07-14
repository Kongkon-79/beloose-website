const trustedBrands = [
  "Davidoff",
  "Cohiba",
  "Montecristo",
  "Arturo Fuente",
  "Romeo y Julieta",
  "Padron",
];

const TrustedBy = () => {
  return (
    <section className="border border-[#CBA24A1F] bg-[#2A1C0E] ">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex min-h-[86px] max-w-[720px] flex-col items-center justify-center gap-4 py-4 sm:h-[76px] sm:flex-row sm:gap-5 sm:py-0 md:max-w-[770px]">
          <div className="flex items-center gap-5">
            <p className="whitespace-nowrap text-xs font-normal uppercase leading-normal tracking-[0.12em] text-[#CBA24A]">
              Trusted By
            </p>
            <span className="hidden h-[22px] w-[2px] bg-[#CBA24A33] sm:block" />
          </div>

          <ul className="flex w-full flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:w-auto sm:flex-nowrap sm:gap-x-8 md:gap-x-10">
            {trustedBrands.map((brand) => (
              <li
                key={brand}
                className="whitespace-nowrap font-serif text-sm  uppercase leading-normal tracking-[0.025em] text-[#F7E4B3] transition-colors hover:text-[#d4ad63] cursor-pointer"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
