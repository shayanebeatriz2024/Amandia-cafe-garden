'use client';

import { useEffect } from 'react';

/**
 * Controlador único de efeitos de rolagem — sem dependências (substitui GSAP/ScrollTrigger
 * com ~1 kB). Marque os elementos com atributos:
 *
 *  - data-parallax="0.06"  → deslocamento vertical suave proporcional à distância do centro da tela
 *  - data-reveal           → recebe data-revealed ao entrar na tela (dispara transições CSS)
 *  - data-progress         → recebe a variável CSS --p (0 → 1) conforme a seção entra em foco
 *
 * As animações só existem com html[data-motion] (definido aqui). Sem JS ou com
 * prefers-reduced-motion, todo o conteúdo fica estático, visível e completo.
 */
export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.dataset.motion = 'on';

    // Revelação (uma vez por elemento)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = '';
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));

    const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const progress = Array.from(document.querySelectorAll<HTMLElement>('[data-progress]'));
    // Deslocamento atual de cada elemento: descontado na medição para não "puxar" a si mesmo
    const current = new WeakMap<HTMLElement, number>();

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;

      for (const el of parallax) {
        const prev = current.get(el) ?? 0;
        const r = el.getBoundingClientRect();
        const top = r.top - prev;
        if (top + r.height < -300 || top > vh + 300) continue;
        const speed = Number(el.dataset.parallax) || 0.06;
        const offset = (top + r.height / 2 - vh / 2) * -speed;
        current.set(el, offset);
        // propriedade `translate` (independente de `transform`): não conflita com rotate/scale das classes
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }

      for (const el of progress) {
        const r = el.getBoundingClientRect();
        // 0 quando o topo entra pela base da tela → 1 quando o centro chega ao centro da tela
        const p = (vh - r.top) / (vh / 2 + r.height / 2);
        el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      delete root.dataset.motion;
      parallax.forEach((el) => (el.style.translate = ''));
    };
  }, []);

  return null;
}
