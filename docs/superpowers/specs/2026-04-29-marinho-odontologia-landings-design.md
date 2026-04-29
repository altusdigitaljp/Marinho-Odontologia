# Marinho Odontologia — Landing Pages para Google Ads

**Data:** 2026-04-29
**Cliente:** Marinho Odontologia (Vértice)
**Objetivo:** 15 landing pages otimizadas para Google Ads com foco em conversão via WhatsApp

---

## 1. Visão Geral

Construir 15 landing pages estáticas, hospedadas no GitHub Pages, organizadas em 3 temas (Institucional, Facetas em Resina, Implante Dentário) × 5 unidades (Mangabeira, Epitácio, Geisel, Centro, Campina Grande). Cada landing é otimizada para um par tema+localização, alimentando campanhas de Google Ads com Índice de Qualidade alto e convertendo o lead em conversa no WhatsApp da unidade correta.

**Princípio:** uma landing por par tema+unidade, padrão visual unificado, conteúdo enxuto e mobile-first, copy emocional dentro dos limites do CFO/CRO.

---

## 2. Identidade Visual

### Paleta oficial (PDF de marca)

| Cor | HEX | Uso |
|---|---|---|
| Azul Marinho Escuríssimo | `#0C1B27` | Fundo escuro, footer |
| Azul Petróleo | `#00577B` | Headlines em fundo claro |
| Azul Marinho Médio (PRIMÁRIA) | `#007CC3` | Cor da marca, acentos |
| Azul Claro | `#75C5F0` | Detalhes, ícones |
| Cinza Claríssimo | `#E7E8EA` | Backgrounds suaves, divisores |
| Branco | `#FFFFFF` | Fundo principal |
| Verde WhatsApp | `#25D366` | CTAs principais (todos os botões de WhatsApp) |

### Tipografia

- **Headlines:** Montserrat (700/800/900) — geometria próxima ao logo
- **Corpo:** Inter (400/500/600) — alta legibilidade no mobile
- Carregadas via Google Fonts com `display=swap` para não bloquear renderização

### Logo

Disponível em `branding/` (PDF original). Versão escura (fundo escuro) e clara (fundo branco).

---

## 3. Arquitetura

### Estrutura de pastas (1 repositório, 1 domínio)

```
marinho-odontologia/  (repo no GitHub)
│
├── index.html                        # Hub: redireciona pra unidade certa
├── institucional/
│   ├── mangabeira/index.html
│   ├── epitacio/index.html
│   ├── geisel/index.html
│   ├── centro/index.html
│   └── campina-grande/index.html
├── facetas/
│   └── (mesma estrutura)
├── implante/
│   └── (mesma estrutura)
│
├── assets/
│   ├── css/styles.css                # CSS único compartilhado
│   ├── js/whatsapp.js                # Handler único de cliques no WhatsApp
│   ├── img/logo.svg, logo-escuro.svg
│   ├── img/icons/                    # Ícones de especialidades
│   └── fonts/                        # (se locais; preferir Google Fonts)
│
├── data/
│   └── unidades.json                 # Fonte única de verdade dos dados
│
└── README.md
```

### Stack técnica

- HTML estático puro (sem framework)
- CSS Grid + Flexbox, mobile-first
- Vanilla JS (sem dependências)
- 3 templates HTML base (institucional, facetas, implante) replicados nas 5 pastas de unidade
- GitHub Pages para hospedagem
- Domínio próprio (a ser configurado em conta nova de GitHub do cliente)

### Por que essa arquitetura ajuda no Quality Score

1. URL = palavra-chave + localização (`/implante/mangabeira`)
2. Title, H1 e copy alinhados com o termo do anúncio
3. HTML estático puro = velocidade alta, especialmente no mobile
4. Padrão visual unificado entre as 15 landings (familiaridade)

---

## 4. Estrutura Interna das Landings (Versão Enxuta)

Cada landing tem **6 blocos** + footer + botão WhatsApp flutuante. Total visado: ~45 segundos de leitura no mobile.

### Esqueleto comum (todas as 15 landings)

