const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
//probably also want to cache CSS and JS (possibly why header wasn't showing up?)
const cacheStatic = 'static-resources';
const matchCallback = ({ request }) => {
  console.log(request);
  return(
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' //also cache the SW?
  );
};

registerRoute(matchCallback, new CacheFirst({
  cacheStatic, 
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
})
);

//offline fallback
const pageFallback = 'offline.html';

self.addEventListener('install', event => {
  const files = [pageFallback];

  event.waitUntil(
    self.caches
      .open('workbox-offline-fallbacks')
      .then(cache => cache.addAll(files))
  );
});

const handler = async options => {
  const dest = options.request.destination;
  const cache = await self.caches.open('workbox-offline-fallbacks');

  if (dest === 'document') {
    return (await cache.match(pageFallback)) || Response.error();
  }

  return Response.error();
};

setCatchHandler(handler);
