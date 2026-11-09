/* MVP-Tracker: eigene Quellen hinzufuegen (Typ > Link > Vorschau der letzten 3 > tracken/veroeffentlichen/fragen > speichern),
   Quellenliste mit Status und die Liste "Neu gefunden". Wird von mvp-tracker.js nachgeladen und bekommt dessen Bausteine (ctx). */
(function () {
  "use strict";
  var de = (window.M365X && window.M365X.lang) === "de";
  var M365L = window.M365L || function (d, k, a, b) { return d ? a : b; };
  var Q = M365L(de, "mvpsrc.Q", {
    inbox: "Neu gefunden", inbox_intro: "Neue Funde aus deinen Quellen. Nichts davon ist öffentlich, bis du es entscheidest.", inbox_none: "Nichts Neues. Neue Funde erscheinen hier, sobald eine Quelle mit „Jedes Mal fragen“ etwas findet.",
    track: "Tracken", post: "Als Kurzpost veröffentlichen", ignore: "Ignorieren", type: "MVP-Kategorie", no_link: "Ohne Link kann kein Kurzpost entstehen.", from: "Quelle",
    add: "Eigene Quelle hinzufügen", step1: "1. Art der Quelle", step2: "2. Link", step3: "3. Was soll mit neuen Beiträgen passieren?", url: "Link (https)", preview: "Vorschau der letzten 3", previewing: "Lade …",
    prev_h: "Letzte Beiträge", prev_none: "Hier ist nichts zu sehen. Prüfe den Link.", next: "Weiter", back: "Zurück", save: "Quelle speichern", cancel: "Abbrechen", title: "Name der Quelle (optional)",
    m_ask: "Jedes Mal fragen", m_ask_d: "Neue Beiträge landen in „Neu gefunden“, du entscheidest je Beitrag. Empfohlen.", m_track: "Nur tracken", m_track_d: "Zählt für den MVP-Tracker und bleibt privat, ohne öffentliche Seite.",
    m_publish: "Als Kurzpost veröffentlichen", m_publish_d: "Jeder neue Beitrag wird ein Kurzpost im Community-Feed (Titel, 1–2 Sätze, Link zum Original, als externer Beitrag gekennzeichnet, nofollow). Für Google erst mit eigenem Text. Höchstens 5 pro Tag; beim ersten Abruf einer Quelle wird nichts veröffentlicht.",
    m_gh: "GitHub-Aktivität bleibt privat und kann nicht veröffentlicht werden.", topics: "Themen für Kurzposts (Entitäts-IDs, kommagetrennt)", saved: "Gespeichert.", err: "Das hat nicht geklappt. Bitte versuche es erneut.",
    bad_url: "Bitte gib einen passenden https-Link ein.", no_mode: "Wähle eine Option.", li_url: "Artikel-Link", li_zip: "Datenexport (ZIP)", li_url_h: "Wir lesen nur Titel, Beschreibung und Datum aus den Open-Graph-Angaben der Seite.",
    li_zip_h: "LinkedIn: Einstellungen > Datenschutz > Kopie Ihrer Daten > Artikel. Die ZIP-Datei wird nur in deinem Browser gelesen; gesendet werden nur die Einträge, die du auswählst (Titel, Link, Datum).",
    li_read: "Lese die Datei …", li_empty: "In der Datei wurden keine Artikel oder Beiträge gefunden.", li_fetch: "Angaben laden", date: "Datum", pick: "Auswählen", sel: "{n} ausgewählt",
    other_h: "Eintrag von Hand", ent_title: "Titel", s_mode: "Modus", s_items: "{n} Einträge", s_found: "{n} neu gefunden", s_last: "Zuletzt abgerufen: {d}", s_never: "Noch nicht abgerufen", s_err: "Fehler: {e}", s_manual: "Manuell",
    imported: "{n} Einträge übernommen.", k_podcast: "Podcast (RSS)", k_blog: "Blog (RSS/Atom)", k_youtube: "YouTube-Kanal", k_github: "GitHub", k_techcommunity: "Microsoft Tech Community", k_sessionize: "Sessionize-Profil",
    k_stackoverflow: "Stack Overflow / Stack Exchange", k_package: "Pakete (npm, NuGet, PowerShell Gallery)", k_meetup: "Meetup-Gruppe", k_linkedin: "LinkedIn-Artikel", k_other: "Anderer Link (manuell)",
    h_podcast: "RSS-Adresse deines Podcasts oder Link zur Seite.", h_blog: "Adresse des Blogs oder des Feeds (WordPress, Medium, dev.to, Hashnode, Substack, Ghost).", h_youtube: "Kanal-Link, z. B. https://www.youtube.com/@name (Uploads-Feed, ohne API-Schlüssel).",
    h_github: "Profil https://github.com/name (Aktivität) oder Repository https://github.com/name/repo (Releases).", h_techcommunity: "Feed-Link oder Seite eines Blogs der Tech Community.", h_sessionize: "https://sessionize.com/dein-name",
    h_stackoverflow: "Profil-Link mit Nummer, z. B. https://stackoverflow.com/users/123/name.", h_package: "https://www.npmjs.com/~name, https://www.nuget.org/profiles/name oder https://www.powershellgallery.com/profiles/name",
    h_meetup: "https://www.meetup.com/gruppen-name/", e_fetch_failed: "Die Quelle konnte nicht gelesen werden.", e_bad_source: "Der Link passt nicht zur gewählten Art.", e_source_exists: "Diese Quelle gibt es schon.", e_source_limit: "Es sind höchstens 20 Quellen möglich.",
    e_not_publishable: "Dieser Beitrag kann nicht veröffentlicht werden.", e_profile_required: "Für Kurzposts brauchst du ein öffentliches Profil mit Handle.", e_url_taken: "Dieser Link ist schon von jemand anderem im Feed.", e_rate_limit: "Zu viele Aktionen heute.",
    e_not_trusted: "Kurzposts stehen vertrauenswürdigen Mitgliedern offen: bestätigtes Programm (MVP, MCT, RD, MSA, Microsoft) oder 25 Community-Punkte. Bis dahin warten neue Beiträge in „Neu gefunden“ und lassen sich tracken.",
    e_post_limit: "Heute sind schon 5 Kurzposts veröffentlicht. Der Beitrag bleibt in „Neu gefunden“, morgen geht es weiter.", e_hidden_by_moderation: "Dieser Kurzpost wurde von der Moderation ausgeblendet und kann nicht erneut veröffentlicht werden.",
    e_already_in_feed: "Dieser Link ist über einen deiner Profil-Kanäle schon im Community-Feed. Wähle „Tracken“.", e_too_old: "Nur Beiträge der letzten 120 Tage können Kurzposts werden. Wähle „Tracken“.", e_contribution_limit: "Es sind zu viele Einträge von Hand.",
    imp_posted: "{n} als Kurzpost veröffentlicht.", imp_held: "{n} warten in „Neu gefunden“:", imp_unposted: "{n} nur getrackt (ohne Link, älter als 120 Tage oder schon im Feed).",
    p_h: "Kurzpost", p_chip: "Kurzpost", p_live: "Dieser Beitrag steht als Kurzpost im Community-Feed.", p_hint: "Wenn du den Eintrag löschst, wird auch der Kurzpost entfernt.", p_withdrawn: "Der Kurzpost ist zurückgezogen und nicht mehr öffentlich.",
    p_moderated: "Der Kurzpost wurde von der Moderation ausgeblendet.", unpost: "Kurzpost zurückziehen", unposted: "Der Kurzpost ist zurückgezogen.", repost: "Wieder veröffentlichen"
  }, {
    inbox: "New finds", inbox_intro: "New finds from your sources. Nothing here is public until you decide.", inbox_none: "Nothing new. New finds show up here when a source set to “Ask every time” finds something.",
    track: "Track", post: "Publish as short post", ignore: "Ignore", type: "MVP category", no_link: "Without a link there can be no short post.", from: "Source",
    add: "Add your own source", step1: "1. Type of source", step2: "2. Link", step3: "3. What should happen to new items?", url: "Link (https)", preview: "Preview the last 3", previewing: "Loading …",
    prev_h: "Latest items", prev_none: "Nothing to see here. Check the link.", next: "Next", back: "Back", save: "Save source", cancel: "Cancel", title: "Name of the source (optional)",
    m_ask: "Ask every time", m_ask_d: "New items land in “New finds” and you decide per item. Recommended.", m_track: "Only track", m_track_d: "Counts for the MVP tracker and stays private, with no public page.",
    m_publish: "Publish as short post", m_publish_d: "Every new item becomes a short post in the community feed (title, 1-2 sentences, link to the original, labelled as an external post, nofollow). Indexed by Google only with your own text. Up to 5 per day; nothing is published on the first fetch of a source.",
    m_gh: "GitHub activity stays private and cannot be published.", topics: "Topics for short posts (entity ids, comma separated)", saved: "Saved.", err: "That did not work. Please try again.",
    bad_url: "Please enter a matching https link.", no_mode: "Choose an option.", li_url: "Article link", li_zip: "Data export (ZIP)", li_url_h: "We only read the title, description and date from the page's Open Graph tags.",
    li_zip_h: "LinkedIn: Settings > Data privacy > Get a copy of your data > Articles. The ZIP file is read only in your browser; only the items you select (title, link, date) are sent.",
    li_read: "Reading the file …", li_empty: "No articles or posts were found in the file.", li_fetch: "Load details", date: "Date", pick: "Select", sel: "{n} selected",
    other_h: "Entry by hand", ent_title: "Title", s_mode: "Mode", s_items: "{n} items", s_found: "{n} new finds", s_last: "Last fetched: {d}", s_never: "Not fetched yet", s_err: "Error: {e}", s_manual: "Manual",
    imported: "{n} items added.", k_podcast: "Podcast (RSS)", k_blog: "Blog (RSS/Atom)", k_youtube: "YouTube channel", k_github: "GitHub", k_techcommunity: "Microsoft Tech Community", k_sessionize: "Sessionize profile",
    k_stackoverflow: "Stack Overflow / Stack Exchange", k_package: "Packages (npm, NuGet, PowerShell Gallery)", k_meetup: "Meetup group", k_linkedin: "LinkedIn articles", k_other: "Other link (manual)",
    h_podcast: "RSS address of your podcast or a link to its page.", h_blog: "Address of the blog or its feed (WordPress, Medium, dev.to, Hashnode, Substack, Ghost).", h_youtube: "Channel link, e.g. https://www.youtube.com/@name (uploads feed, no API key).",
    h_github: "Profile https://github.com/name (activity) or repository https://github.com/name/repo (releases).", h_techcommunity: "Feed link or page of a Tech Community blog.", h_sessionize: "https://sessionize.com/your-name",
    h_stackoverflow: "Profile link with number, e.g. https://stackoverflow.com/users/123/name.", h_package: "https://www.npmjs.com/~name, https://www.nuget.org/profiles/name or https://www.powershellgallery.com/profiles/name",
    h_meetup: "https://www.meetup.com/group-name/", e_fetch_failed: "The source could not be read.", e_bad_source: "The link does not match the chosen type.", e_source_exists: "This source already exists.", e_source_limit: "You can add up to 20 sources.",
    e_not_publishable: "This item cannot be published.", e_profile_required: "Short posts need a public profile with a handle.", e_url_taken: "This link is already in the feed from someone else.", e_rate_limit: "Too many actions today.",
    e_not_trusted: "Short posts are open to trusted members: a confirmed program (MVP, MCT, RD, MSA, Microsoft) or 25 community points. Until then new items wait in “New finds” and can be tracked.",
    e_post_limit: "You have already published 5 short posts today. The item stays in “New finds”; try again tomorrow.", e_hidden_by_moderation: "This short post was hidden by the moderation team and cannot be published again.",
    e_already_in_feed: "This link is already in the community feed through one of your profile channels. Choose “Track”.", e_too_old: "Only items from the last 120 days can become short posts. Choose “Track”.", e_contribution_limit: "Too many entries added by hand.",
    imp_posted: "{n} published as short posts.", imp_held: "{n} are waiting in “New finds”:", imp_unposted: "{n} only tracked (no link, older than 120 days or already in the feed).",
    p_h: "Short post", p_chip: "Short post", p_live: "This entry is published as a short post in the community feed.", p_hint: "Deleting the entry also removes the short post.", p_withdrawn: "The short post has been taken back and is no longer public.",
    p_moderated: "The short post was hidden by the moderation team.", unpost: "Take short post back", unposted: "The short post has been taken back.", repost: "Publish again"
  });
  var KINDS = ["podcast", "blog", "youtube", "github", "techcommunity", "sessionize", "stackoverflow", "package", "meetup", "linkedin", "other"];
  var TYPES = ["Blog/Article", "Podcast", "Video/Webcast", "Speaking", "Open Source/Code", "Q&A/Forum", "Book", "Other"];
  var W = fresh();
  function fresh() { return { step: 1, kind: "", url: "", title: "", items: null, chosen: null, mode: "ask", topics: "", err: "", busy: false, li: "url", picked: {} }; }
  function f(s, v) { Object.keys(v || {}).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); }); return s; }
  function err(j) { var k = "e_" + ((j && j.error) || ""); return Q[k] || (j && j.message) || Q.err; }
  function isManual(k) { return k === "linkedin" || k === "other"; }
  function day(sec) { return new Date(sec * 1000).toISOString().slice(0, 10); }

  function radio(c, name, val, label, desc, cur, disabled, pick) {
    var id = "mvpsrc-" + name + "-" + val, r = c.el("input", { type: "radio", name: name, id: id, value: val, checked: cur === val, disabled: !!disabled, onchange: function () { pick(val); } });
    return c.el("div", { class: "mvpsrc-opt" }, [r, c.el("label", { for: id }, [c.el("b", { text: label }), c.el("span", { class: "mvp-mut", text: " " + desc })])]);
  }

  function addCard(c) {
    var out = [c.el("h3", { text: Q.add })], again = function () { c.render(false); };
    if (W.err) out.push(c.el("p", { class: "mvp-msg err", role: "alert", text: W.err }));
    if (W.step === 1) {
      out.push(c.el("p", { class: "mvp-mut", text: Q.step1 }));
      var g = c.el("div", { class: "mvp-seg mvpsrc-kinds", role: "group", "aria-label": Q.step1 });
      KINDS.forEach(function (k) { g.appendChild(c.el("button", { type: "button", "aria-pressed": W.kind === k ? "true" : "false", text: Q["k_" + k], onclick: function () { W = Object.assign(fresh(), { kind: k, step: 2 }); again(); } })); });
      out.push(g);
    } else if (W.step === 2) out = out.concat(stepLink(c, again));
    else out = out.concat(stepMode(c, again));
    return c.el("section", { class: "mvp-card mvpsrc-add" }, out);
  }

  function stepLink(c, again) {
    var out = [c.el("p", { class: "mvp-mut", text: Q.step2 + " · " + Q["k_" + W.kind] })], k = W.kind;
    var back = c.btn(Q.back, function () { W = fresh(); again(); });
    if (k === "other") return out.concat(manualForm(c, again, back));
    if (k === "linkedin") {
      // Wechsel zwischen Link und ZIP: auch die fruehere Auswahl verwerfen, sonst wuerde save() sie statt des zuletzt Gezeigten senden
      out.push(c.segmented(Q.step2, [["url", Q.li_url], ["zip", Q.li_zip]], W.li, function (v) { W.li = v; W.items = null; W.chosen = null; W.picked = {}; W.err = ""; again(); }));
      return out.concat(W.li === "zip" ? zipPart(c, again, back) : liUrlPart(c, again, back));
    }
    var url = c.input("url", W.url, { inputmode: "url", placeholder: "https://", required: true, autocomplete: "off" }), prev = c.el("div", { class: "mvpsrc-prev", "aria-live": "polite" });
    out.push(c.field(Q.url, url, Q["h_" + k]));
    if (W.items) prev.appendChild(previewList(c, W.items));
    var go = c.btn(W.busy ? Q.previewing : Q.preview, function () {
      if (!/^https:\/\//i.test(url.value.trim())) return c.invalid(url, Q.bad_url);
      W.url = url.value.trim(); W.busy = true; W.err = ""; W.items = null; again();
      c.api("/api/contributions/source/preview", { kind: k, url: W.url }).then(function (r) {
        W.busy = false;
        if (r.s === 200) W.items = r.j.items || []; else W.err = err(r.j);
        again();
      });
    }, "", { disabled: W.busy });
    var next = c.btn(Q.next, function () { if (!/^https:\/\//i.test(url.value.trim())) return c.invalid(url, Q.bad_url); W.url = url.value.trim(); W.step = 3; W.err = ""; again(); }, "main");
    out.push(prev, c.el("div", { class: "btns" }, [back, go, next]));
    return out;
  }
  function previewList(c, items) {
    if (!items.length) return c.el("p", { class: "mvp-empty", text: Q.prev_none });
    var ul = c.el("ul", { class: "mvp-list" });
    items.forEach(function (i) { ul.appendChild(c.el("li", { class: "mvp-item" }, [c.el("b", { class: "mvp-title", text: i.title }), c.el("span", { class: "mvp-mut", text: day(i.published) + " · " + i.type })])); });
    return c.el("div", {}, [c.el("h4", { text: Q.prev_h }), ul]);
  }

  function liUrlPart(c, again, back) {
    var url = c.input("url", W.url, { inputmode: "url", placeholder: "https://www.linkedin.com/pulse/…", autocomplete: "off" }), out = [c.field(Q.li_url, url, Q.li_url_h)];
    if (!W.items) {
      out.push(c.el("div", { class: "btns" }, [back, c.btn(Q.li_fetch, function () {
        if (!/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(url.value.trim())) return c.invalid(url, Q.bad_url);
        W.url = url.value.trim(); W.err = "";
        c.api("/api/contributions/linkedin-og?url=" + encodeURIComponent(W.url)).then(function (r) {
          if (r.s !== 200) { W.err = err(r.j); return again(); }
          var p = r.j.preview || {}; W.chosen = null; W.items = [{ title: p.title || "", url: p.url || W.url, date: p.published || "", summary: p.description || "" }]; again();
        });
      }, "main")]));
      return out;
    }
    var it = W.items[0], t = c.input("text", it.title, { maxlength: "200" }), d = c.input("date", it.date);
    out.push(c.field(Q.ent_title, t), c.field(Q.date, d), c.el("div", { class: "btns" }, [back, c.btn(Q.next, function () {
      if (t.value.trim().length < 3) return c.invalid(t, Q.err);
      if (!d.value) return c.invalid(d, Q.err);
      it.title = t.value.trim(); it.date = d.value; W.step = 3; W.err = ""; again();
    }, "main")]));
    return out;
  }

  function zipPart(c, again, back) {
    var file = c.input("file", "", { accept: ".zip,application/zip", "aria-label": Q.li_zip }), out = [c.field(Q.li_zip, file, Q.li_zip_h)], status = c.el("p", { class: "mvp-mut", role: "status" });
    file.addEventListener("change", function () {
      var fl = file.files && file.files[0]; if (!fl) return;
      status.textContent = Q.li_read;
      fl.arrayBuffer().then(function (buf) { return window.M365LinkedInExport.readZip(buf); }).then(function (files) {
        W.items = window.M365LinkedInExport.parseExport(files); W.picked = {}; W.err = W.items.length ? "" : Q.li_empty; again();
      }).catch(function () { W.err = Q.li_empty; again(); });
    });
    out.push(status);
    if (W.items && W.items.length) {
      var ul = c.el("ul", { class: "mvp-list mvpsrc-pick" }), count = c.el("p", { class: "mvp-mut", "aria-live": "polite", text: f(Q.sel, { n: Object.keys(W.picked).length }) });
      W.items.slice(0, 300).forEach(function (i, n) {
        var cb = c.check(i.date + " · " + i.title, !!W.picked[n], function (e) { if (e.target.checked) W.picked[n] = 1; else delete W.picked[n]; count.textContent = f(Q.sel, { n: Object.keys(W.picked).length }); });
        ul.appendChild(c.el("li", { class: "mvp-item" }, [cb]));
      });
      out.push(count, ul);
    }
    out.push(c.el("div", { class: "btns" }, [back, c.btn(Q.next, function () {
      var pick = (W.items || []).filter(function (i, n) { return W.picked[n]; });
      if (!pick.length) { W.err = Q.no_mode; return again(); }
      W.chosen = pick; W.step = 3; W.err = ""; again();
    }, "main")]));
    if (!W.items) W.chosen = null;
    return out;
  }

  function manualForm(c, again, back) {
    var t = c.input("text", "", { maxlength: "200" }), u = c.input("url", "", { inputmode: "url", placeholder: "https://" }), d = c.input("date", ""), ty = c.select(TYPES.map(function (x) { return [x, x]; }), "Other");
    return [c.field(Q.ent_title, t), c.field(Q.url, u), c.field(Q.date, d), c.field(Q.type, ty), c.el("div", { class: "btns" }, [back, c.btn(Q.next, function () {
      if (t.value.trim().length < 3) return c.invalid(t, Q.err);
      if (u.value.trim() && !/^https:\/\//i.test(u.value.trim())) return c.invalid(u, Q.bad_url);
      if (!d.value) return c.invalid(d, Q.err);
      W.chosen = [{ title: t.value.trim(), url: u.value.trim(), date: d.value, summary: "", ctype: ty.value }]; W.step = 3; W.err = ""; again();
    }, "main")])];
  }

  function stepMode(c, again) {
    var k = W.kind, ghOnly = k === "github", out = [c.el("p", { class: "mvp-mut", text: Q.step3 })];
    ["ask", "track", "publish"].forEach(function (m) { out.push(radio(c, "mvpsrc-mode", m, Q["m_" + m], Q["m_" + m + "_d"], W.mode, m === "publish" && ghOnly, function (v) { W.mode = v; again(); })); });
    if (ghOnly) out.push(c.el("p", { class: "mvp-mut", text: Q.m_gh }));
    var tp = c.input("text", W.topics, { maxlength: "300", placeholder: "power-bi, copilot" }), ti = c.input("text", W.title, { maxlength: "100" });
    if (W.mode === "publish" || W.mode === "ask") out.push(c.field(Q.topics, tp));
    if (!isManual(k)) out.push(c.field(Q.title, ti));
    out.push(c.el("div", { class: "btns" }, [c.btn(Q.back, function () { W.topics = tp.value; W.title = ti.value; W.step = 2; again(); }), c.btn(Q.save, function () { W.topics = tp.value; W.title = ti.value; save(c, again); }, "main"), c.btn(Q.cancel, function () { W = fresh(); again(); })]));
    return out;
  }

  function save(c, again) {
    var topics = W.topics.split(",").map(function (x) { return x.trim(); }).filter(Boolean), done = function (text) { W = fresh(); c.load(function () { c.say(text, true); }); };
    if (isManual(W.kind)) {
      var items = (W.chosen || W.items || []).slice(0, 200).map(function (i) { return { title: i.title, url: i.url, date: i.date, summary: i.summary || "", ctype: i.ctype || undefined }; });
      return c.api("/api/contributions/import", { kind: W.kind, mode: W.mode, items: items }).then(function (r) { if (r.s === 201) done(importText(r.j)); else { W.err = err(r.j); again(); } });
    }
    c.api("/api/contributions/source", { kind: W.kind, url: W.url, title: W.title, mode: W.mode, topics: topics }).then(function (r) {
      if (r.s === 201) done(Q.saved + (r.j.hint ? " " + err({ error: r.j.hint }) : "")); else { W.err = err(r.j); if (r.j.error === "bad_source") W.step = 2; again(); }
    });
  }
  // Ergebnis eines Imports in Worten: was uebernommen wurde, was als Kurzpost erschien, was (und warum) wartet oder nur getrackt ist
  function importText(j) {
    var out = [f(Q.imported, { n: j.added })];
    if (j.published) out.push(f(Q.imp_posted, { n: j.published }));
    if (j.held && j.pending) out.push(f(Q.imp_held, { n: j.pending }) + " " + err({ error: j.held }));
    if (j.unposted) out.push(f(Q.imp_unposted, { n: j.unposted }));
    return out.join(" ");
  }

  // Zusatzzeilen je Quelle: Modus (aenderbar), Status, Funde, Fehler
  function rowExtras(c, s) {
    var info = [c.el("span", { class: "mvp-chip", text: s.mode === "publish" ? Q.m_publish : s.mode === "track" ? Q.m_track : Q.m_ask }), c.el("span", { class: "mvp-mut", text: f(Q.s_items, { n: s.items }) })];
    if (s.found) info.push(c.el("span", { class: "mvp-chip", text: f(Q.s_found, { n: s.found }) }));
    info.push(c.el("span", { class: "mvp-mut", text: s.kind === "linkedin" || s.kind === "other" ? Q.s_manual : s.fetched ? f(Q.s_last, { d: c.fmtDate(s.fetched) }) : Q.s_never }));
    if (s.last_error) info.push(c.el("span", { class: "mvp-mut", text: f(Q.s_err, { e: s.last_error }) }));
    var modes = [["ask", Q.m_ask], ["track", Q.m_track]].concat(s.kind === "github" ? [] : [["publish", Q.m_publish]]);
    return [c.el("div", { class: "mvp-row sub" }, info), c.segmented(Q.s_mode, modes, s.mode || "track", function (m) { c.api("/api/contributions/source/update", { id: s.id, mode: m }).then(function (r) { if (r.s === 200) c.load(function () { c.say(Q.saved, true); }); else c.say(err(r.j)); }); })];
  }

  function inbox(c) {
    var list = (c.S.data.contributions || []).filter(function (x) { return x.review === "pending"; }), out = [c.heading(Q.inbox), c.el("p", { class: "mvp-mut", text: Q.inbox_intro })];
    if (!list.length) { out.push(c.el("p", { class: "mvp-empty", text: Q.inbox_none })); return out; }
    var ul = c.el("ul", { class: "mvp-list" });
    list.forEach(function (x) {
      var ty = c.select(TYPES.map(function (t) { return [t, t]; }), x.type, { "aria-label": Q.type }), act = function (a) {
        c.api("/api/contributions/review", { id: x.id, action: a, ctype: ty.value !== x.type ? ty.value : undefined }).then(function (r) { if (r.s === 200) c.load(function () { c.say(Q.saved, true); }); else c.say(err(r.j)); });
      };
      ul.appendChild(c.el("li", { class: "mvp-item" }, [
        c.el("b", { class: "mvp-title", text: x.title }),
        c.el("div", { class: "mvp-row sub" }, [c.el("span", { class: "mvp-mut", text: c.fmtDate(x.published) }), x.url ? c.el("span", { class: "mvp-mut mvp-url", text: c.hostOf(x.url) }) : null]),
        x.summary ? c.el("p", { class: "mvp-mut", text: x.summary }) : null,
        c.field(Q.type, ty),
        c.el("div", { class: "btns" }, [c.btn(Q.track, function () { act("track"); }, "main"), c.btn(Q.post, function () { act("publish"); }, "", x.url ? {} : { disabled: true, title: Q.no_link }), c.btn(Q.ignore, function () { act("ignore"); })])]));
    });
    out.push(ul);
    return out;
  }

  // Kurzpost eines Eintrags (Detailansicht in mvp-tracker.js): Stand zeigen, zurueckziehen, (wieder) veroeffentlichen.
  // Funde entscheidet "Neu gefunden"; ohne Link und fuer GitHub-Aktivitaet gibt es keinen Kurzpost.
  function postBox(c, x) {
    if (!x || (!x.post && (x.review || !x.url || x.kind === "github"))) return null;
    var act = function (path, body, ok) { c.api(path, body).then(function (r) { if (r.s === 200) c.load(function () { c.say(ok, true); }); else c.say(err(r.j)); }); };
    var publish = function () { act("/api/contributions/review", { id: x.id, action: "publish" }, Q.saved); }, kids = [c.el("h3", { text: Q.p_h })];
    if (x.post === "live") kids.push(c.el("p", { class: "mvp-mut", text: Q.p_live + " " + Q.p_hint }), c.el("div", { class: "btns" }, [c.btn(Q.unpost, function () { act("/api/contributions/unpublish", { id: x.id }, Q.unposted); })]));
    else if (x.post === "moderated") kids.push(c.el("p", { class: "mvp-mut", text: Q.p_moderated }));
    else if (x.post === "withdrawn") kids.push(c.el("p", { class: "mvp-mut", text: Q.p_withdrawn }), c.el("div", { class: "btns" }, [c.btn(Q.repost, publish)]));
    else kids.push(c.el("p", { class: "mvp-mut", text: Q.m_publish_d }), c.el("div", { class: "btns" }, [c.btn(Q.post, publish)]));
    return c.el("section", { class: "mvp-card mvpsrc-post" }, kids);
  }

  window.M365MVPSources = { addCard: addCard, rowExtras: rowExtras, inbox: inbox, postBox: postBox, label: Q.inbox, strings: Q };
})();
