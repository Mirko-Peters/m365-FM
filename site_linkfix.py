"""Repariert interne Verweise auf Folgen, Blogbeitraege und Entitaeten."""
from collections import defaultdict
from html.parser import HTMLParser
import html
import re
import unicodedata
from urllib.parse import urlsplit


_HOSTS = {"m365.fm", "www.m365.fm"}
_LANGS = {"de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"}
_STOP = {
    "a", "an", "and", "at", "based", "by", "de", "des", "du", "for", "from", "how", "in", "la", "le",
    "les", "of", "on", "the", "to", "with",
}
_ANCHOR = re.compile(r"<a\b([^>]*)>(.*?)</a\s*>", re.I | re.S)
_HREF = re.compile(r"(\s+href\s*=\s*)(['\"])(.*?)\2", re.I | re.S)
_WORDS = re.compile(r"\w+", re.UNICODE)
_VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


def _key(path):
    path = re.sub(r"/+", "/", path or "/")
    return (path.rstrip("/") or "/").casefold()


def _tokens(text):
    words = _WORDS.findall(str(text or "").casefold())
    normalized = (''.join(c for c in unicodedata.normalize("NFKD", word) if not unicodedata.combining(c)) for word in words)
    return frozenset(word for word in normalized if word not in _STOP)


def _records(values, kind):
    if isinstance(values, dict):
        values = values.values()
    result = []
    for item in values or ():
        if isinstance(item, str):
            slug, title, handle, lang = item, "", "", "en"
        else:
            slug = item.get("slug") or item.get("id") or ""
            title = item.get("title") or item.get("name") or ""
            handle = item.get("handle") or ""
            lang = item.get("lang") or "en"
            if not title and isinstance(item.get("e"), dict):
                title = item["e"].get("title") or ""
        if slug:
            result.append((str(slug).strip("/"), str(title), kind, str(handle), str(lang)))
    return tuple(result)


def build_index(redirects=None, episodes=(), blogs=(), entities=(), renames=None, known_routes=()):
    redirects_by_key = {}
    for source, target in (redirects or {}).items():
        path = urlsplit(str(source)).path
        if path and target:
            redirects_by_key[_key(path)] = (str(target), "redirect")

    routes = {}
    files = set()
    for route in known_routes or ():
        path = urlsplit(str(route)).path
        if not path:
            continue
        routes[_key(path)] = path
        files.add(_key(path))

    eps = _records(episodes, "episode")
    posts = _records(blogs, "blog")
    ents = _records(entities, "entity")
    ep_by_slug, blog_by_slug, ent_by_slug = {}, defaultdict(list), {}
    for slug, title, _, _, _ in eps:
        target = f"/show/episodes/{slug}/"
        if _key(target) in files or _key(target) in redirects_by_key:
            ep_by_slug[slug.casefold()] = target
    for slug, title, _, handle, lang in posts:
        prefix = f"/{lang}" if lang in _LANGS else ""
        target = f"{prefix}/community/u/{handle}/blog/{slug}/"
        if handle and (_key(target) in files or _key(target) in redirects_by_key):
            blog_by_slug[slug.casefold()].append((target, lang, title))
    for slug, _, _, _, _ in ents:
        target = f"/entity/{slug}/"
        if _key(target) in files or _key(target) in redirects_by_key:
            ent_by_slug[slug.casefold()] = target

    rename_map = {str(old).casefold(): str(new) for old, new in (renames or {}).items()}
    title_candidates = {}
    inverted = defaultdict(set)
    title_exact = defaultdict(set)
    for record in eps + posts:
        slug, title, kind, handle, lang = record
        if kind == "blog" and not handle:
            continue
        for language in {lang}:
            if not title:
                continue
            token_set = _tokens(title)
            if len(token_set) < 3:
                continue
            if kind == "episode":
                target = ep_by_slug.get(slug.casefold())
            else:
                target = next((route for route, route_lang, _ in blog_by_slug.get(slug.casefold(), ())
                               if route_lang == lang), None)
            if not target:
                continue
            candidate = (slug.casefold(), kind, language, target, token_set)
            title_candidates[candidate] = token_set
            exact_title = " ".join(unicodedata.normalize("NFKC", title).casefold().split())
            title_exact[(language, exact_title)].add((target, kind))
            for token in token_set:
                inverted[(language, token)].add(candidate)

    return {
        "redirects": redirects_by_key,
        "routes": routes,
        "files": files,
        "episodes": ep_by_slug,
        "blogs": dict(blog_by_slug),
        "entities": ent_by_slug,
        "renames": rename_map,
        "title_candidates": title_candidates,
        "inverted": dict(inverted),
        "title_exact": dict(title_exact),
        "cache": {},
        "aliases": {},
    }


