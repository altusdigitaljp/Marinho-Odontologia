# Marinho Odontologia — Fase 1: Piloto Mangabeira

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir as 3 landing pages piloto da unidade Mangabeira (Implante, Facetas, Institucional) seguindo o spec aprovado, prontas para revisão visual antes de replicar para as outras 4 unidades.

**Architecture:** HTML estático puro, mobile-first, 1 CSS único compartilhado, 1 JS único de tracking, dados das unidades centralizados em JSON. Cada landing tem 6 blocos enxutos + footer regulatório + WhatsApp flutuante. GTM-5NKWFG22 instalado em todas. CTA principal verde WhatsApp `#25D366`, identidade visual em azul `#007CC3`.

**Tech Stack:** HTML5, CSS3 (Grid + Flexbox + custom properties), Vanilla JS, Google Fonts (Montserrat + Inter), Google Tag Manager.

**⚠️ ATENÇÃO GitHub:** NÃO publicar no GitHub durante esta fase. Patrick conectará outra conta após aprovação. Manter tudo local + commits no repo principal.

---

## File Structure

```
Projetos/marinho-odontologia/
├── data/
│   └── unidades.json                    # Dados das 5 unidades (WhatsApp, endereço, etc.)
├── assets/
│   ├── css/
│   │   └── styles.css                   # CSS único, design system + componentes
│   └── js/
│       └── whatsapp.js                  # Handler de cliques + tracking GTM
├── implante/
│   └── mangabeira/
│       └── index.html                   # Landing 1 — Implante Dentário Mangabeira
├── facetas/
│   └── mangabeira/
│       └── index.html                   # Landing 2 — Facetas em Resina Mangabeira
├── institucional/
│   └── mangabeira/
│       └── index.html                   # Landing 3 — Institucional Mangabeira
└── README.md                            # Documentação básica do repo
```

**Responsabilidades:**

- `data/unidades.json` — fonte única de verdade dos dados das unidades. Lido pelas landings via `fetch()` no JS de tracking.
- `assets/css/styles.css` — design system completo: tokens (cores, tipografia, espaçamento), componentes (botão WhatsApp, card de prova social, accordion FAQ, hero, footer).
- `assets/js/whatsapp.js` — função única `trackAndOpenWhatsApp()` que faz o `dataLayer.push` e abre `wa.me`. Lê `data-tema` e `data-unidade` do `<body>`.
- `implante/mangabeira/index.html` — primeira landing construída (referência para as outras).
- `facetas/mangabeira/index.html` e `institucional/mangabeira/index.html` — adaptações da estrutura.
- `README.md` — explica como rodar local, estrutura do projeto, status.

---

## Task 1: Criar dados centralizados das unidades

**Files:**
- Create: `Projetos/marinho-odontologia/data/unidades.json`

- [ ] **Step 1: Criar o arquivo JSON com os dados das 5 unidades**

Conteúdo:

```json
{
  "mangabeira": {
    "slug": "mangabeira",
    "cidade": "João Pessoa",
    "bairro": "Mangabeira",
    "nomeCompleto": "Marinho Odontologia — Mangabeira",
    "whatsapp": "5583988900095",
    "whatsappFormatado": "(83) 98890-0095",
    "endereco": "[a preencher pelo Patrick]",
    "horario": "[a preencher pelo Patrick]",
    "mapaEmbed": "[a preencher pelo Patrick — URL embed Google Maps]"
  },
  "epitacio": {
    "slug": "epitacio",
    "cidade": "João Pessoa",
    "bairro": "Avenida Epitácio Pessoa",
    "nomeCompleto": "Marinho Odontologia — Epitácio",
    "whatsapp": "5583982700109",
    "whatsappFormatado": "(83) 98270-0109",
    "endereco": "[a preencher pelo Patrick]",
    "horario": "[a preencher pelo Patrick]",
    "mapaEmbed": "[a preencher pelo Patrick]"
  },
  "geisel": {
    "slug": "geisel",
    "cidade": "João Pessoa",
    "bairro": "Geisel",
    "nomeCompleto": "Marinho Odontologia — Geisel",
    "whatsapp": "5583982700110",
    "whatsappFormatado": "(83) 98270-0110",
    "endereco": "[a preencher pelo Patrick]",
    "horario": "[a preencher pelo Patrick]",
    "mapaEmbed": "[a preencher pelo Patrick]"
  },
  "centro": {
    "slug": "centro",
    "cidade": "João Pessoa",
    "bairro": "Centro",
    "nomeCompleto": "Marinho Odontologia — Centro",
    "whatsapp": "5583980255117",
    "whatsappFormatado": "(83) 98025-5117",
    "endereco": "[a preencher pelo Patrick]",
    "horario": "[a preencher pelo Patrick]",
    "mapaEmbed": "[a preencher pelo Patrick]"
  },
  "campina-grande": {
    "slug": "campina-grande",
    "cidade": "Campina Grande",
    "bairro": "[a preencher pelo Patrick]",
    "nomeCompleto": "Marinho Odontologia — Campina Grande",
    "whatsapp": "5583988900115",
    "whatsappFormatado": "(83) 98890-0115",
    "endereco": "[a preencher pelo Patrick]",
    "horario": "[a preencher pelo Patrick]",
    "mapaEmbed": "[a preencher pelo Patrick]"
  }
}
```

- [ ] **Step 2: Validar JSON é parseável**

Run: `node -e "JSON.parse(require('fs').readFileSync('Projetos/marinho-odontologia/data/unidades.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add Projetos/marinho-odontologia/data/unidades.json
git commit -m "add: marinho-odontologia/data — unidades.json com 5 unidades"
```

---

## Task 2: Criar design system (CSS único)

**Files:**
- Create: `Projetos/marinho-odontologia/assets/css/styles.css`

- [ ] **Step 1: Escrever o CSS completo com design tokens, layout base e componentes**

