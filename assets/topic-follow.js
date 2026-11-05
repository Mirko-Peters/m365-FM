(function () {
  var C = window.M365TopicConfig;
  if (!C || !C.api) return;
  var DE = {
    following: "{label} · Abwählen",
    email: "Auch per E-Mail",
    need: "Push aktivieren oder E-Mail-Benachrichtigungen auswählen.",
    denied: "Push wurde im Browser blockiert.",
    error: "Benachrichtigungseinstellung fehlgeschlagen.",
    login: "Für E-Mail-Benachrichtigungen bitte anmelden."
  };
  var EN = {
    following: "{label} · Unfollow",
    email: "Also by e-mail",
    need: "Enable push or select e-mail notifications.",
    denied: "Push is blocked by your browser.",
    error: "Could not update notification settings.",
    login: "Sign in to enable e-mail notifications."
  };
  var de = C.lang === "de";
  var msg = typeof window.M365L === "function" ? window.M365L(de, "topic-follow", DE, EN) : (de ? DE : EN);
  var topicLabels = typeof window.M365L === "function" ? window.M365L(de, "topic-follow-labels", {
    "Follow this show": "Diesem Podcast folgen", "Follow host": "Host folgen"
  }, {
    "Follow this show": "Follow this show", "Follow host": "Follow host"
  }) : {};
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
  var mailMe = me.then(function (user) {
    return user ? api("/api/mail/me").then(function (r) { return r.j || {}; }) : {};
  }).catch(function () { return {}; });
  function getSubscription() {
    if (!("serviceWorker" in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.getRegistration("/").then(function (r) { return r ? r.pushManager.getSubscription() : null; })
      .catch(function () { return null; });
  }
  var pageState = Promise.all([getSubscription(), me]).then(function (data) {
    var endpoint = data[0] ? data[0].endpoint : "", user = data[1];
    if (!endpoint && !user) return { endpoint: "", user: null, subscriptions: [] };
    var q = endpoint ? "?endpoint=" + encodeURIComponent(endpoint) : "";
    return api("/api/topics/mine" + q).then(function (r) {
      return { endpoint: endpoint, user: user, subscriptions: r.j && r.j.subscriptions || [] };
    });
  }).catch(function () { return { endpoint: "", user: null, subscriptions: [] }; });
  function init(button) {
    var kind = button.getAttribute("data-topic-kind"), id = button.getAttribute("data-topic-id");
    if (!kind || !id) return;
    var rawLabel = button.getAttribute("data-topic-label") || button.textContent.replace(/^🔔\s*/, "").trim();
    var label = topicLabels[rawLabel] || rawLabel;
    button.disabled = true;
    var status = document.createElement("span"), emailLabel = document.createElement("label"), email = document.createElement("input"), emailReady = false;
    status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    email.type = "checkbox"; emailLabel.hidden = true; emailLabel.style.marginInlineStart = ".7em";
    emailLabel.appendChild(email); emailLabel.appendChild(document.createTextNode(" " + msg.email));
    button.insertAdjacentElement("afterend", emailLabel); emailLabel.insertAdjacentElement("afterend", status);
    function render() {
      button.textContent = "🔔 " + (button._followed ? msg.following.replace("{label}", label) : label);
    }
    Promise.all([pageState, mailMe]).then(function (data) {
      var state = data[0], account = data[1];
      emailReady = !!account.verified;
      emailLabel.hidden = !emailReady;
      var matches = state.subscriptions.filter(function (x) { return x.kind === kind && String(x.topic_id) === id; });
      button._followed = matches.length > 0;
      button._email = matches.some(function (x) { return x.channel === "email"; });
      email.checked = button._email;
      render();
      button.disabled = false;
    }).catch(function () { status.textContent = msg.error; button.disabled = false; });
    button.addEventListener("click", function () {
      button.disabled = true; status.textContent = "";
      Promise.all([getSubscription(), me]).then(function (data) {
        var existing = data[0], endpoint = existing ? existing.endpoint : "", user = data[1];
        if (button._followed && !(email.checked && !button._email))
          return api("/api/topics/unfollow", { method: "POST", body: { kind: kind, id: id, endpoint: endpoint } });
        if (email.checked && !user) { status.textContent = msg.login; return null; }
        var subscription = Promise.resolve(existing), pushKeys = null;
        if (!endpoint && !email.checked) {
          if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) { status.textContent = msg.need; return null; }
          if (Notification.permission === "denied") { status.textContent = msg.denied; return null; }
          subscription = Notification.requestPermission().then(function (permission) {
            if (permission !== "granted") { status.textContent = msg.denied; return ""; }
            return navigator.serviceWorker.register("/sw.js").then(function () { return navigator.serviceWorker.ready; }).then(function (r) {
              return api("/api/push/key").then(function (k) {
                if (!k.j.key) throw new Error("push_off");
                return r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.j.key) });
              });
            });
          });
        }
        return subscription.then(function (sub) {
          if (sub) {
            endpoint = sub.endpoint;
            pushKeys = sub.toJSON().keys;
          }
          return null;
        }).then(function (sub) {
          if (!sub && !email.checked) return null;
          return api("/api/topics/follow", { method: "POST", body: {
            kind: kind, id: id, endpoint: sub ? endpoint : "", lang: C.lang,
            keys: pushKeys, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", email: emailReady && email.checked,
          } });
        });
      }).then(function (r) {
        if (r && r.s === 200) {
          button._followed = !!r.j.following; button._email = !!email.checked;
          render();
        }
        else if (r && r.j && r.j.error === "email_unverified") status.textContent = msg.login;
        else if (r && r.j && r.j.error !== "own") status.textContent = msg.error;
      }).catch(function () { status.textContent = msg.error; }).finally(function () { button.disabled = false; });
    });
  }
  document.querySelectorAll("[data-topic-follow]").forEach(init);
})();