def _page_lang(page):
    first = str(page or "").strip("/").split("/", 1)[0].casefold()
    return first if first in _LANGS else "en"


def _choose_blog(records, lang, index):
    preferred = sorted(records, key=lambda row: (row[1] != lang, row[1] != "en"))
    for target, _, _ in preferred:
        key = _key(target)
        if key in index["files"] or key in index["redirects"]:
            return target
    return None


def _title_match(path, link_text, lang, index):
    exact_text = " ".join(unicodedata.normalize("NFKC", str(link_text or "")).casefold().split())
    exact_matches = set()
    if exact_text:
        exact_matches.update(index["title_exact"].get((lang, exact_text), ()))
        exact_matches.update(index["title_exact"].get(("en", exact_text), ()))
    slug_tokens = _tokens(path.strip("/").rsplit("/", 1)[-1].replace("-", " "))
    if len(slug_tokens) < 3:
        if len(exact_matches) == 1:
            return next(iter(exact_matches))[0], "title"
        return None
    query = slug_tokens
    by_token = index["inverted"]
    candidate_ids = set()
    for token in query:
        candidate_ids.update(by_token.get((lang, token), ()))
        candidate_ids.update(by_token.get(("en", token), ()))
    scored = []
    for slug, kind, candidate_lang, target, tokens in candidate_ids:
        overlap = len(query & tokens)
        slug_coverage = overlap / len(query)
        title_coverage = overlap / len(tokens)
        if slug_coverage < 0.82 or title_coverage < 0.82:
            continue
        scored.append((min(slug_coverage, title_coverage), slug_coverage + title_coverage,
                       slug, kind, target, candidate_lang, tokens))
    scored.sort(key=lambda row: row[:-1], reverse=True)
    if not scored:
        if len(exact_matches) == 1:
            return next(iter(exact_matches))[0], "title"
        return None
    best = scored[0]
    second = scored[1][0] if len(scored) > 1 else 0
    if best[0] < 0.88:
        matching = {row[4] for row in scored} & {target for target, _kind in exact_matches}
        if len(matching) == 1:
            return next(iter(matching)), "title"
        return None
    # Der Linktext kann einen bereits durch den href-Slug passenden Gleichstand aufloesen, aber keinen Kandidaten einfuehren.
    text_tokens = _tokens(link_text)
    tied = [row for row in scored if best[0] - row[0] < 0.12]
    if len(tied) > 1 and text_tokens:
        tied.sort(key=lambda row: (len(text_tokens & row[6]) / max(len(text_tokens), 1), row[1]), reverse=True)
        if len(tied) == 1 or len(text_tokens & tied[0][6]) > len(text_tokens & tied[1][6]):
            best = tied[0]
        else:
            matching = {row[4] for row in tied} & {target for target, _kind in exact_matches}
            if len(matching) != 1:
                return None
            best = next(row for row in tied if row[4] in matching)
    elif best[0] - second < 0.12:
        return None
    return best[4], "title"


def _worker_fallback(path, suffix, lang, index):
    """Gibt das Ziel zurueck, das sitewrk legacyTarget ohne redirects liefert."""
    path = path.rstrip("/") or "/"
    low = path.casefold()
    if not path or path == "/" or re.search(r"\.[a-z0-9]{2,5}$", path, re.I):
        return None
    if re.match(r"^/(assets|og|covers|fonts|\.well-known)(/|$)", low):
        return None
    if re.match(r"^/shows?(?:/|$)", low) and not (low == "/show/blog" or low.startswith("/show/blog/")):
        return None
    if re.match(r"^/categories(?:/|$)", low):
        return "/show/episodes/" + suffix, "worker"
    podcast = re.fullmatch(r"/m365-fm-podcast/([a-z0-9-]+)", low)
    if podcast:
        slug = podcast.group(1)
        slug = index["renames"].get(slug, slug)
        target = index["episodes"].get(slug)
        return ((target or f"/show/episodes/{slug}/") + suffix, "worker")
    m = re.match(r"^/(blog|videos|p)/(.+)$", low)
    if m:
        slug = m.group(2).strip("/")
        if "/" not in slug:
            episode = index["episodes"].get(slug)
            if episode:
                return episode + suffix, "worker"
            blog = _choose_blog(index["blogs"].get(slug, ()), lang, index)
            if blog:
                return blog + suffix, "worker"
        return "/show/" + suffix, "worker"
    return None


