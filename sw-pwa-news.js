(function () {
    'use scrict'

    var cacheName = 'pwa-news-shell-v1';
    var cacheData = 'pwa-news-data-v1';
    var API = 'https://newsapi.org/v2/';
    var filesToCache = [
        '/',
        '/css/main.css',
        '/js/api.js',
        '/js/geolocation.js',
        '/js/install.js',
        '/js/sw-push.js',
        '/js/vibrate.js',
        '/image/placeholder-image.png',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js'
    ];

    self.addEventListener('install', function (e) {
        console.log('Installing service Worker');
        e.waitUntil(
            self.caches.open(cacheName)
                .then(function (cache) {
                    return cache.addAll(filesToCache);
                })
        );
    });

    self.addEventListener('activate', function (event) {
        console.log('Activating service Worker');
        var cacheList = [cacheName, cacheData];
        return event.waitUntil(
          self.caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
              if (cacheList.indexOf(cacheName) === -1) {
                self.caches.delete(cacheName);
              }
            }));
          })
        );
      });

  self.addEventListener('fetch', function (e) {
    console.log('Fetchando service Worker');
    if (e.request.url.indexOf(API) === -1) {
      e.respondWith(
        self.caches.match(e.request)
        .then(function (response) {
          if (response) {
            return response;
          }
          return fetch(e.request);
        })
      );
    } else {
      e.respondWith(
        self.fetch(e.request)
          .then(function (response) {
            return caches.open(cacheData)
              .then(function (cache) {
                cache.put(e.request.url, response.clone());
                return response;
              })
          }).catch(function () {
            return caches.match(e.request);
          })
      );
    }
  });


  self.addEventListener('push', function (e) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${e.data.text()}"`);

    const title = 'Push PWA News';
    const options = {
      body: e.data.text(),
      icon: '/img/android-chrome-512x512.png',
      badge: '/img/android-chrome-512x512.png'
    };
    e.waitUntil(
      self.registration.showNotification(title, options)
    );
  });


}());