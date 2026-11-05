# Robô Programável

Jogo de lógica para navegador: o visitante monta um programa com blocos (Andar, Virar à esquerda, Virar à direita, Repetir) e leva o robô até a bandeira. Ensina sequência, repetição e otimização sem precisar digitar código.

## Como jogar
Abra o `index.html` no navegador. Digite um nome com pelo menos 3 caracteres e clique em **Jogar**.

- Toque nos blocos para adicioná-los ao programa (no computador também dá para arrastar e reordenar).
- Ao adicionar um **Repetir**, os próximos blocos entram dentro dele. Toque no Repetir para sair. Toque no número (3×) para mudar as vezes, de 2 a 9.
- **▶ Executar** anima o robô passo a passo e destaca o bloco que está rodando.
- Estrelas por fase: ⭐⭐⭐ (300 pts) usando até a meta de blocos, ⭐⭐ (200) até 2 a mais, ⭐ (100) acima disso.
- **</> Ver código** mostra o programa equivalente em JavaScript.
- O jogador tem **4 vidas** para o jogo todo. Bater na parede ou terminar o programa longe da bandeira custa uma vida. Com 4 erros, é game over e a pontuação vai para o ranking.
- São 9 fases por partida, sorteadas de um banco de 30: 3 fáceis (fases 1 a 3), 3 médias (4 a 6) e 3 difíceis (7 a 9). Cada partida é diferente. O ranking com os 10 melhores fica salvo no navegador (localStorage).

## Estrutura
```
robo programavel/
├── index.html      # telas (início, jogo, fim, ranking)
├── css/
│   └── style.css   # visual
└── js/
    ├── fases.js    # banco de 30 fases (10 por faixa)
    └── jogo.js     # editor de blocos, execução, pontuação, ranking
```

## Como criar uma fase
Edite `js/fases.js` e acrescente um objeto na faixa desejada (`facil`, `medio` ou `dificil`):

```js
{
  nome: "Minha fase", dica: "Texto de ajuda",
  direcao: "leste", par: 4, maxBlocos: null,
  mapa: [
    "#######",
    "#R...F#",
    "#######"
  ]
}
```
`#` parede, `.` chão, `R` robô, `F` bandeira. O caminho deve ser único, sem atalhos. `par` é o número de blocos da melhor solução e `maxBlocos` limita quantos blocos podem ser usados (`null` = sem limite).