Conteúdo:

```css
/* ============================================
   MARINHO ODONTOLOGIA — DESIGN SYSTEM
   Cores oficiais do PDF de marca
   ============================================ */

:root {
  /* Paleta oficial */
  --azul-escuro: #0C1B27;
  --azul-petroleo: #00577B;
  --azul-primario: #007CC3;
  --azul-claro: #75C5F0;
  --cinza-neutro: #E7E8EA;
  --branco: #FFFFFF;

  /* CTA WhatsApp */
  --whatsapp-verde: #25D366;
  --whatsapp-verde-hover: #1FB956;

  /* Tipografia */
  --font-headline: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Espaçamento (escala de 4) */
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-6: 1.5rem;
  --s-8: 2rem;
  --s-12: 3rem;
  --s-16: 4rem;
  --s-20: 5rem;

  /* Border radius */
  --r-sm: 6px;
  --r-md: 12px;
  --r-lg: 20px;
  --r-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(12, 27, 39, 0.08);
  --shadow-md: 0 4px 16px rgba(12, 27, 39, 0.12);
  --shadow-lg: 0 12px 32px rgba(12, 27, 39, 0.18);
  --shadow-cta: 0 6px 20px rgba(37, 211, 102, 0.4);
}

/* Reset básico */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--azul-escuro);
  background: var(--branco);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
h1, h2, h3 { font-family: var(--font-headline); font-weight: 800; line-height: 1.15; margin: 0; color: var(--azul-petroleo); }
p { margin: 0; }

/* Container */
.container {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 var(--s-4);
}

/* ============================================
   HEADER
   ============================================ */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--branco);
  border-bottom: 1px solid var(--cinza-neutro);
  padding: var(--s-3) 0;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-4);
}
.header-logo {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: 1px;
  color: var(--azul-petroleo);
}
.header-logo span { color: var(--azul-primario); }
.header-unidade {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--azul-primario);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ============================================
   HERO
   ============================================ */
.hero {
  padding: var(--s-12) 0 var(--s-16);
  background: linear-gradient(180deg, var(--cinza-neutro) 0%, var(--branco) 100%);
  text-align: center;
}
.hero h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  margin-bottom: var(--s-4);
  color: var(--azul-petroleo);
}
.hero h1 .destaque {
  color: var(--azul-primario);
}
.hero .sub {
  font-size: clamp(1rem, 3vw, 1.125rem);
  color: var(--azul-escuro);
  margin-bottom: var(--s-8);
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}
.hero-prova {
  margin-top: var(--s-6);
  font-size: 0.85rem;
  color: var(--azul-petroleo);
  font-weight: 600;
}
.hero-prova span { margin: 0 var(--s-2); color: var(--azul-primario); }

/* ============================================
   BOTÃO WHATSAPP (componente principal)
   ============================================ */
.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-3);
  padding: var(--s-4) var(--s-8);
  background: var(--whatsapp-verde);
  color: var(--branco);
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 1.05rem;
  border-radius: var(--r-full);
  box-shadow: var(--shadow-cta);
  transition: transform 0.15s ease, background 0.15s ease;
  text-align: center;
  width: 100%;
  max-width: 360px;
}
.btn-whatsapp:hover, .btn-whatsapp:focus { background: var(--whatsapp-verde-hover); transform: translateY(-2px); }
.btn-whatsapp:active { transform: translateY(0); }
.btn-whatsapp .icone { font-size: 1.2rem; }

/* ============================================
   BLOCOS GENÉRICOS
   ============================================ */
.bloco { padding: var(--s-12) 0; }
.bloco:nth-child(even) { background: var(--cinza-neutro); }
.bloco h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  text-align: center;
  margin-bottom: var(--s-6);
  color: var(--azul-petroleo);
}
.bloco-texto {
  max-width: 560px;
  margin: 0 auto;
  font-size: 1.05rem;
  text-align: center;
  color: var(--azul-escuro);
}

/* ============================================
   GALERIA ANTES & DEPOIS
   ============================================ */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--s-3);
  margin-top: var(--s-6);
}
.galeria-item {
  background: var(--branco);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--azul-petroleo);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  padding: var(--s-3);
}
.galeria-disclaimer {
  margin-top: var(--s-4);
  font-size: 0.78rem;
  color: var(--azul-petroleo);
  text-align: center;
  font-style: italic;
}

/* ============================================
   POR QUE + FAQ
   ============================================ */
.diferenciais {
  list-style: none;
  padding: 0;
  margin: 0 auto var(--s-8);
  max-width: 560px;
}
.diferenciais li {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  padding: var(--s-3) 0;
  border-bottom: 1px solid var(--cinza-neutro);
  font-size: 1rem;
}
.diferenciais li::before {
  content: "✓";
  color: var(--azul-primario);
  font-weight: 800;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.bloco-par .diferenciais li { border-bottom-color: rgba(255,255,255,0.4); }

.faq {
  max-width: 560px;
  margin: 0 auto;
}
.faq details {
  background: var(--branco);
  border-radius: var(--r-md);
  margin-bottom: var(--s-3);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.faq summary {
  padding: var(--s-4);
  font-weight: 700;
  color: var(--azul-petroleo);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-headline);
}
.faq summary::after {
  content: "+";
  font-size: 1.5rem;
  color: var(--azul-primario);
  transition: transform 0.2s ease;
}
.faq details[open] summary::after { transform: rotate(45deg); }
.faq summary::-webkit-details-marker { display: none; }
.faq .resposta {
  padding: 0 var(--s-4) var(--s-4);
  color: var(--azul-escuro);
  line-height: 1.6;
}

/* ============================================
   ESPECIALIDADES (institucional)
   ============================================ */
.especialidades {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--s-3);
  max-width: 560px;
  margin: 0 auto;
}
.especialidade {
  background: var(--branco);
  border-radius: var(--r-md);
  padding: var(--s-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
  font-weight: 600;
  color: var(--azul-petroleo);
  font-size: 0.9rem;
}
.especialidade .icone { font-size: 1.6rem; display: block; margin-bottom: var(--s-2); }

/* ============================================
   BLOCO DA UNIDADE
   ============================================ */
.unidade-info {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}
.unidade-info p { margin-bottom: var(--s-2); font-size: 1rem; }
.unidade-info .icone { color: var(--azul-primario); font-weight: 800; margin-right: var(--s-2); }
.unidade-mapa {
  margin-top: var(--s-6);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  aspect-ratio: 16 / 10;
  background: var(--cinza-neutro);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--azul-petroleo);
}
.unidade-mapa iframe { width: 100%; height: 100%; border: 0; }
.unidade-fachada {
  margin-top: var(--s-4);
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--cinza-neutro);
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--azul-petroleo);
  font-style: italic;
  font-size: 0.85rem;
}
.unidade-cta { margin-top: var(--s-6); display: flex; justify-content: center; }

/* ============================================
   CTA FINAL
   ============================================ */
.cta-final {
  background: var(--azul-escuro);
  color: var(--branco);
  text-align: center;
  padding: var(--s-16) 0;
}
.cta-final h2 { color: var(--branco); margin-bottom: var(--s-6); }
.cta-final .btn-whatsapp { margin: 0 auto; }

/* ============================================
   FOOTER
   ============================================ */
.footer {
  background: var(--azul-escuro);
  color: var(--cinza-neutro);
  padding: var(--s-8) 0 var(--s-6);
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.7;
}
.footer p { margin-bottom: var(--s-2); }
.footer .regulatorio { font-size: 0.78rem; opacity: 0.75; margin-top: var(--s-4); }
.footer .outras-unidades {
  margin-top: var(--s-6);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--s-4);
}
.footer .outras-unidades a {
  color: var(--azul-claro);
  font-weight: 600;
  font-size: 0.85rem;
}
.footer .outras-unidades a:hover { color: var(--branco); }

/* ============================================
   WHATSAPP FLUTUANTE
   ============================================ */
.whatsapp-flutuante {
  position: fixed;
  bottom: var(--s-4);
  right: var(--s-4);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--whatsapp-verde);
  color: var(--branco);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 1.5s ease, transform 1.5s ease, background 0.15s ease;
  animation: pulse 5s ease-in-out infinite 2s;
}
.whatsapp-flutuante.visivel { opacity: 1; transform: scale(1); }
.whatsapp-flutuante:hover { background: var(--whatsapp-verde-hover); }

@keyframes pulse {
  0%, 100% { box-shadow: var(--shadow-lg), 0 0 0 0 rgba(37, 211, 102, 0.5); }
  50% { box-shadow: var(--shadow-lg), 0 0 0 16px rgba(37, 211, 102, 0); }
}

/* Acessibilidade: respeita usuários que pedem menos animação */
@media (prefers-reduced-motion: reduce) {
  .whatsapp-flutuante { animation: none; }
  html { scroll-behavior: auto; }
}

/* ============================================
   DESKTOP RESPONSIVO
   ============================================ */
@media (min-width: 768px) {
  .container { max-width: 960px; padding: 0 var(--s-8); }
  .galeria { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .especialidades { grid-template-columns: repeat(4, 1fr); }
}
```

