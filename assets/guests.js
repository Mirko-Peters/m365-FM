/* Gäste-Börse: Speaker finden Hosts (Podcast, YouTube, Events) und umgekehrt – über gemeinsame Themen */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, U = window.M365U, root = document.getElementById("c-guests"); if (!X || !U || !root) return;
  var de = X.lang === "de", h = U.h, api = U.api;
  var Q = M365L(de, "guests.Q", { h: "Gäste-Börse", intro: "Podcaster, YouTuber und Veranstalter finden Gäste und Speaker – und umgekehrt. Zugeordnet wird über gemeinsame Themen (Entitäten), Sprache und Format. Kontakt läuft über die Nachrichten der Plattform. Dein Profil muss öffentlich sein.", login: "Melde dich an, um einen Eintrag anzulegen.", speaker: "Ich bin als Gast/Speaker verfügbar", host: "Meine Show/mein Kanal/mein Event sucht Gäste", title_h: "Name der Show, des Kanals oder Events", title_s: "Kurzthema (optional)", formats: "Formate", langs: "Sprachen", topics: "Themen", note: "Hinweis (max. 500 Zeichen)", link: "Link zur Show (https, optional)", active: "Aktiv (sichtbar)", save: "Speichern", del_: "Löschen", confirmdel: "Eintrag löschen?", edit: "Bearbeiten", mine: "Meine Einträge", matches: "Passende Treffer", none: "Noch nichts da.", nomatch: "Noch keine Treffer – mehr Themen helfen.", contact: "Nachricht senden", shared: "Gemeinsame Themen", saved: "Gespeichert.", f_podcast: "Podcast", f_youtube: "YouTube", f_event: "Event", f_webinar: "Webinar", f_article: "Artikel/Blog", st_speaker: "Speaker", st_host: "Host", e_need_profile: "Mache zuerst dein Profil öffentlich (Reiter Profil).", e_formats: "Wähle mindestens ein Format.", e_langs: "Wähle mindestens eine Sprache.", e_topics: "Wähle mindestens ein Thema.", e_title: "Der Name braucht mindestens 3 Zeichen.", e_limit: "Du hast die maximale Anzahl Einträge dieser Art erreicht.", e_bad_link: "Der Link muss mit https:// beginnen.", e_generic: "Das hat nicht geklappt.", paused: "pausiert" },
    { h: "Guest exchange", intro: "Podcasters, YouTubers and organizers find guests and speakers – and the other way round. Matching uses shared topics (entities), language and format. Contact goes through the platform messages. Your profile must be public.", login: "Sign in to add a listing.", speaker: "I am available as a guest/speaker", host: "My show/channel/event looks for guests", title_h: "Name of the show, channel or event", title_s: "Short topic (optional)", formats: "Formats", langs: "Languages", topics: "Topics", note: "Note (max. 500 characters)", link: "Link to the show (https, optional)", active: "Active (visible)", save: "Save", del_: "Delete", confirmdel: "Delete this listing?", edit: "Edit", mine: "My listings", matches: "Matches for you", none: "Nothing here yet.", nomatch: "No matches yet – more topics help.", contact: "Send message", shared: "Shared topics", saved: "Saved.", f_podcast: "Podcast", f_youtube: "YouTube", f_event: "Event", f_webinar: "Webinar", f_article: "Article/blog", st_speaker: "Speaker", st_host: "Host", e_need_profile: "Make your profile public first (tab Profile).", e_formats: "Choose at least one format.", e_langs: "Choose at least one language.", e_topics: "Choose at least one topic.", e_title: "The name needs at least 3 characters.", e_limit: "You reached the maximum number of listings of this kind.", e_bad_link: "The link must start with https://.", e_generic: "That did not work.", paused: "paused" });
  var R = M365L(de, "guests.R", { h: "Publisher ↔ Expert:innen", intro: "Anfragen zu Themen für Zitat, Interview, Gastbeitrag, Podcast-Gast oder Talk – passende Expert:innen erhalten eine Web-Push-Benachrichtigung. Nur angemeldete Konten sehen Anfragen.", policy: "Maximal 5 neue Anfragen pro Woche, höchstens 10 Antworten pro Tag. Konten müssen mindestens 24 Stunden alt sein.", add: "Anfrage anlegen", title: "Titel", description: "Anfrage (20–1000 Zeichen, ohne Links)", format: "Format", lang: "Sprache", deadline: "Frist", create: "Veröffentlichen", created: "Anfrage veröffentlicht.", requests: "Meine Anfragen", opportunities: "Passende Anfragen", replies: "Antworten", reply: "Antworten", send: "Antwort senden", report: "Melden", block: "Publisher sperren", close: "Schließen", none: "Noch keine passenden Anfragen.", no_requests: "Noch keine Anfragen.", login: "Bitte melde dich an, um Publisher-Anfragen zu sehen oder anzulegen.", format_quote: "Zitat", format_interview: "Interview", format_article: "Gastbeitrag", format_podcast: "Podcast-Gast", format_talk: "Talk", reported: "Gemeldet.", sent: "Antwort gesendet.", blocked: "Publisher gesperrt.", closed: "Anfrage geschlossen.", report_reason: "Grund für die Meldung (optional)", confirm_block: "Diesen Publisher sperren und seine Anfragen ausblenden?", confirm_close: "Anfrage schließen?", e_account_too_new: "Neue Konten können erst nach 24 Stunden Anfragen anlegen.", e_weekly_limit: "Maximal 5 neue Anfragen pro Woche.", e_daily_limit: "Maximal 10 Antworten pro Tag.", e_already_replied: "Du hast bereits geantwortet.", e_blocked: "Diese Person ist gesperrt.", e_text: "Bitte Titel und Anfrage vollständig ausfüllen.", e_topics: "Wähle 1 bis 10 Themen.", e_format: "Wähle ein Format.", e_lang: "Wähle eine unterstützte Sprache.", e_deadline: "Die Frist muss heute oder später liegen.", e_topic: "Das Thema ist ungültig.", e_rate_limit: "Zu viele Meldungen. Bitte später erneut versuchen." },
    { h: "Publisher ↔ experts", intro: "Requests about topics for a quote, interview, guest article, podcast appearance or talk. Matching experts receive a web-push notification. Requests are visible only to signed-in accounts.", policy: "Maximum 5 new requests per week and 10 replies per day. Accounts must be at least 24 hours old.", add: "Create request", title: "Title", description: "Request (20–1000 characters, no links)", format: "Format", lang: "Language", deadline: "Deadline", create: "Publish", created: "Request published.", requests: "My requests", opportunities: "Matching requests", replies: "Replies", reply: "Reply", send: "Send reply", report: "Report", block: "Block publisher", close: "Close", none: "No matching requests yet.", no_requests: "No requests yet.", login: "Sign in to see or create Publisher requests.", format_quote: "Quote", format_interview: "Interview", format_article: "Guest article", format_podcast: "Podcast guest", format_talk: "Talk", reported: "Reported.", sent: "Reply sent.", blocked: "Publisher blocked.", closed: "Request closed.", report_reason: "Reason for the report (optional)", confirm_block: "Block this Publisher and hide their requests?", confirm_close: "Close this request?", e_account_too_new: "New accounts can create requests after 24 hours.", e_weekly_limit: "Maximum 5 new requests per week.", e_daily_limit: "Maximum 10 replies per day.", e_already_replied: "You already replied.", e_blocked: "This account is blocked.", e_text: "Please complete the title and request.", e_topics: "Choose 1 to 10 topics.", e_format: "Choose a format.", e_lang: "Choose a supported language.", e_deadline: "The deadline must be today or later.", e_topic: "That topic is invalid.", e_rate_limit: "Too many reports. Try again later." });
  var BR = M365L(de, "guests.BR", { block: "Expert:in sperren", confirm: "Dieses Expert:innen-Konto sperren?", done: "Konto gesperrt.", free: "Kostenlos" }, { block: "Block expert", confirm: "Block this expert account?", done: "Account blocked.", free: "Free" });
  var FM = ["podcast", "youtube", "event", "webinar", "article"], LG = [["en", "English"], ["de", "Deutsch"], ["fr", "Français"], ["es", "Español"], ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português"], ["pl", "Polski"], ["id", "Bahasa Indonesia"], ["ru", "Русский"], ["uk", "Українська"], ["ar", "العربية"], ["he", "עברית"], ["hi", "हिन्दी"], ["ja", "日本語"], ["ko", "한국어"], ["ml", "മലയാളം"], ["pa", "ਪੰਜਾਬੀ"], ["ta", "தமிழ்"], ["te", "తెలుగు"]];
  var msg = h("p", { role: "status", class: "mut" }), box = h("div"), list = h("div"), NAMES = {}, reqSection;
  function say(t) { msg.textContent = t || ""; }
  function pfx() { return X.lang && X.lang !== "en" ? "/" + X.lang : ""; }
  function checks(opts, sel, labelOf) {
    var wrap = h("div", { style: "display:flex;gap:.8em;flex-wrap:wrap" }), boxes = [];
    opts.forEach(function (o) { var c = h("input", { type: "checkbox", value: o[0] }); c.checked = sel.indexOf(o[0]) > -1; boxes.push(c); wrap.appendChild(h("label", {}, [c, " " + (labelOf ? labelOf(o) : o[1])])); });
    wrap.get = function () { return boxes.filter(function (c) { return c.checked; }).map(function (c) { return c.value; }); }; return wrap;
  }
  function form(kind, p) {
    p = p || {}; var f = h("form", { class: "ed-form" }), ti = U.inp(p.title, 120), no = h("textarea", { maxlength: 500, rows: 3 }), li = U.inp(p.link, 300), ac = h("input", { type: "checkbox" });
    no.value = p.note || ""; ac.checked = p.active !== 0 && p.active !== false;
    var fm = checks(FM.map(function (x) { return [x]; }), p.formats || [], function (o) { return Q["f_" + o[0]]; }), lg = checks(LG, p.langs || [X.lang || "en"]), tp = U.topicsUI(p.topics || [], 10);
    f.appendChild(h("h3", { text: kind === "host" ? Q.host : Q.speaker })); f.appendChild(U.lab(kind === "host" ? Q.title_h : Q.title_s, ti));
    f.appendChild(h("div", {}, [h("b", { text: Q.formats }), fm])); f.appendChild(h("div", {}, [h("b", { text: Q.langs }), lg])); f.appendChild(h("div", {}, [h("b", { text: Q.topics }), tp]));
    f.appendChild(U.lab(Q.note, no)); if (kind === "host") f.appendChild(U.lab(Q.link, li)); f.appendChild(h("p", {}, [h("label", {}, [ac, " " + Q.active])]));
    f.appendChild(h("p", {}, [h("button", { type: "button", class: "btn main", text: Q.save, onclick: function () {
      api("/api/guests/save", { method: "POST", body: { id: p.id, kind: kind, title: ti.value, formats: fm.get(), langs: lg.get(), topics: tp.get(), note: no.value, link: li.value, active: ac.checked } }).then(function (r) { var j = r.j || {}; if (j.ok) { box.textContent = ""; say(Q.saved); load(); } else say(Q["e_" + j.error] || Q.e_generic); });
    } }), " ", h("button", { type: "button", class: "btn", text: "×", "aria-label": "Close", onclick: function () { box.textContent = ""; } })]));
    f.addEventListener("submit", function (e) { e.preventDefault(); }); return f;
  }
  function tname(id) { return NAMES[id] || id; }
  function load() {
    api("/api/guests/mine").then(function (r) {
      var d = r.j || {}; list.textContent = ""; if (!d.items) return;
      list.appendChild(h("h3", { text: Q.mine })); if (!d.items.length) list.appendChild(h("p", { class: "mut", text: Q.none }));
      d.items.forEach(function (p) {
        list.appendChild(h("p", {}, [h("b", { text: (p.title || Q["st_" + p.kind]) }), h("span", { class: "mut", text: " · " + Q["st_" + p.kind] + " · " + p.topics.map(tname).join(", ") + (p.active ? "" : " · " + Q.paused) }), " ",
          h("button", { type: "button", class: "btn", text: Q.edit, onclick: function () { box.textContent = ""; box.appendChild(form(p.kind, p)); } }), " ",
          h("button", { type: "button", class: "btn", text: Q.del_, onclick: function () { if (confirm(Q.confirmdel)) api("/api/guests/delete", { method: "POST", body: { id: p.id } }).then(load); } })]));
      });
      list.appendChild(h("h3", { text: Q.matches })); if (!d.matches.length) list.appendChild(h("p", { class: "mut", text: Q.nomatch }));
      d.matches.forEach(function (m) {
        list.appendChild(h("div", { style: "padding:.5em 0;border-bottom:1px solid var(--bd)" }, [h("b", { text: (m.title || m.name) }), h("span", { class: "mut", text: " · " + Q["st_" + m.kind] + " · " + m.name }), m.note ? h("p", { text: m.note }) : null,
          h("p", { class: "mut", text: Q.shared + ": " + m.shared.map(tname).join(", ") }),
          h("a", { class: "btn main", href: X.base + pfx() + "/community/?msg=" + m.handle + "#c-messages", text: Q.contact }), " ", m.link ? h("a", { class: "btn", href: m.link, rel: "nofollow ugc noopener", target: "_blank", text: "↗" }) : null]));
      });
    });
  }
  function requestForm() {
    var f = h("form", { class: "ed-form" }), ti = U.inp("", 120), desc = h("textarea", { maxlength: 1000, rows: 4 }), tp = U.topicsUI([], 10);
    var formats = h("select"), langs = h("select"), deadline = h("input", { type: "date" });
    [["quote", "interview", "article", "podcast", "talk"]].forEach(function (xs) { xs.forEach(function (x) { formats.appendChild(h("option", { value: x, text: R["format_" + x] })); }); });
    [["en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"]].forEach(function (xs) { xs.forEach(function (x) { langs.appendChild(h("option", { value: x, text: x.toUpperCase() })); }); });
    langs.value = X.lang || "en"; deadline.value = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    f.appendChild(h("h4", { text: R.add })); f.appendChild(U.lab(R.title, ti)); f.appendChild(U.lab(R.description, desc)); f.appendChild(U.lab(Q.topics, tp));
    f.appendChild(U.lab(R.format, formats)); f.appendChild(U.lab(R.lang, langs)); f.appendChild(U.lab(R.deadline, deadline));
    f.appendChild(h("button", { type: "button", class: "btn main", text: R.create, onclick: function () {
      api("/api/expert-requests/create", { method: "POST", body: { title: ti.value, description: desc.value, topics: tp.get(), format: formats.value, lang: langs.value, deadline: deadline.value } }).then(function (r) {
        if (r.j && r.j.ok) { say(R.created); loadRequests(); }
        else say(R["e_" + (r.j || {}).error] || Q.e_generic);
      });
    } }));
    f.addEventListener("submit", function (e) { e.preventDefault(); }); return f;
  }
  function loadRequests() {
    api("/api/expert-requests/matches").then(function (r) {
      var d = r.j || {}; if (!d.requests) return;
      var sec = h("section", { style: "margin-top:2em" }); sec.appendChild(h("h3", { text: R.h })); sec.appendChild(h("p", { class: "mut", text: R.intro })); sec.appendChild(h("p", { class: "mut", text: BR.free + " · " + R.policy }));
      sec.appendChild(h("p", {}, [h("button", { type: "button", class: "btn main", text: R.add, onclick: function () { if (!sec.querySelector("form")) sec.insertBefore(requestForm(), sec.children[3] || null); } })]));
      sec.appendChild(h("h3", { text: R.requests }));
      if (!d.requests.length) sec.appendChild(h("p", { class: "mut", text: R.no_requests }));
      d.requests.forEach(function (item) {
        var card = h("div", { style: "padding:.7em 0;border-bottom:1px solid var(--bd)" });
        card.appendChild(h("b", { text: item.title })); card.appendChild(h("p", { text: item.description }));
        card.appendChild(h("p", { class: "mut", text: item.topics.map(tname).join(", ") + " · " + R["format_" + item.format] + " · " + item.lang.toUpperCase() + " · " + item.deadline }));
        card.appendChild(h("p", { class: "mut", text: R.replies + ": " + item.replies.length }));
        item.replies.forEach(function (x) { card.appendChild(h("p", {}, [h("b", { text: x.expert + ": " }), x.body, " ", h("button", { type: "button", class: "btn", text: BR.block, onclick: function () { if (confirm(BR.confirm)) api("/api/expert-requests/block", { method: "POST", body: { reply_id: x.id } }).then(function (y) { say(y.j && y.j.ok ? BR.done : Q.e_generic); }); } }), item.status === "open" ? " " : null, item.status === "open" ? h("button", { type: "button", class: "btn", text: R.report, onclick: function () { var reason = prompt(R.report_reason); if (reason !== null) api("/api/expert-requests/report", { method: "POST", body: { reply_id: x.id, reason: reason } }).then(function (y) { say(y.j && y.j.ok ? R.reported : R["e_" + (y.j || {}).error] || Q.e_generic); }); } }) : null])); });
        if (item.status === "open") card.appendChild(h("button", { type: "button", class: "btn", text: R.close, onclick: function () { if (confirm(R.confirm_close)) api("/api/expert-requests/close", { method: "POST", body: { id: item.id } }).then(loadRequests); } }));
        sec.appendChild(card);
      });
      sec.appendChild(h("h3", { text: R.opportunities }));
      if (!d.matches.length) sec.appendChild(h("p", { class: "mut", text: R.none }));
      d.matches.forEach(function (item) {
        var card = h("div", { style: "padding:.7em 0;border-bottom:1px solid var(--bd)" }), area = h("div");
        card.appendChild(h("b", { text: item.title })); card.appendChild(h("span", { class: "mut", text: " · " + item.author + " · " + R["format_" + item.format] + " · " + item.lang.toUpperCase() + " · " + item.deadline }));
        card.appendChild(h("p", { text: item.description })); card.appendChild(h("p", { class: "mut", text: item.topics.map(tname).join(", ") }));
        card.appendChild(item.responded ? h("p", { class: "mut", text: R.sent }) : h("button", { type: "button", class: "btn", text: R.reply, onclick: function () {
          if (area.firstChild) return;
          var body = h("textarea", { maxlength: 1000, rows: 3 }), send = h("button", { type: "button", class: "btn main", text: R.send, onclick: function () {
            api("/api/expert-requests/respond", { method: "POST", body: { id: item.id, body: body.value } }).then(function (x) { if (x.j && x.j.ok) { say(R.sent); loadRequests(); } else say(R["e_" + (x.j || {}).error] || Q.e_generic); });
          } });
          area.appendChild(body); area.appendChild(send);
        } })); card.appendChild(h("button", { type: "button", class: "btn", text: R.report, onclick: function () {
          var reason = prompt(R.report_reason); if (reason !== null) api("/api/expert-requests/report", { method: "POST", body: { id: item.id, reason: reason } }).then(function (x) { say(x.j && x.j.ok ? R.reported : R["e_" + (x.j || {}).error] || Q.e_generic); });
        } }));
        card.appendChild(h("button", { type: "button", class: "btn", text: R.block, onclick: function () {
          if (confirm(R.confirm_block)) api("/api/expert-requests/block", { method: "POST", body: { id: item.id } }).then(function (x) { say(x.j && x.j.ok ? R.blocked : Q.e_generic); loadRequests(); });
        } }));
        card.appendChild(area); sec.appendChild(card);
      });
      if (reqSection && reqSection.parentNode) reqSection.parentNode.removeChild(reqSection);
      reqSection = sec; root.appendChild(reqSection);
    });
  }
  root.appendChild(h("h2", { text: Q.h })); root.appendChild(h("p", { class: "mut", text: Q.intro })); root.appendChild(msg);
  root.appendChild(h("p", {}, [h("button", { type: "button", class: "btn main", text: Q.speaker, onclick: function () { box.textContent = ""; box.appendChild(form("speaker")); } }), " ", h("button", { type: "button", class: "btn main", text: Q.host, onclick: function () { box.textContent = ""; box.appendChild(form("host")); } })]));
  root.appendChild(box); root.appendChild(list);
  fetch("/entities.json").then(function (r) { return r.json(); }).then(function (j) { (j.entities || []).forEach(function (e) { NAMES[e.id] = e.name; }); }).catch(function () {}).then(function () {
    api("/api/me").then(function (r) { if (r.j && r.j.user) { load(); loadRequests(); } else { root.appendChild(h("p", { text: Q.login })); root.appendChild(h("h3", { text: R.h })); root.appendChild(h("p", { text: R.login })); } }).catch(function () { root.appendChild(h("p", { text: Q.login })); });
  });
})();
