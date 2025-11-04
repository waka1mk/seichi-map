self.addEventListener('install', e => {
 e.waitUntil(caches.open('seichi-cache').then(c=>c.addAll(['./','index.html','comments.html','comments.js','posts.json'])));
});
self.addEventListener('fetch', e => {
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
