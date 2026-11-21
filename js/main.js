/* KERN · site
   Anéis gerados em JS para manter o desenho fiel ao símbolo:
   levemente descentrados, nunca um alvo perfeito. */

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function circulo(svg, cx, cy, r, attrs) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", cx.toFixed(1));
    c.setAttribute("cy", cy.toFixed(1));
    c.setAttribute("r", r.toFixed(1));
    for (const k in attrs) c.setAttribute(k, attrs[k]);
    svg.appendChild(c);
    return c;
  }

  // Pseudoaleatório determinístico: o mesmo "tronco" em todo carregamento.
  let semente = 112;
  const rand = () => ((semente = (semente * 9301 + 49297) % 233280) / 233280);

  /* ---------- Textura de fundo (p. 29: linhas finas, descentradas, sangrando) ---------- */
  document.querySelectorAll(".aneis-fundo").forEach((svg) => {
    let r = 34;
    let k = 0;
    while (r < 760) {
      circulo(svg, 500 + k * 2.1, 500 - k * 1.7, r, {});
      r += 18 + rand() * 22; // anéis de largura irregular, como madeira
      k++;
    }
  });

  /* ---------- Manifesto: o cerne se forma anel por anel ---------- */
  const cerne = document.querySelector(".cerne-svg");
  const num = document.querySelector(".contador__num");
  const TOTAL = 112;
  const aneis = [];

  if (cerne) {
    // O miolo é a parte mais antiga: o ponto surge primeiro, os anéis crescem para fora.
    circulo(cerne, 309, 288, 16, { class: "ponto" });
    let r = 40;
    let k = 14;
    while (r < 292) {
      const cx = 300 + k * 0.65 + (rand() - 0.5) * 2;
      const cy = 300 - k * 0.85 + (rand() - 0.5) * 2;
      const espessura = 2 + rand() * 4.5;
      const c = circulo(cerne, cx, cy, Math.min(r, 296 - espessura / 2), {
        class: "anel",
        "stroke-width": espessura.toFixed(1),
      });
      aneis.push(c);
      r += 14 + rand() * 16;
      k--;
    }
  }

  const fmt = (n) => String(Math.max(1, Math.round(n))).padStart(3, "0");

  function estadoFinal() {
    aneis.forEach((c) => (c.style.strokeDashoffset = 0));
    if (num) num.textContent = fmt(TOTAL);
  }

  // Sem GSAP ou com movimento reduzido: mostra o tronco completo, sem animação.
  window.addEventListener("load", () => {
    if (reduzir || !window.gsap || !window.ScrollTrigger || !cerne) {
      estadoFinal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Prepara cada anel como um traço a ser desenhado.
    aneis.forEach((c) => {
      const comp = 2 * Math.PI * parseFloat(c.getAttribute("r"));
      c.style.strokeDasharray = comp;
      c.style.strokeDashoffset = comp;
      // Começa a desenhar no topo e gira no sentido horário.
      c.style.transformOrigin = `${c.getAttribute("cx")}px ${c.getAttribute("cy")}px`;
      c.style.transform = "rotate(-90deg)";
    });

    const ponto = cerne.querySelector(".ponto");
    const contador = { v: 1 };

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.from(ponto, { scale: 0, transformOrigin: "309px 288px", duration: 0.6, ease: "power2.out" });
    aneis.forEach((c, i) => {
      tl.to(c, { strokeDashoffset: 0, duration: 1 }, 0.4 + i * 0.55);
    });
    tl.to(contador, {
      v: TOTAL,
      duration: tl.duration(),
      onUpdate: () => (num.textContent = fmt(contador.v)),
    }, 0);

    const mm = gsap.matchMedia();

    // Desktop: o palco fica fixo enquanto o tronco cresce.
    mm.add("(min-width: 901px)", () => {
      ScrollTrigger.create({
        trigger: ".manifesto__palco",
        start: "center center",
        end: "+=130%",
        pin: true,
        scrub: 0.6,
        animation: tl,
      });
    });

    // Celular: cresce enquanto passa pela tela, sem prender a rolagem.
    mm.add("(max-width: 900px)", () => {
      ScrollTrigger.create({
        trigger: ".manifesto__anel-wrap",
        start: "top 85%",
        end: "bottom 35%",
        scrub: 0.6,
        animation: tl,
      });
    });
  });
})();
