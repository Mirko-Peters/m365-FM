/* #281 Werbeplaetze: laedt je Platz die passende Kampagne vom Worker (cookiefrei, credentials: omit), sobald der Platz in die Naehe
   des Sichtbereichs kommt. Ohne Kampagne bleibt die Hausanzeige stehen. Feste Groessen im CSS: kein Layoutsprung.
   window.M365AD = {api, lang, t, privacy} */
(function () {
  var C = window.M365AD || {}, T = C.t || {};
  if (!C.api || !window.fetch) return;
  function h(tag, attrs, kids) {
    var e = document.createElement(tag); attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) { var v = attrs[k]; if (v == null) return; if (k === "text") e.textContent = v; else if (k === "class") e.className = v; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function fill(s, org) { return String(s || "").split("{org}").join(org); }
  function safe(u) { return /^https:\/\//.test(u || "") ? u : ""; }

  function banner(box, ad, eager) {
    var img = h("img", { src: safe(ad.img), width: ad.w, height: ad.h, alt: ad.alt || "", loading: eager ? "eager" : "lazy", decoding: "async" });
    var pic = h("picture", {}, [ad.mimg && ad.mimg !== ad.img ? h("source", { media: "(max-width:767px)", srcset: safe(ad.mimg), width: ad.mw, height: ad.mh }) : null, img]);
    box.replaceChildren(h("a", { class: "ad-bn", href: safe(ad.href), rel: "sponsored noopener", target: "_blank" }, [pic]));
  }
  function card(box, ad, slotEl) {
    var label = slotEl.querySelector("small"); if (label) label.textContent = T.sponsored || label.textContent;
    var kids = [ad.logo ? h("img", { src: safe(ad.logo), width: "56", height: "56", alt: "", loading: "lazy" }) : null, h("b", { text: ad.org }), h("p", { text: ad.tagline })];
    if (ad.type === "card") kids.push(h("a", { class: "btn main", href: safe(ad.href), rel: "sponsored noopener", text: T.profile }));
    else kids.push(h("button", { type: "button", class: "btn main", text: fill(T.contact, ad.org), onclick: function () { leadDialog(ad, slotEl); } }));
    box.replaceChildren(h("div", { class: "ad-card" }, kids));
  }
  function house(box, x) {
    if (!safe(x.url)) return;
    box.replaceChildren(h("a", { class: "ad-house ad-adv", href: x.url, rel: "nofollow noopener" }, [h("b", { text: x.title }), x.body ? h("span", { text: x.body }) : null, x.cta ? h("em", { text: x.cta }) : null]));
  }

  var tsLoaded = null;
  function turnstile(el, key) {
    if (!key) return Promise.resolve(null);
    if (!tsLoaded) tsLoaded = new Promise(function (ok, bad) {
      var s = document.createElement("script"); s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; s.async = true;
      s.onload = function () { ok(window.turnstile); }; s.onerror = bad; document.head.appendChild(s);
    });
    return tsLoaded.then(function (ts) { return ts ? ts.render(el, { sitekey: key, language: C.lang }) : null; }).catch(function () { return null; });
  }
  function leadDialog(ad, slotEl) {
    var id = "ad-dlg-" + ad.code, d = document.getElementById(id);
    if (!d) {
      var consent = fill(T.consent, ad.org), status = h("p", { role: "status", "aria-live": "polite" }), tsBox = h("div"), widget = null;
      var nameI = h("input", { name: "name", autocomplete: "name", required: "", maxlength: "80" }), mailI = h("input", { name: "email", type: "email", autocomplete: "email", required: "", maxlength: "254" });
      var msgI = h("textarea", { name: "message", rows: "4", maxlength: "2000" }), ck = h("input", { type: "checkbox", name: "consent", required: "" });
      var send = h("button", { type: "submit", class: "btn main", text: T.send });
      var form = h("form", { novalidate: "" }, [
        h("h2", { text: fill(T.contact, ad.org), id: id + "-h", style: "margin:0;font-size:1.25rem" }),
        h("label", {}, [T.name, nameI]), h("label", {}, [T.email, mailI]), h("label", {}, [T.message, msgI]),
        h("label", { class: "ad-ck" }, [ck, h("span", {}, [consent, " ", h("a", { href: C.privacy, target: "_blank", rel: "noopener", text: T.privacy })])]),
        tsBox, send, status]);
      d = h("dialog", { class: "ad-dlg", id: id, "aria-labelledby": id + "-h" }, [h("button", { type: "button", class: "ad-x", "aria-label": T.close, text: "×", onclick: function () { d.close(); } }), form]);
      document.body.appendChild(d);
      turnstile(tsBox, ad.turnstile).then(function (w) { widget = w; });
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var token = window.turnstile && widget != null ? window.turnstile.getResponse(widget) : "";
        send.disabled = true; status.textContent = T.sending;
        fetch(C.api + "/api/ads/lead", { method: "POST", credentials: "omit", headers: { "content-type": "application/json", "x-requested-with": "m365" },
          body: JSON.stringify({ code: ad.code, name: nameI.value, email: mailI.value, message: msgI.value, consent: ck.checked === true, consent_text: consent,
            turnstile: token, lang: C.lang, page: location.href, pt: slotEl.getAttribute("data-pt") }) })
          .then(function (r) { if (!r.ok) throw r; status.textContent = fill(T.ok, ad.org); form.reset(); })
          .catch(function () { send.disabled = false; status.textContent = T.err; if (window.turnstile && widget != null) window.turnstile.reset(widget); });
      });
    }
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }

  function load(slotEl) {
    var box = slotEl.querySelector(".ad-box"); if (!box || slotEl.getAttribute("data-loaded")) return;
    slotEl.setAttribute("data-loaded", "1");
    var name = slotEl.getAttribute("data-ad-slot");
    var q = "?slot=" + encodeURIComponent(name) + "&pt=" + encodeURIComponent(slotEl.getAttribute("data-pt") || "other") +
      "&lang=" + encodeURIComponent(C.lang || "en") + "&topics=" + encodeURIComponent(slotEl.getAttribute("data-topics") || "") +
      "&house=" + encodeURIComponent(slotEl.getAttribute("data-house") || "") + "&p=" + encodeURIComponent(slotEl.getAttribute("data-slug") || "") +
      (slotEl.hasAttribute("data-ad-house") ? "&house_only=1" : "");   // die Hausanzeige im Platz wird ebenfalls gezaehlt (cookiefrei)
    fetch(C.api + "/api/ads/serve" + q, { credentials: "omit" }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) {
      if (j && j.ad) { if (j.ad.type === "banner") banner(box, j.ad, name === "top"); else card(box, j.ad, slotEl); }
      else if (j && j.house) house(box, j.house);
    }).catch(function () {});
  }
  var slots = Array.prototype.slice.call(document.querySelectorAll("[data-ad-slot]"));   // data-ad-house: nur Hausanzeige (wird nur gezaehlt)
  if (!("IntersectionObserver" in window)) { slots.forEach(load); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); load(e.target); } }); }, { rootMargin: "300px 0px" });
  slots.forEach(function (s) { io.observe(s); });
})();
