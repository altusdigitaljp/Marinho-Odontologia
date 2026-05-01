# Marinho Odontologia — Landings Unificadas (Plano de Implementação)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as 15 landings existentes (3 temas × 5 unidades) por 6 landings unificadas (3 temas × 2 cidades) + 1 hub na home, com seleção dinâmica de unidade no JP via parâmetro `?unidade=...` na URL.

**Architecture:** HTML estático puro (sem build step). Cada landing é um `index.html` em uma pasta com slug-palavra-chave. CSS e JS compartilhados em `assets/`. JavaScript adicional (`unidades.js`) lida com reordenação de cards de unidade e atualização de CTAs do WhatsApp baseado no parâmetro `?unidade=` da URL.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla (sem framework), Google Tag Manager, Google Maps embed.

**Spec:** `Projetos/marinho-odontologia/docs/superpowers/specs/2026-05-01-landings-unificadas-design.md`

**Conventions:**
- Pastas antigas (`institucional/{bairro}/`, `facetas/{bairro}/`, `implante/{bairro}/`) são **mantidas intactas** (relíquias)
- WhatsApp por unidade: ver `Projetos/marinho-odontologia/data/unidades.json`
- Identidade: paleta primária #007CC3, fontes Saira (headlines) + Inter (corpo)
- Verificação: arquivos HTML são abertos no navegador (Chrome) com servidor local pra testar — não há suite de testes automatizados, então cada task termina com **verificação visual** seguindo um checklist explícito

---

## File Structure

### Arquivos novos (criar)

```
Projetos/marinho-odontologia/
├── index.html                                          ← Hub (raiz)
├── clinica-odontologica-joao-pessoa/
│   └── index.html                                      ← Institucional unificada JP
├── clinica-odontologica-campina-grande/
│   └── index.html                                      ← Institucional Campina
├── implante-dentario-joao-pessoa/
│   └── index.html                                      ← Implante unificada JP
├── implante-dentario-campina-grande/
│   └── index.html                                      ← Implante Campina
├── facetas-em-resina-joao-pessoa/
│   └── index.html                                      ← Facetas unificada JP
├── facetas-em-resina-campina-grande/
│   └── index.html                                      ← Facetas Campina
└── assets/
    ├── js/
    │   └── unidades.js                                 ← Reordenação + CTA dinâmico
    └── css/
        └── styles.css                                  ← MODIFICAR (adicionar estilos do bloco-unidades-multi e do hub)
```

### Arquivos modificados

- `Projetos/marinho-odontologia/assets/css/styles.css` — adicionar estilos para:
  - Bloco "unidades-multi" (lista vertical de cards com WhatsApp por unidade)
  - Página hub (cards de tratamentos)

### Arquivos preservados (intocados)

- Toda a árvore de `institucional/`, `facetas/`, `implante/` (15 pastas existentes)
- `assets/js/whatsapp.js`
- `assets/img/*`
- `data/unidades.json`
- `unidades/*` (fotos)
- `branding/*`, `docs/*`

### Responsabilidades por arquivo

| Arquivo | Responsabilidade |
|---|---|
| `assets/js/unidades.js` | Ler `?unidade=...`, reordenar cards, marcar card ativo, atualizar `data-whatsapp-numero` dos CTAs Hero/Final, lazy-load do iframe do mapa |
| `assets/css/styles.css` | Adicionar `.bloco-unidades-multi`, `.unidade-card`, `.unidade-card.ativo`, `.hub-grid`, `.hub-card` (no final do arquivo, sem mexer no resto) |
| Cada `index.html` de landing | Estrutura completa de 7 blocos (Hero → Especialidades → Antes/Depois → Por que + FAQ → Sobre Marinho → **Unidades** → CTA Final), com Title/Meta/H1 ajustados pra palavra-chave |
| `index.html` (raiz) | Hub: header com logo + 6 cards de tratamento × cidade + footer regulatório |

---

## Verification Setup (executado uma vez antes de tudo)

Como o projeto é HTML estático puro, a verificação visual é feita com servidor local + navegador.

### Comando do servidor local

```powershell
# Da raiz do projeto: c:\Users\Patrick Alves\Downloads\Claude code\Projetos\marinho-odontologia\
python -m http.server 8000
```

Acessível em `http://localhost:8000/`. Cada task descreve qual URL abrir e o que verificar.

---

## Task 1: Criar `unidades.js` — script de reordenação e CTA dinâmico

**Files:**
- Create: `Projetos/marinho-odontologia/assets/js/unidades.js`

- [ ] **Step 1: Criar o arquivo `unidades.js` com o conteúdo abaixo**

Path: `Projetos/marinho-odontologia/assets/js/unidades.js`

```javascript
/**
 * MARINHO ODONTOLOGIA — Reordenação de unidades + CTA dinâmico
 *
 * Este script:
 * 1. Lê o parâmetro ?unidade=... da URL
 * 2. Reordena os cards do bloco .bloco-unidades-multi (unidade ativa em primeiro)
 * 3. Aplica classe .ativo no card da unidade vinda do anúncio
 * 4. Atualiza data-whatsapp-numero nos botões com [data-cta-dinamico]
 *    para apontar pro número da unidade ativa
 * 5. Lazy-load do iframe do Google Maps (carrega só ao clicar em "Ver no mapa")
 *
 * Uso esperado no HTML:
 *   <button data-whatsapp data-cta-dinamico data-cta-position="hero">...</button>
 *   <article class="unidade-card" data-unidade-slug="mangabeira" data-unidade-numero="5583988900095">
 *     ...
 *     <button class="unidade-mapa-toggle" data-mapa-src="https://maps.google.com/...">Ver no mapa</button>
 *     <div class="unidade-mapa-container" hidden></div>
 *   </article>
 */
(function () {
  'use strict';

  function getUnidadeFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('unidade');
    return slug ? slug.toLowerCase().trim() : null;
  }

  function reordenarCards(slugAtivo) {
    var bloco = document.querySelector('.bloco-unidades-multi .unidades-lista');
    if (!bloco || !slugAtivo) return null;

    var cards = Array.prototype.slice.call(bloco.querySelectorAll('.unidade-card'));
    var ativo = cards.find(function (c) {
      return c.getAttribute('data-unidade-slug') === slugAtivo;
    });
    if (!ativo) return null;

    // Move o card ativo pro topo
    bloco.insertBefore(ativo, bloco.firstChild);
    ativo.classList.add('ativo');
    return ativo;
  }

  function atualizarCtasDinamicos(numero) {
    if (!numero) return;
    var botoes = document.querySelectorAll('[data-cta-dinamico]');
    botoes.forEach(function (b) {
      b.setAttribute('data-whatsapp-numero', numero);
    });
  }

  function bindLazyMapas() {
    var toggles = document.querySelectorAll('.unidade-mapa-toggle');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var card = toggle.closest('.unidade-card');
        if (!card) return;
        var container = card.querySelector('.unidade-mapa-container');
        var src = toggle.getAttribute('data-mapa-src');
        if (!container || !src) return;

        if (container.hasAttribute('hidden')) {
          // Cria o iframe só na primeira vez
          if (!container.querySelector('iframe')) {
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.title = 'Mapa da unidade';
            container.appendChild(iframe);
          }
          container.removeAttribute('hidden');
          toggle.textContent = 'Ocultar mapa';
        } else {
          container.setAttribute('hidden', '');
          toggle.textContent = 'Ver no mapa';
        }
      });
    });
  }

  function init() {
    var slug = getUnidadeFromUrl();
    var cardAtivo = slug ? reordenarCards(slug) : null;
    if (cardAtivo) {
      var numero = cardAtivo.getAttribute('data-unidade-numero');
      atualizarCtasDinamicos(numero);
    }
    bindLazyMapas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Verificação manual de sintaxe**

Abrir o arquivo em um editor que suporte JS (VSCode) e confirmar:
- Sem linhas vermelhas (erros de sintaxe)
- Indentação consistente
- Sem `console.log` esquecidos

- [ ] **Step 3: Commit**

```powershell
git add "Projetos/marinho-odontologia/assets/js/unidades.js"
git commit -m "add: marinho-odontologia — script unidades.js (reordenação + CTA dinâmico + lazy map)"
```

---

## Task 2: Adicionar estilos CSS do bloco unidades-multi e do hub

**Files:**
- Modify: `Projetos/marinho-odontologia/assets/css/styles.css` (acrescentar no final do arquivo, antes de qualquer media query final se houver)

- [ ] **Step 1: Abrir `styles.css` e localizar o final do arquivo**

```powershell
# Abrir no editor pra verificar o final do arquivo:
code "Projetos/marinho-odontologia/assets/css/styles.css"
```

- [ ] **Step 2: Acrescentar o bloco abaixo no FINAL do `styles.css`**

```css
/* ============================================
   BLOCO UNIDADES-MULTI (lista vertical de unidades)
   Usado na landing unificada de João Pessoa
   ============================================ */