def _resolve_uncached(path, index, link_text, lang):
    try:
        parsed = urlsplit(str(path or "").strip())
    except ValueError:
        return None
    try:
        host = parsed.hostname.casefold() if parsed.hostname else ""
    except ValueError:
        return None
    if parsed.scheme and (parsed.scheme.casefold() not in ("http", "https") or host not in _HOSTS):
        return None
    if parsed.netloc and host not in _HOSTS:
        return None
    source_path = parsed.path or "/"
    suffix = ("?" + parsed.query if parsed.query else "") + ("#" + parsed.fragment if parsed.fragment else "")
    key = _key(source_path)
    if key in index["redirects"]:
        return index["redirects"][key][0] + suffix, index["redirects"][key][1]
    if key in index["aliases"]:
        target, method = index["aliases"][key]
        return target + suffix, method
    route = index["routes"].get(key)
    if route:
        return route + suffix, "route"

    low = source_path.casefold()
    slug = source_path.strip("/").rsplit("/", 1)[-1].casefold()
    segments = [part for part in source_path.strip("/").split("/") if part]
    lower_segments = [part.casefold() for part in segments]
    if slug in index["episodes"] and (len(segments) == 1 or lower_segments[-2:] == ["episodes", slug]):
        return index["episodes"][slug] + suffix, "episode"
    if slug in index["blogs"] and (len(segments) == 1 or lower_segments[-2:] == ["blog", slug]):
        target = _choose_blog(index["blogs"][slug], lang, index)
        if target:
            return target + suffix, "blog"
    if slug in index["entities"] and (len(segments) == 1 or lower_segments[-2:] == ["entity", slug]):
        return index["entities"][slug] + suffix, "entity"

    # Nur die von site_podpage.rename_links unterstuetzten Slugformen umbenennen.
    flat = len(segments) == 1
    episode_route = len(segments) >= 3 and lower_segments[-3:-1] == ["show", "episodes"]
    renamed = index["renames"].get(slug) if flat or episode_route else None
    if renamed:
        target = index["episodes"].get(renamed.casefold())
        if target:
            if episode_route:
                prefix = "/" + "/".join(segments[:-1]) + "/"
                target = prefix + renamed + "/"
            return target + suffix, "rename"

    # Diese Faelle beantworten Worker-Regeln vor jedem Titelabgleich.
    fallback = _worker_fallback(source_path, suffix, lang, index)
    if fallback:
        return fallback

    # Legacy MAPPABLE beschraenkt sich auf Kandidaten, die der Worker ueberhaupt als Altpfad prueft.
    if re.match(r"^/(?:shows?(?:/|$)|categories(?:/|$)|m365-fm-podcast(?:/|$))", low):
        return None
    if len(segments) == 1:
        return _title_match(source_path, link_text, lang, index)
    return None


def resolve_detail(path, index, link_text="", lang="en"):
    """-> (Zielpfad, Methode) oder None; Ergebnisse werden je URL, Text und Sprache gecacht."""
    try:
        parsed = urlsplit(str(path or "").strip())
    except ValueError:
        return None
    try:
        host = parsed.hostname.casefold() if parsed.hostname else ""
    except ValueError:
        return None
    if parsed.scheme and (parsed.scheme.casefold() not in ("http", "https") or host not in _HOSTS):
        return None
    if parsed.netloc and host not in _HOSTS:
        return None
    cache_key = (_key(parsed.path), parsed.query, parsed.fragment, _tokens(link_text), lang)
    if cache_key not in index["cache"]:
        if len(index["cache"]) >= 100000:
            index["cache"].clear()
        index["cache"][cache_key] = _resolve_uncached(path, index, link_text, lang)
    return index["cache"][cache_key]


def resolve(path, index, link_text="", lang="en"):
    result = resolve_detail(path, index, link_text, lang)
    return result[0] if result else None


def build_aliases(resolved, unresolved, index):
    """Gibt nur eindeutige, ungelöste Root-Links mit stabiler Resolver-Methode zurück."""
    candidates = defaultdict(set)
    unresolved_paths = {_key(urlsplit(row[0]).path) for row in unresolved}
    for old, new, method, _count in resolved:
        if method not in {"episode", "blog", "entity", "rename"}:
            continue
        old_path = urlsplit(old).path
        new_path = urlsplit(new).path
        if re.fullmatch(r"/[^/]+/?", old_path) and new_path and _key(old_path) != _key(new_path):
            candidates[_key(old_path)].add((new_path, method))
    aliases = {}
    for path, targets in candidates.items():
        if len(targets) != 1 or path in unresolved_paths:
            continue
        if path in index["routes"] or path in index["redirects"]:
            continue
        aliases[path] = next(iter(targets))
    return aliases


class _Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def _link_text(markup):
    parser = _Text()
    parser.feed(markup)
    return " ".join("".join(parser.parts).split())


