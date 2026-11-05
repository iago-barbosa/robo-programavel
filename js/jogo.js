// Lógica do Robô Programável. As fases ficam em js/fases.js.

const MIN_NOME = 3, RANK_KEY = "robo-programavel-ranking", RANK_TAM = 10;
const VELOCIDADE = 450;           // ms por comando
const VEZES_MIN = 2, VEZES_MAX = 9;
const DIRECOES = { norte:0, leste:1, sul:2, oeste:3 };
const PASSO = [[-1,0],[0,1],[1,0],[0,-1]]; // [linha, coluna] para N, L, S, O
const TIPOS = {
  andar:    { icone:"⬆️", texto:"Andar" },
  esquerda: { icone:"↩️", texto:"Virar à esquerda" },
  direita:  { icone:"↪️", texto:"Virar à direita" },
  repetir:  { icone:"🔁", texto:"Repetir" }
};

// ---------- Utilidades ----------
const $ = id => document.getElementById(id);
const telas = ["inicio","jogo","fim","ranking"];
const mostrar = id => telas.forEach(t => $(t).classList.toggle("hidden", t !== id));
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const espera = ms => new Promise(r => setTimeout(r, ms));
let proximoId = 1;

// ---------- Estado ----------
let J = null;      // jogo atual
let robo = null;   // posição do robô durante a execução

// ---------- Nome ----------
function nomeOk(){ return $("nome").value.trim().length >= MIN_NOME; }
function validarNome(){
  const ok = nomeOk();
  $("jogar").disabled = !ok;
  $("nomeHint").className = "hint" + (ok ? " ok" : "");
  $("nomeHint").textContent = ok ? "Tudo certo, pode jogar!" : `Digite pelo menos ${MIN_NOME} caracteres.`;
}

// ---------- Ranking ----------
function lerRanking(){ try { return JSON.parse(localStorage.getItem(RANK_KEY)) || []; } catch { return []; } }
function salvarRanking(r){ try { localStorage.setItem(RANK_KEY, JSON.stringify(r)); } catch {} }
function adicionarRanking(e){
  const r = lerRanking(); r.push(e);
  r.sort((a,b) => b.pontos - a.pontos || b.estrelas - a.estrelas || a.data - b.data);
  const top = r.slice(0, RANK_TAM); salvarRanking(top);
  return top.indexOf(e);
}
function desenharRanking(destaque){
  const r = lerRanking();
  if (!r.length){ $("rankingCorpo").innerHTML = '<p class="vazio">Ninguém jogou ainda. Seja o primeiro!</p>'; return; }
  $("rankingCorpo").innerHTML = '<table><thead><tr><th>#</th><th>Nome</th><th class="n">Fases</th><th class="n">⭐</th><th class="n">Pontos</th></tr></thead><tbody>' +
    r.map((e,i) => `<tr class="${e.data===destaque?'eu':''}"><td>${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td><td>${esc(e.nome)}</td><td class="n">${e.fases}</td><td class="n">${e.estrelas}</td><td class="n">${e.pontos}</td></tr>`).join("") +
    '</tbody></table>';
}

// ---------- Jogo ----------
function novoJogo(){
  if (!nomeOk()){ validarNome(); $("nome").focus(); return; }
  const nome = $("nome").value.trim();
  try { localStorage.setItem(RANK_KEY + "-nome", nome); } catch {}
  J = { nome, fase:0, pontos:0, estrelas:0, concluidas:0, programa:[], alvo:null, rodando:false };
  mostrar("jogo");
  carregarFase();
}

function faseAtual(){ return FASES[J.fase]; }

function carregarFase(){
  const f = faseAtual();
  J.programa = []; J.alvo = null; J.rodando = false;
  $("faseNum").textContent = J.fase + 1;
  $("faseNome").textContent = f.nome;
  $("dica").textContent = "💡 " + f.dica;
  $("par").textContent = f.par + " blocos";
  $("pontos").textContent = J.pontos;
  desenharTabuleiro();
  desenharPrograma();
  mensagem("");
}

