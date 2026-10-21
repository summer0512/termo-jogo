import type { LengthStats } from "@/lib/length-stats";

interface WordFinderStatsProps {
  wordLength: number;
  stats: LengthStats;
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export function WordFinderStats({ wordLength, stats }: WordFinderStatsProps) {
  const answerCount = stats.answers.wordCount;
  const allowCount = stats.all.allowCount;
  const totalCount = stats.all.wordCount;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto p-8 md:p-10 space-y-8">
      <div className="text-center space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-green">
          Panorama do dicionário
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dados da base de {wordLength} letras
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Estatísticas reais do nosso banco de palavras para orientar filtros e acelerar sua busca.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Respostas oficiais", value: answerCount },
          { label: "Palpites aceitos", value: allowCount },
          { label: "Total analisado", value: totalCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center"
          >
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Média de vogais</h3>
          <p className="text-2xl font-bold text-primary-green">{stats.all.vowelAverage}</p>
          <p className="text-sm text-gray-600">
            Número médio de vogais por palavra nesta base.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Repetição de letras</h3>
          <p className="text-2xl font-bold text-primary-green">
            {formatPercent(stats.all.duplicateRate)}
          </p>
          <p className="text-sm text-gray-600">
            Proporção de palavras com alguma letra duplicada.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Vogais mais usadas</h3>
          <p className="text-2xl font-bold text-primary-green">
            {stats.all.topLetters
              .filter((item) => ["A", "E", "I", "O", "U"].includes(item.letter))
              .slice(0, 3)
              .map((item) => item.letter)
              .join(" ")}
          </p>
          <p className="text-sm text-gray-600">
            Use-as cedo para reduzir opções rapidamente.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Letras mais frequentes</h3>
          <div className="flex flex-wrap gap-2">
            {stats.all.topLetters.map((item) => (
              <span
                key={item.letter}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {item.letter} ({formatPercent(item.share)})
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Finalizações comuns</h3>
          <p className="text-sm text-gray-600">
            As terminações mais frequentes ajudam a travar o fim da palavra.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {stats.all.commonEndings2.map((item) => (
                <span
                  key={item.ending}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {item.ending} ({formatPercent(item.share)})
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.all.commonEndings3.map((item) => (
                <span
                  key={item.ending}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {item.ending} ({formatPercent(item.share)})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
