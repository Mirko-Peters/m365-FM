const CACHE = "m365-shell-v1";

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.add(new URL("offline.html", self.registration.scope));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key.indexOf("m365-shell-") === 0 && key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url), root = new URL(self.registration.scope);
  if (e.request.method !== "GET" || u.origin !== root.origin) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(function () { return caches.match(new URL("offline.html", self.registration.scope)); }));
    return;
  }
  if (u.pathname.indexOf(root.pathname + "assets/") !== 0) return;
  e.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (response) {
        if (response.ok) cache.put(e.request, response.clone());
        return response;
      });
    });
  }));
});

self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || "M365.FM", { body: d.body || "", icon: "/assets/favicon-192.png", badge: "/assets/favicon-32.png", tag: d.tag || "m365", data: { url: d.url || "/" } }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.url) || "/";
  try { if (new URL(u, self.location.origin).origin !== self.location.origin) u = "/"; } catch (x) { u = "/"; }
  e.waitUntil(clients.matchAll({ type: "window" }).then(function (cs) { for (var i = 0; i < cs.length; i++) if (cs[i].url === u && "focus" in cs[i]) return cs[i].focus(); return clients.openWindow(u); }));
});
