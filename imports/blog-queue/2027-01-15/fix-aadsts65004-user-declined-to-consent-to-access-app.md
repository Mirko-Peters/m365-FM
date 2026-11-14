---
title: "Fix AADSTS65004: User Declined to Consent to Access the App"
summary: "AADSTS65004 (UserDeclinedConsent) means the user declined the consent prompt. Have the user retry and accept, and for admins learn how consent settings, verified publishers, the admin approval workflow and tenant-wide consent decide whether users see a prompt."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [entra-id, admin-consent, app-registration]
keypoints:
  - "The Entra error reference lists AADSTS65004 as UserDeclinedConsent and says to have the user retry the sign-in and consent to the app."
  - "User consent applies to delegated permissions and is recorded once accepted, so users usually do not consent again on later sign-ins."
  - "Users see a prompt only if user consent is allowed for that app and permission set; otherwise the consent decision sits with an administrator."
  - "The admin consent workflow gives users an Approval required window with a justification box and email updates when the request is approved, denied or blocked."
  - "Before granting tenant-wide admin consent, Learn says to confirm you trust the app and publisher and understand why it asks for the permissions."
faq:
  - q: "What does AADSTS65004 mean?"
    a: "The Microsoft Entra error reference lists it as UserDeclinedConsent: the user declined to consent to access the app. The suggested action is to have the user retry the sign-in and consent to the app."
  - q: "Is this the same as AADSTS65001?"
    a: "No. AADSTS65004 is about a user who declined the consent prompt. AADSTS65001, where consent has not been granted by the user or an admin, is a separate error code. Both belong to the consent process described on the user and admin consent overview."
  - q: "Why was I never asked for consent?"
    a: "Learn says non-administrators can consent only where user consent is allowed for the application and the set of permissions it requires. If user consent is disabled or not allowed for the requested permissions, users are not prompted. An administrator then decides, or the admin consent workflow offers an approval request."
  - q: "What are the built-in user consent options?"
    a: "Disable user consent; allow users to consent to apps from verified publishers or your own organization, but only for permissions you classify as low impact; or allow users to consent to all applications for any permission that does not require admin consent."
  - q: "How does a user ask for admin approval?"
    a: "When the admin consent workflow is enabled, the user signs in, sees an Approval required message, types a justification and selects Request approval. A Request sent message confirms it. If the user sends several requests, only the first goes to the admin, and the user gets an email when it is approved, denied or blocked."
---

AADSTS65004 means the user saw a consent prompt and declined it. Microsoft's error reference calls it UserDeclinedConsent and gives one fix: have the user retry the sign-in and consent to the app. The harder question for an admin is why the prompt appeared and what the app asked for. This guide uses the Microsoft Learn overview of user and admin consent to explain both.

## What the error means

Consent is the process where users grant an application permission to access a protected resource. An app lists the API permissions it needs, for example seeing a signed-in user's profile and reading the contents of the user's mailbox. Learn says consent can start when a user signs in to an application for the first time.

User consent covers delegated permissions, where the app acts as the signed-in user. After the user enters credentials, Entra checks for an earlier record of user or admin consent for the required permissions. If none exists, the user is sent to the consent prompt. If the user accepts, the consent is recorded and the user usually does not have to consent again on later sign-ins. If the user declines, AADSTS65004 is the result.

## If you are the user

1. Retry the sign-in to the app.
2. Read the permissions on the consent prompt. They say what the app can do on your behalf.
3. If you recognize the app and trust it, accept. If you do not recognize it or the permissions look too wide for its purpose, do not accept, and ask your IT team or the app's owner.

The error is not a sign that something is broken. It records a choice. If you declined by mistake, the retry in step 1 is the fix the reference gives.

## If you are the admin

### Check whether users are meant to see this prompt

Learn says user consent by non-administrators is possible only where user consent is allowed for the application and its permission set. A Privileged Administrator sets this. The built-in options in the Microsoft Entra admin center are:

- **Disable user consent.** Users cannot grant permissions to new applications. They continue to sign in to apps they already consented to or that administrators consented to for them. Only users with a directory role that includes the permission to grant consent can consent to new apps.
- **Verified publishers or your organization, for permissions you select.** Users can consent only to apps from a verified publisher and apps registered in your tenant, and only for permissions classified as low impact. You must classify permissions to define which those are.
- **All applications.** Users can consent to any permissions that do not require admin consent, for any application.

Learn also mentions custom app consent policies for organizations that need finer control.

If users in your tenant decline often, look at which setting applies. A prompt for a permission set that users find unfamiliar is a reason to review the policy, to classify more low impact permissions, or to move the decision to an admin workflow.

### Offer the admin consent workflow

When users cannot consent themselves, the admin consent workflow lets them request approval. Learn describes the user path:

1. The user tries to sign in to the app.
2. An **Approval required** message appears. The user types a justification and selects **Request approval**.
3. A **Request sent** message confirms the request. If the user sends several requests, only the first goes to the admin.
4. The user gets an email when the request is approved, denied or blocked.

Designated reviewers get a notification when a request arrives, and the user is told after a reviewer acts.

### Grant admin consent with care

Admin consent lets a Privileged Administrator grant an application access on behalf of other users, usually the whole organization, and for permissions that give direct access to an API when no user is signed in. Learn says the role needed depends on the permissions requested. After admin consent, users are not prompted for that application, though a user might be prompted again if the app requests an additional permission the administrator did not grant.

Learn calls tenant-wide consent a sensitive operation that can give the publisher access to significant parts of the organization's data. Its examples include role management, full access to all mailboxes or all sites, and full user impersonation. Before you grant it, confirm that you trust the application and the publisher for that level of access. If you are not sure who controls the app and why it requests the permissions, Learn says not to grant consent.

An admin can also grant consent to delegated permissions for a single user through Microsoft Graph. And even with tenant-wide consent, access can be limited by requiring user assignment in the application's properties.

## A practical sequence

This is my own advice, not a Microsoft statement.

1. Ask the user whether they pressed decline on purpose. If not, retry.
2. If they declined on purpose, ask what the app is and who asked them to use it.
3. Check the app and publisher against your approved list. If it is approved and low risk, tell the user to retry and accept. If you want to avoid prompts altogether, consider admin consent after your review.
4. If the app is not approved, leave the user's decision in place and block or remove the app through your normal process.
5. If many users decline the same app, treat that as feedback and review the consent policy and your internal communication for that app.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)
- [App registration](https://www.m365.fm/entity/app-registration/)

## Sources

- [Overview of user and admin consent - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/user-admin-consent-overview)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
