/* Eigene MVP-Beiträge, Quellen und Portal-Export. */
(function () {
  var X = window.M365X, root = document.getElementById("c-contributions");
  if (!X || !root) return;
  var de = X.lang === "de";
  var M365L = window.M365L || function (isDe, k, a, b) { return isDe ? a : b; };
  var Q = M365L(de, "contributions.Q", {
    h: "Meine Beiträge", intro: "Gesammelte und manuell erfasste Beiträge verwalten.",
    login: "Bitte melde dich an, um Beiträge zu verwalten.", add: "Beitrag hinzufügen", hand: "Von Hand", linkMode: "Per Link",
    sources: "Quellen", sourceAdd: "Quelle hinzufügen", sourceEdit: "Quelle bearbeiten", sourceSave: "Quelle speichern",
    sourceKind: "Quellentyp", sourceUrl: "Profil- oder Feed-URL", sourceTitle: "Name (optional)", sourcePublic: "Beiträge standardmäßig öffentlich",
    youtube: "YouTube", podcast: "Podcast-RSS", blog: "Blog-RSS", github: "GitHub",
    active: "Aktiv", paused: "Pausiert", pausedErrors: "Wegen Fehlern pausiert",
    public: "Öffentlich", private: "Privat", edit: "Ändern", remove: "Löschen", confirmSource: "Quelle löschen? Die Beiträge bleiben erhalten.",
    reactivate: "Quelle reaktivieren", noSources: "Noch keine Quellen.", save: "Speichern", cancel: "Abbrechen",
    title: "Titel", date: "Datum", type: "Typ", category: "MVP-Kategorie", topics: "Themen/Entitäten (IDs, kommagetrennt)",
    url: "Link (optional)", visibility: "Sichtbarkeit", categoryVideo: "Video/Webcast/Podcast", categoryBlog: "Blog",
    categorySpeaker: "Speaker/Presenter", session: "Vortrag/Session", video: "Video", article: "Artikel",
    other: "Sonstiges", entryPodcast: "Podcast", entryBlog: "Blogbeitrag", entryGithub: "GitHub-Beitrag",
    noItems: "Noch keine Beiträge.", all: "Alle", detail: "Details", copy: "Kopieren", copyAll: "Alles kopieren",
    portal: "Im Portal eingetragen", portalHint: "Der Status wird nur hier gespeichert; es gibt keine Portal-Schnittstelle.",
    confirmSession: "Vortrag bestätigen und öffentlich zeigen", hideSession: "Vortrag ausblenden",
    saveDetails: "Änderungen speichern", deleteItem: "Beitrag löschen", confirmItem: "Diesen Beitrag löschen?",
    export: "Export für das MVP-Portal", from: "Von", to: "Bis", makeExport: "Export laden",
    downloadCsv: "CSV herunterladen", copyTemplate: "Kopiervorlage kopieren", copied: "Kopiert.",
    truncated: "Der Export ist auf 1.000 Beiträge begrenzt. Bitte wähle einen kürzeren Zeitraum.",
    exportEmpty: "Für diesen Zeitraum gibt es keine Beiträge.", source: "Quelle", portalDone: "Im Portal",
    portalOpen: "Offen", loading: "Lädt …", error: "Das hat nicht geklappt. Bitte versuche es erneut.",
    required: "Bitte Titel und gültiges Datum angeben.", needLink: "Bitte einen HTTPS-Link angeben.", noCategory: "Bitte eine MVP-Kategorie auswählen.",
    deleteFailed: "Löschen fehlgeschlagen.", publicHint: "Neue Beiträge sind standardmäßig privat."
  }, {
    h: "My contributions", intro: "Manage collected and manually added contributions.",
    login: "Please sign in to manage contributions.", add: "Add contribution", hand: "By hand", linkMode: "By link",
    sources: "Sources", sourceAdd: "Add source", sourceEdit: "Edit source", sourceSave: "Save source",
    sourceKind: "Source type", sourceUrl: "Profile or feed URL", sourceTitle: "Name (optional)", sourcePublic: "Make collected contributions public by default",
    youtube: "YouTube", podcast: "Podcast RSS", blog: "Blog RSS", github: "GitHub",
    active: "Active", paused: "Paused", pausedErrors: "Paused after errors",
    public: "Public", private: "Private", edit: "Edit", remove: "Delete", confirmSource: "Delete this source? Existing contributions will be kept.",
    reactivate: "Reactivate source", noSources: "No sources yet.", save: "Save", cancel: "Cancel",
    title: "Title", date: "Date", type: "Type", category: "MVP category", topics: "Topics/entities (IDs, comma-separated)",
    url: "Link (optional)", visibility: "Visibility", categoryVideo: "Video/Webcast/Podcast", categoryBlog: "Blog",
    categorySpeaker: "Speaker/Presenter", session: "Talk/session", video: "Video", article: "Article",
    other: "Other", entryPodcast: "Podcast", entryBlog: "Blog post", entryGithub: "GitHub contribution",
    noItems: "No contributions yet.", all: "All", detail: "Details", copy: "Copy", copyAll: "Copy all",
    portal: "Entered in the portal", portalHint: "This status is stored here only; there is no portal integration.",
    confirmSession: "Confirm session and show publicly", hideSession: "Hide session",
    saveDetails: "Save changes", deleteItem: "Delete contribution", confirmItem: "Delete this contribution?",
    export: "Export for the MVP portal", from: "From", to: "To", makeExport: "Load export",
    downloadCsv: "Download CSV", copyTemplate: "Copy template", copied: "Copied.",
    truncated: "The export is limited to 1,000 contributions. Choose a shorter period.",
    exportEmpty: "No contributions for this period.", source: "Source", portalDone: "In portal",
    portalOpen: "Open", loading: "Loading …", error: "Something went wrong. Please try again.",
    required: "Enter a title and valid date.", needLink: "Enter an HTTPS link.", noCategory: "Choose an MVP category.",
    deleteFailed: "Delete failed.", publicHint: "New contributions are private by default."
  });
  var CATEGORIES = [
    ["Video/Webcast/Podcast", Q.categoryVideo],
    ["Blog", Q.categoryBlog],
    ["Speaker/Presenter", Q.categorySpeaker]
  ];
  var TYPES = [
    ["podcast", Q.entryPodcast], ["video", Q.video], ["blog", Q.entryBlog],
    ["session", Q.session], ["github", Q.entryGithub], ["article", Q.article], ["other", Q.other]
  ];
  var KIND_LABELS = {
    podcast: Q.entryPodcast, video: Q.video, blog: Q.entryBlog, session: Q.session,
    github: Q.entryGithub, article: Q.article, other: Q.other
  };
  function sourceKindLabel(kind) {
    return ({ youtube: Q.youtube, podcast: Q.podcast, blog: Q.blog, github: Q.github })[kind] || kind;
  }
  var state = { items: [], sources: [], filter: "", selected: null, addMode: "", sourceEdit: null, message: "", exportData: null, exportFrom: "", exportTo: "" };
  var statusNode = null;

  function node(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") el.textContent = attrs[k];
      else if (k === "class") el.className = attrs[k];
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (child) {
      if (child != null) el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return el;
  }
  function api(path, options) {
    options = options || {};
    options.credentials = "include";
    options.headers = Object.assign({ "x-requested-with": "m365" }, options.headers || {});
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
      options.headers["content-type"] = "application/json";
    }
    return fetch(X.api + path, options).then(function (r) {
      return r.json().then(function (data) { return { status: r.status, data: data }; });
    });
  }
  function input(label, value, type, attrs) {
    var el = node("input", Object.assign({ type: type || "text", value: value || "" }, attrs || {}));
    var wrap = node("label", {}, [node("span", { text: label }), el]);
    return { wrap: wrap, control: el };
  }
  function select(label, value, values) {
    var el = node("select", {});
    values.forEach(function (item) { el.appendChild(node("option", { value: item[0], text: item[1] })); });
    el.value = value || "";
    return { wrap: node("label", {}, [node("span", { text: label }), el]), control: el };
  }
  function checkbox(label, checked) {
    var el = node("input", { type: "checkbox" });
    el.checked = !!checked;
    return { wrap: node("label", { class: "contrib-check" }, [el, " ", label]), control: el };
  }
  function button(label, fn, primary) {
    return node("button", { type: "button", class: "btn" + (primary ? " main" : ""), text: label, onclick: fn });
  }
  function field(label, value) {
    var inp = input(label, value, "text");
    inp.control.readOnly = true;
    var copyBtn = button(Q.copy, function () { copy(value); }, false);
    copyBtn.setAttribute("aria-label", Q.copy + " " + label);
    return node("div", { class: "contrib-copy" }, [inp.wrap, copyBtn]);
  }
  function setMessage(message) { state.message = message || ""; }
  function portalDone(id) { try { return localStorage.getItem("mvp-portal:" + id) === "1"; } catch (e) { return false; } }
  function setPortalDone(id, value) { try { localStorage.setItem("mvp-portal:" + id, value ? "1" : "0"); } catch (e) {} }
  function showError() { setMessage(Q.error); render(); }
  function refresh() {
    setMessage(Q.loading); render();
    return api("/api/contributions/mine").then(function (r) {
      if (r.status !== 200) { state.items = []; state.sources = []; setMessage(r.status === 401 ? Q.login : Q.error); }
      else { state.items = r.data.contributions || []; state.sources = r.data.sources || []; setMessage(""); }
      render();
    }).catch(showError);
  }
  function copy(text) {
    var value = String(text || "");
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(value).then(function () { setMessage(Q.copied); if (statusNode) statusNode.textContent = Q.copied; }).catch(function () { copyFallback(value); });
    copyFallback(value);
  }
  function copyFallback(value) {
    var area = node("textarea", { readonly: "", style: "position:fixed;inset-inline-start:-9999px" });
    area.value = value; document.body.appendChild(area); area.select();
    try { document.execCommand("copy"); setMessage(Q.copied); } catch (e) { setMessage(Q.error); }
    area.remove(); if (statusNode) statusNode.textContent = state.message;
  }
  function dateText(seconds) {
    if (!seconds) return "";
    return new Date(seconds * 1000).toISOString().slice(0, 10);
  }
  function topicsText(items) {
    return (items || []).join(", ");
  }
  function csvCell(value) {
    var s = String(value == null ? "" : value);
    if (/^\s*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function template(items) {
    return items.map(function (item) {
      return [
        Q.category + ": " + (item.category || ""),
        Q.title + ": " + (item.title || ""),
        Q.url + ": " + (item.url || "—"),
        Q.date + ": " + dateText(item.published),
        Q.type + ": " + (KIND_LABELS[item.kind] || item.kind || ""),
        Q.topics + ": " + topicsText(item.topics)
      ].join("\n");
    }).join("\n\n");
  }
  function render() {
    while (root.firstChild) root.removeChild(root.firstChild);
    var section = node("section", { class: "ccard contrib-app", dir: "auto" });
    section.appendChild(node("h2", { text: Q.h }));
    section.appendChild(node("p", { class: "cmut", text: Q.intro }));
    statusNode = node("p", { role: "status", "aria-live": "polite", class: "cmut", text: state.message });
    section.appendChild(statusNode);
    if (state.message === Q.login) { root.appendChild(section); return; }
    section.appendChild(node("p", {}, [
      button(Q.hand, function () { state.addMode = "hand"; state.selected = null; render(); }, true),
      document.createTextNode(" "),
      button(Q.linkMode, function () { state.addMode = "link"; state.selected = null; render(); }, false)
    ]));
    if (state.addMode) renderAdd(section);
    if (state.selected) renderDetail(section);
    renderList(section);
    renderSources(section);
    renderExport(section);
    root.appendChild(section);
  }
  function renderAdd(section) {
    var box = node("div", { class: "contrib-box" });
    box.appendChild(node("h3", { text: Q.add + " · " + (state.addMode === "link" ? Q.linkMode : Q.hand) }));
    var title = input(Q.title, "", "text", { maxlength: "200", required: "" });
    var date = input(Q.date, new Date().toISOString().slice(0, 10), "date", { required: "" });
    var kind = select(Q.type, "article", TYPES);
    var category = select(Q.category, "", [["", "—"], ...CATEGORIES.map(function (x) { return [x[0], x[1]]; })]);
    kind.control.addEventListener("change", function () {
      category.control.value = kind.control.value === "session" ? "Speaker/Presenter" :
        kind.control.value === "blog" || kind.control.value === "article" ? "Blog" :
          ["podcast", "video"].indexOf(kind.control.value) >= 0 ? "Video/Webcast/Podcast" : "";
    });
    var topics = input(Q.topics, "", "text");
    var link = input(Q.url, "", "url", { maxlength: "400", placeholder: "https://…", ...(state.addMode === "link" ? { required: "" } : {}) });
    var pub = checkbox(Q.public, false);
    [title.wrap, date.wrap, kind.wrap, category.wrap, topics.wrap].forEach(function (el) { box.appendChild(el); });
    if (state.addMode === "link") box.appendChild(link.wrap);
    box.appendChild(pub.wrap);
    box.appendChild(node("p", { class: "cmut", text: Q.publicHint }));
    box.appendChild(node("p", {}, [
      button(Q.save, function () {
        if (title.control.value.trim().length < 3 || !date.control.value) { setMessage(Q.required); render(); return; }
        if (state.addMode === "link" && !link.control.value) { setMessage(Q.needLink); render(); return; }
        if (!category.control.value) { setMessage(Q.noCategory); render(); return; }
        api("/api/contributions/manual", { method: "POST", body: {
          title: title.control.value, published: date.control.value, kind: kind.control.value,
          category: category.control.value, topics: topics.control.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean),
          url: state.addMode === "link" ? link.control.value : "", public: pub.control.checked
        } }).then(function (r) {
          if (r.status !== 201) { setMessage(Q.error); render(); return; }
          state.addMode = ""; setMessage(""); refresh();
        }).catch(showError);
      }, true),
      document.createTextNode(" "),
      button(Q.cancel, function () { state.addMode = ""; setMessage(""); render(); }, false)
    ]));
    section.appendChild(box);
  }
  function renderList(section) {
    var items = state.items.filter(function (it) { return !state.filter || it.category === state.filter; });
    var f = select(Q.category, state.filter, [["", Q.all], ...CATEGORIES.map(function (x) { return [x[0], x[1]]; })]);
    f.control.addEventListener("change", function () { state.filter = f.control.value; render(); });
    section.appendChild(node("div", { class: "contrib-toolbar" }, [node("h3", { text: Q.h }), f.wrap]));
    if (!items.length) { section.appendChild(node("p", { class: "cmut", text: Q.noItems })); return; }
    var list = node("ul", { class: "contrib-list" });
    items.forEach(function (it) {
      var done = portalDone(it.id);
      var item = node("li", { class: "contrib-row" });
      item.appendChild(node("div", {}, [
        node("b", { text: it.title }),
        node("div", { class: "cmut", text: (it.category || Q.category) + " · " + dateText(it.published) + (it.source ? " · " + it.source : "") }),
        node("div", { class: "cmut", text: (it.public ? Q.public : Q.private) + " · " + (done ? Q.portalDone : Q.portalOpen) })
      ]));
      item.appendChild(button(Q.detail, function () { state.selected = it; state.addMode = ""; setMessage(""); render(); }, false));
      list.appendChild(item);
    });
    section.appendChild(list);
  }
  function renderDetail(section) {
    var it = state.items.filter(function (x) { return x.id === state.selected.id; })[0];
    if (!it) { state.selected = null; return; }
    var box = node("div", { class: "contrib-box" });
    box.appendChild(node("h3", { text: it.title }));
    box.appendChild(node("p", { class: "cmut", text: (it.category || Q.category) + " · " + dateText(it.published) + (it.source ? " · " + it.source : "") }));
    box.appendChild(node("h4", { text: Q.detail }));
    if (it.kind === "session") {
      box.appendChild(node("p", {}, [
        button(Q.confirmSession, function () { setSessionVisibility(it, true); }, true),
        document.createTextNode(" "),
        button(Q.hideSession, function () { setSessionVisibility(it, false); }, false)
      ]));
    }
    var portalKey = "mvp-portal:" + it.id;
    var portal = checkbox(Q.portal, portalDone(it.id));
    portal.control.addEventListener("change", function () { setPortalDone(it.id, portal.control.checked); render(); });
    box.appendChild(portal.wrap);
    box.appendChild(node("p", { class: "cmut", text: Q.portalHint }));
    var title = field(Q.title, it.title);
    var date = field(Q.date, dateText(it.published));
    var category = select(Q.category, it.category || "", [["", "—"], ...CATEGORIES.map(function (x) { return [x[0], x[1]]; })]);
    var topics = input(Q.topics, topicsText(it.topics), "text");
    var url = field(Q.url, it.url || "");
    var pub = checkbox(Q.public, it.public);
    [title, date, category.wrap, topics.wrap, url, pub.wrap].forEach(function (el) { box.appendChild(el); });
    box.appendChild(node("p", {}, [
      button(Q.copyAll, function () {
        copy(template([Object.assign({}, it, { category: category.control.value, topics: topics.control.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean) })]));
      }, false),
      document.createTextNode(" "),
      button(Q.saveDetails, function () {
        if (!category.control.value) { setMessage(Q.noCategory); render(); return; }
        api("/api/contributions/update", { method: "POST", body: {
          id: it.id, category: category.control.value,
          topics: topics.control.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean),
          public: pub.control.checked
        } }).then(function (r) {
          if (r.status !== 200) { setMessage(Q.error); render(); return; }
          state.selected = null; setMessage(""); refresh();
        }).catch(showError);
      }, true),
      document.createTextNode(" "),
      button(Q.deleteItem, function () {
        if (!window.confirm(Q.confirmItem)) return;
        api("/api/contributions/delete", { method: "POST", body: { id: it.id } }).then(function (r) {
          if (r.status !== 200) { setMessage(Q.deleteFailed); render(); return; }
          try { localStorage.removeItem(portalKey); } catch (e) {}
          state.selected = null; setMessage(""); refresh();
        }).catch(showError);
      }, false),
      document.createTextNode(" "),
      button(Q.cancel, function () { state.selected = null; setMessage(""); render(); }, false)
    ]));
    section.appendChild(box);
  }
  function setSessionVisibility(item, isPublic) {
    api("/api/contributions/update", { method: "POST", body: { id: item.id, public: isPublic } }).then(function (r) {
      if (r.status !== 200) { setMessage(Q.error); render(); return; }
      setMessage(""); refresh();
    }).catch(showError);
  }
  function renderSources(section) {
    var box = node("div", { class: "contrib-box" });
    box.appendChild(node("h3", { text: Q.sources }));
    box.appendChild(button(Q.sourceAdd, function () { state.sourceEdit = {}; render(); }, true));
    var list = node("ul", { class: "contrib-list" });
    if (!state.sources.length) list.appendChild(node("li", { class: "cmut", text: Q.noSources }));
    state.sources.forEach(function (src) {
      var status = src.status === "paused_after_errors" ? Q.pausedErrors : src.active ? Q.active : Q.paused;
      var row = node("li", { class: "contrib-row" });
      row.appendChild(node("div", {}, [
        node("b", { text: src.title || sourceKindLabel(src.kind) }),
        node("div", { class: "cmut", text: sourceKindLabel(src.kind) + " · " + status + " · " + (src.public ? Q.public : Q.private) }),
        node("div", { class: "cmut", text: src.url })
      ]));
      row.appendChild(node("div", {}, [
        button(Q.edit, function () { state.sourceEdit = src; render(); }, false),
        button(src.status === "paused_after_errors" ? Q.reactivate : src.active ? Q.paused : Q.reactivate, function () {
          var active = !src.active || src.status === "paused_after_errors";
          api("/api/contributions/source/update", { method: "POST", body: { id: src.id, active: active } }).then(function (r) { if (r.status === 200) refresh(); else showError(); }).catch(showError);
        }, false),
        button(src.public ? Q.private : Q.public, function () {
          api("/api/contributions/source/update", { method: "POST", body: { id: src.id, public: !src.public } }).then(function (r) { if (r.status === 200) refresh(); else showError(); }).catch(showError);
        }, false),
        button(Q.remove, function () {
          if (!window.confirm(Q.confirmSource)) return;
          api("/api/contributions/source/delete", { method: "POST", body: { id: src.id } }).then(function (r) { if (r.status === 200) refresh(); else showError(); }).catch(showError);
        }, false)
      ]));
      list.appendChild(row);
    });
    box.appendChild(list);
    if (state.sourceEdit) renderSourceForm(box);
    section.appendChild(box);
  }
  function renderSourceForm(box) {
    var src = state.sourceEdit, editing = !!src.id;
    var form = node("div", { class: "contrib-box" });
    form.appendChild(node("h4", { text: editing ? Q.sourceEdit : Q.sourceAdd }));
    var kind = select(Q.sourceKind, src.kind || "youtube", [["youtube", Q.youtube], ["podcast", Q.podcast], ["blog", Q.blog], ["github", Q.github]]);
    var url = input(Q.sourceUrl, src.url || "", "url", { maxlength: "400", placeholder: "https://…" });
    var title = input(Q.sourceTitle, src.title || "", "text", { maxlength: "100" });
    var pub = checkbox(Q.sourcePublic, !!src.public);
    [kind.wrap, url.wrap, title.wrap, pub.wrap].forEach(function (el) { form.appendChild(el); });
    form.appendChild(node("p", {}, [
      button(Q.sourceSave, function () {
        if (!url.control.value) { setMessage(Q.error); render(); return; }
        var body = { kind: kind.control.value, url: url.control.value, title: title.control.value, public: pub.control.checked };
        var path = editing ? "/api/contributions/source/update" : "/api/contributions/source";
        if (editing) body.id = src.id;
        api(path, { method: "POST", body: body }).then(function (r) {
          if (r.status !== (editing ? 200 : 201)) { setMessage(Q.error); render(); return; }
          state.sourceEdit = null; setMessage(""); refresh();
        }).catch(showError);
      }, true),
      document.createTextNode(" "),
      button(Q.cancel, function () { state.sourceEdit = null; render(); }, false)
    ]));
    box.appendChild(form);
  }
  function renderExport(section) {
    var box = node("div", { class: "contrib-box" });
    box.appendChild(node("h3", { text: Q.export }));
    var from = input(Q.from, state.exportFrom, "date"), to = input(Q.to, state.exportTo, "date");
    var category = select(Q.category, state.exportData ? state.exportData.category : "", [["", Q.all], ...CATEGORIES.map(function (x) { return [x[0], x[1]]; })]);
    [from.wrap, to.wrap, category.wrap].forEach(function (el) { box.appendChild(el); });
    box.appendChild(button(Q.makeExport, function () {
      state.exportFrom = from.control.value; state.exportTo = to.control.value;
      var params = new URLSearchParams();
      if (from.control.value) params.set("from", from.control.value);
      if (to.control.value) params.set("to", to.control.value);
      api("/api/contributions/export" + (params.toString() ? "?" + params.toString() : "")).then(function (r) {
        if (r.status !== 200) { setMessage(Q.error); render(); return; }
        state.exportData = { items: r.data.items || [], category: category.control.value, truncated: !!r.data.truncated };
        setMessage(""); render();
      }).catch(showError);
    }, true));
    if (state.exportData) {
      var items = state.exportData.items.filter(function (it) { return !state.exportData.category || it.category === state.exportData.category; });
      if (!items.length) box.appendChild(node("p", { class: "cmut", text: Q.exportEmpty }));
      else {
        if (state.exportData.truncated) box.appendChild(node("p", { class: "cmut", text: Q.truncated }));
        var columns = ["title", "url", "published", "kind", "category", "topics", "views", "downloads"];
        var csv = [columns.map(csvCell).join(",")].concat(items.map(function (it) {
          return [it.title, it.url, dateText(it.published), it.kind, it.category, topicsText(it.topics), it.views, it.downloads].map(csvCell).join(",");
        })).join("\r\n");
        box.appendChild(node("p", {}, [
          button(Q.downloadCsv, function () {
            var blob = new Blob([csv], { type: "text/csv;charset=utf-8" }), url = URL.createObjectURL(blob), a = node("a", { href: url, download: "mvp-beitraege.csv" });
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
          }, false),
          document.createTextNode(" "),
          button(Q.copyTemplate, function () { copy(template(items)); }, false)
        ]));
        box.appendChild(node("p", { class: "cmut", text: items.length + " / " + state.exportData.items.length }));
      }
    }
    section.appendChild(box);
  }

  var style = node("style", { text: ".contrib-app{display:grid;gap:.8em}.contrib-app label:not(.contrib-check){display:grid;gap:.25em;margin:.45em 0;min-width:0}.contrib-app input:not([type=checkbox]),.contrib-app select{box-sizing:border-box;max-width:100%;min-height:2.6rem;padding:.45em;border:1px solid var(--bd);background:var(--card);color:var(--fg);font:inherit}.contrib-check{display:block;margin:.5em 0}.contrib-box{border:1px solid var(--bd);border-radius:.5em;padding:.8em;margin:.6em 0;background:var(--card)}.contrib-list{list-style:none;padding:0}.contrib-row{display:flex;justify-content:space-between;align-items:center;gap:.8em;padding:.7em 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}.contrib-row>div:first-child{min-width:0;overflow-wrap:anywhere}.contrib-toolbar{display:flex;justify-content:space-between;align-items:center;gap:.8em;flex-wrap:wrap}.contrib-copy{display:flex;align-items:end;gap:.5em;flex-wrap:wrap}.contrib-copy label{flex:1}.contrib-copy button{margin-bottom:.45em}.contrib-app button{margin:.15em;min-height:2.5rem}.contrib-app [dir=rtl] .contrib-row{flex-direction:row-reverse}@media(max-width:40em){.contrib-row{align-items:flex-start}.contrib-row>div:last-child{display:flex;flex-wrap:wrap}}", type: "text/css" });
  document.head.appendChild(style);
  refresh();
})();
