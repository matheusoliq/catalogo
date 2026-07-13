/* =============================================================
   ARQUIVO JAVASCRIPT — script.js
   =============================================================
   Este arquivo cuida de tudo que é "vivo" na página:

   1) Guarda a lista de MODELOS/PRODUTOS e cria os cards do
      carrossel automaticamente na tela.

   2) Monta o link de WhatsApp de cada modelo (com mensagem pronta)
      e o botão flutuante do WhatsApp.

   3) Controla o carrossel: setas, bolinhas, arrastar/rolar, e o
      efeito de profundidade (card do centro em destaque) no celular.

   4) Observa a rolagem da página e adiciona animações suaves
      quando cada seção (ou card) entra na tela.

   5) Registra o Service Worker para o site poder ser instalado
      como aplicativo ("Adicionar à tela inicial").

   Você NÃO precisa saber programação avançada para editar este
   arquivo. Basta seguir os comentários abaixo.
   ============================================================= */


/* =============================================================
   0. CONFIGURAÇÃO DO WHATSAPP
   =============================================================
   >>> ALTERAR NÚMERO DO WHATSAPP <<<
   Preencha "number" só com números: código do país + DDD + número
   (sem espaços, +, parênteses ou traços).
   Exemplo Brasil: 55 (país) + 11 (DDD) + 999999999 (número)
                   -> "5511999999999"

   >>> ALTERAR MENSAGEM DO BOTÃO FLUTUANTE <<<
   Troque o texto de "generalMessage" abaixo.

   >>> ALTERAR MENSAGEM ENVIADA A PARTIR DE CADA MODELO <<<
   Troque o texto de "productMessageTemplate". Use exatamente
   "{modelo}" no lugar onde o nome do modelo deve aparecer — o
   próprio script substitui isso automaticamente.
   ============================================================= */
const WHATSAPP_CONFIG = {
  number: "5511999999999", // <-- TROQUE PELO SEU NÚMERO REAL DE WHATSAPP

  generalMessage:
    "Olá! Vim pelo catálogo de modelos e gostaria de mais informações.",

  productMessageTemplate:
    'Olá! Gostei do modelo "{modelo}" e gostaria de fazer um orçamento.'
};

