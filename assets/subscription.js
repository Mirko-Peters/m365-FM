(function () {
  var C = window.M365SUB, T = window.M365CT || {}, root = document.getElementById("pwa-subscribe");
  if (!C || !root) return;
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === "text") el.textContent = attrs[k]; else el.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (child) { el.appendChild(typeof child === "string" ? document.createTextNode(child) : child); });
    return el;
  }
  function api(path, body) {
    return fetch(C.api + path, { method: "POST", credentials: "include", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, data: j }; }); });
  }
  var status = h("p", { class: "cmsg", role: "status" }), push = h("div", { class: "csub" }), mail = h("form", { class: "csub" });
  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !navigator.standalone && !matchMedia("(display-mode: standalone)").matches;
  var pushOK = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  function base64(s) {
    s = (s + "====".slice(s.length % 4 || 4)).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(s), bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
  }
  function setPush() {
    push.textContent = "";
    if (ios) { push.appendChild(h("p", { class: "cmut", text: C.iosHint })); return; }
    if (!pushOK) { push.appendChild(h("p", { class: "cmut", text: T.push_unsupported || "Push notifications are not supported in this browser." })); return; }
    navigator.serviceWorker.getRegistration().then(function (reg) { return reg ? reg.pushManager.getSubscription() : null; }).then(function (sub) {
      if (sub) {
        push.appendChild(h("span", { class: "cok", text: "✓ " + (T.push_on || "Notifications enabled") + " " }));
        push.appendChild(h("button", { type: "button", class: "btn", text: T.push_off || "Disable notifications" }));
        push.lastChild.addEventListener("click", function () { sub.unsubscribe().then(function () { return api("/api/push/unsubscribe", { endpoint: sub.endpoint }); }).then(setPush); });
      } else {
        var btn = h("button", { type: "button", class: "btn main", text: "🔔 " + (T.push_btn || "Enable notifications") });
        btn.addEventListener("click", function () {
          if (Notification.permission === "denied") { status.textContent = T.push_denied || "Notifications are blocked in browser settings."; return; }
          Notification.requestPermission().then(function (permission) {
            if (permission !== "granted") { status.textContent = T.push_denied || "Notifications were not allowed."; return; }
            return navigator.serviceWorker.ready.then(function (sw) {
              return fetch(C.api + "/api/push/key", { credentials: "include", headers: { "x-requested-with": "m365" } }).then(function (r) { return r.json(); }).then(function (key) {
                return sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64(key.key) });
              });
            }).then(function (sub) {
              var keys = sub.toJSON();
              return api("/api/push/subscribe", { endpoint: keys.endpoint, keys: keys.keys, lang: C.lang, source: C.source }).then(setPush);
            });
          }).catch(function () { status.textContent = T.error || "Something went wrong."; });
        });
        push.appendChild(btn);
      }
    }).catch(function () { push.textContent = ""; });
  }
  var email = h("input", { type: "email", required: "required", placeholder: T.email_ph || "Email address", "aria-label": T.email_ph || "Email address", autocomplete: "email" });
  mail.appendChild(email);
  mail.appendChild(h("button", { type: "submit", class: "btn", text: "✉ " + (T.email_btn || "Subscribe by email") }));
  mail.addEventListener("submit", function (e) {
    e.preventDefault();
    api("/api/email/subscribe", { email: email.value, lang: C.lang, source: C.source }).then(function (r) {
      status.textContent = r.status === 200 ? (T.email_sent || "Check your email to confirm.") : r.status === 429 ? (T.rate_limit || "Please try again later.") : (T.error || "Something went wrong.");
      if (r.status === 200) email.value = "";
    }).catch(function () { status.textContent = T.error || "Something went wrong."; });
  });
  root.textContent = "";
  root.appendChild(h("h2", { text: T.sub_title || "Subscribe to new episodes" }));
  root.appendChild(h("p", { class: "cmut", text: T.sub_text || "" }));
  root.appendChild(push);
  root.appendChild(mail);
  root.appendChild(status);
  root.dataset.ready = "1";
  setPush();
})();
