/* #281 Werbeplaetze: Rechner (Preis kommt immer vom Server, /api/ads/quote), Buchung mit Banner-Upload (WebP in exakter Groesse),
   PayPal-Zahlung, eigene Buchungen mit Zahlen und Leads. Konfiguration im data-cfg von #adbook (site_landing._ads_sections). */
(function () {
  var root = document.getElementById("adbook"); if (!root) return;
  var C = {}; try { C = JSON.parse(root.getAttribute("data-cfg") || "{}"); } catch (e) { return; }
  var T = C.t || {}, N = C.names || {}, API = C.api, LANG = C.lang || "en";
  var SIZES = { banner_top: [[728, 90], [320, 100]], banner_mid: [[300, 250]], banner_bottom: [[728, 90], [320, 100]] };
  var KIND = { banner_top: "cpm", banner_mid: "cpm", banner_bottom: "cpm", company_card: "cpc", lead_form: "cpl" };
  function h(tag, a, kids) {
    var e = document.createElement(tag); a = a || {};
    Object.keys(a).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === "text") e.textContent = v; else if (k === "class") e.className = v; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v); });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function fmt(s, o) { return String(s || "").replace(/\{(\w+)\}/g, function (m, k) { return o && o[k] != null ? o[k] : m; }); }
  function eur(c) { try { return new Intl.NumberFormat(LANG, { style: "currency", currency: "EUR" }).format(c / 100); } catch (e) { return (c / 100).toFixed(2) + " €"; } }
  function num(n) { try { return new Intl.NumberFormat(LANG).format(n); } catch (e) { return String(n); } }
  function api(p, o) {
    o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {});
    if (o.body && !(o.body instanceof Blob) && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; }
    return fetch(API + p, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); });
  }
  var uid = 0; function field(label, input) { var id = "adb-" + (++uid); input.id = id; return h("p", { class: "adb-f" }, [h("label", { for: id, text: label }), input]); }

  // ---------- Rechner
  var S = (C.pricing && C.pricing.settings) || {};
  var product = h("select", {}, Object.keys(KIND).map(function (k) { return h("option", { value: k, text: N[k] || k }); }));
  var PT = ["episode", "lang", "entity", "blog"];
  var pts = PT.map(function (p) { return h("input", { type: "checkbox", value: p, checked: true }); });
  var ptBox = h("fieldset", { class: "adb-pt" }, [h("legend", { text: T.page_types })].concat(pts.map(function (c, i) { return h("label", {}, [c, " " + T["pt_" + PT[i]]]); })));
  var topics = h("input", { type: "text", maxlength: "400", placeholder: "teams-phone, copilot", autocomplete: "off" });
  var excl = h("input", { type: "checkbox" }), exclRow = h("p", { class: "adb-f" }, [h("label", {}, [excl, " " + T.exclusive])]);
  var months = h("select", {}, [1, 2, 3, 4, 5, 6, 9, 12].map(function (m) { return h("option", { value: String(m), text: String(m) }); }));
  var qty = h("input", { type: "number", min: "1", step: "1", value: String(S.min_impressions || 10000), inputmode: "numeric" });
  var qtyLabel = h("label"), minHint = h("small", { class: "mut" });
  var out = h("dl", { class: "adb-sum", "aria-live": "polite" }), note = h("p", { class: "lp-note", text: fmt(T.intro, { topic: S.topic_pct, excl: S.exclusive_pct, r3: S.runtime3_pct, r6: S.runtime6_pct }) });
  var calc = h("div", { class: "adb-calc" }, [h("h3", { text: T.calc }), field(T.product, product), ptBox, field(T.topics, topics), exclRow, field(T.months, months),
    h("p", { class: "adb-f" }, [qtyLabel, qty, minHint]), out, note]);
  qtyLabel.setAttribute("for", qty.id = "adb-qty");
  var lastQuote = null, timer = 0;
  function input() {
    var k = KIND[product.value];
    return { product: product.value, page_types: pts.filter(function (c) { return c.checked; }).map(function (c) { return c.value; }),
      topics: topics.value, exclusive: k === "cpm" && excl.checked, months: Number(months.value), quantity: Number(qty.value) };
  }
  function row(dt, dd) { out.appendChild(h("dt", { text: dt })); out.appendChild(h("dd", { text: dd })); }
  function quote() {
    var k = KIND[product.value];
    qtyLabel.textContent = T["qty_" + k]; exclRow.hidden = k !== "cpm";
    var min = k === "cpm" ? S.min_impressions || 10000 : k === "cpc" ? S.min_clicks || 1 : S.min_leads || 1;
    qty.min = String(min); minHint.textContent = " " + fmt(T.min, { n: num(min) });
    clearTimeout(timer);
    timer = setTimeout(function () {
      api("/api/ads/quote", { method: "POST", body: input() }).then(function (r) {
        out.textContent = ""; lastQuote = r.s === 200 ? r.j.quote : null;
        if (!lastQuote) { out.appendChild(h("dd", { class: "adm-msg bad", text: r.j && r.j.error === "bad_quantity" ? fmt(T.min, { n: num(r.j.min) }) : T.err })); return; }
        var q = lastQuote;
        row(T.subtotal, eur(q.subtotal_cents));
        if (q.discount_cents) row(T.discount + " (−" + q.discount_pct + " %)", "−" + eur(q.discount_cents));
        row(T.net, eur(q.net_cents)); row(T.tax + " (" + q.tax_pct + " %)", eur(q.tax_cents)); row(T.total, eur(q.total_cents));
      });
    }, 250);
  }
  [product, topics, excl, months, qty].concat(pts).forEach(function (el) { el.addEventListener("input", quote); el.addEventListener("change", quote); });

  // aktuelle Preise aus D1 in die Tabelle
  api("/api/ads/pricing").then(function (r) {
    if (r.s !== 200) return; S = r.j.settings || S;
    note.textContent = fmt(T.intro, { topic: S.topic_pct, excl: S.exclusive_pct, r3: S.runtime3_pct, r6: S.runtime6_pct });
    (r.j.prices || []).filter(function (p) { return p.page_type === "episode"; }).forEach(function (p) {
      var cell = document.querySelector('tr[data-product="' + p.product + '"] .ad-price'); if (cell) cell.textContent = eur(p.price_cents);
    });
    quote();
  });

  // ---------- Buchung
  var book = h("div", { class: "adb-book" }), msg = h("p", { class: "adm-msg", role: "status", "aria-live": "polite" }), mine = h("div", { class: "adb-mine" });
  root.textContent = ""; root.append(calc, book, msg, mine);
  var params = new URLSearchParams(location.search), ret = params.get("pay");
  if (ret) msg.textContent = ret === "paid" ? T.ret_paid : ret === "cancelled" ? T.ret_cancelled : T.ret_other;

  function toWebp(file, w, hgt) {   // gleiches Seitenverhaeltnis, exakte Groesse, als WebP
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        if (Math.abs(img.naturalWidth / img.naturalHeight - w / hgt) > 0.02) return bad(fmt(T.err_img, { w: w, h: hgt }));
        if (file.type === "image/webp" && img.naturalWidth === w && img.naturalHeight === hgt) return ok(file);
        var c = document.createElement("canvas"); c.width = w; c.height = hgt; c.getContext("2d").drawImage(img, 0, 0, w, hgt);
        c.toBlob(function (b) { if (b && b.type === "image/webp") ok(b); else bad(fmt(T.err_webp, { w: w, h: hgt })); }, "image/webp", 0.9);
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(fmt(T.err_img, { w: w, h: hgt })); };
      img.src = url;
    });
  }

  function form(orgs) {
    var org = h("select", {}, orgs.map(function (o) { return h("option", { value: String(o.id), text: o.name }); }));
    var target = h("input", { type: "url", placeholder: "https://", maxlength: "500" }), alt = h("input", { type: "text", maxlength: "140" });
    var tagline = h("input", { type: "text", maxlength: "160" }), start = h("input", { type: "date" });
    var files = [h("input", { type: "file", accept: "image/webp,image/png,image/jpeg" }), h("input", { type: "file", accept: "image/webp,image/png,image/jpeg" })];
    var fileRows = [field("", files[0]), field("", files[1])];
    var b = {}; ["company", "address", "postal", "city", "country", "vat", "bemail"].forEach(function (k) { b[k] = h("input", { type: k === "bemail" ? "email" : "text", maxlength: "200", autocomplete: { company: "organization", address: "street-address", postal: "postal-code", city: "address-level2", country: "country", bemail: "email" }[k] || "off" }); });
    var payPP = h("input", { type: "radio", name: "adb-pay", value: "paypal", checked: true }), payInv = h("input", { type: "radio", name: "adb-pay", value: "invoice" });
    var submit = h("button", { type: "submit", class: "btn main", text: T.submit });
    var creative = h("div"), cardRows = field(T.tagline, tagline), bannerRows = h("div", {}, [field(T.target, target), field(T.alt, alt), fileRows[0], fileRows[1]]);
    function sync() {
      var k = KIND[product.value], sz = SIZES[product.value];
      bannerRows.hidden = k !== "cpm"; cardRows.hidden = k === "cpm";
      if (sz) { fileRows[0].querySelector("label").textContent = fmt(T.banner, { w: sz[0][0], h: sz[0][1] }); fileRows[1].hidden = !sz[1];
        if (sz[1]) fileRows[1].querySelector("label").textContent = fmt(T.banner_m, { w: sz[1][0], h: sz[1][1] }); }
    }
    product.addEventListener("change", sync); creative.append(bannerRows, cardRows); sync();
    var f = h("form", { class: "adb-form", novalidate: true }, [h("h3", { text: T.book }), field(T.org, org), creative, field(T.start, start),
      h("fieldset", {}, [h("legend", { text: T.billing }), field(T.company, b.company), field(T.address, b.address), field(T.postal, b.postal), field(T.city, b.city),
        field(T.country, b.country), field(T.vat, b.vat), field(T.bemail, b.bemail)]),
      h("fieldset", {}, [h("legend", { text: T.pay }), h("label", {}, [payPP, " " + T.pay_pp]), " ", h("label", {}, [payInv, " " + T.pay_inv])]), submit]);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault(); var k = KIND[product.value], sz = SIZES[product.value] || [];
      submit.disabled = true; msg.textContent = T.busy; msg.className = "adm-msg";
      var fail = function (t) { submit.disabled = false; msg.textContent = t || T.err; msg.className = "adm-msg bad"; };
      var jobs = k === "cpm" ? sz.map(function (s, i) { return files[i].files[0] ? toWebp(files[i].files[0], s[0], s[1]) : Promise.reject(fmt(T.banner, { w: s[0], h: s[1] })); }) : [];
      Promise.all(jobs).then(function (blobs) {
        var body = Object.assign(input(), { org_id: Number(org.value), target_url: target.value, alt: alt.value, tagline: tagline.value, start: start.value || null, lang: LANG,
          pay_method: payInv.checked ? "invoice" : "paypal",
          billing: { company: b.company.value, address: b.address.value, postal_code: b.postal.value, city: b.city.value, country: b.country.value, vat_id: b.vat.value, email: b.bemail.value } });
        return api("/api/ads/bookings", { method: "POST", body: body }).then(function (r) {
          if (r.s !== 200) throw (r.j && r.j.error === "bad_quantity") ? fmt(T.min, { n: num(r.j.min) }) : T.err;
          var id = r.j.booking.id;
          return blobs.reduce(function (p, blob, i) {
            return p.then(function () { return api("/api/ads/banner?id=" + id + "&variant=" + (i ? "mobile" : "desktop"), { method: "POST", body: blob, headers: { "content-type": "image/webp" } })
              .then(function (u) { if (u.s !== 200) throw T.err; }); });
          }, Promise.resolve()).then(function () { return pay(id); });
        });
      }).catch(function (e) { fail(typeof e === "string" ? e : T.err); });
    });
    return f;
  }

  function pay(id) {
    return api("/api/ads/pay", { method: "POST", body: { id: id } }).then(function (r) {
      if (r.s !== 200) throw T.err;
      if (r.j.approve_url && /^https:\/\/www\.(sandbox\.)?paypal\.com\//.test(r.j.approve_url)) { location.href = r.j.approve_url; return; }
      msg.textContent = T.invoice_sent; msg.className = "adm-msg"; loadMine();
    });
  }

  function statusText(b) {
    var parts = [T["st_" + b.status] || b.status, b.pay_status === "paid" ? T.paid : T.unpaid,
      b.creative_status === "approved" ? T.approved : b.creative_status === "rejected" ? fmt(T.rejected, { reason: b.reject_reason }) : T.review];
    return parts.join(" · ");
  }
  function loadMine() {
    api("/api/ads/mine").then(function (r) {
      mine.textContent = ""; if (r.s !== 200) return;
      mine.appendChild(h("h3", { text: T.mine }));
      if (!(r.j.bookings || []).length) { mine.appendChild(h("p", { class: "mut", text: T.none })); }
      else {
        var tb = h("tbody");
        r.j.bookings.forEach(function (b) {
          var s = b.stats || {}, act = null;
          if (["draft", "awaiting"].indexOf(b.status) >= 0 && ["pending", "approved"].indexOf(b.pay_status) >= 0)
            act = b.pay_method === "invoice" && b.invoice_url ? h("a", { href: b.invoice_url, rel: "noopener", target: "_blank", text: T.invoice })
              : h("button", { type: "button", class: "btn", text: T.pay_now, onclick: function (ev) { ev.target.disabled = true; pay(b.id).catch(function () { ev.target.disabled = false; msg.textContent = T.err; }); } });
          tb.appendChild(h("tr", {}, [h("td", {}, [h("b", { text: N[b.product] || b.product }), h("br"), h("small", { text: b.code + " · " + eur(b.total_cents) })]),
            h("td", { text: statusText(b) }), h("td", { text: num(s.impressions || 0) }), h("td", { text: num(s.clicks || 0) }),
            h("td", { text: s.ctr == null ? "–" : s.ctr + " %" }), h("td", { text: num(s.leads || 0) }), h("td", {}, [act])]));
        });
        mine.appendChild(h("div", { style: "overflow-x:auto" }, [h("table", { class: "lp-table" }, [h("thead", {}, [h("tr", {}, [T.product, T.status, T.impressions, T.clicks, T.ctr, T.leads, T.pay].map(function (x) {
          return h("th", { scope: "col", text: x }); }))]), tb])]));
      }
      (r.j.orgs || []).forEach(function (o) {
        if (!(r.j.bookings || []).some(function (b) { return b.org_id === o.id && b.product === "lead_form"; })) return;
        api("/api/ads/leads?org=" + encodeURIComponent(o.handle)).then(function (l) {
          if (l.s !== 200 || !(l.j.leads || []).length) return;
          var lt = h("tbody");
          l.j.leads.forEach(function (x) {
            lt.appendChild(h("tr", {}, [h("td", { text: new Date(x.created * 1000).toLocaleDateString(LANG) }), h("td", { text: x.name }),
              h("td", {}, [h("a", { href: "mailto:" + x.email, text: x.email })]), h("td", { text: x.message }),
              h("td", {}, [x.status === "new" ? h("button", { type: "button", class: "btn", text: T.dispute, onclick: function (ev) {
                var reason = window.prompt(T.dispute_reason) || ""; if (reason.length < 5) return;
                ev.target.disabled = true; api("/api/ads/leads/dispute", { method: "POST", body: { id: x.id, reason: reason } }).then(loadMine); } }) : null])]));
          });
          mine.appendChild(h("h3", { text: T.leads_h + " · " + o.name }));
          mine.appendChild(h("div", { style: "overflow-x:auto" }, [h("table", { class: "lp-table" }, [h("thead", {}, [h("tr", {}, [T.date, T.name, T.email, T.message, T.status].map(function (x) {
            return h("th", { scope: "col", text: x }); }))]), lt])]));
        });
      });
    });
  }

  fetch(API + "/api/me", { credentials: "include" }).then(function (r) { return r.json(); }).then(function (j) {
    if (!j || !j.user) {
      var ret = encodeURIComponent(C.page + "#book");
      book.append(h("p", { text: T.login }), h("p", {}, [h("a", { class: "btn main", href: C.community + "?return=" + ret, text: T.signin })]));
      return;
    }
    api("/api/ads/mine").then(function (r) {
      var orgs = (r.j && r.j.orgs) || [];
      if (!orgs.length) { book.appendChild(h("p", {}, [T.no_org + " ", h("a", { href: C.community, text: "Community" })])); return; }
      book.appendChild(form(orgs)); loadMine();
    });
  }).catch(function () { book.appendChild(h("p", { text: T.login })); });
  quote();
})();
