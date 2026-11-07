-- Abzeichen "Einlader": erfolgreiche Einladungen (die eingeladene Person hat ein Konto angelegt). Jede neue Person zaehlt genau einmal
-- (UNIQUE invitee), beim ersten gueltigen Einlader. source: ref | entity | speaker | org | forward. voided: Admin kann einen Eintrag ungueltig machen.
CREATE TABLE IF NOT EXISTS invite_success (
  inviter_user_id INTEGER NOT NULL,
  invitee_user_id INTEGER NOT NULL UNIQUE,
  source TEXT NOT NULL,
  ref TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  voided INTEGER NOT NULL DEFAULT 0,
  voided_by INTEGER NOT NULL DEFAULT 0,
  voided_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_invite_success_inviter ON invite_success(inviter_user_id);
