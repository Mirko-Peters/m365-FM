"""Externe Player (YouTube, Spreaker) erst nach Klick laden (Fassade).

Vorher stand auf jeder Folgenseite ein Spreaker- und ein YouTube-iframe im HTML. Beide luden sofort (loading=lazy greift im ersten Bildschirm
nicht) und brachten zusammen weit ueber 1 MB fremdes JavaScript mit: auf dem Handy der groesste Teil der Blockierzeit (TBT) und Bandbreite,
die Schriften und CSS fuer den ersten Bildschirm (LCP) fehlte.

Jetzt steht an ihrer Stelle ein leichter Platzhalter mit festen Massen (YouTube 16:9, Spreaker 131 px bzw. die bisherige Hoehe), also kein
Layoutsprung (CLS), wenn der Player erscheint. Ohne JavaScript ist der Platzhalter ein normaler Link auf die Folge bei YouTube bzw. Spreaker.
assets/page.js macht daraus einen <button> (Tastatur, aria-label) und setzt beim Klick das echte iframe mit Autoplay ein.

Bewusst ohne Vorschaubild: kein Bild von i.ytimg.com (fremder Host, CLAUDE.md) und keine zusaetzliche Anfrage; der Platzhalter ist reines CSS.
Die strukturierten Daten (VideoObject.embedUrl usw.) bauen die Seiten weiter selbst und bleiben unveraendert."""
from html import escape
from urllib.parse import quote

HOSTS = ("www.youtube-nocookie.com", "widget.spreaker.com")   # nur diese Ziele setzt page.js als iframe ein

CSS = (".mp{position:relative;display:block;width:100%;overflow:hidden;contain:layout paint;border-radius:4px}"
       ".mp-v{aspect-ratio:16/9;background:#141210 radial-gradient(120% 95% at 18% 8%,#3a3f4a 0,transparent 62%);color:#f6f1ea}"
       ".mp-s{height:131px;background:var(--card);color:var(--fg);border:1px solid var(--bd);box-sizing:border-box}"
       ".mp>.mp-l{position:absolute;inset:0;display:flex;align-items:center;gap:14px;width:100%;height:100%;margin:0;padding:14px 18px;border:0;background:none;"
       "color:inherit;font:inherit;text-align:start;text-decoration:none;cursor:pointer;box-sizing:border-box}"
       ".mp-v>.mp-l{flex-direction:column;justify-content:center;text-align:center;padding:16px 8%}"
       ".mp i{flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--ac);color:var(--onac,#fff);box-shadow:0 6px 18px #0004}"
       ".mp-s i{width:52px;height:52px}"
       ".mp svg{width:42%;height:42%;fill:currentColor;margin-inline-start:7%}"
       ".mp b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-weight:600;line-height:1.3}"
       ".mp small{display:block;margin-top:4px;opacity:.75;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase}"
       ".mp>.mp-l:hover i{filter:brightness(1.12)}.mp>.mp-l:focus-visible{outline:3px solid var(--ac);outline-offset:-3px}"
       ".mp>iframe{position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:0;background:var(--card)}"
       "@media (max-width:560px){.mp i{width:54px;height:54px}.mp-s i{width:46px;height:46px}.mp>.mp-l{gap:12px;padding:12px 14px}.mp b{font-size:.95rem}}")

_PLAY = '<i aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M7 4.5v15l13-7.5z"/></svg></i>'


def _e(s):
    return escape(str(s or ""), quote=True)


def player(provider, media_id, title, label, link=None, height=131):
    """Platzhalter fuer einen YouTube- ("youtube") oder Spreaker-Player ("spreaker").
    label: sichtbarer Aufruf in der Seitensprache (z. B. "Jetzt anhoeren"), link: Ziel ohne JavaScript (sonst die Folge beim Anbieter),
    height: Hoehe des Spreaker-Players in px (wie das bisherige iframe)."""
    mid = quote(str(media_id), safe="")
    if provider == "youtube":
        src = f"https://www.youtube-nocookie.com/embed/{mid}?rel=0"
        link = link or f"https://www.youtube.com/watch?v={mid}"
        cls, style, brand = "mp mp-v", "", "YouTube"
    elif provider == "spreaker":
        src = f"https://widget.spreaker.com/player?episode_id={mid}&theme=light&playlist=false"
        link = link or f"https://www.spreaker.com/episode/{mid}"
        h = int(height)
        cls, style, brand = "mp mp-s", "" if h == 131 else f' style="height:{h}px"', "Spreaker"
    else:
        raise ValueError(f"unbekannter Player: {provider}")
    t, lab = _e(title), _e(label)
    return (f'<div class="{cls}"{style} data-mp="{provider}" data-src="{_e(src)}" data-title="{t}">'
            f'<a class="mp-l" href="{_e(link)}" rel="noopener" aria-label="{lab}: {t} ({brand})">{_PLAY}'
            f'<span><b>{t}</b><small>{brand} · {lab}</small></span></a></div>')
