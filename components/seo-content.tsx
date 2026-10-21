"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreateGameModal } from "./modals/CreateGameModal";
import { PWAInstallPrompt } from "./pwa-install-prompt";
import {
  loadWordList,
  canonicalizeGuess,
  type WordListData,
} from "@/lib/words";
import { generateChallengeUrl } from "@/lib/share";
import type { SupportedWordLength } from "@/lib/wordLengths";
import { cn } from "@/lib/utils";
import { SUPPORTED_WORD_LENGTHS } from "@/lib/wordLengths";
import { buildGamePath, buildSearchPath } from "@/lib/routes";
import { HowToPlay } from "./how-to-play";
import { FaqSection } from "./faq-section";
import Image from "next/image";

type FeatureHighlight = {
  title: string;
  description: string;
  keyword: string;
};

interface SEOContentProps {
  locale: string;
}

export default function SEOContent({ locale }: SEOContentProps) {
  const t = useTranslations("HomePage");
  const WORD_LENGTH: SupportedWordLength = 5;
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  const [wordData, setWordData] = useState<WordListData | null>(null);
  const lengthCards = SUPPORTED_WORD_LENGTHS.map((length) => ({
    length,
    gameHref: buildGamePath(locale, length),
    searchHref: buildSearchPath(locale, length),
  }));
  const rawHighlights = t.raw('gameIntro.featureHighlights');
  const featureHighlights = Array.isArray(rawHighlights) ? (rawHighlights as FeatureHighlight[]) : [];

  const rawFaq = t.raw('faq.questions');
  const faqEntries = Array.isArray(rawFaq) ? (rawFaq as { question: string; answer: string }[]) : [];
  const faqSchema = faqEntries.length
    ? {
      '@type': 'FAQPage',
      mainEntity: faqEntries.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
    : null;

  const rawSteps = t.raw('howToPlay.steps');
  const howToEntries = Array.isArray(rawSteps)
    ? (rawSteps as { title: string; description: string }[])
    : [];
  const howToSchema = howToEntries.length
    ? {
      '@type': 'HowTo',
      name: t('howToPlay.title'),
      description: t('howToPlay.subtitle'),
      step: howToEntries.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    }
    : null;

  const structuredData = faqSchema || howToSchema
    ? {
      '@context': 'https://schema.org',
      '@graph': [faqSchema, howToSchema].filter(Boolean),
    }
    : null;

  useEffect(() => {
    let cancelled = false;

    loadWordList(WORD_LENGTH)
      .then((data) => {
        if (!cancelled) {
          setWordData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to preload word list:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [WORD_LENGTH]);

  const validateWord = useCallback(
    (word: string) => {
      if (!wordData) {
        return null;
      }
      return canonicalizeGuess(word, wordData);
    },
    [wordData]
  );

  const buildChallengeUrl = useCallback(
    async (canonicalWord: string) => generateChallengeUrl(canonicalWord, "/"),
    []
  );

  const handleOpenCreateModal = () => {
    if (wordData) {
      setIsCreateGameModalOpen(true);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Game Introduction Section */}
      <section className="text-center bg-[#ecf0e2] relative py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-tight">
            {t("h1")}
          </h1>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
              {t("gameIntro.title")}
            </h2>
            <p className="text-gray-700 mb-2 leading-relaxed max-w-2xl mx-auto">
              {t("gameIntro.description")}
            </p>
          </div>

          {featureHighlights.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featureHighlights.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/60 bg-white/80 p-6 text-left shadow-sm transition hover:border-primary-green/50 hover:shadow"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-green">
                    {feature.keyword}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/guia-termo"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-green/80"
          >
            Ir para o Guia Termo Academy
          </Link>
        </div>
      </section>

      <section className="bg-white/80 border border-gray-100 rounded-2xl shadow-sm mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("lengthDirectory.title")}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              {t("lengthDirectory.description")}
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lengthCards.map(({ length, gameHref, searchHref }) => (
              <div
                key={length}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-green">
                    {`Termo ${length} letras`}
                  </p>
                  <h3 className="font-semibold text-gray-900">
                    {`Termo de ${length} letras`}
                  </h3>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={gameHref}
                    className="text-sm flex-1 inline-flex justify-center items-center rounded-lg bg-primary-green text-white font-semibold px-4 py-2 hover:bg-primary-green/80 transition-colors"
                  >
                    {t("lengthDirectory.playCta", { length })}
                  </Link>
                  <Link
                    href={searchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex-1 inline-flex justify-center items-center rounded-lg border border-primary-green text-primary-green font-semibold px-4 py-2 hover:bg-primary-green/10 transition-colors"
                  >
                    {t("lengthDirectory.searchCta", { length })}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Termo Feature Section */}
      <section className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            ✨ Crie Seu Próprio Desafio Termo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Que tal desafiar seus amigos com uma palavra personalizada? Crie seu próprio Termo e compartilhe o link com quem você quiser!
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={handleOpenCreateModal}
            disabled={!wordData}
            className={cn(
              "inline-flex items-center gap-2 bg-primary-green text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform shadow-lg",
              wordData
                ? "hover:scale-105 hover:bg-primary-green/90"
                : "opacity-60 cursor-not-allowed"
            )}
          >
            <PlusCircle className="h-6 w-6" />
            Criar Meu Desafio Agora
          </button>
          <p className="text-sm text-gray-600 mt-3">
            É gratuito e ilimitado - crie quantos desafios quiser!
          </p>
        </div>
      </section>

      {/* Additional Content */}
      <section className="bg-yellow-50 p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Pratique o Termo no seu ritmo
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          Jogue o desafio diário e use o modo infinito para testar aberturas,
          validar padrões e evoluir com consistência.
        </p>
        <div className="grid gap-3 md:grid-cols-3 text-sm max-w-3xl mx-auto mb-6">
          <div className="rounded-xl border border-yellow-200 bg-yellow-100/60 p-4 text-gray-700">
            Palavra diária sincronizada para todos os jogadores.
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-100/60 p-4 text-gray-700">
            Modo infinito para treinar sem limite de partidas.
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-100/60 p-4 text-gray-700">
            Desafios personalizados para jogar com amigos.
          </div>
        </div>
        <Link
          href="/"
          className="inline-block bg-primary-green text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Começar a Jogar
        </Link>
      </section>

      {/* SudokuAgora */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <a
            href="https://sudokuagora.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6 transition hover:border-green-300 hover:shadow-md"
          >
            <Image
              src="/sudokuagora-logo.png"
              alt="SudokuAgora"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="text-sm font-semibold text-green-700 mb-1">
                🧩 Experimente também o Sudoku
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Sudoku grátis online
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Gosta de jogos de lógica? Desafie sua mente com Sudoku grátis e níveis para todos os jogadores.
              </p>
            </div>

            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition group-hover:bg-green-700">
                Jogar Sudoku grátis
                <span className="ml-2">→</span>
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* How to Play Section */}
      <HowToPlay />

      {/* FAQ Section */}
      <FaqSection
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        items={faqEntries}
      />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto p-8">
        <div className="space-y-6 text-left md:text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Recursos para evoluir com consistência
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Além da partida diária, publicamos dados do dicionário, histórico de mudanças e guias por tamanho de palavra para quem quer treinar de forma estruturada.
          </p>
          <ul className="grid gap-4 md:grid-cols-2 text-sm leading-relaxed text-gray-700">
            <li className="rounded-xl bg-gray-50 p-4">
              <span className="font-semibold text-primary-green block mb-1">Relatório público de dados</span>
              Veja quantas palavras existem em cada modo, frequência de vogais e taxa de repetição de letras.
            </li>
            <li className="rounded-xl bg-gray-50 p-4">
              <span className="font-semibold text-primary-green block mb-1">Changelog editorial</span>
              Mantemos um histórico com data de atualização da base lexical e alterações relevantes no projeto.
            </li>
            <li className="rounded-xl bg-gray-50 p-4">
              <span className="font-semibold text-primary-green block mb-1">Guia por quantidade de letras</span>
              Cada guia traz estratégias específicas, erros comuns e sugestões de abertura para 3 a 11 letras.
            </li>
            <li className="rounded-xl bg-gray-50 p-4">
              <span className="font-semibold text-primary-green block mb-1">Transparência e contato</span>
              Publicamos informações de autoria, metodologia e canal direto para dúvidas em até 2 dias úteis.
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 md:justify-center">
            <Link
              href="/dados"
              className="inline-flex items-center justify-center rounded-full bg-primary-green px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
            >
              Ver dados públicos
            </Link>
            <Link
              href="/atualizacoes"
              className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-5 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green"
            >
              Ver atualizações
            </Link>
          </div>
        </div>
      </section>

      {/* Create Game Modal */}
      <CreateGameModal
        isOpen={isCreateGameModalOpen}
        handleClose={() => setIsCreateGameModalOpen(false)}
        wordLength={WORD_LENGTH}
        validateWord={validateWord}
        buildChallengeUrl={buildChallengeUrl}
      />

      <PWAInstallPrompt />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </div>
  );
}
