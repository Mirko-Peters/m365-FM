/* Benachrichtigungen: E-Mail-Adresse bestätigen, Arten ein-/ausschalten */
(function () {
  var X = window.M365X, U = window.M365U, root = document.getElementById("c-mail"); if (!X || !U || !root) return;
  var de = X.lang === "de", h = U.h, api = U.api;
  var Q = de ? { topicsHint: "Themen folgst du mit dem Knopf „Folgen“ auf Themen- und Entitätsseiten (Push oder E-Mail). Neue Beiträge zu diesen Themen erscheinen auch in der Wochenmail, sofern sie nicht schon als Themen-Mail kamen.", h: "Benachrichtigungen", intro: "Wir schreiben dir nur, wenn etwas dich betrifft. Du bestätigst deine Adresse einmal und schaltest jede Art einzeln ein oder aus. In jeder Mail ist ein Abmeldelink.", email: "E-Mail-Adresse", save: "Bestätigungsmail senden", sent: "Bestätigungsmail ist unterwegs. Klicke den Link darin.", pending: "Noch nicht bestätigt – prüfe dein Postfach.", ok: "Bestätigt", remove: "Adresse entfernen", test: "Testmail senden", testok: "Testmail ist unterwegs.", follows: "Themen-IDs für persönliche Hinweise (durch Komma getrennt)", saveFollows: "Themen speichern", followsSaved: "Themen gespeichert.", off: "Der Mailversand ist auf dieser Plattform noch nicht aktiviert.", login: "Melde dich an, um Benachrichtigungen einzustellen.", kinds: { weekly: "Wochenübersicht und persönliche Hinweise", reply: "Antworten auf meine Kommentare", reply_now: "Antworten sofort statt in der Wochenmail", wish: "Status meiner Wünsche (Roadmap)", show: "Freigabe meiner Podcast-Shows", event: "Einladungen zu Events und Sessions" }, e_email: "Das ist keine gültige Adresse.", e_rate_limit: "Zu viele Versuche – bitte später.", e_mail_off: "Der Mailversand ist noch nicht aktiviert." }
    : { topicsHint: "Follow topics with the “Follow” button on topic and entity pages (push or e-mail). New posts on those topics also appear in the weekly mail unless they already came as a topic mail.", h: "Notifications", intro: "We only write when something concerns you. Confirm your address once and switch each kind on or off. Every mail has an unsubscribe link.", email: "E-mail address", save: "Send confirmation mail", sent: "Confirmation mail is on its way. Click the link inside.", pending: "Not confirmed yet – check your inbox.", ok: "Confirmed", remove: "Remove address", test: "Send test mail", testok: "Test mail is on its way.", follows: "Topic IDs for personal updates (comma-separated)", saveFollows: "Save topics", followsSaved: "Topics saved.", off: "Mail sending is not enabled on this platform yet.", login: "Sign in to manage notifications.", kinds: { weekly: "Weekly overview and personal updates", reply: "Replies to my comments", reply_now: "Send replies immediately instead of in the weekly mail", wish: "Status of my wishes (roadmap)", show: "Approval of my podcast shows", event: "Invitations to events and sessions" }, e_email: "That is not a valid address.", e_rate_limit: "Too many attempts – please try later.", e_mail_off: "Mail sending is not enabled yet." };
  var box = h("div"), msg = h("p", { role: "status", class: "mut" });
  function post(p, b) { return api("/api/mail/" + p, { method: "POST", body: b || {} }); }
  function draw(d) {
    box.textContent = ""; if (!d.configured) box.appendChild(h("p", { class: "mut", text: Q.off }));
    var ei = U.inp(d.email || "", 190), f = h("div", { class: "ed-form" });
    f.appendChild(U.lab(Q.email, ei));
    f.appendChild(h("p", {}, [h("button", { type: "button", class: "btn main", text: Q.save, onclick: function () { post("set", { email: ei.value }).then(function (r) { var j = r.j || {}; msg.textContent = j.ok ? Q.sent : (Q["e_" + j.error] || "Error"); load(); }); } })]));
    box.appendChild(f);
    if (d.email) {
      box.appendChild(h("p", { class: "mut", text: d.email + " · " + (d.verified ? "✓ " + Q.ok : Q.pending) }));
      if (d.verified) {
        var ul = h("ul", { style: "list-style:none;padding:0" });
        Object.keys(Q.kinds).forEach(function (k) {
          var cb = h("input", { type: "checkbox", id: "mp-" + k }); cb.checked = !!d.prefs[k];
          cb.addEventListener("change", function () { post("prefs", { kind: k, on: cb.checked }); });
          ul.appendChild(h("li", { style: "margin:.5em 0" }, [cb, h("label", { for: "mp-" + k, style: "display:inline;font-weight:400;margin-left:.5em", text: Q.kinds[k] })]));
        });
        box.appendChild(ul);
        box.appendChild(h("p", { class: "mut", text: Q.topicsHint }));
        box.appendChild(h("p", {}, [h("button", { type: "button", class: "btn", text: Q.test, onclick: function () { post("test").then(function () { msg.textContent = Q.testok; }); } }), document.createTextNode(" "), h("button", { type: "button", class: "btn", text: Q.remove, onclick: function () { post("remove").then(load); } })]));
      }
    }
  }
  function load() { api("/api/mail/me").then(function (r) { box.textContent = ""; if (r.j && "configured" in r.j) draw(r.j); else box.appendChild(h("p", { text: Q.login })); }); }
  root.appendChild(h("h2", { text: Q.h })); root.appendChild(h("p", { class: "mut", text: Q.intro })); root.appendChild(msg); root.appendChild(box); load();
  var topics = h("div"), topicMsg = h("p", { class: "mut", role: "status" });
  var labels = de ? { entity: "Entität", creator: "Creator", show: "Show", event: "Event", session: "Session" }
    : { entity: "Entity", creator: "Creator", show: "Show", event: "Event", session: "Session" };
  function loadTopics() {
    var endpoint = "";
    var sub = "serviceWorker" in navigator ? navigator.serviceWorker.getRegistration("/").then(function (reg) { return reg ? reg.pushManager.getSubscription() : null; }) : Promise.resolve(null);
    sub.catch(function () { return null; }).then(function (s) {
      endpoint = s ? s.endpoint : "";
      return api("/api/topics/mine" + (endpoint ? "?endpoint=" + encodeURIComponent(endpoint) : ""));
    }).then(function (r) {
      topics.textContent = "";
      if (!r.j || !Array.isArray(r.j.subscriptions)) { topicMsg.textContent = de ? "Bitte melde dich an oder öffne diese Seite in dem Browser mit deinem Push-Abo." : "Sign in or open this page in the browser with your push subscription."; return; }
      topicMsg.textContent = "";
      var items = new Map();
      r.j.subscriptions.forEach(function (x) { items.set(x.kind + "|" + x.topic_id, x); });
      if (!items.size) { topics.appendChild(h("p", { class: "mut", text: de ? "Du folgst noch keinen Themen." : "You are not following any topics yet." })); return; }
      var ul = h("ul", { style: "list-style:none;padding:0" });
      items.forEach(function (x) {
        var btn = h("button", { type: "button", class: "btn", text: de ? "Abwählen" : "Unfollow", onclick: function () {
          api("/api/topics/unfollow", { method: "POST", body: { kind: x.kind, id: x.topic_id, endpoint: endpoint } }).then(loadTopics);
        } });
        ul.appendChild(h("li", { style: "margin:.5em 0" }, [
          h("span", { text: (labels[x.kind] || x.kind) + ": " + (x.label || x.topic_id) + " " }),
          btn,
        ]));
      });
      topics.appendChild(ul);
    }).catch(function () { topicMsg.textContent = de ? "Themen konnten nicht geladen werden." : "Could not load followed topics."; });
  }
  root.appendChild(h("h2", { text: de ? "Meine Benachrichtigungen" : "My notifications" }));
  root.appendChild(h("p", { class: "mut", text: de ? "Folge-Themen ansehen und einzelne Abos oder alle Themen abbestellen." : "Review followed topics and unsubscribe from one or all topics." }));
  root.appendChild(topicMsg); root.appendChild(topics);
  root.appendChild(h("p", {}, [h("button", { type: "button", class: "btn", text: de ? "Alle Themen abbestellen" : "Unfollow all topics", onclick: function () {
    var sub = "serviceWorker" in navigator ? navigator.serviceWorker.getRegistration("/").then(function (reg) { return reg ? reg.pushManager.getSubscription() : null; }) : Promise.resolve(null);
    sub.catch(function () { return null; }).then(function (s) { return api("/api/topics/clear", { method: "POST", body: { endpoint: s ? s.endpoint : "" } }); }).then(loadTopics);
  } })]));
  loadTopics();
})();