// ---------- Tabuleiro ----------
function desenharTabuleiro(){
  const f = faseAtual(), tab = $("tabuleiro");
  tab.style.setProperty("--cols", f.mapa[0].length);
  tab.querySelectorAll(".celula").forEach(c => c.remove());
  f.mapa.forEach((linha, l) => [...linha].forEach((ch, c) => {
    const d = document.createElement("div");
    d.className = "celula" + (ch === "#" ? " parede" : "");
    d.id = `c-${l}-${c}`;
    if (ch === "F") d.textContent = "🏁";
    if (ch === "R") robo = { l, c, dir: DIRECOES[f.direcao], giro: DIRECOES[f.direcao] * 90 };
    tab.appendChild(d);
  }));
  $("robo").className = "robo";
  posicionarRobo(false);
}
function inicioRobo(){
  const f = faseAtual();
  for (let l = 0; l < f.mapa.length; l++){
    const c = f.mapa[l].indexOf("R");
    if (c >= 0) return { l, c, dir: DIRECOES[f.direcao], giro: DIRECOES[f.direcao] * 90 };
  }
}
function posicionarRobo(animar = true, l = robo.l, c = robo.c){
  const cel = $(`c-${l}-${c}`), r = $("robo");
  if (!cel) return;
  r.style.transition = animar ? "" : "none";
  r.style.left = cel.offsetLeft + "px"; r.style.top = cel.offsetTop + "px";
  r.style.width = cel.offsetWidth + "px"; r.style.height = cel.offsetHeight + "px";
  r.querySelector(".seta").style.transform = `rotate(${robo.giro}deg)`;
  if (!animar) { void r.offsetWidth; r.style.transition = ""; }
}
function celula(l, c){ const m = faseAtual().mapa; return (m[l] && m[l][c]) || "#"; }
function limparRastro(){ document.querySelectorAll(".celula.rastro").forEach(c => c.classList.remove("rastro")); }

// ---------- Programa (árvore de blocos) ----------
function contarBlocos(lista = J.programa){
  return lista.reduce((n, b) => n + 1 + (b.filhos ? contarBlocos(b.filhos) : 0), 0);
}
function acharBloco(id, lista = J.programa, pai = null){
  for (let i = 0; i < lista.length; i++){
    const b = lista[i];
    if (b.id === id) return { bloco:b, lista, indice:i, pai };
    if (b.filhos){ const r = acharBloco(id, b.filhos, b); if (r) return r; }
  }
  return null;
}
function listaDe(paiId){ return paiId ? acharBloco(paiId).bloco.filhos : J.programa; }

function cheio(){ const m = faseAtual().maxBlocos; return m && contarBlocos() >= m; }

function adicionarBloco(tipo, paiId = J.alvo, indice = null){
  if (J.rodando) return;
  if (cheio()){ mensagem(`Limite de ${faseAtual().maxBlocos} blocos nesta fase. Tente usar o Repetir!`, "bad"); return; }
  if (tipo === "repetir" && paiId){ paiId = null; } // repetir não vai dentro de repetir
  const bloco = { id: proximoId++, tipo };
  if (tipo === "repetir"){ bloco.vezes = 3; bloco.filhos = []; }
  const lista = listaDe(paiId);
  lista.splice(indice ?? lista.length, 0, bloco);
  if (tipo === "repetir") J.alvo = bloco.id; // os próximos blocos entram no repetir
  mensagem("");
  desenharPrograma();
}
function moverBloco(id, paiId, indice){
  const origem = acharBloco(id);
  if (!origem || (origem.bloco.tipo === "repetir" && paiId)) return;
  origem.lista.splice(origem.indice, 1);
  const lista = listaDe(paiId);
  if (lista === origem.lista && indice > origem.indice) indice--;
  lista.splice(Math.min(indice, lista.length), 0, origem.bloco);
  desenharPrograma();
}
function removerBloco(id){
  const r = acharBloco(id); if (!r) return;
  r.lista.splice(r.indice, 1);
  if (J.alvo === id) J.alvo = null;
  desenharPrograma();
}

function desenharPrograma(){
  const montar = (lista, ul) => {
    ul.innerHTML = "";
    lista.forEach(b => {
      const li = document.createElement("li");
      li.className = `item ${b.tipo}`; li.id = "b-" + b.id; li.draggable = true; li.dataset.id = b.id;
      const t = TIPOS[b.tipo];
      li.innerHTML = `<div class="linha"><span>${t.icone}</span><span class="txt">${t.texto}</span>` +
        (b.tipo === "repetir" ? `<button class="vezes" title="Mudar quantidade">${b.vezes}×</button>` : "") +
        `<button class="x" title="Remover">✕</button></div>`;
      li.querySelector(".x").onclick = e => { e.stopPropagation(); if (!J.rodando) removerBloco(b.id); };
      if (b.tipo === "repetir"){
        li.querySelector(".vezes").onclick = e => {
          e.stopPropagation(); if (J.rodando) return;
          b.vezes = b.vezes >= VEZES_MAX ? VEZES_MIN : b.vezes + 1; desenharPrograma();
        };
        const dentro = document.createElement("ul");
        dentro.className = "lista dentro" + (J.alvo === b.id ? " alvo" : "");
        dentro.dataset.pai = b.id;
        montar(b.filhos, dentro);
        li.appendChild(dentro);
        li.onclick = e => { e.stopPropagation(); J.alvo = J.alvo === b.id ? null : b.id; desenharPrograma(); };
      } else {
        li.onclick = e => e.stopPropagation();
      }
      ul.appendChild(li);
    });
  };
  montar(J.programa, $("programa"));
  $("programa").classList.toggle("alvo", !J.alvo);
  const n = contarBlocos(), max = faseAtual().maxBlocos;
  $("contador").textContent = n;
  $("limite").textContent = max ? ` / ${max}` : "";
  document.querySelector(".info-blocos").classList.toggle("cheio", !!max && n >= max);
  $("alvoHint").textContent = J.alvo ? "Os próximos blocos vão para dentro do Repetir. Toque nele de novo para sair." : "";
  $("codigo").textContent = gerarCodigo();
}

