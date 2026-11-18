# Blog-Queue

Fertige englische Artikel (Format wie in `imports/blog/README.md`, `status: review`, `publish: false`) liegen hier nach Tagen sortiert:
`imports/blog-queue/<JJJJ-MM-TT>/<slug>.md`.

Der Workflow `blog-release.yml` läuft jeden Abend um 22:40 UTC (23:40 Berlin) und verschiebt Artikel nach `imports/blog/en/`
(`tools/blog_release.py`). Der Abend-Lauf übergibt keinen Stichtag: freigegeben werden Artikel aus **allen** Ordnern, das Ordnerdatum bestimmt
nur die Reihenfolge (älteste zuerst). Gesetzt werden `status: approved`, `publish: true` und `date` auf **morgen** (Berliner Zeit, der Tag,
an dem sie mit dem Seitenbau live gehen), nicht auf das Ordnerdatum. Je Lauf höchstens **15** Artikel (Standard, per Eingabe `limit` änderbar),
über alle Ordner zusammen; was übrig bleibt, holt der nächste Lauf nach. Eine feste Tagesmenge je Reihe (z. B. 10 Nerdio-Artikel pro Tag)
lässt sich über die Ordner allein nicht steuern, nur über den Stichtag (manueller Lauf) oder eine Änderung des Abend-Laufs.
Mit dem nächsten Seitenbau (01:07 UTC) und dem Import-Cron (`importContentBlog`) werden die Artikel live; die Übersetzungen laufen wie bei allen
englischen Blogartikeln über den bestehenden Weg.
Manuell: Actions → „Blog-Queue freigeben" → Run workflow, optional mit Stichtag (dann nur Ordner bis zu diesem Datum), `limit` und Artikeldatum.
