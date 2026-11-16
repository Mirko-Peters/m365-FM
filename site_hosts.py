"""Eigene Subdomains fuer Verwaltung und Konto/Profil (Stand 16.11.2026), gleiche Technik wie partner.m365.fm (site_sponsor.dashboard_url).

ADMIN_BASE  = https://admin.m365.fm   (Verwaltung, sonst <BASE>/admin/)
PROFIL_BASE = https://profil.m365.fm  (Konto und Profil = Community-App, sonst <BASE>/community/ und <BASE>/<sprache>/community/)

Beide kommen aus Repo-Variablen (site.yml) und werden erst gesetzt, wenn der Site-Worker die Subdomain ausliefert (ADMIN_HOST/PROFIL_HOST in sitewrk/wrangler.toml).
Leer, kein https-Ursprung oder mit Pfad/Zugangsdaten = ignoriert, alles bleibt wie bisher. Beide Subdomains sind noindex (Site-Worker: x-robots-tag und robots.txt)."""
import os
from urllib.parse import urlsplit


def _origin(name):
    v = (os.environ.get(name) or "").strip().rstrip("/")
    try:
        u = urlsplit(v)
        ok = u.scheme == "https" and u.hostname and not u.path and not u.query and not u.fragment and u.username is None and u.password is None and u.port is None
    except ValueError:
        ok = False
    return v if ok else ""


def admin_base():
    return _origin("ADMIN_BASE")


def profil_base():
    return _origin("PROFIL_BASE")


def admin_url(www_base):
    """Adresse der Verwaltung: Subdomain, sonst <www>/admin/."""
    b = admin_base()
    return (b + "/") if b else f"{www_base}/admin/"


def profil_url(www_base, lang):
    """Adresse von Konto und Profil in der Sprache: Subdomain (/ bzw. /<sprache>/), sonst None (der Aufrufer behaelt seine bisherige Adresse)."""
    b = profil_base()
    if not b:
        return None
    return b + "/" if lang in ("", "en") else f"{b}/{lang}/"
