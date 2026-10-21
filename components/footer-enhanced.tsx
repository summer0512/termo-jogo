'use client';

import Link from 'next/link';

export default function FooterEnhanced() {
  return (
    <>
      {/* Main Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 flex">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Termo</h3>
              <p className="text-gray-300 text-sm mb-4">
                O jogo de palavras mais popular em português. Jogue termo de hoje e termo infinito grátis!
              </p>
              <p className="text-gray-400 text-xs">
                termo-jogo.com © 2025
              </p>
            </div>

            {/* Game Modes */}
            <div>
              <h4 className="font-semibold mb-4">Modos de Jogo</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Termo de Hoje
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Termo Infinito
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Desafios Personalizados
                  </Link>
                </li>
              </ul>
            </div>

            {/* Guides & Tips */}
            <div>
              <h4 className="font-semibold mb-4">Guias e Dicas</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/estrategias-termo" className="text-gray-300 hover:text-white transition-colors">
                    Estratégias para Ganhar
                  </Link>
                </li>
                <li>
                  <Link href="/termo-de-hoje-dicas" className="text-gray-300 hover:text-white transition-colors">
                    Dicas do Termo de Hoje
                  </Link>
                </li>
                <li>
                  <Link href="/termo-vs-wordle" className="text-gray-300 hover:text-white transition-colors">
                    Termo vs Wordle
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="mailto:contato@termo-jogo.com?subject=Termo" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              Termo - O melhor jogo de palavras em português brasileiro | 
              <span className="ml-2">
                <Link href="/" className="text-blue-400 hover:text-blue-300">
                  Jogue Agora
                </Link>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
