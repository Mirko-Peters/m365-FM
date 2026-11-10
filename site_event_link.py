"""Event <-> Event-Entitaet: die Seite einer Entitaet vom Typ event (z. B. /entity/microsoft-ignite/) zeigt die Termine ihrer Events mit Sessions und Speakern.

Die Zuordnung steht am Event (Feld "entity" im Export /api/events/export, Worker evententity.js) und ist dort nur gesetzt, wenn ein Admin sie bestaetigt hat und das Event
oeffentlich ist; Vorschlaege tauchen im Export nicht auf. Hier wird sie zusaetzlich geprueft (Entitaet existiert, Typ event). Die Beschreibung bleibt an der Entitaet, die Termine
kommen aus den Events (keine Doppelpflege).

Schema.org: eine Entitaet ohne eigenes Datum ist eine EventSeries (site_entities.ent_ld) und bekommt die Termine als subEvent (je Termin ein vollstaendiges Event mit location, startDate,
Sessions als subEvent und performer, gekappt); umgekehrt zeigt das Event auf der Event-Seite per superEvent auf die Reihe. Eine Entitaet mit eigenem Datum (z. B. M365Con 2027) ist selbst ein
Event: dort erscheinen die Termine nur im sichtbaren Text, nicht als Teil-/Oberevent (ein Event ist nicht Teil von sich selbst).
Dieses Modul importiert site_entities und site_events nur innerhalb von Funktionen (beide importieren es selbst)."""
from datetime import date
from site_i18n import T, pfx
from site_learn import ENTS, esc

BY_ENTITY = {}   # Entitaets-ID -> [Event, ...] (bestaetigt, oeffentlich, Entitaet gueltig)
PEOPLE = set()   # Handles oeffentlicher Profile
ORGS = set()     # Handles oeffentlicher Firmen
TODAY = date.today().isoformat()   # load() setzt den Tag des Seitenbaus
MAX_DETAIL = 3        # fuer so viele Termine (kommende zuerst, dann die juengsten vergangenen) stehen Sessions und Speaker auf der Entitaetsseite
MAX_SESSIONS = 150    # je Termin im sichtbaren Text
MAX_SPEAKERS = 200
LD_SESSIONS = 40      # je Termin im JSON-LD (die Event-Seite selbst enthaelt alle)


def valid(eid):
    return bool(eid) and eid in ENTS and ENTS[eid].get("type") == "event"


def load(events, people=(), orgs=(), today=None):
    """Zuordnung aus dem Export uebernehmen. Nur Events mit gueltiger Event-Entitaet; je Entitaet nach Beginn sortiert."""
    global TODAY
    TODAY = today or date.today().isoformat()
    BY_ENTITY.clear(); PEOPLE.clear(); ORGS.clear()
    PEOPLE.update(people); ORGS.update(orgs)
    for ev in events:
        eid = ev.get("entity") or ""
        if ev.get("public", True) and valid(eid) and ev.get("handle") and ev.get("title") and ev.get("start"):
            BY_ENTITY.setdefault(eid, []).append(ev)
    for lst in BY_ENTITY.values():
        lst.sort(key=lambda e: (e["start"], e["handle"]))


def for_entity(eid):
    return BY_ENTITY.get(eid, [])


def series_of(ev):
    """Entitaet, zu der das Event gehoert ('' = keine gueltige)."""
    eid = ev.get("entity") or ""
    return eid if valid(eid) and any(x["handle"] == ev.get("handle") for x in BY_ENTITY.get(eid, [])) else ""


def is_series(eid):
    """Eine Entitaet ohne eigenes Datum ist eine EventSeries (site_entities.ent_ld): nur dann ist ein Event ihr Teil (superEvent/subEvent)."""
    return valid(eid) and not ENTS[eid].get("start")


def superevent_id(BASE, ev):
    """@id der Reihe fuer Event.superEvent, sonst ''."""
    eid = series_of(ev)
    return f"{BASE}/entity/{eid}/#entity" if eid and is_series(eid) else ""


def split(evs, today):
    """(kommende nach Beginn aufsteigend, vergangene mit dem juengsten zuerst)"""
    up = sorted([e for e in evs if (e.get("end") or e["start"])[:10] >= today], key=lambda e: e["start"])
    pa = sorted([e for e in evs if (e.get("end") or e["start"])[:10] < today], key=lambda e: e["start"], reverse=True)
    return up, pa