.bloco-unidades-multi .pergunta-unidade {
  font-family: var(--font-headline);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 800;
  color: var(--azul-escuro);
  text-align: center;
  margin: 0 0 var(--s-8) 0;
  line-height: 1.2;
}

.bloco-unidades-multi .unidades-lista {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  max-width: 620px;
  margin: 0 auto;
}

.unidade-card {
  background: var(--branco);
  border: 1px solid var(--cinza-neutro);
  border-radius: var(--r-md);
  padding: var(--s-6);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.unidade-card.ativo {
  border: 2px solid var(--azul-primario);
  box-shadow: var(--shadow-md);
}

.unidade-card .unidade-bairro {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--azul-petroleo);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 0 0 var(--s-3) 0;
}

.unidade-card .unidade-linha {
  display: flex;
  gap: var(--s-2);
  align-items: flex-start;
  font-size: 0.95rem;
  color: var(--azul-escuro);
  margin-bottom: var(--s-2);
  line-height: 1.4;
}

.unidade-card .unidade-linha .icone {
  flex-shrink: 0;
  font-size: 1rem;
  margin-top: 2px;
}

.unidade-card .unidade-mapa-toggle {
  display: inline-block;
  margin-top: var(--s-3);
  margin-bottom: var(--s-4);
  padding: var(--s-2) var(--s-4);
  background: transparent;
  color: var(--azul-primario);
  border: 1px solid var(--azul-primario);
  border-radius: var(--r-sm);
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.unidade-card .unidade-mapa-toggle:hover {
  background: var(--azul-primario);
  color: var(--branco);
}

.unidade-card .unidade-mapa-container {
  margin-bottom: var(--s-4);
  border-radius: var(--r-sm);
  overflow: hidden;
  height: 260px;
}

.unidade-card .unidade-mapa-container iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.unidade-card .btn-whatsapp {
  width: 100%;
  margin-top: var(--s-2);
}

/* ============================================
   HUB (página inicial)
   ============================================ */
.hub-hero {
  padding: var(--s-16) 0 var(--s-8) 0;
  background: var(--gradient-hero);
  color: var(--branco);
  text-align: center;
}

.hub-hero h1 {
  color: var(--branco);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  margin-bottom: var(--s-4);
}

.hub-hero .hub-sub {
  font-size: 1.05rem;
  opacity: 0.9;
  max-width: 560px;
  margin: 0 auto;
}

.hub-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s-5);
  max-width: 920px;
  margin: 0 auto;
  padding: var(--s-12) var(--s-4);
}

@media (min-width: 720px) {
  .hub-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.hub-card {
  display: block;
  background: var(--branco);
  border: 1px solid var(--cinza-neutro);
  border-radius: var(--r-md);
  padding: var(--s-6);
  text-align: left;
  text-decoration: none;
  color: var(--azul-escuro);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.hub-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--azul-primario);
}

.hub-card .hub-card-eyebrow {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--azul-primario);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--s-2);
}

.hub-card .hub-card-titulo {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  color: var(--azul-escuro);
}
```

- [ ] **Step 3: Verificação visual**

Abrir o `styles.css` e confirmar:
- O bloco foi adicionado no final
- Sem chaves desbalanceadas no fim do arquivo
- Sem texto/comentários cortados

- [ ] **Step 4: Commit**

```powershell
git add "Projetos/marinho-odontologia/assets/css/styles.css"
git commit -m "add: marinho-odontologia — estilos do bloco unidades-multi e do hub"
```

---

## Task 3: Criar landing **institucional unificada de João Pessoa**

**Files:**
- Create: `Projetos/marinho-odontologia/clinica-odontologica-joao-pessoa/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/clinica-odontologica-joao-pessoa" -Force
```

- [ ] **Step 2: Criar `index.html` com o conteúdo abaixo**

Path: `Projetos/marinho-odontologia/clinica-odontologica-joao-pessoa/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clínica Odontológica em João Pessoa — Marinho Odontologia</title>
<meta name="description" content="Clínica odontológica em João Pessoa com 4 unidades. Avaliação gratuita, atendimento de emergência e especialistas em todas as áreas. +50 mil pacientes · 12 unidades.">
<meta name="theme-color" content="#0C1B27">
<link rel="icon" type="image/png" href="../assets/img/logo/marinho-logo-transparente.png">
<link rel="apple-touch-icon" href="../assets/img/logo/marinho-logo-transparente.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Saira:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/styles.css">

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
</head>

<body data-tema="institucional" data-unidade="joao-pessoa">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<!-- Ícones SVG inline -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="icon-whatsapp" viewBox="0 0 32 32">
    <path d="M27.286 4.683c-2.985-2.99-6.957-4.638-11.187-4.64-8.717 0-15.812 7.094-15.815 15.812-.001 2.787.727 5.508 2.111 7.907L0.117 32l8.466-2.221c2.31 1.26 4.911 1.924 7.557 1.925h.007c8.716 0 15.811-7.095 15.815-15.813.001-4.222-1.642-8.197-4.626-11.188zM16.147 28.863h-.005c-2.359-.001-4.673-.635-6.692-1.832l-.48-.285-4.972 1.304 1.327-4.847-.313-.498c-1.317-2.094-2.013-4.515-2.012-7.005.003-7.245 5.898-13.139 13.149-13.139 3.51.001 6.808 1.37 9.288 3.853 2.48 2.483 3.846 5.785 3.844 9.296-.003 7.246-5.898 13.141-13.143 13.141zm7.207-9.84c-.395-.198-2.336-1.153-2.698-1.285-.362-.132-.625-.198-.888.198-.263.395-1.018 1.285-1.249 1.548-.23.263-.461.296-.855.099-.395-.198-1.668-.615-3.176-1.961-1.174-1.047-1.967-2.34-2.197-2.736-.23-.395-.025-.609.173-.806.178-.177.395-.461.593-.692.198-.23.263-.395.395-.658.132-.263.066-.494-.033-.692-.099-.198-.888-2.142-1.217-2.933-.32-.77-.646-.666-.888-.679-.23-.011-.494-.014-.756-.014-.263 0-.69.099-1.052.494s-1.382 1.351-1.382 3.295c0 1.944 1.415 3.823 1.612 4.087.198.263 2.785 4.252 6.748 5.964.943.407 1.679.65 2.253.832.946.301 1.807.258 2.488.157.759-.114 2.336-.955 2.665-1.878.329-.923.329-1.713.23-1.878-.099-.165-.362-.263-.756-.461z"/>
  </symbol>
</svg>

<header class="header">
  <div class="container header-inner">
    <a href="#hero" class="header-logo" aria-label="Marinho Odontologia">
      <img src="../assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia" width="160" height="40">
    </a>
    <span class="header-unidade">João Pessoa</span>
  </div>
</header>

<!-- BLOCO 1 — HERO -->
<section class="hero" id="hero">
  <div class="container">
    <div class="hero-marca">
      <span class="hero-marca-nome">Marinho Odontologia</span>
      <span class="hero-marca-sub">João Pessoa</span>
    </div>
    <h1>Clínica Odontológica em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita</h1>
    <p class="sub">Especialistas em todas as áreas em 4 unidades de João Pessoa. Atendimento de emergência e tecnologia avançada.</p>
    <button class="btn-whatsapp" data-whatsapp data-cta-dinamico data-whatsapp-numero="5583988900095" data-cta-position="hero">
      <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
      Agendar pelo WhatsApp
    </button>
    <div class="hero-prova">
      +10 anos <span class="sep">·</span> +50 mil pacientes <span class="sep">·</span> 12 unidades
    </div>
  </div>
</section>

