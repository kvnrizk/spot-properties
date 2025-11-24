import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="min-h-screen bg-spot-beige">
      {/* Hero Section */}
      <section className="relative min-h-[300px] h-[40vh] sm:h-[50vh] flex items-center justify-center bg-spot-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight uppercase tracking-wide">
            {t("title")}
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-spot-red mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-light px-4">{t("subtitle")}</p>
        </div>
      </section>

      {/* About Content - 2 Column Layout */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Text Content - Left */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-dark tracking-tight">
                  {t("subtitle")}
                </h2>
                <div className="w-12 sm:w-16 h-1 bg-spot-red" />
              </div>

              <p className="text-base sm:text-lg text-spot-dark/80 font-light leading-relaxed">
                {t("body")}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-spot-dark/10 shadow-md">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-red mb-1 sm:mb-2">100+</div>
                  <p className="text-xs sm:text-sm md:text-base text-spot-dark/70 font-light">Properties Listed</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-spot-dark/10 shadow-md">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-red mb-1 sm:mb-2">2</div>
                  <p className="text-xs sm:text-sm md:text-base text-spot-dark/70 font-light">Countries</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-spot-dark/10 shadow-md">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-red mb-1 sm:mb-2">500+</div>
                  <p className="text-xs sm:text-sm md:text-base text-spot-dark/70 font-light">Happy Clients</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-spot-dark/10 shadow-md">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-red mb-1 sm:mb-2">10+</div>
                  <p className="text-xs sm:text-sm md:text-base text-spot-dark/70 font-light">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Image - Right */}
            <div className="relative h-[350px] sm:h-[450px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl border-4 border-spot-dark/20 bg-gradient-to-br from-spot-dark to-spot-red flex items-center justify-center">
              <div className="text-center text-white p-8">
                <svg
                  className="w-32 h-32 mx-auto mb-4 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <p className="text-xl font-light opacity-50">Spot Properties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-dark mb-3 sm:mb-4 tracking-tight">
              Why Choose Us
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-spot-red mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-8 bg-spot-beige rounded-lg border-2 border-spot-dark/10">
              <div className="w-16 h-16 bg-spot-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-spot-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-spot-dark mb-3">Expert Guidance</h3>
              <p className="text-spot-dark/70 font-light">
                Professional advice from experienced real estate experts
              </p>
            </div>

            <div className="text-center p-8 bg-spot-beige rounded-lg border-2 border-spot-dark/10">
              <div className="w-16 h-16 bg-spot-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-spot-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-spot-dark mb-3">Premium Properties</h3>
              <p className="text-spot-dark/70 font-light">
                Carefully curated selection of high-quality properties
              </p>
            </div>

            <div className="text-center p-8 bg-spot-beige rounded-lg border-2 border-spot-dark/10">
              <div className="w-16 h-16 bg-spot-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-spot-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-spot-dark mb-3">Personalized Service</h3>
              <p className="text-spot-dark/70 font-light">
                Tailored solutions to meet your unique needs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
