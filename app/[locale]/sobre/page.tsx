import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/footer";
import { createBreadcrumbStructuredData, createMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return createMetadata({
    locale,
    pathname: "/sobre",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const hero = t.raw("hero") as { title: string; subtitle: string; updated: string };
  const authorParagraphs = t.raw("author.paragraphs") as string[];
  const experienceItems = t.raw("experience.items") as string[];
  const stack = t.raw("tech.stack") as string[];
  const dataParagraphs = t.raw("data.paragraphs") as string[];
  const contactChannels = t.raw("contact.channels") as string[];

  const breadcrumbStructuredData = createBreadcrumbStructuredData({
    locale,
    items: [
      { name: "Termo Jogo", path: "/" },
      { name: hero.title, path: "/sobre" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-[#ecf0e2] py-12">
          <div className="mx-auto max-w-4xl px-4 text-center space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-green">
              Termo Academy
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{hero.title}</h1>
            <p className="text-base text-gray-700 sm:text-lg">{hero.subtitle}</p>
            <p className="text-sm text-gray-500">{hero.updated}</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">{t("author.title")}</h2>
            {authorParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{t("experience.title")}</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {experienceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{t("tech.title")}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{t("data.title")}</h3>
            {dataParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dados"
                className="inline-flex items-center justify-center rounded-full bg-primary-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
              >
                {t("data.cta")}
              </Link>
              <Link
                href="/atualizacoes"
                className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-4 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green"
              >
                Ver changelog público
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{t("contact.title")}</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{t("contact.emailLabel")}: </span>
              <a
                className="text-primary-green hover:underline"
                href={`mailto:${t("contact.email")}`}
              >
                {t("contact.email")}
              </a>
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {contactChannels.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </div>
  );
}