- [ ] **Step 2: Verificar que o arquivo foi salvo e contém a paleta correta**

Run: `grep -c "007CC3\|00577B\|0C1B27\|75C5F0\|E7E8EA" Projetos/marinho-odontologia/assets/css/styles.css`
Expected: número >= 5 (uma menção por cor)

- [ ] **Step 3: Commit**

```bash
git add Projetos/marinho-odontologia/assets/css/styles.css
git commit -m "add: marinho-odontologia/css — design system completo com paleta oficial"
```

---

## Task 3: Criar JavaScript de tracking + WhatsApp

**Files:**
- Create: `Projetos/marinho-odontologia/assets/js/whatsapp.js`

- [ ] **Step 1: Escrever o JS único com tracking GTM e abertura do WhatsApp**

Conteúdo:

```javascript
/**
 * MARINHO ODONTOLOGIA — Tracking e abertura de WhatsApp
 *
 * Este script:
 * 1. Lê data-tema e data-unidade do <body>
 * 2. Vincula o handler em todos os botões com [data-whatsapp]
 * 3. Antes de abrir wa.me, faz dataLayer.push para o GTM
 * 4. Aplica fade-in no botão flutuante após 200ms (para evitar flash)
 *
 * Configuração esperada no HTML:
 *   <body data-tema="implante" data-unidade="mangabeira">
 *   <button data-whatsapp data-cta-position="hero">CTA</button>
 */

(function () {
  'use strict';

  var TEMA = document.body.getAttribute('data-tema') || '';
  var UNIDADE = document.body.getAttribute('data-unidade') || '';

  var MENSAGENS = {
    implante: 'Olá! Vim pelo site e quero agendar minha avaliação gratuita para implante.',
    facetas: 'Olá! Vim pelo site e quero agendar minha avaliação gratuita para lentes de resina.',
    institucional: 'Olá! Vim pelo site e quero agendar uma avaliação gratuita.'
  };

  /**
   * Dispara evento no dataLayer e abre WhatsApp em nova aba.
   * @param {string} numero — número internacional sem máscara (ex: 5583988900095)
   * @param {string} ctaPosition — hero | final | flutuante | unidade
   */
  function trackAndOpenWhatsApp(numero, ctaPosition) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      landing_tema: TEMA,
      landing_unidade: UNIDADE,
      cta_position: ctaPosition || 'desconhecido',
      whatsapp_numero: numero,
      page_url: location.href
    });

    var mensagem = encodeURIComponent(MENSAGENS[TEMA] || MENSAGENS.institucional);
    var url = 'https://wa.me/' + numero + '?text=' + mensagem;

    // Pequeno delay para garantir que o GTM processe o evento
    setTimeout(function () {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 200);
  }

  function bindWhatsAppButtons() {
    var botoes = document.querySelectorAll('[data-whatsapp]');
    botoes.forEach(function (botao) {
      botao.addEventListener('click', function (e) {
        e.preventDefault();
        var numero = botao.getAttribute('data-whatsapp-numero') || botao.getAttribute('data-whatsapp');
        var posicao = botao.getAttribute('data-cta-position') || 'desconhecido';
        trackAndOpenWhatsApp(numero, posicao);
      });
    });
  }

  function fadeInFlutuante() {
    // Delay curto evita flash inicial; a transição em si dura 1.5s (definida no CSS).
    var flutuante = document.querySelector('.whatsapp-flutuante');
    if (!flutuante) return;
    setTimeout(function () {
      flutuante.classList.add('visivel');
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindWhatsAppButtons();
      fadeInFlutuante();
    });
  } else {
    bindWhatsAppButtons();
    fadeInFlutuante();
  }

  // Expor globalmente para uso eventual
  window.MarinhoTrack = { trackAndOpenWhatsApp: trackAndOpenWhatsApp };
})();
```