```
1. HERO
   ├─ H1 (palavra-chave + cidade)
   ├─ Sub (oferta + bairro)
   ├─ CTA WhatsApp (verde grande)
   └─ Linha de prova social

2. DOR + IDENTIFICAÇÃO (curto, 3 linhas)

3. ANTES E DEPOIS (galeria 4-6 fotos)

4. POR QUE A MARINHO + FAQ FUNDIDO
   ├─ Lista de 5 diferenciais
   └─ Accordion com 3 perguntas

5. UNIDADE [BAIRRO] (PERSONALIZADO)
   ├─ Endereço + WhatsApp + horário
   ├─ Mapa Google embed
   └─ Foto da fachada (placeholder até Patrick enviar)

6. CTA FINAL
   └─ H2 + Botão WhatsApp grande

FOOTER (idêntico em todas)
   ├─ EPAO 316
   ├─ RT: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529
   ├─ Disclaimer de imagens
   └─ Links: outras 4 unidades + Política de Privacidade

+ WhatsApp flutuante (canto inferior direito)
   └─ Aparece IMEDIATAMENTE com fade-in de 1.5s
   └─ Pulse sutil a cada 5s
```

### Diferenças por tema

| Bloco | Implante | Facetas | Institucional |
|---|---|---|---|
| **H1** | "Implante Dentário em João Pessoa — Avaliação Gratuita" | "Lentes de Resina em João Pessoa — Avaliação Gratuita" | "Clínica Odontológica em João Pessoa — Avaliação Gratuita" |
| **Tom** | Funcional + emocional (mastigar, sorrir) | Estético + autoestima | Confiança + abrangência |
| **Bloco 2 (dor)** | "Cansou de esconder o sorriso?" | "Você sorri ou só 'abre a boca'?" | (substituído por grid de especialidades) |
| **Antes & Depois** | Foco em mastigação/casos visíveis | Foco em estética dental | Galeria mista |
| **Bloco 4 — diferenciais** | Inclui "18x cartão · 15x boleto sem SPC" | NÃO menciona parcelamento | Inclui "18x cartão · 15x boleto sem SPC" |
| **FAQ** | Tempo? Dói? Garantia? | Dura? Desgasta? Escurece? | Convênio? Emergência? Quanto custa consulta? |
| **CTA final** | "Sua avaliação é gratuita. Comece hoje." | "Volte a sorrir do jeito que você sempre sonhou." | "Sua saúde bucal merece quem entende." |

### Diferenças por unidade

Apenas o **Bloco 5** muda entre unidades do mesmo tema:
- Endereço completo
- Número de WhatsApp
- Horário de funcionamento
- Mapa Google embed
- Foto da fachada (a ser enviada pelo Patrick por unidade)
- Foto da equipe (a ser enviada pelo Patrick por unidade)

H1 é "...em João Pessoa" para 4 das 5 unidades; "...em Campina Grande" apenas para Campina Grande.

---

## 5. Dados das Unidades (`data/unidades.json`)

```json
{
  "mangabeira": {
    "slug": "mangabeira",
    "cidade": "João Pessoa",
    "bairro": "Mangabeira",
    "nomeCompleto": "Marinho Odontologia — Mangabeira",
    "whatsapp": "5583988900095",
    "whatsappFormatado": "(83) 98890-0095",
    "endereco": "[a preencher]",
    "horario": "[a preencher]",
    "mapaEmbed": "[URL embed Google Maps]"
  },
  "epitacio": {
    "slug": "epitacio",
    "cidade": "João Pessoa",
    "bairro": "Avenida Epitácio Pessoa",
    "nomeCompleto": "Marinho Odontologia — Epitácio",
    "whatsapp": "5583982700109",
    "whatsappFormatado": "(83) 98270-0109",
    "endereco": "[a preencher]",
    "horario": "[a preencher]",
    "mapaEmbed": "[URL embed]"
  },
  "geisel": {
    "slug": "geisel",
    "cidade": "João Pessoa",
    "bairro": "Geisel",
    "nomeCompleto": "Marinho Odontologia — Geisel",
    "whatsapp": "5583982700110",
    "whatsappFormatado": "(83) 98270-0110",
    "endereco": "[a preencher]",
    "horario": "[a preencher]",
    "mapaEmbed": "[URL embed]"
  },
  "centro": {
    "slug": "centro",
    "cidade": "João Pessoa",
    "bairro": "Centro",
    "nomeCompleto": "Marinho Odontologia — Centro",
    "whatsapp": "5583980255117",
    "whatsappFormatado": "(83) 98025-5117",
    "endereco": "[a preencher]",
    "horario": "[a preencher]",
    "mapaEmbed": "[URL embed]"
  },
  "campina-grande": {
    "slug": "campina-grande",
    "cidade": "Campina Grande",
    "bairro": "[a preencher]",
    "nomeCompleto": "Marinho Odontologia — Campina Grande",
    "whatsapp": "5583988900115",
    "whatsappFormatado": "(83) 98890-0115",
    "endereco": "[a preencher]",
    "horario": "[a preencher]",
    "mapaEmbed": "[URL embed]"
  }
}
```