<!-- BLOCO 2 — ESPECIALIDADES -->
<section class="bloco bloco-cinza">
  <div class="container">
    <span class="bloco-eyebrow">Sua família em boas mãos</span>
    <h2>Tudo o que você precisa em um só lugar</h2>
    <div class="especialidades">
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5"/><path d="M12 5.5l3 1.5"/></svg></span>Implantodontia</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 10l.01 0"/><path d="M15 10l.01 0"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/></svg></span>Estética dental</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2"/><path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2"/></svg></span>Ortodontia</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h.5"/><path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296"/></svg></span>Odontopediatria</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3l4 4"/><path d="M19 5l-4.5 4.5"/><path d="M11.5 6.5l6 6"/><path d="M16.5 11.5l-6.5 6.5h-4v-4l6.5 -6.5"/><path d="M7.5 12.5l1.5 1.5"/><path d="M10.5 9.5l1.5 1.5"/><path d="M3 21l3 -3"/></svg></span>Canal</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/><path d="M4 10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -8"/><path d="M10 14h4"/><path d="M12 12v4"/></svg></span>Cirurgia oral</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572"/><path d="M3 13h2l2 3l2 -6l1 3h3"/></svg></span>Emergência</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"/><path d="M8 15a6 6 0 1 0 12 0v-3"/><path d="M11 3v2"/><path d="M6 3v2"/><path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/></svg></span>Periodontia</div>
    </div>
  </div>
</section>

<!-- BLOCO 3 — ANTES E DEPOIS -->
<section class="bloco">
  <div class="container">
    <span class="bloco-eyebrow">Resultados reais</span>
    <h2>+50 mil sorrisos transformados</h2>
    <span class="galeria-categoria">Implantes Dentários</span>
    <div class="galeria">
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-1.webp" alt="Antes e depois — implante caso 1" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-2.webp" alt="Antes e depois — implante caso 2" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-3.jpg" alt="Antes e depois — implante caso 3" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-4.jpg" alt="Antes e depois — implante caso 4" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-5.jpg" alt="Antes e depois — implante caso 5" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/3-antes-depois-implante/implante-6.jpg" alt="Antes e depois — implante caso 6" loading="lazy"></div>
    </div>
    <span class="galeria-hint">← deslize para o lado para ver todos →</span>

    <span class="galeria-categoria">Lentes de Resina</span>
    <div class="galeria">
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-1.jpg" alt="Antes e depois — lentes caso 1" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-2.jpg" alt="Antes e depois — lentes caso 2" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-3.jpg" alt="Antes e depois — lentes caso 3" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-4.jpg" alt="Antes e depois — lentes caso 4" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-5.jpg" alt="Antes e depois — lentes caso 5" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/01-mangabeira/4-antes-depois-facetas/facetas-6.jpg" alt="Antes e depois — lentes caso 6" loading="lazy"></div>
    </div>
    <span class="galeria-hint">← deslize para o lado para ver todos →</span>
    <p class="galeria-disclaimer">Resultados individuais. Imagens com autorização dos pacientes.</p>
  </div>
</section>

<!-- BLOCO 4 — POR QUE A MARINHO + FAQ -->
<section class="bloco bloco-cinza">
  <div class="container">
    <span class="bloco-eyebrow">Por que escolher</span>
    <h2>Por que a Marinho?</h2>
    <ul class="diferenciais">
      <li>Especialistas em todas as áreas em uma só clínica</li>
      <li>Tecnologia 3D, raio-x digital e exames no local</li>
      <li>Atendimento de emergência</li>
      <li>+10 anos · +50 mil pacientes · 12 unidades</li>
      <li>18x sem juros no cartão · 15x no boleto sem consulta SPC</li>
    </ul>

    <div class="faq">
      <details>
        <summary>Vocês atendem convênio?</summary>
        <div class="resposta">Não trabalhamos com convênios para oferecer o melhor preço direto ao paciente, sem intermediários. Temos parcelamento facilitado: até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC.</div>
      </details>
      <details>
        <summary>Atendem emergência?</summary>
        <div class="resposta">Sim, oferecemos atendimento de emergência nas nossas 4 unidades de João Pessoa. Para casos urgentes, fale conosco diretamente pelo WhatsApp da unidade mais próxima para agendamento prioritário.</div>
      </details>
      <details>
        <summary>Quanto custa uma consulta?</summary>
        <div class="resposta">A avaliação inicial é 100% gratuita. Você sai dela com um plano personalizado e o orçamento exato do tratamento, sem compromisso.</div>
      </details>
    </div>
  </div>
</section>

<!-- BLOCO 4.5 — TEXTO EXPLICATIVO (SEO + Quality Score) -->
<section class="bloco">
  <div class="container">
    <span class="bloco-eyebrow">Sobre a Marinho</span>
    <h2>Uma clínica odontológica para toda a família, em João Pessoa</h2>
    <div class="bloco-texto" style="text-align: left; max-width: 620px;">
      <p style="margin-bottom: 1rem;">A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>João Pessoa</strong>, contamos com 4 unidades — Mangabeira, Av. Epitácio Pessoa, Ernesto Geisel e Centro — oferecendo atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral.</p>
      <p style="margin-bottom: 1rem;">Contamos com <strong>especialistas dedicados</strong> em cada área, tecnologia avançada de escaneamento 3D e raio-x digital, e atendimento de emergência para casos urgentes. Toda <strong>avaliação inicial é gratuita</strong>, com plano de tratamento personalizado e o orçamento exato sem compromisso.</p>
      <p>Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Escolha a unidade mais próxima, agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família.</p>
    </div>
  </div>
</section>

<!-- BLOCO 5 — UNIDADES MULTI -->
<section class="bloco bloco-unidades-multi">
  <div class="container">
    <span class="bloco-eyebrow">Atendimento próximo de você</span>
    <h2 class="pergunta-unidade">Em qual unidade você quer ser atendido?</h2>
    <div class="unidades-lista">

      <article class="unidade-card" data-unidade-slug="mangabeira" data-unidade-numero="5583988900095">
        <h3 class="unidade-bairro">Mangabeira</h3>
        <p class="unidade-linha"><span class="icone">📍</span><span>Mangabeira, João Pessoa — PB</span></p>
        <p class="unidade-linha"><span class="icone">📱</span><span>(83) 98890-0095</span></p>
        <p class="unidade-linha"><span class="icone">🕐</span><span>Seg a Sex: 8h às 18h · Sáb: 8h às 12h</span></p>
        <button class="unidade-mapa-toggle" data-mapa-src="https://maps.google.com/maps?q=Marinho+Odontologia+Mangabeira+Jo%C3%A3o+Pessoa&output=embed&hl=pt-BR&z=16">Ver no mapa</button>
        <div class="unidade-mapa-container" hidden></div>
        <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="unidade-mangabeira">
          <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
          Falar com a Mangabeira
        </button>
      </article>

      <article class="unidade-card" data-unidade-slug="epitacio" data-unidade-numero="5583982700109">
        <h3 class="unidade-bairro">Epitácio</h3>
        <p class="unidade-linha"><span class="icone">📍</span><span>Av. Pres. Epitácio Pessoa, 1777 — Estados, João Pessoa — PB</span></p>
        <p class="unidade-linha"><span class="icone">📱</span><span>(83) 98270-0109</span></p>
        <p class="unidade-linha"><span class="icone">🕐</span><span>Seg a Sex: 8h às 18h · Sáb: 8h às 12h</span></p>
        <button class="unidade-mapa-toggle" data-mapa-src="https://maps.google.com/maps?q=Av.+Pres.+Epit%C3%A1cio+Pessoa%2C+1777+-+Estados%2C+Jo%C3%A3o+Pessoa+-+PB&output=embed&hl=pt-BR&z=17">Ver no mapa</button>
        <div class="unidade-mapa-container" hidden></div>
        <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583982700109" data-cta-position="unidade-epitacio">
          <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
          Falar com a Epitácio
        </button>
      </article>

      <article class="unidade-card" data-unidade-slug="geisel" data-unidade-numero="5583982700110">
        <h3 class="unidade-bairro">Geisel</h3>
        <p class="unidade-linha"><span class="icone">📍</span><span>Av. Pres. Juscelino Kubitscheck, 835 — Ernesto Geisel, João Pessoa — PB</span></p>
        <p class="unidade-linha"><span class="icone">📱</span><span>(83) 98270-0110</span></p>
        <p class="unidade-linha"><span class="icone">🕐</span><span>Seg a Sex: 8h às 18h · Sáb: 8h às 12h</span></p>
        <button class="unidade-mapa-toggle" data-mapa-src="https://maps.google.com/maps?q=Av.+Pres.+Juscelino+Kubitscheck%2C+835+-+Ernesto+Geisel%2C+Jo%C3%A3o+Pessoa+-+PB&output=embed&hl=pt-BR&z=17">Ver no mapa</button>
        <div class="unidade-mapa-container" hidden></div>
        <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583982700110" data-cta-position="unidade-geisel">
          <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
          Falar com a Geisel
        </button>
      </article>

      <article class="unidade-card" data-unidade-slug="centro" data-unidade-numero="5583980255117">
        <h3 class="unidade-bairro">Centro</h3>
        <p class="unidade-linha"><span class="icone">📍</span><span>Av. Padre Meira, 146 — Centro, João Pessoa — PB</span></p>
        <p class="unidade-linha"><span class="icone">📱</span><span>(83) 98025-5117</span></p>
        <p class="unidade-linha"><span class="icone">🕐</span><span>Seg a Sex: 8h às 18h · Sáb: 8h às 12h</span></p>
        <button class="unidade-mapa-toggle" data-mapa-src="https://maps.google.com/maps?q=Av.+Padre+Meira%2C+146+-+Centro%2C+Jo%C3%A3o+Pessoa+-+PB&output=embed&hl=pt-BR&z=17">Ver no mapa</button>
        <div class="unidade-mapa-container" hidden></div>
        <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583980255117" data-cta-position="unidade-centro">
          <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
          Falar com a Centro
        </button>
      </article>

    </div>
  </div>
