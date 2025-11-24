import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ContactForm from "./ContactForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="min-h-screen bg-spot-beige">
      {/* Hero Section */}
      <section className="relative min-h-[250px] h-[35vh] sm:h-[40vh] flex items-center justify-center bg-spot-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight uppercase tracking-wide">
            {t("pageTitle")}
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-spot-red mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-light px-4">{t("pageSubtitle")}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