Os campos `[a preencher]` serão completados pelo Patrick antes do deploy. As landings devem renderizar sem quebrar mesmo com placeholder, com aviso visual sutil pro Patrick perceber o que falta.

---

## 6. Tracking — Google Tag Manager

### Container

`GTM-5NKWFG22` — instalado em **todas as 16 páginas** (15 landings + index hub).

### Snippet head (todas as páginas)

```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
```

### Snippet body (logo após `<body>`)

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### Evento de conversão `whatsapp_click`

Disparado em **todo botão de WhatsApp** antes de abrir `wa.me`. Posições onde o botão aparece:

- `hero` — CTA principal acima da dobra
- `final` — CTA do bloco 6 (CTA final)
- `flutuante` — botão fixo no canto inferior direito
- `unidade` — botão dentro do bloco 5 (junto do número formatado)

```js
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'whatsapp_click',
  landing_tema: 'implante',         // 'institucional' | 'facetas' | 'implante'
  landing_unidade: 'mangabeira',
  cta_position: 'hero',              // 'hero' | 'final' | 'flutuante' | 'unidade'
  whatsapp_numero: '5583988900095',
  page_url: location.href
});
```

### Estratégia de conversão escolhida (Caminho A)

- 1 conversão única no Google Ads ("Lead WhatsApp Marinho")
- Os parâmetros `landing_tema` e `landing_unidade` ficam no dataLayer pra relatório, não pra otimização
- Migração futura para Caminho B (15 conversões separadas) é possível **sem mexer no código** — só configura no GTM/Google Ads

### Implementação técnica

- Arquivo único `assets/js/whatsapp.js` com função `trackAndOpenWhatsApp(numero, ctaPosition)`
- Função lê `data-tema` e `data-unidade` de meta tags ou data attributes do `<body>`
- Faz `dataLayer.push` → aguarda 200ms → abre `wa.me/{numero}?text={mensagem}` em nova aba
- Mensagem padrão por tema:
  - Implante: "Olá! Vim pelo site e quero agendar minha avaliação gratuita para implante."
  - Facetas: "Olá! Vim pelo site e quero agendar minha avaliação gratuita para lentes de resina."
  - Institucional: "Olá! Vim pelo site e quero agendar uma avaliação gratuita."

---

## 7. Conformidade Regulatória (CFO/CRO)

### Identificação obrigatória no footer de todas as 16 páginas (15 landings + index hub)

```
Marinho Odontologia — EPAO 316
Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529
Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.
```

### Regras de copy aplicadas

**NÃO usar:**
- "Garantimos resultado" / "100% garantido"
- "Preço mais baixo da cidade" / promoções
- Antes/depois com promessa de cura
- Sensacionalismo
- Comparação direta com concorrentes
- Concursos, sorteios, brindes vinculados a tratamento

**PODE usar (com cuidado):**
- Antes/Depois com nome do paciente, autorização, disclaimer
- Especialidades exercidas
- "Avaliação gratuita" (consulta, não tratamento)
- Tecnologia disponível
- Tempo de mercado e número de pacientes (com prova)
- CRO de cada profissional citado
- Depoimentos com autorização

### Linha financeira

- **NÃO destacar** parcelamento como elemento principal (sem banners, sem hero, sem headline)
- **PODE mencionar** no corpo da landing (em listas de diferenciais ou FAQ)
- Texto: "18x sem juros no cartão · 15x no boleto sem consulta ao SPC"
- **Não usar 12x no boleto** (não existe)
- **Não usar parcelamento na landing de Facetas** (Marinho não oferece para esse procedimento)

