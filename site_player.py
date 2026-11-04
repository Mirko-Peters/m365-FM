import html
import re
from urllib.parse import urlsplit

import site_r2 as R2


def _cover_url(value):
    if not value:
        return ""
    url = html.unescape(R2.rewrite(html.escape(str(value), quote=True)))
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname != "img.m365.fm" or parsed.username or parsed.password:
        return ""
    return url


def _duration_label(value):
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        seconds = int(value)
    else:
        match = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", str(value or ""))
        if match and any(match.groups()):
            hours, minutes, seconds = (int(x or 0) for x in match.groups())
            seconds += hours * 3600 + minutes * 60
        else:
            return str(value or "")
    if seconds < 0:
        return ""
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)
    return f"{hours}:{minutes:02}:{seconds:02}" if hours else f"{minutes}:{seconds:02}"


def facade(episode_id, title, image="", duration=""):
    episode_id = str(episode_id or "")
    if not episode_id.isdigit():
        return ""
    title = str(title or "")
    image = _cover_url(image)
    cover = (f'<img src="{html.escape(image, quote=True)}" alt="{html.escape(title, quote=True)}" '
             'width="120" height="120" loading="lazy" decoding="async" '
             'style="width:120px;height:120px;object-fit:cover;flex:none">') if image else ""
    duration = _duration_label(duration)
    duration_html = (f'<span style="display:block;color:var(--mut);font-size:.9em">{html.escape(duration)}</span>'
                     if duration else "")
    return (f'<button class="sp-player" type="button" data-spreaker-id="{episode_id}" '
            f'data-spreaker-title="{html.escape(title, quote=True)}" aria-label="Folge abspielen" '
            'style="display:flex;align-items:center;gap:1rem;width:100%;height:200px;min-height:200px;'
            'padding:1rem;overflow:hidden;text-align:start;color:var(--fg);background:var(--card);'
            'border:1px solid var(--bd);font:inherit;cursor:pointer">'
            f'{cover}<span style="flex:1;min-width:0"><span style="display:block;font-weight:700;line-height:1.3">'
            f'{html.escape(title)}</span>{duration_html}</span>'
            '<span aria-hidden="true" style="display:grid;place-items:center;flex:none;width:64px;height:64px;'
            'border-radius:50%;background:var(--ac);color:var(--onac);font-size:1.8rem">▶</span></button>')
