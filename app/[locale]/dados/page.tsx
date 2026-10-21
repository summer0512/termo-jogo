import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/footer";
import { createBreadcrumbStructuredData, createMetadata } from "@/lib/seo";
import {
  SUPPORTED_WORD_LENGTHS,
  type SupportedWordLength,
} from "@/lib/wordLengths";
import { getLengthStats } from "@/lib/length-stats";

const UPDATED_AT_DEFAULT = "18 de fevereiro de 2026";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StatsPage" });

  return createMetadata({
    locale,
    pathname: "/dados",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
  });
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export default async function StatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StatsPage" });
  const updatedAt = process.env.NEXT_PUBLIC_WORDSET_UPDATED_AT ?? UPDATED_AT_DEFAULT;
  const stats = SUPPORTED_WORD_LENGTHS.map((length) => ({
    length,
    data: getLengthStats(length as SupportedWordLength),
  }));

  const breadcrumbStructuredData = createBreadcrumbStructuredData({
    locale,
    items: [
      { name: "Termo Jogo", path: "/" },
      { name: t("hero.title"), path: "/dados" },
    ],
  });

  const apiExample = `curl https://termo-jogo.com/api/stats/5`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-[#ecf0e2] py-12">
          <div className="mx-auto max-w-5xl px-4 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-green">
              Dados oficiais
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <p className="text-sm text-gray-500">
              {t("hero.updated", { date: updatedAt })}
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          {t.raw("intro")?.map((paragraph: string) => (
            <p key={paragraph} className="text-base leading-7 text-gray-700">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("table.title")}
            </h2>
            <p className="text-sm text-gray-500">{t("table.caption")}</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("table.columns.length")}</th>
                  <th className="px-4 py-3 text-left">{t("table.columns.answers")}</th>
                  <th className="px-4 py-3 text-left">{t("table.columns.guesses")}</th>
                  <th className="px-4 py-3 text-left">{t("table.columns.vowels")}</th>
                  <th className="px-4 py-3 text-left">{t("table.columns.duplicates")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {stats.map(({ length, data }) => (
                  <tr key={length}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{length}</td>
                    <td className="px-4 py-3">{data.answers.wordCount.toLocaleString(locale)}</td>
                    <td className="px-4 py-3">{data.all.allowCount.toLocaleString(locale)}</td>
                    <td className="px-4 py-3">{data.all.vowelAverage.toFixed(2)}</td>
                    <td className="px-4 py-3">{formatPercent(data.all.duplicateRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{t("source.title")}</h3>
            {t.raw("source.paragraphs")?.map((paragraph: string) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
              {t.raw("source.list")?.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("api.title")}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{t("api.description")}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
              {t.raw("api.notes")?.map((note: string) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                {t("api.exampleLabel")}
              </p>
              <pre className="rounded-xl bg-gray-900 p-4 text-sm text-gray-100 overflow-x-auto">
                <code>{apiExample}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">{t("cta.title")}</h3>
          <p className="text-base text-gray-600">{t("cta.description")}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary-green px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
            >
              {t("cta.playLabel")}
            </Link>
            <Link
              href="/guia-termo"
              className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-6 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green hover:text-primary-green"
            >
              {t("cta.guideLabel")}
            </Link>
            <Link
              href="/atualizacoes"
              className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-6 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green hover:text-primary-green"
            >
              Ver atualizações
            </Link>
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
