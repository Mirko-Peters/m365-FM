(function () {
  var D = window.M365D, root = document.querySelector(".dir-layout"), results = document.querySelector("[data-results]");
  if (!D || !root || !results) return;
  var form = document.querySelector(".dir-filters"), count = document.querySelector("[data-count]");
  var more = document.querySelector("[data-more]"), mapBox = document.querySelector("[data-map]");
  var placeholder = document.querySelector(".dir-map-placeholder"), mapStatus = document.querySelector("[data-map-status]");
  var mapButton = document.querySelector("[data-map-load]"), items = D.items || [], page = 1, total = 0, map, cluster, info;
  var labels = D.labels || {}, typeNames = { expert: labels.expert, company: labels.company, event: labels.event };

  function node(tag, cls, value) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (value) e.textContent = value;
    return e;
  }
  function unique(key) {
    var found = new Set();
    items.forEach(function (item) { if (item[key]) found.add(item[key]); });
    if (key === "topic") items.forEach(function (item) { (item.topics || []).forEach(function (x) { found.add(x); }); });
    if (key === "program") items.forEach(function (item) { (item.programs || []).forEach(function (x) { found.add(x); }); });
    return Array.from(found).sort();
  }
  function options() {
    ["type", "topic", "program", "lang", "country", "city", "mode"].forEach(function (key) {
      var sel = form.querySelector('[data-filter="' + key + '"]'), value = sel.value;
      while (sel.options.length > 1) sel.remove(1);
      var values = key === "type" ? ["expert", "company", "event"] : key === "mode" ? ["online", "onsite", "hybrid"] : unique(key);
      values.forEach(function (v) {
        var opt = document.createElement("option"); opt.value = v;
        opt.textContent = key === "type" ? (typeNames[v] || v) : v; sel.appendChild(opt);
      });
      sel.value = value;
    });
  }
  function card(item) {
    var li = node("li", "dir-item"), a = node("a", "", item.name), strong = node("strong", "", item.name);
    a.href = item.url; a.textContent = ""; a.appendChild(strong); li.appendChild(a);
    if (item.online) li.appendChild(node("span", "dir-badge", labels.online_badge));
    li.appendChild(node("p", "", item.headline || [item.city, item.country].filter(Boolean).join(", ")));
    return li;
  }
  function render(rows, append) {
    if (!append) results.textContent = "";
    if (!rows.length && !append) results.appendChild(node("ul", "dir-items", labels.none));
    else {
      var ul = results.querySelector(".dir-items");
      if (!ul) { ul = node("ul", "dir-items"); results.appendChild(ul); }
      rows.forEach(function (item) { ul.appendChild(card(item)); });
    }
    if (count) count.textContent = total + " " + labels.result;
    more.hidden = page * 30 >= total;
  }
  function params(nextPage) {
    var p = new URLSearchParams({ page: String(nextPage), limit: "30" });
    [].forEach.call(form.querySelectorAll("[data-filter]"), function (field) { if (field.value.trim()) p.set(field.dataset.filter, field.value.trim()); });
    return p;
  }
  function load(nextPage) {
    if (!nextPage) page = 1;
    var target = nextPage || 1;
    return fetch(D.api + "/api/directory?" + params(target).toString()).then(function (r) { if (!r.ok) throw new Error("directory"); return r.json(); }).then(function (data) {
      page = target; total = data.total || 0; items = nextPage ? items.concat(data.items || []) : data.items || [];
      options(); render(data.items || [], !!nextPage);
      if (map) updateMap(items);
    }).catch(function () { if (!items.length) render([], false); });
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script"); script.src = src; script.async = true;
      script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
    });
  }
  function infoContent(item) {
    var box = node("div", ""), title = node("strong", "", item.name), detail = node("p", "", [item.headline, (item.programs || []).join(", "), (item.topics || []).join(", ")].filter(Boolean).join(" · "));
    var link = node("a", "", labels.open || "Open profile"); link.href = item.url;
    box.appendChild(title); if (detail.textContent) box.appendChild(detail); box.appendChild(link);
    return box;
  }
  function updateMap(rows) {
    if (!map || !window.markerClusterer) return;
    if (cluster) cluster.clearMarkers();
    var colors = getComputedStyle(document.documentElement), accent = colors.getPropertyValue("--ac").trim() || "#3e8bc0";
    var markers = rows.filter(function (item) { return Number.isFinite(item.lat) && Number.isFinite(item.lng) && !item.online; }).map(function (item) {
      var symbol = item.type === "expert" ? google.maps.SymbolPath.CIRCLE : item.type === "event" ? google.maps.SymbolPath.STAR : "M -7,-7 h 14 v 14 h -14 z";
      var marker = new google.maps.Marker({ position: { lat: item.lat, lng: item.lng }, title: item.name, icon: { path: symbol, fillColor: item.type === "event" ? "#d85b53" : accent, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 1, scale: item.type === "expert" ? 7 : 1.4 } });
      marker.addListener("click", function () { info.setContent(infoContent(item)); info.open({ map: map, anchor: marker }); });
      return marker;
    });
    cluster = new markerClusterer.MarkerClusterer({ map: map, markers: markers });
  }
  function loadMap() {
    if (mapButton.disabled) return;
    mapButton.disabled = true; mapStatus.textContent = labels.loading;
    fetch(D.api + "/api/directory/key").then(function (r) { return r.json(); }).then(function (config) {
      if (!config.key) throw new Error("key");
      return loadScript("https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(config.key) + "&loading=async")
        .then(function () { return loadScript("https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"); });
    }).then(function () {
      var dark = matchMedia("(prefers-color-scheme: dark)").matches || document.documentElement.dataset.theme === "dark";
      map = new google.maps.Map(mapBox, { center: { lat: 48, lng: 10 }, zoom: 4, styles: dark ? [{ elementType: "geometry", stylers: [{ color: "#242a30" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#d7dde3" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#39434c" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17212a" }] }] : [] });
      info = new google.maps.InfoWindow(); placeholder.hidden = true; mapBox.hidden = false; mapStatus.textContent = ""; updateMap(items);
    }).catch(function () { mapStatus.textContent = labels.map_missing; })
      .finally(function () { mapButton.disabled = false; });
  }
  var timer;
  form.addEventListener("submit", function (event) { event.preventDefault(); });
  form.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { load(1); }, 250); });
  form.addEventListener("change", function () { load(1); });
  more.addEventListener("click", function () { load(page + 1); });
  mapButton.addEventListener("click", loadMap);
  [].forEach.call(document.querySelectorAll("[data-view]"), function (button) {
    button.addEventListener("click", function () {
      root.dataset.view = button.dataset.view;
      [].forEach.call(document.querySelectorAll("[data-view]"), function (x) { x.setAttribute("aria-pressed", x === button ? "true" : "false"); });
    });
  });
  options(); render(items, false); load(1);
})();
