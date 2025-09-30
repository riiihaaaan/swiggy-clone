// Service Worker for Ultra-Fast Performance
const CACHE_NAME = 'swiggy-clone-v3';
const STATIC_CACHE = 'swiggy-static-v1';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  console.log('🚀 Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        // Don't fail installation if static cache fails
        console.log('⚠️ Cache installation partial:', error);
        return self.skipWaiting();
      })
  );
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

  // Static assets - Cache First
  if (STATIC_FILES.some(file => request.url.endsWith(file))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Food images - Network First with Dynamic Cache
  if (url.href.includes('images.unsplash.com') ||
      url.href.includes('res.cloudinary.com') ||
      url.href.includes('/restaurant/')) {
    event.respondWith(networkFirst(request, { cacheTo: CACHE_NAME }));
    return;
  }

  // Restaurant/menu data from API - Network First
  if (url.pathname.includes('/api/restaurants') ||
      url.pathname.includes('/api/users') ||
      url.pathname.includes('/api/orders')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default - Network First
  event.respondWith(networkFirst(request));
});

function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      return response || fetchAndCache(request);
    });
}

function networkFirst(request, options = {}) {
  return fetch(request)
    .then(response => {
      // Only cache successful responses
      if (response.ok && options.cacheTo) {
        caches.open(options.cacheTo).then(cache => {
          cache.put(request, response.clone());
        });
      }
      return response;
    })
    .catch(() => {
      // Fallback to cache if network fails
      return caches.match(request);
    });
}

function fetchAndCache(request, cacheName = STATIC_CACHE) {
  return fetch(request)
    .then(response => {
      if (response.ok) {
        caches.open(cacheName).then(cache => {
          cache.put(request, response.clone());
        });
      }
      return response;
    });
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'profile-update') {
    // Retry offline profile updates
    event.waitUntil(retryProfileUpdate());
  }
});

async function retryProfileUpdate() {
  // Implement offline queue retry logic here
  console.log('🔄 Retrying offline profile update...');
}
