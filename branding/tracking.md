# Marinho Odontologia — Tracking & GTM

## Google Tag Manager

**Container ID:** `GTM-5NKWFG22`

### Snippet HEAD (todas as 15 landings + index.html)

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5NKWFG22');</script>
<!-- End Google Tag Manager -->
```

### Snippet BODY (logo após `<body>`)

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NKWFG22"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## Evento de conversão — clique no WhatsApp

Todo botão de WhatsApp (CTA principal, CTA secundário, botão flutuante, link no rodapé) dispara um evento para o `dataLayer` no clique. Antes de redirecionar para `wa.me`, o evento é enviado.

### Evento `whatsapp_click`

```js
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'whatsapp_click',
  landing_tema: 'implante',         // 'institucional' | 'facetas' | 'implante'
  landing_unidade: 'mangabeira',     // slug da unidade
  cta_position: 'hero',              // 'hero' | 'meio-pagina' | 'final' | 'flutuante' | 'rodape'
  whatsapp_numero: '5583988900095',  // número da unidade (sem máscara)
  page_url: location.href
});
```

### Por que esses parâmetros

- `landing_tema` + `landing_unidade` → permite criar **15 conversões separadas** no Google Ads (uma por landing)
- `cta_position` → ajuda a saber qual CTA está convertendo mais (otimização futura)
- `whatsapp_numero` → confirma que o lead foi pra unidade certa

### Configuração no GTM (passo a passo no momento do deploy)

1. **Trigger:** "Custom Event" com nome `whatsapp_click`
2. **Tag:** "Google Ads Conversion Tracking" — uma para cada landing/unidade (ou usar variáveis dinâmicas com `{{landing_tema}}_{{landing_unidade}}` no Conversion Label)
3. **Variável Data Layer:** criar 5 variáveis (`landing_tema`, `landing_unidade`, `cta_position`, `whatsapp_numero`, `page_url`) puxando do dataLayer

## Implementação técnica (assets/js/whatsapp.js)

Função única `trackAndOpenWhatsApp(numero, ctaPosition)` que:
1. Lê `data-tema` e `data-unidade` de meta tags ou data attributes do `<body>`
2. Faz o `dataLayer.push`
3. Abre `https://wa.me/{numero}?text={mensagem-personalizada}` em nova aba

Todos os botões WhatsApp usam o mesmo handler — DRY.