---

## 8. Prova Social Disponível

✅ **Pode usar:**
- "+10 anos de mercado"
- "+50 mil pacientes atendidos"
- "12 unidades na rede Marinho"

❌ **Não usar:** "1 milhão de pacientes" (exagero, conforme correção do Patrick)

---

## 9. Diferenciais Comerciais (priorizados na copy)

- ✅ **Avaliação gratuita** (especialmente forte para implante)
- ✅ Especialistas em todas as áreas
- ✅ Tecnologia avançada (escaneamento 3D, raio-x digital, exames no local)
- ✅ Atendimento de emergência
- ✅ 18x sem juros no cartão (em corpo, não em destaque) — exceto facetas
- ✅ 15x no boleto sem consulta SPC (em corpo, não em destaque) — exceto facetas

❌ **Não oferece (não prometer):**
- Plano odontológico próprio
- Convênios (Unimed, etc.)
- Atendimento amplo aos fins de semana

---

## 10. Tom de Voz e Público

**Tom:** emocional, focado em transformação. Linha "Volte a sorrir" funciona. Falar com o coração, não com termos técnicos. Storytelling de transformação e autoestima.

**Tom agressivo dentro dos limites éticos do CFO:**
- ✅ "Pare de esconder o sorriso. Comece sua transformação ainda este mês."
- ✅ "Cansou de esconder o sorriso?"
- ✅ "+50 mil pessoas voltaram a sorrir. Você pode ser o próximo."

**Público-alvo:**
- Institucional: geral (todas as idades, todas as classes)
- Implante: 30+, classe C/B (foco em mastigação e estética madura)
- Facetas: classe média / média alta (a classe muito alta tende a procurar outras clínicas; o foco da Marinho é a classe média que quer um sorriso melhor com preço acessível)

---

## 11. Plano de Produção

### Fase 1 — Landing Piloto (Mangabeira)

Construir as 3 landings da Mangabeira primeiro (institucional, facetas, implante) como piloto.
Patrick revisa, ajusta e aprova.

### Fase 2 — Replicar para outras 4 unidades

Com o piloto aprovado, replicar para Epitácio, Geisel, Centro e Campina Grande.
Ajustes pequenos: H1 (cidade no caso de Campina), Bloco 5 (dados da unidade).

### Fase 3 — Hub e index.html

Criar a página `index.html` que serve de hub para escolha de unidade (caso o usuário acesse `marinho.com.br` direto, sem passar por anúncio).

### Fase 4 — Deploy e configuração

- Subir repo no GitHub (conta nova do Patrick)
- Configurar GitHub Pages
- Apontar domínio próprio
- Configurar GTM (criar trigger e tag de conversão)
- Testes de conversão antes de subir os anúncios

### Fase 5 (depois das landings prontas) — Google Ads

- Definir 5 palavras-chave dominantes por tema
- Estruturar grupos de anúncio (1 por unidade × tema = 15 grupos)
- Escrever os textos de anúncio (RSAs)
- Configurar geo-segmentação (raios por unidade)
- Lances e orçamento

---

## 12. Assets a Receber do Patrick

Antes do deploy, o Patrick precisa fornecer:

### Por unidade (em `unidades/[unidade]/`)

- Endereço completo
- Horário de funcionamento
- URL do embed do Google Maps
- Foto da fachada (`fachada/`)
- Foto da equipe local (`equipe/`)

### Compartilhado entre todas

- 4-6 fotos antes/depois autorizadas para implante (em `assets/img/antes-depois/implante/`)
- 4-6 fotos antes/depois autorizadas para facetas (em `assets/img/antes-depois/facetas/`)
- 4-6 fotos antes/depois variadas para institucional (em `assets/img/antes-depois/institucional/`)
- Logo SVG ou PNG em alta resolução (já temos o PDF — converter)
- Política de privacidade (texto)

Enquanto Patrick não enviar, usaremos placeholders identificáveis para não bloquear a construção.

---

## 13. Critérios de Sucesso

### Critérios técnicos (objetivos)