</section>

<!-- BLOCO 6 — CTA FINAL -->
<section class="cta-final">
  <div class="container">
    <h2>Sua saúde bucal merece<br>quem entende.</h2>
    <p class="cta-final-sub">Agende sua avaliação gratuita pelo WhatsApp e descubra como podemos cuidar do seu sorriso.</p>
    <button class="btn-whatsapp" data-whatsapp data-cta-dinamico data-whatsapp-numero="5583988900095" data-cta-position="final">
      <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
      Agendar pelo WhatsApp
    </button>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-logo">
      <img src="../assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia">
    </div>
    <div class="footer-info">
      <p><strong>Marinho Odontologia — EPAO 316</strong></p>
      <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    </div>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
  </div>
</footer>

<!-- WhatsApp flutuante -->
<button class="whatsapp-flutuante" data-whatsapp data-cta-dinamico data-whatsapp-numero="5583988900095" data-cta-position="flutuante" aria-label="Falar pelo WhatsApp">
  <svg><use href="#icon-whatsapp"/></svg>
</button>

<script src="../assets/js/whatsapp.js"></script>
<script src="../assets/js/unidades.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verificar visualmente no navegador (sem parâmetro)**

```powershell
# Da raiz do projeto
cd "Projetos/marinho-odontologia"
python -m http.server 8000
```

Abrir `http://localhost:8000/clinica-odontologica-joao-pessoa/` em Chrome. Conferir:

- [ ] Title da aba mostra "Clínica Odontológica em João Pessoa — Marinho Odontologia"
- [ ] H1 mostra "Clínica Odontológica em João Pessoa — Avaliação Gratuita"
- [ ] Bloco "Em qual unidade você quer ser atendido?" mostra 4 cards na ordem: Mangabeira → Epitácio → Geisel → Centro
- [ ] Nenhum card tem borda azul destacada (sem `?unidade=`)
- [ ] Cada card tem botão "Ver no mapa" e botão verde "Falar com a [unidade]"
- [ ] Clicar em "Ver no mapa" da Mangabeira: mapa expande embaixo do botão
- [ ] WhatsApp flutuante aparece após ~1.5s no canto inferior direito

- [ ] **Step 4: Verificar com `?unidade=geisel`**

Abrir `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=geisel`. Conferir:

- [ ] Card da Geisel apareceu em **primeiro lugar** na lista
- [ ] Card da Geisel tem **borda azul** mais grossa
- [ ] Ordem dos demais: Mangabeira → Epitácio → Centro
- [ ] Botão WhatsApp do Hero, ao clicar, abre o WhatsApp com o número (83) 98270-0110 (Geisel) — verificar a URL na barra de status do navegador antes de clicar

- [ ] **Step 5: Verificar com `?unidade=mangabeira`**

Abrir `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=mangabeira`. Conferir:

- [ ] Mangabeira primeiro com borda azul
- [ ] Botão WhatsApp do Hero leva para o número da Mangabeira (5583988900095)

- [ ] **Step 6: Commit**

```powershell
git add "Projetos/marinho-odontologia/clinica-odontologica-joao-pessoa/"
git commit -m "add: marinho-odontologia — landing institucional unificada de João Pessoa"
```

---

## Task 4: Criar landing **implante unificada de João Pessoa**

**Files:**
- Create: `Projetos/marinho-odontologia/implante-dentario-joao-pessoa/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/implante-dentario-joao-pessoa" -Force
```

- [ ] **Step 2: Copiar o conteúdo da Task 3 e fazer as 8 substituições abaixo**

Copiar **todo o HTML** de `Projetos/marinho-odontologia/clinica-odontologica-joao-pessoa/index.html`, salvar em `Projetos/marinho-odontologia/implante-dentario-joao-pessoa/index.html`, e aplicar **as substituições abaixo**:

| Onde | Texto antigo | Texto novo |
|---|---|---|
| `<title>` | Clínica Odontológica em João Pessoa — Marinho Odontologia | Implante Dentário em João Pessoa — Marinho Odontologia |
| `<meta name="description">` | Clínica odontológica em João Pessoa com 4 unidades. Avaliação gratuita, atendimento de emergência e especialistas em todas as áreas. +50 mil pacientes · 12 unidades. | Implante dentário em João Pessoa com avaliação gratuita. Tecnologia 3D, especialistas em implantodontia em 4 unidades. +50 mil pacientes · 12 unidades. |
| `<body data-tema="institucional"` | data-tema="institucional" | data-tema="implante" |
| H1 | Clínica Odontológica em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita | Implante Dentário em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita |
| Sub do hero | Especialistas em todas as áreas em 4 unidades de João Pessoa. Atendimento de emergência e tecnologia avançada. | Especialistas em implantodontia em 4 unidades de João Pessoa. Tecnologia 3D, exames no local e parcelamento facilitado. |
| H2 do bloco "Sobre" | Uma clínica odontológica para toda a família, em João Pessoa | Implante dentário com tecnologia 3D, em João Pessoa |
| Texto do bloco "Sobre" — primeiro parágrafo | A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>João Pessoa</strong>, contamos com 4 unidades — Mangabeira, Av. Epitácio Pessoa, Ernesto Geisel e Centro — oferecendo atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral. | A <strong>Marinho Odontologia</strong> é referência em <strong>implante dentário em João Pessoa</strong>, com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em João Pessoa, contamos com 4 unidades — Mangabeira, Av. Epitácio Pessoa, Ernesto Geisel e Centro — todas equipadas para implantodontia, do diagnóstico 3D à cirurgia. |
| Texto do bloco "Sobre" — terceiro parágrafo (final) | Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Escolha a unidade mais próxima, agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família. | Para tornar o tratamento mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Escolha a unidade de João Pessoa mais próxima e agende sua avaliação gratuita de <strong>implante dentário</strong> pelo WhatsApp. |
| H2 da galeria antes/depois | +50 mil sorrisos transformados | Implantes que devolvem o sorriso |

**Atenção:** o resto do HTML (especialidades, FAQ, blocos, footer, scripts) permanece **idêntico**.

- [ ] **Step 3: Verificar no navegador (sem parâmetro)**

`http://localhost:8000/implante-dentario-joao-pessoa/`

- [ ] Title: "Implante Dentário em João Pessoa — Marinho Odontologia"
- [ ] H1: "Implante Dentário em João Pessoa — Avaliação Gratuita"
- [ ] Bloco unidades: 4 cards na ordem padrão
- [ ] Botão WhatsApp do Hero, ao clicar, dispara mensagem do tema implante (verificar `data-tema="implante"` no `<body>` via DevTools — F12 → Elements)

- [ ] **Step 4: Verificar com `?unidade=epitacio`**

`http://localhost:8000/implante-dentario-joao-pessoa/?unidade=epitacio`

