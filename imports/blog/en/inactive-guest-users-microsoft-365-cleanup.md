---
title: "Inactive guest users in Microsoft 365: find and clean them up"
summary: "Find inactive guest users in Microsoft 365 with the Entra inactive guest report and sign-in dates, then clean them up with access reviews and a safe order."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [guest-access, entra-external-id, access-reviews, entra-id-governance]
keypoints:
  - "Entra's inactive guest report uses a default threshold of 90 days, which you can change, and counts from the creation date for guests who never signed in."
  - "The signInActivity property separates sign-in attempts from successful sign-ins, so use lastSuccessfulSignInDateTime to see when a guest really got in."
  - "An access review with Guest users only and Inactive users selected can remove access automatically and block denied guests for 30 days before removal."
  - "Deleted guests can be restored within 30 days, and after that a new invitation is needed, so the 30-day block is your safety net."
  - "Guests who were created inside the inactivity window are out of scope, so a new guest has time to sign in at least once."
faq:
  - q: "How do I find inactive guest users in Microsoft 365?"
    a: "In the Microsoft Entra admin center, open ID Governance, then the Dashboard, and use the guest access governance card to view inactive guests. The report uses a 90-day threshold by default, which you can edit. For scripts, read the sign-in activity of each guest user through Microsoft Graph and compare the date with your own limit."
  - q: "How long should a guest be inactive before removal?"
    a: "Microsoft sets no single rule. Its report defaults to 90 days, and its guidance for member accounts says that 90 to 180 days is a reasonable window in many organizations. Choose a period that fits your projects, account for slow seasons, and give new guests time to sign in before they are judged."
  - q: "Can I get back a guest account that was deleted?"
    a: "Yes, for a limited time. According to Microsoft, deleted guests can be restored within 30 days. After 30 days you must send a new invitation. That is why a review setting that blocks denied guests for 30 days before removing them is a safe default, because it leaves room to correct a mistake."
---

Inactive guest users in Microsoft 365 are guest accounts that have not signed in for a set period, and you can find them with the Microsoft Entra inactive guest report or with sign-in dates. Then you clean them up in a safe order: report, review, block, remove. This article is for Microsoft 365 admins whose guest list keeps growing. You will learn how to define inactive, where to look, how to run an access review, and see a worked example with invented numbers.

## What makes a guest account inactive?

Microsoft's page on [cleaning up stale guest accounts](https://learn.microsoft.com/entra/identity/users/clean-up-stale-guest-accounts) gives the working definition. The inactive guest report uses a threshold that defaults to 90 days, and admins can change it with the Edit inactivity threshold option. Inactive days are counted from the last sign-in date if the guest has signed in at least once. For guests who never signed in, they are counted from the creation date.

