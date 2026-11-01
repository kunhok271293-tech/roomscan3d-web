// Lưu sẵn toàn bộ trang để dùng được khi không có mạng ở công trình.
const CACHE = 'do3d-v1';
const FILES = [
  './', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png',
  './lib/build/three.module.js',
  './lib/three-mesh-bvh.js',
  './lib/examples/jsm/exporters/OBJExporter.js',
  './lib/examples/jsm/exporters/STLExporter.js',
  './lib/examples/jsm/exporters/GLTFExporter.js',
  './lib/examples/jsm/utils/TextureUtils.js',
  './lib/examples/jsm/controls/OrbitControls.js',
  './lib/examples/jsm/renderers/CSS2DRenderer.js',
  './lib/examples/jsm/loaders/OBJLoader.js',
  './lib/examples/jsm/loaders/GLTFLoader.js',
  './lib/examples/jsm/loaders/PLYLoader.js',
  './lib/examples/jsm/loaders/STLLoader.js',
  './lib/examples/jsm/loaders/USDZLoader.js',
  './lib/examples/jsm/utils/BufferGeometryUtils.js',
  './lib/examples/jsm/libs/fflate.module.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Ưu tiên mạng để nhận bản mới, mất mạng thì dùng bản đã lưu.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
