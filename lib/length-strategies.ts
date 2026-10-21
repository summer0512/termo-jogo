import type { SupportedWordLength } from "@/lib/wordLengths";

export type StrategySection = {
  title: string;
  bullets: string[];
};

export type StrategyExample = {
  title: string;
  steps: string[];
};

export type LengthStrategy = {
  length: SupportedWordLength;
  intro: string;
  opening: StrategySection;
  midgame: StrategySection;
  endgame: StrategySection;
  pitfalls: StrategySection;
  example: StrategyExample;
};

export const LENGTH_STRATEGIES: Record<SupportedWordLength, LengthStrategy> = {
  3: {
    length: 3,
    intro:
      "No Termo de 3 letras, cada palpite revela muito, mas também cria rapidamente grupos de palavras parecidas. O segredo é eliminar o máximo de letras em 1 ou 2 jogadas.",
    opening: {
      title: "Abertura rápida",
      bullets: [
        "Use uma palavra com 2 vogais diferentes para mapear o núcleo da palavra.",
        "Prefira combinações simples (CVV ou CVC) para reduzir o leque de possibilidades.",
        "Se a primeira tentativa vier quase toda cinza, troque o conjunto de letras por completo.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Com 1 letra confirmada, teste posições alternativas imediatamente.",
        "Evite repetir letras cedo; o objetivo é descobrir a estrutura.",
        "Foque nas terminações curtas mais comuns e elimine variações próximas.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Se restarem 2 opções, escolha a que testa a letra menos provável primeiro.",
        "Em 3 letras, um palpite de cobertura costuma ser mais eficiente que o palpite óbvio.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Palavras curtíssimas geram muitas opções com apenas 1 letra diferente.",
        "Repetição de letra pode ocorrer, mas é menos comum: use só quando a evidência for forte.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: cobre 2 vogais e 1 consoante frequente.",
        "Palpite 2: reposiciona a vogal amarela e testa outra consoante forte.",
        "Palpite 3: decide entre as últimas 2 combinações possíveis.",
      ],
    },
  },
  4: {
    length: 4,
    intro:
      "No Termo de 4 letras, o jogo exige equilíbrio: é curto o suficiente para abrir rápido, mas longo o bastante para criar dúvidas de posição.",
    opening: {
      title: "Abertura eficiente",
      bullets: [
        "Comece com 2 vogais e 2 consoantes de alta frequência.",
        "Priorize palavras sem letras repetidas para maximizar informação.",
        "Se vier uma letra verde, fixe-a imediatamente no próximo palpite.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Use um palpite de cobertura para eliminar 3 letras de uma vez, se ainda houver muitas opções.",
        "Quando tiver 2 letras certas, teste posições restantes antes de chutar a solução.",
        "Observe padrões de terminações curtas e verbos no infinitivo reduzido.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Com 3 letras confirmadas, resolva a posição final sem repetir letras descartadas.",
        "Se houver empate, escolha o palpite que testa a letra menos comum.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Falsos cognatos curtos aparecem bastante: confirme a letra, não o sentimento.",
        "Letras duplicadas são mais prováveis que em 3 letras, mas ainda não são regra.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: abre com 2 vogais e 2 consoantes comuns.",
        "Palpite 2: usa as pistas para testar posições e eliminar um novo bloco de letras.",
        "Palpite 3: confirma a combinação final com foco na última posição.",
      ],
    },
  },
  5: {
    length: 5,
    intro:
      "O Termo de 5 letras é o equilíbrio clássico entre informação e risco. Aqui vale a estratégia de cobertura + ajuste rápido.",
    opening: {
      title: "Abertura clássica",
      bullets: [
        "Use uma palavra com 3 consoantes fortes e 2 vogais diferentes.",
        "Evite repetir letras no primeiro palpite para maximizar pistas.",
        "Se tiver uma verde, prenda a posição e reorganize o resto.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Com 2 letras certas, faça um palpite que teste as outras 3 posições.",
        "Se houver muitas opções, priorize letras que aparecem em várias palavras do PT-BR.",
        "Use o teclado colorido para evitar repetições sem valor.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Quando restarem 2 soluções, escolha a que testa uma letra ainda não confirmada.",
        "Em 5 letras, um palpite de cobertura pode salvar uma tentativa final.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Palavras com acento parecem diferentes, mas contam como a mesma letra.",
        "Duplicidade de letra é comum em português, não descarte cedo demais.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: maximiza cobertura de vogais e consoantes frequentes.",
        "Palpite 2: fixa as verdes e reposiciona as amarelas.",
        "Palpite 3: testa a estrutura final com foco nas duas últimas letras.",
      ],
    },
  },
  6: {
    length: 6,
    intro:
      "No Termo de 6 letras, o espaço aumenta e o jogo exige disciplina: mais letras, mais combinações, mais chance de repetição.",
    opening: {
      title: "Abertura estratégica",
      bullets: [
        "Combine 3 vogais e 3 consoantes fortes para abrir o mapa.",
        "Prefira palavras sem repetição para maximizar informação inicial.",
        "Se aparecerem duas amarelas, reposicione logo no segundo palpite.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "A partir de 6 letras, padrões de sufixo começam a pesar (ex.: -AR, -ER, -OS).",
        "Use uma jogada de cobertura se ainda houver 10+ possibilidades.",
        "Quando tiver 3 letras corretas, mude para palpites de encaixe.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Com a estrutura quase pronta, avalie se falta testar letra repetida.",
        "Se faltar só 1 posição, escolha a letra que melhor combina com o sufixo.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Duplicidade de vogais é mais comum; não ignore sinais de repetição.",
        "Palavras longas podem esconder letras pouco frequentes no meio.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: cobre 6 letras distintas com vogais fortes.",
        "Palpite 2: fixa verdes, reposiciona amarelas e corta letras cinza.",
        "Palpite 3: usa sufixo provável para fechar o padrão.",
      ],
    },
  },
  7: {
    length: 7,
    intro:
      "No Termo de 7 letras, o jogo começa a parecer um quebra-cabeça maior. O sucesso vem de segmentar a palavra.",
    opening: {
      title: "Abertura orientada",
      bullets: [
        "Escolha uma palavra com 3 vogais e 4 consoantes frequentes.",
        "Evite repetir letra até ter pista clara.",
        "Observe cedo se a palavra tende a terminar com sufixo verbal.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Trate a palavra como blocos: começo, meio, fim.",
        "Quando tiver 3 letras certas, teste a ordem das outras sem mudar as confirmadas.",
        "Se o meio estiver vazio, foque em combinações de 2 letras comuns.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Use o histórico de tentativas para checar letras repetidas.",
        "Escolha a solução que melhor encaixa no sufixo mais comum.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Muitas palavras de 7 letras compartilham prefixos; não se apaixone por um.",
        "Tente não desperdiçar tentativa com palavra muito próxima da anterior.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: cobre 7 letras distintas e 3 vogais.",
        "Palpite 2: decide o bloco inicial e testa o sufixo mais provável.",
        "Palpite 3: ajusta o miolo com base nas letras amarelas restantes.",
      ],
    },
  },
  8: {
    length: 8,
    intro:
      "No Termo de 8 letras, as palavras costumam ter estrutura clara. Ler os padrões de final e início acelera muito.",
    opening: {
      title: "Abertura com cobertura",
      bullets: [
        "Use 3 vogais + 5 consoantes fortes e distintas.",
        "Prefira palavras com alternância de vogal/consoante para mapear posições.",
        "Se vierem duas amarelas, priorize reposição já no segundo palpite.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Procure padrões de final (ex.: -MENTO, -ACAO, -ADO) quando fizer sentido.",
        "Se tiver 4 letras certas, comece a testar o encaixe sem trocar tudo.",
        "Não ignore letras raras; em 8 letras, elas aparecem com mais frequência relativa.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Confirme repetição de letras se o padrão parecer incompleto.",
        "Na dúvida entre duas soluções, escolha a que testa letra ainda não vista.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Sufixos longos podem enganar; confirme o começo antes de fixar o fim.",
        "Evite ficar preso em um único padrão de vogal/consoante.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: maximiza cobertura com 8 letras distintas.",
        "Palpite 2: fecha o bloco final se houver pistas fortes.",
        "Palpite 3: ajusta o miolo e decide entre 2 possibilidades.",
      ],
    },
  },
  9: {
    length: 9,
    intro:
      "No Termo de 9 letras, a estratégia mais eficiente é dividir a palavra em sílabas e padrões de terminação.",
    opening: {
      title: "Abertura consciente",
      bullets: [
        "Use palavras com alta diversidade de letras e 3 vogais.",
        "Evite repetições na abertura; cada letra nova vale muito.",
        "Se aparecer um par de letras consecutivas, experimente mantê-las juntas.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Teste padrões de sufixo e prefixo sem comprometer o miolo.",
        "Quando tiver 4 letras certas, use um palpite de encaixe parcial.",
        "Se houver muitas amarelas, reorganize primeiro, depois refine.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Analise se falta duplicidade de vogal ou consoante.",
        "Se restarem 2 opções, teste a que cobre letras ainda não vistas.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Palavras longas geram falsas certezas: valide antes de travar o sufixo.",
        "Não subestime letras menos frequentes no meio da palavra.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: cobertura ampla e sem repetição.",
        "Palpite 2: fixa prefixo/sufixo mais provável.",
        "Palpite 3: ajusta o centro com base nas amarelas restantes.",
      ],
    },
  },
  10: {
    length: 10,
    intro:
      "No Termo de 10 letras, a palavra já tem estrutura bem definida. A chave é reconhecer padrões morfológicos.",
    opening: {
      title: "Abertura estruturada",
      bullets: [
        "Escolha palavra longa com diversidade máxima de letras.",
        "Inclua 3 vogais e consoantes comuns para mapear o esqueleto.",
        "Se houver verde logo cedo, segure a posição e trabalhe o resto.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Busque terminações típicas (-MENTE, -ACAO, -AMENTO) quando fizer sentido.",
        "A partir de 5 letras certas, faça palpites de encaixe parcial.",
        "Use uma jogada de cobertura só se ainda houver muitas opções.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Verifique se falta uma letra repetida.",
        "Escolha a opção que respeita o padrão morfológico mais consistente.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Terminações longas parecidas confundem: confirme as letras centrais.",
        "Evite repetir tentativa com palavras que só mudam 1 letra.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: alta cobertura com 10 letras distintas.",
        "Palpite 2: fixa o bloco final ou inicial com base nas pistas.",
        "Palpite 3: ajusta letras centrais e decide a solução.",
      ],
    },
  },
  11: {
    length: 11,
    intro:
      "No Termo de 11 letras, o jogo vira quase uma análise de padrões. O foco é estruturar a palavra em partes grandes.",
    opening: {
      title: "Abertura com amplitude",
      bullets: [
        "Priorize palavras com 3 ou 4 vogais e consoantes variadas.",
        "Não repita letras na primeira tentativa, a informação é valiosa.",
        "Observe cedo se há indícios de sufixo longo.",
      ],
    },
    midgame: {
      title: "Meio do jogo",
      bullets: [
        "Trabalhe com prefixo + sufixo, deixando o miolo para ajustes.",
        "Com 5 letras certas, faça tentativas de encaixe progressivo.",
        "Reorganize letras amarelas antes de inventar novas.",
      ],
    },
    endgame: {
      title: "Fechamento",
      bullets: [
        "Checar repetição de letras é obrigatório nesse tamanho.",
        "Use o histórico para evitar palavras com letras já descartadas.",
      ],
    },
    pitfalls: {
      title: "Armadilhas do tamanho",
      bullets: [
        "Palavras longas criam sensação de certeza precoce: valide posições.",
        "Sufixos longos podem mascarar erros no início.",
      ],
    },
    example: {
      title: "Mini-roteiro de raciocínio",
      steps: [
        "Palpite 1: cobertura máxima e 3 vogais garantidas.",
        "Palpite 2: define o sufixo provável.",
        "Palpite 3: ajusta o miolo e resolve o encaixe final.",
      ],
    },
  },
};
