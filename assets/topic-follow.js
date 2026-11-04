(function () {
  var C = window.M365T;
  if (!C || !C.api) return;
  var TEXT = {
    en: ["🔔 Follow", "🔔 Following · Unfollow", "Also by e-mail"],
    de: ["🔔 Folgen", "🔔 Gefolgt · Abwählen", "Auch per E-Mail"],
    es: ["🔔 Seguir", "🔔 Siguiendo · Dejar de seguir", "También por correo"],
    fr: ["🔔 Suivre", "🔔 Suivi · Ne plus suivre", "Aussi par e-mail"],
    it: ["🔔 Segui", "🔔 Seguito · Non seguire più", "Anche via e-mail"],
    pt: ["🔔 Seguir", "🔔 Seguindo · Deixar de seguir", "Também por e-mail"],
    nl: ["🔔 Volgen", "🔔 Gevolgd · Ontvolgen", "Ook per e-mail"],
    pl: ["🔔 Obserwuj", "🔔 Obserwujesz · Przestań obserwować", "Także e-mailem"],
    id: ["🔔 Ikuti", "🔔 Diikuti · Berhenti mengikuti", "Juga melalui e-mail"],
    ru: ["🔔 Подписаться", "🔔 Вы подписаны · Отписаться", "Также по эл. почте"],
    uk: ["🔔 Стежити", "🔔 Ви стежите · Відписатися", "Також електронною поштою"],
    ar: ["🔔 متابعة", "🔔 تتم المتابعة · إلغاء", "أيضًا عبر البريد"],
    he: ["🔔 לעקוב", "🔔 במעקב · להפסיק", "גם בדוא״ל"],
    ja: ["🔔 フォロー", "🔔 フォロー中 · 解除", "メールでも受け取る"],
    ko: ["🔔 팔로우", "🔔 팔로잉 · 취소", "이메일로도 받기"],
  };
  var labels = TEXT[C.lang] || TEXT.en, de = C.lang === "de";
  var msg = { follow: labels[0], unfollow: labels[1], email: labels[2],
    need: de ? "Push aktivieren oder E-Mail-Benachrichtigungen auswählen." : "Enable push or select e-mail notifications.",
    denied: de ? "Push wurde im Browser blockiert." : "Push is blocked by your browser.",
    error: de ? "Benachrichtigungseinstellung fehlgeschlagen." : "Could not update notification settings.",
    login: de ? "Für E-Mail-Benachrichtigungen bitte anmelden." : "Sign in to enable e-mail notifications." };
  function api(path, options) {
    options = options || {}; options.credentials = "include";
    options.headers = Object.assign({ "x-requested-with": "m365" }, options.headers || {});
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body); options.headers["content-type"] = "application/json";
    }
    return fetch(C.api + path, options).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); });
  }
  function b64(s) {
    s = (s + "====".slice(s.length % 4 || 4)).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(s), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  var me = api("/api/me").then(function (r) { return r.j.user || null; }).catch(function () { return null; });
  function getEndpoint() {
    if (!("serviceWorker" in navigator)) return Promise.resolve("");
    return navigator.serviceWorker.getRegistration("/").then(function (r) { return r ? r.pushManager.getSubscription() : null; })
      .then(function (s) { return s ? s.endpoint : ""; }).catch(function () { return ""; });
  }
  function init(button) {
    var kind = button.getAttribute("data-topic-kind"), id = button.getAttribute("data-topic-id");
    if (!kind || !id) return;
    button.disabled = true;
    var status = document.createElement("span"), emailLabel = document.createElement("label"), email = document.createElement("input"), emailReady = false;
    status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    email.type = "checkbox"; emailLabel.hidden = true; emailLabel.style.marginInlineStart = ".7em";
    emailLabel.appendChild(email); emailLabel.appendChild(document.createTextNode(" " + msg.email));
    button.insertAdjacentElement("afterend", emailLabel); emailLabel.insertAdjacentElement("afterend", status);
    var endpoint = "";
    Promise.all([getEndpoint(), me]).then(function (data) {
      endpoint = data[0];
      if (data[1]) return api("/api/mail/me").then(function (r) { emailReady = !!(r.j && r.j.verified); emailLabel.hidden = !emailReady; });
    }).then(function () {
      var q = new URLSearchParams({ kind: kind, id: id }); if (endpoint) q.set("endpoint", endpoint);
      return api("/api/topics/status?" + q.toString());
    }).then(function (r) {
      button._followed = !!(r.j && r.j.following); button._email = !!(r.j && r.j.email); email.checked = button._email;
      button.textContent = button._followed ? msg.unfollow : msg.follow;
      button.disabled = false;
    }).catch(function () { status.textContent = msg.error; button.disabled = false; });
    button.addEventListener("click", function () {
      button.disabled = true; status.textContent = "";
      Promise.all([getEndpoint(), me]).then(function (data) {
        endpoint = data[0]; var user = data[1];
        if (button._followed && !(email.checked && !button._email)) return api("/api/topics/unfollow", { method: "POST", body: { kind: kind, id: id, endpoint: endpoint } });
        if (email.checked && !user) { status.textContent = msg.login; return null; }
        var ensureSubscription = Promise.resolve(endpoint);
        if (!endpoint && !email.checked) {
          if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) { status.textContent = msg.need; return null; }
          if (Notification.permission === "denied") { status.textContent = msg.denied; return null; }
          ensureSubscription = Notification.requestPermission().then(function (permission) {
            if (permission !== "granted") { status.textContent = msg.denied; return ""; }
            return navigator.serviceWorker.register("/sw.js").then(function () { return navigator.serviceWorker.ready; }).then(function (r) {
              return api("/api/push/key").then(function (k) {
                if (!k.j.key) throw new Error("push_off");
                return r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.j.key) });
              }).then(function (s) {
                endpoint = s.endpoint; var j = s.toJSON();
                return api("/api/push/subscribe", { method: "POST", body: { endpoint: endpoint, keys: j.keys, lang: C.lang } }).then(function () { return endpoint; });
              });
            });
          });
        }
        return ensureSubscription.then(function (ep) {
          if (!ep && !email.checked) return null;
          return api("/api/topics/follow", { method: "POST", body: {
            kind: kind, id: id, endpoint: ep || "", lang: C.lang,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", email: emailReady && email.checked,
          } });
        });
      }).then(function (r) {
        if (r && r.s === 200) {
          button._followed = !!r.j.following; button._email = !!email.checked;
          button.textContent = button._followed ? msg.unfollow : msg.follow;
        }
        else if (r && r.j && r.j.error === "email_unverified") status.textContent = msg.login;
        else if (r && r.j && r.j.error !== "own") status.textContent = msg.error;
      }).catch(function () { status.textContent = msg.error; }).finally(function () { button.disabled = false; });
    });
  }
  document.querySelectorAll("[data-topic-follow]").forEach(init);
})();
