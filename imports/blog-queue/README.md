# Blog-Queue

Fertige englische Artikel (Format wie in `imports/blog/README.md`, `status: review`, `publish: false`) liegen hier nach Tagen sortiert:
`imports/blog-queue/<JJJJ-MM-TT>/<slug>.md`.

Der Workflow `blog-release.yml` läuft jeden Abend um 22:40 UTC (23:40 Berlin) und verschiebt alle Ordner mit Datum bis morgen
(Berliner Zeit) nach `imports/blog/en/`, setzt `status: approved`, `publish: true` und `date` auf das Ordnerdatum. Je Lauf höchstens 20 Artikel
(Standard, per Eingabe `limit` änderbar). Was an einem Tag nicht freigegeben wurde, holt der nächste Lauf nach.
Mit dem nächsten Seitenbau (01:07 UTC) und dem Import-Cron (`importContentBlog`) werden die Artikel live; die Übersetzungen laufen wie bei allen
englischen Blogartikeln über den bestehenden Weg.
Manuell: Actions → „Blog-Queue freigeben" → Run workflow, optional mit Stichtag.
