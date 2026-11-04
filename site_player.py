"""Externe Player erst nach ausdruecklicher Aktivierung laden."""
from html import escape
from urllib.parse import quote

from site_i18n import T


CSS = """
.media-player{position:relative;width:100%;background:var(--ink);color:var(--onink);overflow:hidden}
.media-player-video{aspect-ratio:16/9}
.media-player>button,.media-player>iframe,.media-player>.media-fallback{position:absolute;inset:0;box-sizing:border-box;width:100%;height:100%;border:0;margin:0}
.media-player>button,.media-player>.media-fallback{display:flex;align-items:center;justify-content:center;gap:1rem;padding:1rem;background:transparent;color:inherit;font:inherit;text-align:center;cursor:pointer}
.media-player>button[hidden],.media-player>.media-fallback[hidden]{display:none}
.media-player svg{width:2.5rem;height:2.5rem;flex:none;fill:currentColor}
.media-player>button:focus-visible{outline:3px solid var(--ac);outline-offset:-5px}
.media-player>iframe{display:block;background:var(--card)}
"""


def player(provider, media_id, title, lang="en", height=131):
    mid = quote(str(media_id), safe="")
    if provider == "youtube":
        src = f"https://www.youtube-nocookie.com/embed/{mid}?rel=0"
        link = f"https://www.youtube.com/watch?v={mid}"
        label = T(lang, "Play video", "Video abspielen") + " (YouTube)"
        size = 'class="media-player media-player-video"'
    elif provider == "spreaker":
        src = f"https://widget.spreaker.com/player?episode_id={mid}&theme=light&playlist=false"
        link = f"https://www.spreaker.com/episode/{mid}"
        label = T(lang, "Play episode", "Folge abspielen") + " (Spreaker)"
        size = f'class="media-player" style="height:{int(height)}px"'
    else:
        raise ValueError("Unbekannter Player")
    title = escape(title, quote=True)
    label = escape(label, quote=True)
    return (f'<div {size}><button type="button" hidden data-player-src="{escape(src, quote=True)}" '
            f'data-player-provider="{provider}" aria-label="{label}: {title}">'
            f'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 4v16l13-8z"/></svg>'
            f'<span>{label}: {title}</span></button>'
            f'<a class="media-fallback" href="{escape(link, quote=True)}" rel="noopener">{label}: {title}</a></div>')