- [ ] **Step 2: Validar sintaxe do JS**

Run: `node --check Projetos/marinho-odontologia/assets/js/whatsapp.js`
Expected: sem saída (sucesso)

- [ ] **Step 3: Commit**

```bash
git add Projetos/marinho-odontologia/assets/js/whatsapp.js
git commit -m "add: marinho-odontologia/js — handler WhatsApp + tracking GTM"
```

---

## Task 4: Construir Landing PILOTO PRINCIPAL — Implante Dentário Mangabeira

Esta é a landing de referência. As outras 2 (Facetas e Institucional) serão variações dela.

**Files:**
- Create: `Projetos/marinho-odontologia/implante/mangabeira/index.html`

- [ ] **Step 1: Escrever o HTML completo da landing de Implante Mangabeira**

Conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Implante Dentário em João Pessoa — Avaliação Gratuita | Marinho Odontologia Mangabeira</title>
<meta name="description" content="Implante dentário em João Pessoa com avaliação gratuita. Atendimento na unidade Mangabeira com especialistas e tecnologia 3D. +50 mil pacientes · 12 unidades · +10 anos.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/styles.css">

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
</head>

<body data-tema="implante" data-unidade="mangabeira">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<header class="header">
  <div class="container header-inner">
    <div class="header-logo">MARINHO<span> ODONTOLOGIA</span></div>
    <div class="header-unidade">Mangabeira</div>
  </div>
</header>

<!-- BLOCO 1 — HERO -->
<section class="hero">
  <div class="container">
    <h1>Implante Dentário em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita</h1>
    <p class="sub">Recupere a confiança de mastigar, falar e sorrir. Atendimento na unidade Mangabeira, com especialistas e tecnologia 3D.</p>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="hero">
      <span class="icone">📲</span> Quero minha avaliação gratuita
    </button>
    <p class="hero-prova">+10 anos <span>·</span> +50 mil pacientes <span>·</span> 12 unidades</p>
  </div>
</section>

<!-- BLOCO 2 — DOR + IDENTIFICAÇÃO -->
<section class="bloco">
  <div class="container">
    <h2>Cansou de esconder o sorriso?</h2>
    <p class="bloco-texto">Mastigar só de um lado, evitar fotos, cobrir a boca quando ri — isso pode acabar. A avaliação é gratuita e leva poucos minutos pra agendar.</p>
  </div>
</section>

<!-- BLOCO 3 — ANTES E DEPOIS -->
<section class="bloco">
  <div class="container">
    <h2>+50 mil sorrisos transformados</h2>
    <div class="galeria">
      <div class="galeria-item">Foto antes/depois 1</div>
      <div class="galeria-item">Foto antes/depois 2</div>
      <div class="galeria-item">Foto antes/depois 3</div>
      <div class="galeria-item">Foto antes/depois 4</div>
      <div class="galeria-item">Foto antes/depois 5</div>
      <div class="galeria-item">Foto antes/depois 6</div>
    </div>
    <p class="galeria-disclaimer">Resultados individuais. Imagens com autorização dos pacientes.</p>
  </div>
</section>

<!-- BLOCO 4 — POR QUE A MARINHO + FAQ -->
<section class="bloco">
  <div class="container">
    <h2>Por que a Marinho?</h2>
    <ul class="diferenciais">
      <li>Especialistas em implantodontia em todas as unidades</li>
      <li>Tecnologia 3D para diagnóstico preciso</li>
      <li>+10 anos no mercado · +50 mil pacientes</li>
      <li>18x sem juros no cartão · 15x no boleto sem consulta SPC</li>
      <li>Atendimento de emergência</li>
    </ul>

    <div class="faq">
      <details>
        <summary>Quanto tempo leva o tratamento?</summary>
        <div class="resposta">Cada caso é único. Em média, o tratamento completo leva de 3 a 6 meses, mas você só vai saber o tempo exato após sua avaliação gratuita com o especialista.</div>
      </details>
      <details>
        <summary>O implante dói?</summary>
        <div class="resposta">O procedimento é feito com anestesia local e a maioria dos pacientes relata desconforto mínimo, comparável ao de uma extração comum. Você recebe acompanhamento e orientação pós-procedimento.</div>
      </details>
      <details>
        <summary>Tem garantia?</summary>
        <div class="resposta">Sim, oferecemos garantia conforme a complexidade do caso. Os detalhes são apresentados durante a avaliação gratuita, junto com o plano personalizado de tratamento.</div>
      </details>
    </div>
  </div>
