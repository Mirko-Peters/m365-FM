"""Certopus-Testsendung: legt EIN Zertifikat fuer den Lernpfad Manufacturing Excellence an (wie der Worker, learnquiz.js certopusIssue)
und laesst Certopus es veroeffentlichen und per E-Mail schicken. Nur fuer Mirkos Test der Vorlage und der E-Mail.
Adresse und Name kommen aus der Umgebung (CERT_EMAIL, CERT_NAME), der Schluessel aus CERTOPUS_API_KEY; ausgegeben wird keins davon.
Es werden nur Felder gesendet, die die Vorlage kennt (recipient_fields).
Aufruf: CERTOPUS_API_KEY=... CERT_EMAIL=... CERT_NAME=... python3 tools/certopus_test.py
Rueckgabe: 0 = angelegt, 1 = API-Fehler, 2 = Schluessel oder Adresse fehlt (nichts gesendet)."""
import datetime, json, os, re, sys, urllib.error, urllib.parse, urllib.request

API = "https://api.certopus.com/v1"
ORG, EVENT, CATEGORY = "projectmanagementgroup", "1b364220-e7df-11f1-a542-95dd4baa2628", "1b361b10-e7df-11f1-a542-95dd4baa2628"
COURSE = "Manufacturing Excellence: From Lean Basics to Digital Production Planning"


def call(method, path, key, body=None, **q):
    url = API + path + (("?" + urllib.parse.urlencode(q)) if q else "")
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={"x-api-key": key, "accept": "application/json",
                                 "content-type": "application/json", "user-agent": "m365fm-certopus-test"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode("utf-8", "replace")[:300]}
    except (urllib.error.URLError, ValueError) as e:
        return 0, {"error": str(e)[:200]}


def fields(key):
    st, j = call("GET", "/recipient_fields", key, organisationId=ORG, eventId=EVENT, categoryId=CATEGORY)
    return {f.get("key") for f in (j.get("data") or [])} if st == 200 else {"{Name}"}


def payload(email, name, known, score="100", today=None):
    today = today or datetime.date.today().isoformat()
    want = {"{Name}": name, "{Course}": COURSE, "{Score}": score, "{Date}": today}
    data = {k: v for k, v in want.items() if k in known}
    return {"organisationId": ORG, "eventId": EVENT, "categoryId": CATEGORY, "generate": True, "publish": True,
            "recipients": [{"email": email, "data": data}]}


def main():
    key = (os.environ.get("CERTOPUS_API_KEY") or "").strip()
    email = (os.environ.get("CERT_EMAIL") or "").strip()
    name = (os.environ.get("CERT_NAME") or "Mirko Peters").strip()[:80]
    if not key:
        print("CERTOPUS_API_KEY fehlt. Nichts gesendet.")
        return 2
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[A-Za-z]{2,}", email):
        print("Keine gueltige Adresse angegeben (Eingabe email). Nichts gesendet.")
        return 2
    known = fields(key)
    print("Felder der Vorlage:", ", ".join(sorted(known)))
    body = payload(email, name, known)
    print("Gesendete Felder:", ", ".join(sorted(body["recipients"][0]["data"])))
    st, j = call("POST", "/certificates", key, body)
    res = ((j.get("responses") or (j.get("data") or {}).get("responses") or [{}]) if isinstance(j, dict) else [{}])[0]
    if st not in (200, 201) or not res.get("certificateId"):
        msg = json.dumps(j, ensure_ascii=False).replace(email, "***").replace(key, "***")[:400]
        print(f"POST /certificates: HTTP {st} {msg}")
        return 1
    print(f"POST /certificates: HTTP {st}, Zertifikat angelegt: id={res.get('certificateId')}")
    print("Zertifikat:", res.get("certificateUrl") or "-")
    print("PDF:", res.get("pdfUrl") or "-")
    print("Certopus schickt die E-Mail an die angegebene Adresse (veroeffentlicht).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
