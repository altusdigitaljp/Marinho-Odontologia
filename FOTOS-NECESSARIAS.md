# 📸 Fotos Necessárias — Marinho Odontologia

Guia rápido pra você organizar as fotos do projeto.

---

## 1. Onde colocar as fotos

Tudo dentro da pasta **`unidades/`**, organizada assim:

```
unidades/
├── _LEIA-PRIMEIRO.md            ← Visão geral
├── 01-mangabeira/                ← Unidade piloto
│   ├── 1-fachada/                ← coloca a foto da fachada
│   ├── 2-equipe/                 ← coloca a foto da equipe
│   ├── 3-antes-depois-implante/  ← 6 fotos
│   ├── 4-antes-depois-facetas/   ← 6 fotos
│   └── 5-antes-depois-institucional/  ← 6 fotos
├── 02-epitacio/
├── 03-geisel/
├── 04-centro/
└── 05-campina-grande/
```

Cada subpasta tem um arquivo `_O-QUE-COLOCAR-AQUI.txt` que explica:
- Quantas fotos
- Nomenclatura exata
- Dimensão correta

---

## 2. Logo

**Pasta:** `assets/img/logo/`

| Arquivo atual | Status |
|---|---|
| `marinho-logo-claro.jpg` | ✅ Você já enviou (logo em fundo claro) |
| `marinho-logo-escuro.jpg` | ✅ Você já enviou (logo em fundo escuro) |
| `marinho-logo.svg` | Versão temporária que criei (deletar quando você mandar PNG/SVG transparente) |

⚠️ **Pendente:** Logo em PNG ou SVG **com fundo transparente**. Quando você me passar, troco em todos os lugares.

---

## 3. Resumo: pra finalizar Mangabeira (piloto)

Pra fechar a Fase 1, preciso só:

### Fotos
- [ ] `unidades/01-mangabeira/1-fachada/fachada-mangabeira.jpg` (1920×1080)
- [ ] `unidades/01-mangabeira/2-equipe/equipe-mangabeira.jpg` (1920×1080) — opcional
- [ ] `unidades/01-mangabeira/3-antes-depois-implante/implante-1.jpg` até `implante-6.jpg` (1080×1350)
- [ ] `unidades/01-mangabeira/4-antes-depois-facetas/facetas-1.jpg` até `facetas-6.jpg` (1080×1350)
- [ ] `unidades/01-mangabeira/5-antes-depois-institucional/institucional-1.jpg` até `institucional-6.jpg` (1080×1350)

### Texto
- [ ] Endereço completo da Mangabeira
- [ ] Horário de funcionamento da Mangabeira
- [ ] URL do mapa Google embed (passo a passo abaixo)

### Logo
- [ ] (Opcional) Logo em PNG transparente — pra ficar mais limpo no header

---

## 4. Especificações técnicas

| Tipo | Dimensão | Proporção | Peso ideal | Formato |
|---|---|---|---|---|
| Antes/Depois | 1080×1350px | 4:5 vertical | até 200 KB | JPG (qualidade 85%) |
| Fachada | 1920×1080px | 16:9 paisagem | até 300 KB | JPG (qualidade 85%) |
| Equipe | 1920×1080px | 16:9 paisagem | até 300 KB | JPG (qualidade 85%) |
| Logo | qualquer | qualquer | até 100 KB | SVG ou PNG transparente |

**Por que esses tamanhos:**
- Antes/Depois 1080×1350 = mesmo formato Instagram → você reaproveita posts existentes
- Fachada/Equipe 1920×1080 = paisagem comum, fica bem em qualquer dispositivo
- Peso baixo = página rápida = melhor experiência mobile = melhor Quality Score no Google Ads

**Como otimizar peso:** Use [tinyjpg.com](https://tinyjpg.com) ou [squoosh.app](https://squoosh.app) — comprime sem perder qualidade visível.

---

## 5. Como pegar URL do mapa Google embed

1. Abra o Google Maps
2. Procure pela unidade (ex: "Marinho Odontologia Mangabeira")
3. Clique em **"Compartilhar"** → **"Incorporar um mapa"**
4. Copie só o que está dentro de `src="..."` no iframe
5. Me manda esse link

Depois eu coloco no campo certo do `data/unidades.json`.

---

## 6. Padrão de nomenclatura — regras

✅ **Sempre minúsculas, sem acento, sem espaço** — usar hífen
✅ **Padrão antes/depois:** `[tema]-[número].jpg` → `implante-1.jpg`, `facetas-3.jpg`
✅ **Padrão fachada/equipe:** `fachada-[unidade].jpg`, `equipe-[unidade].jpg`
✅ **Slug das unidades:** `mangabeira`, `epitacio`, `geisel`, `centro`, `campina-grande`

❌ **Não usar:** acentos (épitacio ❌), espaços (campina grande ❌), maiúsculas (Mangabeira ❌)

---

## 7. Dica importante

🔥 **As fotos antes/depois podem ser COMPARTILHADAS entre as 5 unidades.** Se você tem 18 fotos boas (6 implante + 6 facetas + 6 institucional), pode jogar **as mesmas em todas as 5 pastas de unidade**.

Se preferir, pode personalizar — colocar fotos diferentes em cada unidade. Sua escolha.

**O que TEM que ser único:** apenas a fachada e (opcionalmente) a equipe local de cada unidade.
