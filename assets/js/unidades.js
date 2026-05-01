/**
 * MARINHO ODONTOLOGIA — Modal de escolha de unidade + lazy map
 *
 * Este script:
 * 1. Lazy-load do iframe do Google Maps (carrega só ao clicar em "Ver no mapa")
 * 2. Modal que abre ao clicar nos botões com [data-abrir-modal-unidade]
 *    (botões Hero/Final/Flutuante das landings JP unificadas)
 * 3. Quando a pessoa escolhe uma unidade no modal:
 *    - Dispara evento GTM `whatsapp_unidade_escolhida` com unidade + cta_position
 *    - Abre o WhatsApp da unidade escolhida em nova aba
 *
 * Os botões dentro de cada card de unidade NÃO usam o modal — são diretos
 * (a pessoa já escolheu ao clicar naquele card específico).
 *
 * Uso esperado no HTML:
 *   <button data-abrir-modal-unidade data-cta-position="hero">CTA</button>
 *   <div class="modal-unidade">
 *     <div class="modal-unidade-conteudo">
 *       <button class="modal-unidade-fechar">×</button>
 *       <h2 class="modal-unidade-titulo">...</h2>
 *       <div class="modal-unidade-lista">
 *         <button class="modal-unidade-opcao" data-unidade-slug="mangabeira" data-unidade-numero="5583988900095">...</button>
 *       </div>
 *     </div>
 *   </div>
 */
(function () {
  'use strict';

  var TEMA = document.body.getAttribute('data-tema') || '';

  var MENSAGENS = {
    implante: 'Olá! Vim pelo site e quero agendar minha avaliação gratuita para implante.',
    facetas: 'Olá! Vim pelo site e quero agendar minha avaliação gratuita para lentes de resina.',
    institucional: 'Olá! Vim pelo site e quero agendar uma avaliação gratuita.'
  };

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

  function abrirModal(modal, ctaPosition) {
    if (!modal) return;
    modal.classList.add('aberto');
    modal.setAttribute('data-cta-origem', ctaPosition || 'desconhecido');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal(modal) {
    if (!modal) return;
    modal.classList.remove('aberto');
    document.body.style.overflow = '';
  }

  function escolherUnidade(slug, numero, ctaOrigem) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_unidade_escolhida',
      landing_tema: TEMA,
      unidade_escolhida: slug,
      cta_position: ctaOrigem || 'desconhecido',
      whatsapp_numero: numero,
      page_url: location.href
    });

    var mensagem = encodeURIComponent(MENSAGENS[TEMA] || MENSAGENS.institucional);
    var url = 'https://wa.me/' + numero + '?text=' + mensagem;

    setTimeout(function () {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 200);
  }

  function bindModal() {
    var modal = document.querySelector('.modal-unidade');
    if (!modal) return;

    var botoesAbrir = document.querySelectorAll('[data-abrir-modal-unidade]');
    botoesAbrir.forEach(function (botao) {
      botao.addEventListener('click', function (e) {
        e.preventDefault();
        var ctaPosition = botao.getAttribute('data-cta-position') || 'desconhecido';
        abrirModal(modal, ctaPosition);
      });
    });

    var fechar = modal.querySelector('.modal-unidade-fechar');
    if (fechar) {
      fechar.addEventListener('click', function () { fecharModal(modal); });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) fecharModal(modal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('aberto')) {
        fecharModal(modal);
      }
    });

    var opcoes = modal.querySelectorAll('.modal-unidade-opcao');
    opcoes.forEach(function (opcao) {
      opcao.addEventListener('click', function () {
        var slug = opcao.getAttribute('data-unidade-slug');
        var numero = opcao.getAttribute('data-unidade-numero');
        var ctaOrigem = modal.getAttribute('data-cta-origem');
        escolherUnidade(slug, numero, ctaOrigem);
        fecharModal(modal);
      });
    });
  }

  function init() {
    bindLazyMapas();
    bindModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
