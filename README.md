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
