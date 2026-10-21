import type { Metadata } from "next";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BarChart3 } from "lucide-react";
import Footer from "@/components/footer";
import { createBreadcrumbStructuredData, createMetadata } from "@/lib/seo";

const EDITORIAL_UPDATED_ISO = "2026-02-18";

const sections = [
  {
    id: "introducao",
    titleKey: "intro.title",
    descriptionKey: "intro.description",
  },
  {
    id: "estrategias",
    titleKey: "strategies.title",
    descriptionKey: "strategies.description",
  },
  {
    id: "modos-de-jogo",
    titleKey: "modes.title",
    descriptionKey: "modes.description",
  },
  {
    id: "desafios",
    titleKey: "challenges.title",
    descriptionKey: "challenges.description",
  },
  {
    id: "estatisticas",
    titleKey: "stats.title",
    descriptionKey: "stats.description",
  },
  {
    id: "recursos",
    titleKey: "resources.title",
    descriptionKey: "resources.description",
  },
  {
    id: "faq",
    titleKey: "faq.title",
    descriptionKey: "faq.description",
  },
] as const;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "GuidePage" });

  return createMetadata({
    locale,
    pathname: "/guia-termo",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
  });
}

export default function GuidePage() {
  const locale = useLocale();
  const t = useTranslations("GuidePage");

  const breadcrumbStructuredData = createBreadcrumbStructuredData({
    locale,
    items: [
      { name: "Termo Jogo", path: "/" },
      { name: t("hero.title"), path: "/guia-termo" },
    ],
  });
  const breadcrumbStructuredDataJson = JSON.stringify(breadcrumbStructuredData);

  const guideSections = sections.map((entry) => {
    // Get the correct items key based on the mapping
    let itemsKey = `${entry.id}.items`;
    if (entry.id === "introducao") itemsKey = "intro.items";
    else if (entry.id === "estrategias") itemsKey = "strategies.items";
    else if (entry.id === "modos-de-jogo") itemsKey = "modes.items";
    else if (entry.id === "desafios") itemsKey = "challenges.items";
    else if (entry.id === "estatisticas") itemsKey = "stats.items";
    else if (entry.id === "recursos") itemsKey = "resources.items";
    else if (entry.id === "faq") itemsKey = "faq.entries";

    let items: string[] | undefined;
    if (entry.id === "faq") {
      // For FAQ, extract questions from entries
      const faqEntries = t.raw("faq.entries") as Array<{ question: string; answer: string }>;
      items = faqEntries?.map(entry => entry.question);
    } else {
      items = t.raw(itemsKey) as string[] | undefined;
    }

    return {
      ...entry,
      title: t(entry.titleKey),
      description: t(entry.descriptionKey),
      items,
    };
  });

  const faqEntries = t.raw("faq.entries") as Array<{ question: string; answer: string }>;
  const lengthGuideItems = t.raw("lengthGuides.items") as Array<{
    title: string;
    description: string;
    href: string;
  }>;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://termo-jogo.com";
  const canonicalUrl = `${siteUrl}/guia-termo`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t("hero.title"),
    description: t("meta.description"),
    inLanguage: locale === "pt" ? "pt-BR" : locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: canonicalUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'Termo Jogo',
      url: 'https://termo-jogo.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Termo Jogo',
      url: 'https://termo-jogo.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://termo-jogo.com/logo.png',
      },
    },
    datePublished: '2025-01-01',
    dateModified: EDITORIAL_UPDATED_ISO,
    articleSection: 'Jogos de Palavras',
    keywords: t("meta.keywords"),
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };

  const howToStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como Jogar Termo - Guia Completo',
    description: 'Aprenda a jogar Termo em menos de 1 minuto',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Digite uma palavra',
        text: 'Comece digitando qualquer palavra de 5 letras em português no Termo.',
      },
      {
        '@type': 'HowToStep',
        name: 'Observe as cores',
        text: '🟩 Verde: letra correta no lugar certo | 🟨 Amarelo: letra existe, mas está no lugar errado | ⬛ Cinza: letra não existe na palavra',
      },
      {
        '@type': 'HowToStep',
        name: 'Use as dicas',
        text: 'Com base nas cores, faça seu próximo palpite. Elimine letras cinzas, reposicione as amarelas e mantenha as verdes no lugar.',
      },
      {
        '@type': 'HowToStep',
        name: 'Descubra a palavra',
        text: 'Você tem 6 tentativas para descobrir a palavra secreta. Quanto menos tentativas usar, melhor sua pontuação!',
      },
    ],
  };

  const courseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Guia Completo do Termo',
    description: 'Aprenda estratégias vencedoras e domine o jogo Termo em português',
    provider: {
      '@type': 'Organization',
      name: 'Termo Jogo',
      url: 'https://termo-jogo.com',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Organization',
        name: 'Termo Jogo',
      },
    },
    teaches: [
      'Estratégias de abertura para Termo',
      'Como interpretar as cores do jogo',
      'Melhores palavras iniciais',
      'Análise de estatísticas',
      'Como jogar Termo Infinito',
      'Criação de desafios personalizados',
    ],
    inLanguage: locale === "pt" ? "pt-BR" : locale,
    about: [
      'Jogo de palavras',
      'Termo',
      'Wordle português',
      'Estratégias de jogo',
    ],
  };

  const videoGameStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Termo - Jogo de Palavras em Português',
    description: 'Jogue Termo online grátis! O jogo de palavras mais popular em português.',
    url: 'https://termo-jogo.com',
    genre: ['Puzzle', 'Word Game', 'Educational'],
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Termo Jogo',
      url: 'https://termo-jogo.com',
    },
    inLanguage: 'pt-BR',
  };

  const structuredDataJson = JSON.stringify(structuredData);
  const faqStructuredDataJson = JSON.stringify(faqStructuredData);
  const howToStructuredDataJson = JSON.stringify(howToStructuredData);
  const courseStructuredDataJson = JSON.stringify(courseStructuredData);
  const videoGameStructuredDataJson = JSON.stringify(videoGameStructuredData);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-[#ecf0e2] py-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-green">
              Termo Academy
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("hero.title")}</h1>
            <p className="mx-auto max-w-3xl text-base text-gray-700 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-600">
              {t("hero.content")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#introducao"
                className="inline-flex items-center justify-center rounded-full bg-primary-green px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
              >
                {t("hero.cta")}
              </Link>
              <Link
                href="#modos-de-jogo"
                className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-6 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green hover:text-primary-green"
              >
                {t("modes.title")}
              </Link>
            </div>
          </div>
        </section>

        <nav className="border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-3 px-4 py-4 text-sm">
            {guideSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-gray-200 px-4 py-1 text-gray-600 transition hover:border-primary-green hover:text-primary-green"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12">
          {guideSections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-6 scroll-mt-24">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-green">
                  {section.id.replace("-", " ")}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{section.description}</p>
              </div>

              {section.items && section.items.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li key={item} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.id === "estatisticas" && (
                <div className="rounded-xl border border-primary-green/20 bg-[#ecf0e2] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t("stats.cta")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("stats.ctaDescription")}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-full bg-primary-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Estatísticas
                    </Link>
                    <span className="inline-flex items-center text-xs text-gray-500">
                      📊 Ícone no canto superior direito
                    </span>
                  </div>
                </div>
              )}
            </section>
          ))}

          <section id="faq" className="space-y-6 scroll-mt-24">
            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-green">
                FAQ Termo Academy
              </p>
              <h2 className="text-2xl font-bold text-gray-900">{t("faq.title")}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{t("faq.description")}</p>
            </div>
            <div className="space-y-4">
              {faqEntries.map((entry, index) => (
                <details key={entry.question} className="group rounded-xl border border-gray-200 bg-white/80 p-4">
                  <summary className="flex cursor-pointer items-center justify-between text-left text-sm font-semibold text-gray-800">
                    <span>
                      <span className="mr-3 text-primary-green">{index + 1}.</span>
                      {entry.question}
                    </span>
                    <span className="text-primary-green transition group-open:-rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {entry.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-primary-green/20 bg-[#ecf0e2] p-6">
            <h3 className="text-lg font-semibold text-gray-900">Outros recursos</h3>
            <p className="mt-2 text-sm text-gray-600">
              Explore conteúdos complementares sobre o termo de hoje, desafios personalizados e jogos de palavras em português.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(t.raw("pointers") as Array<{ title: string; description: string; href: string }>).map((pointer) => (
                <Link
                  key={pointer.href}
                  href={pointer.href}
                  className="rounded-xl border border-white/60 bg-white p-4 text-sm leading-relaxed text-gray-700 transition hover:border-primary-green/40"
                >
                  <span className="font-semibold text-primary-green block mb-1">{pointer.title}</span>
                  {pointer.description}
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{t("lengthGuides.title")}</h2>
              <p className="text-sm text-gray-600">{t("lengthGuides.description")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lengthGuideItems?.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-left transition hover:border-primary-green/50 hover:bg-white"
                >
                  <h3 className="font-semibold text-primary-green mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/" className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-left transition hover:border-primary-green/50 hover:bg-white">
                <h3 className="font-semibold text-primary-green mb-2">← Voltar para o jogo</h3>
                <p className="text-sm text-gray-600">Jogue o termo de hoje e pratique no modo infinito</p>
              </Link>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Melhore suas estatísticas</h3>
                <p className="text-sm text-gray-600">Acompanhe seu progresso e suba de nível no Termo</p>
                <Link href="/#estatisticas" className="text-primary-green text-sm font-medium mt-2 inline-block">Ver estatísticas →</Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbStructuredDataJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqStructuredDataJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: howToStructuredDataJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseStructuredDataJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoGameStructuredDataJson }} />
    </div>
  );
}
