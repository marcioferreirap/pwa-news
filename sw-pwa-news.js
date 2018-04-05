(function () {
    'use scrict'

    var CACHE_SHELL = 'pwa-news-shell-v1';
    var CACHE_DATA = 'pwa-news-data-v1';
    var API = 'https://newsapi.org/v2/';
    var FILES_SHELL = [
        '/',
        '/css/materialize.css',
        '/css/materialize.min.css',
        '/css/main.css',
        '/js/api.js',
        '/js/materialize.js',
        '/js/materialize.min.js',
        '/image/placeholder-image.png',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js'
    ];

    self.addEventListener('install', function(event){
        event.waitUntil(
            self.caches.open(CACHE_SHELL)
            .then(function(cache){
                return cache.addAll(FILES_SHELL);
            })
        )
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

    self.addEventListener('fetch', function (event){
        if(event.request.url.indexOf(API)=== -1){   
            event.respondWith(
                caches.match(event.request)
                .then(function(response){
                    if(response){
                        return response;
                    }
                    return fetch(event.request);
                })
            )
        }else{
            event.respondWith(
                self.fetch(event.request)
                .then(function (response) {
                    return caches.open(CACHE_DATA)
                    .then(function(cache) {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                }).catch(function () {
                    return caches.match(event.request);
                })
            )
        }
    });
}());