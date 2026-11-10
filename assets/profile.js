/* Experten-Profil und Firmen-Konten bearbeiten (Community-Seite, nur eingeloggt). window.M365X = {api, base, lang}. Nur DOM-Knoten. */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, root = document.getElementById("c-expert"); if (!X || !root || /[?&]u=/.test(location.search)) return;
  var orgHost = document.createElement("div"); orgHost.id = "c-orgs"; root.parentNode.insertBefore(orgHost, root.nextSibling);
  (function tabs() {   // Reiter: Konto | Profil | Firmen | Events | Nachrichten
    var de0 = (X.lang || "en") === "de", T0 = [["c-page", de0 ? "Konto" : "Account"], ["c-expert", de0 ? "Profil" : "Profile"], ["c-mvp", (window.M365CT || {}).mvp_tab || "MVP Tracker"], ["c-orgs", de0 ? "Firmen" : "Companies"], ["c-events", "Events"], ["c-blog", "Blog"], ["c-podcast", "Podcast"], ["c-shows", de0 ? "Podcast-Umzug" : "Podcast move"], ["c-video", de0 ? "Videos" : "Videos"], ["c-library", de0 ? "Bibliothek" : "Library"], ["c-feed", de0 ? "Meine Inhalte" : "My content"], ["c-notes", "Show Notes"], ["c-guests", de0 ? "Gäste" : "Guests"], ["c-wish", de0 ? "Roadmap & Wünsche" : "Roadmap & wishes"], ["c-mail", de0 ? "Benachrichtigungen" : "Notifications"], ["c-messages", de0 ? "Nachrichten" : "Messages"]];
    var bar = document.createElement("div"); bar.setAttribute("role", "tablist"); bar.className = "ctabs";
    function show(id) { T0.forEach(function (t) { var el = document.getElementById(t[0]); if (el) el.hidden = t[0] !== id; }); [].forEach.call(bar.children, function (b) { b.setAttribute("aria-selected", b.dataset.t === id ? "true" : "false"); }); try { if ((location.hash || "").indexOf("#" + id + "/") !== 0) history.replaceState(null, "", "#" + id); } catch (e) {} }   // Unterseiten wie #c-mvp/log bleiben erhalten
    T0.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.className = "ctab"; b.setAttribute("role", "tab"); b.dataset.t = t[0]; b.textContent = t[1]; b.onclick = function () { show(t[0]); }; bar.appendChild(b); });
    var first = document.getElementById("c-page"); first.parentNode.insertBefore(bar, first);
    var h0 = (location.hash || "").slice(1).split("/")[0]; show(T0.some(function (t) { return t[0] === h0; }) ? h0 : "c-page");
    window.addEventListener("hashchange", function () { var x = location.hash.slice(1).split("/")[0]; if (T0.some(function (t) { return t[0] === x; })) show(x); });
  })();
  var de = X.lang === "de";
  var Q = M365L(de, "profile.Q", { bad_email: "Die E-Mail-Adresse ist ungültig.", h: "Öffentliches Experten-Profil", intro: "Freiwillig: Mit einem öffentlichen Profil erscheinst du im Mitgliederverzeichnis, bei deinen Themen und mit Verknüpfung zu den Schema.org-Entitäten. Programme und Expertise werden vom Redaktionsteam bestätigt oder von Mitgliedern gegengezeichnet.", pub: "Profil öffentlich anzeigen", handle: "Profil-Adresse (a-z, 0-9, -)", headline: "Kurzzeile (z. B. Power BI Berater, MVP)", about: "Über mich (Bio, ohne Links)", company: "Firma (Freitext)", job: "Position", country: "Land", showorg: "Firmenzugehörigkeit öffentlich zeigen", prog: "Microsoft-Programme", year: "Seit (Jahr)", proof: "Nachweis-Link (https)", exp: "Themen und Expertise", addexp: "Thema hinzufügen", lvl: ["Lernt", "Praxis", "Experte", "Evangelist", "Master", "Master Evangelist"], exp_auto: "Deine Themen und Stufen belegt das System: Blog-Beiträge, bestätigte Sessions, Podcast-Folgen, Videos, Bibliotheks-Einträge, Wiki- und Entitäts-Änderungen, geprüfte Zertifikate, angenommene Antworten und Bestätigungen anderer Mitglieder. Stufen: Lernt, Praxis (3 Punkte), Experte (10 Punkte oder Redaktion), Evangelist (Experte + 100 Bestätigungen), Master (1000), Master Evangelist (1000 Bestätigungen von Evangelisten im selben Thema). Neu berechnet alle 30 Minuten.", exp_none: "Noch keine belegten Themen – veröffentliche einen Beitrag oder sprich auf einer Session.", points: "Punkte", endorsed_n: "Bestätigungen", ev: { blog: "Beiträge", coauthor: "Co-Autor", session: "Sessions", podcast: "Folgen", video: "Videos", guest: "Gast", library: "Bibliothek", listing: "Gäste-Börse", wiki: "Wiki", entity: "Entität", cert: "Zertifikate", answer: "Antworten", self: "frühere Selbstangabe" }, certs: "Zertifizierungen", addcert: "Zertifizierung hinzufügen", chan: "Kanäle und Links", addch: "Kanal hinzufügen", feedurl: "Feed-URL (RSS/Atom, optional)", save: "Profil speichern", saved: "Gespeichert.", err: "Etwas ist schiefgelaufen. Bitte prüfe deine Angaben.", rm: "Entfernen", pick: "Thema suchen…", url: "https://…", orgs: "Firmen", neworg: "Firma anlegen", orgname: "Firmenname", tagline: "Kurzbeschreibung", site: "Webseite", size: "Mitarbeitende", join: "Einer Firma beitreten", search: "Firma suchen…", req: "Beitritt anfragen", pending: "Offene Anfragen", team: "Team", approve: "Freigeben", remove: "Entfernen", pend_me: "Anfrage wartet auf Freigabe", leave: "Verlassen", edit: "Bearbeiten", open: "Öffentliche Seite", handle_taken: "Diese Adresse ist schon vergeben.", bad_handle: "Bitte eine Adresse mit 3–30 Zeichen (a-z, 0-9, -) angeben.", bad_channel: "Ein Kanal ist ungültig (https, passende Domain).", bad_expertise: "Ein Thema gibt es nicht.", bad_url: "Eine Adresse ist ungültig.", bad_cert: "Eine Zertifizierung ist ungültig.", rate_limit: "Zu viele Änderungen – bitte später erneut.", bad_entity: "Diese Firmen-Entität gibt es nicht (nur Firmen aus der Entitäten-Datenbank).", entity_claim_required: "Bitte beanspruche die Entität zuerst (Knopf „Entität beanspruchen“); nach der Prüfung durch die Redaktion erneut speichern.", forbidden: "Das dürfen nur Inhaber und Admins der Firma.", note: "Die öffentliche Seite erscheint nach dem nächsten Seitenbau (stündlich)." }, { bad_email: "The email address is invalid.", h: "Public expert profile", intro: "Optional: with a public profile you appear in the member directory, on your topics and linked to the Schema.org entities. Programs and expertise are confirmed by the editorial team or endorsed by members.", pub: "Show my profile publicly", handle: "Profile address (a-z, 0-9, -)", headline: "Headline (e.g. Power BI consultant, MVP)", about: "About me (bio, no links)", company: "Company (free text)", job: "Job title", country: "Country", showorg: "Show company membership publicly", prog: "Microsoft programs", year: "Since (year)", proof: "Proof link (https)", exp: "Topics and expertise", addexp: "Add topic", lvl: ["Learning", "Practitioner", "Expert", "Evangelist", "Master", "Master Evangelist"], exp_auto: "Your topics and levels are derived by the system: blog posts, confirmed sessions, podcast episodes, videos, library items, wiki and entity edits, verified certifications, accepted answers and endorsements by other members. Levels: learning, practitioner (3 points), expert (10 points or editorial confirmation), evangelist (expert + 100 endorsements), master (1000), master evangelist (1000 endorsements by evangelists of the same topic). Recalculated every 30 minutes.", exp_none: "No evidenced topics yet – publish a post or speak at a session.", points: "points", endorsed_n: "endorsements", ev: { blog: "posts", coauthor: "co-author", session: "sessions", podcast: "episodes", video: "videos", guest: "guest", library: "library", listing: "guest exchange", wiki: "wiki", entity: "entity", cert: "certifications", answer: "answers", self: "former self-declaration" }, certs: "Certifications", addcert: "Add certification", chan: "Channels and links", addch: "Add channel", feedurl: "Feed URL (RSS/Atom, optional)", save: "Save profile", saved: "Saved.", err: "Something went wrong. Please check your entries.", rm: "Remove", pick: "Search topic…", url: "https://…", orgs: "Companies", neworg: "Create a company", orgname: "Company name", tagline: "Tagline", site: "Website", size: "Employees", join: "Join a company", search: "Search company…", req: "Request to join", pending: "Open requests", team: "Team", approve: "Approve", remove: "Remove", pend_me: "Request awaiting approval", leave: "Leave", edit: "Edit", open: "Public page", handle_taken: "That address is already taken.", bad_handle: "Please use an address with 3–30 characters (a-z, 0-9, -).", bad_channel: "A channel is invalid (https, matching domain).", bad_expertise: "A topic does not exist.", bad_url: "An address is invalid.", bad_cert: "A certification is invalid.", rate_limit: "Too many changes – please try again later.", bad_entity: "This company entity does not exist (only companies from the entity database).", entity_claim_required: "Please claim the entity first (button “Claim this entity”); save again once the editors have approved it.", forbidden: "Only owners and admins of the company can do this.", note: "The public page appears after the next site build (hourly)." });
  var PROG = [["mvp", "Microsoft MVP"], ["mct", "Microsoft Certified Trainer (MCT)"], ["rd", "Microsoft Regional Director"], ["msa", "Microsoft Student Ambassador"], ["ms_employee", de ? "Microsoft-Mitarbeiter:in" : "Microsoft employee"], ["partner", "Microsoft Partner"], ["gde", "Google Developer Expert (GDE)"]];
  var RL = M365L(de, "profile.RL", { owner: "Inhaber", admin: "Admin", editor: "Redakteur", events: "Event-Manager", member: "Mitglied" }, { owner: "Owner", admin: "Admin", editor: "Editor", events: "Event manager", member: "Member" });
  function roleSel(cur, mine, onpick) { var sel = h("select", { "aria-label": de ? "Rolle" : "Role" }); ["owner", "admin", "editor", "events", "member"].forEach(function (r) { if (r === cur || mine === "owner" || (mine === "admin" && r !== "owner" && r !== "admin")) sel.appendChild(h("option", { value: r, text: RL[r] })); }); sel.value = cur; if (onpick) sel.onchange = function () { onpick(sel.value); }; return sel; }
  var KINDS = ["linkedin", "github", "youtube", "x", "mastodon", "bluesky", "twitch", "spotify", "apple", "amazon", "deezer", "instagram", "tiktok", "facebook", "blog", "podcast", "newsletter", "website", "other"], KL = { linkedin: "LinkedIn", github: "GitHub", youtube: "YouTube", x: "X", mastodon: "Mastodon", bluesky: "Bluesky", twitch: "Twitch", spotify: "Spotify", apple: "Apple Podcasts", amazon: "Amazon Music / Audible", deezer: "Deezer", instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", blog: "Blog", podcast: "Podcast", newsletter: "Newsletter", website: "Website", other: "Link" };
  function h(tag, a, kids) { var e = document.createElement(tag); for (var k in (a || {})) { if (k === "class") e.className = a[k]; else if (k === "text") e.textContent = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }); return e; }
  function api(path, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(X.api + path, o).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); }); }
  var IQ = M365L(de, "profile.IQ", { t: "Bild", up: "Bild hochladen", rm: "Entfernen", first: "Speichere zuerst dein Profil mit Profil-Adresse, dann kannst du ein Bild hochladen.", ok: "✓ Bild gespeichert.", bad: "Das Bild konnte nicht gespeichert werden (nur Bilddateien).", hint: "Wird auf 256×256 Pixel verkleinert und nur bei öffentlichem Profil angezeigt." }, { t: "Picture", up: "Upload picture", rm: "Remove", first: "Save your profile with a profile address first, then you can upload a picture.", ok: "✓ Picture saved.", bad: "The picture could not be saved (images only).", hint: "Resized to 256×256 pixels and shown only on public profiles." });
  function imgUI(kind, handle0, img0) {
    var w = h("div", { class: "pic" }), im = h("img", { alt: "", width: 96, height: 96, style: "border-radius:" + (kind === "u" ? "50%" : "12px") + ";object-fit:cover;background:var(--card);border:1px solid var(--bd)" }), msg = h("span", { class: "cmut", role: "status", "aria-live": "polite" });
    var f = h("input", { type: "file", accept: "image/png,image/jpeg,image/webp", "aria-label": IQ.up, style: "display:none" });
    function show(hd, v) { if (hd && v) { im.src = X.api + "/api/img/" + kind + "/" + hd + ".jpg?v=" + v; im.hidden = false; } else im.hidden = true; }
    show(handle0, img0);
    function resize(file) { return new Promise(function (res, rej) { var u = URL.createObjectURL(file), i = new Image(); i.onload = function () { var c = document.createElement("canvas"); c.width = c.height = 256; var g = c.getContext("2d"), m = Math.min(i.width, i.height), sx = (i.width - m) / 2, sy = (i.height - m) / 2; g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 256); g.drawImage(i, sx, sy, m, m, 0, 0, 256, 256); URL.revokeObjectURL(u); var q = 0.88; (function t() { c.toBlob(function (b) { if (b && b.size > 140000 && q > 0.4) { q -= 0.15; t(); } else if (b) res(b); else rej(); }, "image/jpeg", q); })(); }; i.onerror = function () { rej(); }; i.src = u; }); }
    var up = h("button", { type: "button", class: "btn", text: IQ.up, onclick: function () { if (!w.handle()) { if (!w.ensure) { msg.textContent = IQ.first; return; } msg.textContent = "…"; w.ensure().then(function (ok) { if (ok) { msg.textContent = ""; f.click(); } else msg.textContent = IQ.first; }); return; } f.click(); } });
    var rm = h("button", { type: "button", class: "btn", text: IQ.rm, onclick: function () { api("/api/img/" + kind + "/" + w.handle(), { method: "DELETE" }).then(function () { show(null); msg.textContent = ""; }); } });
    f.addEventListener("change", function () {
      var file = f.files && f.files[0]; if (!file) return; msg.textContent = "…";
      resize(file).then(function (b) { return fetch(X.api + "/api/img/" + kind + "/" + w.handle(), { method: "POST", credentials: "include", headers: { "x-requested-with": "m365", "content-type": "image/jpeg" }, body: b }).then(function (r) { return r.json(); }); })
        .then(function (j) { if (j && j.ok) { show(w.handle(), j.img); msg.textContent = IQ.ok; } else msg.textContent = IQ.bad + (j && j.error ? " (" + j.error + ")" : ""); }).catch(function () { msg.textContent = IQ.bad; }); f.value = "";
    });
    w.handle = function () { return ""; };
    w.appendChild(h("label", { text: IQ.t, style: "display:block;margin-top:14px;font-weight:600" })); w.appendChild(h("div", { style: "display:flex;gap:12px;align-items:center;flex-wrap:wrap" }, [im, up, rm, f, msg])); w.appendChild(h("p", { class: "cmut", text: IQ.hint, style: "margin:4px 0 0;font-size:.85rem" }));
    return w;
  }
  var SQ = M365L(de, "profile.SQ", { t: "Event-Sponsoring", d: "Nie öffentlich. Veranstalter, die Sponsoren suchen, sehen eure Kriterien – und ihr seht als potenzieller Sponsor, welche Events in Frage kommen, und könnt die Veranstalter direkt kontaktieren.", open: "Wir sind offen für Event-Sponsoring", topics: "Themen (z. B. Copilot, Security)", fmt: "Format", any: "egal", online: "Online", onsite: "Vor Ort", hybrid: "Hybrid", aud: "Mindestgröße Publikum", reg: "Regionen / Sprachen", bud: "Budgetrahmen (optional)", notes: "Weitere Kriterien", save: "Sponsoring speichern", saved: "✓ Gespeichert.", first: "Speichere die Firma zuerst, dann kannst du Sponsoring-Kriterien angeben." }, { t: "Event sponsoring", d: "Never public. Organizers who are looking for sponsors see your criteria – and as a potential sponsor you see which events qualify and can contact the organizers directly.", open: "We are open to sponsoring events", topics: "Topics (e.g. Copilot, security)", fmt: "Format", any: "any", online: "Online", onsite: "On site", hybrid: "Hybrid", aud: "Minimum audience size", reg: "Regions / languages", bud: "Budget range (optional)", notes: "Further criteria", save: "Save sponsoring", saved: "✓ Saved.", first: "Save the company first, then you can add sponsoring criteria." });
  function sponsorUI(getHandle) {
    var w = h("div", { class: "spons" }), msg = h("span", { class: "cmut", role: "status", "aria-live": "polite" });
    w.appendChild(h("h4", { text: SQ.t })); w.appendChild(h("p", { class: "cmut", text: SQ.d }));
    var on = h("input", { type: "checkbox" }), tp = inp(300), rg = inp(200), bd = inp(100), au = h("input", { type: "number", min: 0, max: 1000000 }), nt = h("textarea", { rows: 3, maxlength: 800 }), fm = h("select");
    [["", SQ.any], ["online", SQ.online], ["onsite", SQ.onsite], ["hybrid", SQ.hybrid]].forEach(function (x) { fm.appendChild(h("option", { value: x[0], text: x[1] })); });
    w.appendChild(h("label", { style: "display:block;margin:.4em 0" }, [on, " " + SQ.open]));
    [lab(SQ.topics, tp), lab(SQ.fmt, fm), lab(SQ.aud, au), lab(SQ.reg, rg), lab(SQ.bud, bd), lab(SQ.notes, nt)].forEach(function (x) { w.appendChild(x); });
    var loaded = "";
    function load() { var hd = getHandle(); if (!hd || hd === loaded) return; loaded = hd; api("/api/org/sponsor/" + hd).then(function (r) { if (r.s !== 200) return; on.checked = !!r.j.open; var c = r.j.criteria || {}; tp.value = c.topics || ""; fm.value = c.format || ""; au.value = c.min_audience || ""; rg.value = c.regions || ""; bd.value = c.budget || ""; nt.value = c.notes || ""; }); }
    load();
    w.appendChild(h("div", { class: "btns" }, [h("button", { type: "button", class: "btn", text: SQ.save, onclick: function () { var hd = getHandle(); if (!hd) { msg.textContent = SQ.first; return; } api("/api/org/sponsor/" + hd, { method: "POST", body: { open: on.checked, criteria: { topics: tp.value, format: fm.value, min_audience: +au.value || 0, regions: rg.value, budget: bd.value, notes: nt.value } } }).then(function (r) { msg.textContent = r.s === 200 ? SQ.saved : SQ.first; }); } }), msg]));
    return w;
  }
  var RIQ = M365L(de, "profile.RIQ", { t: "Empfehlungen für dich", none: "Noch keine Empfehlungen.", ok: "Freigeben", no: "Ablehnen", rm: "Entfernen", pend: "wartet auf Freigabe", live: "veröffentlicht" }, { t: "Recommendations for you", none: "No recommendations yet.", ok: "Approve", no: "Reject", rm: "Remove", pend: "awaiting approval", live: "published" });
  function suggestUI() {   // "Bist du das?": ähnliche Speaker-Einträge bei Events dem eigenen Profil zuordnen
    var box = h("section", { class: "ccard", hidden: "" }), dis = {}; try { dis = JSON.parse(localStorage.getItem("m365-nosug") || "{}"); } catch (e) {}
    api("/api/entity/suggest").then(function (r) {
      var es = ((r.j || {}).suggestions || []).filter(function (x) { return !dis["e:" + x.eid]; }); if (!es.length) return;
      box.hidden = false; if (!box.firstChild) box.appendChild(h("h2", { text: de ? "Bist du das?" : "Is this you?" }));
      es.forEach(function (x) {
        var row = h("p", {}, [h("a", { href: X.base + (de ? "/de" : "") + "/entity/" + x.eid + "/", target: "_blank", text: x.name }), " · " + (x.type === "org" ? (de ? "Firma – passt zu " : "company – matches ") + x.org : (de ? "Person" : "person")) + " "]);
        row.appendChild(h("button", { type: "button", class: "btn main", text: de ? "Ja, gehört mir" : "Yes, it is mine", onclick: function () { api("/api/entity/claim", { method: "POST", body: { eid: x.eid } }).then(function (q) { row.textContent = (q.j || {}).ok ? CL.created : (de ? "Nicht möglich (bereits vergeben oder Limit erreicht)." : "Not possible (already claimed or limit reached)."); if ((q.j || {}).ok) row.appendChild(claimBox(x.eid)); }); } }));
        row.appendChild(document.createTextNode(" ")); row.appendChild(h("button", { type: "button", class: "btn", text: de ? "Nein" : "No", onclick: function () { dis["e:" + x.eid] = 1; try { localStorage.setItem("m365-nosug", JSON.stringify(dis)); } catch (e) {} row.remove(); } }));
        box.appendChild(row);
      });
    });
    api("/api/speaker/suggest").then(function (r) {
      var list = ((r.j || {}).suggestions || []).filter(function (x) { return !dis[x.name]; }); if (!list.length) return;
      box.hidden = false; if (!box.querySelector("h2")) box.appendChild(h("h2", { text: de ? "Bist du das?" : "Is this you?" }));
      box.appendChild(h("p", { class: "mut", text: de ? "Wir haben Speaker bei Events gefunden, deren Name zu deinem Profil passt. Wenn du das bist, verknüpfen wir sie mit deinem Profil." : "We found speakers at events whose name matches your profile. If that is you, we link them to your profile." }));
      list.forEach(function (x) {
        var row = h("p", {}, [h("b", { text: x.name }), " · " + x.sessions + (de ? " Session(s) bei " : " session(s) at ") + x.events.join(", ") + " "]);
        row.appendChild(h("button", { type: "button", class: "btn main", text: de ? "Ja, das bin ich" : "Yes, that is me", onclick: function () { api("/api/speaker/claim", { method: "POST", body: { name: x.name } }).then(function (q) { row.textContent = (q.j || {}).ok ? (de ? "Verknüpft. Bestätige die Anfrage unter Events → Speaker-Anfragen." : "Linked. Confirm the request under Events → speaker requests.") : (de ? "Das hat nicht geklappt." : "That did not work."); }); } }));
        row.appendChild(document.createTextNode(" ")); row.appendChild(h("button", { type: "button", class: "btn", text: de ? "Nein" : "No", onclick: function () { dis[x.name] = 1; try { localStorage.setItem("m365-nosug", JSON.stringify(dis)); } catch (e) {} row.remove(); } }));
        box.appendChild(row);
      });
    });
    return box;
  }
  /* Bewerbung um Editor/Moderator (oeffentliches Profil und mind. 25 Punkte): erscheint in /redaktion/ unter "Bewerbungen", Editoren bestaetigen */
  function editorApplyUI() {
    var L = de ? { t: "Redaktion mitgestalten", intro: "Editoren prüfen und verbessern Inhalte, Moderatoren halten Kommentare respektvoll. Voraussetzung: öffentliches Profil und mindestens 25 Punkte. Mindestens 3 verschiedene Editoren bestätigen (Moderator: 2).", role: "Rolle", ed: "Editor", mo: "Moderator", mot: "Kurze Motivation (mindestens 20 Zeichen)", top: "Themen (Entitäten-IDs, mit Komma getrennt)", send: "Bewerbung senden", ok: "Bewerbung gesendet.", open: "Offene Bewerbung", votes: "Bestätigungen", st_approved: "angenommen", st_rejected: "abgelehnt", e_profile_not_public: "Dein Profil muss öffentlich sein.", e_not_enough_points: "Dir fehlen noch Punkte (mindestens 25).", e_motivation_short: "Bitte etwas ausführlicher.", e_open_exists: "Du hast schon eine offene Bewerbung.", e_already: "Du hast diese Rolle schon.", e_generic: "Fehler" }
      : { t: "Join the editorial team", intro: "Editors review and improve content, moderators keep comments respectful. Requirements: a public profile and at least 25 points. At least 3 different editors must confirm (moderator: 2).", role: "Role", ed: "Editor", mo: "Moderator", mot: "Short motivation (at least 20 characters)", top: "Topics (entity IDs, comma separated)", send: "Send application", ok: "Application sent.", open: "Open application", votes: "confirmations", st_approved: "approved", st_rejected: "rejected", e_profile_not_public: "Your profile must be public.", e_not_enough_points: "You need more points (at least 25).", e_motivation_short: "Please write a little more.", e_open_exists: "You already have an open application.", e_already: "You already have this role.", e_generic: "Error" };
    var w = h("section", { class: "ccard" }, [h("h2", { text: L.t }), h("p", { class: "cmut", text: L.intro })]), box = h("div"), msg = h("p", { role: "status", class: "cmut" });
    function load() { api("/api/editor/apply").then(function (r) { box.textContent = ""; var items = (r.j && r.j.items) || [], op = items.filter(function (x) { return x.status === "open"; })[0];
      items.slice(0, 3).forEach(function (x) { box.appendChild(h("p", { class: "cmut", text: (x.role === "editor" ? L.ed : L.mo) + " · " + (x.status === "open" ? L.open + " (" + x.votes + "/" + x.needed + " " + L.votes + ")" : L["st_" + x.status] + (x.reason ? ": " + x.reason : "")) })); });
      if (op) return;
      var role = h("select", { "aria-label": L.role }, [h("option", { value: "editor", text: L.ed }), h("option", { value: "moderator", text: L.mo })]), mot = h("textarea", { rows: "4", maxlength: "1000", "aria-label": L.mot }), top = h("input", { type: "text", "aria-label": L.top });
      box.appendChild(h("label", {}, [L.role + " ", role])); box.appendChild(h("label", { style: "display:block;margin:.5em 0" }, [L.mot, mot])); box.appendChild(h("label", { style: "display:block;margin:.5em 0" }, [L.top, top]));
      box.appendChild(h("button", { type: "button", class: "btn main", text: L.send, onclick: function (ev) { ev.target.disabled = true; api("/api/editor/apply", { method: "POST", body: { role: role.value, motivation: mot.value, topics: top.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean) } }).then(function (x) { ev.target.disabled = false; msg.textContent = x.s === 200 ? L.ok : (L["e_" + (x.j || {}).error] || L.e_generic); if (x.s === 200) load(); }); } })); }); }
    w.appendChild(box); w.appendChild(msg); load(); return w;
  }
  function recInbox() {
    var w = h("section", { class: "ccard" }, [h("h2", { text: RIQ.t })]);
    function load() { api("/api/recommend/inbox").then(function (r) { while (w.children.length > 1) w.removeChild(w.lastChild); var l = (r.j && r.j.items) || []; if (!l.length) w.appendChild(h("p", { class: "cmut", text: RIQ.none }));
      l.forEach(function (x) { var pend = x.status === "pending"; w.appendChild(h("div", { class: "ev-s" }, [h("b", { text: x.name }), h("span", { class: "cmut", text: " · " + x.relation + " · " + (pend ? RIQ.pend : RIQ.live) }), h("p", { text: x.body, style: "white-space:pre-line" }), h("div", { class: "btns" }, pend ? [
        h("button", { type: "button", class: "btn main", text: RIQ.ok, onclick: function () { api("/api/recommend/" + x.id, { method: "POST", body: { ok: true } }).then(load); } }),
        h("button", { type: "button", class: "btn", text: RIQ.no, onclick: function () { api("/api/recommend/" + x.id, { method: "POST", body: { ok: false } }).then(load); } })] : [
        h("button", { type: "button", class: "btn", text: RIQ.rm, onclick: function () { api("/api/recommend/" + x.id, { method: "DELETE" }).then(load); } })])])); }); }); }
    load(); return w;
  }
  var CQ = M365L(de, "profile.CQ", { hint: "Deine Firma wählst du weiter unten bei „Firmen“: per Suche beitreten – gibt es sie noch nicht, legst du sie dort an. Firmen sind immer Entitäten, nie Freitext.", nf: "Keine Firma gefunden.", mk: "Firma anlegen", bad: "Die Firma konnte nicht angelegt werden – bitte den Namen prüfen." }, { hint: "You choose your company further down under “Companies”: join it via search – if it does not exist yet, create it there. Companies are always entities, never free text.", nf: "No company found.", mk: "Create company", bad: "The company could not be created – please check the name." });
  var KQ = M365L(de, "profile.KQ", { ind: "Branche", indh: "Wähle eine oder mehrere Branchen aus der Entitäten-Datenbank (bis zu 5). Gibt es deine Branche noch nicht, lege sie mit „Neu anlegen“ an.", indadd: "+ Branche", jobl: "Job / Rolle", jobh: "Wähle deine Rolle aus der Entitäten-Datenbank. Gibt es sie noch nicht, lege sie mit „Neu anlegen“ an.", jobpick: "Job / Rolle wählen", indpick: "Branche wählen", mk: "Neu anlegen", pend_sel: "Danke! Der Eintrag wird von der Redaktion geprüft. Bis dahin ist er nur für dich ausgewählt; öffentlich erscheint er nach der Freigabe.", dup: "Gibt es schon – wurde ausgewählt: ", bad_industry: "Branche ungültig oder nicht verfügbar.", bad_job: "Job / Rolle ungültig oder nicht verfügbar.", too_many_industry: "Höchstens 5 Branchen." }, { ind: "Industry", indh: "Choose one or more industries from the entity database (up to 5). If yours does not exist yet, create it with “Create new”.", indadd: "+ Industry", jobl: "Job / role", jobh: "Choose your role from the entity database. If it does not exist yet, create it with “Create new”.", jobpick: "Choose job / role", indpick: "Choose industry", mk: "Create new", pend_sel: "Thank you! The entry will be reviewed by the editors. Until then it is selected for you only; it appears publicly after approval.", dup: "Already exists – selected: ", bad_industry: "Industry invalid or unavailable.", bad_job: "Job / role invalid or unavailable.", too_many_industry: "At most 5 industries." });
  ["bad_industry", "bad_job", "too_many_industry"].forEach(function (k) { Q[k] = KQ[k]; });
  var uid = 0; function lab(text, el) { var id = "pe" + (++uid); el.id = id; return h("div", {}, [h("label", { for: id, text: text, style: "display:block;margin-top:.5em;font-weight:600" }), el]); }
  var inp = function (max, v) { var e = h("input", { type: "text", maxlength: max || 120 }); e.value = v || ""; return e; };
  var chk = function (text, v) { var c = h("input", { type: "checkbox" }); c.checked = !!v; return { c: c, w: h("label", { style: "display:block;margin:.4em 0" }, [c, " " + text]) }; };

  function programsUI(sel, orgSide) {
    var box = h("div", {}), rows = {};
    PROG.filter(function (p) { return orgSide ? p[0] === "partner" : true; }).forEach(function (p) {
      var cur = (sel || []).filter(function (x) { return x.p === p[0]; })[0] || {}, c = chk(p[1] + (cur.verified ? " ✔" : ""), !!cur.p), yr = h("input", { type: "number", min: 1990, max: 2100, "aria-label": Q.year, placeholder: Q.year, style: "width:7em" }), pr = h("input", { type: "text", maxlength: 300, placeholder: Q.proof, "aria-label": Q.proof });
      yr.value = cur.year || ""; pr.value = cur.url || ""; rows[p[0]] = { c: c.c, yr: yr, pr: pr };
      box.appendChild(h("div", { style: "margin:.5em 0" }, [c.w, h("div", { style: "display:flex;gap:.4em;flex-wrap:wrap" }, [yr, pr])]));
    });
    box.get = function () { return Object.keys(rows).filter(function (k) { return rows[k].c.checked; }).map(function (k) { return { p: k, year: +rows[k].yr.value || 0, url: rows[k].pr.value.trim() }; }); };
    return box;
  }
  // Expertise (nur Anzeige): Stufe, Punkte, Bestaetigungen und Belege je Thema; gesetzt vom System (worker/src/levels.js)
  function expertiseView(list, all) {
    var ul = h("ul", { class: "pf-lv" });
    if (!list.length) ul.appendChild(h("li", { class: "cmut", text: Q.exp_none }));
    list.forEach(function (x) {
      var t = all.filter(function (y) { return y.id === x.e; })[0], ev = x.ev || {}, parts = [];
      Object.keys(ev).forEach(function (k) { if (ev[k]) parts.push(ev[k] + " " + (Q.ev[k] || k)); });
      var note = [Q.lvl[(x.level || 1) - 1] || Q.lvl[0], (x.score || 0) + " " + Q.points, (x.endorsed || 0) + " " + Q.endorsed_n].concat(parts.length ? [parts.join(", ")] : []);
      ul.appendChild(h("li", {}, [h("strong", { text: t ? t.name : x.e }), h("span", { class: "cmut", text: " · " + note.join(" · ") + (x.verified ? " ✔" : "") })]));
    });
    return ul;
  }
  function jobGuess(all, txt) { var v = String(txt || "").trim().toLowerCase(); if (!v) return []; var hit = all.filter(function (x) { return x.type === "job" && (x.name.toLowerCase() === v || (x.aliases || []).some(function (a) { return String(a).toLowerCase() === v; })); })[0]; return hit ? [{ e: hit.id }] : []; }
  function pickerRows(all, filter, initial, withYear, labelAdd, newType, plain) {
    var wrap = h("div", {}), list = h("div"), dl = h("datalist", { id: "pdl" + (++uid) });
    all.filter(filter).forEach(function (x) { dl.appendChild(h("option", { value: x.name })); });
    var NQ = M365L(de, "profile.NQ", { mk: "Gibt es noch nicht – als neue Entität anlegen", d: "Kurzbeschreibung (mind. 20 Zeichen, eigene Worte, ohne Links)", go: "Anlegen", live: "Angelegt und übernommen.", pend: "Danke! Der neue Eintrag erscheint nach der Prüfung; danach kannst du ihn auswählen.", err: "Konnte nicht angelegt werden: ", short: "Bitte mindestens 20 Zeichen." }, { mk: "Doesn't exist yet – create it as a new entity", d: "Short description (min. 20 characters, own words, no links)", go: "Create", live: "Created and selected.", pend: "Thank you! The new entry will appear after review; then you can select it.", err: "Could not be created: ", short: "Please enter at least 20 characters." });
    function slug(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48); }
    function add(it) {
      var name = h("input", { type: "text", list: dl.id, placeholder: plain ? plain.pick : Q.pick, "aria-label": plain ? plain.pick : Q.pick, maxlength: 80 }), lv = h("select", { "aria-label": Q.exp }), yr = h("input", { type: "number", min: 1990, max: 2100, "aria-label": Q.year, placeholder: Q.year, style: "width:6em" }), pr = h("input", { type: "text", maxlength: 300, placeholder: Q.proof, "aria-label": Q.proof });
      Q.lvl.slice(0, 3).forEach(function (l, i) { lv.appendChild(h("option", { value: i + 1, text: l })); });   // Firmen: Selbstangabe nur Lernt/Praxis/Experte; Stufen 4-6 vergibt das System an Personen lv.value = (it && it.level) || 2; yr.value = (it && it.year) || ""; pr.value = (it && it.url) || "";
      if (it && it.e) { var t = all.filter(function (x) { return x.id === it.e; })[0]; name.value = t ? t.name : it.e; }
      var stl = (withYear && it && it.e) ? h("span", { class: "cmut", text: it.verified ? (de ? "✔ geprüft" : "✔ verified") : (it.rejected ? (de ? "✖ Nachweis abgelehnt – bitte Link prüfen oder ändern" : "✖ proof rejected – please check or change the link") : it.url ? (de ? "⏳ wird geprüft" : "⏳ under review") : (de ? "ohne Nachweis" : "no proof")) }) : null;
      var mkBox = h("div", { style: "flex-basis:100%", hidden: true }), mkBtn = h("button", { type: "button", class: "btn", hidden: true, text: plain ? plain.mk : NQ.mk });
      function matched() { var v = name.value.trim().toLowerCase(); return all.some(function (x) { return x.name.toLowerCase() === v; }); }
      function sync() { mkBtn.hidden = !name.value.trim() || matched(); if (mkBtn.hidden) mkBox.hidden = true; }
      name.addEventListener("input", sync);
      mkBtn.onclick = function () {
        mkBox.hidden = false; mkBox.textContent = "";
        var ta = h("textarea", { rows: 2, maxlength: 300, placeholder: NQ.d, "aria-label": NQ.d, style: "width:100%" }), go = h("button", { type: "button", class: "btn main", text: NQ.go }), ms = h("span", { class: "cmut" }), ty = h("select", { "aria-label": "Typ" });
        if (!newType) [["product", de ? "Produkt" : "Product"], ["platform", de ? "Plattform" : "Platform"], ["concept", de ? "Konzept / Thema" : "Concept / topic"], ["category", de ? "Kategorie" : "Category"]].forEach(function (o) { ty.appendChild(h("option", { value: o[0], text: o[1] })); });
        go.onclick = function () {
          var nm = name.value.trim(), dsc = ta.value.trim(); if (dsc.length < 20) { ms.textContent = NQ.short; return; }
          go.disabled = true;
          api("/api/entity", { method: "POST", body: { id: slug(nm), data: { name: nm, type: newType || ty.value, aliases: [], desc: de ? { en: "", de: dsc } : { en: dsc, de: "" }, rel: [] }, summary: "" } }).then(function (r) {
            go.disabled = false;
            if (r.s === 200 && r.j.status === "live") { var ne = { id: slug(nm), name: nm, type: newType || ty.value }; all.push(ne); dl.appendChild(h("option", { value: nm })); ms.textContent = NQ.live; mkBox.hidden = true; sync(); }
            else if (r.s === 200 && plain) { all.push({ id: slug(nm), name: nm, type: newType }); dl.appendChild(h("option", { value: nm })); ms.textContent = NQ.pend + " " + plain.pend; mkBox.hidden = true; sync(); }
            else if (r.s === 200) { ms.textContent = NQ.pend; name.value = ""; sync(); }
            else if (r.s === 409 && r.j && r.j.error === "duplicate") { var ex = all.filter(function (x) { return x.id === r.j.id; })[0]; if (ex) { name.value = ex.name; ms.textContent = plain.dup + ex.name; mkBox.hidden = true; sync(); } else ms.textContent = NQ.err + r.j.error; }
            else ms.textContent = NQ.err + (r.j && r.j.error || "");
          }).catch(function () { go.disabled = false; ms.textContent = NQ.err; });
        };
        (newType ? [ta, go, ms] : [ty, ta, go, ms]).forEach(function (x) { mkBox.appendChild(x); });
      };
      var row = h("div", { style: "display:flex;gap:.4em;flex-wrap:wrap;margin:.3em 0" }, [name].concat(plain ? [] : withYear ? [yr, pr] : [lv], stl ? [stl] : [], [h("button", { type: "button", class: "btn", text: Q.rm, onclick: function () { row.remove(); } }), mkBtn, mkBox]));
      row._get = function () { var v = name.value.trim().toLowerCase(), hit = all.filter(function (x) { return x.name.toLowerCase() === v; })[0]; if (!hit) return v ? null : false; if (plain) return { e: hit.id }; return withYear ? { e: hit.id, year: +yr.value || 0, url: pr.value.trim() } : { e: hit.id, level: +lv.value }; };
      list.appendChild(row);
    }
    (initial || []).forEach(add); if (plain && plain.single && !list.children.length) add(null);   // Job/Rolle: genau ein Feld
    wrap.appendChild(dl); wrap.appendChild(list); if (!(plain && plain.single)) wrap.appendChild(h("button", { type: "button", class: "btn", text: labelAdd, onclick: function () { add(null); } }));
    wrap.get = function () { var out = [], bad = false; [].slice.call(list.children).forEach(function (r) { var v = r._get(); if (v === null) bad = true; else if (v) out.push(v); }); return bad ? null : out; };
    return wrap;
  }
  function privateUI(pv) {
    pv = pv || {};
    var L = M365L(de, "profile.L", { h: "Kontakt und Adresse (privat)", hint: "Diese Angaben sind standardmäßig nur für dich sichtbar und werden später für die Umkreissuche genutzt. Pro Feld bestimmst du, wer es sehen darf. „Kontakte“ wirkt, sobald es Kontakte gibt – bis dahin sieht es niemand außer dir.", city: "Stadt", zip: "Postleitzahl", street: "Straße und Hausnummer", email: "Kontakt-E-Mail", phone: "Mobilnummer", all: "Alle", contacts: "Nur Kontakte", none: "Niemand (nur ich)", vis: "Sichtbar für", map: "Auf der Karte zeigen (nur Stadt und Land; Standort auf ca. 2 km gerundet)" }, { h: "Contact and address (private)", hint: "These details are visible only to you by default and will later be used for radius search. For each field you choose who may see it. “Contacts” takes effect once contacts exist – until then only you can see it.", city: "City", zip: "Postal code", street: "Street and number", email: "Contact email", phone: "Mobile number", all: "Everyone", contacts: "Contacts only", none: "Nobody (only me)", vis: "Visible to", map: "Show me on the map (city and country only; location rounded to about 2 km)" });
    var F = ["city", "zip", "street", "email", "phone"], rows = {}, wrap = h("div", {}, [h("h3", { text: L.h }), h("p", { class: "cmut", text: L.hint })]);
    var map = chk(L.map, pv.map_public);
    F.forEach(function (k) {
      var inp = h("input", { type: k === "email" ? "email" : "text", maxlength: k === "street" ? 120 : k === "email" ? 120 : k === "city" ? 80 : k === "zip" ? 10 : 30, autocomplete: "off" }), sel = h("select", { "aria-label": L.vis + ": " + L[k] });
      ["none", "contacts", "all"].forEach(function (v) { sel.appendChild(h("option", { value: v, text: L[v] })); });
      inp.value = pv[k] || ""; sel.value = pv["vis_" + k] || "none"; rows[k] = [inp, sel];
      wrap.appendChild(h("div", {}, [lab(L[k], inp), h("label", { class: "cmut", style: "display:block;margin:.2em 0 .6em" }, [document.createTextNode(L.vis + ": "), sel])]));
    });
    wrap.appendChild(map.w);
    wrap.get = function () { var o = { vis: {}, map_public: map.c.checked }; F.forEach(function (k) { o[k] = rows[k][0].value.trim(); o.vis[k] = rows[k][1].value; }); return o; };
    return wrap;
  }
  function channelsUI(initial) {
    var wrap = h("div"), list = h("div");
    function add(c) {
      var k = h("select", { "aria-label": Q.chan }); KINDS.forEach(function (x) { k.appendChild(h("option", { value: x, text: KL[x] })); }); k.value = (c && c.kind) || "linkedin";
      var u = h("input", { type: "text", maxlength: 300, placeholder: Q.url, "aria-label": Q.url }), f = h("input", { type: "text", maxlength: 300, placeholder: Q.feedurl, "aria-label": Q.feedurl });
      var fo = h("input", { type: "number", min: 0, max: 2000000000, placeholder: de ? "Follower" : "Followers", "aria-label": de ? "Follower / Abonnenten" : "Followers / subscribers", style: "width:9em" }); fo.value = (c && c.followers) || "";
      u.value = (c && c.url) || ""; f.value = (c && c.feed && !/youtube\.com\/feeds/.test(c.feed) ? c.feed : "") || "";
      var row = h("div", { style: "display:flex;gap:.4em;flex-wrap:wrap;margin:.3em 0" }, [k, u, f, fo, h("button", { type: "button", class: "btn", text: Q.rm, onclick: function () { row.remove(); } })]);
      row._get = function () { return u.value.trim() ? { kind: k.value, url: u.value.trim(), feed: f.value.trim(), followers: parseInt(fo.value, 10) || 0 } : null; }; list.appendChild(row);
    }
    (initial || []).forEach(add); wrap.appendChild(list); wrap.appendChild(h("button", { type: "button", class: "btn", text: Q.addch, onclick: function () { add(null); } }));
    wrap.get = function () { return [].slice.call(list.children).map(function (r) { return r._get(); }).filter(Boolean); }; return wrap;
  }
  function saveBtn(label, fn, msg) { var b = h("button", { type: "button", class: "btn main", text: label, onclick: function () { b.disabled = true; msg.textContent = ""; fn().then(function (r) { b.disabled = false; if (r) msg.textContent = r.s === 200 ? "✓ " + Q.saved : (Q[r.j.error] || Q.err); }).catch(function (e) { try { console.error(e); } catch (x) {} b.disabled = false; msg.textContent = Q.err; }); } }); return b; }

  var MSA = [["modern_work", "Modern Work"], ["business_apps", "Business Applications"], ["data_ai", "Data & AI"], ["infrastructure", "Infrastructure"], ["digital_app", "Digital & App Innovation"], ["security", "Security"], ["csp", "Cloud Solution Provider (CSP)"], ["msp", "Managed Service Provider"], ["isv", de ? "Softwarehersteller (ISV)" : "Software vendor (ISV)"], ["inner_circle", "Inner Circle"], ["other", de ? "Sonstiges" : "Other"]],
    MSL = [["solutions_partner", "Solutions Partner"], ["specialization", de ? "Spezialisierung" : "Specialization"], ["advanced_specialization", "Advanced Specialization"], ["inner_circle", de ? "Inner-Circle-Mitglied" : "Inner Circle member"], ["poty_finalist", "Partner of the Year – Finalist"], ["poty_winner", "Partner of the Year – " + (de ? "Gewinner" : "winner")], ["registered", de ? "Registrierter Partner" : "Registered partner"], ["other", de ? "Sonstiges" : "Other"]];
  function msUI(o) {
    var w = h("div", { class: "wk-form" }), rows = h("div"), msg = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" });
    function opts(list, v) { var s = h("select"); list.forEach(function (x) { s.appendChild(h("option", { value: x[0], text: x[1] })); }); s.value = v; return s; }
    function add(m) { m = m || {}; var a = opts(MSA, m.area || "modern_work"), l = opts(MSL, m.level || "solutions_partner"), y = h("input", { type: "text", maxlength: 4, placeholder: de ? "seit (Jahr)" : "since (year)", style: "width:8em" }); y.value = m.since || "";
      var row = h("div", { style: "display:flex;gap:.4em;flex-wrap:wrap;margin:.3em 0" }, [a, l, y, h("button", { type: "button", class: "btn", text: "✕", onclick: function () { row.remove(); } })]); row._get = function () { return { area: a.value, level: l.value, since: y.value.trim() }; }; rows.appendChild(row); }
    ((o.org && o.org.ms) || []).forEach(add);
    w.appendChild(h("h4", { text: de ? "Microsoft-Status (Selbstangabe, Bereich und Stufe)" : "Microsoft status (self-declared: area and level)" })); w.appendChild(rows);
    w.appendChild(h("button", { type: "button", class: "btn", text: de ? "+ Bereich" : "+ Area", onclick: function () { add(); } })); w.appendChild(document.createTextNode(" "));
    w.appendChild(h("button", { type: "button", class: "btn main", text: de ? "Speichern" : "Save", onclick: function () { api("/api/orgoffer/ms", { method: "POST", body: { handle: o.handle, items: [].slice.call(rows.children).map(function (r) { return r._get(); }) } }).then(function (r) { msg.textContent = (r.j || {}).ok ? (de ? "Gespeichert." : "Saved.") : (de ? "Pro Bereich nur ein Eintrag." : "One entry per area."); }); } }));
    w.appendChild(msg); return w;
  }
  function offersUI(o) {
    var w = h("div", { class: "wk-form" }), list = h("ul"), msg = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" });
    var kind = h("select", { "aria-label": "Typ" }, [h("option", { value: "product", text: de ? "Produkt" : "Product" }), h("option", { value: "service", text: de ? "Service / Dienstleistung" : "Service" })]);
    var nm = inp(80), ds = h("textarea", { rows: 3, maxlength: 300, "aria-label": "desc" }), wb = inp(300); wb.placeholder = "https://";
    function reload() { list.textContent = ""; api("/api/orgoffer/list?handle=" + o.handle).then(function (r) { ((r.j || {}).items || []).forEach(function (it) { list.appendChild(h("li", {}, [h("a", { href: X.base + (de ? "/de" : "") + "/entity/" + it.eid + "/", text: it.eid }), " · " + (it.kind === "service" ? "Service" : (de ? "Produkt" : "Product"))])); }); }); }
    reload();
    var E = { need_link: de ? "Ein https-Link zur Produkt- bzw. Service-Seite ist Pflicht." : "An https link to the product or service page is required.", too_short: de ? "Beschreibung mindestens 20 Zeichen." : "Description needs at least 20 characters.", bad_name: de ? "Name fehlt." : "Name missing." };
    w.appendChild(h("h4", { text: de ? "Produkte & Services (werden als Entitäten angelegt)" : "Products & services (created as entities)" })); w.appendChild(list);
    [[de ? "Typ" : "Type", kind], [de ? "Name" : "Name", nm], [de ? "Kurzbeschreibung (20–300 Zeichen, ohne Links)" : "Short description (20–300 characters, no links)", ds], [de ? "Link zur Produkt-/Service-Seite (Pflicht)" : "Link to the product/service page (required)", wb]].forEach(function (x) { w.appendChild(lab(x[0], x[1])); });
    w.appendChild(h("button", { type: "button", class: "btn main", text: de ? "Anlegen" : "Add", onclick: function () {
      api("/api/orgoffer/save", { method: "POST", body: { handle: o.handle, kind: kind.value, name: nm.value, desc: ds.value, web: wb.value, lang: de ? "de" : "en" } }).then(function (r) {
        var j = r.j || {}; if (j.ok) { msg.textContent = de ? "Angelegt." : "Added."; nm.value = ds.value = wb.value = ""; reload(); } else msg.textContent = E[j.error] || (de ? "Konnte nicht gespeichert werden." : "Could not save.");
      });
    } })); w.appendChild(msg); return w;
  }
  var CL = M365L(de, "profile.CL", {"step1": "Bestätigen mit Firmen-E-Mail", "hint1": "Wir senden einen Einmal-Link an diese Adresse (24 Stunden gültig). Du musst dafür angemeldet sein.", "send1": "Link senden", "step2": "Kein Firmen-Postfach? Weitergeben an Kollegin/Kollegen", "hint2": "Nur mit einer Adresse bei der Firmen-Domain. Nach der Bestätigung wird die Kollegin/der Kollege Inhaber:in, nicht du.", "send2": "Einladung senden", "mail1": "E-Mail an die Firmen-Adresse", "mail2": "E-Mail der Kollegin/des Kollegen", "sent": "E-Mail gesendet – öffne den Link darin (24 Stunden gültig, einmal nutzbar).", "fwd": "Weitergegeben an ", "fwdwait": " – ohne Firmen-Postfach kannst du die Übernahme nicht selbst abschließen.", "done": "✔ Übernahme bestätigt (Firmen-E-Mail).", "nodomain": "Für diese Entität gibt es keine Firmen-Domain – die Redaktion prüft die Anfrage manuell.", "created": "Anfrage angelegt – bestätige sie jetzt mit deiner Firmen-E-Mail.", "nomail": "Der Versand ist gerade nicht verfügbar.", "free_mail": "Private Adressen (Gmail, Outlook, GMX …) zählen nicht – bitte eine Adresse der Firma.", "domain_mismatch": "Die Adresse gehört nicht zur Firmen-Domain.", "bad_email": "Die E-Mail-Adresse ist ungültig.", "rate_limit": "Zu viele Versuche – bitte später erneut.", "mail_off": "Der Versand ist gerade nicht verfügbar.", "mail_failed": "Die E-Mail konnte nicht gesendet werden.", "no_claim": "Es gibt keine offene Anfrage von dir für diese Entität.", "no_domain": "Für diese Entität gibt es keine Firmen-Domain.", "fail": "Das hat nicht geklappt.", "c_ok": "Bestätigt – du bist jetzt Inhaber:in der Entität.", "c_ok_fwd": "Danke – du bist jetzt Inhaber:in der Entität (weitergegeben an dich).", "c_invalid": "Dieser Link ist ungültig oder die Anfrage ist nicht mehr offen.", "c_used": "Dieser Link wurde schon benutzt.", "c_expired": "Dieser Link ist abgelaufen – bitte einen neuen anfordern.", "c_wrong_user": "Dieser Link gehört zu einem anderen Konto – bitte mit dem Konto anmelden, das die Anfrage gestellt hat.", "c_need_profile": "Bitte lege zuerst ein öffentliches Profil an und öffne den Link danach erneut.", "c_login": "Bitte anmelden und den Link aus der E-Mail danach erneut öffnen.", "c_review": "Firmen-E-Mail bestätigt. Die Redaktion prüft die Übernahme noch (die Domain gehört zu vielen Seiten oder eine frühere Übernahme wurde widerrufen).", "unavailable": "Gerade nicht verfügbar – bitte später erneut versuchen.", "c_unavailable": "Gerade nicht verfügbar – bitte den Link später erneut öffnen (er bleibt gültig).", "c_domain_changed": "Die Domain dieser Adresse gilt für diese Entität nicht mehr – bitte eine neue Anfrage stellen.", "took": "Zugeordnet: ", "pickone": "Mehrere Firmen passen – bitte eine auswählen.", "nomatch": "Keine passende Firma gefunden.", "propose": "Als neue Firmen-Entität vorschlagen", "p_live": "Entität angelegt – wähle sie jetzt aus.", "p_pending": "Vorgeschlagen – die Redaktion prüft sie; danach kannst du sie verknüpfen.", "p_fail": "Der Vorschlag konnte nicht gespeichert werden.", "fits": "Passt diese Entität?", "yes": "Ja", "no": "Nein"}, {"step1": "Confirm with company email", "hint1": "We send a one-time link to this address (valid for 24 hours). You must be signed in.", "send1": "Send link", "step2": "No company mailbox? Pass on to a colleague", "hint2": "Only with an address at the company domain. After confirmation the colleague becomes the owner, not you.", "send2": "Send invitation", "mail1": "Email at the company domain", "mail2": "Colleague's email", "sent": "Email sent – open the link in it (valid for 24 hours, single use).", "fwd": "Passed on to ", "fwdwait": " – without a company mailbox you cannot complete the takeover yourself.", "done": "✔ Takeover confirmed (company email).", "nodomain": "This entity has no company domain – the editors review the request manually.", "created": "Request created – now confirm it with your company email.", "nomail": "Sending is currently unavailable.", "free_mail": "Private addresses (Gmail, Outlook, GMX …) do not count – please use a company address.", "domain_mismatch": "This address is not at the company domain.", "bad_email": "The email address is invalid.", "rate_limit": "Too many attempts – please try again later.", "mail_off": "Sending is currently unavailable.", "mail_failed": "The email could not be sent.", "no_claim": "You have no open request for this entity.", "no_domain": "This entity has no company domain.", "fail": "That did not work.", "c_ok": "Confirmed – you are now the owner of the entity.", "c_ok_fwd": "Thank you – you are now the owner of the entity (passed on to you).", "c_invalid": "This link is invalid or the request is no longer open.", "c_used": "This link has already been used.", "c_expired": "This link has expired – please request a new one.", "c_wrong_user": "This link belongs to another account – please sign in with the account that made the request.", "c_need_profile": "Please create a public profile first, then open the link again.", "c_login": "Please sign in, then open the link from the email again.", "c_review": "Company email confirmed. The editors still review the takeover (the domain belongs to many pages or an earlier takeover was revoked).", "unavailable": "Not available right now – please try again later.", "c_unavailable": "Not available right now – please open the link again later (it stays valid).", "c_domain_changed": "This address's domain no longer applies to this entity – please make a new request.", "took": "Matched: ", "pickone": "Several companies match – please pick one.", "nomatch": "No matching company found.", "propose": "Suggest as a new company entity", "p_live": "Entity created – select it now.", "p_pending": "Suggested – the editors will review it; then you can link it.", "p_fail": "The suggestion could not be saved.", "fits": "Is this the right entity?", "yes": "Yes", "no": "No"});
  var EM = window.M365EntityMatch || null;
  var CS = M365L(de, "profile.CS", {"sum": "Firma anlegen oder beitreten", "lab": "Name oder Website der Firma", "hint": "Zuerst suchen: Vielleicht gibt es deine Firma schon – dann trittst du bei oder übernimmst sie, ohne langes Formular.", "comm": "Firma in der Community: ", "ent": "Firmen-Entität: ", "take": "Diese Firma übernehmen", "no": "Nein, meine Firma ist nicht dabei", "cont": "Weiter: Firma neu anlegen", "none": "Keine passende Firma gefunden.", "claimed": "Diese Entität wurde schon übernommen.", "need_profile": "Bitte lege zuerst ein öffentliches Profil an.", "rl": "Zu viele Versuche – bitte später erneut.", "err": "Das hat nicht geklappt.", "made": "Firma angelegt und Übernahme gestartet – bestätige jetzt mit der Firmen-E-Mail."}, {"sum": "Create or join a company", "lab": "Company name or website", "hint": "Search first: your company may already exist – then you join or take it over, without a long form.", "comm": "Community company: ", "ent": "Company entity: ", "take": "Take over this company", "no": "No, my company is not listed", "cont": "Continue: create a new company", "none": "No matching company found.", "claimed": "This entity has already been claimed.", "need_profile": "Please create a public profile first.", "rl": "Too many attempts – please try again later.", "err": "That did not work.", "made": "Company created and takeover started – now confirm with the company email."});
  // Uebernahme bestaetigen: Firmen-E-Mail (Domain der Entitaet) oder an Kollegin/Kollegen weitergeben; Status kommt vom Worker
  function claimBox(eid, hintDomain) {
    var box = h("div", { class: "wk-form" }), msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" });
    function build(d) {
      box.textContent = ""; msg.textContent = "";
      if (d.status === "verified") { box.appendChild(h("p", { text: CL.done })); return; }
      if (d.review) { box.appendChild(h("p", { class: "cmut", text: CL.c_review + (d.review_domain ? " (@" + d.review_domain + ")" : "") })); return; }   // Firmen-E-Mail bestaetigt, Redaktion entscheidet
      var doms = d.domains || []; if (!doms.length) { box.appendChild(h("p", { class: "cmut", text: CL.nodomain })); return; }
      var dom = doms[0], e1 = h("input", { type: "email", maxlength: 254, autocomplete: "email", placeholder: "name@" + dom }), e2 = h("input", { type: "email", maxlength: 254, autocomplete: "off", placeholder: "kollege@" + dom });
      function send(kind, input, btn) { var v = input.value.trim(); if (!v) return; btn.disabled = true; api("/api/entity/claim/" + kind, { method: "POST", body: { eid: eid, email: v, lang: de ? "de" : "en" } }).then(function (r) {
        btn.disabled = false; var j = r.j || {};
        if (j.ok) { input.value = ""; d.status = j.status; d.fwd_mask = j.mask; status(); } else msg.textContent = CL[j.error] || CL.fail; }); }
      var b1 = h("button", { type: "button", class: "btn main", text: CL.send1, onclick: function () { send("domain", e1, b1); } });
      var b2 = h("button", { type: "button", class: "btn", text: CL.send2, onclick: function () { send("forward", e2, b2); } });
      box.appendChild(h("h4", { text: CL.step1 + " (@" + dom + ")" })); box.appendChild(h("p", { class: "cmut", text: CL.hint1 }));
      box.appendChild(lab(CL.mail1, e1)); box.appendChild(h("p", {}, [b1]));
      box.appendChild(h("h4", { text: CL.step2 })); box.appendChild(h("p", { class: "cmut", text: CL.hint2 }));
      box.appendChild(lab(CL.mail2, e2)); box.appendChild(h("p", {}, [b2])); box.appendChild(msg); status();
      function status() { msg.textContent = d.status === "email_sent" ? CL.sent : d.status === "forwarded" ? CL.fwd + (d.fwd_mask || "") + CL.fwdwait : ""; }
    }
    if (hintDomain) box.appendChild(h("p", { class: "cmut", text: CL.step1 + " (@" + hintDomain + ")" }));
    api("/api/entity/claim/domains?eid=" + encodeURIComponent(eid)).then(function (r) { if (r.s === 200) build(r.j || {}); else { box.textContent = ""; box.appendChild(h("p", { class: "cmut", text: CL.fail })); } });
    return box;
  }
  // Firmen-Entitaet waehlen (nur Inhaber/Admin): verknuepft das Firmenkonto mit der Entitaetsseite (/entity/<eid>/); die oeffentlichen Mitglieder erscheinen dort unter "Personen"
  function entityLinkUI(all, o) {
    var EL = M365L(de, "profile.EL", { h: "Verknüpfte Firmen-Entität", hint: "Wähle die Firma in der Entitäten-Datenbank. Nach der Bestätigung erscheinen alle Mitglieder mit öffentlichem Profil (und sichtbarer Firmenzugehörigkeit) auf der Entitätsseite unter „Personen“ – ab dem nächsten Seitenbau. Bestätigen können Inhaber/Admins der Firma, die die Entität beansprucht haben, oder die Redaktion.", pick: "Firma suchen (Name aus der Entitäten-Datenbank)…", ok: "✔ bestätigt", wait: "⏳ noch nicht bestätigt – erst die Entität beanspruchen", none: "Keine Entität verknüpft.", page: "Entitätsseite", nf: "Diese Firma gibt es in der Entitäten-Datenbank nicht – bitte einen Namen aus der Liste wählen.", claim: "Entität beanspruchen", sent: "Anspruch gesendet – die Bestätigung erfolgt automatisch.", nope: "Nicht möglich (schon beansprucht oder Limit erreicht)." }, { h: "Linked company entity", hint: "Pick the company in the entity database. Once confirmed, every member with a public profile (and visible company membership) appears on the entity page under “People” – from the next site build. Owners/admins of the company who have claimed the entity, or the editors, can confirm it.", pick: "Search company (name from the entity database)…", ok: "✔ confirmed", wait: "⏳ not confirmed yet – claim the entity first", none: "No entity linked.", page: "Entity page", nf: "This company is not in the entity database – please pick a name from the list.", claim: "Claim this entity", sent: "Claim sent – confirmation happens automatically.", nope: "Not possible (already claimed or limit reached)." });
    var orgs = all.filter(function (x) { return x.type === "org"; }), dl = h("datalist", { id: "pdl" + (++uid) });
    orgs.forEach(function (x) { dl.appendChild(h("option", { value: x.name })); });
    var cur = orgs.filter(function (x) { return x.id === o.eid; })[0], inp0 = h("input", { type: "text", list: dl.id, maxlength: 80, placeholder: EL.pick, "aria-label": EL.h });
    inp0.value = cur ? cur.name : (o.eid || "");
    var st = h("p", { class: "cmut" }, o.eid ? [h("a", { href: X.base + (de ? "/de" : "") + "/entity/" + o.eid + "/", target: "_blank", text: EL.page + ": " + (cur ? cur.name : o.eid) }), " · " + (o.eid_ok ? EL.ok : EL.wait)] : [EL.none]);
    var cm = h("span", { class: "cmut", role: "status", "aria-live": "polite" });
    var claimHost = h("div"), sug = h("div", { role: "status", "aria-live": "polite" }), picked = "", dismissed = false, lastSite = "";
    function showClaim(id, dom) { claimHost.textContent = ""; claimHost.appendChild(claimBox(id, dom)); }
    var cb = h("button", { type: "button", class: "btn", text: EL.claim, onclick: function () { var id = w.get(); if (!id) { cm.textContent = " " + w.nf; return; } cb.disabled = true; api("/api/entity/claim", { method: "POST", body: { eid: id } }).then(function (q) { cb.disabled = false; var ok = (q.j || {}).ok; cm.textContent = " " + (ok ? CL.created : EL.nope); if (ok) showClaim(id, w.domain); }); } });
    if (o.eid) api("/api/entity/claim/mine").then(function (r) { ((r.j || {}).claims || []).forEach(function (c) { if (c.eid === o.eid && c.status !== "verified" && c.status !== "rejected") showClaim(o.eid); }); });
    function pick(e) { inp0.value = e.name; sug.textContent = ""; w.domain = EM ? (EM.domainsOf(e)[0] || "") : ""; }
    function propose(v) {
      var base = (EM ? EM.slug(v) : v.toLowerCase().replace(/[^a-z0-9]+/g, "-")).slice(0, 44), id = base, n = 1;
      while (all.some(function (x) { return x.id === id; })) id = base + "-" + (++n);
      var web = lastSite && EM && EM.domainOf(lastSite) ? "https://" + (lastSite.replace(/^[a-z]+:\/\//i, "").split(/[\/?#]/)[0]) : "";
      var data = { name: v, type: "org", aliases: [], desc: { en: v + " – company profile suggested by a community member.", de: v + " – Firmenprofil, vorgeschlagen von einem Community-Mitglied." } }; if (web) data.web = web;
      api("/api/entity", { method: "POST", body: { id: id, data: data, summary: "Vorschlag aus Firmenprofil" } }).then(function (r) {
        var j = r.j || {}; sug.textContent = ""; if (j.ok) { if (j.status === "live") { all.push({ id: id, name: v, type: "org" }); orgs.push({ id: id, name: v, type: "org" }); } sug.appendChild(h("p", { class: "cmut", text: j.status === "live" ? CL.p_live : CL.p_pending })); } else sug.appendChild(h("p", { class: "cmut", text: CL.p_fail })); });
    }
    function resolve(v) {
      var lv = v.toLowerCase(), hit = orgs.filter(function (x) { return x.name.toLowerCase() === lv || x.id === lv || (x.aliases || []).some(function (a) { return String(a).toLowerCase() === lv; }); })[0];
      var m = hit ? { entity: hit, candidates: [] } : (EM ? EM.match(v, orgs, "org") : { entity: null, candidates: [] });
      sug.textContent = "";
      if (m.entity) { pick(m.entity); if (!hit) sug.appendChild(h("p", { class: "cmut", text: CL.took + m.entity.name })); return m.entity.id; }
      if (m.candidates.length) { w.nf = CL.pickone; sug.appendChild(h("p", { class: "cmut", text: CL.pickone })); m.candidates.forEach(function (e) { sug.appendChild(h("button", { type: "button", class: "btn", style: "margin:.2em .4em .2em 0", text: e.name, onclick: function () { pick(e); } })); }); return null; }
      w.nf = CL.nomatch; sug.appendChild(h("p", { class: "cmut", text: CL.nomatch })); sug.appendChild(h("button", { type: "button", class: "btn", text: CL.propose, onclick: function () { propose(v); } })); return null;
    }
    var w = h("div", {}, [h("h4", { text: EL.h }), h("p", { class: "cmut", text: EL.hint }), dl, inp0, sug, st, h("p", {}, [cb, cm]), claimHost]);
    // null = ungueltig, undefined = nichts senden (neue Firma ohne Wahl), "" = loesen, sonst die Entitaets-ID
    w.get = function () { var v = inp0.value.trim(); if (!v) return o.handle ? "" : undefined; return resolve(v); };
    // Vorschlag aus Firmenname/Website der Community-Firma (nur wenn noch nichts gewaehlt ist)
    w.hint = function (name, site) {
      lastSite = site || ""; if (dismissed || !EM || (inp0.value.trim() && inp0.value !== picked)) return;
      var s0 = EM.suggest(name, site, orgs); if (!s0) return;
      picked = inp0.value = s0.entity.name; w.domain = s0.domain; sug.textContent = "";
      sug.appendChild(h("p", {}, [CL.fits + " " + s0.entity.name + " ✔ ", h("button", { type: "button", class: "btn", text: CL.no, onclick: function () { dismissed = true; inp0.value = picked = ""; w.domain = ""; sug.textContent = ""; } })]));
    };
    w.nf = EL.nf; return w;
  }
  function orgForm(all, org, onDone, canLink, pre) {
    var o = org || {}, f = h("div", { class: "wk-form" }), msg = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" });
    var link = canLink ? entityLinkUI(all, o) : null;
    var handle = inp(30, o.handle), name = inp(80, o.name), tag = inp(120, o.tagline), about = h("textarea", { rows: 4, maxlength: 1500 }), site = inp(250, o.website), country = inp(60, o.country), size = h("select");
    about.value = o.about || ""; ["", "1", "2-10", "11-50", "51-200", "201-1000", "1000+"].forEach(function (s) { size.appendChild(h("option", { value: s, text: s || "–" })); }); size.value = o.size || "";
    if (org) handle.disabled = true;
    var locations = h("div");
    function addLocation(location) {
      location = location || {};
      var label = inp(80, location.label), address = inp(160, location.address), city = inp(80, location.city), country0 = inp(60, location.country), visible = chk(de ? "Adresse öffentlich anzeigen" : "Show this address publicly", location.public);
      var row = h("div", { style: "border:1px solid var(--bd);border-radius:.6em;padding:.6em;margin:.5em 0" });
      [[de ? "Standortname" : "Location name", label], [de ? "Adresse" : "Address", address], [de ? "Stadt" : "City", city], [de ? "Land" : "Country", country0]].forEach(function (x) { row.appendChild(lab(x[0], x[1])); });
      row.appendChild(visible.w);
      row.appendChild(h("button", { type: "button", class: "btn", text: de ? "Standort entfernen" : "Remove location", onclick: function () { row.remove(); } }));
      row._get = function () { return { id: location.id || 0, label: label.value, address: address.value, city: city.value, country: country0.value, public: visible.c.checked }; };
      locations.appendChild(row);
    }
    (o.locations || []).forEach(addLocation);
    locations.get = function () { return [].slice.call(locations.children).map(function (row) { return row._get(); }); };
    var pub = chk(Q.pub, o.public), prog = programsUI(o.programs, true), ex = pickerRows(all, function (x) { return ["product", "platform", "concept", "category"].indexOf(x.type) > -1; }, (o.expertise || []).map(function (x) { return { e: x.e, level: x.level }; }), false, Q.addexp), ch = channelsUI(o.channels), indo = pickerRows(all, function (x) { return x.type === "industry"; }, (o.industries || []).map(function (e) { return { e: e }; }), false, KQ.indadd, "industry", { pick: KQ.indpick, mk: KQ.mk, pend: KQ.pend_sel, dup: KQ.dup });
    var pic = imgUI("o", o.handle, o.img); pic.handle = function () { return o.handle || ""; }; pic.ensure = function () { if (!handle.value.trim() || !name.value.trim()) return Promise.resolve(false); mainSave.click(); return new Promise(function (res) { var n = 0, t = setInterval(function () { if (++n > 6) { clearInterval(t); res(true); } }, 500); }); };
    [pub.w, pic, lab(Q.handle, handle), lab(Q.orgname, name), lab(Q.tagline, tag), lab(de ? "Über uns (ohne Links)" : "About us (no links)", about), lab(Q.site, site), lab(Q.country, country), lab(Q.size, size),
      h("h4", { text: de ? "Standort und Kartenanzeige" : "Location and map display" }), h("p", { class: "cmut", text: de ? "Nur ausdrücklich veröffentlichte Firmenstandorte erscheinen im Verzeichnis." : "Only locations explicitly made public appear in the directory." }), locations,
      h("button", { type: "button", class: "btn", text: de ? "+ Standort" : "+ Location", onclick: function () { addLocation(); } }),
      h("h4", { text: Q.prog }), prog, h("h4", { text: Q.exp }), ex, h("h4", { text: KQ.ind }), h("p", { class: "cmut", text: KQ.indh }), indo, h("h4", { text: Q.chan }), ch].concat(link ? [link] : [], [sponsorUI(function () { return o.handle || ""; })]).forEach(function (x) { f.appendChild(x); });
    if (pre) { if (pre.name) name.value = pre.name; if (pre.website) site.value = pre.website; }
    if (link) { var hint = function () { link.hint(name.value, site.value); }; name.addEventListener("change", hint); site.addEventListener("change", hint); if (!o.eid) hint(); }
    var mainSave = saveBtn(Q.save, function () {
      var e = ex.get(); if (e === null) { msg.textContent = Q.bad_expertise; return Promise.resolve(null); }
      var io = indo.get(); if (io === null) { msg.textContent = KQ.bad_industry; return Promise.resolve(null); }
      var le = link ? link.get() : undefined; if (le === null) { msg.textContent = link.nf; return Promise.resolve(null); }
      var isNew = !o.handle; o.handle = handle.value.trim().toLowerCase();
      var bd = { handle: handle.value.trim().toLowerCase(), name: name.value, tagline: tag.value, about: about.value, website: site.value.trim(), country: country.value, size: size.value, public: pub.c.checked, programs: prog.get(), expertise: e, industries: io.map(function (x) { return x.e; }), channels: ch.get(), locations: locations.get() };
      if (le !== undefined) bd.eid = le;
      return api("/api/org", { method: "POST", body: bd }).then(function (r) { if (r.s !== 200 && isNew) o.handle = ""; if (r.s === 200 && (onDone || (link && le !== undefined && (le !== (o.eid || "") || (le && !o.eid_ok))))) setTimeout(function () { location.reload(); }, 600); return r; });
    }, msg); f.appendChild(h("div", { class: "btns" }, [mainSave])); f.appendChild(msg); return f;
  }

  Promise.all([api("/api/profile/me"), fetch(X.base + "/entities.json" + (X.v ? "?v=" + encodeURIComponent(X.v) : ""), { cache: "no-cache" }).then(function (r) { return r.json(); }), api("/api/org/mine")]).then(function (a) {
    if (a[0].s !== 200) return; var me = a[0].j, all = (a[1].entities || []), p = me.profile || {}, orgs = (a[2].j.orgs || []);
    var sec = h("section", { class: "ccard" }, [h("h2", { text: Q.h }), h("p", { class: "cmut", text: Q.intro })]), msg = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" });
    var pub = chk(Q.pub, p.public), handle = inp(30, p.handle || me.suggest), head = inp(100, p.headline), about = h("textarea", { rows: 6, maxlength: 1500 }), company = inp(80, p.company_eid ? ((all.filter(function (x) { return x.id === p.company_eid; })[0] || {}).name || p.company) : ""), jobp = pickerRows(all, function (x) { return x.type === "job"; }, p.job_eid ? [{ e: p.job_eid }] : jobGuess(all, p.job), false, KQ.jobl, "job", { single: true, pick: KQ.jobpick, mk: KQ.mk, pend: KQ.pend_sel, dup: KQ.dup }), indp = pickerRows(all, function (x) { return x.type === "industry"; }, (p.industries || []).map(function (e) { return { e: e }; }), false, KQ.indadd, "industry", { pick: KQ.indpick, mk: KQ.mk, pend: KQ.pend_sel, dup: KQ.dup }), country = inp(60, p.country), so = chk(Q.showorg, p.show_org !== false);
    about.value = p.about || "";
    var prog = programsUI(p.programs, false), ex = expertiseView(p.expertise || [], all);
    var privUI = privateUI(p.private), cert = pickerRows(all, function (x) { return x.type === "cert"; }, (p.certs || []).map(function (x) { return { e: x.e, year: x.year, url: x.url, verified: x.verified }; }), true, Q.addcert, "cert"), ch = channelsUI(p.channels);
    var pic = imgUI("u", p.handle, p.img); pic.handle = function () { return p.handle || ""; }; pic.ensure = function () { if (!handle.value.trim()) return Promise.resolve(false); mainSave.click(); return new Promise(function (res) { var n = 0, t = setInterval(function () { if (p.handle || ++n > 30) { clearInterval(t); res(!!p.handle); } }, 200); }); };
    [pub.w, pic, lab(Q.handle, handle), lab(Q.headline, head), lab(Q.about, about), h("p", { class: "cmut", text: CQ.hint }), h("h3", { text: KQ.jobl }), h("p", { class: "cmut", text: KQ.jobh }), jobp, h("h3", { text: KQ.ind }), h("p", { class: "cmut", text: KQ.indh }), indp, lab(Q.country, country), so.w, h("h3", { text: Q.prog }), prog, h("h3", { text: Q.exp }), h("p", { class: "cmut", text: Q.exp_auto }), ex, privUI, h("h3", { text: Q.certs }), h("p", { class: "cmut", text: de ? "Trage als Nachweis den Link zu deinem Credly-Abzeichen oder Microsoft-Learn-Zertifikat ein. Passen Zertifikat und dein Name, wird es automatisch geprüft; sonst prüft die Redaktion. Geprüfte Zertifikate berechtigen dich, verbundene Themen direkt zu bearbeiten und darüber abzustimmen. Andere Mitglieder können dein Zertifikat bestätigen; die meistbestätigten stehen zuerst." : "Add the link to your Credly badge or Microsoft Learn credential as proof. If certificate and your name match, it is verified automatically; otherwise the editorial team reviews it. Verified certificates let you edit and vote on linked topics directly. Other members can confirm your certificate; the most confirmed come first." }), cert, h("h3", { text: Q.chan }), h("p", { class: "cmut", text: de ? "Verlinke deine eigenen Kanäle (Podcast, Blog, YouTube, LinkedIn …). Sie erscheinen im Profil und bei deinen Folgen und Beiträgen." : "Link your own channels (podcast, blog, YouTube, LinkedIn …). They show on your profile and next to your episodes and posts." }), ch].forEach(function (x) { sec.appendChild(x); });
    var mainSave = saveBtn(Q.save, function () {
      var c = cert.get(); if (c === null) { msg.textContent = Q.bad_cert; return Promise.resolve(null); }
      var jb = jobp.get(), ib = indp.get(); if (jb === null || ib === null) { msg.textContent = KQ.bad_industry; return Promise.resolve(null); }
      var jobE = jb[0] ? jb[0].e : "", jobName = jobE ? (all.filter(function (x) { return x.id === jobE; })[0] || {}).name || "" : (p.job_eid ? "" : (p.job || ""));
      return Promise.resolve(true).then(function (okc) { return api("/api/profile/me", { method: "POST", body: { private: privUI.get(), public: pub.c.checked, handle: handle.value.trim().toLowerCase(), headline: head.value, about: about.value, company: company.value, job: jobName, job_eid: jobE, industries: ib.map(function (x) { return x.e; }), country: country.value, show_org: so.c.checked, programs: prog.get(), certs: c, channels: ch.get() } }).then(function (r) {
        if (r.s === 200) { p.handle = handle.value.trim().toLowerCase(); msg.textContent = "✓ " + Q.saved + " " + Q.note; } return null; }); });
    }, msg); sec.appendChild(h("div", { class: "btns" }, [mainSave]));
    sec.appendChild(msg);
    if (p.public && p.handle) sec.appendChild(h("p", {}, [h("a", { href: X.base + (de ? "/de" : "") + "/community/u/" + p.handle + "/", text: Q.open })]));
    root.appendChild(sec); if (p.handle) { root.insertBefore(suggestUI(), root.firstChild); root.appendChild(recInbox()); root.appendChild(editorApplyUI()); }
    // ---- Firmen ----
    var os = h("section", { class: "ccard" }, [h("h2", { text: Q.orgs })]);
    orgs.forEach(function (o) {
      var d = h("details", { class: "wk-edit" }, [h("summary", { text: o.name + " · " + (RL[o.role] || o.role) + (o.status === "pending" ? " · " + Q.pend_me : "") })]);
      if (o.status === "active") {
        d.appendChild(h("p", {}, [h("a", { href: X.base + (de ? "/de" : "") + "/community/c/" + o.handle + "/", text: Q.open })]));
        if (o.org && o.role === "editor") { d.appendChild(orgForm(all, o.org, null)); }
        if (o.org && (o.role === "owner" || o.role === "admin")) {
          if ((o.pending || []).length) { d.appendChild(h("h4", { text: Q.pending })); o.pending.forEach(function (m) { var rs = roleSel("member", o.role); d.appendChild(h("p", {}, [m.name + " ", rs, " ", h("button", { type: "button", class: "btn main", text: Q.approve, onclick: function () { api("/api/org/" + o.handle + "/member", { method: "POST", body: { user_id: m.user_id, action: "approve", role: rs.value } }).then(function () { location.reload(); }); } })])); }); }
          d.appendChild(h("h4", { text: Q.team })); (o.team || []).forEach(function (m) { d.appendChild(h("p", {}, [m.name + " · ", (m.role === "owner" || m.role === "admin") && o.role !== "owner" ? RL[m.role] : roleSel(m.role, o.role, function (v) { api("/api/org/" + o.handle + "/member", { method: "POST", body: { user_id: m.user_id, action: "role", role: v } }).then(function (r) { if (r.s !== 200) location.reload(); }); }), " ", m.role === "owner" ? null : h("button", { type: "button", class: "btn", text: Q.remove, onclick: function () { api("/api/org/" + o.handle + "/member", { method: "POST", body: { user_id: m.user_id, action: "remove" } }).then(function () { location.reload(); }); } })])); });
          d.appendChild(orgForm(all, o.org, null, true));
        }
        if (o.org && ["owner", "admin"].indexOf(o.role) > -1) d.appendChild(msUI(o));
        if (o.org && ["owner", "admin", "editor"].indexOf(o.role) > -1) d.appendChild(offersUI(o));
      }
      d.appendChild(h("button", { type: "button", class: "btn", text: Q.leave, onclick: function () { api("/api/org/" + o.handle + "/leave", { method: "POST" }).then(function () { location.reload(); }); } }));
      os.appendChild(d);
    });
    var sd = h("details", { class: "wk-edit" }, [h("summary", { text: CS.sum })]), st1 = h("div", { class: "wk-form" }), ff = h("div", { hidden: "" });
    var q = inp(80, ""), res = h("div", { role: "status", "aria-live": "polite" }), jm = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" }), t;
    var orgEnts = all.filter(function (x) { return x.type === "org"; });
    q.setAttribute("aria-label", CS.lab); q.setAttribute("placeholder", CS.lab);
    function showForm() {
      var v = q.value.trim(), site0 = EM && EM.domainOf(v), pre = site0 ? { website: /^https?:/i.test(v) ? v : "https://" + v } : { name: v };
      st1.hidden = true; ff.textContent = ""; ff.appendChild(orgForm(all, null, function () {}, true, pre)); ff.hidden = false;
    }
    function takeEntity(e, row) {   // Entitaet beanspruchen + Community-Firma (gleicher Name -> automatisch verknuepft) in einem Schritt
      api("/api/entity/claim", { method: "POST", body: { eid: e.id } }).then(function (c) {
        var j = c.j || {}; if (!j.ok) { jm.textContent = c.s === 429 ? CS.rl : j.error === "need_profile" ? CS.need_profile : j.error === "claimed" ? CS.claimed : CS.err; return; }
        var base = (EM ? EM.slug(e.name) : e.id).slice(0, 26); if (base.length < 3) base = e.id.slice(0, 26); var tries = 0;
        (function mk(hd) { api("/api/org", { method: "POST", body: { handle: hd, name: e.name, website: e.web || "", public: false, programs: [], expertise: [], channels: [], locations: [] } }).then(function (r) {
          if (r.s === 409 && ++tries < 4) { mk(base.slice(0, 24) + "-" + (tries + 1)); return; }
          jm.textContent = r.s === 200 ? CS.made : CS.err; row.appendChild(claimBox(e.id, EM ? EM.domainsOf(e)[0] : "")); }); })(base);
      });
    }
    function search() {
      var v = q.value.trim(); res.textContent = ""; jm.textContent = ""; if (v.length < 2) return;
      var dom = EM && EM.domainOf(v), m = EM ? EM.match(v, orgEnts, "org") : { entity: null, candidates: [] }, ents = m.entity ? [m.entity] : m.candidates;
      api("/api/orgs/search?q=" + encodeURIComponent(dom ? dom.split(".")[0] : v)).then(function (r) {
        if (q.value.trim() !== v) return; var items = (r.j || {}).items || [];
        items.forEach(function (o) { res.appendChild(h("p", {}, [CS.comm + o.name + " ", h("button", { type: "button", class: "btn", text: Q.req, onclick: function () { api("/api/org/" + o.handle + "/join", { method: "POST" }).then(function (x) { jm.textContent = x.s === 200 ? "✓ " + Q.pend_me : Q.err; }); } })])); });
        ents.forEach(function (e) { var row = h("div"); row.appendChild(h("p", {}, [CS.ent + e.name + " ", h("button", { type: "button", class: "btn main", text: CS.take, onclick: function () { takeEntity(e, row); } })])); res.appendChild(row); });
        var any = items.length || ents.length; if (!any) res.appendChild(h("p", { class: "cmut", text: CS.none }));
        res.appendChild(h("p", {}, [h("button", { type: "button", class: any ? "btn" : "btn main", text: any ? CS.no : CS.cont, onclick: showForm })]));
      });
    }
    q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(search, 300); });
    [h("p", { class: "cmut", text: CS.hint }), lab(CS.lab, q), res, jm].forEach(function (x) { st1.appendChild(x); }); sd.appendChild(st1); sd.appendChild(ff); os.appendChild(sd);
    (orgHost || root).appendChild(os);
  }).catch(function () {});
  (function claimLink() {   // Link aus der Bestaetigungs-Mail: ?claimverify=<token>
    var t = ""; try { t = new URLSearchParams(location.search).get("claimverify") || ""; } catch (e) {} if (!t) return;
    var m = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" }); root.insertBefore(m, root.firstChild);
    api("/api/entity/claim/confirm", { method: "POST", body: { t: t } }).then(function (r) {
      var j = r.j || {}; if (r.s === 401) { m.textContent = CL.c_login; return; }
      m.textContent = j.ok ? (j.review ? CL.c_review : j.forwarded ? CL.c_ok_fwd : CL.c_ok) : (CL["c_" + j.error] || CL.fail);
      try { var u = new URL(location.href); u.searchParams.delete("claimverify"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (e) {}
    });
  })();
  // Link aus der Einladungs-Mail (Entitaet uebernehmen): ?invite=<token>, 27 Zeichen base64url (Testmail: TEST-<16 Zeichen>). Die 36-stelligen Hex-Tokens der Speaker-Einladungen
  // verarbeitet events.js. Die Karte steht ueber den Reitern und haengt nicht am Anker: nach der Anmeldung kommt man ohne #c-invite zurueck, das Token
  // bleibt in der Adresse, bis die Seite uebernommen ist.
  var IV = M365L(de, "profile.IV", {"h": "Einladung: deine Seite auf M365.FM", "hi": "Hallo {n},", "hi0": "Hallo,", "txt": "mit dieser Einladung übernimmst du die Seite über dich und pflegst Angaben, Themen und Links danach selbst:", "login": "Melde dich an (oder registriere dich kostenlos), um die Seite zu übernehmen. Die Einladung bleibt dabei erhalten.", "signin": "Anmelden mit", "go": "Seite übernehmen", "busy": "Wird übernommen …", "ok": "✓ Die Seite gehört jetzt zu deinem Konto.", "view": "Seite ansehen", "need_profile": "Dafür brauchst du ein öffentliches Profil: im Reiter „Profil“ eine Profil-Adresse wählen, „Profil öffentlich anzeigen“ ankreuzen und speichern. Klicke danach erneut auf „Seite übernehmen“.", "toprofile": "Zum Profil", "claimed": "Diese Seite ist bereits einem anderen Konto zugeordnet. Stimmt das nicht, antworte bitte auf die Einladungs-Mail.", "used": "Diese Einladung wurde bereits eingelöst.", "invalid": "Dieser Einladungs-Link ist ungültig oder wurde zurückgezogen.", "fail": "Das hat nicht geklappt – bitte später erneut versuchen.", "test": "Das ist der Link aus einer Testmail. In einer echten Einladung stehen hier der Name der eingeladenen Person und der Knopf „Seite übernehmen“."}, {"h": "Invitation: your page on M365.FM", "hi": "Hi {n},", "hi0": "Hi,", "txt": "with this invitation you claim the page about you and keep its details, topics and links up to date yourself:", "login": "Sign in (or register for free) to claim the page. The invitation stays valid while you do.", "signin": "Sign in with", "go": "Claim my page", "busy": "Claiming …", "ok": "✓ The page now belongs to your account.", "view": "View the page", "need_profile": "You need a public profile for this: on the “Profile” tab choose a profile address, tick “Show my profile publicly” and save. Then click “Claim my page” again.", "toprofile": "Go to profile", "claimed": "This page is already linked to another account. If that is wrong, please reply to the invitation e-mail.", "used": "This invitation has already been used.", "invalid": "This invitation link is invalid or has been withdrawn.", "fail": "That did not work – please try again later.", "test": "This is the link from a test mail. In a real invitation the invited person sees their name and the “Claim my page” button here."});
  (function inviteLink() {
    var t = ""; try { t = new URLSearchParams(location.search).get("invite") || ""; } catch (e) {} if (!/^(?:[A-Za-z0-9_-]{27}|TEST-[A-Za-z0-9_-]{16})$/.test(t)) return;
    var card = h("section", { class: "ccard", id: "c-invite" }, [h("h2", { text: IV.h })]), m = h("p", { class: "wk-msg", role: "status", "aria-live": "polite" });
    function put() { var at = document.querySelector(".ctabs") || document.getElementById("c-page") || root; at.parentNode.insertBefore(card, at); }
    if (t.slice(0, 5) === "TEST-") { put(); card.appendChild(h("p", { text: IV.test })); return; }   // "Testmail an mich" (Verwaltung): kein echtes Token, nichts zu uebernehmen
    Promise.all([api("/api/entityinvite/info?t=" + encodeURIComponent(t)), api("/api/me")]).then(function (a) {
      var i = a[0].j || {}, me = (a[1].j || {}).user || null; put();
      if (a[0].s !== 200 || !i.eid || i.status === "declined") { card.appendChild(h("p", { text: IV.invalid })); return; }
      var pageUrl = X.base + (de ? "/de" : "") + "/entity/" + i.eid + "/";
      card.appendChild(h("p", {}, [(i.name ? IV.hi.replace("{n}", i.name) : IV.hi0) + " " + IV.txt + " ", h("a", { href: pageUrl, text: pageUrl })]));
      if (i.status === "claimed") { card.appendChild(h("p", { text: IV.used })); return; }
      if (!me) {   // nicht angemeldet: Anmeldeknoepfe; die Rueckkehr-Adresse enthaelt ?invite=..., danach geht es hier mit dem Knopf weiter
        var ret = encodeURIComponent(location.href.split("#")[0]), lg = h("div", { class: "btns" }); card.appendChild(h("p", { text: IV.login })); card.appendChild(lg);
        fetch(X.api + "/api/providers").then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (pj) { var pv = (pj && pj.providers) || ["linkedin", "microsoft", "google"]; if (!Array.isArray(pv)) pv = Object.keys(pv);
          [["linkedin", "LinkedIn"], ["microsoft", "Microsoft"], ["google", "Google"], ["github", "GitHub"]].forEach(function (x) { if (pv.indexOf(x[0]) >= 0) lg.appendChild(h("a", { class: "btn" + (x[0] === "linkedin" ? " main" : ""), href: X.api + "/auth/login/" + x[0] + "?return=" + ret, rel: "nofollow", text: IV.signin + " " + x[1] })); }); });
        return;
      }
      var go = h("button", { type: "button", class: "btn main", text: IV.go, onclick: function () {
        go.disabled = true; m.textContent = IV.busy;
        api("/api/entityinvite/accept", { method: "POST", body: { t: t } }).then(function (r) {
          var j = r.j || {};
          if (j.ok) { m.textContent = IV.ok + " "; m.appendChild(h("a", { href: pageUrl, text: IV.view })); go.hidden = true; try { var u = new URL(location.href); u.searchParams.delete("invite"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (e) {} return; }
          go.disabled = false;
          if (j.error === "need_profile") { m.textContent = IV.need_profile + " "; m.appendChild(h("a", { href: "#c-expert", text: IV.toprofile })); return; }
          m.textContent = j.error === "claimed" ? IV.claimed : j.error === "not_found" ? IV.invalid : r.s === 401 ? IV.login : IV.fail;
        }, function () { go.disabled = false; m.textContent = IV.fail; });
      } });
      card.appendChild(h("div", { class: "btns" }, [go])); card.appendChild(m);
    }).catch(function () { put(); card.appendChild(h("p", { text: IV.fail })); });
  })();
})();
