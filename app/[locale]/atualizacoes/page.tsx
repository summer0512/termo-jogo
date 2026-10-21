import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer";
import { createBreadcrumbStructuredData, createMetadata } from "@/lib/seo";

const UPDATED_AT = "18 de fevereiro de 2026";

const CHANGELOG = [
  {
    date: "18 de fevereiro de 2026",
    title: "Reprocessamento completo do dicionário",
    details: [
      "Atualizamos a base usando o dump mais recente do Wiktionary em português.",
      "Passamos a filtrar a lista de palpites com Zipf >= 1.0 para reduzir termos extremamente raros.",
      "A lista de respostas agora usa limiar por tamanho: 3 letras >= 2.8 e 4-11 letras >= 2.9.",
    ],
  },
  {
    date: "8 de fevereiro de 2026",
    title: "Reforço de páginas de referência",
    details: [
      "Expandimos a cobertura de guias por quantidade de letras.",
      "Revisamos páginas institucionais (sobre, dados públicos e termos).",
      "Melhoramos links internos para reduzir páginas órfãs.",
    ],
  },
  {
    date: "18 de janeiro de 2026",
    title: "Publicação do relatório de dados",
    details: [
      "Lançamos a página /dados com métricas por tamanho de palavra.",
      "Incluímos endpoint público para auditoria dos números.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    locale,
    pathname: "/atualizacoes",
    title: "Atualizações e metodologia | termo-jogo.com",
    description:
      "Veja o histórico editorial do termo-jogo.com, critérios de curadoria do dicionário e datas das principais mudanças.",
    keywords: "atualizações termo, changelog termo, metodologia dicionário termo",
  });
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const breadcrumbStructuredData = createBreadcrumbStructuredData({
    locale,
    items: [
      { name: "Termo Jogo", path: "/" },
      { name: "Atualizações e metodologia", path: "/atualizacoes" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-[#ecf0e2] py-12">
          <div className="mx-auto max-w-5xl px-4 space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-green">
              Transparência editorial
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Atualizações e metodologia do termo-jogo.com
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Publicamos nesta página as mudanças principais no dicionário, nos guias e na estrutura do site.
            </p>
            <p className="text-sm text-gray-500">Última atualização: {UPDATED_AT}</p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Como filtramos o dicionário hoje</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
              <li>Fonte: dump público do Wiktionary em português (pt).</li>
              <li>Palpites aceitos (allow): Zipf mínimo 1.0.</li>
              <li>Respostas de 3 letras: Zipf mínimo 2.8.</li>
              <li>Respostas de 4 a 11 letras: Zipf mínimo 2.9.</li>
              <li>As listas são normalizadas para acentos e deduplicadas antes do upload no KV.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Registro de mudanças</h2>
            <div className="space-y-4">
              {CHANGELOG.map((entry) => (
                <article key={entry.date + entry.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-green">{entry.date}</p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{entry.title}</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
                    {entry.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Páginas relacionadas</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dados"
                className="inline-flex items-center justify-center rounded-full bg-primary-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-green/80"
              >
                Ver dados públicos
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-4 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green"
              >
                Sobre o projeto
              </Link>
              <Link
                href="/guia-termo"
                className="inline-flex items-center justify-center rounded-full border border-primary-green/30 px-4 py-2 text-sm font-semibold text-primary-green transition hover:border-primary-green"
              >
                Guia Termo
              </Link>
            </div>
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
