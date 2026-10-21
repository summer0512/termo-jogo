import { NextResponse } from "next/server";
import { SUPPORTED_WORD_LENGTHS, type SupportedWordLength } from "@/lib/wordLengths";
import { getLengthStats } from "@/lib/length-stats";

const SUPPORTED_SET = new Set<SupportedWordLength>(SUPPORTED_WORD_LENGTHS);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const rawLength = segments.pop() || segments.pop();
  const numericLength = Number(rawLength);

  if (!Number.isInteger(numericLength) || !SUPPORTED_SET.has(numericLength as SupportedWordLength)) {
    return NextResponse.json({ error: "Comprimento não suportado" }, { status: 404 });
  }

  const stats = getLengthStats(numericLength as SupportedWordLength);
  const updatedAt = process.env.NEXT_PUBLIC_WORDSET_UPDATED_AT ?? "2026-02-18";

  return NextResponse.json({
    length: numericLength,
    updatedAt,
    source: {
      name: "Wiktionary",
      url: "https://www.wiktionary.org/",
      notes:
        "Vocabulário derivado dos dumps públicos do Wiktionary e normalizado com scripts próprios do termo-jogo.com",
    },
    data: stats,
  });
}