</section>

<!-- BLOCO 5 — UNIDADE MANGABEIRA -->
<section class="bloco">
  <div class="container">
    <h2>Marinho Odontologia — Mangabeira</h2>
    <div class="unidade-info">
      <p><span class="icone">📍</span>[Endereço a preencher]</p>
      <p><span class="icone">📱</span>(83) 98890-0095</p>
      <p><span class="icone">🕐</span>[Horário a preencher]</p>
    </div>
    <div class="unidade-mapa">[Mapa Google embed a inserir]</div>
    <div class="unidade-fachada">[Foto da fachada — quando o Patrick enviar]</div>
    <div class="unidade-cta">
      <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="unidade">
        <span class="icone">📲</span> Falar com a unidade
      </button>
    </div>
  </div>
</section>

<!-- BLOCO 6 — CTA FINAL -->
<section class="cta-final">
  <div class="container">
    <h2>Sua avaliação é gratuita.<br>Comece hoje.</h2>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="final">
      <span class="icone">📲</span> Agendar pelo WhatsApp
    </button>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <p><strong>Marinho Odontologia — EPAO 316</strong></p>
    <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
    <div class="outras-unidades">
      <a href="../../implante/epitacio/">Epitácio</a>
      <a href="../../implante/geisel/">Geisel</a>
      <a href="../../implante/centro/">Centro</a>
      <a href="../../implante/campina-grande/">Campina Grande</a>
    </div>
  </div>
</footer>

<!-- WhatsApp flutuante -->
<button class="whatsapp-flutuante" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="flutuante" aria-label="Falar pelo WhatsApp">
  💬
</button>

<script src="../../assets/js/whatsapp.js"></script>
</body>
</html>
```

- [ ] **Step 2: Validar HTML é parseável (servir local e abrir no navegador)**

Run em PowerShell ou bash, dentro da pasta `Projetos/marinho-odontologia`:
```bash
python -m http.server 8080
```
Abrir no navegador: `http://localhost:8080/implante/mangabeira/`

Verificar visualmente:
- Página carrega sem erros no console (F12)
- 6 blocos visíveis na ordem: Hero → Dor → Antes/Depois → Por que/FAQ → Unidade → CTA Final
- Botão WhatsApp flutuante aparece no canto inferior direito após ~300ms (com fade-in)
- Footer mostra EPAO 316 + CRO 6529
- Clicar em qualquer botão WhatsApp abre `wa.me/5583988900095` em nova aba
- Console mostra `dataLayer.push` com `event: 'whatsapp_click'`, `landing_tema: 'implante'`, `landing_unidade: 'mangabeira'`

- [ ] **Step 3: Testar responsivo no DevTools (mobile + desktop)**

No DevTools (F12), alternar entre:
- iPhone SE (375px): tudo legível, CTA hero não corta
- iPad (768px): galeria expande, especialidades em 4 colunas (não se aplica aqui mas testar)
- Desktop (1280px): conteúdo centralizado em max-width 960px

- [ ] **Step 4: Commit**

```bash
git add Projetos/marinho-odontologia/implante/mangabeira/index.html
git commit -m "add: marinho-odontologia — landing piloto Implante Mangabeira"
```

---

## Task 5: Construir Landing — Facetas em Resina Mangabeira

Adapta a estrutura da Task 4. Diferenças críticas:
- Tema = `facetas`
- H1 e copy mudam
- **Bloco 4 (diferenciais) NÃO menciona parcelamento**
- FAQ tem 3 perguntas diferentes

**Files:**
- Create: `Projetos/marinho-odontologia/facetas/mangabeira/index.html`

- [ ] **Step 1: Copiar estrutura da Task 4 e adaptar conteúdo**

Conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lentes de Resina em João Pessoa — Avaliação Gratuita | Marinho Odontologia Mangabeira</title>
<meta name="description" content="Lentes de resina em João Pessoa com avaliação gratuita. Especialistas em estética dental na unidade Mangabeira, com escaneamento 3D. +50 mil pacientes · 12 unidades.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/styles.css">

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
</head>

<body data-tema="facetas" data-unidade="mangabeira">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<header class="header">
  <div class="container header-inner">
    <div class="header-logo">MARINHO<span> ODONTOLOGIA</span></div>
    <div class="header-unidade">Mangabeira</div>
  </div>
</header>

<!-- BLOCO 1 — HERO -->
<section class="hero">
  <div class="container">
    <h1>Lentes de Resina em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita</h1>
    <p class="sub">Transforme seu sorriso em poucas sessões. Avaliação com especialista em estética, na unidade Mangabeira.</p>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="hero">
      <span class="icone">📲</span> Quero minha avaliação gratuita
    </button>
    <p class="hero-prova">+10 anos <span>·</span> +50 mil pacientes <span>·</span> 12 unidades</p>
  </div>
</section>

<!-- BLOCO 2 — DOR + IDENTIFICAÇÃO -->
<section class="bloco">
  <div class="container">
    <h2>Você sorri ou só "abre a boca"?</h2>
    <p class="bloco-texto">Cobrir o sorriso na foto, evitar rir aberto, achar que dente perfeito é só pra famoso — isso pode mudar ainda este mês.</p>
  </div>
</section>

<!-- BLOCO 3 — ANTES E DEPOIS -->
<section class="bloco">
  <div class="container">
    <h2>Sorrisos que mudaram tudo</h2>
    <div class="galeria">
      <div class="galeria-item">Foto antes/depois 1</div>
      <div class="galeria-item">Foto antes/depois 2</div>
      <div class="galeria-item">Foto antes/depois 3</div>
      <div class="galeria-item">Foto antes/depois 4</div>
      <div class="galeria-item">Foto antes/depois 5</div>
      <div class="galeria-item">Foto antes/depois 6</div>
    </div>
    <p class="galeria-disclaimer">Resultados individuais. Imagens com autorização dos pacientes.</p>
  </div>
