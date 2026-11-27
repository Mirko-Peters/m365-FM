"""Certopus-IDs fuer den Lernpfad-Abschlusstest auslesen (nur lesen): Organisationen, Events, Kategorien des Events und
die Platzhalter der Vorlage (recipient_fields). Der Schluessel kommt nur aus der Umgebung (CERTOPUS_API_KEY) und wird nie ausgegeben.
Aufruf: CERTOPUS_API_KEY=... python3 tools/certopus_ids.py [event-id]"""
import json, os, sys, urllib.error, urllib.parse, urllib.request

API = "https://api.certopus.com/v1"
EVENT = "1b364220-e7df-11f1-a542-95dd4baa2628"   # Event von Mirko (app.certopus.com/events/<id>)


def get(path, key, **q):
    url = API + path + (("?" + urllib.parse.urlencode(q)) if q else "")
    req = urllib.request.Request(url, headers={"x-api-key": key, "accept": "application/json", "user-agent": "m365fm-certopus-ids"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        return e.code, {"error": body.replace(key, "***")}
    except (urllib.error.URLError, ValueError) as e:
        return 0, {"error": str(e).replace(key, "***")[:200]}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    key = (os.environ.get("CERTOPUS_API_KEY") or "").strip()
    if not key:
        print("CERTOPUS_API_KEY fehlt (GitHub-Secret anlegen). Nichts abgefragt.")
        return 2
    event = (argv[0] if argv else "") or EVENT
    st, orgs = get("/organisations", key)
    print(f"GET /organisations: HTTP {st}")
    if st != 200:
        print(json.dumps(orgs, ensure_ascii=False))
        return 1
    found = False
    for o in orgs.get("data") or []:
        oid = o.get("id")
        print(f"- Organisation: {o.get('name')!r} id={oid} integrationAllowed={o.get('integrationAllowed')}")
        st, evs = get(f"/events/{oid}", key)
        if st != 200:
            print(f"    GET /events: HTTP {st} {json.dumps(evs, ensure_ascii=False)[:200]}")
            continue
        for e in evs.get("data") or []:
            mark = "  <== Event von Mirko" if e.get("id") == event else ""
            print(f"    Event: {e.get('title')!r} id={e.get('id')}{mark}")
            if e.get("id") != event:
                continue
            found = True
            st, cats = get("/categories", key, organisationId=oid, eventId=event)
            print(f"    GET /categories: HTTP {st}")
            for c in (cats.get("data") or []) if st == 200 else []:
                print(f"      Kategorie: {c.get('title')!r} id={c.get('id')}")
                st2, flds = get("/recipient_fields", key, organisationId=oid, eventId=event, categoryId=c.get("id"))
                for f in (flds.get("data") or []) if st2 == 200 else []:
                    print(f"        Feld: key={f.get('key')!r} label={f.get('label')!r} type={f.get('type')!r}")
                if st2 != 200:
                    print(f"        recipient_fields: HTTP {st2}")
    if not found:
        print(f"Event {event} in keiner Organisation gefunden (erste Seite der Events).")
    return 0 if found else 1


if __name__ == "__main__":
    sys.exit(main())
