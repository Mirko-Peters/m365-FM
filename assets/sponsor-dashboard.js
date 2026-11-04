(function () {
  var C = window.M365SP, root = document.getElementById("sdb");
  if (!C || !root) return;
  var Q = C.copy, metricKeys = ["people_reached", "podcast_plays", "video_views", "page_views", "link_clicks", "project_requests", "ai_citations", "search_impressions"];
  var sourceCatalog = [
    ["source_reach", "people_reached", "source_desc_reach", "daily", "people_reached"],
    ["source_spreaker", "podcast_plays", "source_desc_spreaker", "daily", "spreaker"],
    ["source_youtube", "video_views", "source_desc_youtube", "daily", "youtube"],
    ["source_cloudflare", "page_views", "source_desc_cloudflare", "daily", "cloudflare"],
    ["source_counter", "link_clicks", "source_desc_counter", "live", "sponsor_links"],
    ["source_gsc", "search_impressions", "source_desc_gsc", "daily", "gsc"],
    ["source_bing_webmaster", "search_impressions", "source_desc_bing_webmaster", "daily", "bing_webmaster"],
    ["source_bing", "ai_citations", "source_desc_bing", "monthly", "bing_ai"],
    ["source_press", "page_views", "source_desc_press", "daily", "press_ranger"],
    ["source_directory", "project_requests", "source_desc_directory", "live", "project_requests"],
    ["source_app", "podcast_plays", "source_desc_app", "live", "app"]
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
      ai_citations: "ai_citations", search_impressions: "search_impressions", gsc_impressions: "search_impressions",
      gsc_clicks: "clicks", bing_impressions: "impressions", bing_clicks: "clicks", press_views: "views",
      video_watch_minutes: "video_watch_minutes", video_retention: "video_retention", ai_visibility: "ai_visibility",
      impressions: "impressions", clicks: "clicks", attendees: "attendees" })[key] || key);
  }
  function sourceLabel(source) {
    return text(({
      "Cross-channel estimate": "source_reach", "Spreaker API": "source_spreaker", "YouTube Analytics API": "source_youtube",
      "Cloudflare Analytics": "source_cloudflare", "M365.FM-Linkzähler": "source_counter",
      "D1-Projektanfragen (#232)": "source_directory", "Bing AI Performance": "source_bing",
      "Google Search Console": "source_gsc", "Bing Webmaster API": "source_bing_webmaster",
      "Press Ranger": "source_press", "bing_ai": "source_bing", "press_portal": "source_press",
      spreaker: "source_spreaker", youtube: "source_youtube", cloudflare: "source_cloudflare",
      gsc: "source_gsc", bing_webmaster: "source_bing_webmaster",
      press_ranger: "source_press", sponsor_links: "source_counter"
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
  function allPlacements(org) {
    return (org.placements || []).map(function (placement) {
      return Object.assign({}, placement, {
        manual: (org.manual || []).filter(function (metric) { return metric.placement_id === placement.id; })
      });
    }).concat((org.event_partners || []).map(function (event) {
      return Object.assign({ type: "event_partner", manual: [], metrics: [], clicks: [] }, event);
    }));
  }
  var currentPeriod = null, currentOrgs = [], currentCompanies = [], currentAdmin = false;
  function detailUrl(org, placement) {
    var url = new URL(C.urls.placement, location.origin);
    url.searchParams.set("org", org.handle);
    url.searchParams.set("placement", placement.id || placement.ref || "");
    if (currentPeriod) {
      url.searchParams.set("from", currentPeriod.from);
      url.searchParams.set("to", currentPeriod.to);
    }
    return url.pathname + url.search;
  }
  function nav(admin) {
    var links = [["overview", "dashboard"], ["placement", "placement_view"], ["report", "report_view"]];
    if (admin) links.push(["sources", "sources_view"]);
    return node("nav", { class: "sdb-nav", "aria-label": text("dashboard") }, links.map(function (entry) {
      var url = new URL(C.urls[entry[0]], location.origin);
      var selected = currentOrgs.length === 1 ? currentOrgs[0].handle : new URLSearchParams(location.search).get("org");
      if (selected) url.searchParams.set("org", selected);
      return node("a", { class: "btn", href: url.pathname + url.search, text: text(entry[1]) });
    }));
  }
  function metricValue(value) {
    return value == null ? text("unavailable") : typeof value === "number" ? new Intl.NumberFormat(C.lang).format(value) : value;
  }
  function kindLabel(kind) { return text(kind === "estimated" ? "estimated" : kind === "manual" ? "manual" : "measured"); }
  function sourceLine(metric) {
    return node("p", { class: "sdb-source" }, [
      node("span", {}, [text("source") + ": ", sourceLabel(metric.source)]),
      node("span", {}, [text("type") + ": ", node("b", { class: "sdb-badge sdb-kind-" + metric.kind, text: kindLabel(metric.kind) })]),
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
  function metricsFor(org) {
    var records = Object.create(null);
    (org.metrics || []).forEach(function (metric) { if (metric && metric.key) records[metric.key] = metric; });
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
  function weeklyChart(org) {
    var today = new Date((currentPeriod && currentPeriod.to || C.today) + "T00:00:00Z");
    var monday = new Date(today);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    monday.setUTCDate(monday.getUTCDate() - 7 * 7);
    var weeks = [];
    for (var i = 0; i < 8; i++) {
      var start = new Date(monday);
      start.setUTCDate(start.getUTCDate() + i * 7);
      weeks.push({ day: start.toISOString().slice(0, 10), podcast: 0, video: 0, website: 0 });
    }
    var byWeek = Object.create(null);
    (org.weekly || []).forEach(function (week) { byWeek[week.week] = week; });
    weeks.forEach(function (week) {
      var source = byWeek[week.day];
      if (source) {
        week.podcast = Number(source.podcast) || 0;
        week.video = Number(source.video) || 0;
        week.website = Number(source.website) || 0;
      }
    });
    var hasValues = (org.weekly || []).length > 0;
    if (!hasValues) return node("div", { class: "sdb-chart", role: "img", "aria-label": text("weekly_no_data") },
      [node("p", { class: "mut", text: text("weekly_no_data") })]);
    var max = Math.max.apply(null, weeks.map(function (week) { return week.podcast + week.video + week.website; })) || 1;
    var bars = node("div", { class: "sdb-bars", role: "img" });
    bars.setAttribute("aria-label", text("reach_week") + ": " + weeks.map(function (week) {
      return formatDate(week.day) + " " + [text("podcast"), metricValue(week.podcast), text("video_tab"), metricValue(week.video),
        text("website_tab"), metricValue(week.website)].join(" ");
    }).join("; "));
    weeks.forEach(function (week) {
      var bar = node("div", { class: "sdb-bar-group", "aria-hidden": "true" });
      [["podcast", week.podcast], ["video", week.video], ["website", week.website]].forEach(function (entry) {
        if (!entry[1]) return;
        bar.appendChild(node("span", { class: "sdb-bar sdb-bar-" + entry[0],
          style: "--bar-height:" + Math.max(2, entry[1] / max * 100) + "%" }));
      });
      bar.appendChild(node("small", { text: formatDate(week.day) }));
      bars.appendChild(bar);
    });
    var table = node("table", { class: "sr-only" }, [
      node("caption", { text: text("reach_week") }),
      node("thead", {}, [node("tr", {}, ["week", "podcast", "video_tab", "website_tab"].map(function (key) {
        return node("th", { scope: "col", text: text(key) });
      }))]),
      node("tbody", {}, weeks.map(function (week) {
        return node("tr", {}, [week.day, week.podcast, week.video, week.website].map(function (value) {
          return node("td", { text: value });
        }));
      }))
    ]);
    return node("div", { class: "sdb-chart" }, [bars, node("p", { class: "sdb-legend", text:
      text("podcast") + " · " + text("video_tab") + " · " + text("website_tab") }), table]);
  }
  function exportCsv(orgs) {
    var rows = [[text("company"), text("placement"), text("metric"), text("value"), text("source"), text("type"), text("as_of"), text("period"), text("link")]];
    var period = currentPeriod ? currentPeriod.from + " – " + currentPeriod.to : "";
    orgs.forEach(function (org) {
      metricsFor(org).forEach(function (metric) {
        if (metric.value != null) rows.push([org.name, text("company_total"), metricLabel(metric.key), metric.value,
          sourceLabel(metric.source), kindLabel(metric.kind), metric.as_of, period, ""]);
      });
      allPlacements(org).forEach(function (placement) {
        var link = placement.refs && placement.refs.press_release || "";
        (placement.metrics || []).forEach(function (metric) {
          rows.push([org.name, placement.title, metricLabel(metric.metric), metric.value, sourceLabel(metric.source),
            kindLabel(metric.kind), metric.day, period, link]);
        });
        (placement.clicks || []).forEach(function (click) {
          rows.push([org.name, placement.title + " · " + click.surface, metricLabel("link_clicks"), click.clicks,
            text("source_counter"), kindLabel("measured"), click.as_of, period, ""]);
        });
        placement.manual.forEach(function (manual) {
          rows.push([org.name, placement.title, metricLabel(manual.metric), manual.value, sourceLabel(manual.source),
            kindLabel("manual"), manual.as_of, manual.period, manual.link]);
        });
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
    var companies = admin && currentCompanies.length ? currentCompanies : orgs;
    if (admin && companies.length > 1) {
      var selected = orgs.length === 1 ? orgs[0].handle : new URLSearchParams(location.search).get("org") || companies[0].handle;
      var select = node("select", { "aria-label": text("company") });
      companies.forEach(function (org) { select.appendChild(node("option", { value: org.handle, text: org.name })); });
      select.value = selected;
      select.addEventListener("change", function () { loadDashboard(select.value, currentPreset); });
      root.appendChild(node("label", { class: "sdb-company" }, [text("company") + " · ", select, " · Sponsor"]));
    } else if (company) root.appendChild(node("p", { class: "kicker", text: company + " · Sponsor" }));
  }
  function rangeFor(period, org) {
    var today = C.today || new Date().toISOString().slice(0, 10);
    if (period === "year") return [today.slice(0, 4) + "-01-01", today];
    if (period === "campaign") {
      var placements = (org.placements || []).filter(function (item) { return item.start || item.end; });
      var starts = placements.map(function (item) { return item.start; }).filter(Boolean).sort();
      var ends = placements.map(function (item) { return item.end; }).filter(Boolean).sort();
      return [starts[0] || today, ends[ends.length - 1] || today];
    }
    var from = new Date(today + "T00:00:00Z");
    from.setUTCDate(from.getUTCDate() - 29);
    return [from.toISOString().slice(0, 10), today];
  }
  function placementRow(org, item) {
    var channel = item.type === "event_partner" ? text("event_partner") :
      item.channel === "podcast_video" ? text("podcast") : item.channel === "website" ? text("page_banner") :
      item.channel === "press" ? text("source_press") : item.channel === "event" ? text("event_partner") : text("source_app");
    var value = item.type === "event_partner" ? "–" : text("unavailable");
    var figure = null;
    if (item.type !== "event_partner") {
      var preferred = item.channel === "website" ? ["page_views"] : item.channel === "press" ? ["gsc_impressions", "bing_impressions", "press_views"] :
        item.channel === "podcast_video" ? ["podcast_plays", "video_views"] : [];
      for (var i = 0; i < preferred.length && !figure; i++) {
        var records = (item.metrics || []).filter(function (metric) { return metric.metric === preferred[i]; });
        if (records.length) figure = { metric: preferred[i], value: records.reduce(function (sum, metric) { return sum + Number(metric.value || 0); }, 0),
          source: records[0].source, kind: records[0].kind, as_of: records.reduce(function (latest, metric) { return metric.day > latest ? metric.day : latest; }, "") };
      }
      var manual = (item.manual || []).slice().sort(function (a, b) { return b.period.localeCompare(a.period); })[0];
      if (!figure && manual) figure = { metric: manual.metric, value: manual.value, source: manual.source, kind: "manual", as_of: manual.as_of };
      if (figure) value = metricValue(figure.value);
    }
    var key = figure ? metricLabel(figure.metric) : text("key_figure");
    var link = node("a", { href: detailUrl(org, item), class: "sdb-placement-link" }, [
      node("b", { text: item.title }),
      node("span", { text: channel }),
      node("span", { text: item.langs || "–" }),
      node("span", { text: [formatDate(item.start), formatDate(item.end)].join(" – ") }),
      node("span", { class: "sdb-status", text: text(item.status === "upcoming" ? "upcoming" : item.status === "ended" ? "ended" : item.start ? "active" : "planned") }),
      node("span", {}, [key + ": ", value])
    ]);
    var pressLink = item.channel === "press" && item.refs && item.refs.press_release;
    return node("div", { class: "sdb-placement" }, [link, figure ? sourceLine(figure) : null, pressLink && /^https:\/\//.test(pressLink) ?
      node("a", { href: pressLink, rel: "noopener nofollow sponsored", target: "_blank", text: text("link") }) : null]);
  }
  function renderOverview(orgs, admin) {
    header(orgs, admin);
    var selected = currentPreset || "30";
    var controls = node("div", { class: "sdb-periods", role: "group", "aria-label": text("period") });
    [["30", "period_30"], ["campaign", "period_campaign"], ["year", "period_year"]].forEach(function (entry) {
      var button = node("button", { class: "btn" + (entry[0] === selected ? " main" : ""), type: "button",
        "aria-pressed": String(entry[0] === selected), text: text(entry[1]) });
      button.addEventListener("click", function () {
        loadDashboard(new URLSearchParams(location.search).get("org") || "", entry[0]);
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
        node("h2", { text: text("reach_week") }), weeklyChart(org)
      ]));
      var placements = node("section", { class: "sdb-panel" });
      placements.appendChild(node("h2", { text: text("placements") }));
      var list = node("div", { class: "sdb-table" });
      var labels = node("p", { class: "sdb-meta" }, [text("placement") + " · " + text("channel") + " · " + text("languages") +
        " · " + text("period") + " · " + text("status") + " · " + text("key_figure")]);
      list.appendChild(labels);
      var rows = node("div");
      placements.appendChild(list);
      placements.appendChild(rows);
      section.appendChild(placements);
      root.appendChild(section);
      var period = currentPeriod || (function () {
        var range = rangeFor(selected, org);
        return { from: range[0], to: range[1] };
      })();
      var items = allPlacements(org).filter(function (item) {
        return (!item.start || item.start <= period.to) && (!item.end || item.end >= period.from);
      });
      if (!items.length) rows.appendChild(node("p", { class: "mut", text: text("no_placements") }));
      items.forEach(function (item) { rows.appendChild(placementRow(org, item)); });
    });
    var actions = node("div", { class: "sdb-actions" }, [
      node("button", { type: "button", class: "btn", text: text("csv") }),
      node("a", { class: "btn main", href: C.urls.report, text: text("report_view") })
    ]);
    var reportUrl = new URL(C.urls.report, location.origin);
    if (admin && orgs.length === 1) reportUrl.searchParams.set("org", orgs[0].handle);
    actions.children[1].href = reportUrl.pathname + reportUrl.search;
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
    var items = allPlacements(org), placement = items.find(function (item) { return item.id === params.get("placement"); }) || items[0];
    if (!placement) { root.appendChild(node("p", { class: "mut", text: text("no_placements") })); return; }
    root.appendChild(node("nav", { class: "sdb-meta", "aria-label": text("breadcrumbs") }, [
      node("a", { href: C.urls.overview, text: text("dashboard") }), " / ",
      node("span", { "aria-current": "page", text: placement.title })
    ]));
    root.appendChild(node("p", { class: "kicker", text: text(placement.status === "upcoming" ? "upcoming" :
      placement.status === "ended" ? "ended" : placement.start ? "active" : "planned") +
      " · " + formatDate(placement.start) + " – " + formatDate(placement.end) + " · " + (placement.langs || text("unavailable")) }));
    root.appendChild(node("h2", { text: placement.title }));
    root.appendChild(node("p", { class: "lede", text: text("detail_intro") }));
    if (placement.type === "event_partner") {
      root.appendChild(node("p", { class: "mut", text: text("unavailable") }));
      return;
    }
    var records = placement.metrics || [], clicks = placement.clicks || [], reportMonth = currentPeriod ? currentPeriod.to.slice(0, 7) : "";
    var manual = (placement.manual || []).filter(function (item) { return item.period === reportMonth; });
    var refs = placement.refs || {};
    function aggregate(metric, source, kind) {
      var selected = records.filter(function (record) { return record.metric === metric; });
      var values = selected.map(function (record) { return Number(record.value); }).filter(Number.isFinite);
      var value = values.length ? (metric === "video_retention" ? values.reduce(function (a, b) { return a + b; }, 0) / values.length :
        values.reduce(function (a, b) { return a + b; }, 0)) : null;
      var latest = selected.reduce(function (date, record) {
        return Math.max(date, Number(record.fetched_at) || 0, Date.parse((record.day || "") + "T00:00:00Z") / 1000 || 0);
      }, 0);
      return { value: value, source: source, kind: selected.length ? selected[0].kind : kind,
        as_of: latest ? new Date(latest * 1000).toISOString().slice(0, 10) : null };
    }
    function clickAggregate(surfaces) {
      var selected = clicks.filter(function (click) { return surfaces.indexOf(click.surface) >= 0; });
      return { value: selected.length ? selected.reduce(function (sum, click) { return sum + Number(click.clicks || 0); }, 0) : null,
        source: "M365.FM-Linkzähler", kind: "measured",
        as_of: selected.reduce(function (latest, click) { return click.as_of > latest ? click.as_of : latest; }, null) };
    }
    var available = {
      podcast: placement.channel === "podcast_video",
      video: placement.channel === "podcast_video" && ((refs.video_ids || []).length || records.some(function (r) { return r.metric.indexOf("video_") === 0; })),
      website: placement.channel === "website" || records.some(function (r) { return r.metric === "page_views"; }),
      search: placement.channel === "press" || records.some(function (r) { return /^gsc_|^bing_/.test(r.metric); }) || manual.some(function (r) { return r.source === "bing_ai" || r.source === "press_portal"; })
    };
    var channels = [
      ["podcast_tab", available.podcast, [["podcast_plays", "podcast_plays", "Spreaker API"],
        ["clicks", "clicks", "M365.FM-Linkzähler"]]],
      ["video_tab", available.video, [["video_views", "video_views", "YouTube Analytics API"],
        ["video_watch_minutes", "video_watch_minutes", "YouTube Analytics API"], ["video_retention", "video_retention", "YouTube Analytics API"],
        ["video_clicks", "clicks", "M365.FM-Linkzähler"]]],
      ["website_tab", available.website, [["page_views", "page_views", "Cloudflare Analytics"],
        ["logo_clicks", "clicks", "M365.FM-Linkzähler"]]],
      ["search_ai_tab", available.search, [["gsc_impressions", "search_impressions", "Google Search Console"],
        ["gsc_clicks", "clicks", "Google Search Console"], ["bing_impressions", "impressions", "Bing Webmaster API"],
        ["bing_clicks", "clicks", "Bing Webmaster API"], ["ai_citations", "ai_citations", "Bing AI Performance"],
        ["press_views", "page_views", "Press Ranger"], ["ai_visibility", "ai_visibility", "Press Ranger"]]]
    ].filter(function (tab) { return tab[1]; });
    if (!channels.length) channels = [["podcast_tab", true, [["podcast_plays", "podcast_plays", "Spreaker API"]]]];
    var active = 0, tabs = node("div", { class: "sdb-tabs", role: "tablist", "aria-label": text("channel") });
    var content = node("section", { class: "cols", role: "tabpanel", id: "sdb-detail-panel", tabindex: "0" });
    function showTab(index) {
      active = index;
      tabs.querySelectorAll('[role="tab"]').forEach(function (button, i) {
        button.setAttribute("aria-selected", String(i === active));
        button.setAttribute("tabindex", i === active ? "0" : "-1");
      });
      content.textContent = "";
      channels[active][2].forEach(function (entry) {
        var metric;
        if (entry[0] === "clicks") metric = clickAggregate(["episode"]);
        else if (entry[0] === "video_clicks") metric = clickAggregate(["video-desc"]);
        else if (entry[0] === "logo_clicks") metric = clickAggregate(["topic", "entity", "sponsor-page"]);
        else if (entry[0] === "ai_citations") {
          var citation = manual.filter(function (item) { return item.source === "bing_ai" && item.metric === "ai_citations"; });
          metric = citation.length ? { value: citation.reduce(function (sum, item) { return sum + Number(item.value); }, 0),
            source: "Bing AI Performance", kind: "manual", as_of: citation.reduce(function (latest, item) { return item.as_of > latest ? item.as_of : latest; }, null) } :
            { value: null, source: "Bing AI Performance", kind: "manual", as_of: null };
        } else metric = aggregate(entry[0], entry[2], entry[0] === "ai_visibility" ? "estimated" : "measured");
        content.appendChild(metricCard(metric, text(entry[1])));
      });
        if (channels[active][0] === "website_tab") {
          var supported = (placement.langs || "en").split(",").map(function (lang) { return lang.trim(); }).filter(Boolean);
          var pageRecords = records.filter(function (record) { return record.metric === "page_views"; });
          var totals = Object.create(null);
          pageRecords.forEach(function (record) {
            var path = String(record.dim || "");
            var lang = supported.find(function (code) { return path.indexOf("/" + code + "/") === 0; }) || "en";
            totals[lang] = (totals[lang] || 0) + Number(record.value || 0);
          });
          var observed = Object.keys(totals);
          content.appendChild(metricCard({ value: pageRecords.length ? observed.length + " of " + supported.length : null,
            source: "Cloudflare Analytics", kind: "measured",
            as_of: aggregate("page_views", "Cloudflare Analytics", "measured").as_of }, text("languages_viewed")));
          if (pageRecords.length) {
            var maxLang = Math.max.apply(null, Object.keys(totals).map(function (lang) { return totals[lang]; })) || 1;
            content.appendChild(node("div", { class: "sdb-lang-bars" }, Object.keys(totals).sort().map(function (lang) {
              return node("div", { class: "sdb-lang-row" }, [
                node("span", { text: lang.toUpperCase() }),
                node("span", { class: "sdb-lang-track", "aria-hidden": "true" }, [
                  node("span", { class: "sdb-lang-bar", style: "--bar-width:" + (totals[lang] / maxLang * 100) + "%" })
                ]),
                node("b", { text: metricValue(totals[lang]) })
              ]);
            })));
          }
        }
        if (channels[active][0] === "podcast_tab") {
          content.appendChild(metricCard({ value: null, source: text("source_no_data"), kind: "measured", as_of: null }, text("top_countries")));
          var episodes = Object.create(null);
        records.filter(function (record) { return record.metric === "podcast_plays" && /^episode:/.test(record.dim || ""); }).forEach(function (record) {
          var episode = record.dim.slice(8), item = episodes[episode] || (episodes[episode] = { plays: 0, day: record.day });
          item.plays += Number(record.value) || 0;
          if (record.day > item.day) item.day = record.day;
        });
        var rows = Object.keys(episodes).map(function (episode) {
          return node("tr", {}, [episode, formatDate(episodes[episode].day), placement.langs || "–",
            metricValue(episodes[episode].plays), "–"].map(function (value) { return node("td", { text: value }); }));
        });
        if (rows.length) content.appendChild(node("div", { class: "sdb-table" }, [node("table", {}, [
          node("thead", {}, [node("tr", {}, ["episode", "date", "languages", "podcast_plays", "clicks"].map(function (key) {
            return node("th", { scope: "col", text: text(key) });
          }))]), node("tbody", {}, rows)
        ])]));
      }
      content.appendChild(node("p", { class: "sdb-source", text: text("source_note") }));
    }
    channels.forEach(function (channel, i) {
      var button = node("button", { class: "btn", id: "sdb-tab-" + i, type: "button", role: "tab",
        "aria-controls": "sdb-detail-panel", "aria-selected": String(i === active), tabindex: i === active ? "0" : "-1", text: text(channel[0]) });
      button.addEventListener("click", function () { showTab(i); });
      tabs.appendChild(button);
    });
    tabs.addEventListener("keydown", function (event) {
      var next = event.key === "ArrowRight" ? (active + 1) % channels.length :
        event.key === "ArrowLeft" ? (active + channels.length - 1) % channels.length :
        event.key === "Home" ? 0 : event.key === "End" ? channels.length - 1 : active;
      if (next !== active) { event.preventDefault(); showTab(next); tabs.children[next].focus(); }
    });
    root.appendChild(tabs);
    root.appendChild(content);
    showTab(0);
    manual.filter(function (item) { return item.link; }).forEach(function (item) {
      root.appendChild(node("a", { href: item.link, rel: "noopener nofollow sponsored", target: "_blank", text: text("link") }));
    });
  }
  function renderReport(orgs, admin) {
    header(orgs, admin);
    var params = new URLSearchParams(location.search), org = orgs.find(function (item) { return item.handle === params.get("org"); }) || orgs[0];
    if (!org) { root.appendChild(node("p", { class: "mut", text: text("no_orgs") })); return; }
    var monthInput = node("input", { type: "month", value: params.get("month") || (currentPeriod && currentPeriod.from.slice(0, 7)) || new Date().toISOString().slice(0, 7), "aria-label": text("month") });
    monthInput.addEventListener("change", function () {
      var target = new URL(C.urls.report, location.origin);
      target.searchParams.set("org", org.handle);
      target.searchParams.set("month", monthInput.value);
      location.href = target.pathname + target.search;
    });
    var month = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthInput.value) ? monthInput.value : new Date().toISOString().slice(0, 7);
    monthInput.value = month;
    root.appendChild(node("label", {}, [text("month"), monthInput]));
    if (orgs.length > 1) {
      var orgSelect = node("select", { "aria-label": text("company") });
      orgs.forEach(function (item) { orgSelect.appendChild(node("option", { value: item.handle, text: item.name })); });
      orgSelect.value = org.handle;
      orgSelect.addEventListener("change", function () {
        var target = new URL(C.urls.report, location.origin);
        target.searchParams.set("org", orgSelect.value);
        target.searchParams.set("month", month);
        location.href = target.pathname + target.search;
      });
      root.appendChild(node("label", {}, [text("company"), orgSelect]));
    }
    var report = node("article", { class: "sdb-report sdb-report-page" });
    report.appendChild(node("header", { class: "sdb-report-head" }, [
      node("p", { class: "brand", text: "M365.FM / " + text("report_title") }),
      node("p", {}, [org.name, " · ", new Intl.DateTimeFormat(C.lang, { month: "long", year: "numeric" }).format(new Date(month + "-01T00:00:00Z"))])
    ]));
    var reportMetrics = metricsFor(org).filter(function (metric) { return metric.key !== "people_reached"; });
    var measuredSentences = reportMetrics.filter(function (metric) { return metric.value != null; })
      .map(function (metric) { return metricLabel(metric.key) + ": " + metricValue(metric.value); });
    report.appendChild(node("h1", { text: text("report_sentence") }));
    report.appendChild(node("p", { class: "sdb-report-intro", text: measuredSentences.length ?
      measuredSentences.slice(0, 3).join(" · ") : text("unavailable") }));
    var reportPlacementNames = (org.placements || []).map(function (placement) { return placement.title; });
    if (reportPlacementNames.length) report.appendChild(node("p", { class: "sdb-report-placement", text: reportPlacementNames.join(", ") }));
    report.appendChild(node("p", { text: text("sponsored_label") }));
    var cards = node("div", { class: "cols" });
    reportMetrics.forEach(function (metric) { cards.appendChild(metricCard(metric, metricLabel(metric.key))); });
    report.appendChild(cards);
    var highlights = [];
    (org.placements || []).forEach(function (placement) {
      (placement.metrics || []).forEach(function (metric) {
        if (Number(metric.value) > 0) highlights.push({ placement: placement.title, metric: metric });
      });
    });
    if (highlights.length) {
      var highlightBox = node("section", { class: "sdb-panel" }, [node("h2", { text: text("highlights") })]);
      highlights.slice(0, 3).forEach(function (item) {
        highlightBox.appendChild(node("p", { text: item.placement + " · " + metricLabel(item.metric.metric) + ": " + metricValue(item.metric.value) }));
      });
      report.appendChild(highlightBox);
    }
    var next = (org.next_placements || []).filter(function (placement) {
      return placement.start && placement.start.slice(0, 7) === nextMonth(month);
    });
    if (next.length) report.appendChild(node("section", { class: "sdb-panel" }, [
      node("h2", { text: text("next_month") }),
      node("ul", {}, next.map(function (placement) { return node("li", { text: placement.title + " · " + formatDate(placement.start) }); }))
    ]));
    report.appendChild(node("section", { class: "sdb-panel" }, [
      node("h2", { text: text("how_count") }),
      node("p", { text: text("measured") + " = " + text("measured_desc") }),
      node("p", { text: text("estimated") + " = " + text("estimated_desc") }),
      node("p", { text: text("manual") + " = " + text("manual_desc") }),
      node("p", { text: text("sponsored_label") })
    ]));
    var print = node("button", { class: "btn main sdb-actions", type: "button", text: text("print_report") });
    print.addEventListener("click", function () { window.print(); });
    root.appendChild(print);
    root.appendChild(report);
  }

  function nextMonth(month) {
    var date = new Date(month + "-01T00:00:00Z");
    date.setUTCMonth(date.getUTCMonth() + 1);
    return date.toISOString().slice(0, 7);
  }
  function renderSources(data, admin) {
    var orgs = data.orgs || [], placements = data.placements || [], sourceRows = data.sources || [];
    header(orgs, admin);
    if (!admin) { root.appendChild(node("p", { class: "mut", text: text("admin_only") })); return; }
    var table = node("div", { class: "sdb-table" }), rows = node("table");
    var head = node("tr", {}, ["source", "figures", "method", "frequency", "status"].map(function (key) { return node("th", { scope: "col", text: text(key) }); }));
    rows.appendChild(node("thead", {}, [head]));
    var body = node("tbody");
    var lastFetch = Object.create(null);
    sourceRows.forEach(function (source) {
      lastFetch[source.source] = Math.max(lastFetch[source.source] || 0, Number(source.fetched_at) || 0);
    });
    lastFetch.press_ranger = Math.max(lastFetch.press_ranger || 0, lastFetch.press_portal || 0);
    sourceCatalog.forEach(function (record) {
      var sourceId = record[4], fetched = lastFetch[sourceId];
      var status = fetched ? text("ready") + " · " + formatDate(new Date(fetched * 1000).toISOString().slice(0, 10)) : text("source_no_data");
      var cells = [text(record[0]), text(record[1]), text(record[2]), text(record[3]), status];
      body.appendChild(node("tr", {}, cells.map(function (value) { return node("td", { text: value }); })));
    });
    rows.appendChild(body);
    table.appendChild(rows);
    root.appendChild(node("h2", { text: text("source_status") }));
    root.appendChild(table);
    var form = node("form", { class: "sdb-form" }, [
      node("h2", { text: text("enter_manual") }), node("p", { class: "mut", text: text("manual_help") })
    ]);
    var sourceSelect = node("select", { name: "source", required: "" }, [
      node("option", { value: "bing_ai", text: text("source_bing") }),
      node("option", { value: "press_portal", text: text("source_press") })
    ]);
    var placementSelect = node("select", { name: "placement_id", required: "" });
    placements.forEach(function (placement) {
      var org = orgs.find(function (item) { return item.id === placement.org_id; });
      placementSelect.appendChild(node("option", { value: placement.id, text: (org ? org.name + " · " : "") + placement.title }));
    });
    var periodInput = node("input", { name: "period", type: "month", required: "" });
    var citationsInput = node("input", { name: "ai_citations", type: "number", min: "0", step: "1" });
    var viewsInput = node("input", { name: "views", type: "number", min: "0", step: "1" });
    var clicksInput = node("input", { name: "clicks", type: "number", min: "0", step: "1" });
    var linkInput = node("input", { name: "link", type: "url", placeholder: "https://…", required: "" });
    var proofInput = node("input", { name: "proof_key", maxlength: "200", required: "" });
    function updateManualFields() {
      var bing = sourceSelect.value === "bing_ai";
      citationsInput.disabled = !bing; citationsInput.required = bing;
      viewsInput.disabled = bing; viewsInput.required = !bing;
      clicksInput.disabled = bing; clicksInput.required = !bing;
    }
    sourceSelect.addEventListener("change", updateManualFields); updateManualFields();
    [[text("source_select"), sourceSelect], [text("placement"), placementSelect], [text("month"), periodInput],
      [text("ai_citations"), citationsInput], [text("views"), viewsInput], [text("clicks"), clicksInput],
      [text("link"), linkInput], [text("proof"), proofInput]].forEach(function (entry) {
      form.appendChild(node("label", {}, [entry[0], entry[1]]));
    });
    var submit = node("button", { type: "submit", class: "btn main", text: text("save") });
    var message = node("p", { role: "status", "aria-live": "polite" });
    form.appendChild(submit); form.appendChild(message);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submit.disabled = true;
      var values = sourceSelect.value === "bing_ai" ? [{ metric: "ai_citations", value: Number(citationsInput.value) }] :
        [["views", viewsInput], ["clicks", clicksInput]].filter(function (entry) { return entry[1].value !== ""; })
          .map(function (entry) { return { metric: entry[0], value: Number(entry[1].value) }; });
      api("/api/sponsor/manual-metric", { method: "POST", body: {
        source: sourceSelect.value, placement_id: placementSelect.value, period: periodInput.value, values: values,
        link: linkInput.value, proof_key: proofInput.value
      } }).then(function (result) {
        message.textContent = result.status === 200 ? text("saved") : text("invalid");
        if (result.status === 200) form.reset();
      }).catch(function () { message.textContent = text("invalid"); }).finally(function () { submit.disabled = false; });
    });
    root.appendChild(form);
    var assignment = node("form", { class: "sdb-form" }, [
      node("h2", { text: text("assign_placement") }), node("p", { class: "mut", text: text("placement_help") })
    ]);
    var company = node("select", { name: "org_id", required: "" });
    orgs.forEach(function (org) { company.appendChild(node("option", { value: org.id, text: org.name })); });
    var placementId = node("input", { name: "id", maxlength: "64", pattern: "[a-z0-9][a-z0-9-]{1,63}", required: "" });
    var title = node("input", { name: "title", maxlength: "160", required: "" });
    var channel = node("select", { name: "channel" }, ["podcast_video", "website", "press", "event", "app"].map(function (value) {
      return node("option", { value: value, text: text(value) });
    }));
    var languages = node("input", { name: "langs", maxlength: "120", placeholder: "en,de" });
    var start = node("input", { name: "start", type: "date" });
    var end = node("input", { name: "end", type: "date" });
    var refs = node("textarea", { name: "refs", maxlength: "4000", rows: "4", placeholder: '{"video_ids":[],"mention_sec":0,"press_release":""}' });
    [[text("company"), company], [text("placement_id"), placementId], [text("placement_name"), title],
      [text("channel"), channel], [text("languages"), languages], [text("start"), start], [text("end"), end], [text("refs"), refs]]
      .forEach(function (entry) { assignment.appendChild(node("label", {}, [entry[0], entry[1]])); });
    var assignSubmit = node("button", { type: "submit", class: "btn main", text: text("save") });
    var assignStatus = node("p", { role: "status", "aria-live": "polite" });
    assignment.appendChild(assignSubmit); assignment.appendChild(assignStatus);
    assignment.addEventListener("submit", function (event) {
      event.preventDefault();
      var parsed = {};
      try { parsed = refs.value ? JSON.parse(refs.value) : {}; } catch (_) {
        assignStatus.textContent = text("invalid"); return;
      }
      assignSubmit.disabled = true;
      api("/api/sponsor/placement", { method: "POST", body: {
        org_id: Number(company.value), id: placementId.value, title: title.value,
        channel: channel.value, langs: languages.value, start: start.value || null, end: end.value || null, refs: parsed
      } }).then(function (result) {
        assignStatus.textContent = result.status === 200 ? text("saved") : text("invalid");
        if (result.status === 200) assignment.reset();
      }).catch(function () { assignStatus.textContent = text("invalid"); }).finally(function () { assignSubmit.disabled = false; });
    });
    root.appendChild(assignment);
  }
  var currentPreset = "30";
  function loadDashboard(orgHandle, preset) {
    var explicitPreset = !!preset;
    var params = new URLSearchParams(location.search);
    var month = params.get("month");
    var from, to;
    if (C.view === "report" && month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      from = month + "-01";
      var end = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0));
      to = end.toISOString().slice(0, 10);
    } else if (params.get("from") && params.get("to") && !explicitPreset) {
      from = params.get("from"); to = params.get("to");
    } else if ((preset || currentPreset) === "campaign" || (preset || currentPreset) === "year") {
      var known = currentOrgs.find(function (item) { return item.handle === (orgHandle || params.get("org")); }) || currentOrgs[0];
      var range = rangeFor(preset || currentPreset, known || { placements: [] });
      from = range[0]; to = range[1];
    } else {
      var defaultRange = rangeFor("30", { placements: [] });
      from = defaultRange[0]; to = defaultRange[1];
    }
    if (preset) currentPreset = preset;
    var query = new URLSearchParams({ from: from, to: to });
    var selectedOrg = orgHandle || params.get("org");
    if (selectedOrg) query.set("org", selectedOrg);
    root.setAttribute("aria-busy", "true");
    api("/api/sponsor/dashboard?" + query.toString()).then(function (result) {
      if (result.status === 401) { login(); return; }
      if (result.status !== 200) { root.textContent = text("error"); return; }
      var orgs = result.json.orgs || [], admin = !!result.json.admin;
      currentPeriod = result.json.period;
      currentOrgs = orgs;
      currentCompanies = result.json.companies || orgs;
      currentAdmin = admin;
      if (C.view === "sources") {
        if (!admin) { header(orgs, admin); root.appendChild(node("p", { class: "mut", text: text("admin_only") })); return; }
        api("/api/sponsor/sources").then(function (data) {
          if (data.status !== 200) { root.textContent = text("admin_only"); return; }
          renderSources(data.json, true);
        }).catch(function () { root.textContent = text("error"); });
        return;
      }
      if (!orgs.length) { root.textContent = text("no_orgs"); return; }
      if (C.view === "placement") renderDetail(orgs, admin);
      else if (C.view === "report") renderReport(orgs, admin);
      else renderOverview(orgs, admin);
    }).catch(function () { root.textContent = text("error"); }).finally(function () {
      root.removeAttribute("aria-busy");
    });
  }
  var requestedPreset = new URLSearchParams(location.search).get("period");
  loadDashboard("", ["30", "campaign", "year"].indexOf(requestedPreset) >= 0 ? requestedPreset : "");
})();