</section>

<!-- BLOCO 4 — POR QUE A MARINHO + FAQ (SEM parcelamento — não se aplica a facetas) -->
<section class="bloco">
  <div class="container">
    <h2>Por que a Marinho?</h2>
    <ul class="diferenciais">
      <li>Especialistas em estética dental em todas as unidades</li>
      <li>Escaneamento 3D — você vê o resultado antes de começar</li>
      <li>+10 anos no mercado · +50 mil pacientes</li>
      <li>12 unidades — atendimento próximo de você</li>
      <li>Procedimento indolor com anestesia local</li>
    </ul>

    <div class="faq">
      <details>
        <summary>Quanto tempo dura uma lente de resina?</summary>
        <div class="resposta">Com manutenção e cuidados adequados, as lentes de resina podem durar de 3 a 5 anos. O resultado depende dos hábitos do paciente — alimentação, higiene e visitas periódicas ao dentista.</div>
      </details>
      <details>
        <summary>Vou precisar desgastar meus dentes?</summary>
        <div class="resposta">Diferente das lentes de porcelana, as lentes de resina geralmente não exigem desgaste do dente, ou exigem um desgaste mínimo. A avaliação gratuita é o momento de entender exatamente o que se aplica ao seu caso.</div>
      </details>
      <details>
        <summary>A lente escurece com o tempo?</summary>
        <div class="resposta">Com o passar do tempo e dependendo dos hábitos (café, vinho, fumo), pode haver alteração de cor. Por isso recomendamos polimento periódico — um procedimento simples que mantém o brilho do sorriso.</div>
      </details>
    </div>
  </div>
</section>

<!-- BLOCO 5 — UNIDADE MANGABEIRA -->
<section class="bloco">
  <div class="container">
    <h2>Marinho Odontologia — Mangabeira</h2>
    <div class="unidade-info">
      <p><span class="icone">📍</span>[Endereço a preencher]</p>
      <p><span class="icone">📱</span>(83) 98890-0095</p>
      <p><span class="icone">🕐</span>[Horário a preencher]</p>
    </div>
    <div class="unidade-mapa">[Mapa Google embed a inserir]</div>
    <div class="unidade-fachada">[Foto da fachada — quando o Patrick enviar]</div>
    <div class="unidade-cta">
      <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="unidade">
        <span class="icone">📲</span> Falar com a unidade
      </button>
    </div>
  </div>
</section>

<!-- BLOCO 6 — CTA FINAL -->
<section class="cta-final">
  <div class="container">
    <h2>Volte a sorrir do jeito que<br>você sempre sonhou.</h2>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="final">
      <span class="icone">📲</span> Agendar pelo WhatsApp
    </button>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <p><strong>Marinho Odontologia — EPAO 316</strong></p>
    <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
    <div class="outras-unidades">
      <a href="../../facetas/epitacio/">Epitácio</a>
      <a href="../../facetas/geisel/">Geisel</a>
      <a href="../../facetas/centro/">Centro</a>
      <a href="../../facetas/campina-grande/">Campina Grande</a>
    </div>
  </div>
</footer>

<!-- WhatsApp flutuante -->
<button class="whatsapp-flutuante" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="flutuante" aria-label="Falar pelo WhatsApp">
  💬
</button>

<script src="../../assets/js/whatsapp.js"></script>
</body>
</html>
```

- [ ] **Step 2: Validar HTML servindo local**

Acessar `http://localhost:8080/facetas/mangabeira/` e verificar:
- H1 mostra "Lentes de Resina em João Pessoa"
- Bloco 4 (Por que a Marinho) **NÃO menciona "18x", "boleto", "SPC", "parcelamento"** (busca visual)
- 3 FAQs específicos de facetas (duração, desgaste, escurecimento)
- Tracking dispara com `landing_tema: 'facetas'` no console
- Visual idêntico à landing de implante (mesmo CSS, layout)

Run no terminal:
```bash
grep -i "boleto\|parcelamento\|SPC\|18x\|15x" Projetos/marinho-odontologia/facetas/mangabeira/index.html
```
Expected: nenhum resultado (essas palavras NÃO devem aparecer na landing de facetas)

- [ ] **Step 3: Commit**

```bash
git add Projetos/marinho-odontologia/facetas/mangabeira/index.html
git commit -m "add: marinho-odontologia — landing piloto Facetas Mangabeira"
```

---

## Task 6: Construir Landing — Institucional Mangabeira

Adapta a estrutura, mas o **Bloco 2 muda de "Dor" para "Especialidades"** (grid de 8 ícones).

**Files:**
- Create: `Projetos/marinho-odontologia/institucional/mangabeira/index.html`

- [ ] **Step 1: Escrever HTML adaptado**

Conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clínica Odontológica em João Pessoa — Avaliação Gratuita | Marinho Odontologia Mangabeira</title>
<meta name="description" content="Clínica odontológica em João Pessoa com avaliação gratuita. Especialistas em todas as áreas na unidade Mangabeira. Atendimento de emergência. +50 mil pacientes · 12 unidades.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/styles.css">

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
</head>

<body data-tema="institucional" data-unidade="mangabeira">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<header class="header">
  <div class="container header-inner">
    <div class="header-logo">MARINHO<span> ODONTOLOGIA</span></div>
    <div class="header-unidade">Mangabeira</div>
  </div>
</header>

<!-- BLOCO 1 — HERO -->
<section class="hero">
  <div class="container">
    <h1>Clínica Odontológica em <span class="destaque">João Pessoa</span><br>Avaliação Gratuita</h1>
    <p class="sub">Especialistas em todas as áreas, na unidade Mangabeira. Atendimento de emergência e tecnologia avançada.</p>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="hero">
      <span class="icone">📲</span> Agendar pelo WhatsApp
    </button>
    <p class="hero-prova">+10 anos <span>·</span> +50 mil pacientes <span>·</span> 12 unidades</p>
  </div>