def _place(ev, s):
    mode = {"online": s["online"], "onsite": s["onsite"], "hybrid": s["hybrid"]}.get(ev.get("mode"), "")
    where = ", ".join(x for x in (ev.get("location") if ev.get("mode") != "online" else "", ev.get("country") if ev.get("mode") != "online" else "") if x)
    return " · ".join(x for x in (where, mode) if x)


def person_link(BASE, lang, x):
    """Speaker als Link: Personen-Entitaet, sonst das oeffentliche Profil (auch ueber eine uebernommene Entitaet), sonst nur der Name."""
    import site_entities as ENT
    name = esc(x.get("n") or x.get("h") or "")
    e = x.get("e") or ""
    if not (e in ENTS and ENTS[e].get("type") == "person"):
        e = next((k for k, h in ENT.CLAIMS.items() if h == x.get("h") and k in ENTS and ENTS[k].get("type") == "person"), "") if x.get("h") else ""
    if e:
        return f'<a href="{ENT.eurl(BASE, lang, e)}">{name}</a>'
    if x.get("h") in PEOPLE:
        return f'<a href="{BASE}{pfx(lang)}/community/u/{esc(x["h"])}/">{name}</a>'
    return name


def html(BASE, lang, eid, today):
    """Block "Termine" der Entitaetsseite: kommende und vergangene Termine, dazu Sessions und Speaker der naechsten bzw. juengsten Termine."""
    import site_events as EV
    evs = for_entity(eid)
    if not evs:
        return ""
    s = EV.S[lang] if lang in EV.S else EV.S["en"]
    up, pa = split(evs, today)
    li = lambda lst: "".join(f'<li><a href="{EV.eurl_(BASE, lang, e["handle"])}"><b>{esc(e["title"])}</b></a> <span class="mut">· {esc(EV.span(e, lang))}'
                             + (f' · {esc(_place(e, s))}' if _place(e, s) else "") + "</span></li>" for e in lst)
    out = f'<h2>{esc(T(lang, "Dates", "Termine"))}</h2>'
    if up:
        out += f'<h3>{esc(s["upcoming"])}</h3><ul class="en-evs">{li(up)}</ul>'
    if pa:
        out += f'<h3>{esc(s["past"])}</h3><ul class="en-evs">{li(pa)}</ul>'
    for ev in (up + pa)[:MAX_DETAIL]:
        u = EV.eurl_(BASE, lang, ev["handle"])
        ses = [x for x in ev.get("sessions", []) if x.get("title")]
        if not ses:
            continue
        spk = {}
        for se in ses:
            for x in se.get("speakers", []):
                spk.setdefault((x.get("e") or x.get("h") or x.get("n") or "").lower(), x)
        out += f'<h3>{esc(ev["title"])}: {esc(s["sessions"])} ({len(ses)})</h3><ul class="en-evs">'
        for se in ses[:MAX_SESSIONS]:
            who = ", ".join(person_link(BASE, lang, x) for x in se.get("speakers", []))
            when = EV.fdate(se["start"], lang) if se.get("start") else ""
            meta = " · ".join(v for v in (esc(when) if when else "", who) if v)
            out += f'<li><a href="{u}">{esc(se["title"])}</a>' + (f' <span class="mut">· {meta}</span>' if meta else "") + "</li>"
        out += "</ul>"
        if spk:
            out += f'<h3>{esc(ev["title"])}: {esc(s["speakers"])} ({len(spk)})</h3><p>' + ", ".join(person_link(BASE, lang, x) for x in sorted(spk.values(), key=lambda a: (a.get("n") or a.get("h") or "").lower())[:MAX_SPEAKERS]) + "</p>"
    return out


def ld_nodes(BASE, eid):
    """subEvent-Knoten fuer die Reihe (nur oeffentliche, bestaetigte Termine): je Termin das vollstaendige Event; die Termine mit Sessions im sichtbaren Text (naechste bzw. juengste)
    bekommen im JSON-LD gekappte Sessions mit performer, die uebrigen nur das Event."""
    import site_events as EV
    evs = for_entity(eid)
    up, pa = split(evs, TODAY)
    detail = {e["handle"] for e in (up + pa)[:MAX_DETAIL]}
    return [EV.event_ld(BASE, ev, PEOPLE, ORGS, max_sessions=LD_SESSIONS if ev["handle"] in detail else 0) for ev in sorted(evs, key=lambda e: e["start"])]