- Lighthouse Performance ≥ 90 no mobile
- Lighthouse Best Practices ≥ 95
- Lighthouse SEO ≥ 95
- LCP ≤ 2.5s no mobile (4G)
- CLS ≤ 0.1
- Funciona em Chrome, Safari iOS, Samsung Internet (3 navegadores principais do tráfego mobile BR)

### Critérios de negócio (subjetivos)

- Patrick aprova a landing piloto da Mangabeira sem alterações estruturais
- Conversão WhatsApp dispara corretamente no GTM (testado em 5 cliques de cada tipo)
- Footer regulatório aparece em todas as 16 páginas (15 landings + index hub)
- Cada landing carrega o WhatsApp da unidade certa
- Botão flutuante aparece imediatamente com animação suave

---

## 14. Fora de escopo (NÃO faremos nesse projeto)

- Estrutura completa de campanhas Google Ads (fica para fase posterior)
- Backend ou CMS (tudo HTML estático)
- Formulário de contato com captura de email (CTA é apenas WhatsApp)
- Blog ou conteúdo educativo
- Site institucional completo da rede Marinho (apenas as 15 landings + hub)
- Versão em outros idiomas
- Integração com CRM ou ferramenta de agendamento

---

## 15. Decisões-Chave (resumo executivo)

| Decisão | Escolha |
|---|---|
| Quantos sites/repos? | 1 repo, 1 domínio, 3 pastas (estratégia B) |
| Quantas landings? | 15 (3 temas × 5 unidades) + 1 hub |
| Stack? | HTML estático puro + GitHub Pages |
| Templates? | 3 templates base, 5 versões cada |
| Mobile-first? | Sim (80%+ do tráfego virá de mobile) |
| Comprimento da landing? | Enxuta — 6 blocos + footer (~45s leitura) |
| WhatsApp flutuante? | Imediato (fade-in 1.5s, pulse a cada 5s) |
| Cor do CTA WhatsApp? | Verde oficial `#25D366` |
| Estratégia de conversão? | Caminho A — 1 conversão única no Google Ads |
| GTM em todas? | Sim — `GTM-5NKWFG22` |
| Plano de produção? | Mangabeira primeiro como piloto, depois replicar |
| H1 da landing? | "[Tema] em João Pessoa" (cidade, não bairro) — exceto Campina Grande |
| Parcelamento? | No corpo, nunca em destaque; nunca em facetas |
| Footer regulatório? | EPAO 316 + RT CRO 6529 + disclaimer de imagens |

---

## Apêndice — Copy Final das 3 Landings da Mangabeira (versão piloto, aprovada)

### A.1 — Implante Dentário Mangabeira

```
BLOCO 1 — HERO
H1: Implante Dentário em João Pessoa — Avaliação Gratuita
Sub: Recupere a confiança de mastigar, falar e sorrir.
     Atendimento na unidade Mangabeira, com especialistas
     e tecnologia 3D.
CTA: 📲 Quero minha avaliação gratuita
Selo: +10 anos · +50 mil pacientes · 12 unidades

BLOCO 2 — DOR + IDENTIFICAÇÃO
H2: Cansou de esconder o sorriso?
Texto: Mastigar só de um lado, evitar fotos, cobrir a boca
       quando ri — isso pode acabar. A avaliação é gratuita
       e leva poucos minutos pra agendar.

BLOCO 3 — ANTES E DEPOIS
H2: +50 mil sorrisos transformados
Galeria: 4-6 fotos com nomes dos pacientes + disclaimer

BLOCO 4 — POR QUE A MARINHO + FAQ
H2: Por que a Marinho?
✓ Especialistas em implantodontia em todas as unidades
✓ Tecnologia 3D para diagnóstico preciso
✓ +10 anos no mercado · +50 mil pacientes
✓ 18x sem juros no cartão · 15x no boleto sem consulta SPC
✓ Atendimento de emergência

FAQ accordion (3 perguntas):
- Quanto tempo leva o tratamento?
- O implante dói?
- Tem garantia?

BLOCO 5 — UNIDADE MANGABEIRA
H2: Marinho Odontologia — Mangabeira
📍 [endereço]
📱 (83) 98890-0095
🕐 [horário]
[Mapa Google embed]
[Foto da fachada]

BLOCO 6 — CTA FINAL
H2: Sua avaliação é gratuita. Comece hoje.
CTA: 📲 Agendar pelo WhatsApp
```

