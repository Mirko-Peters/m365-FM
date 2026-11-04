# Community-API (Cloudflare Worker + D1)

Login (Google/Microsoft), Kommentare, Abzeichen, Kurator pro Land, Web-Push und E-Mail-Digest für dub.m365.fm.
Läuft unter `https://api-dub.m365.fm`. Schlüssel (Session, VAPID, Cron) erzeugt der Workflow selbst.

## Einmalig einrichten (alles als GitHub-Secrets im Repo)
1. **Cloudflare**: Die Domain m365.fm muss im selben Cloudflare-Konto liegen. API-Token erstellen (Profil → API-Tokens → Vorlage „Edit Cloudflare Workers“, zusätzlich Rechte *D1: Edit* und *Zone → DNS: Edit* für m365.fm). Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (Account-ID steht rechts im Dashboard).
2. **Google-Login**: console.cloud.google.com → APIs & Dienste → Anmeldedaten → OAuth-Client-ID (Webanwendung). Autorisierte Weiterleitungs-URI: `https://api-dub.m365.fm/auth/callback/google`. Secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
3. **Microsoft-Login**: entra.microsoft.com → App-Registrierungen → Neu; Kontotypen „Konten in allen Organisationsverzeichnissen und persönliche Microsoft-Konten“; Web-Redirect-URI `https://api-dub.m365.fm/auth/callback/microsoft`; unter Zertifikate & Geheimnisse ein Client-Geheimnis (Wert!). Secrets: `MS_CLIENT_ID` (Anwendungs-ID), `MS_CLIENT_SECRET`.
4. **E-Mail (Cloudflare Email Service)**:
   - [x] Workers-Paid-Plan ist aktiv. Email Sending ist Beta; monatlich sind 3.000 E-Mails inklusive, danach 0,35 $ je 1.000.
   - [x] `m365.fm` ist unter **Email Service → Email Sending** als Absender-Domain eingerichtet. Cloudflare setzt SPF/DKIM-DNS-Einträge selbst.
   - [x] Der Worker nutzt das `EMAIL`-Binding; dafür ist kein API-Token nötig. `MAIL_FROM` steht in `wrangler.toml`. `RESEND_API_KEY` kann optional als Resend-Rückfall in GitHub-Secrets hinterlegt werden.
   - [ ] Nach dem Deploy als Admin `POST https://api-dub.m365.fm/api/admin/mail/test` mit der Admin-Session und `X-Requested-With: m365` aufrufen. Die Testmail geht an die bestätigte Benachrichtigungsadresse des angemeldeten Admins (max. 3 pro Stunde).
   - Nur falls später aus GitHub Actions per REST versendet wird, einen Token mit *Email Sending: Edit* als GitHub-Secret hinterlegen, nie im Code oder Chat.
5. **LinkedIn-Login**: developer.linkedin.com → Create app (LinkedIn-Seite des Unternehmens verknüpfen) → Reiter Products → „Sign In with LinkedIn using OpenID Connect“ anfordern → Reiter Auth: Authorized redirect URL `https://api-dub.m365.fm/auth/callback/linkedin`. Secrets: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` (Client ID und Primary Client Secret).
6. Optional `ADMIN_SUBS` = `google:<sub>`, `microsoft:<sub>`, `linkedin:<sub>` oder `github:<id>` (Moderator; die ID siehst du in D1 in der Tabelle users; bei GitHub die numerische Konto-ID, nie der Login-Name).
7. **GitHub-Login**: github.com → Settings → Developer settings → OAuth Apps → New OAuth App. Application name `M365.FM`, Homepage URL `https://www.m365.fm`, Authorization callback URL `https://api-dub.m365.fm/auth/callback/github`. Client ID kopieren, Client Secret erzeugen und beides als Repo-Secrets `GH_OAUTH_CLIENT_ID` und `GH_OAUTH_CLIENT_SECRET` anlegen (GitHub-Secrets duerfen nicht mit `GITHUB_` beginnen). Danach den Workflow „Community-API … einrichten“ neu starten; der Knopf „Weiter mit GitHub“ erscheint automatisch (`/api/providers`). Scope `read:user`, Nutzer `github:<numerische ID>`.
7. Workflow **„Community-API … einrichten“** starten (Actions → Run workflow). Er legt die D1-Datenbank `m365-dub` an, sichert sie (`backup-d1.sql`, als Artefakt 14 Tage nur verschlüsselt mit dem Secret `D1_BACKUP_KEY`, ohne Secret kein Artefakt; das Repo ist öffentlich), wendet die Migrationen aus `migrations/` an (`wrangler d1 migrations apply`, Stand in Tabelle `d1_migrations`), setzt Secrets, veröffentlicht den Worker.

Ohne Zugangsdaten tut der Workflow nichts; die Website blendet die Community-Bereiche automatisch aus, solange die API nicht erreichbar ist.

## Betrieb
- Täglicher Digest: Cron `0 6 * * *` (UTC). Der erste Lauf markiert vorhandene Folgen nur als bekannt (kein Massenversand).
- Manuell testen: `https://api-dub.m365.fm/api/admin/run-daily?key=<CRON_KEY>&dry=1` (CRON_KEY in Cloudflare → Worker → Settings → Variables; `dry=1` sendet nichts).
- D1-Sicherung zurückholen: Artefakt `d1-backup-<Lauf>` laden, dann `openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in backup-d1.sql.enc -out backup-d1.sql -pass env:D1_BACKUP_KEY` (Schlüssel aus dem Passwort-Manager). Ohne Artefakt: Cloudflare → D1 → m365-dub → Time Travel (30 Tage).
- Tarif: Workers Paid ($5/Monat) seit 10/2026: 1.000 Subrequests und 30 s CPU je Aufruf; D1 im Paid-Plan (Profil-Export und Import-Batches brauchen das).
- Schema: `migrations/0001_baseline.sql` ist der Ausgangsstand; jede Aenderung ist eine neue Datei `migrations/000N_name.sql` (nur idempotente Anweisungen; neue Spalten in bestehenden Tabellen weiterhin per ensure*-Funktion, SQLite kennt kein ADD COLUMN IF NOT EXISTS). Vor jedem Deploy laufen `node --check`, `npm test` und die MCP-Abdeckung; rot heisst kein Deploy.
- Lokal: `cd worker && npm i && npx wrangler dev` (mit `.dev.vars`: `SESSION_SECRET`, `DEV_LOGIN=1`).

## Community-Wiki und Editoren
- Auf den Glossar-Begriffsseiten (de/en) gibt es unter der Kurzinfo ein Community-Wiki (Tabelle `wiki_rev`). Beitraege sind reiner Text (keine Links), je Nutzer ein offener Vorschlag, Limit 6/Stunde.
- Neue Mitglieder: Beitrag wartet auf Pruefung. Sofort live: Admin, Editoren und Mitglieder ab 25 Punkten. 3 Meldungen blenden eine Fassung aus (die vorherige kommt zurueck).
- Editor ernennen: auf der Community-Seite (als Admin angemeldet) im Bereich **Team** nach dem Namen suchen und „Zum Editor machen“. Editoren pruefen Beitraege direkt unter dem jeweiligen Begriff; sie erhalten das Abzeichen ✏️ Editor. Wer einen veroeffentlichten Beitrag hat, bekommt 📖 Wiki-Autor.
- Freigegebene Texte exportiert `GET /api/wiki/export?lang=de`; der Seitenbau uebernimmt sie statisch (indexierbar).