- [ ] Card da Epitácio em primeiro lugar com borda azul
- [ ] Botão Hero aponta pra (83) 98270-0109

- [ ] **Step 5: Commit**

```powershell
git add "Projetos/marinho-odontologia/implante-dentario-joao-pessoa/"
git commit -m "add: marinho-odontologia — landing implante unificada de João Pessoa"
```

---

## Task 5: Criar landing **facetas em resina unificada de João Pessoa**

**Files:**
- Create: `Projetos/marinho-odontologia/facetas-em-resina-joao-pessoa/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/facetas-em-resina-joao-pessoa" -Force
```

- [ ] **Step 2: Copiar o conteúdo da Task 3 e aplicar as substituições abaixo**

Igual à Task 4 — copiar HTML de `clinica-odontologica-joao-pessoa/index.html` e fazer estas substituições:

| Onde | Texto antigo | Texto novo |
|---|---|---|
| `<title>` | Clínica Odontológica em João Pessoa — Marinho Odontologia | Facetas em Resina em João Pessoa — Marinho Odontologia |
| `<meta name="description">` | Clínica odontológica em João Pessoa com 4 unidades. Avaliação gratuita, atendimento de emergência e especialistas em todas as áreas. +50 mil pacientes · 12 unidades. | Facetas em resina em João Pessoa com avaliação gratuita. Transforme seu sorriso em uma sessão. Especialistas em estética dental nas 4 unidades de João Pessoa. |
| `<body data-tema="institucional"` | data-tema="institucional" | data-tema="facetas" |
| H1 | Clínica Odontológica em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita | Facetas em Resina em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita |
| Sub do hero | Especialistas em todas as áreas em 4 unidades de João Pessoa. Atendimento de emergência e tecnologia avançada. | Lentes de resina aplicadas em uma sessão. 4 unidades em João Pessoa, especialistas em estética dental. |
| H2 do bloco "Sobre" | Uma clínica odontológica para toda a família, em João Pessoa | Lentes de resina que transformam o sorriso, em João Pessoa |
| Texto do bloco "Sobre" — primeiro parágrafo | A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>João Pessoa</strong>, contamos com 4 unidades — Mangabeira, Av. Epitácio Pessoa, Ernesto Geisel e Centro — oferecendo atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral. | A <strong>Marinho Odontologia</strong> é referência em <strong>facetas em resina em João Pessoa</strong>, com mais de 10 anos de mercado e mais de 50 mil pacientes atendidos. Nas 4 unidades de João Pessoa — Mangabeira, Av. Epitácio Pessoa, Ernesto Geisel e Centro — você transforma seu sorriso em uma única sessão, com lentes aplicadas direto sobre o dente. |
| Texto do bloco "Sobre" — segundo parágrafo | Contamos com <strong>especialistas dedicados</strong> em cada área, tecnologia avançada de escaneamento 3D e raio-x digital, e atendimento de emergência para casos urgentes. Toda <strong>avaliação inicial é gratuita</strong>, com plano de tratamento personalizado e o orçamento exato sem compromisso. | Contamos com <strong>especialistas em estética dental</strong>, lentes em resina de alta durabilidade e atendimento humanizado. Toda <strong>avaliação é gratuita</strong>, com simulação digital do resultado e o orçamento exato sem compromisso. |
| Texto do bloco "Sobre" — terceiro parágrafo | Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Escolha a unidade mais próxima, agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família. | Escolha a unidade de João Pessoa mais próxima e agende sua avaliação gratuita de <strong>facetas em resina</strong> pelo WhatsApp. Venha conhecer o sorriso que você sempre quis ter. |
| H2 da galeria antes/depois | +50 mil sorrisos transformados | Sorrisos transformados com lentes de resina |

⚠️ **Atenção pra Facetas:** o spec original (2026-04-29) diz que **a regra de não destacar parcelamento se aplica em landings de Facetas**. Ou seja, **REMOVER** desta landing:

- O `<li>` "18x sem juros no cartão · 15x no boleto sem consulta SPC" do bloco "Por que a Marinho?" — apagar essa linha
- A frase sobre parcelamento na resposta da FAQ "Vocês atendem convênio?" — substituir o texto por: "Não trabalhamos com convênios para oferecer o melhor preço direto ao paciente, sem intermediários."

- [ ] **Step 3: Verificar no navegador**

`http://localhost:8000/facetas-em-resina-joao-pessoa/`

- [ ] Title: "Facetas em Resina em João Pessoa — Marinho Odontologia"
- [ ] H1: "Facetas em Resina em João Pessoa — Avaliação Gratuita"
- [ ] Bloco "Por que a Marinho?" **NÃO** menciona "18x" nem "15x"
- [ ] FAQ "Vocês atendem convênio?" não menciona parcelamento
- [ ] `data-tema="facetas"` no `<body>` (verificar via DevTools)

- [ ] **Step 4: Verificar com `?unidade=centro`**

`http://localhost:8000/facetas-em-resina-joao-pessoa/?unidade=centro`

- [ ] Card do Centro em primeiro lugar, com borda azul
- [ ] CTA Hero aponta pra (83) 98025-5117

- [ ] **Step 5: Commit**

```powershell
git add "Projetos/marinho-odontologia/facetas-em-resina-joao-pessoa/"
git commit -m "add: marinho-odontologia — landing facetas em resina unificada de João Pessoa"
```

---

## Task 6: Criar landing **institucional Campina Grande**

**Files:**
- Create: `Projetos/marinho-odontologia/clinica-odontologica-campina-grande/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/clinica-odontologica-campina-grande" -Force
```

- [ ] **Step 2: Criar `index.html` com o conteúdo abaixo**

Path: `Projetos/marinho-odontologia/clinica-odontologica-campina-grande/index.html`

Esta landing tem só **1 unidade** — então o bloco usa o formato simples (1 card no lugar dos 4). Resto da estrutura é igual à Task 3 com texto adaptado.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clínica Odontológica em Campina Grande — Marinho Odontologia</title>
<meta name="description" content="Clínica odontológica em Campina Grande com avaliação gratuita. Especialistas em todas as áreas, atendimento de emergência. +50 mil pacientes · 12 unidades.">
<meta name="theme-color" content="#0C1B27">
<link rel="icon" type="image/png" href="../assets/img/logo/marinho-logo-transparente.png">
<link rel="apple-touch-icon" href="../assets/img/logo/marinho-logo-transparente.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Saira:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/styles.css">

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
</head>

<body data-tema="institucional" data-unidade="campina-grande">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="icon-whatsapp" viewBox="0 0 32 32">
    <path d="M27.286 4.683c-2.985-2.99-6.957-4.638-11.187-4.64-8.717 0-15.812 7.094-15.815 15.812-.001 2.787.727 5.508 2.111 7.907L0.117 32l8.466-2.221c2.31 1.26 4.911 1.924 7.557 1.925h.007c8.716 0 15.811-7.095 15.815-15.813.001-4.222-1.642-8.197-4.626-11.188zM16.147 28.863h-.005c-2.359-.001-4.673-.635-6.692-1.832l-.48-.285-4.972 1.304 1.327-4.847-.313-.498c-1.317-2.094-2.013-4.515-2.012-7.005.003-7.245 5.898-13.139 13.149-13.139 3.51.001 6.808 1.37 9.288 3.853 2.48 2.483 3.846 5.785 3.844 9.296-.003 7.246-5.898 13.141-13.143 13.141zm7.207-9.84c-.395-.198-2.336-1.153-2.698-1.285-.362-.132-.625-.198-.888.198-.263.395-1.018 1.285-1.249 1.548-.23.263-.461.296-.855.099-.395-.198-1.668-.615-3.176-1.961-1.174-1.047-1.967-2.34-2.197-2.736-.23-.395-.025-.609.173-.806.178-.177.395-.461.593-.692.198-.23.263-.395.395-.658.132-.263.066-.494-.033-.692-.099-.198-.888-2.142-1.217-2.933-.32-.77-.646-.666-.888-.679-.23-.011-.494-.014-.756-.014-.263 0-.69.099-1.052.494s-1.382 1.351-1.382 3.295c0 1.944 1.415 3.823 1.612 4.087.198.263 2.785 4.252 6.748 5.964.943.407 1.679.65 2.253.832.946.301 1.807.258 2.488.157.759-.114 2.336-.955 2.665-1.878.329-.923.329-1.713.23-1.878-.099-.165-.362-.263-.756-.461z"/>
  </symbol>
