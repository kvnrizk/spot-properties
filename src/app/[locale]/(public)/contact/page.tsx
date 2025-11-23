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
      <section className="relative h-[40vh] flex items-center justify-center bg-spot-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight uppercase tracking-wide">
            {t("pageTitle")}
          </h1>
          <div className="w-24 h-1 bg-spot-red mx-auto mb-6" />
          <p className="text-xl text-white/90 font-light">{t("pageSubtitle")}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
