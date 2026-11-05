/* MVP-Tracker (#231, Klickdummy design/mvp-tracker/): Beitraege sammeln, fuers MVP-Portal vorbereiten, Wirkung je Zeitraum, Export, Quellen.
   Laeuft als Reiter im Profil (#c-mvp) und als eigene App "M365.FM Contributor" (#mvp-app, /community/contributor/, PWA).
   Daten nur ueber /api/contributions/* (Sitzung + x-requested-with). Texte aus assets/cm-<sprache>.js (window.M365CT, Schluessel mvp_*), nur per textContent.
   Status "im Portal" wird hier gefuehrt - es gibt keine Portal-Schnittstelle, nichts wird an Microsoft gesendet. */
(function () {
  "use strict";
  var X = window.M365X, host = document.getElementById("mvp-app") || document.getElementById("c-mvp");
  if (!X || !X.api || !host) return;
  var APP = host.id === "mvp-app", HP = APP ? "" : "c-mvp/", LANG = X.lang || "en";
  var T = window.M365CT || {};
  var VIEWS = ["overview", "log", "add", "impact", "export", "sources", "chances"];
  var KINDS = ["podcast", "video", "blog", "session", "github", "article", "book", "workshop", "mentoring", "other"];
  var SKINDS = ["youtube", "podcast", "blog", "github"];
  var CATS = ["Video/Webcast/Podcast", "Blog", "Speaker/Presenter", "Book/E-book"];
  var ROLES = { "Video": ["Host", "Presenter", "Speaker"], "Blog": ["Author", "Co-Author", "Contributor"], "Speaking (Conference)": ["Speaker", "Panelist", "Moderator", "Presenter"], "Book/E-book": ["Author", "Co-Author", "Contributor"] };
  var AUD = ["Developer", "Technical Decision Maker", "Business Decision Maker", "Student", "IT Pro", "End User"];
  var FORMATS = ["In-Person", "Virtual", "Hybrid"];
  var S = { data: null, loadErr: "", view: "overview", id: 0, filter: "open", cat: "", addMode: "link", draft: null, saved: 0, period: "mvp", year: 0, exp: null, srcEdit: 0, srcDel: 0, delAsk: false, msg: "", msgOk: false };
  var main, nav, live, uid = 0;

  function t(k, v) { var s = T["mvp_" + k]; if (s === undefined) s = k; Object.keys(v || {}).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); }); return s; }
  function el(tag, a, kids) {
    var e = document.createElement(tag);
    Object.keys(a || {}).forEach(function (k) {
      var v = a[k]; if (v === null || v === undefined || v === false) return;
      if (k === "text") e.textContent = v; else if (k === "class") e.className = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (k === "value") e.value = v; else if (k === "checked") e.checked = !!v;
      else e.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) { if (c !== null && c !== undefined && c !== false) e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); });
    return e;
  }
  function nid(p) { uid += 1; return "mvp-" + p + "-" + uid; }
  function api(path, body) {
    var o = { method: body ? "POST" : "GET", credentials: "include", headers: { "x-requested-with": "m365" } };
    if (body) { o.headers["content-type"] = "application/json"; o.body = JSON.stringify(body); }
    return fetch(X.api + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j || {} }; });
    }).catch(function () { return { s: 0, j: { error: navigator.onLine === false ? "offline" : "network" } }; });
  }
  function errText(j) {
    var e = (j && j.error) || "";
    var map = { offline: "offline", rate_limit: "e_rate", contribution_exists: "e_exists", bad_date: "e_date", bad_url: "e_url", bad_contribution: "e_title", bad_field: "e_field",
      source_exists: "s_exists", source_limit: "s_limit", bad_source: "s_bad", login: "login" };
    return map[e] ? t(map[e]) : t("error");
  }
  function say(text, ok) { S.msg = text || ""; S.msgOk = !!ok; if (live) { live.textContent = S.msg; live.className = "mvp-msg" + (S.msg ? (ok ? " ok" : " err") : ""); } }
  function day(sec) { return new Date(sec * 1000).toISOString().slice(0, 10); }
  function fmtDate(sec) { try { return new Intl.DateTimeFormat(LANG, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(sec * 1000)); } catch (e) { return day(sec); } }
  function num(n) { try { return Number(n || 0).toLocaleString(LANG); } catch (e) { return String(n || 0); } }
  function kindLabel(k) { return t("k_" + k); }
  function copyText(text, btn) {
    var done = function () { if (btn) { btn.textContent = t("d_copied"); btn.classList.add("on"); } say(t("d_copied"), true); };
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(String(text)).then(done, function () { fallback(); });
    fallback();
    function fallback() {
      var a = el("textarea", { readonly: true, class: "mvp-offscreen", "aria-hidden": "true" }); a.value = String(text); document.body.appendChild(a); a.select();
      try { document.execCommand("copy"); done(); } catch (e) { say(t("error")); } a.remove();
    }
  }
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type })), a = el("a", { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---------- Daten ----------
  function items() { return (S.data && S.data.contributions) || []; }
  function active() { return items().filter(function (c) { return !c.review; }); }
  function byId(id) { return items().filter(function (c) { return c.id === id; })[0]; }
  function load(after) {
    return api("/api/contributions/mine").then(function (r) {
      if (r.s === 200) { S.data = r.j; S.loadErr = ""; } else { S.data = null; S.loadErr = r.s === 401 ? "login" : (r.j.error === "offline" ? "offline" : "error"); }
      render(); if (after) after();
    });
  }
  function patch(body, okText) {
    return api("/api/contributions/update", body).then(function (r) {
      if (r.s !== 200) { say(errText(r.j)); return false; }
      return load(function () { say(okText || t("saved"), true); }).then(function () { return true; });
    });
  }
  // MVP-Jahr: 1. April bis 31. März (Beitragszeitraum der MVP-Verlaengerung); Kalenderjahr als Alternative
  function mvpYearOf(sec) { var d = new Date(sec * 1000); return d.getUTCMonth() >= 3 ? d.getUTCFullYear() : d.getUTCFullYear() - 1; }
  function periodOf(kind, y) {
    var s = kind === "mvp" ? Date.UTC(y, 3, 1) : Date.UTC(y, 0, 1), e = kind === "mvp" ? Date.UTC(y + 1, 3, 1) : Date.UTC(y + 1, 0, 1);
    return { start: s / 1000, end: e / 1000 - 1, from: new Date(s).toISOString().slice(0, 10), to: new Date(e - 86400000).toISOString().slice(0, 10), label: kind === "mvp" ? y + "/" + String(y + 1).slice(2) : String(y) };
  }
  function nowSec() { return Math.floor(Date.now() / 1000); }

  // ---------- Navigation ----------
  function go(view, id) {
    var h = "#" + HP + view + (id ? "/" + id : "");
    if (location.hash !== h) location.hash = h; else route(true);
  }
  function route(focus) {
    var h = (location.hash || "").slice(1);
    if (!APP) { if (h.indexOf("c-mvp") !== 0) return; h = h.slice(6); }
    var p = h.split("/"), v = p[0] === "item" ? "log" : p[0];
    S.view = VIEWS.indexOf(v) >= 0 ? v : "overview"; S.id = p[0] === "item" ? (+p[1] || 0) : 0;
    S.delAsk = false; if (S.view !== "add") S.saved = 0; say("");
    render(focus !== false);
  }
  function navBar() {
    var n = el("nav", { class: "mvp-nav", "aria-label": t("nav_label") });
    VIEWS.forEach(function (v) {
      var cur = S.view === v && !(v === "log" && S.id);
      var a = el("a", { href: "#" + HP + v, class: "mvp-navi" + (v === "add" ? " add" : ""), "aria-current": cur ? "page" : null, text: t("nav_" + v) });
      n.appendChild(a);
    });
    return n;
  }

  // ---------- Bausteine ----------
  function heading(text) { return el("h2", { class: "mvp-h", tabindex: "-1", text: text }); }
  function badge(kind, text) { return el("span", { class: "mvp-badge " + kind, text: text }); }
  function btn(text, fn, cls, extra) { return el("button", Object.assign({ type: "button", class: "btn" + (cls ? " " + cls : ""), text: text, onclick: fn }, extra || {})); }
  function field(label, control, hint) {
    var id = control.id || (control.id = nid("f")), kids = [el("label", { for: id, text: label }), control];
    if (hint) { var hid = nid("h"); kids.push(el("small", { id: hid, class: "mvp-hint", text: hint })); control.setAttribute("aria-describedby", hid); }
    return el("div", { class: "mvp-field" }, kids);
  }
  function input(type, value, a) { return el("input", Object.assign({ type: type, value: value === undefined || value === null ? "" : value }, a || {})); }
  function select(opts, value, a) {
    var s = el("select", a || {});
    opts.forEach(function (o) { s.appendChild(el("option", { value: o[0], text: o[1] })); }); s.value = value || ""; return s;
  }
  function check(label, checked, onchange) {
    var c = input("checkbox", "", { checked: checked, onchange: onchange });
    return el("label", { class: "mvp-check" }, [c, el("span", { text: label })]);
  }
  function segmented(label, opts, cur, pick) {
    var g = el("div", { class: "mvp-seg", role: "group", "aria-label": label });
    opts.forEach(function (o) { g.appendChild(el("button", { type: "button", "aria-pressed": o[0] === cur ? "true" : "false", text: o[1], onclick: function () { pick(o[0]); } })); });
    return g;
  }
  function stat(n, label) { return el("div", { class: "mvp-stat" }, [el("b", { text: num(n) }), el("span", { text: label })]); }

  // ---------- Uebersicht (Main) ----------
  function viewOverview() {
    var a = active(), open = a.filter(function (c) { return !c.portal; }), pend = items().filter(function (c) { return c.review === "pending"; });
    var d = new Date(), m0 = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / 1000;
    var month = a.filter(function (c) { return c.published >= m0; }).length;
    var pr = periodOf("mvp", mvpYearOf(nowSec())), inYear = a.filter(function (c) { return c.published >= pr.start && c.published <= pr.end; });
    var srcs = (S.data.sources || []), bad = srcs.filter(function (s) { return s.status === "paused_after_errors"; }).length;
    var out = [heading(t("nav_overview")), el("p", { class: "mvp-mut", text: t("intro") })];
    out.push(el("div", { class: "mvp-card mvp-lead" + (open.length ? " warn" : "") }, [
      el("b", { class: "mvp-big", text: open.length ? t("ov_open", { n: num(open.length) }) : t("ov_none_open") }),
      open.length ? btn(t("ov_open_btn"), function () { S.filter = "open"; go("log"); }, "main") : null]));
    if (pend.length) out.push(el("div", { class: "mvp-card" }, [el("b", { text: t("ov_review", { n: num(pend.length) }) }), btn(t("ov_review_btn"), function () { S.filter = "review"; go("log"); })]));
    out.push(el("div", { class: "mvp-stats" }, [stat(month, t("ov_month")), stat(inYear.length, t("ov_year", { y: pr.label })), stat(inYear.filter(function (c) { return c.portal; }).length, t("im_portal"))]));
    if (bad) out.push(el("div", { class: "mvp-card warn" }, [el("b", { text: t("ov_errors", { n: num(bad) }) }), btn(t("ov_sources_btn"), function () { go("sources"); })]));
    if (!srcs.length) out.push(el("div", { class: "mvp-card" }, [el("p", { text: t("ov_nosrc") }), btn(t("s_add"), function () { go("sources"); }, "main")]));
    return out;
  }

  // ---------- Beitraege (Contributions) ----------
  function statusOf(c) { return c.review === "pending" ? ["pending", t("st_pending")] : c.review === "hidden" ? ["hidden", t("st_hidden")] : c.portal ? ["ok", t("st_entered")] : ["warn", t("st_open")]; }
  function viewLog() {
    if (S.id) return viewDetail(byId(S.id));
    var all = items(), act = active();
    var groups = { open: act.filter(function (c) { return !c.portal; }), entered: act.filter(function (c) { return c.portal; }), all: act,
      review: all.filter(function (c) { return c.review === "pending"; }), hidden: all.filter(function (c) { return c.review === "hidden"; }) };
    if ((S.filter === "review" || S.filter === "hidden") && !groups[S.filter].length) S.filter = "open";
    var opts = [["open", t("f_open") + " · " + groups.open.length], ["entered", t("f_entered") + " · " + groups.entered.length], ["all", t("f_all") + " · " + groups.all.length]];
    if (groups.review.length) opts.push(["review", t("f_review") + " · " + groups.review.length]);
    if (groups.hidden.length) opts.push(["hidden", t("f_hidden") + " · " + groups.hidden.length]);
    var list = groups[S.filter].filter(function (c) { return !S.cat || (S.cat === "none" ? !c.category : c.category === S.cat); });
    var cat = select([["", t("cat_all")]].concat(CATS.map(function (c) { return [c, c]; })).concat([["none", t("cat_none")]]), S.cat, { onchange: function () { S.cat = this.value; render(); } });
    var ul = el("ul", { class: "mvp-list" });
    list.forEach(function (c) {
      var st = statusOf(c);
      ul.appendChild(el("li", { class: "mvp-item" }, [
        el("div", { class: "mvp-row" }, [el("span", { class: "mvp-kicker", text: kindLabel(c.kind) + " · " + fmtDate(c.published) }), badge(st[0], st[1])]),
        el("a", { class: "mvp-title", href: "#" + HP + "item/" + c.id, text: c.title }),
        el("div", { class: "mvp-row sub" }, [el("span", { class: "mvp-mut", text: c.manual ? t("src_hand") : t("src_auto", { s: c.source || (c.url ? hostOf(c.url) : "") }) }),
          c.category ? el("span", { class: "mvp-chip", text: c.category }) : null, el("span", { class: "mvp-chip", text: c.public ? t("vis_public") : t("vis_private") })]),
        c.review === "pending" ? el("div", { class: "btns" }, [btn(t("confirm"), function () { patch({ id: c.id, review: "" }); }, "main"), btn(t("hide"), function () { patch({ id: c.id, review: "hidden" }); })]) : null,
        c.review === "hidden" ? el("div", { class: "btns" }, [btn(t("unhide"), function () { patch({ id: c.id, review: "" }); })]) : null,
      ]));
    });
    return [heading(t("nav_log")), el("div", { class: "mvp-tools" }, [segmented(t("f_label"), opts, S.filter, function (k) { S.filter = k; render(); }), field(t("cat_label"), cat)]),
      list.length ? ul : el("p", { class: "mvp-empty", text: t("empty") })];
  }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }

  // ---------- Detail (Contribution-Detail) ----------
  function issueText(i) {
    if (!i) return "";
    if (i.code === "too_long") return t("i_too_long", { l: num(i.length), m: num(i.limit) });
    if (i.code === "too_short") return t("i_too_short", { m: num(i.limit) });
    if (i.code === "not_https") return t("i_not_https");
    return t("i_missing");
  }
  function viewDetail(c) {
    if (!c) return [heading(t("nav_log")), el("p", { text: t("empty") }), btn(t("back"), function () { go("log"); })];
    var out = [btn(t("back"), function () { go("log"); }, "mvp-back"), el("span", { class: "mvp-kicker", text: kindLabel(c.kind) + " · " + (c.manual ? t("src_hand") : t("src_auto", { s: c.source || hostOf(c.url) })) }), heading(c.title)];
    if (c.review === "pending") out.push(el("div", { class: "mvp-card warn" }, [el("p", { text: t("pending_hint") }), el("div", { class: "btns" }, [btn(t("confirm"), function () { patch({ id: c.id, review: "" }); }, "main"), btn(t("hide"), function () { patch({ id: c.id, review: "hidden" }); })])]));
    if (c.review === "hidden") out.push(el("div", { class: "mvp-card" }, [badge("hidden", t("st_hidden")), btn(t("unhide"), function () { patch({ id: c.id, review: "" }); })]));
    out.push(portalBox(c), editForm(c));
    return out;
  }
  function portalBox(c) {
    var box = el("section", { class: "mvp-card mvp-portal", "aria-labelledby": "mvp-portal-h" }, [el("h3", { id: "mvp-portal-h", text: t("d_ready") })]);
    if (!c.mvp) { box.appendChild(el("p", { class: "mvp-mut", text: t("d_notype") })); return box; }
    var a = c.mvp.activity, issues = {}; (c.mvp.issues || []).forEach(function (i) { issues[i.field] = i; });
    var rows = [["activityTypeName", t("fld_type"), a.activityTypeName], ["title", t("fld_title"), a.title], ["date", t("fld_date"), a.date], ["url", t("fld_url"), a.url],
      ["description", t("fld_desc"), a.description], ["role", t("fld_role"), a.role], ["targetAudience", t("fld_audience"), (a.targetAudience || []).join(", ")], ["technologyFocusArea", t("fld_area"), a.technologyFocusArea]];
    if (a.numberOfViews !== undefined) rows.push(["numberOfViews", t("fld_views"), String(a.numberOfViews)]);
    if (a.liveStreamViews !== undefined) rows.push(["liveStreamViews", t("fld_live"), String(a.liveStreamViews)]);
    if (a.onDemandViews !== undefined) rows.push(["onDemandViews", t("fld_ondemand"), String(a.onDemandViews)]);
    if (a.inPersonAttendees !== undefined) rows.push(["inPersonAttendees", t("fld_attendees"), String(a.inPersonAttendees)]);
    if (a.numberOfSessions !== undefined) rows.push(["numberOfSessions", t("fld_sessions"), String(a.numberOfSessions)]);
    var dl = el("dl", { class: "mvp-fields" });
    rows.forEach(function (r) {
      var iss = issues[r[0]], b = btn(t("d_copy"), function () { copyText(r[2], b); }, "mvp-copy", { "aria-label": t("d_copy_label", { f: r[1] }), disabled: r[2] === "" ? true : null });
      dl.appendChild(el("div", { class: "mvp-frow" + (iss ? " bad" : "") }, [el("dt", { text: r[1] }),
        el("dd", {}, [el("span", { class: "mvp-val", text: r[2] || "—" }), iss ? el("small", { class: "mvp-issue", text: issueText(iss) }) : null]), b]));
    });
    var all = btn(t("d_copy_all"), function () { copyText(rows.map(function (r) { return r[1] + ": " + r[2]; }).join("\n"), all); });
    var openLeft = active().filter(function (x) { return !x.portal && x.id !== c.id; }).length;
    var tick = check(t("d_entered"), c.portal, function () { patch({ id: c.id, portal: this.checked }, this.checked ? t("d_entered_done", { n: num(openLeft) }) : t("saved")); });
    box.appendChild(dl);
    box.appendChild(el("div", { class: "btns" }, [all, el("a", { class: "btn", href: (S.data.options && S.data.options.portal) || "https://mvp.microsoft.com/", target: "_blank", rel: "noopener", text: t("d_open_portal") })]));
    box.appendChild(el("div", { class: "mvp-tick" + (c.portal ? " done" : "") }, [tick, el("small", { class: "mvp-hint", text: c.portal ? t("d_entered_done", { n: num(openLeft) }) : t("d_entered_hint") })]));
    return box;
  }
  function editForm(c) {
    var f = el("form", { class: "mvp-card mvp-form", novalidate: true }), body = {};
    f.appendChild(el("h3", { text: t("edit_h") }));
    var title = input("text", c.title, { maxlength: "200", required: true }), kind = select(KINDS.map(function (k) { return [k, kindLabel(k)]; }), c.kind),
      date = input("date", day(c.published), { required: true }), url = input("url", c.url, { inputmode: "url", placeholder: "https://" });
    if (c.manual) { f.appendChild(field(t("fld_title"), title)); f.appendChild(el("div", { class: "mvp-grid" }, [field(t("fld_kind"), kind), field(t("fld_date"), date)])); f.appendChild(field(t("fld_url"), url)); }
    else f.appendChild(el("p", { class: "mvp-mut", text: t("manual_only") }));
    var cat = select([["", t("cat_none")]].concat(CATS.map(function (x) { return [x, x]; })), c.category);
    f.appendChild(field(t("fld_category"), cat));
    var desc = el("textarea", { rows: "5", maxlength: "2000", value: c.description }), cnt = t("desc_hint", { n: num(c.description.length) });
    var dfield = field(t("fld_desc"), desc, cnt), dh = dfield.querySelector("small");
    desc.addEventListener("input", function () { dh.textContent = t("desc_hint", { n: num(desc.value.length) }); dh.classList.toggle("bad", desc.value.length > 1000); });
    f.appendChild(dfield);
    var type = c.mvp ? c.mvp.type : "", roles = ROLES[type] || [];
    var role = select([["", "—"]].concat(roles.map(function (r) { return [r, r]; })), c.mvp ? c.mvp.activity.role : c.role);
    var area = input("text", c.area, { maxlength: "100" });
    if (roles.length) f.appendChild(el("div", { class: "mvp-grid" }, [field(t("fld_role"), role), field(t("fld_area"), area, t("area_hint"))]));
    else f.appendChild(field(t("fld_area"), area, t("area_hint")));
    var fs = el("fieldset", { class: "mvp-aud" }, [el("legend", { text: t("fld_audience") })]), boxes = {};
    AUD.forEach(function (a) { var l = check(a, c.audience.indexOf(a) >= 0); boxes[a] = l.querySelector("input"); fs.appendChild(l); });
    f.appendChild(fs);
    var nums = {}, numField = function (k, label, v) { nums[k] = input("number", v, { min: "0", step: "1", inputmode: "numeric" }); return field(label, nums[k]); };
    var grid = el("div", { class: "mvp-grid" });
    if (type === "Blog" || c.manual) grid.appendChild(numField("views", t("fld_views"), c.views));
    if (type === "Video" || type === "Speaking (Conference)") grid.appendChild(numField("live_views", t("fld_live"), c.live_views));
    if (type === "Speaking (Conference)" || c.kind === "workshop" || c.kind === "mentoring") grid.appendChild(numField("attendees", t("fld_attendees"), c.attendees));
    if (type === "Video" || type === "Speaking (Conference)") grid.appendChild(numField("sessions", t("fld_sessions"), c.sessions || 1));
    if (grid.childNodes.length) f.appendChild(grid);
    var more = el("details", { class: "mvp-more" }, [el("summary", { text: t("fld_more") })]);
    var fmt = select([["", "—"]].concat(FORMATS.map(function (x) { return [x, x]; })), c.event_format), country = input("text", c.country, { maxlength: "60", autocomplete: "country-name" });
    more.appendChild(el("div", { class: "mvp-grid" }, [field(t("fld_format"), fmt), field(t("fld_country"), country)]));
    if (!nums.attendees) more.appendChild(numField("attendees", t("fld_attendees"), c.attendees));
    f.appendChild(more);
    var topics = input("text", (c.topics || []).join(", "), { maxlength: "500" });
    f.appendChild(field(t("fld_topics"), topics));
    var pub = check(t("fld_public"), c.public);
    f.appendChild(pub);
    var del = el("div", { class: "mvp-del" });
    function renderDel() {
      del.textContent = "";
      if (!S.delAsk) del.appendChild(btn(t("delete"), function () { S.delAsk = true; renderDel(); del.querySelector("button").focus(); }, "danger"));
      else del.appendChild(el("div", { class: "mvp-confirm", role: "alert" }, [el("p", { text: t("del_confirm") }), btn(t("del_yes"), function () {
        api("/api/contributions/delete", { id: c.id }).then(function (r) { if (r.s === 200) { S.delAsk = false; load(function () { go("log"); say(t("saved"), true); }); } else say(errText(r.j)); });
      }, "danger"), btn(t("cancel"), function () { S.delAsk = false; renderDel(); })]));
    }
    renderDel();
    f.appendChild(el("div", { class: "btns" }, [el("button", { type: "submit", class: "btn main", text: t("save") })]));
    f.appendChild(del);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      body = { id: c.id, category: cat.value, description: desc.value, area: area.value, public: pub.querySelector("input").checked,
        audience: AUD.filter(function (a) { return boxes[a].checked; }), event_format: fmt.value, country: country.value,
        topics: topics.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean) };
      if (roles.length) body.role = role.value;
      Object.keys(nums).forEach(function (k) { if (nums[k].value !== "") body[k] = Math.max(0, Math.floor(+nums[k].value) || 0); });
      if (c.manual) {
        if (title.value.trim().length < 3) return invalid(title, t("e_title"));
        if (!date.value) return invalid(date, t("e_date"));
        if (url.value && !/^https:\/\//i.test(url.value.trim())) return invalid(url, t("e_url"));
        body.title = title.value.trim(); body.kind = kind.value; body.published = date.value; body.url = url.value.trim();
      }
      patch(body);
    });
    return f;
  }
  function invalid(ctrl, text) { ctrl.setAttribute("aria-invalid", "true"); say(text); ctrl.focus(); ctrl.addEventListener("input", function () { ctrl.removeAttribute("aria-invalid"); }, { once: true }); return false; }

  // ---------- Erfassen (Add) ----------
  function viewAdd() {
    if (S.saved) {
      var id = S.saved, c = byId(id);
      return [heading(t("a_saved")), el("div", { class: "mvp-card ok" }, [el("b", { class: "mvp-big", text: c ? c.title : "" }), el("p", { class: "mvp-mut", text: t("a_private") }),
        el("div", { class: "btns" }, [btn(t("a_now"), function () { S.saved = 0; go("item", id); }, "main"), btn(t("a_later"), function () { S.saved = 0; S.draft = null; go("log"); })])])];
    }
    var d = S.draft || (S.draft = { title: "", kind: "blog", published: new Date().toISOString().slice(0, 10), url: "", category: "", description: "", read: "" });
    var out = [heading(t("nav_add")), segmented(t("a_mode"), [["link", t("a_link")], ["hand", t("a_hand")]], S.addMode, function (m) { S.addMode = m; render(); })];
    var f = el("form", { class: "mvp-card mvp-form", novalidate: true });
    var url = input("url", d.url, { inputmode: "url", placeholder: "https://", autocomplete: "url" });
    if (S.addMode === "link") {
      var read = btn(t("a_read"), function () {
        if (!/^https:\/\//i.test(url.value.trim())) return invalid(url, t("e_url"));
        read.disabled = true; say(t("a_reading"), true);
        api("/api/contributions/preview?url=" + encodeURIComponent(url.value.trim())).then(function (r) {
          read.disabled = false;
          if (r.s !== 200) return say(errText(r.j));
          var p = r.j.preview || {};
          d.url = p.url || url.value.trim(); d.title = p.title || d.title; d.published = p.published || d.published; d.kind = p.kind || d.kind; d.description = p.description || d.description;
          d.read = p.title ? "ok" : "fail"; render(false); say(p.title ? t("a_read_ok") : t("a_read_fail"), !!p.title);
          var first = main.querySelector("input[name=title]"); if (first) first.focus();
        });
      });
      f.appendChild(el("div", { class: "mvp-inline" }, [field(t("a_url"), url), read]));
      if (d.read) f.appendChild(el("p", { class: "mvp-hint " + (d.read === "ok" ? "ok" : "bad"), text: d.read === "ok" ? t("a_read_ok") : t("a_read_fail") }));
    }
    var title = input("text", d.title, { name: "title", maxlength: "200", required: true });
    var kind = select(KINDS.map(function (k) { return [k, kindLabel(k)]; }), d.kind);
    var date = input("date", d.published, { required: true });
    var cat = select([["", t("cat_none")]].concat(CATS.map(function (x) { return [x, x]; })), d.category);
    var desc = el("textarea", { rows: "4", maxlength: "2000", value: d.description });
    var pub = check(t("fld_public"), false);
    f.appendChild(field(t("fld_title"), title));
    f.appendChild(el("div", { class: "mvp-grid" }, [field(t("fld_kind"), kind), field(t("fld_date"), date)]));
    if (S.addMode === "hand") f.appendChild(field(t("fld_url"), url));
    f.appendChild(field(t("fld_category"), cat));
    f.appendChild(field(t("fld_desc"), desc));
    f.appendChild(pub);
    f.appendChild(el("p", { class: "mvp-hint", text: t("a_private") }));
    f.appendChild(el("div", { class: "btns" }, [el("button", { type: "submit", class: "btn main", text: t("a_save") })]));
    [title, kind, date, cat, desc, url].forEach(function (x) { x.addEventListener("change", sync); });
    function sync() { d.title = title.value; d.kind = kind.value; d.published = date.value; d.category = cat.value; d.description = desc.value; d.url = url.value; }
    f.addEventListener("submit", function (ev) {
      ev.preventDefault(); sync();
      if (d.title.trim().length < 3) return invalid(title, t("e_title"));
      if (!d.published) return invalid(date, t("e_date"));
      if (d.url && !/^https:\/\//i.test(d.url.trim())) return invalid(url, t("e_url"));
      var body = { title: d.title.trim(), kind: d.kind, published: d.published, url: d.url.trim() || undefined, public: pub.querySelector("input").checked };
      if (d.category) body.category = d.category;
      if (d.description) body.description = d.description;
      api("/api/contributions/manual", body).then(function (r) {
        if (r.s !== 201) return say(errText(r.j));
        S.saved = r.j.id; S.draft = null; load(function () { say(t("saved"), true); var h = main.querySelector(".mvp-h"); if (h) h.focus(); });
      });
    });
    out.push(f);
    return out;
  }

  // ---------- Wirkung (Impact) ----------
  function viewImpact() {
    var a = active(), cur = mvpYearOf(nowSec());
    if (S.period === "cal" && !S.year) S.year = new Date().getUTCFullYear();
    if (!S.year) S.year = cur;
    var years = {}, yOf = S.period === "mvp" ? mvpYearOf : function (s) { return new Date(s * 1000).getUTCFullYear(); };
    years[S.period === "mvp" ? cur : new Date().getUTCFullYear()] = 1; a.forEach(function (c) { years[yOf(c.published)] = 1; });
    var ys = Object.keys(years).map(Number).sort(function (x, y) { return y - x; }).slice(0, 8);
    if (ys.indexOf(S.year) < 0) S.year = ys[0];
    var p = periodOf(S.period, S.year), inP = a.filter(function (c) { return c.published >= p.start && c.published <= p.end; });
    var kindSel = select([["mvp", t("im_mvp")], ["cal", t("im_cal")]], S.period, { onchange: function () { S.period = this.value; S.year = 0; render(false); } });
    var yearSel = select(ys.map(function (y) { return [String(y), periodOf(S.period, y).label]; }), String(S.year), { onchange: function () { S.year = +this.value; render(false); } });
    var out = [heading(t("nav_impact")), el("div", { class: "mvp-tools" }, [field(t("im_period"), kindSel), field(t("im_year"), yearSel)])];
    if (!inP.length) { out.push(el("p", { class: "mvp-empty", text: t("im_none") })); return out; }
    var sum = function (k) { return inP.reduce(function (s, c) { return s + (+c[k] || 0); }, 0); };
    var stats = [stat(inP.length, t("im_total")), stat(inP.filter(function (c) { return c.portal; }).length, t("im_portal"))];
    if (sum("views")) stats.push(stat(sum("views"), t("im_views")));
    if (sum("downloads")) stats.push(stat(sum("downloads"), t("im_downloads")));
    if (sum("attendees")) stats.push(stat(sum("attendees"), t("im_attendees")));
    out.push(el("div", { class: "mvp-stats" }, stats));
    // Beitraege je Monat (12 Monate des Zeitraums)
    var months = [], start = new Date(p.start * 1000);
    for (var i = 0; i < 12; i++) months.push({ d: new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1)), n: 0 });
    inP.forEach(function (c) { var d = new Date(c.published * 1000), k = (d.getUTCFullYear() - start.getUTCFullYear()) * 12 + d.getUTCMonth() - start.getUTCMonth(); if (months[k]) months[k].n++; });
    var max = Math.max.apply(null, months.map(function (m) { return m.n; }).concat([1]));
    var mname = function (d, style) { try { return new Intl.DateTimeFormat(LANG, { month: style, timeZone: "UTC" }).format(d); } catch (e) { return String(d.getUTCMonth() + 1); } };
    var chart = el("div", { class: "mvp-bars", role: "img", "aria-label": t("im_chart", { p: p.label, v: months.map(function (m) { return mname(m.d, "short") + " " + m.n; }).join(", ") }) });
    months.forEach(function (m) { chart.appendChild(el("div", { class: "mvp-bar" }, [el("span", { class: "mvp-barv" + (m.n ? "" : " zero"), style: "block-size:" + Math.max(3, Math.round(m.n / max * 100)) + "%" }), el("small", { "aria-hidden": "true", text: mname(m.d, "narrow") })])); });
    out.push(el("section", { class: "mvp-card" }, [el("h3", { text: t("im_month") }), chart]));
    var types = {}; inP.forEach(function (c) { types[c.kind] = (types[c.kind] || 0) + 1; });
    var tk = Object.keys(types).sort(function (x, y) { return types[y] - types[x]; }), tmax = types[tk[0]] || 1;
    var tl = el("ul", { class: "mvp-types" });
    tk.forEach(function (k) { tl.appendChild(el("li", {}, [el("span", { text: kindLabel(k) }), el("b", { text: num(types[k]) }), el("span", { class: "mvp-tbar", "aria-hidden": "true" }, [el("i", { style: "inline-size:" + Math.round(types[k] / tmax * 100) + "%" })])])); });
    out.push(el("section", { class: "mvp-card" }, [el("h3", { text: t("im_types") }), tl]));
    out.push(el("p", { class: "mvp-hint", text: t("im_note") }));
    if (items().length >= 500) out.push(el("p", { class: "mvp-hint bad", text: t("im_limit") }));
    out.push(el("div", { class: "btns mvp-noprint" }, [btn(t("im_print"), function () { window.print(); })]));
    return out;
  }

  // ---------- Export ----------
  function viewExport() {
    var p = periodOf("mvp", mvpYearOf(nowSec())), e = S.expForm || (S.expForm = { from: p.from, to: p.to, category: "", portal: "all", format: "csv" });
    var from = input("date", e.from), to = input("date", e.to);
    var cat = select([["", t("cat_all")]].concat(CATS.map(function (x) { return [x, x]; })).concat([["none", t("cat_none")]]), e.category);
    var portal = select([["all", t("f_all")], ["open", t("f_open")], ["entered", t("f_entered")]], e.portal);
    var fmt = el("fieldset", { class: "mvp-radio" }, [el("legend", { text: t("x_format") })]);
    [["csv", t("x_csv")], ["copy", t("x_copy")], ["mvp", t("x_mvp")], ["gde", t("x_gde")]].forEach(function (o) {
      fmt.appendChild(el("label", { class: "mvp-check" }, [input("radio", o[0], { name: "mvp-fmt", checked: e.format === o[0] }), el("span", { text: o[1] })]));
    });
    var f = el("form", { class: "mvp-card mvp-form", novalidate: true }, [el("div", { class: "mvp-grid" }, [field(t("x_from"), from), field(t("x_to"), to)]),
      el("div", { class: "mvp-grid" }, [field(t("cat_label"), cat), field(t("x_status"), portal)]), fmt, el("div", { class: "btns" }, [el("button", { type: "submit", class: "btn main", text: t("x_make") })]),
      el("p", { class: "mvp-hint", text: t("x_note") })]);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var r0 = f.querySelector("input[name=mvp-fmt]:checked");
      e.from = from.value; e.to = to.value; e.category = cat.value; e.portal = portal.value; e.format = r0 ? r0.value : "csv";
      if (e.from && e.to && e.from > e.to) return invalid(to, t("e_date"));
      var q = "from=" + encodeURIComponent(e.from) + "&to=" + encodeURIComponent(e.to) + "&portal=" + e.portal + (e.category ? "&category=" + encodeURIComponent(e.category) : "")
        + "&format=" + (e.format === "copy" ? "csv" : e.format) + "&lang=" + (LANG === "de" ? "de" : "en");
      api("/api/contributions/export?" + q).then(function (r) {
        if (r.s !== 200) return say(errText(r.j));
        S.exp = { fmt: e.format, data: r.j, name: "mvp-contributions-" + (e.from || "start") + "-" + (e.to || "today") }; render(false);
        var res = main.querySelector(".mvp-result"); if (res) res.focus();
      });
    });
    var out = [heading(t("x_h")), f];
    if (S.exp) out.push(exportResult(S.exp));
    return out;
  }
  function exportResult(x) {
    var d = x.data, box = el("section", { class: "mvp-card mvp-result", tabindex: "-1", "aria-live": "polite" });
    box.appendChild(el("h3", { text: t("x_count", { n: num(d.total) }) }));
    if (d.truncated) box.appendChild(el("p", { class: "mvp-hint bad", text: t("x_trunc") }));
    if (!d.total) { box.appendChild(el("p", { text: t("x_empty") })); return box; }
    if (x.fmt === "csv") box.appendChild(el("div", { class: "btns" }, [btn(t("x_dl_csv"), function () { download(x.name + ".csv", "﻿" + d.csv, "text/csv;charset=utf-8"); }, "main")]));
    else if (x.fmt === "copy") {
      var c = btn(t("x_copy_btn"), function () { copyText(d.copy, c); }, "main");
      box.appendChild(el("div", { class: "btns" }, [c]));
      box.appendChild(el("textarea", { class: "mvp-pre", readonly: true, rows: "10", "aria-label": t("x_copy"), value: d.copy }));
    } else {
      var json = JSON.stringify(d.items, null, 2), cj = btn(t("x_copy_btn"), function () { copyText(json, cj); }, "main");
      box.appendChild(el("p", { text: t("x_ready", { r: num(d.ready), n: num(d.items.length) }) }));
      if (d.skipped && d.skipped.length) box.appendChild(el("p", { class: "mvp-hint", text: t("x_skipped", { n: num(d.skipped.length) }) }));
      var ul = el("ul", { class: "mvp-list compact" });
      d.items.forEach(function (it) {
        var c = byId(it.id);
        ul.appendChild(el("li", { class: "mvp-item" }, [el("div", { class: "mvp-row" }, [el("span", { class: "mvp-kicker", text: (it.activity.activityTypeName || it.type) + " · " + (it.activity.date || it.activity.activityDate) }),
          badge(it.ready ? "ok" : "warn", it.ready ? "✓" : String(it.issues.length))]),
          c ? el("a", { class: "mvp-title", href: "#" + HP + "item/" + it.id, text: it.activity.title }) : el("span", { class: "mvp-title", text: it.activity.title }),
          it.issues.length ? el("small", { class: "mvp-issue", text: it.issues.map(function (i) { return i.field + ": " + issueText(i); }).join(" · ") }) : null]));
      });
      box.appendChild(el("div", { class: "btns" }, [cj, btn(t("x_dl_json"), function () { download(x.name + "-" + x.fmt + ".json", json, "application/json"); })]));
      box.appendChild(ul);
    }
    return box;
  }

  // ---------- Quellen ----------
  function viewSources() {
    var srcs = S.data.sources || [], out = [heading(t("s_h")), el("p", { class: "mvp-mut", text: t("s_intro") })];
    var ul = el("ul", { class: "mvp-list" });
    srcs.forEach(function (s) {
      if (S.srcEdit === s.id) { ul.appendChild(el("li", { class: "mvp-item" }, [sourceForm(s)])); return; }
      var st = s.status === "paused_after_errors" ? ["warn", t("s_errors")] : s.status === "paused" ? ["hidden", t("s_paused")] : ["ok", t("s_active")];
      var acts = el("div", { class: "btns" }, [btn(t("s_edit"), function () { S.srcEdit = s.id; S.srcDel = 0; render(false); var i = main.querySelector(".mvp-srcform input[type=url]"); if (i) i.focus(); }),
        btn(s.active && s.status !== "paused_after_errors" ? t("s_pause") : t("s_resume"), function () { srcUpdate({ id: s.id, active: !(s.active && s.status !== "paused_after_errors") }); }),
        btn(s.public ? t("vis_private") : t("vis_public"), function () { srcUpdate({ id: s.id, public: !s.public }); }),
        btn(t("delete"), function () { S.srcDel = s.id; render(false); var b = main.querySelector(".mvp-confirm button"); if (b) b.focus(); }, "danger")]);
      var li = el("li", { class: "mvp-item" }, [el("div", { class: "mvp-row" }, [el("span", { class: "mvp-kicker", text: t("s_k_" + s.kind) }), badge(st[0], st[1])]),
        el("b", { class: "mvp-title", text: s.title || hostOf(s.url) }), el("span", { class: "mvp-mut mvp-url", text: s.url }),
        el("div", { class: "mvp-row sub" }, [el("span", { class: "mvp-chip", text: s.public ? t("vis_public") : t("vis_private") }), el("span", { class: "mvp-mut", text: s.fetched ? t("s_fetched", { d: fmtDate(s.fetched) }) : t("s_never") })]), acts]);
      if (S.srcDel === s.id) {
        var also = check(t("s_del_items"), false);
        li.appendChild(el("div", { class: "mvp-confirm", role: "alert" }, [el("p", { text: t("s_del_confirm") }), also, el("div", { class: "btns" }, [btn(t("del_yes"), function () {
          api("/api/contributions/source/delete", { id: s.id, delete_contributions: also.querySelector("input").checked }).then(function (r) { if (r.s === 200) { S.srcDel = 0; load(function () { say(t("saved"), true); }); } else say(errText(r.j)); });
        }, "danger"), btn(t("cancel"), function () { S.srcDel = 0; render(false); })])]));
      }
      ul.appendChild(li);
    });
    out.push(srcs.length ? ul : el("p", { class: "mvp-empty", text: t("s_none") }));
    out.push(el("section", { class: "mvp-card" }, [el("h3", { text: t("s_add") }), sourceForm(null)]));
    return out;
  }
  function srcUpdate(b) { return api("/api/contributions/source/update", b).then(function (r) { if (r.s === 200) { S.srcEdit = 0; load(function () { say(t("saved"), true); }); } else say(errText(r.j)); }); }
  function sourceForm(s) {
    var kind = select(SKINDS.map(function (k) { return [k, t("s_k_" + k)]; }), s ? s.kind : "youtube"), url = input("url", s ? s.url : "", { inputmode: "url", placeholder: "https://", required: true }),
      title = input("text", s ? s.title : "", { maxlength: "100" }), pub = check(t("s_public"), s ? s.public : false);
    var f = el("form", { class: "mvp-form mvp-srcform", novalidate: true }, [el("div", { class: "mvp-grid" }, [field(t("s_kind"), kind), field(t("s_title"), title)]), field(t("s_url"), url), pub,
      el("div", { class: "btns" }, [el("button", { type: "submit", class: "btn main", text: s ? t("save") : t("s_add") }), s ? btn(t("cancel"), function () { S.srcEdit = 0; render(false); }) : null])]);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!/^https:\/\//i.test(url.value.trim())) return invalid(url, t("s_bad"));
      var b = { kind: kind.value, url: url.value.trim(), title: title.value.trim(), public: pub.querySelector("input").checked };
      if (s) { b.id = s.id; return srcUpdate(b); }
      api("/api/contributions/source", b).then(function (r) { if (r.s === 201) load(function () { say(t("saved"), true); }); else invalid(url, errText(r.j)); });
    });
    return f;
  }

  // ---------- Chancen (#251: Feed folgt; hier nur der Andockpunkt) ----------
  function viewChances() {
    var slot = el("div", { class: "mvp-chances", id: "mvp-chances", "data-lang": LANG });
    var ec = (LANG === "de" ? "/de" : "") + "/community/expert-connect/#calls";
    slot.appendChild(el("div", { class: "mvp-card" }, [el("p", { text: t("c_soon") }), el("a", { class: "btn", href: (X.base || "") + ec, text: t("c_link") })]));
    // Andockpunkt fuer den Chancen-Feed (#251): window.M365Chances(slot, {api, lang}) ersetzt den Platzhalter, sobald es den Feed gibt.
    if (typeof window.M365Chances === "function") { try { window.M365Chances(slot, { api: X.api, lang: LANG }); } catch (e) {} }
    try { slot.dispatchEvent(new CustomEvent("m365:mvp-chances", { bubbles: true, detail: { api: X.api, lang: LANG } })); } catch (e) {}
    return [heading(t("nav_chances")), slot];
  }

  // ---------- Rahmen ----------
  function render(focus) {
    if (!main) {
      host.textContent = "";
      var top = el("div", { class: "mvp-top" }, [el("p", { class: "mvp-kicker", text: t("app") })]);
      if (!APP) top.appendChild(el("a", { class: "mvp-mut", href: (X.base || "") + (LANG === "en" ? "" : "/" + LANG) + "/community/contributor/", text: t("pwa_open") }));
      else top.appendChild(installBtn);
      nav = navBar(); live = el("p", { class: "mvp-msg", role: "status", "aria-live": "polite" }); main = el("div", { class: "mvp-view" });
      host.appendChild(el("div", { class: "mvp-app" }, [top, nav, live, main]));
    }
    var fresh = navBar(); nav.replaceWith(fresh); nav = fresh;
    main.textContent = "";
    if (!S.data) {
      if (S.loadErr === "login") main.appendChild(el("div", { class: "mvp-card" }, [el("p", { text: t("login") }), el("a", { class: "btn main", href: (X.base || "") + (LANG === "en" ? "" : "/" + LANG) + "/community/#c-page", text: t("signin") })]));
      else if (S.loadErr) main.appendChild(el("div", { class: "mvp-card warn" }, [el("p", { text: t(S.loadErr === "offline" ? "offline" : "error") }), btn(t("pwa_retry"), function () { load(); })]));
      else main.appendChild(el("p", { class: "mvp-mut", text: t("loading") }));
      return;
    }
    var fn = { overview: viewOverview, log: viewLog, add: viewAdd, impact: viewImpact, export: viewExport, sources: viewSources, chances: viewChances }[S.view];
    fn().forEach(function (n) { if (n) main.appendChild(n); });
    if (focus === true) { var h = main.querySelector(".mvp-h"); if (h) h.focus(); }
  }

  // App-Installation (nur in der eigenen App-Seite; Manifest und Service Worker gelten nur fuer /community/contributor/)
  var installBtn = el("button", { type: "button", class: "btn", hidden: true, text: t("pwa_install"), title: t("pwa_hint") }), deferred = null;
  if (APP) {
    window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; installBtn.hidden = false; });
    installBtn.addEventListener("click", function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { deferred = null; installBtn.hidden = true; }); });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () {});
  }
  window.addEventListener("hashchange", function () { route(true); });
  window.addEventListener("online", function () { if (!S.data) load(); });
  route(false);
  load();
})();
