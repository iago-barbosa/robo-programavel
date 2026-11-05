// Fases do Robô Programável.
// A cada partida o jogo sorteia 3 fases de cada faixa: fácil (fases 1 a 3),
// médio (fases 4 a 6) e difícil (fases 7 a 9).
//
// Mapa: "#" = parede, "." = chão, "R" = robô, "F" = bandeira.
// direcao: para onde o robô começa olhando ("norte", "leste", "sul", "oeste").
// par: quantidade de blocos da melhor solução (vale 3 estrelas).
// maxBlocos: limite de blocos da fase (null = sem limite).
// O caminho de cada fase deve ser único (sem atalhos), para que o "par" seja confiável.

const FASES_POR_FAIXA = 3;

const FASES = {
  facil: [
    {
      nome: "Primeiros passos",
      dica: "Use o bloco Andar para levar o robô até a bandeira.",
      direcao: "leste", par: 2, maxBlocos: null,
      mapa: [
      "#######",
      "#R...F#",
      "#######"
      ]
    },
    {
      nome: "Fazendo a curva",
      dica: "Virar muda para onde o robô olha, sem sair do lugar.",
      direcao: "leste", par: 4, maxBlocos: null,
      mapa: [
      "######",
      "#R..##",
      "###.##",
      "###F##",
      "######"
      ]
    },
    {
      nome: "Corredor comprido",
      dica: "Só 3 blocos! Coloque um Andar dentro do Repetir e toque no número para mudar as vezes.",
      direcao: "leste", par: 2, maxBlocos: 3,
      mapa: [
      "###########",
      "#R.......F#",
      "###########"
      ]
    },
    {
      nome: "Linha reta",
      dica: "Use o bloco Andar para levar o robô até a bandeira.",
      direcao: "sul", par: 2, maxBlocos: null,
      mapa: [
      "###",
      "#R#",
      "#.#",
      "#.#",
      "#.#",
      "#F#",
      "###"
      ]
    },
    {
      nome: "Esquina",
      dica: "Virar muda para onde o robô olha, sem sair do lugar.",
      direcao: "oeste", par: 5, maxBlocos: null,
      mapa: [
      "#####",
      "#..R#",
      "#.###",
      "#.###",
      "#.###",
      "#.###",
      "#F###",
      "#####"
      ]
    },
    {
      nome: "Zigue-zague",
      dica: "Conte os passos antes de cada curva.",
      direcao: "norte", par: 7, maxBlocos: null,
      mapa: [
      "#####",
      "#F###",
      "#.###",
      "#...#",
      "###.#",
      "###.#",
      "###.#",
      "###R#",
      "#####"
      ]
    },
    {
      nome: "Desvio",
      dica: "Conte os passos antes de cada curva.",
      direcao: "sul", par: 7, maxBlocos: null,
      mapa: [
      "#####",
      "#R###",
      "#.###",
      "#.###",
      "#...#",
      "###.#",
      "###F#",
      "#####"
      ]
    },
    {
      nome: "Curva em L",
      dica: "Virar muda para onde o robô olha, sem sair do lugar.",
      direcao: "leste", par: 5, maxBlocos: null,
      mapa: [
      "########",
      "#R.....#",
      "######.#",
      "######.#",
      "######F#",
      "########"
      ]
    },
    {
      nome: "Vai e vem",
      dica: "Conte os passos antes de cada curva.",
      direcao: "leste", par: 7, maxBlocos: null,
      mapa: [
      "#########",
      "#R....###",
      "#####.###",
      "#####..F#",
      "#########"
      ]
    },
    {
      nome: "Caminho livre",
      dica: "Use o bloco Andar para levar o robô até a bandeira.",
      direcao: "leste", par: 2, maxBlocos: null,
      mapa: [
      "########",
      "#R....F#",
      "########"
      ]
    }
  ],

  medio: [
    {
      nome: "Escada",
      dica: "Os degraus se repetem. Descubra o padrão e repita.",
      direcao: "leste", par: 5, maxBlocos: 7,
      mapa: [
      "#######",
      "#R.####",
      "##..###",
      "###..##",
      "####.F#",
      "#######"
      ]
    },
    {
      nome: "Volta em U",
      dica: "Dá para usar mais de um Repetir no mesmo programa.",
      direcao: "leste", par: 7, maxBlocos: 9,
      mapa: [
      "#######",
      "#R...##",
      "####.##",
      "#F...##",
      "#######"
      ]
    },
    {
      nome: "Contornando o bloco",
      dica: "Dentro do Repetir cabe mais de um bloco.",
      direcao: "norte", par: 4, maxBlocos: 6,
      mapa: [
      "#####",
      "#...#",
      "#.#F#",
      "#R###",
      "#####"
      ]
    },
    {
      nome: "Degraus",
      dica: "Os degraus se repetem. Descubra o padrão e use o Repetir.",
      direcao: "norte", par: 7, maxBlocos: 8,
      mapa: [
      "###########",
      "#R..#######",
      "###...#####",
      "#####...###",
      "#######...#",
      "#########F#",
      "###########"
      ]
    },
    {
      nome: "Retorno",
      dica: "Dá para usar mais de um Repetir no mesmo programa.",
      direcao: "leste", par: 8, maxBlocos: 9,
      mapa: [
      "########",
      "#R.....#",
      "######.#",
      "######.#",
      "#F.....#",
      "########"
      ]
    },
    {
      nome: "Degrau duplo",
      dica: "Dentro do Repetir cabe mais de um bloco.",
      direcao: "sul", par: 7, maxBlocos: 8,
      mapa: [
      "#######",
      "#####R#",
      "#####.#",
      "###...#",
      "###.###",
      "#...###",
      "#.#####",
      "#F#####",
      "#######"
      ]
    },
    {
      nome: "Túnel",
      dica: "Corredores longos ficam curtos com o Repetir.",
      direcao: "leste", par: 5, maxBlocos: 6,
      mapa: [
      "#########",
      "#######F#",
      "#######.#",
      "#######.#",
      "#######.#",
      "#######.#",
      "#######.#",
      "#R......#",
      "#########"
      ]
    },
    {
      nome: "Escadaria",
      dica: "Os degraus se repetem. Descubra o padrão e use o Repetir.",
      direcao: "norte", par: 5, maxBlocos: 6,
      mapa: [
      "#######",
      "####.F#",
      "###..##",
      "##..###",
      "#..####",
      "#R#####",
      "#######"
      ]
    },
    {
      nome: "Rampa",
      dica: "Dentro do Repetir cabe mais de um bloco.",
      direcao: "sul", par: 7, maxBlocos: 8,
      mapa: [
      "#######",
      "#R#####",
      "#...###",
      "###.###",
      "###...#",
      "#####.#",
      "#####F#",
      "#######"
      ]
    },
    {
      nome: "Ferradura",
      dica: "Dá para usar mais de um Repetir no mesmo programa.",
      direcao: "sul", par: 5, maxBlocos: 6,
      mapa: [
      "######",
      "#R##F#",
      "#.##.#",
      "#.##.#",
      "#....#",
      "######"
      ]
    }
  ],

  dificil: [
    {
      nome: "Subindo a escada",
      dica: "Agora com só 5 blocos. Pense em um degrau completo.",
      direcao: "leste", par: 5, maxBlocos: 5,
      mapa: [
      "#######",
      "#####F#",
      "####..#",
      "###..##",
      "##..###",
      "#R.####",
      "#######"
      ]
    },
    {
      nome: "Serpente",
      dica: "Corredores longos pedem Repetir com números grandes.",
      direcao: "leste", par: 8, maxBlocos: 8,
      mapa: [
      "#########",
      "#R......#",
      "#######.#",
      "#F......#",
      "#########"
      ]
    },
    {
      nome: "Labirinto final",
      dica: "Primeiro o robô vira para um lado, depois para o outro...",
      direcao: "sul", par: 8, maxBlocos: 10,
      mapa: [
      "#######",
      "#R#...#",
      "#.#.#.#",
      "#...#F#",
      "#######"
      ]
    },
    {
      nome: "Labirinto em S",
      dica: "Ida e volta: procure o trecho que se repete inteiro.",
      direcao: "norte", par: 13, maxBlocos: 14,
      mapa: [
      "#######",
      "#...#F#",
      "#.#.#.#",
      "#.#.#.#",
      "#.#.#.#",
      "#.#.#.#",
      "#R#...#",
      "#######"
      ]
    },
    {
      nome: "Escada dupla",
      dica: "Dois padrões diferentes, dois Repetir.",
      direcao: "oeste", par: 13, maxBlocos: 14,
      mapa: [
      "###########",
      "###.....###",
      "#...###..##",
      "#F######.R#",
      "###########"
      ]
    },
    {
      nome: "Espiral",
      dica: "Cada lado fica menor. Repetir ajuda nos trechos retos.",
      direcao: "oeste", par: 12, maxBlocos: 13,
      mapa: [
      "#########",
      "#......R#",
      "#.#######",
      "#.#F..###",
      "#.###.###",
      "#.###.###",
      "#.....###",
      "#########"
      ]
    },
    {
      nome: "Escada gigante",
      dica: "Só 6 blocos! Só um degrau completo dentro do Repetir resolve tudo.",
      direcao: "norte", par: 6, maxBlocos: 6,
      mapa: [
      "#########",
      "#R.######",
      "##..#####",
      "###..####",
      "####..###",
      "#####..##",
      "######..#",
      "#######F#",
      "#########"
      ]
    },
    {
      nome: "Dois ritmos",
      dica: "Dois padrões diferentes, dois Repetir.",
      direcao: "leste", par: 13, maxBlocos: 14,
      mapa: [
      "###########",
      "###.....###",
      "##..###...#",
      "#R.######F#",
      "###########"
      ]
    },
    {
      nome: "Cobrinha",
      dica: "Ida e volta: procure o trecho que se repete inteiro.",
      direcao: "norte", par: 12, maxBlocos: 13,
      mapa: [
      "#######",
      "#...#F#",
      "#.#.#.#",
      "#.#.#.#",
      "#R#...#",
      "#######"
      ]
    },
    {
      nome: "Caracol",
      dica: "Só 11 blocos! Cada lado fica menor. Repetir ajuda nos trechos retos.",
      direcao: "leste", par: 11, maxBlocos: 11,
      mapa: [
      "########",
      "#R.....#",
      "######.#",
      "###.F#.#",
      "###.##.#",
      "###....#",
      "########"
      ]
    }
  ]
};