// Monta o link "https://wa.me/..." pronto para uso a partir de uma mensagem
function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`;
}


/* =============================================================
   1. LISTA DE MODELOS/PRODUTOS
   =============================================================
   >>> ADICIONAR NOVO MODELO <<<
   Copie um dos objetos "{ ... }" abaixo (de "{" até "},") e cole
   logo depois do último. Depois só altere:

     - name        -> nome do modelo (também entra na mensagem do WhatsApp)
     - description -> descrição curta (1 a 2 frases)
     - image       -> link da imagem grande do modelo
     - link        -> link para onde a pessoa vai ao clicar no card
                      (pode ser o link do site/anúncio deste modelo)

   >>> ONDE TROCAR IMAGENS <<<
   Troque o valor de "image" pelo link direto da sua foto/imagem.

   >>> ONDE ALTERAR LINKS <<<
   Troque o valor de "link" pelo endereço real de cada modelo.
   (Abaixo está um link de exemplo, apenas para você substituir depois.)
   ============================================================= */
const models = [
  {
    name: "Modelo 01",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+01",
    link: "https://example.com/modelo-01" // <-- troque pelo link real deste modelo
  },
  {
    name: "Modelo 02",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+02",
    link: "https://example.com/modelo-02" // <-- troque pelo link real deste modelo
  },
  {
    name: "Modelo 03",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+03",
    link: "https://example.com/modelo-03" // <-- troque pelo link real deste modelo
  },
  {
    name: "Modelo 04",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+04",
    link: "https://example.com/modelo-04" // <-- troque pelo link real deste modelo
  },
  {
    name: "Modelo 05",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+05",
    link: "https://example.com/modelo-05" // <-- troque pelo link real deste modelo
  },
  {
    name: "Modelo 06",
    description: "Descrição curta explicando o estilo e o diferencial deste modelo.",
    image: "https://placehold.co/700x560/EDEDED/1C2B39?text=Modelo+06",
    link: "https://example.com/modelo-06" // <-- troque pelo link real deste modelo
  }
  // ===== ADICIONAR NOVO MODELO =====
  // Copie um dos objetos acima e cole aqui embaixo, separado por vírgula.
];


/* =============================================================
   2. CRIAÇÃO DOS CARDS DO CARROSSEL
   =============================================================
   Esta função pega a lista "models" acima e transforma cada item
   em um card dentro da faixa "#catalogGrid" (no HTML).

   Cada card tem DOIS botões de ação, lado a lado por dentro:
     - Área da imagem/nome/descrição -> link normal, leva ao "link"
       do modelo (abre em nova aba).
     - Botão verde "Falar no WhatsApp" -> abre o WhatsApp já com uma
       mensagem pronta e profissional, citando o nome do modelo.
   ============================================================= */
function renderCatalog() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  models.forEach((model) => {
    // Mensagem de WhatsApp personalizada com o nome deste modelo
    const productMessage = WHATSAPP_CONFIG.productMessageTemplate.replace(
      "{modelo}",
      model.name
    );
    const whatsappLink = buildWhatsAppLink(productMessage);

    // Card (agora é uma <div>, não um <a>, para poder ter dois botões
    // diferentes dentro dele sem um link ficar "dentro" do outro)
    const card = document.createElement("div");
    card.className = "model-card";

    // Marca o card para ser observado pela animação de rolagem/carrossel
    card.setAttribute("data-animate-card", "true");

    card.innerHTML = `
      <a class="model-card__link" href="${model.link}" target="_blank" rel="noopener noreferrer">
        <div class="model-card__image-wrap">
          <img
            class="model-card__image"
            src="${model.image}"
            alt="${model.name}"
            loading="lazy"
          />
        </div>
        <div class="model-card__body">
          <h3 class="model-card__name">${model.name}</h3>
          <p class="model-card__description">${model.description}</p>
          <span class="model-card__cta">
            Ver modelo <span class="arrow">→</span>
          </span>
        </div>
      </a>
      <a class="model-card__whatsapp" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3C7.03 3 3 6.58 3 11c0 2.08.87 3.97 2.3 5.4L4 21l4.8-1.24A9.9 9.9 0 0 0 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8Z" fill="#FFFFFF"/>
        </svg>
        Falar no WhatsApp
      </a>
    `;

    grid.appendChild(card);
  });

  // Cria uma bolinha indicadora para cada modelo (usadas só no celular)
  renderCarouselDots();
}


/* =============================================================
   3. CARROSSEL: SETAS, BOLINHAS E EFEITO DE PROFUNDIDADE
   =============================================================
   No celular, os cards vizinhos ao centro ficam menores e mais
   transparentes (parecendo estar "atrás"), sem nenhum desfoque/blur.
   No computador (768px ou mais), esse efeito é desligado e todos
   os cards aparecem no tamanho normal, lado a lado.

   >>> ONDE AJUSTAR A LARGURA A PARTIR DA QUAL O EFEITO SOME <<<
   Altere o número "768" nas funções abaixo (ele precisa ser igual
   ao breakpoint "min-width: 768px" usado no style.css).

   >>> ONDE AJUSTAR A INTENSIDADE DO EFEITO DE PROFUNDIDADE <<<
   Altere os números "0.22" (escala) e "0.55" (opacidade) dentro
   da função "applyCoverflowEffect".
   ============================================================= */
const DESKTOP_BREAKPOINT = 768;

function isDesktopView() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

// Aplica (ou remove) o efeito de "card central em destaque"
function applyCoverflowEffect() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;
  const cards = grid.querySelectorAll(".model-card");

  // TELAS GRANDES (computador/tablet): sem efeito nenhum, tudo 100% visível
  if (isDesktopView()) {
    cards.forEach((card) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.zIndex = "";
    });
    return;
  }

  // CELULAR: calcula a distância de cada card até o centro da faixa
  const containerRect = grid.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  cards.forEach((card) => {
    // Só aplicamos o efeito depois que o card já apareceu (entrada por
    // rolagem vertical), para não brigar com a animação de entrada.
    if (!card.classList.contains("is-visible")) return;

    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(containerCenter - cardCenter);

    // "normalized" vai de 0 (bem no centro) até ~1.3 (bem afastado)
    const normalized = Math.min(distance / (containerRect.width / 2), 1.3);

    const scale = 1 - normalized * 0.22;     // <-- intensidade da escala
    const opacity = 1 - normalized * 0.55;   // <-- intensidade da opacidade
    const zIndex = Math.round(100 - normalized * 60);

    card.style.transform = `translateY(0) scale(${Math.max(scale, 0.74).toFixed(3)})`;
    card.style.opacity = Math.max(opacity, 0.4).toFixed(2);
    card.style.zIndex = zIndex;
  });

  updateActiveDot();
}

// Evita rodar a função de efeito a cada pixel de rolagem (melhora performance)
let coverflowFrameRequested = false;
function requestCoverflowUpdate() {
  if (coverflowFrameRequested) return;
  coverflowFrameRequested = true;
  requestAnimationFrame(() => {
    applyCoverflowEffect();
    coverflowFrameRequested = false;
  });
}

// Cria as bolinhas indicadoras (uma por modelo)
function renderCarouselDots() {
  const dotsWrap = document.getElementById("carouselDots");
  if (!dotsWrap) return;

  dotsWrap.innerHTML = "";

  models.forEach((model, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Ir para ${model.name}`);

    dot.addEventListener("click", () => {
      const grid = document.getElementById("catalogGrid");
      const targetCard = grid.querySelectorAll(".model-card")[index];
      if (!targetCard) return;

      // Centraliza o card escolhido dentro da faixa do carrossel
      const offset =
        targetCard.offsetLeft - (grid.clientWidth - targetCard.clientWidth) / 2;
      grid.scrollTo({ left: offset, behavior: "smooth" });
    });

    dotsWrap.appendChild(dot);
  });
}

