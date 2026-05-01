# Marinho Odontologia — Landings Unificadas (Design)

**Data:** 2026-05-01
**Status:** Aprovado em brainstorming, aguardando review do Patrick antes do plano de implementação
**Substitui parcialmente:** `2026-04-29-marinho-odontologia-landings-design.md` (estrutura "1 landing por unidade × tema" foi superada por esta unificação)

---

## Contexto

A primeira fase do projeto Marinho Odontologia produziu **15 landings** (3 temas × 5 unidades). O Patrick decidiu **unificar as 4 unidades de João Pessoa em 1 landing por tema**, mantendo Campina Grande separada (cidade diferente, raio de geo-segmentação distinto no Google Ads).

**Resultado final:** 6 landings (3 temas × 2 cidades) + 1 hub na home.

As 15 pastas antigas serão **mantidas intactas** como reserva — caso o Patrick decida no futuro voltar a usar landings por bairro específico.

## Objetivo

- Reduzir manutenção (de 15 pra 6 landings ativas)
- Manter Quality Score alto no Google Ads através de:
  - Slug com palavra-chave da campanha
  - Title, Meta Description e H1 casando com a palavra-chave
  - Reordenação dinâmica da unidade vinda do anúncio (`?unidade=...`)
- Maximizar conversão WhatsApp através de seleção de unidade clara, com baixo atrito

## Decisões de Arquitetura

### 1. Estrutura de URLs (plana, com palavra-chave no slug)

```
/clinica-odontologica-joao-pessoa/      ← unificada JP, tema institucional
/clinica-odontologica-campina-grande/   ← Campina, tema institucional
/implante-dentario-joao-pessoa/         ← unificada JP, tema implante
/implante-dentario-campina-grande/      ← Campina, tema implante
/facetas-em-resina-joao-pessoa/         ← unificada JP, tema facetas
/facetas-em-resina-campina-grande/      ← Campina, tema facetas
```

**Motivação:**
- Slug com palavra-chave da campanha do Google Ads ajuda no Quality Score (URL casa com a busca)
- Estrutura plana evita conflito com pastas antigas (`/institucional/`, `/facetas/`, `/implante/`) que ficam preservadas
- "facetas-em-resina" foi escolhido pelo Patrick por ser o termo mais buscado no Google

### 2. Pastas antigas preservadas

As 15 pastas existentes em `institucional/{bairro}/`, `facetas/{bairro}/`, `implante/{bairro}/` **não serão apagadas**. Ficam dormentes no repo, acessíveis por URL direta, mas:
- Não são linkadas pelo hub
- Não recebem tráfego dos anúncios novos
- Servem de backup caso o Patrick decida reativar landings por bairro

### 3. Hub na home (`index.html` na raiz)

