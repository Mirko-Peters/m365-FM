"""Repariert interne Verweise auf Folgen, Blogbeitraege und Entitaeten."""
import html
from html.parser import HTMLParser
import re
from urllib.parse import urlsplit


_HOSTS = {"m365.fm", "www.m365.fm"}
_STOP = {"a", "an", "and", "at", "by", "for", "from", "how", "in", "of", "on", "the", "to", "with"}
_ANCHOR = re.compile(r"<a\b[^>]*>.*?</a\s*>", re.I | re.S)
_OPEN = re.compile(r"^<a\b([^>]*)>", re.I | re.S)
_HREF = re.compile(r"(\s+href\s*=\s*)(['\"])(.*?)\2", re.I | re.S)


def _path(value):
    p = urlsplit(str(value))
    return p.path or "/", p.query, p.fragment


def _key(path):
    path = re.sub(r"/+", "/", path or "/")
    if path != "/":
        path = path.rstrip("/")
    return path.casefold()


def _records(values, kind):
    if isinstance(values, dict):
        values = values.values()
    result = []
    for item in values or ():
        if isinstance(item, str):
            slug, title = item, ""
        else:
            slug = item.get("slug") or item.get("id") or ""
            title = item.get("title") or item.get("name") or ""
            if not title and isinstance(item.get("e"), dict):
                title = item["e"].get("title") or ""
        if slug:
            result.append((str(slug).strip("/"), str(title), kind))
    return tuple(result)


def build_index(redirects=None, episodes=(), blogs=(), entities=(), renames=None, known_routes=()):
    """Erstellt einen unveraenderlichen Suchindex aus den im Bau verfuegbaren Routen."""
    redirect_map = {}
    for source, target in (redirects or {}).items():
        path, _, _ = _path(source)
        if path and target:
            redirect_map[_key(path)] = str(target)

    eps = _records(episodes, "episode")
    posts = _records(blogs, "blog")
    ents = _records(entities, "entity")
    routes = {}
    for route in known_routes or ():
        path, _, _ = _path(route)
        if path:
            routes[_key(path)] = path

    return {
        "redirects": redirect_map,
        "episodes": eps,
        "blogs": posts,
        "entities": ents,
        "renames": dict(renames or {}),
        "routes": routes,
    }


def _tokens(text):
    words = re.findall(r"[a-z0-9]+", str(text or "").casefold())
    return {word for word in words if word not in _STOP}


def _title_match(path, link_text, index):
    choices = index["episodes"] + index["blogs"]
    queries = []
    for value in (link_text, path.strip("/").rsplit("/", 1)[-1].replace("-", " ")):
        tokens = _tokens(value)
        if len(tokens) >= 3 and tokens not in queries:
            queries.append(tokens)
    for query in queries:
        scored_by_target = {}
        for slug, title, kind in choices:
            tokens = _tokens(title)
            if len(tokens) < 3:
                continue
            overlap = len(query & tokens)
            coverage = overlap / len(query)
            precision = overlap / len(tokens)
            score = 0.75 * coverage + 0.25 * precision
            target = (slug, kind)
            candidate = (score, coverage, slug, kind)
            if target not in scored_by_target or candidate > scored_by_target[target]:
                scored_by_target[target] = candidate
        scored = list(scored_by_target.values())
        scored.sort(reverse=True)
        if not scored:
            continue
        best = scored[0]
        second = scored[1][0] if len(scored) > 1 else 0
        if best[1] >= 0.8 and best[0] - second >= 0.15:
            prefix = "/show/episodes/" if best[3] == "episode" else "/community/u/mirko-p/blog/"
            return prefix + best[2] + "/", "title"
    return None