</svg>

<header class="header">
  <div class="container header-inner">
    <a href="#hero" class="header-logo" aria-label="Marinho Odontologia">
      <img src="../assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia" width="160" height="40">
    </a>
    <span class="header-unidade">Campina Grande</span>
  </div>
</header>

<section class="hero" id="hero">
  <div class="container">
    <div class="hero-marca">
      <span class="hero-marca-nome">Marinho Odontologia</span>
      <span class="hero-marca-sub">Campina Grande</span>
    </div>
    <h1>Clínica Odontológica em <span class="destaque">Campina Grande</span><br>Avaliação Gratuita</h1>
    <p class="sub">Especialistas em todas as áreas, no centro de Campina Grande. Atendimento de emergência e tecnologia avançada.</p>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900115" data-cta-position="hero">
      <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
      Agendar pelo WhatsApp
    </button>
    <div class="hero-prova">
      +10 anos <span class="sep">·</span> +50 mil pacientes <span class="sep">·</span> 12 unidades
    </div>
  </div>
</section>

<section class="bloco bloco-cinza">
  <div class="container">
    <span class="bloco-eyebrow">Sua família em boas mãos</span>
    <h2>Tudo o que você precisa em um só lugar</h2>
    <div class="especialidades">
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5"/><path d="M12 5.5l3 1.5"/></svg></span>Implantodontia</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 10l.01 0"/><path d="M15 10l.01 0"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/></svg></span>Estética dental</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2"/><path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2"/></svg></span>Ortodontia</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h.5"/><path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296"/></svg></span>Odontopediatria</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3l4 4"/><path d="M19 5l-4.5 4.5"/><path d="M11.5 6.5l6 6"/><path d="M16.5 11.5l-6.5 6.5h-4v-4l6.5 -6.5"/><path d="M7.5 12.5l1.5 1.5"/><path d="M10.5 9.5l1.5 1.5"/><path d="M3 21l3 -3"/></svg></span>Canal</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/><path d="M4 10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -8"/><path d="M10 14h4"/><path d="M12 12v4"/></svg></span>Cirurgia oral</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572"/><path d="M3 13h2l2 3l2 -6l1 3h3"/></svg></span>Emergência</div>
      <div class="especialidade"><span class="icone-svg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"/><path d="M8 15a6 6 0 1 0 12 0v-3"/><path d="M11 3v2"/><path d="M6 3v2"/><path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/></svg></span>Periodontia</div>
    </div>
  </div>
</section>

<section class="bloco">
  <div class="container">
    <span class="bloco-eyebrow">Resultados reais</span>
    <h2>+50 mil sorrisos transformados</h2>
    <span class="galeria-categoria">Implantes Dentários</span>
    <div class="galeria">
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-1.webp" alt="Antes e depois — implante caso 1" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-2.webp" alt="Antes e depois — implante caso 2" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-3.jpg" alt="Antes e depois — implante caso 3" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-4.jpg" alt="Antes e depois — implante caso 4" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-5.jpg" alt="Antes e depois — implante caso 5" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/3-antes-depois-implante/implante-6.jpg" alt="Antes e depois — implante caso 6" loading="lazy"></div>
    </div>
    <span class="galeria-hint">← deslize para o lado para ver todos →</span>

    <span class="galeria-categoria">Lentes de Resina</span>
    <div class="galeria">
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-1.jpg" alt="Antes e depois — lentes caso 1" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-2.jpg" alt="Antes e depois — lentes caso 2" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-3.jpg" alt="Antes e depois — lentes caso 3" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-4.jpg" alt="Antes e depois — lentes caso 4" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-5.jpg" alt="Antes e depois — lentes caso 5" loading="lazy"></div>
      <div class="galeria-item"><img src="../unidades/05-campina-grande/4-antes-depois-facetas/facetas-6.jpg" alt="Antes e depois — lentes caso 6" loading="lazy"></div>
    </div>
    <span class="galeria-hint">← deslize para o lado para ver todos →</span>
    <p class="galeria-disclaimer">Resultados individuais. Imagens com autorização dos pacientes.</p>
  </div>
</section>

<section class="bloco bloco-cinza">
  <div class="container">
    <span class="bloco-eyebrow">Por que escolher</span>
    <h2>Por que a Marinho?</h2>
    <ul class="diferenciais">
      <li>Especialistas em todas as áreas em uma só clínica</li>
      <li>Tecnologia 3D, raio-x digital e exames no local</li>
      <li>Atendimento de emergência</li>
      <li>+10 anos · +50 mil pacientes · 12 unidades</li>
      <li>18x sem juros no cartão · 15x no boleto sem consulta SPC</li>
    </ul>

    <div class="faq">
      <details>
        <summary>Vocês atendem convênio?</summary>
        <div class="resposta">Não trabalhamos com convênios para oferecer o melhor preço direto ao paciente, sem intermediários. Temos parcelamento facilitado: até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC.</div>
      </details>
      <details>
        <summary>Atendem emergência?</summary>
        <div class="resposta">Sim, oferecemos atendimento de emergência na unidade de Campina Grande. Para casos urgentes, fale conosco diretamente pelo WhatsApp para agendamento prioritário.</div>
      </details>
      <details>
        <summary>Quanto custa uma consulta?</summary>
        <div class="resposta">A avaliação inicial é 100% gratuita. Você sai dela com um plano personalizado e o orçamento exato do tratamento, sem compromisso.</div>
      </details>
    </div>
  </div>
</section>

<section class="bloco">
  <div class="container">
    <span class="bloco-eyebrow">Sobre a Marinho</span>
    <h2>Uma clínica odontológica para toda a família, em Campina Grande</h2>
    <div class="bloco-texto" style="text-align: left; max-width: 620px;">
      <p style="margin-bottom: 1rem;">A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>Campina Grande</strong>, a unidade do Centro oferece atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral.</p>
      <p style="margin-bottom: 1rem;">Contamos com <strong>especialistas dedicados</strong> em cada área, tecnologia avançada de escaneamento 3D e raio-x digital, e atendimento de emergência para casos urgentes. Toda <strong>avaliação inicial é gratuita</strong>, com plano de tratamento personalizado e o orçamento exato sem compromisso.</p>
      <p>Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família.</p>
    </div>
  </div>
</section>

<section class="bloco">
  <div class="container">
    <span class="bloco-eyebrow">Atendimento próximo de você</span>
    <h2>Marinho Odontologia — Campina Grande</h2>
    <div class="unidade-info">
      <div class="unidade-info-item">
        <span class="icone">📍</span>
        <span>Av. Mal. Floriano Peixoto, 225 — Centro, Campina Grande — PB</span>
      </div>
      <div class="unidade-info-item">
        <span class="icone">📱</span>
        <span>(83) 98890-0115</span>
      </div>
      <div class="unidade-info-item">
        <span class="icone">🕐</span>
        <span>Seg a Sex: 8h às 18h · Sáb: 8h às 12h</span>
      </div>
    </div>
    <div class="unidade-secao">
      <span class="unidade-secao-titulo">Como chegar</span>
      <div class="unidade-mapa"><iframe src="https://maps.google.com/maps?q=Av.+Mal.+Floriano+Peixoto%2C+225+-+Centro%2C+Campina+Grande+-+PB&output=embed&hl=pt-BR&z=17" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa Marinho Odontologia Campina Grande"></iframe></div>
    </div>
    <div class="unidade-cta">
      <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900115" data-cta-position="unidade">
        <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
        Falar com a unidade
      </button>
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="container">
    <h2>Sua saúde bucal merece<br>quem entende.</h2>
    <p class="cta-final-sub">Agende sua avaliação gratuita pelo WhatsApp e descubra como podemos cuidar do seu sorriso.</p>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900115" data-cta-position="final">
      <span class="icone"><svg><use href="#icon-whatsapp"/></svg></span>
      Agendar pelo WhatsApp
    </button>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-logo">
      <img src="../assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia">
    </div>
    <div class="footer-info">
      <p><strong>Marinho Odontologia — EPAO 316</strong></p>
      <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    </div>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
  </div>
</footer>