That second rule matters for [guest access](https://www.m365.fm/entity/guest-access/) hygiene. A guest who was invited a year ago and never signed in is inactive for 365 days, even though there is no sign-in to measure. These are often the easiest accounts to remove, because the invitation was never used.

Microsoft's guidance for member accounts adds a note on thresholds. It sets no fixed number and says that in many organizations a reasonable window is 90 to 180 days, and that you should account for legitimate absences such as vacations. For guests, think about the rhythm of your projects. An agency that works with you once a quarter looks inactive for most of the year but is not stale.

## Where do you find inactive guest users in Microsoft 365?

You have two routes. The first is the report. In the Microsoft Entra admin center, go to ID Governance, then the Dashboard, then the Guest access governance card, and select View inactive guests. The report shows a guest account overview, the inactivity distribution, inactivity guidance and an exportable summary. Downloading all data supports up to 1 million guest users.

The second route is the sign-in data itself. Microsoft's reference on the [signInActivity resource type](https://learn.microsoft.com/graph/api/resources/signinactivity) describes three properties:

- **lastSignInDateTime** is the last interactive sign-in attempt, successful or not. Because failed attempts are logged, it may not reflect real use.
- **lastNonInteractiveSignInDateTime** is the last non-interactive attempt, meaning a client tried to sign in on behalf of the user.
- **lastSuccessfulSignInDateTime** is the most recent successful interactive or non-interactive sign-in. Use it to find out when the account was truly accessed.

Two caveats apply. The last successful sign-in property became available on December 1, 2023, and the data is not backfilled, so sign-ins before that date are not reflected. And Microsoft's page does not say what value is returned when no successful sign-in is recorded since then, so do not assume that an empty value means the person never signed in.

For member accounts, Microsoft's article on [detecting inactive user accounts](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-manage-inactive-user-accounts) lists what you need to read the last successful sign-in through Microsoft Graph: a Microsoft Entra ID P1 or P2 license, the AuditLog.Read.All and User.Read.All permissions, and at least the Reports Reader role for activity logs. Check the same requirements for your guest query.

## How do you ask the owners before you act?

An inactive guest is not always a guest you can delete. Ask the questions Microsoft suggests for inactive users: Is the person still involved? Do they still need this access? Is the account needed for another reason? The answers belong to the business owner, not to IT.

Use the report to build a short list for each owner:

1. **Sort by inactivity.** Start with guests who never signed in, then those inactive for more than 180 days, then those between 90 and 180 days.
2. **Group by site or team.** Owners can judge their own guests faster than a long tenant-wide list.
3. **Ask for a decision by a date.** Keep, remove or extend, with a reason for keep.
4. **Record the outcome.** A short sheet with name, owner, decision and date is enough.

Note that this manual step does not scale beyond a few hundred guests. That is where automated access reviews help.

## How do you clean up with an access review?

The same Microsoft page describes a review that removes inactive guests automatically. It needs Microsoft Entra ID Governance or Microsoft Entra Suite. The steps are:

1. Create a dynamic group for the guests, for example with a rule that selects user type Guest and an enabled account.
2. In Identity Governance, open Access Reviews and create a new access review.
3. Select Teams + Groups, choose the dynamic group, set the scope to Guest users only, check Inactive users (on tenant level) only, and enter the number of days inactive.
4. Choose reviewers: group owners, specific users, or a reviewer who takes no action if you want the process to stay automated.
5. Under settings, turn on Auto apply results to resource, set If reviewers don't respond to Remove access, and set the action for denied guests to Block user from signing in for 30 days, then remove user from the tenant.

The [access reviews](https://www.m365.fm/entity/access-reviews/) feature also supports a multi-stage review. In stage one, users review their own access. In stage two, group owners or chosen reviewers make the final decision. That fits partner companies where the guest knows best whether the work continues.

Microsoft states three outcomes. If nobody responds, access is removed. If a guest is denied, the account is blocked from signing in for 30 days and then removed from the tenant. Guests who do not sign in for the configured number of days are disabled for 30 days and then deleted. Recently created guests are out of scope: with a 90-day setting, a guest invited 60 days ago is not reviewed, so the person can sign in at least once.

## What is the safe order of cleanup?

Work in four steps so that a mistake is cheap to undo.

- **Step one: report.** Run the inactive guest report and export it. Do not change anything yet.
- **Step two: review.** Send owners their lists, or start the access review in a test mode with a small group.
- **Step three: block.** Use the 30-day block before removal. A blocked guest cannot sign in, but the account still exists.
- **Step four: remove.** After the block period, the account is deleted. Microsoft says deleted guests can be restored within 30 days, and after that a new invitation is required.

The 30-day window is a safety net, not a plan. Tell project owners that a removed guest needs a new invitation, and let them know before the first automatic run, so that nobody learns about it from an angry customer. If a decision has not yet been applied, the page mentions that you can stop it with the Microsoft Graph accessReviewInstance stopApplyDecisions call.

This work belongs in your wider [Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/) routine, together with sponsors and expiry dates on new guests.

## Example: 1,200 guests, a 120-day review

The numbers are invented to show the method. A company has 1,200 guest accounts. The admin runs the inactive guest report with the default 90-day threshold and gets 520 inactive guests. Of these, 190 never signed in after the invitation.

The plan has four moves:

1. Remove the 190 never-used guests after a two-week notice to the owners. 150 are confirmed as unused, so 150 go. The other 40 belong to a project that starts next month, so the owners keep them.
2. Set up an access review for guests inactive for 120 days, which finds 210 more accounts. The owners answer 80, and 130 do not respond.
3. Apply the results: the 130 non-responders lose access, the 20 denied guests are blocked for 30 days and then removed, and the 60 approved guests stay.
4. Repeat the review every quarter.

Count the effect. After one cycle the tenant has 1,200 minus 150 minus 130 minus 20 = 900 guests, a drop of 25 percent. Each remaining guest has an owner decision on record. The next quarter's report is smaller and easier to read. The point is the routine, not the single cleanup.

## Common mistakes

- **Using lastSignInDateTime alone.** It includes failed attempts, so use the successful sign-in date for the real picture.
- **Treating an empty sign-in value as never signed in.** Microsoft's page does not support that assumption.
- **Deleting at once.** Block first, and use the 30-day window to catch errors.
- **Ignoring new guests.** Guests within the inactivity window are out of scope, so give them time to sign in.
- **No owner answers.** Without owners, non-response removes access, which may surprise a project.
- **One cleanup, no repeat.** Guests come back every month, so schedule the review.

## How software can help

Start with the Microsoft Entra inactive guest report, the sign-in data in Microsoft Graph and access reviews. If your licenses do not include Microsoft Entra ID Governance, a PowerShell script can list guests by last successful sign-in, and owners can answer in a shared sheet. A reporting tool can bring guests, sites and last activity into one view. Compare any option with the built-in report on a sample first, and check what each tool reads and where it stores the data.

## Next step

Open the inactive guest report today and export it. Pick the guests who never signed in, send their owners a list, and set a date for the first cleanup of inactive guest users in Microsoft 365.