def resolve_detail(path, index, link_text=""):
    """-> (Zielpfad, Methode) oder None; Query und Fragment bleiben erhalten."""
    raw = str(path or "").strip()
    try:
        parsed = urlsplit(raw)
    except ValueError:
        return None
    host = parsed.hostname.casefold() if parsed.hostname else ""
    if parsed.scheme and (parsed.scheme.casefold() not in ("http", "https") or host not in _HOSTS):
        return None
    if parsed.netloc and host not in _HOSTS:
        return None
    source_path = parsed.path or "/"
    suffix = ("?" + parsed.query if parsed.query else "") + ("#" + parsed.fragment if parsed.fragment else "")
    key = _key(source_path)

    target = index["redirects"].get(key)
    if target:
        return target + suffix, "redirect"

    target = index["routes"].get(key)
    if target:
        return target + suffix, "route"

    slug = source_path.strip("/").split("/")[-1]
    segments = [part for part in source_path.strip("/").split("/") if part]
    lower_segments = [part.casefold() for part in segments]

    episode_slugs = {item[0].casefold(): item[0] for item in index["episodes"]}
    blog_slugs = {item[0].casefold(): item[0] for item in index["blogs"]}
    entity_slugs = {item[0].casefold(): item[0] for item in index["entities"]}
    rename_map = {str(old).casefold(): str(new) for old, new in index["renames"].items()}
    renamed = rename_map.get(slug.casefold())
    if renamed and renamed.casefold() in episode_slugs:
        renamed = episode_slugs[renamed.casefold()]
        prefix = "/".join(segments[:-1])
        target = f"/{prefix + '/' if prefix else ''}{renamed}/"
        if len(segments) >= 2 and lower_segments[-2] == "episodes":
            target = f"/{'/'.join(segments[:-1])}/{renamed}/"
        else:
            target = f"/show/episodes/{renamed}/"
        return target + suffix, "rename"

    if slug.casefold() in episode_slugs and (len(segments) == 1 or (len(segments) >= 2 and lower_segments[-2:] == ["episodes", slug.casefold()])):
        return f"/show/episodes/{episode_slugs[slug.casefold()]}/{suffix}", "episode"
    if slug.casefold() in blog_slugs and (
        len(segments) == 1
        or lower_segments[-2:] == ["blog", slug.casefold()]
    ):
        return f"/community/u/mirko-p/blog/{blog_slugs[slug.casefold()]}/{suffix}", "blog"
    if slug.casefold() in entity_slugs and (len(segments) == 1 or lower_segments[-2:] == ["entity", slug.casefold()]):
        return f"/entity/{entity_slugs[slug.casefold()]}/{suffix}", "entity"

    matched = _title_match(source_path, link_text, index)
    if matched:
        return matched[0] + suffix, matched[1]
    return None


def resolve(path, index, link_text=""):
    """-> aufgeloester Zielpfad oder None."""
    result = resolve_detail(path, index, link_text)
    return result[0] if result else None


class _Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def _link_text(markup):
    parser = _Text()
    parser.feed(markup)
    return re.sub(r"\s+", " ", "".join(parser.parts)).strip()


def rewrite_html(markup, page, index):
    """Schreibt interne Links um und liefert (HTML, geloest, ungeloest)."""
    resolved, unresolved = [], []

    def replace(match):
        full = match.group(0)
        opening = _OPEN.match(full)
        if not opening:
            return full
        attrs = opening.group(1)
        href = _HREF.search(attrs)
        if not href:
            return full
        old = html.unescape(href.group(3))
        try:
            parsed = urlsplit(old)
        except ValueError:
            return full
        is_internal = (
            (not parsed.scheme and not parsed.netloc and parsed.path.startswith("/") and not parsed.path.startswith("//"))
            or (parsed.scheme.casefold() in ("http", "https") and parsed.hostname and parsed.hostname.casefold() in _HOSTS)
        )
        if not is_internal:
            return full
        closing = full.casefold().rfind("</a")
        body = full[opening.end():closing] if closing >= 0 else full[opening.end():]
        text = _link_text(body)
        detail = resolve_detail(old, index, text)
        if not detail:
            unresolved.append({"page": page, "link": old, "text": text})
            return html.escape(text) + (full[closing:] if closing >= 0 else "")
        target, method = detail
        if old != target:
            resolved.append({"page": page, "old": old, "new": target, "method": method})
        new_attrs = _HREF.sub(lambda h: h.group(1) + h.group(2) + html.escape(target, quote=False) + h.group(2), attrs, count=1)
        return "<a" + new_attrs + ">" + body + (full[closing:] if closing >= 0 else "")

    return _ANCHOR.sub(replace, markup or ""), resolved, unresolved