// Marca qual bolinha corresponde ao card mais próximo do centro
function updateActiveDot() {
  const grid = document.getElementById("catalogGrid");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!grid || dots.length === 0) return;

  const cards = grid.querySelectorAll(".model-card");
  const containerRect = grid.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  cards.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(containerCenter - cardCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === closestIndex);
  });
}

// Move o carrossel um "card" para frente (1) ou para trás (-1)
function scrollCarouselBy(direction) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const firstCard = grid.querySelector(".model-card");
  if (!firstCard) return;

  const gap = 24; // <-- precisa bater com o "gap" definido em ".catalog-grid" no CSS
  const cardWidth = firstCard.getBoundingClientRect().width + gap;

  grid.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
}

// Liga os botões de seta (‹ ›) e os eventos de rolagem/redimensionamento
function initCarouselControls() {
  const grid = document.getElementById("catalogGrid");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");

  if (prevBtn) prevBtn.addEventListener("click", () => scrollCarouselBy(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollCarouselBy(1));

  if (grid) {
    grid.addEventListener("scroll", requestCoverflowUpdate, { passive: true });
  }

  window.addEventListener("resize", requestCoverflowUpdate);

  // Recalcula depois que as imagens carregarem (o tamanho dos cards
  // pode mudar levemente assim que as imagens aparecem)
  window.addEventListener("load", requestCoverflowUpdate);
}


/* =============================================================
   4. ANIMAÇÕES AO ROLAR A PÁGINA (Intersection Observer)
   =============================================================
   Como funciona:
   - Todo elemento com o atributo "data-animate" no HTML (títulos,
     blocos de texto, imagens de seção, etc.) começa invisível
     (isso é controlado no style.css).
   - Quando o elemento entra na área visível da tela, adicionamos
     a classe "is-visible", que dispara a animação suave (fade + subida).
   - Os cards do carrossel seguem a mesma lógica, mas recebem um
     pequeno atraso entre um e outro para aparecerem em sequência
     (efeito de "cascata").

   >>> PARA AJUSTAR A DISTÂNCIA/MOMENTO EM QUE A ANIMAÇÃO DISPARA <<<
   Altere o valor de "rootMargin" abaixo. Um valor mais negativo
   faz a animação disparar quando o elemento já está mais visível.
   ============================================================= */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,           // % do elemento visível para disparar a animação
    rootMargin: "0px 0px -80px 0px"
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // Assim que um card do catálogo aparece, recalcula o efeito
        // de profundidade do carrossel (para já nascer com a escala certa)
        if (entry.target.hasAttribute("data-animate-card")) {
          requestCoverflowUpdate();
        }

        // Depois de animar uma vez, paramos de observar o elemento
        // (evita repetir a animação toda vez que a pessoa rola pra cima/baixo)
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todas as seções/blocos marcados com data-animate no HTML
  document.querySelectorAll("[data-animate]").forEach((el) => {
    // Se o elemento tiver um "data-delay" (em milissegundos) no HTML,
    // aplicamos esse atraso na transição via CSS inline.
    const delay = el.getAttribute("data-delay");
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
    observer.observe(el);
  });

  // Observa os cards do carrossel e aplica atraso sequencial entre eles
  // (cada card espera um pouco mais que o anterior para aparecer)
  const cards = document.querySelectorAll("[data-animate-card]");
  const staggerStep = 90; // <-- ONDE AJUSTAR O ATRASO ENTRE CADA CARD (em ms)

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * staggerStep}ms`;
    observer.observe(card);
  });
}


/* =============================================================
   5. BOTÃO FLUTUANTE DO WHATSAPP
   =============================================================
   Preenche o link do botão fixo no canto da tela usando o número
   e a mensagem geral configurados em "WHATSAPP_CONFIG" (lá em cima).
   ============================================================= */
function initWhatsAppFloatButton() {
  const floatBtn = document.getElementById("whatsappFloat");
  if (!floatBtn) return;

  floatBtn.href = buildWhatsAppLink(WHATSAPP_CONFIG.generalMessage);
}


/* =============================================================
   6. PWA — REGISTRO DO SERVICE WORKER
   =============================================================
   Isso é necessário para o navegador oferecer a opção
   "Adicionar à tela inicial" (instalar como app).

   >>> IMPORTANTE: só funciona quando o site está publicado em
   >>> um endereço HTTPS (ou "localhost"). Veja o comentário no
   >>> topo do index.html para mais detalhes.
   ============================================================= */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.warn("Não foi possível registrar o service worker:", error);
    });
  });
}


/* =============================================================
   7. INICIALIZAÇÃO
   =============================================================
   Quando a página termina de carregar, criamos os cards do
   carrossel, ligamos os controles, ativamos as animações e
   preparamos o botão do WhatsApp e o PWA.
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  initCarouselControls();
  initScrollAnimations();
  initWhatsAppFloatButton();
  registerServiceWorker();
});
