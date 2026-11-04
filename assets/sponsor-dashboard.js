(function () {
  var C = window.M365SP, root = document.getElementById("sdb");
  if (!C || !root) return;
  var Q = C.copy, metricKeys = ["people_reached", "podcast_plays", "video_views", "page_views", "link_clicks", "project_requests", "ai_citations", "search_impressions"];
  var sources = [
    ["source_reach", "people_reached", "source_desc_reach", "daily", "build"],
    ["source_spreaker", "podcast_plays", "source_desc_spreaker", "daily", "ready"],
    ["source_youtube", "video_views", "source_desc_youtube", "daily", "setup"],
    ["source_cloudflare", "page_views", "source_desc_cloudflare", "daily", "setup"],
    ["source_counter", "link_clicks", "source_desc_counter", "live", "build"],
    ["source_gsc", "search_impressions", "source_desc_gsc", "daily", "ready"],
    ["source_bing_webmaster", "search_impressions", "source_desc_bing_webmaster", "daily", "setup"],
    ["source_bing", "ai_citations", "source_desc_bing", "monthly", "source_manual"],
    ["source_linkedin", "linkedInImpressions", "source_desc_linkedin", "monthly", "source_manual"],
    ["source_linkedin", "linkedInClicks", "source_desc_linkedin", "monthly", "source_manual"],
    ["source_press", "page_views", "source_desc_press", "daily", "setup"],
    ["source_events", "attendees", "source_desc_events", "daily", "ready"],
    ["source_directory", "project_requests", "source_desc_directory", "live", "build"],
    ["source_app", "podcast_plays", "source_desc_app", "live", "later"]
  ];
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
  function text(key) { return Q[key] || key; }
  function metricLabel(key) {
    return text(({ people_reached: "people_reached", podcast_plays: "podcast_plays", video_views: "video_views",
      page_views: "page_views", link_clicks: "link_clicks", project_requests: "project_requests",
      ai_citations: "ai_citations", search_impressions: "search_impressions", impressions: "impressions",
      clicks: "clicks", attendees: "attendees" })[key] || key);
  }
  function sourceLabel(source) {
    return text(({
      "Cross-channel estimate": "source_reach", "Spreaker API": "source_spreaker", "YouTube Analytics API": "source_youtube",
      "Cloudflare analytics": "source_cloudflare", "M365.FM link counter": "source_counter",
      "Sponsor profile requests": "source_directory", "Bing AI Performance export": "source_bing",
      "Google Search Console": "source_gsc", "Event registration records": "source_events",
      bing_ai: "source_bing", linkedin_newsletter: "source_linkedin"
    })[source] || source || "source_no_data");
  }
  function formatDate(value) {
    if (!value) return text("unavailable");
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
    (C.campaigns || []).forEach(function (campaign, index) {
      var sponsorHost = host(campaign.website);
      if (!sponsorHost || (sponsorHost !== companyHost && !sponsorHost.endsWith("." + companyHost))) return;
      var status = C.today < campaign.start ? "pending" : C.today <= campaign.end ? "confirmed" : "ended";
      function add(type, label, suffix) {
        rows.push({ type: type, title: label, start: campaign.start, end: campaign.end, status: status,
          ref: "campaign-" + index + "-" + suffix, attendees: null, impressions: null, clicks: null, downloads: null });
      }
      if ((campaign.episodes || []).length) add("podcast", text("podcast"), "podcast");
      if ((campaign.pages || []).length) add("page_banner", text("page_banner"), "website");
      if ((campaign.posts || []).length) add("article", text("article"), "article");
    });
    return rows;
  }
  function manualPlacements(org) {
    return (org.manual || []).map(function (item, index) {
      var parts = item.period.split("-"), end = new Date(Date.UTC(Number(parts[0]), Number(parts[1]), 0)).toISOString().slice(0, 10);
      return { type: "manual", title: item.placement, status: "confirmed", start: item.period + "-01", end: end,
        ref: "manual-" + index, manual: item };
    });
  }
  function allPlacements(org) { return (org.placements || []).concat(publicPlacements(org), manualPlacements(org)); }
  function detailUrl(org, placement) {
    var url = new URL(C.urls.placement, location.origin);
    url.searchParams.set("org", org.handle);
    url.searchParams.set("placement", placement.event || placement.ref || "");
    return url.pathname + url.search;
  }
  function nav(admin) {
    var links = [["overview", "dashboard"], ["placement", "placement_view"], ["report", "report_view"]];
    if (admin) links.push(["sources", "sources_view"]);
    return node("nav", { class: "sdb-nav", "aria-label": text("dashboard") }, links.map(function (entry) {
      return node("a", { class: "btn", href: C.urls[entry[0]], text: text(entry[1]) });
    }));
  }
  function metricValue(value) {
    return value == null ? text("unavailable") : new Intl.NumberFormat(C.lang).format(value);
  }
  function kindLabel(kind) { return text(kind === "estimated" ? "estimated" : kind === "manual" ? "manual" : "measured"); }
  function sourceLine(metric) {
    return node("p", { class: "sdb-source" }, [
      node("span", {}, [text("source") + ": ", sourceLabel(metric.source)]),
      node("span", {}, [text("type") + ": ", node("b", { class: "sdb-badge", text: kindLabel(metric.kind) })]),
      node("span", {}, [text("as_of") + ": ", metric.as_of ? formatDate(metric.as_of) : text("no_date")])
    ]);
  }
  function metricCard(metric, label) {
    return node("article", { class: "tile sdb-card" }, [
      node("h3", { text: label }),
      node("strong", { text: metricValue(metric.value) }),
      sourceLine(metric)
    ]);
  }
  function metricsFor(org, month) {
    var records = Object.create(null);
    (org.metrics || []).forEach(function (metric) { if (metric && metric.key) records[metric.key] = metric; });
    var aiMetric = (org.manual || []).find(function (metric) { return metric.metric === "ai_citations" && metric.period === month; });
    if (aiMetric) records.ai_citations = {
      key: "ai_citations", value: aiMetric.value, source: "Bing AI Performance export", kind: "manual", as_of: aiMetric.as_of
    };
    return metricKeys.map(function (key) {
      return records[key] || { key: key, value: null, source: sourceFor(key), kind: kindFor(key), as_of: null };
    });
  }
  function sourceFor(key) {
    return ({
      people_reached: text("source_reach"), podcast_plays: text("source_spreaker"), video_views: text("source_youtube"),
      page_views: text("source_cloudflare"), link_clicks: text("source_counter"), project_requests: text("source_directory"),
      ai_citations: text("source_bing"), search_impressions: text("source_gsc")
    })[key] || text("source_no_data");
  }
  function kindFor(key) { return key === "people_reached" ? "estimated" : key === "ai_citations" ? "manual" : "measured"; }
  function exportCsv(orgs) {
    var rows = [[text("company"), text("placement"), text("metric"), text("value"), text("source"), text("type"), text("as_of"), text("period"), text("link")]];
    orgs.forEach(function (org) {
      metricsFor(org).forEach(function (metric) {
        rows.push([org.name, "", metricLabel(metric.key), metric.value, sourceLabel(metric.source), kindLabel(metric.kind), metric.as_of, "", ""]);
      });
      allPlacements(org).forEach(function (placement) {
        if (placement.manual) {
          rows.push([org.name, placement.title, metricLabel(placement.manual.metric), placement.manual.value,
            sourceLabel(placement.manual.source), kindLabel(placement.manual.kind), placement.manual.as_of, placement.manual.period, placement.manual.link]);
        } else {
          var attending = placement.type === "event_partner";
          var source = attending ? "Event registration records" : text("source_no_data");
          rows.push([org.name, placement.title, attending ? text("attendees") : text(placement.type),
            attending ? placement.attendees : null, source, kindLabel("measured"), attending ? C.today : "", [placement.start, placement.end].join(" – "), ""]);
        }
      });
    });
    var content = "\ufeff" + rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
    var link = node("a", { href: URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" })), download: "sponsorships.csv" });
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function login() {
    root.textContent = "";
    root.appendChild(node("p", { class: "mut", text: text("login") }));
    fetch(C.api + "/api/providers").then(function (r) { return r.json(); }).then(function (data) {
      var actions = node("div", { class: "sdb-actions" });
      (data.providers || []).forEach(function (provider) {
        var link = new URL("/auth/login/" + provider, C.api);
        link.searchParams.set("return", location.href);
        actions.appendChild(node("a", { class: "btn", href: link.href, text: text("signin") + " · " + provider }));
      });
      if (!actions.childNodes.length) {
        actions.appendChild(node("a", { class: "btn", href: C.base + "/" + (C.lang === "en" ? "" : C.lang + "/") + "community/", text: text("signin") }));
      }
      root.appendChild(actions);
    }).catch(function () {});
  }
  function header(orgs, admin) {
    root.textContent = "";
    root.appendChild(nav(admin));
    var company = orgs.length === 1 ? orgs[0].name : "";
    if (company) root.appendChild(node("p", { class: "kicker", text: company }));
  }
  function inPeriod(placement, period) {
    if (period === "campaign") return true;
    var start = placement.start || (placement.period ? placement.period + "-01" : "");
    var end = placement.end || (placement.period ? placement.period + "-31" : "");
    var today = C.today || new Date().toISOString().slice(0, 10), year = today.slice(0, 4);
    if (period === "year") return (!start || start <= year + "-12-31") && (!end || end >= year + "-01-01");
    var cutoffDate = new Date(today + "T00:00:00Z");
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - 30);
    var cutoff = cutoffDate.toISOString().slice(0, 10);
    if (placement.manual) return start >= cutoff && end <= today;
    return (!start || start <= today) && (!end || end >= cutoff);
  }
  function placementRow(org, item) {
    var channel = item.type === "event_partner" ? text("event_partner") :
      item.type === "podcast" ? text("podcast") : item.type === "page_banner" ? text("page_banner") :
      item.type === "manual" ? text(item.manual.source === "bing_ai" ? "source_bing" : "source_linkedin") : text("article");
    var value = item.manual ? metricValue(item.manual.value) : item.attendees == null ? text("unavailable") : metricValue(item.attendees);
    var key = item.manual ? metricLabel(item.manual.metric) : item.type === "event_partner" ? text("attendees") : text("key_figure");
    var link = node("a", { href: detailUrl(org, item), class: "sdb-placement-link" }, [
      node("b", { text: item.title }),
      node("span", { text: channel }),
      node("span", { text: [formatDate(item.start), formatDate(item.end)].join(" – ") }),
      node("span", { class: "sdb-status", text: item.status === "confirmed" ? text("confirmed") : item.status === "pending" ? text("pending") : text("ended") }),
      node("span", {}, [key + ": ", value])
    ]);
    var source = item.manual ? item.manual : item.type === "event_partner" ?
      { source: "Event registration records", kind: "measured", as_of: C.today } : null;
    return node("div", { class: "sdb-placement" }, [link, source ? sourceLine(source) : null,
      item.manual && item.manual.link ? node("a", { href: item.manual.link, rel: "noopener nofollow sponsored", target: "_blank", text: text("link") }) : null]);
  }
  function renderOverview(orgs, admin) {
    header(orgs, admin);
    var selected = "30";
    var controls = node("div", { class: "sdb-periods", role: "group", "aria-label": text("period") });
    [["30", "period_30"], ["campaign", "period_campaign"], ["year", "period_year"]].forEach(function (entry) {
      var button = node("button", { class: "btn" + (entry[0] === selected ? " main" : ""), type: "button",
        "aria-pressed": String(entry[0] === selected), text: text(entry[1]) });
      button.addEventListener("click", function () {
        selected = entry[0];
        Array.prototype.forEach.call(controls.children, function (child) {
          child.setAttribute("aria-pressed", String(child === button));
          child.classList.toggle("main", child === button);
        });
        renderPlacements();
      });
      controls.appendChild(button);
    });
    root.appendChild(controls);
    orgs.forEach(function (org) {
      var section = node("section", { class: "sdb-org" }, [node("h2", { text: org.name }), node("h3", { text: text("key_figures") })]);
      var cards = node("div", { class: "cols" });
      metricsFor(org).forEach(function (metric) { cards.appendChild(metricCard(metric, metricLabel(metric.key))); });
      section.appendChild(cards);
      section.appendChild(node("section", { class: "sdb-panel" }, [
        node("h2", { text: text("reach_week") }),
        node("div", { class: "sdb-chart", role: "img", "aria-label": text("weekly_no_data") }, [
          node("p", { class: "mut", text: text("weekly_no_data") }),
          sourceLine({ source: text("source_reach"), kind: "estimated", as_of: null })
        ])
      ]));
      var placements = node("section", { class: "sdb-panel" });
      placements.appendChild(node("h2", { text: text("placements") }));
      var list = node("div", { class: "sdb-table" });
      var labels = node("p", { class: "sdb-meta" }, [text("placement") + " · " + text("channel") + " · " + text("period") + " · " + text("status") + " · " + text("key_figure")]);
      list.appendChild(labels);
      var rows = node("div");
      placements.appendChild(list);
      placements.appendChild(rows);
      section.appendChild(placements);
      root.appendChild(section);
      function renderPlacements() {
        rows.textContent = "";
        var items = allPlacements(org).filter(function (item) { return inPeriod(item, selected); });
        if (!items.length) rows.appendChild(node("p", { class: "mut", text: text("no_placements") }));
        items.forEach(function (item) { rows.appendChild(placementRow(org, item)); });
      }
      renderPlacements();
    });
    var actions = node("div", { class: "sdb-actions" }, [
      node("button", { type: "button", class: "btn", text: text("csv") }),
      node("a", { class: "btn main", href: C.urls.report, text: text("report_view") })
    ]);
    actions.children[0].addEventListener("click", function () { exportCsv(orgs); });
    root.insertBefore(actions, root.children[1] || null);
    root.appendChild(node("section", { class: "sdb-panel" }, [
      node("h2", { text: text("how_count") }),
      node("p", { text: text("measured") + " = " + text("measured_desc") }),
      node("p", { text: text("estimated") + " = " + text("estimated_desc") }),
      node("p", { text: text("manual") + " = " + text("manual_desc") })
    ]));
  }
  function renderDetail(orgs, admin) {
    header(orgs, admin);
    var params = new URLSearchParams(location.search), org = orgs.find(function (item) { return item.handle === params.get("org"); }) || orgs[0];
    if (!org) { root.appendChild(node("p", { class: "mut", text: text("no_orgs") })); return; }
    var items = allPlacements(org), placement = items.find(function (item) { return item.event === params.get("placement") || item.ref === params.get("placement"); }) || items[0];
    if (!placement) { root.appendChild(node("p", { class: "mut", text: text("no_placements") })); return; }
    root.appendChild(node("p", { class: "sdb-meta" }, [
      node("a", { href: C.urls.overview, text: text("dashboard") }), " / ", placement.title
    ]));
    root.appendChild(node("p", { class: "kicker", text: text(placement.status === "confirmed" ? "confirmed" : "pending") +
      " · " + formatDate(placement.start) + " – " + formatDate(placement.end) }));
    root.appendChild(node("h2", { text: placement.title }));
    root.appendChild(node("p", { class: "lede", text: text("detail_intro") }));
    var month = new Date().toISOString().slice(0, 7);
    var map = Object.create(null); metricsFor(org, month).forEach(function (m) { map[m.key] = m; });
    var channels = [
      ["podcast_tab", ["podcast_plays"]],
      ["video_tab", ["video_views"]],
      ["website_tab", ["page_views", "link_clicks"]],
      ["search_ai_tab", ["search_impressions", "ai_citations"]]
    ];
    var active = 0, tabs = node("div", { class: "sdb-tabs", role: "tablist", "aria-label": text("channel") });
    var content = node("section", { class: "cols", role: "tabpanel" });
    function showTab(index) {
      active = index;
      tabs.querySelectorAll('[role="tab"]').forEach(function (button, i) {
        button.setAttribute("aria-selected", String(i === active));
      });
      content.textContent = "";
      channels[active][1].forEach(function (key) { content.appendChild(metricCard(map[key], text(key))); });
      if (placement.manual && ((placement.manual.source === "bing_ai" && active === 3) ||
          (placement.manual.source === "linkedin_newsletter" && active === 2))) {
        content.appendChild(metricCard(placement.manual, metricLabel(placement.manual.metric)));
      }
      if (placement.type === "event_partner" && active === 0) {
        var attendees = { value: placement.attendees, source: text("source_events"), kind: "measured", as_of: C.today };
        content.appendChild(metricCard(attendees, text("attendees")));
      }
    }
    channels.forEach(function (channel, i) {
      var button = node("button", { class: "btn", type: "button", role: "tab", "aria-selected": String(i === active), text: text(channel[0]) });
      button.addEventListener("click", function () { showTab(i); });
      tabs.appendChild(button);
    });
    root.appendChild(tabs);
    root.appendChild(content);
    showTab(0);
    if (placement.manual && placement.manual.link) root.appendChild(node("a", { href: placement.manual.link, rel: "noopener", target: "_blank", text: text("link") }));
  }
  function renderReport(orgs, admin) {
    header(orgs, admin);
    var params = new URLSearchParams(location.search), org = orgs.find(function (item) { return item.handle === params.get("org"); }) || orgs[0];
    if (!org) { root.appendChild(node("p", { class: "mut", text: text("no_orgs") })); return; }
    var monthInput = node("input", { type: "month", value: params.get("month") || new Date().toISOString().slice(0, 7), "aria-label": text("month") });
    monthInput.addEventListener("change", function () {
      var target = new URL(C.urls.report, location.origin);
      target.searchParams.set("org", org.handle);
      target.searchParams.set("month", monthInput.value);
      location.href = target.pathname + target.search;
    });
    var month = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthInput.value) ? monthInput.value : new Date().toISOString().slice(0, 7);
    monthInput.value = month;
    var report = node("article", { class: "sdb-report sdb-report-page" });
    report.appendChild(node("header", { class: "sdb-report-head" }, [
      node("p", { class: "brand", text: "M365.FM" }),
      node("h1", { text: text("report_title") }),
      node("p", {}, [org.name + " · " + text("month") + " ", new Intl.DateTimeFormat(C.lang, { month: "long", year: "numeric" }).format(new Date(month + "-01T00:00:00Z"))])
    ]));
    report.insertBefore(node("label", {}, [text("month"), monthInput]), report.children[0]);
    if (orgs.length > 1) {
      var orgSelect = node("select", { "aria-label": text("company") });
      orgs.forEach(function (item) { orgSelect.appendChild(node("option", { value: item.handle, text: item.name })); });
      orgSelect.value = org.handle;
      orgSelect.addEventListener("change", function () {
        var target = new URL(C.urls.report, location.origin);
        target.searchParams.set("org", orgSelect.value);
        location.href = target.pathname + target.search;
      });
      report.insertBefore(node("label", {}, [text("company"), orgSelect]), report.children[0]);
    }
    report.appendChild(node("p", { text: text("sponsored_label") }));
    var cards = node("div", { class: "cols" });
    metricsFor(org, month).forEach(function (metric) { cards.appendChild(metricCard(metric, metricLabel(metric.key))); });
    report.appendChild(cards);
    report.appendChild(node("section", { class: "sdb-panel" }, [
      node("h2", { text: text("highlights") }),
      node("p", { text: text("weekly_no_data") }),
      node("h2", { text: text("next_month") }),
      node("p", { text: text("no_placements") })
    ]));
    var monthlyManual = (org.manual || []).filter(function (item) { return item.period === month && item.metric !== "ai_citations"; });
    if (monthlyManual.length) {
      var manualSection = node("section", { class: "sdb-panel" }, [node("h2", { text: text("manual") })]);
      monthlyManual.forEach(function (item) {
        manualSection.appendChild(metricCard(item, metricLabel(item.metric)));
        if (item.link) manualSection.appendChild(node("a", { href: item.link, rel: "noopener nofollow sponsored", target: "_blank", text: text("link") }));
      });
      report.appendChild(manualSection);
    }
    report.appendChild(node("section", { class: "sdb-panel" }, [
      node("h2", { text: text("how_count") }),
      node("p", { text: text("measured") + " = " + text("measured_desc") }),
      node("p", { text: text("estimated") + " = " + text("estimated_desc") }),
      node("p", { text: text("manual") + " = " + text("manual_desc") })
    ]));
    root.appendChild(node("button", { class: "btn main sdb-actions", type: "button", text: text("print_report") }));
    root.children[root.children.length - 1].addEventListener("click", function () { window.print(); });
    root.appendChild(report);
  }
  function renderSources(orgs, admin) {
    header(orgs, admin);
    if (!admin) { root.appendChild(node("p", { class: "mut", text: text("admin_only") })); return; }
    var table = node("div", { class: "sdb-table" }), rows = node("table");
    var head = node("tr", {}, ["source", "figures", "method", "frequency", "status"].map(function (key) { return node("th", { scope: "col", text: text(key) }); }));
    rows.appendChild(node("thead", {}, [head]));
    var body = node("tbody");
    sources.forEach(function (record) {
      var status = record[4];
      var cells = [text(record[0]), text(record[1]), text(record[2]), text(record[3]), text(status)];
      body.appendChild(node("tr", {}, cells.map(function (value) { return node("td", { text: value }); })));
    });
    rows.appendChild(body);
    table.appendChild(rows);
    root.appendChild(node("h2", { text: text("source_status") }));
    root.appendChild(table);
    var form = node("form", { class: "sdb-form" }, [
      node("h2", { text: text("enter_manual") }), node("p", { class: "mut", text: text("manual_help") })
    ]);
    var orgSelect = node("select", { name: "org_id", required: "" });
    orgs.forEach(function (org) { orgSelect.appendChild(node("option", { value: org.id, text: org.name })); });
    var sourceSelect = node("select", { name: "source", required: "" }, [
      node("option", { value: "bing_ai", text: text("source_bing") }),
      node("option", { value: "linkedin_newsletter", text: text("source_linkedin") })
    ]);
    var metricSelect = node("select", { name: "metric", required: "" });
    function updateMetrics() {
      metricSelect.textContent = "";
      var values = sourceSelect.value === "bing_ai" ? [["ai_citations", "ai_citations"]] :
        [["impressions", "linkedInImpressions"], ["clicks", "linkedInClicks"]];
      values.forEach(function (entry) { metricSelect.appendChild(node("option", { value: entry[0], text: text(entry[1]) })); });
    }
    sourceSelect.addEventListener("change", updateMetrics); updateMetrics();
    var placementInput = node("input", { name: "placement", maxlength: "180", required: "" });
    var periodInput = node("input", { name: "period", type: "month", required: "" });
    var valueInput = node("input", { name: "value", type: "number", min: "0", step: "1", required: "" });
    var linkInput = node("input", { name: "link", type: "url", placeholder: "https://…" });
    var proofInput = node("input", { name: "proof_key", maxlength: "200", required: "" });
    [[text("company"), orgSelect], [text("source_select"), sourceSelect], [text("metric"), metricSelect],
      [text("placement_name"), placementInput], [text("month"), periodInput], [text("value"), valueInput],
      [text("link"), linkInput], [text("proof"), proofInput]].forEach(function (entry) {
      form.appendChild(node("label", {}, [entry[0], entry[1]]));
    });
    var submit = node("button", { type: "submit", class: "btn main", text: text("save") });
    var message = node("p", { role: "status", "aria-live": "polite" });
    form.appendChild(submit); form.appendChild(message);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submit.disabled = true;
      api("/api/sponsor/manual-metric", { method: "POST", body: {
        org_id: Number(orgSelect.value), source: sourceSelect.value, metric: metricSelect.value,
        placement: placementInput.value, period: periodInput.value, value: Number(valueInput.value),
        link: linkInput.value, proof_key: proofInput.value
      } }).then(function (result) {
        message.textContent = result.status === 200 ? text("saved") : text("invalid");
        if (result.status === 200) form.reset();
      }).catch(function () { message.textContent = text("invalid"); }).finally(function () { submit.disabled = false; });
    });
    root.appendChild(form);
  }
  api("/api/sponsor/dashboard").then(function (result) {
    if (result.status === 401) { login(); return; }
    if (result.status !== 200) { root.textContent = text("error"); return; }
    var orgs = result.json.orgs || [], admin = !!result.json.admin;
    if (C.view === "sources") {
      if (!admin) { header(orgs, admin); root.appendChild(node("p", { class: "mut", text: text("admin_only") })); return; }
      api("/api/sponsor/sources").then(function (data) {
        if (data.status !== 200) { root.textContent = text("admin_only"); return; }
        renderSources(data.json.orgs || [], true);
      }).catch(function () { root.textContent = text("error"); });
      return;
    }
    if (!orgs.length) { root.textContent = text("no_orgs"); return; }
    if (C.view === "placement") renderDetail(orgs, admin);
    else if (C.view === "report") renderReport(orgs, admin);
    else renderOverview(orgs, admin);
  }).catch(function () { root.textContent = text("error"); });
})();