### A.2 — Facetas em Resina Mangabeira

```
BLOCO 1 — HERO
H1: Lentes de Resina em João Pessoa — Avaliação Gratuita
Sub: Transforme seu sorriso em poucas sessões.
     Avaliação com especialista em estética,
     na unidade Mangabeira.
CTA: 📲 Quero minha avaliação gratuita
Selo: +10 anos · +50 mil pacientes · 12 unidades

BLOCO 2 — DOR + IDENTIFICAÇÃO
H2: Você sorri ou só "abre a boca"?
Texto: Cobrir o sorriso na foto, evitar rir aberto, achar
       que dente perfeito é só pra famoso — isso pode
       mudar ainda este mês.

BLOCO 3 — ANTES E DEPOIS
H2: Sorrisos que mudaram tudo
Galeria: 4-6 fotos com nomes + disclaimer

BLOCO 4 — POR QUE A MARINHO + FAQ
H2: Por que a Marinho?
✓ Especialistas em estética dental em todas as unidades
✓ Escaneamento 3D — você vê o resultado antes de começar
✓ +10 anos no mercado · +50 mil pacientes
✓ 12 unidades — atendimento próximo de você
✓ Procedimento indolor com anestesia local

[ATENÇÃO: NÃO menciona parcelamento — não se aplica a facetas]

FAQ accordion (3 perguntas):
- Quanto tempo dura uma lente de resina?
- Vou precisar desgastar meus dentes?
- A lente escurece com o tempo?

BLOCO 5 — UNIDADE MANGABEIRA
[idêntico ao da landing de implante]

BLOCO 6 — CTA FINAL
H2: Volte a sorrir do jeito que você sempre sonhou.
CTA: 📲 Agendar pelo WhatsApp
```

### A.3 — Institucional Mangabeira

```
BLOCO 1 — HERO
H1: Clínica Odontológica em João Pessoa — Avaliação Gratuita
Sub: Especialistas em todas as áreas, na unidade Mangabeira.
     Atendimento de emergência e tecnologia avançada.
CTA: 📲 Agendar pelo WhatsApp
Selo: +10 anos · +50 mil pacientes · 12 unidades

BLOCO 2 — ESPECIALIDADES (substitui "dor" no institucional)
H2: Tudo que sua família precisa em um só lugar
Grid de ícones (8 áreas):
🦷 Implantodontia        💎 Estética dental
🪥 Ortodontia            👶 Odontopediatria
🩹 Canal (Endodontia)    🦴 Cirurgia oral
⚡ Emergência            🔬 Periodontia

BLOCO 3 — ANTES E DEPOIS
H2: +50 mil sorrisos transformados
Galeria mista (implante, facetas, ortodontia) + disclaimer

BLOCO 4 — POR QUE A MARINHO + FAQ
H2: Por que a Marinho?
✓ Especialistas em todas as áreas em uma só clínica
✓ Tecnologia 3D, raio-x digital e exames no local
✓ Atendimento de emergência
✓ +10 anos · +50 mil pacientes · 12 unidades
✓ 18x sem juros no cartão · 15x no boleto sem consulta SPC

FAQ accordion (3 perguntas):
- Vocês atendem convênio?
- Atendem emergência?
- Quanto custa uma consulta?

BLOCO 5 — UNIDADE MANGABEIRA
[idêntico]

BLOCO 6 — CTA FINAL
H2: Sua saúde bucal merece quem entende.
CTA: 📲 Agendar pelo WhatsApp
```

### A.4 — Replicação para outras 4 unidades

Para cada uma das 4 outras unidades (Epitácio, Geisel, Centro, Campina Grande):
- Bloco 1 (Hero) — Sub muda apenas o nome do bairro/unidade
- Bloco 5 (Unidade) — todos os dados mudam (endereço, WhatsApp, horário, mapa, foto)
- Para Campina Grande — Hero H1 troca "João Pessoa" por "Campina Grande"
- Tudo o mais permanece idêntico
