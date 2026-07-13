/* =============================================================
   SERVICE WORKER — sw.js
   =============================================================
   Este arquivo é necessário para o navegador considerar o site
   "instalável" (mostrar a opção "Adicionar à tela inicial" /
   "Instalar app"). Ele também guarda uma cópia dos arquivos
   principais em cache, para a página abrir mais rápido e
   funcionar de forma básica mesmo com internet fraca.

   >>> ONDE ADICIONAR NOVOS ARQUIVOS AO CACHE <<<
   Inclua o caminho do arquivo na lista "ASSETS" abaixo.

   >>> QUANDO ATUALIZAR O SITE (novas imagens, textos, etc.) <<<
   Mude o número da versão em "CACHE_NAME" (ex: de "v1" para "v2").
   Isso garante que os visitantes recebam a versão mais nova.
   ============================================================= */

const CACHE_NAME = "catalogo-modelos-v1"; // <-- mude para v2, v3... a cada atualização importante

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Ao instalar o service worker, guarda os arquivos principais em cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((error) => {
        // Se algum arquivo da lista não existir, isso evita quebrar a instalação
        console.warn("Service worker: falha ao cachear alguns arquivos.", error);
      })
  );
  self.skipWaiting();
});

// Ao ativar, remove caches antigos de versões anteriores do site
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estratégia "cache primeiro, internet depois": tenta responder rápido
// usando o cache; se não encontrar, busca normalmente na internet.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
