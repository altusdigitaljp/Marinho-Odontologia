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
