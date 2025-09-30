// Service Worker for Ultra-Fast Performance
const CACHE_NAME = 'swiggy-clone-v3';
const STATIC_CACHE = 'swiggy-static-v1';

// DYNAMIC: Let React determine actual file names
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
  // React JS/CSS files will be added dynamically based on actual build
];

self.addEventListener('install', event => {
  console.log('🚀 Installing Service Worker...');
  // Basic installation - don't force cache static files with unknown names
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ Service Worker Activated!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('🗑️ Cleaning old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Static assets (JS/CSS from build) - Runtime cache
  if (url.pathname.includes('/static/') && (
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.includes('bundle')
  )) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Food images - Network First with Dynamic Cache
  if (url.href.includes('images.unsplash.com') ||
      url.href.includes('res.cloudinary.com')) {
    event.respondWith(networkFirst(request, { cacheTo: CACHE_NAME }));
    return;
  }

  // API calls - Network First with cache fallback
  if (request.url.includes('localhost:3001/api') ||
      request.url.includes('mongodb+srv:') ||
      url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, { cacheTo: CACHE_NAME }));
    return;
  }

  // HTML pages - Network First
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default - Let browser handle (fonts, etc.)
  event.respondWith(fetch(request));
});

function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      if (response) {
        console.log('📦 Served from cache:', request.url);
        return response;
      }
      return fetch(request).then(networkResponse => {
        // Cache successful responses
        if (networkResponse.ok) {
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            console.log('💾 Cached new asset:', request.url);
          });
        }
        return networkResponse;
      });
    });
}

function networkFirst(request, options = {}) {
  return fetch(request)
    .catch(() => {
      // Network failed - try cache
      console.log('🌐 Network failed, trying cache:', request.url);
      return caches.match(request);
    })
    .then(response => {
      if (response) {
        // Cache successful network responses
        if (options.cacheTo && response.ok) {
          caches.open(options.cacheTo).then(cache => {
            cache.put(request, response.clone());
          });
        }
        return response;
      }

      // Ultimate fallback for images
      if (request.url.includes('images.unsplash.com')) {
        console.log('🏗️ Using offline image fallback');
        return caches.match('/fallback-image.png');
      }

      // For API calls, return offline message
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'Content not available offline. Check connection.'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });
