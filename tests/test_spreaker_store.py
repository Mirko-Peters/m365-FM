"""Spreaker verbinden ueber den Worker: spreaker_auth.py store/connect uebernimmt den verschluesselten Text von www.m365.fm/callback
(worker/src/spreaker_connect.js) - Fernet in beide Richtungen kompatibel, Refresh-Token Pflicht, nichts Geheimes in der Ausgabe.
Dazu die Rueckleitungsseite (site_callback.py): Spreaker-Code geht sofort an den Worker, YouTube bleibt wie bisher."""
import base64
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import contextlib
import inspect
import io
import os
import tempfile
import types
import unittest
from unittest import mock
from cryptography.fernet import Fernet

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import spreaker_auth as SA   # noqa: E402
import site_callback as CB   # noqa: E402

SECRET = "test-client-secret-123"
KEY = base64.urlsafe_b64encode(hashlib.sha256(("m365dub|" + SECRET).encode()).digest())
# derselbe Testvektor wie in worker/test/spreaker_connect.test.mjs (dort byte-gleich aus JS erzeugt)
PY_TOKEN = "gAAAAABlU_EAAAECAwQFBgcICQoLDA0ODywDCi_dL05tofb4b7vSyM4042N-ayDrg3fW7OUM3TC3jmal8S5cQZAwyFo-UHhEQUoPekycRbFpCRtH3sQ8O9nt_oS7Hjqb94GLH3-acX4xY8mgmFNVUdEezwQQ5jnwP6oAgdJrvkVJmRd11d2Q7awT79uk6K1oJtczjz6IyO5H"


_TC = unittest.TestCase()
raises = _TC.assertRaises   # Kontextmanager fuer erwartete Ausnahmen


def _fail(msg):
    raise AssertionError(msg)


def _t_store_schreibt_verschluesselt_und_gibt_nichts_geheimes_aus(auth, capsys):
    auth.store(PY_TOKEN + "\n")
    out = capsys.readouterr().out
    assert "AT-test-vector" not in out and "RT-test-vector" not in out and SECRET not in out
    assert "verbunden" in out
    raw = auth.FILE.read_bytes()
    assert b"AT-test-vector" not in raw
    assert auth.load() == {"access_token": "AT-test-vector", "refresh_token": "RT-test-vector", "at": 1700000000}


def _t_connect_erkennt_den_text_und_leitet_auf_store(auth):
    auth.connect("  " + PY_TOKEN)
    assert auth.load()["refresh_token"] == "RT-test-vector"


def _t_store_ohne_refresh_token_oder_falscher_schluessel_scheitert(auth, capsys):
    blob = Fernet(KEY).encrypt(json.dumps({"access_token": "AT-x", "refresh_token": "", "at": 1}).encode()).decode()
    with raises(SystemExit):
        auth.store(blob)
    other = Fernet(Fernet.generate_key()).encrypt(b'{"access_token":"a","refresh_token":"b"}').decode()
    with raises(SystemExit):
        auth.store(other)
    with raises(SystemExit):
        auth.store(PY_TOKEN[:-10])
    out = capsys.readouterr().out
    assert "::error::" in out and "AT-x" not in out
    assert not auth.FILE.exists()


def _t_js_ausgabe_ist_in_python_entschluesselbar():
    node = shutil.which("node")
    if not node:
        raise unittest.SkipTest("node fehlt")
    js = ("import { fernetEncrypt, spreakerKey } from './worker/src/spreaker_connect.js';"
          f"console.log(await fernetEncrypt(await spreakerKey({json.dumps(SECRET)}), JSON.stringify({{access_token:'AT-js',refresh_token:'RT-js',at:1}})));")
    tok = subprocess.run([node, "--input-type=module", "-e", js], cwd=ROOT, capture_output=True, text=True, timeout=60, check=True).stdout.strip()
    assert tok.startswith("gAAAAA")
    assert json.loads(Fernet(KEY).decrypt(tok.encode())) == {"access_token": "AT-js", "refresh_token": "RT-js", "at": 1}


