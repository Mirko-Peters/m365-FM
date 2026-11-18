"""Nur lesen, keine KI-Auftraege: warum wurden bezahlte Batch-Ergebnisse abgelehnt? Holt die fertigen Ergebnisse (kostenlos) und prueft sie mit den
Regeln von fill_entities; zaehlt je Grund das ausloesende Wort/den Namen und zeigt Beispiele. Ausgabe: Text + reports/entity_fill_rejects.json.

  python tools/entity_fill_rejects.py <batch-id> [<batch-id> ...]
"""
import collections, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fill_entities as FE  # noqa: E402
import entity_fill_data as FD  # noqa: E402


def ctx(text, m, w=50):
    return text[max(0, m.start() - w):m.end() + w].replace("\n", " ")


def main(ids):
    ents = FE.load_entities(); gen = FD.load_gentext(); by_key = {FE.key(i): i for i in ents}
    fill = FE.jload(FE.OUT / "en.json", {}); i18n = {l: FE.jload(FE.OUT / "i18n" / f"{l}.json", {}) for l in FE.LANGS}
    why = collections.Counter(); hits = collections.Counter(); samples = collections.defaultdict(list)
    for bid in ids:
        st = FE.api("GET", f"/v1/messages/batches/{bid}")
        for line in FE.api("GET", st["results_url"], raw=True).decode().splitlines():
            r = json.loads(line); p = r["custom_id"].split("_"); res = r["result"]
            if res["type"] != "succeeded": why["api_" + res["type"]] += 1; continue
            text = "".join(x.get("text", "") for x in res["message"]["content"] if x.get("type") == "text"); out = FE.parse_json(text)
            if p[0] == "w":
                eid = by_key.get(p[-2])
                if not eid or not isinstance(out, dict): why["w:no_json_or_id"] += 1; continue
                want = "rich" if len(str(out.get("long") or "")) >= 2400 else "full"
                rec, err = FE.validate_write(out, FE.facts_for(ents[eid], ents, rich=want == "rich"), want)
                if not err: why["w:ok"] += 1; continue
                why["w:" + err] += 1
                blob = "\n".join([str(out.get("desc") or ""), str(out.get("long") or "")] + [str(x.get("q", "")) + " " + str(x.get("a", "")) for x in (out.get("faq") or []) if isinstance(x, dict)])
                rx = {"url": FE.URL_RX, "superlative": FE.SUPERLATIVES}.get(err)
                if rx:
                    for m in rx.finditer(blob):
                        hits[f"w:{err}:{m.group(0).lower()}"] += 1
                        if len(samples[f"w:{err}:{m.group(0).lower()}"]) < 4: samples[f"w:{err}:{m.group(0).lower()}"].append(f"{eid}: …{ctx(blob, m)}…")
                elif len(samples["w:" + err]) < 6: samples["w:" + err].append(eid)
            else:
                lang = p[1]; eid = by_key.get(p[2])
                if not eid: why["t:no_id"] += 1; continue
                e = ents[eid]; src = FD.effective_en(e, gen, fill) if hasattr(FD, "effective_en") else FE.effective_en(e, gen, fill)
                part = {k: src[k] for k in src if isinstance(out, dict) and k in out}
                if not part: why["t:no_part"] += 1; continue
                prot = [n for n in FE.KEEP + [e["name"]] + list(e.get("aliases") or [])]
                rec, err = FE.validate_translation(lang, part, out, prot)
                if not err: why["t:ok"] += 1; continue
                why[f"t:{err}"] += 1
                if err == "name_changed":
                    s_txt = json.dumps(part, ensure_ascii=False); t_txt = json.dumps({k: out.get(k) for k in part}, ensure_ascii=False)
                    for n in prot:
                        if n in s_txt and n not in t_txt:
                            kind = "KEEP" if n in FE.KEEP else ("name" if n == e["name"] else "alias")
                            hits[f"t:name_changed:{kind}:{n}"] += 1
                            k = f"t:name_changed:{kind}:{n}"
                            if len(samples[k]) < 3:
                                m = re.search(re.escape(n), s_txt); samples[k].append(f"{lang} {eid} ({e.get('type')}): src …{ctx(s_txt, m, 40)}…")
                            break
                elif err == "wrong_script":
                    hits[f"t:wrong_script:{lang}"] += 1
                    if len(samples[f"t:wrong_script:{lang}"]) < 3: samples[f"t:wrong_script:{lang}"].append(f"{eid}: {str(out.get('desc') or '')[:140]}")
    rep = {"why": dict(why.most_common()), "hits": dict(hits.most_common(80)), "samples": samples}
    Path("reports").mkdir(exist_ok=True); Path("reports/entity_fill_rejects.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding="utf-8")
    print("## Gruende"); [print(f"- {k}: {v}") for k, v in why.most_common()]
    print("## Ausloeser (Top 80)"); [print(f"- {k}: {v}") for k, v in hits.most_common(80)]
    print("## Beispiele")
    for k, v in samples.items():
        print(f"### {k}"); [print(f"- {x}") for x in v]


if __name__ == "__main__":
    main(sys.argv[1:])