Hub minimalista com 6 cards (1 por landing). Estrutura visual seguindo paleta + tipografia das landings (Saira + Inter, primária #007CC3).

- **Header:** logo Marinho + selo "+10 anos · +50 mil pacientes · 12 unidades"
- **Bloco principal:** título "Encontre a clínica Marinho mais próxima"
- **6 cards** apontando pras 6 landings novas
- **Footer:** EPAO 316 + RT (igual landings)
- **Sem WhatsApp flutuante** (sem unidade definida pra apontar)

### 4. Anatomia da landing unificada (JP)

Mesma estrutura de 6 blocos das landings atuais, com adaptações:

| Bloco | Mudança em relação à landing atual da Mangabeira |
|---|---|
| Hero | H1 sem nome de bairro: "Clínica Odontológica em João Pessoa — Avaliação Gratuita" (idem implante e facetas, com palavra-chave do tema). Sem `hero-marca-sub` com bairro. CTA WhatsApp do hero: vai pra unidade marcada por `?unidade=...` ou pra primeira da lista (Mangabeira como default) |
| Especialidades | Igual atual — sem mudança |
| Antes e depois | Igual atual — sem mudança (galeria pode usar imagens da Mangabeira como referência da rede; não menciona bairro) |
| Por que a Marinho + FAQ | Texto da FAQ ajustado: "atendimento de emergência" sem dizer "na unidade Mangabeira" — fica genérico pra rede |
| Sobre a Marinho (SEO) | Texto reescrito sem mencionar "unidade Mangabeira"; vira descrição da rede em João Pessoa com 4 unidades |
| **Unidades (NOVO — substitui o "Sobre a unidade")** | **Bloco completamente novo** — descrito abaixo |
| CTA final | Igual atual, com botão WhatsApp da unidade marcada (`?unidade=...`) ou Mangabeira default |

### 5. Bloco "Unidades" — coração da conversão

**Pergunta no topo:** "Em qual unidade você quer ser atendido?"

**Lista vertical de 4 cards** (em João Pessoa). Cada card:
- Bairro em destaque (ex: "MANGABEIRA")
- Endereço completo (1 linha)
- Horário (1 linha)
- Botão "Ver no mapa ▼" (expande iframe do Google Maps quando clicado, lazy loading — não carrega o iframe até o clique, melhora performance)
- Botão "💬 Falar com a [Bairro]" (verde WhatsApp #25D366) com o número da unidade

**Sem fotos de fachada.** Decisão do Patrick — economiza peso, mantém foco na escolha.

**Sem referências geográficas** (tipo "em frente ao X"). Decisão do Patrick.

### 6. Reordenação por `?unidade=...`

Quando o anúncio do Google Ads aponta pra `/implante-dentario-joao-pessoa/?unidade=mangabeira`:

1. JavaScript lê o parâmetro `unidade` da URL
2. O card da Mangabeira **pula pra primeira posição** da lista
3. Recebe **borda azul fina** (#007CC3, 2px) — sinaliza visualmente sem berrar
4. CTAs de WhatsApp do Hero e do CTA Final passam a apontar pro número da Mangabeira

Se não vier parâmetro, ordem default: Mangabeira → Epitácio → Geisel → Centro. CTA do Hero/Final aponta pra Mangabeira.

### 7. Copy — Caminho B (ajuste cirúrgico)

Para cada uma das 6 landings, reescrever:

| Elemento | Por que importa pro Quality Score |
|---|---|
| `<title>` | Aparece nos resultados do Google e é peso alto na avaliação de relevância |
| `<meta name="description">` | Pesa diretamente na avaliação da landing pelo algoritmo do Ads |
| H1 (título principal do hero) | Mais peso ainda — o Google compara H1 com palavra-chave |

**Padrão:**

| Tema | Title | H1 |
|---|---|---|
| Institucional JP | "Clínica Odontológica em João Pessoa — Marinho Odontologia" | "Clínica Odontológica em **João Pessoa** — Avaliação Gratuita" |
| Implante JP | "Implante Dentário em João Pessoa — Marinho Odontologia" | "Implante Dentário em **João Pessoa** — Avaliação Gratuita" |
| Facetas JP | "Facetas em Resina em João Pessoa — Marinho Odontologia" | "Facetas em Resina em **João Pessoa** — Avaliação Gratuita" |
| Institucional Campina | "Clínica Odontológica em Campina Grande — Marinho Odontologia" | "Clínica Odontológica em **Campina Grande** — Avaliação Gratuita" |
| Implante Campina | "Implante Dentário em Campina Grande — Marinho Odontologia" | "Implante Dentário em **Campina Grande** — Avaliação Gratuita" |
| Facetas Campina | "Facetas em Resina em Campina Grande — Marinho Odontologia" | "Facetas em Resina em **Campina Grande** — Avaliação Gratuita" |

**Restante da copy:** mantém o que já estava aprovado (especialidades, antes/depois, FAQ, "Sobre a Marinho"), com ajustes mínimos pra remover menção de bairro específico.

### 8. WhatsApp flutuante

Mantido nas 6 landings, com fade-in 1.5s (igual hoje). Número aponta pra unidade marcada por `?unidade=...` (ou Mangabeira default em JP, Campina default em Campina).

**Não aparece no hub.**

## Diferenças em relação à arquitetura anterior

| Aspecto | Antes (spec 2026-04-29) | Agora |
|---|---|---|
| Nº de landings ativas | 15 | 6 |
| Estrutura de pastas | `tema/bairro/` | Plana com slug-cidade |
| Bloco "unidade" | 1 unidade só por landing (Sobre + fachada + mapa + WhatsApp) | 4 unidades (lista vertical, sem fachada) |
| URL casa com keyword? | Parcialmente (apenas tema) | Sim (tema + cidade no slug) |
| Bairro na URL | Sim | Não (vai como `?unidade=...`) |
| Hub | 1 índice das 15 landings | 6 cards das landings ativas |

## Estrutura final de arquivos

```
Projetos/marinho-odontologia/
├── index.html                                          ← NOVO hub (raiz)
├── clinica-odontologica-joao-pessoa/
│   └── index.html                                      ← NOVO unificada
├── clinica-odontologica-campina-grande/
│   └── index.html                                      ← NOVO (cópia ajustada da campina-grande/institucional)
├── implante-dentario-joao-pessoa/
│   └── index.html                                      ← NOVO unificada
├── implante-dentario-campina-grande/
│   └── index.html                                      ← NOVO
├── facetas-em-resina-joao-pessoa/
│   └── index.html                                      ← NOVO unificada
├── facetas-em-resina-campina-grande/
│   └── index.html                                      ← NOVO
├── institucional/                                      ← MANTIDO (relíquia)
│   ├── mangabeira/index.html                           ← MANTIDO
│   ├── epitacio/index.html                             ← MANTIDO
│   ├── geisel/index.html                               ← MANTIDO
│   ├── centro/index.html                               ← MANTIDO
│   └── campina-grande/index.html                       ← MANTIDO
├── facetas/                                            ← MANTIDO (relíquia)
│   └── (mesmas 5 unidades)
├── implante/                                           ← MANTIDO (relíquia)
│   └── (mesmas 5 unidades)
├── assets/                                             ← compartilhado
├── data/unidades.json                                  ← compartilhado
└── unidades/                                           ← compartilhado (fotos)
```

## Componentes JavaScript adicionais

### `unidades.js` (NOVO)

Arquivo único, incluído nas 6 landings + hub. Responsabilidades:

1. **Ler `?unidade=...`** da URL (JP) e marcar a unidade ativa
2. **Reordenar a lista de cards de unidade** colocando a unidade ativa em primeiro
3. **Aplicar borda destaque** no card da unidade ativa
4. **Atualizar CTAs do Hero e CTA Final** com o número da unidade ativa
5. **Lazy-load do iframe do mapa** — só carrega o iframe quando o usuário clica em "Ver no mapa"

Em Campina Grande, o script não faz reordenação (só 1 unidade) — apenas garante que CTAs apontem pro número certo.

### `whatsapp.js` (existente)

Mantido igual. Continua usando `data-whatsapp-numero` em cada botão; o `unidades.js` atualiza esse atributo dinamicamente nos CTAs do Hero/CTA Final quando há `?unidade=...`.

## Considerações pro Google Ads (futura fase)

Quando o Patrick for configurar os anúncios, cada grupo de anúncio (1 por unidade × tema = 12 grupos para JP, 3 grupos para Campina) deve apontar pra:

```
/clinica-odontologica-joao-pessoa/?unidade=mangabeira    ← grupo "Inst. Mangabeira"
/clinica-odontologica-joao-pessoa/?unidade=epitacio      ← grupo "Inst. Epitácio"
/clinica-odontologica-joao-pessoa/?unidade=geisel        ← grupo "Inst. Geisel"
/clinica-odontologica-joao-pessoa/?unidade=centro        ← grupo "Inst. Centro"
/clinica-odontologica-campina-grande/                    ← grupo "Inst. Campina" (sem param)

(idem para implante e facetas)
```

URL de exibição no anúncio pode usar caminho personalizado pra mostrar o bairro: `marinhoodonto.com.br/joao-pessoa/Mangabeira`.

## Risco e mitigação

| Risco | Mitigação |
|---|---|
| Quality Score cai por ter 4 unidades em uma única landing (vs 1 unidade dedicada antes) | Slug com palavra-chave + Title/Meta/H1 casando + reordenação por `?unidade=...` compensam |
| Lista de 4 cards de unidade fica longa no mobile | Bloco fica antes do CTA final, paciente já está engajado. Se virar problema, considerar acordeão (revisar pós-go-live) |
| Patrick mudar de ideia e querer reativar landings por bairro | Pastas antigas estão preservadas — basta mudar links no hub |

## Ainda sem definir (não bloqueia implementação)

- Caminho personalizado da URL de exibição no Google Ads (decisão pra fase de campanhas)
- Ajustes finos de copy se o teste A/B futuro indicar mudança

## Tracking GTM

Mantido `GTM-5NKWFG22` em todas as 6 landings + hub. Continua usando o esquema de eventos atuais via `data-cta-position` (hero, unidade, final, flutuante) — adicionado `data-unidade` no evento pra rastrear qual unidade foi clicada.

## Conformidade CFO

Todas as 6 landings + hub mantêm no footer:
- `Marinho Odontologia — EPAO 316`
- `Responsável Técnico: Dr. Emiliano Marinho dos Santos Júnior — CRO 6529`
- `Imagens meramente ilustrativas. Resultados podem variar de paciente para paciente.`