def _t_callback_seite_spreaker_sofort_an_den_worker_youtube_unveraendert():
    html = CB.page("https://api-dub.m365.fm/")
    assert '"https://api-dub.m365.fm"' in html
    assert '/api/admin/spreaker-exchange' in html and 'credentials:"include"' in html and '"x-requested-with":"m365"' in html
    assert 'st.indexOf("spreaker")===0' in html
    assert "In GitHub > Actions > Spreaker verbinden (einmalig) > Run workflow einfügen. Der Text ist verschlüsselt und läuft nicht ab." in html
    assert 'Code (in das Programm bzw. den GitHub-Workflow einfügen):' in html   # YouTube und Rueckfall: Code wie bisher
    assert "innerHTML" not in html
    assert 'name=robots content="noindex,nofollow"' in html
    assert "</script>" in html and html.count("<script>") == 1
    assert CB.page("https://x.test/</script>").count("</script>") == 1   # API-Wert kann das Skript nicht beenden


# Verhalten der Seite im vm-Kontext von node: kleine DOM-Attrappe, fetch und clipboard gestubbt
_RUN = r"""
const vm = require("node:vm");
const [script, search, status, body] = JSON.parse(process.argv[1]);
const els = {}, el = (id) => (els[id] ||= { id, textContent: "", style: {}, onclick: null });
const calls = [], copied = [];
const ctx = {
  location: { search, pathname: "/callback/" }, URLSearchParams, JSON, history: { replaceState: () => { ctx.replaced = true; } },
  document: { getElementById: el }, navigator: { clipboard: { writeText: (t) => copied.push(t) } },
  fetch: async (u, o) => { calls.push({ u, o }); if (status === 0) throw new Error("offline"); return { status, json: async () => JSON.parse(body) }; },
};
vm.runInNewContext(script, ctx);
setTimeout(() => { if (els.b && els.b.onclick) els.b.onclick();
  console.log(JSON.stringify({ m: el("m").textContent, c: el("c").textContent, e: el("e").textContent, h: el("h").textContent, b: el("b").style.display, calls, copied, replaced: !!ctx.replaced })); }, 50);
"""


def _run_page(search, status=200, body="{}"):
    node = shutil.which("node")
    if not node:
        raise unittest.SkipTest("node fehlt")
    html = CB.page("https://api-dub.m365.fm")
    script = html.split("<script>", 1)[1].split("</script>", 1)[0]
    out = subprocess.run([node, "-e", _RUN, json.dumps([script, search, status, body])], capture_output=True, text=True, timeout=60, check=True).stdout
    return json.loads(out)


def _t_callback_spreaker_admin_zeigt_den_verschluesselten_text():
    r = _run_page("?code=abc123&state=spreaker.Nonce_123-abc", 200, json.dumps({"enc": "gAAAAAtest"}))
    assert len(r["calls"]) == 1
    call = r["calls"][0]
    assert call["u"] == "https://api-dub.m365.fm/api/admin/spreaker-exchange"
    assert call["o"]["credentials"] == "include" and call["o"]["headers"]["x-requested-with"] == "m365" and call["o"]["method"] == "POST"
    assert json.loads(call["o"]["body"]) == {"code": "abc123", "state": "spreaker.Nonce_123-abc"}   # state geht mit, der Worker prueft ihn gegen sein Cookie
    assert r["c"] == "gAAAAAtest" and r["copied"] == ["gAAAAAtest"] and r["b"] == "inline-block"
    assert r["h"] == CB.HINT and r["replaced"]


_USABLE = "Der Code unten gilt nur ca. 30 Sekunden und ist nur für das lokale Programm."
_STATE = "Aus Sicherheitsgründen bitte über https://api-dub.m365.fm/auth/spreaker/start neu verbinden."
_USED = "Der Code ist verbraucht – bitte über https://api-dub.m365.fm/auth/spreaker/start neu verbinden."


def _t_callback_spreaker_code_noch_nutzbar_zeigt_grund_und_code():
    # 401/403/Netzfehler (und Pruefungen vor dem Spreaker-Aufruf): der Code war nie bei Spreaker -> wie bisher anbieten
    for st, status, body, why in (("spreaker.n1", 401, {"error": "login"}, "Nicht angemeldet"),
                                  ("spreaker-x", 403, {"error": "forbidden"}, "Kein Admin"),
                                  ("spreaker.n1", 0, None, "nicht erreichbar"),
                                  ("spreaker.n1", 429, {"error": "rate"}, "rate"),
                                  ("spreaker.n1", 400, {"error": "bad_request"}, "bad_request")):
        r = _run_page(f"?code=abc123&state={st}", status, json.dumps(body or {}))
        assert why in r["e"] and _USABLE in r["e"] and "verbraucht" not in r["e"], (status, r)
        assert r["c"] == "abc123" and r["copied"] == ["abc123"] and r["b"] == "inline-block"


