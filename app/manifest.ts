import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Termo Jogo",
    short_name: "Termo",
    description: "Jogue Termo, desafios personalizados e outros jogos de palavras em português.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7eb",
    theme_color: "#3c9f45",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  };
}
