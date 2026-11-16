"""Rueckleitungsseite www.m365.fm/callback/ fuer die einmaligen Verbindungen (YouTube, Spreaker).

Spreaker (state beginnt mit "spreaker", Start: <API>/auth/spreaker/start): der Code laeuft nach rund 30 s ab. Die Seite schickt ihn deshalb sofort an
POST <API>/api/admin/spreaker-exchange (nur angemeldete Admins, worker/src/spreaker_connect.js) und zeigt den verschluesselten Text, den Mirko im
Workflow "Spreaker verbinden (einmalig)" einfuegt; der Text laeuft nicht ab. state (spreaker.<nonce>) geht im Body mit; der Worker prueft ihn gegen
sein signiertes Cookie (Login-CSRF-Schutz), die Seite prueft nur das Praefix.
Fehler: ist der Code noch nicht bei Spreaker gewesen (nicht angemeldet, kein Admin, Netzfehler usw.), zeigt die Seite den Grund und wie bisher den
Code. Hat der Worker ihn schon an Spreaker geschickt (Spreaker-Fehler, keine Tokens) oder passt state nicht, ist der Code verbraucht: die Seite
nennt nur den Weg ueber <API>/auth/spreaker/start und bietet den Code nicht an.
Alle anderen Anbieter (YouTube, state ohne spreaker): unveraendert, nur der Code wird angezeigt.
Alles per textContent, nichts aus der Adresse landet als HTML in der Seite.
"""
import json

HINT = "In GitHub > Actions > Spreaker verbinden (einmalig) > Run workflow einfügen. Der Text ist verschlüsselt und läuft nicht ab."

_HTML = """<!doctype html><meta charset=utf-8><meta name=robots content="noindex,nofollow"><meta name=viewport content="width=device-width,initial-scale=1"><title>Anmeldung</title>
<body style="font-family:system-ui,sans-serif;background:#101214;color:#e9ecef;padding:40px;max-width:640px;margin:auto"><h2>Anmeldung</h2><p id=m>Kein Code in der Adresse.</p>
<p id=e style="display:none;color:#ffb4a8"></p>
<pre id=c style="white-space:pre-wrap;word-break:break-all;background:#1d2126;padding:14px;border:1px solid #444"></pre><button id=b style="display:none;padding:10px 18px">Code kopieren</button>
<p id=h style="display:none"></p>
<script>(function(){var API=__API__,HINT=__HINT__,q=new URLSearchParams(location.search),c=q.get("code"),st=q.get("state")||"",$=function(i){return document.getElementById(i)};
function show(label,text,btn){$("m").textContent=label;$("c").textContent=text;var b=$("b");b.textContent=btn;b.style.display="inline-block";b.onclick=function(){navigator.clipboard.writeText(text);b.textContent="Kopiert ✓"}}
function showCode(){show("Code (in das Programm bzw. den GitHub-Workflow einfügen):",c,"Code kopieren")}
var PRE={login:1,forbidden:1,staging:1,not_configured:1,rate:1,bad_code:1,bad_request:1,method_not_allowed:1};
function used(s,e){return e==="state_mismatch"||((s===400||s===502)&&!PRE[e])}
function fail(why,gone){$("e").style.display="block";if(gone){$("m").textContent="Spreaker nicht verbunden.";$("c").textContent="";$("b").style.display="none";
$("e").textContent=why+" Der Code ist verbraucht – bitte über "+API+"/auth/spreaker/start neu verbinden.";return}
$("e").textContent=why+" Der Code läuft nach ca. 30 Sekunden ab – sofort einfügen oder als Admin anmelden und Spreaker neu verbinden.";showCode()}
if(c&&st.indexOf("spreaker")===0){$("m").textContent="Spreaker-Code wird verschlüsselt …";
fetch(API+"/api/admin/spreaker-exchange",{method:"POST",credentials:"include",headers:{"content-type":"application/json","x-requested-with":"m365"},body:JSON.stringify({code:c,state:st})})
.then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {s:r.status,j:j||{}}})})
.then(function(x){if(x.s===200&&typeof x.j.enc==="string"&&x.j.enc){show("Verschlüsselter Text:",x.j.enc,"Text kopieren");$("h").textContent=HINT;$("h").style.display="block";try{history.replaceState(null,"",location.pathname)}catch(_){}return}
var e=x.j.error||"";fail(x.s===401||e==="login"?"Nicht angemeldet (auf www.m365.fm als Admin anmelden)."
:x.s===403&&e==="forbidden"?"Kein Admin-Konto."
:e==="state_mismatch"?"Die Anfrage passt nicht zu dieser Anmeldung (state)."
:"Fehler: "+(e||("HTTP "+x.s))+(x.j.detail?" – "+x.j.detail:"")+".",used(x.s,e))})
.catch(function(){fail("Community-API nicht erreichbar.")})}
else if(c){showCode()}else if(q.get("error")){$("m").textContent="Fehler: "+q.get("error")}})()</script></body>"""


def page(api):
    """HTML der Rueckleitungsseite; api = Community-API (COMMUNITY_API)."""
    js = lambda v: json.dumps(v, ensure_ascii=False).replace("</", "<\\/")
    return _HTML.replace("__API__", js(str(api).rstrip("/"))).replace("__HINT__", js(HINT))