def _t_callback_spreaker_code_verbraucht_kein_code_nur_neu_verbinden():
    # Der Worker hat den Code schon an Spreaker geschickt (oder state passt nicht): Code NICHT anbieten, nur den Neustart-Weg nennen
    for status, body, why in ((400, {"error": "invalid_grant", "detail": "expired"}, "invalid_grant – expired"),
                              (502, {"error": "spreaker_503", "detail": "bad gateway"}, "spreaker_503"),
                              (502, {"error": "spreaker_unreachable"}, "spreaker_unreachable"),
                              (502, {"error": "no_refresh_token"}, "no_refresh_token"),
                              (502, {"error": "no_access_token"}, "no_access_token")):
        r = _run_page("?code=abc123&state=spreaker.n1", status, json.dumps(body))
        assert why in r["e"] and r["e"].endswith(_USED) and _USABLE not in r["e"], (body, r)
        assert r["c"] == "" and r["b"] != "inline-block" and r["copied"] == [] and "abc123" not in r["e"] + r["m"]
        assert r["m"] == "Spreaker nicht verbunden."


def _t_callback_state_mismatch_nicht_verbraucht_aber_neu_verbinden():
    # state passt nicht: der Worker hat Spreaker gar nicht gefragt -> nicht "verbraucht" sagen, aber auch keinen Code anbieten
    r = _run_page("?code=abc123&state=spreaker.n1", 400, json.dumps({"error": "state_mismatch"}))
    assert "passt nicht zu dieser Anmeldung" in r["e"] and r["e"].endswith(_STATE) and "verbraucht" not in r["e"], r
    assert r["c"] == "" and r["b"] != "inline-block" and r["copied"] == [] and r["m"] == "Spreaker nicht verbunden."


def _t_callback_youtube_und_ohne_state_unveraendert():
    for q in ("?code=4/yt-code&scope=youtube", "?code=abc&state=xyz"):
        r = _run_page(q)
        assert r["calls"] == [] and r["e"] == "" and r["h"] == ""
        assert r["m"] == "Code (in das Programm bzw. den GitHub-Workflow einfügen):" and r["c"] == q.split("code=")[1].split("&")[0]
    r = _run_page("?error=access_denied")
    assert r["m"] == "Fehler: access_denied" and r["calls"] == []


class SpreakerStoreTest(unittest.TestCase):
    """Laeuft mit python3 -m unittest (CI) und mit pytest. auth/capsys werden hier bereitgestellt: Test-Secret in der Umgebung,
    spreaker_auth.FILE in einem Temp-Ordner, exchange gesperrt (der Text vom Worker darf Spreaker nie fragen), stdout mitgeschnitten."""

    def _call(self, fn):
        params = inspect.signature(fn).parameters
        with tempfile.TemporaryDirectory() as tmp, \
                mock.patch.dict(os.environ, {"SPREAKER_CLIENT_SECRET": SECRET, "SPREAKER_CLIENT_ID": "test-client-id-42"}), \
                mock.patch.object(SA, "FILE", Path(tmp) / "data" / "spreaker_auth.enc"), \
                mock.patch.object(SA, "exchange", lambda data: _fail("Spreaker darf beim Text vom Worker nicht gefragt werden")):
            buf = io.StringIO()

            def readouterr():
                out = buf.getvalue(); buf.seek(0); buf.truncate()
                return types.SimpleNamespace(out=out, err="")
            kw = {"auth": SA, "capsys": types.SimpleNamespace(readouterr=readouterr)}
            with contextlib.redirect_stdout(buf):
                fn(**{k: kw[k] for k in params})


for _n, _f in list(globals().items()):
    if _n.startswith("_t_") and callable(_f):
        setattr(SpreakerStoreTest, "test_" + _n[3:], (lambda f: lambda self: self._call(f))(_f))
del _n, _f