// ---------- Arrastar e soltar ----------
function ligarArrastar(){
  document.addEventListener("dragstart", e => {
    const p = e.target.closest?.(".bloco-paleta"), it = e.target.closest?.(".item");
    if (J?.rodando) { e.preventDefault(); return; }
    if (p) e.dataTransfer.setData("text/plain", "novo:" + p.dataset.tipo);
    else if (it){ e.dataTransfer.setData("text/plain", "mover:" + it.dataset.id); it.classList.add("arrastando"); e.stopPropagation(); }
  });
  document.addEventListener("dragend", () => document.querySelectorAll(".arrastando,.sobre").forEach(x => x.classList.remove("arrastando","sobre")));
  const lista = e => e.target.closest?.(".lista");
  document.addEventListener("dragover", e => {
    const ul = lista(e); if (!ul) return;
    e.preventDefault();
    document.querySelectorAll(".sobre").forEach(x => x !== ul && x.classList.remove("sobre"));
    ul.classList.add("sobre");
  });
  document.addEventListener("drop", e => {
    const ul = lista(e); if (!ul) return;
    e.preventDefault(); ul.classList.remove("sobre");
    const [acao, valor] = e.dataTransfer.getData("text/plain").split(":");
    const paiId = ul.dataset.pai ? Number(ul.dataset.pai) : null;
    // posição: antes do primeiro item cujo meio está abaixo do ponteiro
    const itens = [...ul.children];
    let indice = itens.findIndex(li => { const r = li.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    if (indice < 0) indice = itens.length;
    if (acao === "novo") adicionarBloco(valor, paiId, indice);
    if (acao === "mover"){
      const id = Number(valor);
      if (paiId === id) return; // não soltar o repetir dentro dele mesmo
      moverBloco(id, paiId, indice);
    }
  });
}

// ---------- Código equivalente ----------
function gerarCodigo(){
  const linha = (b, ind) => {
    const p = "  ".repeat(ind);
    if (b.tipo === "andar") return p + "robo.andar();";
    if (b.tipo === "esquerda") return p + "robo.virarEsquerda();";
    if (b.tipo === "direita") return p + "robo.virarDireita();";
    const dentro = b.filhos.map(f => linha(f, ind + 1)).join("\n");
    return `${p}for (let i = 0; i < ${b.vezes}; i++) {\n${dentro || p + "  // vazio"}\n${p}}`;
  };
  return J.programa.length ? J.programa.map(b => linha(b, 0)).join("\n") : "// Monte seu programa com os blocos";
}

// ---------- Execução ----------
function achatar(lista){
  const passos = [];
  lista.forEach(b => {
    if (b.tipo === "repetir"){
      for (let i = 0; i < b.vezes; i++) b.filhos.forEach(f => passos.push({ tipo:f.tipo, ids:[b.id, f.id] }));
    } else passos.push({ tipo:b.tipo, ids:[b.id] });
  });
  return passos;
}

function mensagem(txt, tipo = ""){ $("msg").textContent = txt; $("msg").className = "msg " + tipo; }

function travar(sim){
  J.rodando = sim;
  $("executar").textContent = sim ? "■ Parar" : "▶ Executar";
  ["limpar","pular","encerrar"].forEach(id => $(id).disabled = sim);
  $("paleta").querySelectorAll("button").forEach(b => b.disabled = sim);
}

async function executar(){
  if (J.rodando){ J.parar = true; return; }
  const passos = achatar(J.programa);
  if (!passos.length){ mensagem("Adicione blocos ao programa primeiro.", "bad"); return; }
  travar(true); J.parar = false;
  robo = inicioRobo(); limparRastro(); posicionarRobo(false); $("robo").className = "robo";
  mensagem("Executando...");
  await espera(250);

  let resultado = "fim";
  for (const p of passos){
    if (J.parar){ resultado = "parou"; break; }
    document.querySelectorAll(".item.ativo").forEach(x => x.classList.remove("ativo"));
    p.ids.forEach(id => $("b-" + id)?.classList.add("ativo"));
    if (p.tipo === "esquerda"){ robo.dir = (robo.dir + 3) % 4; robo.giro -= 90; posicionarRobo(); }
    else if (p.tipo === "direita"){ robo.dir = (robo.dir + 1) % 4; robo.giro += 90; posicionarRobo(); }
    else {
      const [dl, dc] = PASSO[robo.dir], nl = robo.l + dl, nc = robo.c + dc;
      if (celula(nl, nc) === "#"){ resultado = "bateu"; break; }
      $(`c-${robo.l}-${robo.c}`).classList.add("rastro");
      robo.l = nl; robo.c = nc; posicionarRobo();
      if (celula(nl, nc) === "F"){ await espera(VELOCIDADE); resultado = "venceu"; break; }
    }
    await espera(VELOCIDADE);
  }
  document.querySelectorAll(".item.ativo").forEach(x => x.classList.remove("ativo"));

  if (resultado === "venceu"){ $("robo").classList.add("venceu"); mensagem("Chegou! 🎉", "ok"); await espera(700); travar(false); faseConcluida(); return; }
  if (resultado === "bateu"){ $("robo").classList.add("bateu"); mensagem("O robô bateu na parede! Ajuste o programa e tente de novo.", "bad"); }
  if (resultado === "fim") mensagem("O programa terminou, mas o robô não chegou na bandeira.", "bad");
  if (resultado === "parou") mensagem("Execução interrompida.");
  travar(false);
  await espera(1200);
  if (!J.rodando){ robo = inicioRobo(); limparRastro(); posicionarRobo(); }
}

function faseConcluida(){
  const usados = contarBlocos(), par = faseAtual().par;
  const est = usados <= par ? 3 : usados <= par + 2 ? 2 : 1;
  const pts = est * 100;
  J.pontos += pts; J.estrelas += est; J.concluidas++;
  $("pontos").textContent = J.pontos;
  $("estrelas").innerHTML = [1,2,3].map(i => `<span class="${i<=est?'':'apagada'}">⭐</span>`).join("");
  $("modalInfo").textContent = `Você usou ${usados} blocos (meta: ${par}). +${pts} pontos` +
    (est < 3 ? ". Dá para fazer com menos!" : ". Solução perfeita!");
  $("proxima").textContent = J.fase + 1 < FASES.length ? "Próxima fase" : "Ver resultado";
  $("modal").classList.remove("hidden");
}
function proximaFase(){
  $("modal").classList.add("hidden");
  J.fase++;
  if (J.fase >= FASES.length) return encerrar(true);
  carregarFase();
}

function encerrar(completou){
  const e = { nome:J.nome, pontos:J.pontos, estrelas:J.estrelas, fases:J.concluidas, data:Date.now() };
  const pos = adicionarRanking(e);
  J.ultima = e.data;
  $("fimTitulo").textContent = completou ? "🏆 Você completou todas as fases!" : "Fim de jogo";
  $("final").textContent = J.pontos + " pts";
  $("fimInfo").textContent = `${J.nome}, você concluiu ${J.concluidas} de ${FASES.length} fases e ganhou ${J.estrelas} ⭐. ` +
    (pos < 0 ? "Não foi dessa vez que entrou no ranking." : `Você ficou em ${pos + 1}º lugar no ranking!`);
  mostrar("fim");
}

// ---------- Eventos ----------
$("nome").addEventListener("input", validarNome);
$("nome").addEventListener("keydown", e => { if (e.key === "Enter") novoJogo(); });
$("jogar").onclick = novoJogo;
$("paleta").querySelectorAll(".bloco-paleta").forEach(b => b.onclick = () => adicionarBloco(b.dataset.tipo));
$("programa").onclick = () => { if (J.alvo){ J.alvo = null; desenharPrograma(); } };
$("executar").onclick = executar;
$("limpar").onclick = () => { J.programa = []; J.alvo = null; desenharPrograma(); mensagem(""); };
$("verCodigo").onclick = () => $("codigo").classList.toggle("hidden");
$("pular").onclick = () => { if (confirm("Pular esta fase? Você não ganha pontos por ela.")){ J.fase++; J.fase >= FASES.length ? encerrar(false) : carregarFase(); } };
$("encerrar").onclick = () => { if (confirm("Encerrar o jogo e salvar sua pontuação?")) encerrar(false); };
$("proxima").onclick = proximaFase;
$("denovo").onclick = () => mostrar("inicio");
$("verRanking").onclick = () => { desenharRanking(null); mostrar("ranking"); };
$("fimRanking").onclick = () => { desenharRanking(J?.ultima); mostrar("ranking"); };
$("rankingVoltar").onclick = () => mostrar("inicio");
$("rankingLimpar").onclick = () => { if (confirm("Apagar todo o ranking?")){ salvarRanking([]); desenharRanking(null); } };
window.addEventListener("resize", () => { if (J && robo && !$("jogo").classList.contains("hidden")) posicionarRobo(false); });
ligarArrastar();
try { $("nome").value = localStorage.getItem(RANK_KEY + "-nome") || ""; } catch {}
validarNome();
