(function () {
  var C = window.M365SP, root = document.getElementById("sdb");
  if (!C || !root) return;
  var Q = C.copy;
  function node(tag, attrs, children) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (child) {
      if (child != null) e.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return e;
  }
  function api(path, options) {
    options = options || {};
    options.credentials = "include";
    options.headers = Object.assign({ "x-requested-with": "m365" }, options.headers || {});
    if (options.body) {
      options.headers["content-type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    return fetch(C.api + path, options).then(function (response) {
      return response.json().then(function (json) { return { status: response.status, json: json }; });
    });
  }
  function formatDate(value) {
    if (!value) return "–";
    var date = new Date(value.slice(0, 10) + "T00:00:00Z");
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(C.lang).format(date);
  }
  function csvCell(value) {
    var text = String(value == null ? "" : value);
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""').replace(/[\r\n]+/g, " ") + '"';
  }
  function host(value) {
    try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch (e) { return ""; }
  }
  function publicPlacements(org) {
    var companyHost = host(org.website), rows = [];
    if (!companyHost) return rows;
    (C.campaigns || []).forEach(function (campaign) {
      var sponsorHost = host(campaign.website);
      if (!sponsorHost || (sponsorHost !== companyHost && !sponsorHost.endsWith("." + companyHost))) return;
      var status = C.today < campaign.start ? "pending" : C.today <= campaign.end ? "confirmed" : "ended";
      function add(type, label) {
        rows.push({ type: type, title: label, start: campaign.start, end: campaign.end, status: status,
          attendees: null, impressions: null, clicks: null, downloads: null });
      }
      if (campaign.episodes.length) add("podcast", Q.podcast);
      if (campaign.pages.length) add("page_banner", Q.page_banner);
      if (campaign.posts.length) add("article", Q.article);
    });
    return rows;
  }
  function exportCsv(orgs) {
    var headers = [Q.company, Q.type, Q.placement, Q.status, Q.period, Q.attendees, Q.impressions, Q.clicks, Q.downloads];
    var rows = [headers];
    orgs.forEach(function (org) {
      (org.placements || []).concat(publicPlacements(org)).forEach(function (p) {
        var type = p.type === "event_partner" ? Q.event_partner : p.type === "podcast" ? Q.podcast : p.type === "page_banner" ? Q.page_banner : Q.article;
        rows.push([org.name, type, p.title, p.status === "confirmed" ? Q.confirmed : p.status === "pending" ? Q.pending : Q.ended,
          [formatDate(p.start), formatDate(p.end)].join(" – "), p.attendees, p.impressions, p.clicks, p.downloads]);
      });
    });
    var content = "\ufeff" + rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
    var link = node("a", { href: URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" })), download: "sponsorships.csv" });
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function metric(label, value) {
    var shown = value == null ? Q.unavailable : new Intl.NumberFormat(C.lang).format(value);
    return node("div", {}, [node("b", { text: shown }), node("span", { text: label })]);
  }
  function placement(org, p) {
    var status = p.status === "confirmed" ? Q.confirmed : p.status === "pending" ? Q.pending : Q.ended;
    var type = p.type === "event_partner" ? Q.event_partner : p.type === "podcast" ? Q.podcast : p.type === "page_banner" ? Q.page_banner : Q.article;
    var card = node("article", { class: "sdb-placement" }, [
      node("p", { class: "kicker", text: type }),
      node("h3", { text: p.title }),
      node("p", { class: "sdb-meta" }, [
        node("span", {}, [Q.status + ": ", node("b", { class: "sdb-status", text: status })]),
        node("span", {}, [Q.period + ": ", formatDate(p.start) + " – " + formatDate(p.end)]),
      ]),
      node("div", { class: "stats" }, [
        metric(Q.attendees, p.attendees),
        metric(Q.impressions, p.impressions),
        metric(Q.clicks, p.clicks),
        metric(Q.downloads, p.downloads),
      ]),
    ]);
    return card;
  }
  function login() {
    root.textContent = "";
    root.appendChild(node("p", { class: "mut", text: Q.login }));
    fetch(C.api + "/api/providers").then(function (r) { return r.json(); }).then(function (data) {
      var actions = node("div", { class: "sdb-actions" });
      (data.providers || []).forEach(function (provider) {
        var link = new URL("/auth/login/" + provider, C.api);
        link.searchParams.set("return", location.href);
        actions.appendChild(node("a", { class: "btn", href: link.href, text: Q.signin + " · " + provider }));
      });
      if (!actions.childNodes.length) {
        actions.appendChild(node("a", { class: "btn", href: C.base + "/" + (C.lang === "en" ? "" : C.lang + "/") + "community/", text: Q.signin }));
      }
      root.appendChild(actions);
    }).catch(function () {});
  }
  function render(orgs) {
    root.textContent = "";
    if (!orgs.length) {
      root.appendChild(node("p", { class: "mut", text: Q.no_orgs }));
      return;
    }
    orgs.forEach(function (org) {
      var items = (org.placements || []).concat(publicPlacements(org));
      var section = node("section", { class: "sdb-org" }, [node("h2", { text: org.name })]);
      if (!items.length) section.appendChild(node("p", { class: "mut", text: Q.no_placements }));
      items.forEach(function (p) { section.appendChild(placement(org, p)); });
      root.appendChild(section);
    });
    var actions = node("div", { class: "sdb-actions" }, [
      node("button", { type: "button", class: "btn", text: Q.csv }),
      node("button", { type: "button", class: "btn", text: Q.pdf }),
    ]);
    actions.children[0].addEventListener("click", function () { exportCsv(orgs); });
    actions.children[1].addEventListener("click", function () { window.print(); });
    root.insertBefore(actions, root.firstChild);
    root.appendChild(contactForm(orgs));
  }
  function contactForm(orgs) {
    var form = node("form", { class: "sdb-form" }, [node("h2", { text: Q.contact })]);
    var select = node("select", { name: "org", required: "" });
    orgs.forEach(function (org) { select.appendChild(node("option", { value: org.handle, text: org.name })); });
    var label = node("label", {}, [Q.company, select]);
    var message = node("textarea", { name: "message", rows: "4", maxlength: "1000", required: "", "aria-label": Q.message });
    var messageLabel = node("label", {}, [Q.message, message]);
    var status = node("p", { role: "status", "aria-live": "polite" });
    var submit = node("button", { type: "submit", class: "btn main", text: Q.send });
    form.appendChild(label);
    form.appendChild(messageLabel);
    form.appendChild(submit);
    form.appendChild(status);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submit.disabled = true;
      api("/api/sponsor/contact", { method: "POST", body: { org: select.value, message: message.value } }).then(function (result) {
        if (result.status === 200) { message.value = ""; status.textContent = Q.sent; }
        else status.textContent = Q.error;
      }).catch(function () { status.textContent = Q.error; }).finally(function () { submit.disabled = false; });
    });
    return form;
  }
  api("/api/sponsor/dashboard").then(function (result) {
    if (result.status === 401) { login(); return; }
    if (result.status !== 200) { root.textContent = Q.error; return; }
    render(result.json.orgs || []);
  }).catch(function () { root.textContent = Q.error; });
})();