class _ContentRanges(HTMLParser):
    def __init__(self, source, show_page):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.show_page = show_page
        self.offsets = [0]
        offset = source.find("\n")
        while offset >= 0:
            self.offsets.append(offset + 1)
            offset = source.find("\n", offset + 1)
        self.stack = []
        self.ranges = []

    def _offset(self):
        line, col = self.getpos()
        return self.offsets[min(line - 1, len(self.offsets) - 1)] + col

    def handle_starttag(self, tag, attrs):
        start = self._offset()
        raw = self.get_starttag_text() or ""
        end = start + len(raw)
        classes = set((dict(attrs).get("class") or "").split())
        selected = bool(classes & {"pp-notes", "wk-body"})
        selected = selected or (self.show_page and tag == "article")
        if tag not in _VOID:
            self.stack.append((tag, end, selected))
        elif selected:
            self.ranges.append((start, end))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in _VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        end_start = self._offset()
        end = self.source.find(">", end_start)
        end = len(self.source) if end < 0 else end + 1
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                _, content_start, selected = self.stack[i]
                del self.stack[i:]
                if selected:
                    self.ranges.append((content_start, end_start))
                break


def content_ranges(markup, page):
    show_page = str(page).startswith("/show/") and not str(page).startswith("/show/episodes/")
    parser = _ContentRanges(markup or "", show_page)
    parser.feed(markup or "")
    return sorted(parser.ranges)


def might_have_content(markup, page):
    source = markup or ""
    lower = source.lower()
    return "pp-notes" in lower or "wk-body" in lower or (
        str(page).startswith("/show/") and not str(page).startswith("/show/episodes/")
        and "<article" in lower
    )


def _anchors(markup):
    for match in _ANCHOR.finditer(markup or ""):
        full = match.group(0)
        href = _HREF.search(match.group(1))
        if not href:
            continue
        yield match, full, match.group(1), href, match.group(2), full[match.end(2) - match.start():]


def rewrite_html(markup, page, index, rewrite=True, stats=None):
    """Bearbeitet nur Inhaltsbereiche; liefert HTML und erkannte Linkveraenderungen."""
    source = markup or ""
    resolved, unresolved = [], []
    if not might_have_content(source, page):
        return source, resolved, unresolved
    lang = _page_lang(page)
    ranges = content_ranges(source, page)
    if not ranges:
        return source, resolved, unresolved
    output = []
    cursor = 0
    for start, end in ranges:
        if start < cursor:
            continue
        chunk = source[start:end]
        pieces, chunk_cursor = [], 0
        for match, full, attrs, href, body, closing in _anchors(chunk):
            old = html.unescape(href.group(3))
            try:
                parsed = urlsplit(old)
            except ValueError:
                continue
            internal = (
                (not parsed.scheme and not parsed.netloc and parsed.path.startswith("/") and not parsed.path.startswith("//"))
                or (parsed.scheme.casefold() in ("http", "https") and parsed.hostname and parsed.hostname.casefold() in _HOSTS)
            )
            if not internal:
                continue
            link_text = _link_text(body)
            detail = resolve_detail(old, index, link_text, lang)
            prefix = "/" + (parsed.path.strip("/").split("/", 1)[0].casefold() if parsed.path.strip("/") else "")
            if stats is not None:
                row = stats.setdefault(prefix, {"seen": 0, "kept": 0, "rewritten": 0, "unlinked": 0})
                row["seen"] += 1
            if not detail:
                unresolved.append((parsed.path or "/", 1))
                if stats is not None:
                    row["unlinked"] += 1
                if rewrite:
                    pieces.append(chunk[chunk_cursor:match.start()])
                    pieces.append(body)
                    chunk_cursor = match.end()
                continue
            target, method = detail
            target_path = urlsplit(target).path
            if parsed.path == target_path:
                if stats is not None:
                    row["kept"] += 1
                continue
            resolved.append((old, target, method, 1))
            if stats is not None:
                row["rewritten"] += 1
            if rewrite:
                pieces.append(chunk[chunk_cursor:match.start()])
                new_attrs = _HREF.sub(
                    lambda h: h.group(1) + h.group(2) + html.escape(target, quote=False) + h.group(2),
                    attrs, count=1)
                pieces.append("<a" + new_attrs + ">" + body + closing)
                chunk_cursor = match.end()
        if rewrite:
            pieces.append(chunk[chunk_cursor:])
            output.extend((source[cursor:start], "".join(pieces)))
        cursor = end
    if not rewrite:
        return source, resolved, unresolved
    output.append(source[cursor:])
    return "".join(output), resolved, unresolved
