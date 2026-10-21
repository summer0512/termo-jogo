"use client";

import { useTranslations } from "next-intl";
import { Cell } from "./grid/Cell";
import { type CharStatus } from "@/lib/statuses";

type HowToPlayStep = {
    number: string;
    title: string;
    description: string;
};

type HowToPlayContent = {
    title: string;
    subtitle: string;
    steps: HowToPlayStep[];
    tipsTitle: string;
    tipsList: string[];
    stepCaptions?: string[];
};

interface HowToPlayProps {
    wordLength?: number;
    content?: HowToPlayContent;
}

type ShortStatus = "a" | "c" | "p";

type ExampleRow = {
    word: string;
    statuses: (CharStatus | ShortStatus | undefined)[];
};

// Convert short codes to full statuses (a -> absent, c -> correct, p -> present)
function shortToFullStatus(s?: CharStatus | ShortStatus | undefined): CharStatus | undefined {
    if (!s) return undefined;
    if (s === "a") return "absent";
    if (s === "c") return "correct";
    if (s === "p") return "present";
    return s as CharStatus;
}

function expandStatuses(arr: (CharStatus | ShortStatus | undefined)[]) {
    return arr.map(shortToFullStatus);
}

// Let's define a robust set for 3-11.
const DEFINED_EXAMPLES: Record<number, ExampleRow[]> = {
    3: [
        { word: "DEU", statuses: ["a", "a", "a"] },
        { word: "OLA", statuses: ["p", "a", "a"] },
        { word: "BOA", statuses: ["a", "c", "a"] },
        { word: "FOR", statuses: ["a", "c", "c"] },
        { word: "MOR", statuses: ["a", "c", "c"] },
        { word: "COR", statuses: ["c", "c", "c"] },
    ],
    4: [
        { word: "BICO", statuses: ["a", "a", "a", "p"] },
        { word: "MINA", statuses: ["a", "a", "p", "a"] },
        { word: "DITO", statuses: ["p", "a", "a", "p"] },
        { word: "FUME", statuses: ["a", "a", "a", "c"] },
        { word: "PODE", statuses: ["a", "p", "c", "c"] },
        { word: "ONDE", statuses: ["c", "c", "c", "c"] },
    ],
    5: [
        { word: "VESGO", statuses: ["a", "a", "a", "a", "a"] },
        { word: "PERDI", statuses: ["a", "a", "a", "a", "p"] },
        { word: "ÚNICO", statuses: ["a", "p", "p", "p", "a"] },
        { word: "CINCO", statuses: ["c", "c", "c", "a", "a"] },
        { word: "CINTA", statuses: ["c", "c", "c", "a", "c"] },
        { word: "CINZA", statuses: ["c", "c", "c", "c", "c"] },
    ],
    6: [
        { word: "ESCOLA", statuses: ["p", "a", "p", "a", "a", "c"] },
        { word: "MULHER", statuses: ["a", "a", "a", "a", "p", "a"] },
        { word: "DEDICA", statuses: ["a", "p", "a", "a", "c", "c"] },
        { word: "AVENCA", statuses: ["p", "a", "p", "a", "c", "c"] },
        { word: "BONECA", statuses: ["p", "a", "a", "c", "c", "c"] },
        { word: "CABECA", statuses: ["c", "c", "c", "c", "c", "c"] },
    ],
    7: [
        { word: "AFIRMOU", statuses: ["a", "a", "a", "a", "p", "p", "a"] },
        { word: "BROWSER", statuses: ["a", "a", "p", "a", "a", "p", "a"] },
        { word: "DECOLEM", statuses: ["a", "p", "a", "p", "a", "a", "p"] },
        { word: "EMPENHO", statuses: ["a", "p", "a", "c", "c", "a", "c"] },
        { word: "MOLENGO", statuses: ["c", "c", "a", "c", "c", "a", "c"] },
        { word: "MOMENTO", statuses: ["c", "c", "c", "c", "c", "c", "c"] },
    ],
    8: [
        { word: "DINHEIRO", statuses: ["p", "a", "a", "a", "a", "c", "p", "c"] },
        { word: "PROGRAMA", statuses: ["a", "p", "c", "a", "c", "a", "a", "a"] },
        { word: "SITUACAO", statuses: ["a", "p", "a", "a", "a", "p", "a", "c"] },
        { word: "OBSERVAI", statuses: ["c", "a", "a", "a", "c", "a", "a", "p"] },
        { word: "ABORRIDO", statuses: ["a", "a", "c", "c", "c", "c", "c", "c"] },
        { word: "OCORRIDO", statuses: ["c", "c", "c", "c", "c", "c", "c", "c"] },
    ],
    9: [
        { word: "CONHECIDO", statuses: ["p", "a", "p", "a", "a", "a", "c", "a", "a"] },
        { word: "TRABALHOS", statuses: ["a", "a", "p", "a", "p", "c", "a", "a", "p"] },
        { word: "FORMATURA", statuses: ["a", "a", "a", "p", "p", "a", "p", "a", "c"] },
        { word: "MANANCIAL", statuses: ["c", "c", "p", "p", "a", "p", "c", "a", "p"] },
        { word: "MUSSELINA", statuses: ["c", "p", "c", "a", "a", "c", "c", "c", "c"] },
        { word: "MASCULINA", statuses: ["c", "c", "c", "c", "c", "c", "c", "c", "c"] },
    ],
    10: [
        { word: "IMPORTANTE", statuses: ["p", "a", "a", "p", "p", "a", "p", "p", "c", "a"] },
        { word: "PRESIDENTE", statuses: ["a", "p", "a", "p", "p", "a", "a", "p", "c", "a"] },
        { word: "COMUNIDADE", statuses: ["a", "c", "a", "a", "p", "p", "a", "p", "a", "a"] },
        { word: "SENTIMENTO", statuses: ["p", "a", "p", "a", "p", "a", "a", "a", "c", "p"] },
        { word: "FORMALISTA", statuses: ["a", "c", "c", "a", "c", "c", "c", "c", "c", "c"] },
        { word: "JORNALISTA", statuses: ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c"] },
    ],
    11: [
        { word: "ORGANIZACAO", statuses: ["p", "p", "a", "a", "p", "p", "a", "a", "a", "a", "a"] },
        { word: "EXPERIENCIA", statuses: ["p", "a", "p", "c", "c", "p", "a", "p", "a", "a", "a"] },
        { word: "DIFICULDADE", statuses: ["a", "p", "a", "a", "a", "a", "a", "a", "a", "a", "p"] },
        { word: "INSTRUMENTO", statuses: ["c", "c", "a", "p", "c", "a", "p", "p", "a", "a", "p"] },
        { word: "INTERROMPEI", statuses: ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "a"] },
        { word: "INTERROMPER", statuses: ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c"] },
    ]
};

// Helper to fill missing steps if we don't have enough rows for the tutorial visual
// The tutorial has 4 steps (0, 1, 2, 3).
// Step 0: Show 1st row.
// Step 1: Show some intermediate state.
// Step 2: Show near completion.
// Step 3: Show completion.
function getTutorialRows(length: number, stepIndex: number): ExampleRow[] {
    let examples = DEFINED_EXAMPLES[length];

    // If no specific example, generate a generic one
    if (!examples) {
        const word = "A".repeat(length);
        examples = [
            { word: word, statuses: Array(length).fill("absent") as CharStatus[] },
            { word: word, statuses: Array(length).fill("present") as CharStatus[] },
            { word: word, statuses: Array(length).fill("correct") as CharStatus[] },
        ];
    }

    // For 5 letters, we have a full 6-row game.
    // For others, we might have fewer.
    // We need to map "Step Index" (0..3) to "How many rows to show".

    const totalRows = examples.length;

    if (stepIndex === 0) {
        // First attempt: Show just the first row, no status (or neutral?)
        // The original code showed "VESGO" with neutral cells in step 0?
        // Looking at original code:
        // i===0: <Cell value="V" /> (no status prop, so neutral)
        // So for step 0, we take the first word and strip statuses.
        return [{ word: examples[0].word, statuses: Array(length).fill(undefined) as any }];
    }

    if (stepIndex === 3) {
        // Final step: Show all rows including the winning one.
        return examples;
    }

    // Intermediate steps (1 and 2)
    // We want to show a progression.
    // If we have many rows (like 5-letter), we can show partials.
    // If we have few rows (like 2), we just show what we have.

    if (totalRows <= 2) {
        // If short game, just show what we have up to the last one (exclusive of win?)
        // Or just show the first row with status.
        return examples.slice(0, 1);
    }

    // For longer games:
    // Step 1: Show ~50%
    // Step 2: Show ~80%
    const count = Math.ceil(totalRows * (stepIndex / 3));
    return examples.slice(0, count);
}


export function HowToPlay({ wordLength = 5, content }: HowToPlayProps) {
    const t = useTranslations("HomePage");
    const fallback: HowToPlayContent = {
        title: t("howToPlay.title"),
        subtitle: t("howToPlay.subtitle"),
        steps: Array.from({ length: 4 }, (_, i) => ({
            number: t(`howToPlay.steps.${i}.number`),
            title: t(`howToPlay.steps.${i}.title`),
            description: t(`howToPlay.steps.${i}.description`),
        })),
        tipsTitle: t("howToPlay.tips.title"),
        tipsList: Array.from({ length: 4 }, (_, i) => t(`howToPlay.tips.list.${i}`)),
        stepCaptions: [
            "Primeira tentativa",
            "Analisando as pistas",
            "Eliminando possibilidades",
            "Palavra encontrada!",
        ],
    };
    const finalContent = content?.steps?.length
        ? {
            ...fallback,
            ...content,
            steps: content.steps,
            tipsList: content.tipsList?.length ? content.tipsList : fallback.tipsList,
            stepCaptions: content.stepCaptions ?? fallback.stepCaptions,
        }
        : fallback;

    return (
        <section className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {finalContent.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {finalContent.subtitle}
                </p>
            </div>

            <div className="relative mb-10">
                <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className="relative bg-white py-6 rounded-xl shadow-sm border border-gray-100"
                        >
                            {/* Progress dot */}
                            <div className="items-center text-center mb-3">
                                <div className="mx-auto w-10 h-10 bg-primary-green text-white rounded-full flex items-center justify-center font-bold text-lg z-10 relative">
                                    {finalContent.steps[i]?.number ?? String(i + 1)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pl-8 ml-auto text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {finalContent.steps[i]?.title}
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-4">
                                    {i === 1
                                        ? (finalContent.steps[i]?.description ?? "")
                                            .split(" | ")
                                            .join("\n")
                                        : finalContent.steps[i]?.description}
                                </p>

                                {/* Example Cell display */}
                                <div className="flex justify-center">
                                    <div className="space-y-2">
                                        <div className="flex flex-col space-y-1">
                                            {getTutorialRows(wordLength, i).map((row, rowIndex) => {
                                                const statuses = expandStatuses(row.statuses);
                                                return (
                                                    <div key={rowIndex} className="flex justify-center">
                                                        {row.word.split("").map((letter, letterIndex) => (
                                                            <Cell
                                                                key={letterIndex}
                                                                value={letter}
                                                                status={statuses[letterIndex]}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-sm text-gray-600 text-center">
                                            {finalContent.stepCaptions?.[i]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r bg-yellow-50 rounded-xl p-6 border border-yellow-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {finalContent.tipsTitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg"
                        >
                            <span className="text-yellow-600 font-bold text-lg">💡</span>
                            <span className="text-gray-700 text-sm leading-relaxed">
                                {finalContent.tipsList[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