</section>

<!-- BLOCO 2 — ESPECIALIDADES (substitui o "Dor" no institucional) -->
<section class="bloco">
  <div class="container">
    <h2>Tudo que sua família precisa em um só lugar</h2>
    <div class="especialidades">
      <div class="especialidade"><span class="icone">🦷</span>Implantodontia</div>
      <div class="especialidade"><span class="icone">💎</span>Estética dental</div>
      <div class="especialidade"><span class="icone">🪥</span>Ortodontia</div>
      <div class="especialidade"><span class="icone">👶</span>Odontopediatria</div>
      <div class="especialidade"><span class="icone">🩹</span>Canal</div>
      <div class="especialidade"><span class="icone">🦴</span>Cirurgia oral</div>
      <div class="especialidade"><span class="icone">⚡</span>Emergência</div>
      <div class="especialidade"><span class="icone">🔬</span>Periodontia</div>
    </div>
  </div>
</section>

<!-- BLOCO 3 — ANTES E DEPOIS -->
<section class="bloco">
  <div class="container">
    <h2>+50 mil sorrisos transformados</h2>
    <div class="galeria">
      <div class="galeria-item">Foto antes/depois 1</div>
      <div class="galeria-item">Foto antes/depois 2</div>
      <div class="galeria-item">Foto antes/depois 3</div>
      <div class="galeria-item">Foto antes/depois 4</div>
      <div class="galeria-item">Foto antes/depois 5</div>
      <div class="galeria-item">Foto antes/depois 6</div>
    </div>
    <p class="galeria-disclaimer">Resultados individuais. Imagens com autorização dos pacientes.</p>
  </div>
</section>

<!-- BLOCO 4 — POR QUE A MARINHO + FAQ -->
<section class="bloco">
  <div class="container">
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
        <div class="resposta">Sim, oferecemos atendimento de emergência na unidade Mangabeira. Para casos urgentes, fale conosco diretamente pelo WhatsApp para agendamento prioritário.</div>
      </details>
      <details>
        <summary>Quanto custa uma consulta?</summary>
        <div class="resposta">A avaliação inicial é 100% gratuita. Você sai dela com um plano personalizado e o orçamento exato do tratamento, sem compromisso.</div>
      </details>
    </div>
  </div>
</section>

<!-- BLOCO 5 — UNIDADE MANGABEIRA -->
<section class="bloco">
  <div class="container">
    <h2>Marinho Odontologia — Mangabeira</h2>
    <div class="unidade-info">
      <p><span class="icone">📍</span>[Endereço a preencher]</p>
      <p><span class="icone">📱</span>(83) 98890-0095</p>
      <p><span class="icone">🕐</span>[Horário a preencher]</p>
    </div>
    <div class="unidade-mapa">[Mapa Google embed a inserir]</div>
    <div class="unidade-fachada">[Foto da fachada — quando o Patrick enviar]</div>
    <div class="unidade-cta">
      <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="unidade">
        <span class="icone">📲</span> Falar com a unidade
      </button>
    </div>
  </div>
</section>

<!-- BLOCO 6 — CTA FINAL -->
<section class="cta-final">
  <div class="container">
    <h2>Sua saúde bucal merece<br>quem entende.</h2>
    <button class="btn-whatsapp" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="final">
      <span class="icone">📲</span> Agendar pelo WhatsApp
    </button>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <p><strong>Marinho Odontologia — EPAO 316</strong></p>
    <p>Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529</p>
    <p class="regulatorio">Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.</p>
    <div class="outras-unidades">
      <a href="../../institucional/epitacio/">Epitácio</a>
      <a href="../../institucional/geisel/">Geisel</a>
      <a href="../../institucional/centro/">Centro</a>
      <a href="../../institucional/campina-grande/">Campina Grande</a>
    </div>
  </div>
</footer>

<!-- WhatsApp flutuante -->
<button class="whatsapp-flutuante" data-whatsapp data-whatsapp-numero="5583988900095" data-cta-position="flutuante" aria-label="Falar pelo WhatsApp">
  💬
</button>

<script src="../../assets/js/whatsapp.js"></script>
</body>
</html>
```

- [ ] **Step 2: Validar visualmente**

Acessar `http://localhost:8080/institucional/mangabeira/` e verificar:
- H1 "Clínica Odontológica em João Pessoa"
- Bloco 2 mostra **grid de 8 especialidades** (Implantodontia, Estética dental, Ortodontia, Odontopediatria, Canal, Cirurgia oral, Emergência, Periodontia)
- No mobile: grid em 2 colunas; no desktop (768px+): grid em 4 colunas
- Tracking dispara com `landing_tema: 'institucional'` no console
- Footer regulatório presente

- [ ] **Step 3: Commit**

```bash
git add Projetos/marinho-odontologia/institucional/mangabeira/index.html
git commit -m "add: marinho-odontologia — landing piloto Institucional Mangabeira"
```

---

## Task 7: Criar README explicativo do projeto

**Files:**
- Create: `Projetos/marinho-odontologia/README.md`

- [ ] **Step 1: Escrever o README**

Conteúdo:

```markdown
# Marinho Odontologia — Landing Pages

Site de 15 landing pages voltadas a campanhas de Google Ads, com conversão via WhatsApp para a clínica Marinho Odontologia.

## Estrutura

- 3 temas: Institucional, Facetas em Resina, Implante Dentário
- 5 unidades: Mangabeira, Epitácio, Geisel, Centro (João Pessoa) + Campina Grande
- Total: 15 landings + 1 hub

## Status

- ✅ Fase 1 — Piloto Mangabeira (3 landings) — pronto para revisão
- ⏳ Fase 2 — Replicar para outras 4 unidades
- ⏳ Fase 3 — Hub `index.html`
- ⏳ Fase 4 — Deploy GitHub Pages (em conta nova do cliente)
- ⏳ Fase 5 — Configuração de campanhas Google Ads

## Como rodar local

```bash
cd Projetos/marinho-odontologia
python -m http.server 8080
```

Acessar:
- http://localhost:8080/implante/mangabeira/
- http://localhost:8080/facetas/mangabeira/
- http://localhost:8080/institucional/mangabeira/

## Estrutura de pastas

```
marinho-odontologia/
├── data/unidades.json           # Dados centralizados das 5 unidades
├── assets/
│   ├── css/styles.css           # Design system único
│   └── js/whatsapp.js           # Tracking GTM + handler WhatsApp
├── implante/mangabeira/         # Landing piloto 1
├── facetas/mangabeira/          # Landing piloto 2
├── institucional/mangabeira/    # Landing piloto 3
├── unidades/                    # Pasta para fotos por unidade (a preencher)
├── branding/                    # Documentação de marca, paleta, regulatório
└── docs/superpowers/            # Spec e plano de implementação
```

## Tracking

- GTM Container: `GTM-5NKWFG22`
- Evento: `whatsapp_click` (todos os botões WhatsApp disparam)
- Estratégia: Caminho A (1 conversão única no Google Ads inicialmente)

## Conformidade Regulatória

Todas as landings exibem no footer:
- EPAO 316
- RT: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529
- Disclaimer de imagens meramente ilustrativas

## Deploy

⚠️ **Não publicar no GitHub atual.** Patrick conectará outra conta para o deploy final.
```

- [ ] **Step 2: Commit**

```bash
git add Projetos/marinho-odontologia/README.md
git commit -m "add: marinho-odontologia — README do projeto"
```

---

## Task 8: Validação cruzada — checklist final do piloto

**Files:**
- (sem arquivo — checklist manual)

- [ ] **Step 1: Iniciar servidor local e abrir as 3 landings**

```bash
cd Projetos/marinho-odontologia
python -m http.server 8080
```

Abrir as 3 URLs em abas separadas:
- http://localhost:8080/implante/mangabeira/
- http://localhost:8080/facetas/mangabeira/
- http://localhost:8080/institucional/mangabeira/

- [ ] **Step 2: Conferir checklist visual de cada landing**

Para cada uma das 3 landings, verificar:

- [ ] Header com logo "MARINHO ODONTOLOGIA" + "Mangabeira"
- [ ] H1 correto (Implante / Lentes / Clínica)
- [ ] Botão verde de WhatsApp no hero
- [ ] 6 blocos visíveis na ordem correta
- [ ] Galeria de antes/depois com 6 placeholders quadrados
- [ ] Disclaimer "Resultados individuais..." abaixo da galeria
- [ ] Bloco "Por que a Marinho?" com 5 itens (lista com ✓ azul)
- [ ] FAQ com 3 perguntas em accordion (clicar abre/fecha)
- [ ] Bloco "Marinho Odontologia — Mangabeira" com endereço/WhatsApp/horário
- [ ] CTA final com fundo azul escuro e botão verde
- [ ] Footer com EPAO 316 + CRO 6529 + disclaimer + 4 outras unidades
- [ ] WhatsApp flutuante no canto inferior direito (verde, com pulse)

- [ ] **Step 3: Conferir tracking no DevTools**

Para cada landing, abrir Console (F12) e digitar:
```javascript
window.dataLayer
```
Expected: array com pelo menos 1 evento (gtm.js)

Clicar em **um** botão WhatsApp (qualquer um) — antes que abra a aba, observar Console:
```javascript
window.dataLayer
```
Expected: novo objeto com `event: 'whatsapp_click'`, `landing_tema: '<correto>'`, `landing_unidade: 'mangabeira'`, `cta_position: '<correto>'`, `whatsapp_numero: '5583988900095'`

- [ ] **Step 4: Conferir mobile**

No DevTools, ativar modo mobile (Ctrl+Shift+M), selecionar iPhone SE (375px). Verificar nas 3 landings:
- Nada quebra de layout
- Texto legível (não corta)
- Botões WhatsApp ocupam largura confortável (não 100% colado nas bordas)
- Galeria continua em grid (mesmo que 2 colunas)
- Footer não vira coluna esmagada

- [ ] **Step 5: Diferenciação por tema**

Verificar:
- **Implante:** menciona "implantodontia", "tecnologia 3D", "atendimento de emergência" e parcelamento
- **Facetas:** **NÃO** menciona parcelamento (rodar `grep -i "boleto\|parcelamento\|SPC\|18x\|15x" facetas/mangabeira/index.html` — sem resultado)
- **Institucional:** Bloco 2 é grid de 8 especialidades (não tem texto de "dor")

- [ ] **Step 6: Commit final do piloto**

```bash
git add Projetos/marinho-odontologia
git commit --allow-empty -m "milestone: marinho-odontologia — Fase 1 piloto Mangabeira concluído"
```

---

## Próximos passos (após aprovação visual do Patrick)

Não fazem parte desta fase, ficam registrados aqui:

- **Fase 2:** Replicar 3 landings × 4 unidades = 12 landings (Epitácio, Geisel, Centro, Campina Grande). Adaptar somente:
  - Bloco 1 sub (nome do bairro/cidade)
  - Bloco 5 (dados da unidade)
  - WhatsApp `data-whatsapp-numero` em todos os botões
  - Para Campina Grande: trocar "João Pessoa" por "Campina Grande" no H1
- **Fase 3:** Criar `index.html` (hub de seleção de unidade)
- **Fase 4:** Deploy GitHub Pages (conta NOVA do cliente, não a atual do Patrick)
- **Fase 5:** Configurar campanhas Google Ads (palavras-chave, anúncios, lances)