<button class="whatsapp-flutuante" data-whatsapp data-whatsapp-numero="5583988900115" data-cta-position="flutuante" aria-label="Falar pelo WhatsApp">
  <svg><use href="#icon-whatsapp"/></svg>
</button>

<script src="../assets/js/whatsapp.js"></script>
</body>
</html>
```

> Observação: Campina Grande **não inclui** o `unidades.js` porque tem só 1 unidade — não há reordenação a fazer. O bloco de unidade usa o formato simples (`.unidade-info`) que já existe no CSS atual.

- [ ] **Step 3: Verificar no navegador**

`http://localhost:8000/clinica-odontologica-campina-grande/`

- [ ] Title: "Clínica Odontológica em Campina Grande — Marinho Odontologia"
- [ ] H1: "Clínica Odontológica em Campina Grande — Avaliação Gratuita"
- [ ] Bloco "Marinho Odontologia — Campina Grande" mostra endereço, mapa carregado direto (sem toggle) e botão verde
- [ ] Botão CTA Final aponta pra (83) 98890-0115

- [ ] **Step 4: Commit**

```powershell
git add "Projetos/marinho-odontologia/clinica-odontologica-campina-grande/"
git commit -m "add: marinho-odontologia — landing institucional Campina Grande"
```

---

## Task 7: Criar landing **implante Campina Grande**

**Files:**
- Create: `Projetos/marinho-odontologia/implante-dentario-campina-grande/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/implante-dentario-campina-grande" -Force
```

- [ ] **Step 2: Copiar o conteúdo da Task 6 e aplicar substituições**

Copiar `Projetos/marinho-odontologia/clinica-odontologica-campina-grande/index.html` pro novo arquivo, e fazer estas substituições:

| Onde | Texto antigo | Texto novo |
|---|---|---|
| `<title>` | Clínica Odontológica em Campina Grande — Marinho Odontologia | Implante Dentário em Campina Grande — Marinho Odontologia |
| `<meta name="description">` | Clínica odontológica em Campina Grande com avaliação gratuita. Especialistas em todas as áreas, atendimento de emergência. +50 mil pacientes · 12 unidades. | Implante dentário em Campina Grande com avaliação gratuita. Tecnologia 3D, especialistas em implantodontia. +50 mil pacientes · 12 unidades. |
| `<body data-tema="institucional"` | data-tema="institucional" | data-tema="implante" |
| H1 | Clínica Odontológica em <span class="destaque">Campina Grande</span><br>Avaliação Gratuita | Implante Dentário em <span class="destaque">Campina Grande</span><br>Avaliação Gratuita |
| Sub do hero | Especialistas em todas as áreas, no centro de Campina Grande. Atendimento de emergência e tecnologia avançada. | Especialistas em implantodontia em Campina Grande. Tecnologia 3D, exames no local e parcelamento facilitado. |
| H2 do bloco "Sobre" | Uma clínica odontológica para toda a família, em Campina Grande | Implante dentário com tecnologia 3D, em Campina Grande |
| Texto "Sobre" — primeiro parágrafo | A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>Campina Grande</strong>, a unidade do Centro oferece atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral. | A <strong>Marinho Odontologia</strong> é referência em <strong>implante dentário em Campina Grande</strong>, com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Nossa unidade no Centro é equipada para implantodontia, do diagnóstico 3D à cirurgia. |
| Texto "Sobre" — terceiro parágrafo | Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família. | Para tornar o tratamento mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Agende sua avaliação gratuita de <strong>implante dentário em Campina Grande</strong> pelo WhatsApp. |
| H2 da galeria | +50 mil sorrisos transformados | Implantes que devolvem o sorriso |

- [ ] **Step 3: Verificar no navegador**

`http://localhost:8000/implante-dentario-campina-grande/`

- [ ] Title: "Implante Dentário em Campina Grande — Marinho Odontologia"
- [ ] H1: "Implante Dentário em Campina Grande — Avaliação Gratuita"
- [ ] `data-tema="implante"` no `<body>` (DevTools)

- [ ] **Step 4: Commit**

```powershell
git add "Projetos/marinho-odontologia/implante-dentario-campina-grande/"
git commit -m "add: marinho-odontologia — landing implante Campina Grande"
```

---

## Task 8: Criar landing **facetas em resina Campina Grande**

**Files:**
- Create: `Projetos/marinho-odontologia/facetas-em-resina-campina-grande/index.html`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Path "Projetos/marinho-odontologia/facetas-em-resina-campina-grande" -Force
```

- [ ] **Step 2: Copiar a Task 6 e aplicar substituições**

| Onde | Texto antigo | Texto novo |
|---|---|---|
| `<title>` | Clínica Odontológica em Campina Grande — Marinho Odontologia | Facetas em Resina em Campina Grande — Marinho Odontologia |
| `<meta name="description">` | Clínica odontológica em Campina Grande com avaliação gratuita. Especialistas em todas as áreas, atendimento de emergência. +50 mil pacientes · 12 unidades. | Facetas em resina em Campina Grande com avaliação gratuita. Transforme seu sorriso em uma sessão. Especialistas em estética dental. |
| `<body data-tema="institucional"` | data-tema="institucional" | data-tema="facetas" |
| H1 | Clínica Odontológica em <span class="destaque">Campina Grande</span><br>Avaliação Gratuita | Facetas em Resina em <span class="destaque">Campina Grande</span><br>Avaliação Gratuita |
| Sub do hero | Especialistas em todas as áreas, no centro de Campina Grande. Atendimento de emergência e tecnologia avançada. | Lentes de resina aplicadas em uma sessão. Centro de Campina Grande, especialistas em estética dental. |
| H2 do bloco "Sobre" | Uma clínica odontológica para toda a família, em Campina Grande | Lentes de resina que transformam o sorriso, em Campina Grande |
| Texto "Sobre" — primeiro parágrafo | A <strong>Marinho Odontologia</strong> é uma rede de <strong>clínicas odontológicas</strong> com mais de 10 anos de mercado, 12 unidades e mais de 50 mil pacientes atendidos. Em <strong>Campina Grande</strong>, a unidade do Centro oferece atendimento completo nas principais especialidades: implante, ortodontia, estética dental, canal, odontopediatria, periodontia e cirurgia oral. | A <strong>Marinho Odontologia</strong> é referência em <strong>facetas em resina em Campina Grande</strong>, com mais de 10 anos de mercado e mais de 50 mil pacientes atendidos. Na nossa unidade do Centro de Campina Grande, você transforma seu sorriso em uma única sessão, com lentes aplicadas direto sobre o dente. |
| Texto "Sobre" — segundo parágrafo | Contamos com <strong>especialistas dedicados</strong> em cada área, tecnologia avançada de escaneamento 3D e raio-x digital, e atendimento de emergência para casos urgentes. Toda <strong>avaliação inicial é gratuita</strong>, com plano de tratamento personalizado e o orçamento exato sem compromisso. | Contamos com <strong>especialistas em estética dental</strong>, lentes em resina de alta durabilidade e atendimento humanizado. Toda <strong>avaliação é gratuita</strong>, com simulação digital do resultado e o orçamento exato sem compromisso. |
| Texto "Sobre" — terceiro parágrafo | Para tornar o cuidado com a saúde bucal ainda mais acessível, oferecemos parcelamento em até 18x sem juros no cartão e 15x no boleto sem consulta ao SPC. Agende sua avaliação pelo WhatsApp e venha conhecer o <strong>dentista de confiança</strong> da sua família. | Agende sua avaliação gratuita de <strong>facetas em resina</strong> pelo WhatsApp. Venha conhecer o sorriso que você sempre quis ter. |
| H2 da galeria | +50 mil sorrisos transformados | Sorrisos transformados com lentes de resina |

⚠️ **Mesma regra de Facetas:**
- Remover `<li>` "18x sem juros no cartão · 15x no boleto sem consulta SPC" do bloco "Por que a Marinho?"
- Substituir resposta da FAQ "Vocês atendem convênio?" por: "Não trabalhamos com convênios para oferecer o melhor preço direto ao paciente, sem intermediários."

- [ ] **Step 3: Verificar no navegador**

`http://localhost:8000/facetas-em-resina-campina-grande/`

- [ ] Title: "Facetas em Resina em Campina Grande — Marinho Odontologia"
- [ ] H1 ok
- [ ] Bloco "Por que a Marinho?" sem 18x/15x
- [ ] FAQ sobre convênio sem menção a parcelamento
- [ ] `data-tema="facetas"` (DevTools)

