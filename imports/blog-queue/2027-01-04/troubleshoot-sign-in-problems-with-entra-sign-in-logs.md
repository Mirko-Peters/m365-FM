---
title: "How to Troubleshoot Sign-In Problems With Entra Sign-In Logs"
summary: "Troubleshoot Microsoft Entra sign-in failures with the sign-in logs: required role, exact portal path, filters, which details to save, common error codes and failure reasons, and what Learn does not cover."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [microsoft-entra-sign-in-logs, entra-id]
keypoints:
  - "Open Entra ID > Monitoring & health > Sign-in logs in the Microsoft Entra admin center. Reports Reader is the least privileged role named by Learn."
  - "Filter by username, application and Status > Failure, then open the failed sign-in and save the correlation ID, error code and failure reason."
  - "Look up the sign-in error code with the error code lookup tool at login.microsoftonline.com/error or in the sign-ins error codes reference."
  - "Learn lists 50058, 90025, 500121 and 70046 as common codes. The list is not exhaustive."
  - "The page does not describe the individual detail tabs or log retention, so check those separately."
faq:
  - q: "Where do I find the sign-in logs?"
    a: "According to Microsoft Learn, sign in to the Microsoft Entra admin center at entra.microsoft.com as at least a Reports Reader and go to Entra ID > Monitoring & health > Sign-in logs."
  - q: "Which filters does Learn suggest?"
    a: "Learn names three: Username for a specific user, Application for a specific app, and Status set to Failure to show only failed sign-ins. After filtering, select the failed sign-in to open its details."
  - q: "What should I note from a failed sign-in?"
    a: "Learn lists the correlation ID, the sign-in error code, the failure reason, and the username, user ID and sign-in identifier. Failure reason describes the error, and Additional Details often gives the fix."
  - q: "How do I look up an error code?"
    a: "Learn points to the error code lookup tool at login.microsoftonline.com/error and to the sign-ins error codes reference in the identity platform documentation."
  - q: "Can users see their own sign-ins?"
    a: "Yes. Learn says users can view their own sign-in history at mysignins.microsoft.com."
---

To troubleshoot a failed sign-in, open the Microsoft Entra sign-in logs, filter to failed sign-ins for the user or app, open the entry and read the failure reason and error code. Then look the code up. This guide follows the Microsoft Learn article on troubleshooting sign-in errors. The article is short, and this guide says where it stops.

## Prerequisites and path

- **Role:** Learn says to sign in as at least a **Reports Reader**. It names this as the least privileged role for activity logs.
- **Portal:** Microsoft Entra admin center at `https://entra.microsoft.com`.
- **Path:** **Entra ID** > **Monitoring & health** > **Sign-in logs**.
- **Licensing:** the article links to a separate page on monitoring and health licensing and does not state requirements itself.

## Steps from the Learn article

1. Open the sign-in logs with the path above.
2. Apply filters:
   - **Username**, for one user.
   - **Application**, for one app.
   - **Status** set to **Failure**, to show only failed sign-ins.
3. Select the failed sign-in to open the details window.
4. Review each tab in the details window. Save these values:
   - Correlation ID
   - Sign-in error code
   - Failure reason
   - Username, User ID and Sign-in identifier
5. Read **Failure reason**. It describes the error. Read **Additional Details** as well, which often gives the fix.
6. Look up the sign-in error code.
7. If the problem persists, open a support request. Learn links to its page on how to get support for Microsoft Entra ID, and the saved details help there.

## Look up the error code

Learn names two places:

- The **error code lookup tool** at `https://login.microsoftonline.com/error`.
- The **sign-ins error codes reference** in the identity platform documentation.

## Common error codes on the page

Learn states this list is not exhaustive.

| Code | Meaning on the page | Action on the page |
| --- | --- | --- |
| 50058 | The user authenticated but is not yet signed in | The entry often shows an object ID instead of a username. User ID may show all zeros |
| 90025 | An internal Microsoft Entra service hit its retry limit | It usually resolves itself. If it persists, the user signs in again |
| 500121 | The user did not complete the MFA prompt | The user finishes MFA setup and signs in |
| 70046 | The session expired or the reauthentication check failed | A Conditional Access policy that requires reauthentication for sign-in risk levels can cause it |

## Common failure reasons on the page

- **Authentication failed during the strong authentication request.** The user did not complete the MFA prompt. Have the user sign in again.
- **The Federation Service failed to issue an OAuth Primary Refresh Token.** Make sure device sync is enabled.
- **Error validating credentials due to invalid username or password.** The user should retry.

## Let users check their own sign-ins

Users can view their own sign-in activity at `https://mysignins.microsoft.com`. This can help when a user reports an unfamiliar sign-in or a failed one and you want a second view.

## What the article does not cover

The page says to explore the details on each tab, but it does not name or describe the tabs. It also gives no log retention periods. If you need to know which tab shows Conditional Access results or how long entries are kept, check the sign-in logs documentation for your license. The article was last updated in April 2025, so confirm that labels in the admin center still match.

## A triage routine

The routine below combines the Learn steps with common practice. The last two steps are not from the article.

1. Ask the user for the time of the failure and the app they used.
2. Filter by username and Status > Failure. Narrow by application if the list is long.
3. Open the entry and record the correlation ID and the error code.
4. Read Failure reason and Additional Details before you search elsewhere.
5. Look up the code in the lookup tool.
6. Compare the code with recent policy or configuration changes in your tenant.
7. If you open a support request, attach the correlation ID, the error code and the timestamp.

## Typical mistakes

- Skipping the Status filter and reading successful sign-ins by accident.
- Treating the list of common codes as complete.
- Reading only the error code and ignoring Additional Details.
- Forgetting the correlation ID, which support will likely ask for.

## Related

- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Troubleshoot sign-in problems with Microsoft Entra sign-in logs (Microsoft Learn)](https://learn.microsoft.com/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
