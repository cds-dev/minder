// const version = 3
// const cacheName = `sw${version}`
// const cacheList = ['./', '/styles/style.css']

// self.addEventListener('install', function(e) {
//   // add everything from cacheList to cache
//   e.waitUntil(
//     fetch('/files2cache/')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to fetch files to cache')
//       }
//       return response.json()
//     })
//     .then(files => {
//       const data = [...files, ...cacheList]
//       return caches.open(cacheName).then(cache => {
//         return cache.addAll(data)
//       })
//     })
//     .catch(error => {
//       console.error('Cache install error:', error)
//       // Optionally handle the error, retry fetching, or provide fallbacks
//     })

//   )
//   // Perform service worker installation tasks
//   console.info('Service Worker installed')
// })

// self.addEventListener('activate', function(e) {
//   // once sw is installed remove everything from cache, that doesn't match
//   e.waitUntil(
//     caches.keys().then(keys => {
//       return Promise.all(keys.filter(key => key !== cacheName).map(nm => caches.delete(nm)))
//     })
//   )
//   // Perform service worker activation tasks
//   console.info('Service Worker activated')
// })

// self.addEventListener('fetch', e => {
//   // Intercept fetch requests
//   console.info('Service Worker intercepting fetch event for:', e.request.url)

//   if (e.request.method === 'POST') {
//     e.respondWith(
//       fetch(e.request).catch(() => {
//         return new Response('Network error occurred', {
//           status: 408,
//           statusText: 'Network error occurred'
//         })
//       })
//     )
//   } else {
//     e.respondWith(
//       // caches.match(e.request).then(cacheRes => {
//       //   return cacheRes || fetch(e.request).then(networkRes => {
//       //     return caches.open('your-cache-name').then(cache => {
//       //       cache.put(e.request, networkRes.clone());
//       //       return networkRes
//       //     })
//       //   })
//       // }).catch(() => {
//       //   return new Response('Fetch failed and no cache', {
//       //     status: 408,
//       //     statusText: 'Fetch failed and no cache'
//       //   })
//       // })
//       e.respondWith( // return effectively
//         strategy(e)
//       )
//     )
//   }

//   // e.respondWith( // return effectively
//   //   strategy(e)
//   // )
// })

// // open from cache, then check if there's newer version
// const strategy = e => {
//   return caches.match(e.request).then((cacheRes => {
//     let fetchRes = fetch(e.request.url).then(res => {
//       return caches.open(cacheName).then(cache => {
//         cache.put(e.request, res.clone())
//         return res
//       })
//     })
//     return fetchRes
//   }))
// }