- [ ] **Step 4: Commit**

```powershell
git add "Projetos/marinho-odontologia/facetas-em-resina-campina-grande/"
git commit -m "add: marinho-odontologia — landing facetas em resina Campina Grande"
```

---

## Task 9: Criar o hub (`index.html` na raiz)

**Files:**
- Create: `Projetos/marinho-odontologia/index.html`

- [ ] **Step 1: Criar `index.html` na raiz com o conteúdo abaixo**

Path: `Projetos/marinho-odontologia/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Marinho Odontologia — Clínicas em João Pessoa e Campina Grande</title>
<meta name="description" content="Marinho Odontologia: rede de clínicas odontológicas em João Pessoa e Campina Grande. +50 mil pacientes · 12 unidades · +10 anos de mercado.">
<meta name="theme-color" content="#0C1B27">
<link rel="icon" type="image/png" href="assets/img/logo/marinho-logo-transparente.png">
<link rel="apple-touch-icon" href="assets/img/logo/marinho-logo-transparente.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Saira:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
</head>

<body>

<header class="header">
  <div class="container header-inner">
    <a href="#" class="header-logo" aria-label="Marinho Odontologia">
      <img src="assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia" width="160" height="40">
    </a>
  </div>
</header>

<section class="hub-hero">
  <div class="container">
    <h1>Marinho Odontologia</h1>
    <p class="hub-sub">Encontre a clínica mais próxima e o tratamento que você precisa.<br>+10 anos · +50 mil pacientes · 12 unidades</p>
  </div>
</section>

<section class="hub-grid">
  <a href="clinica-odontologica-joao-pessoa/" class="hub-card">
    <span class="hub-card-eyebrow">João Pessoa</span>
    <h2 class="hub-card-titulo">Clínica Odontológica</h2>
  </a>
  <a href="clinica-odontologica-campina-grande/" class="hub-card">
    <span class="hub-card-eyebrow">Campina Grande</span>
    <h2 class="hub-card-titulo">Clínica Odontológica</h2>
  </a>
  <a href="implante-dentario-joao-pessoa/" class="hub-card">
    <span class="hub-card-eyebrow">João Pessoa</span>
    <h2 class="hub-card-titulo">Implante Dentário</h2>
  </a>
  <a href="implante-dentario-campina-grande/" class="hub-card">
    <span class="hub-card-eyebrow">Campina Grande</span>
    <h2 class="hub-card-titulo">Implante Dentário</h2>
  </a>
  <a href="facetas-em-resina-joao-pessoa/" class="hub-card">
    <span class="hub-card-eyebrow">João Pessoa</span>
    <h2 class="hub-card-titulo">Facetas em Resina</h2>
  </a>
  <a href="facetas-em-resina-campina-grande/" class="hub-card">
    <span class="hub-card-eyebrow">Campina Grande</span>
    <h2 class="hub-card-titulo">Facetas em Resina</h2>
  </a>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-logo">
      <img src="assets/img/logo/marinho-logo-transparente.png" alt="Marinho Odontologia">
    </div>
    <div class="footer-info">
      <p><strong>Marinho Odontologia — EPAO 316</strong></p>
      <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    </div>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verificar no navegador**

`http://localhost:8000/`

- [ ] Title: "Marinho Odontologia — Clínicas em João Pessoa e Campina Grande"
- [ ] Hero exibe logo + título "Marinho Odontologia" + subtítulo com prova social
- [ ] 6 cards visíveis na ordem: Clínica JP, Clínica Campina, Implante JP, Implante Campina, Facetas JP, Facetas Campina
- [ ] Cada card tem eyebrow com cidade e título com tratamento
- [ ] **Sem WhatsApp flutuante**
- [ ] Hover nos cards: borda fica azul e card sobe levemente
- [ ] Clique em cada card abre a landing correspondente

- [ ] **Step 3: Commit**

```powershell
git add "Projetos/marinho-odontologia/index.html"
git commit -m "add: marinho-odontologia — hub na home com 6 cards de landings"
```

---

## Task 10: Verificação integrada (smoke test final)

**Files:** nenhum modificado — só verificação

- [ ] **Step 1: Iniciar servidor local (se ainda não estiver)**

```powershell
cd "Projetos/marinho-odontologia"
python -m http.server 8000
```

- [ ] **Step 2: Smoke test em todas as 7 URLs**

Abrir uma a uma no Chrome e verificar que cada uma carrega sem erro 404 e sem console errors (F12 → Console):

- [ ] `http://localhost:8000/`
- [ ] `http://localhost:8000/clinica-odontologica-joao-pessoa/`
- [ ] `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=mangabeira`
- [ ] `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=epitacio`
- [ ] `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=geisel`
- [ ] `http://localhost:8000/clinica-odontologica-joao-pessoa/?unidade=centro`
- [ ] `http://localhost:8000/clinica-odontologica-campina-grande/`
- [ ] `http://localhost:8000/implante-dentario-joao-pessoa/`
- [ ] `http://localhost:8000/implante-dentario-joao-pessoa/?unidade=mangabeira`
- [ ] `http://localhost:8000/implante-dentario-campina-grande/`
- [ ] `http://localhost:8000/facetas-em-resina-joao-pessoa/`
- [ ] `http://localhost:8000/facetas-em-resina-joao-pessoa/?unidade=geisel`
- [ ] `http://localhost:8000/facetas-em-resina-campina-grande/`

- [ ] **Step 3: Smoke test mobile (Chrome DevTools)**

Abrir DevTools (F12), ativar modo mobile (Ctrl+Shift+M), escolher dispositivo "iPhone SE" ou "Pixel 5". Verificar em 1 landing JP unificada:

- [ ] H1 não corta nem fica gigante
- [ ] Cards de unidade aparecem 1 por linha
- [ ] Botão "Ver no mapa" funciona — mapa expande corretamente
- [ ] Botão WhatsApp da unidade leva ao número certo
- [ ] WhatsApp flutuante aparece sem cobrir o conteúdo

- [ ] **Step 4: Verificar pastas antigas intactas**

```powershell
Get-ChildItem "Projetos/marinho-odontologia/institucional" -Directory
Get-ChildItem "Projetos/marinho-odontologia/facetas" -Directory
Get-ChildItem "Projetos/marinho-odontologia/implante" -Directory
```

Esperado: cada uma lista 5 pastas (mangabeira, epitacio, geisel, centro, campina-grande). Nenhuma foi deletada.

- [ ] **Step 5: Commit final (se tiver mudanças do tipo `.gitignore` ou ajustes pequenos descobertos)**

Se o smoke test não revelou nada pra ajustar, **não há nada pra commitar nesta task** — pular o commit.

---

## Resumo dos commits

Ao fim das 10 tasks, o repo terá estes commits novos:

1. `add: marinho-odontologia — script unidades.js`
2. `add: marinho-odontologia — estilos do bloco unidades-multi e do hub`
3. `add: marinho-odontologia — landing institucional unificada de João Pessoa`
4. `add: marinho-odontologia — landing implante unificada de João Pessoa`
5. `add: marinho-odontologia — landing facetas em resina unificada de João Pessoa`
6. `add: marinho-odontologia — landing institucional Campina Grande`
7. `add: marinho-odontologia — landing implante Campina Grande`
8. `add: marinho-odontologia — landing facetas em resina Campina Grande`
9. `add: marinho-odontologia — hub na home com 6 cards`

E **as 15 pastas antigas continuam intactas** no repo.

---

## Notas pós-implementação (não são tasks — fica de referência)

- **Quando publicar no GitHub:** o spec do projeto exige conta separada do cliente. Patrick conecta a conta nova manualmente; só então fazer `git push`.
- **Configurar Google Ads:** depois das 6 landings + hub no ar, próxima fase é montar as campanhas. Cada grupo de anúncio JP aponta pra `/clinica-odontologica-joao-pessoa/?unidade=mangabeira` (e variações). URL de exibição usa caminho personalizado tipo `marinhoodonto.com.br/joao-pessoa/Mangabeira`.
- **GTM `GTM-5NKWFG22`** está em todas as landings novas. Conversão Caminho A — 1 conversão única (clique em qualquer botão WhatsApp).
- **Memória do projeto** (`MEMORY.md` do Patrick) deve ser atualizada após o go-live com a nova estrutura.
