// Fases do Robô Programável.
// Mapa: "#" = parede, "." = chão, "R" = robô, "F" = bandeira.
// direcao: para onde o robô começa olhando ("norte", "leste", "sul", "oeste").
// par: quantidade de blocos da melhor solução (vale 3 estrelas).
// maxBlocos: limite de blocos da fase (null = sem limite).

const FASES = [
  {
    nome: "Primeiros passos",
    dica: "Use o bloco Andar para levar o robô até a bandeira.",
    direcao: "leste", par: 4, maxBlocos: null,
    mapa: [
      "#######",
      "#R...F#",
      "#######"
    ]
  },
  {
    nome: "Fazendo a curva",
    dica: "Virar muda para onde o robô olha, sem sair do lugar.",
    direcao: "leste", par: 5, maxBlocos: null,
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
    nome: "Escada",
    dica: "Os degraus se repetem. Descubra o padrão e repita.",
    direcao: "leste", par: 6, maxBlocos: 7,
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
    direcao: "leste", par: 8, maxBlocos: 9,
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
    direcao: "norte", par: 5, maxBlocos: 6,
    mapa: [
      "#####",
      "#...#",
      "#.#F#",
      "#R###",
      "#####"
    ]
  },
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
    direcao: "sul", par: 10, maxBlocos: 10,
    mapa: [
      "#######",
      "#R#...#",
      "#.#.#.#",
      "#...#F#",
      "#######"
    ]
  }
];
