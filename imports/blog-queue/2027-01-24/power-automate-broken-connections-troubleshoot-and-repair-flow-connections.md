---
title: "Power Automate Broken Connections: Troubleshoot and Repair Flow Connections"
summary: "Eleven causes of broken Power Automate connections from Microsoft Learn, matched to the error text you see: timeouts, DLP blocks, disabled devices, 90-day inactivity, password changes, Entra changes, deleted owners, disabled apps, Conditional Access mismatches and Terms of Use. Fix for each."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [power-automate, entra-id, conditional-access, dlp]
keypoints:
  - "Learn lists eleven causes, including expired tokens, DLP blocks, password changes, Conditional Access mismatches, disabled accounts and Terms of Use."
  - "Match the error message to the cause first, for example the refresh token has expired due to inactivity points to a connection that was not used for 90 days."
  - "After a password change, create the connection again or edit the existing one, because the old connection is invalid."
  - "If the owner account is deleted or disabled, another user with access can reauthorize the connection, which restores it for all users."
  - "For embedded flows in SharePoint, Teams or Excel, align Conditional Access requirements with the Microsoft Flow Service or target Office 365 or All cloud apps."
faq:
  - q: "What are the main reasons a Power Automate connection breaks?"
    a: "Microsoft Learn names expired tokens, DLP blocks, password changes, Conditional Access policy mismatches and disabled accounts. Its list has eleven items: connection timeout, DLP block, invalid authenticated devices, long inactivity, attended mode licensing, password modification, Microsoft Entra ID configuration changes, deleted or disabled owner account, disabled application, Conditional Access mismatch for embedded flows and Terms of Use."
  - q: "My connection says the refresh token expired due to inactivity. What now?"
    a: "Learn describes this as a connection that was not used for a specified period. Its example is the SharePoint connector, which needs to be used at least once every 90 days. The fix is to create a new connection or reauthorize the existing one."
  - q: "A flow broke after a password change. Is that expected?"
    a: "Yes. Learn says every password update invalidates the existing connection that uses the old password. Create a connection for each affected connector or edit the existing one. The page also suggests using services such as Microsoft Entra ID to avoid the problem."
  - q: "The connection owner left the company. Do all flows stop?"
    a: "Learn says a deleted or disabled owner account makes the connection invalid for all users who share it. Another user who has access can reauthorize the connection, which updates ownership and restores the function for everyone."
  - q: "Why does a flow fail only when opened from SharePoint, Teams or Excel?"
    a: "The host app exchanges its token for a Microsoft Flow Service token. If Conditional Access policies set different requirements such as MFA, Terms of Use or device compliance for one app but not the other, the exchange fails. Learn advises targeting Office 365 or All cloud apps, or making the requirements consistent."
---

A connection in Power Automate stores a sign-in that flows reuse in the background. When the sign-in stops being valid, the connection breaks and the flow fails. The Microsoft Learn page on resolving broken connections lists eleven causes, and for most of them it gives an error message you can match. This article keeps the page's structure, so you can find your message and go straight to the fix.

## How to use the list

1. Open the failed run and read the exact error text.
2. Find the same wording below.
3. Apply the fix, or hand it to the right person. Several causes need the tenant administrator.

## Causes with error text and fixes

### 1. Connection times out

A client tries to connect to a server, but the server does not respond within the time limit. Learn gives the reasons as an offline server, network issues or a server that takes too long. A message that can go with it:

> The user could not be authenticated as the grant is expired. The user must sign in again.

Fix, as listed on the page:

1. Check that your internet connection is stable.
2. Check that the server is online.
3. Try increasing the timeout limit.

### 2. DLP block

A Data Loss Prevention policy detects that an action breaks the organization's rules and blocks it. Messages named on the page include:

- Access has been blocked by Conditional Access policies. The access policy does not allow token issuance.
- Device is not in required device state: domain_joined. Conditional Access policy requires a domain joined device, and the device is not domain joined.

Fix: review the DLP policies to see what is blocked and why. If an administrator blocked the connector or connection, ask them to unblock it.

### 3. Invalid authenticated devices

This happens when a user authenticates with a device for multifactor authentication, but the device is disabled. Learn says this is not a Power Automate problem but a tenant configuration at the administrative level. Messages listed:

- Device object was not found in the tenant directory.
- Device is not in required device state: compliant. The user must enroll their device with an approved MDM provider like Intune.
- Device used during the authentication is disabled.
- Application needs to enforce Intune protection policies.
- Error from token exchange. Permission denied due to missing connection ACL.

Fix: contact the tenant administrator to find out why the device was disabled, then try to reauthorize the connection.

### 4. Long inactivity

A connection becomes invalid when it is not used for a set period. Learn's example: the SharePoint connector requires use at least once every 90 days to stay active. Messages:

- The refresh token has expired due to inactivity. The token was issued on a date and was inactive for 90.00:00:00.
- The provided authorization code or refresh token has expired due to inactivity. Send a new interactive authorization request for this user and resource.

Fix: create a new connection or reauthorize the existing one.

### 5. Attended mode connection problem

A user tries to use features that need an unattended mode license without having it. In attended mode the user is present and interacts with the system. Unattended mode runs fully automated processes. Fix: make sure the user has the correct license for unattended mode. Learn links the page Which Power Automate licenses do I need.

### 6. Password modification

If you delete or change the password of the account that created the connection, or let it expire, the connection breaks until it is updated. Message:

> The provided grant has expired due to it being revoked, a fresh auth token is needed. The user might have changed or reset their password.

Fix: every password update invalidates the existing connection that uses the old password. Create a connection for each affected connector, or edit the existing one.

### 7. Microsoft Entra ID configuration change

Changes at the Entra ID level can invalidate tokens and require users to sign in again. Learn names moving to a new location, altering user roles and updating security settings. Message:

> Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access the resource.

Fix: contact the tenant administrator to learn what changed, and reauthorize the connection if necessary.

### 8. Owner account deleted or disabled

When the account that created a connection is removed or disabled, the connection becomes invalid for all users who share it. Messages include that the user account has been deleted from the directory, that it is disabled, or that it does not exist in the directory.

Fix: another user who has access reauthorizes the connection. This updates ownership and restores the function for all users.

### 9. Application disabled by the tenant administrator

Deactivating an application registered in Entra ID invalidates service principal connections tied to it, because it can no longer issue tokens. Message:

> The service principal for resource is disabled. This indicate that a subscription within the tenant has lapsed, or that the administrator for this tenant has disabled the application, preventing tokens from being issued for it.

Fix: the tenant administrator re-enables the application or creates a new service principal connection.

### 10. Conditional Access mismatch for embedded flows

Connections can look broken when you open a flow from SharePoint, a Teams channel or an Excel workbook, and the Conditional Access requirements of the host app and Power Automate differ. A typical message:

> AADSTS50076: Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access the resource.

Cause per Learn: the host app exchanges its token for a **Microsoft Flow Service** token. If one app requires MFA, Terms of Use or device compliance and the other does not, the exchange fails. This usually happens when policies target single apps instead of **Office 365** or **All cloud apps**.

Fix, for administrators:

1. In the Microsoft Entra admin center go to **Protection** > **Conditional Access** > **Policies**.
2. Switch the policy to target **Office 365** or **All cloud apps**.
3. If you must target single apps, make the requirements consistent between the host apps and Microsoft Flow Service. Learn gives its application ID as 7df0a125-d3be-4c96-aa54-591f83ff541c.
4. Ask affected users to sign out and back in.

### 11. Terms of Use breaks connections

A Terms of Use requirement added to a Conditional Access policy after flows are running, or a consent that expires on a schedule, can break connections. The status you see is:

> Failed to refresh access token for service

The message does not mention Terms of Use. Cause per Learn: connections refresh tokens silently in the background, and the Terms of Use page cannot be shown without an interactive session. This breaks even flows that worked before the policy existed.

Fix:

1. Check the Entra sign-in logs for AADSTS50158 or AADSTS53003 errors for the Microsoft Flow Service resource. On the **Conditional Access** tab, look for a Terms of Use grant control with the status **Not Satisfied**.
2. Ask the flow owner to sign in to the Power Automate portal and accept the Terms of Use prompt.
3. Repair or re-create the connection.
4. To prevent it, exclude service accounts and dedicated flow connection owners from Conditional Access policies with Terms of Use grant controls.

## Quick map (my reading)

The columns on who acts are my own reading, not part of the Learn page.

| What you see | Likely cause | Who acts |
| --- | --- | --- |
| Grant is expired, user must sign in again | Timeout | Flow owner |
| Blocked by Conditional Access, device state errors | DLP block or device state | Administrator |
| Device disabled, missing connection ACL | Invalid authenticated device | Administrator |
| Refresh token expired due to inactivity | Unused for the period | Flow owner |
| Grant revoked, password changed | Password change | Flow owner |
| User account deleted or disabled | Owner removed | Another user with access |
| Service principal disabled | Application disabled | Administrator |
| AADSTS50076 from an embedded flow | Conditional Access mismatch | Administrator |
| Failed to refresh access token for service | Terms of Use | Owner and administrator |

## Prevention (my advice)

This is my suggestion, not guidance from the page:

- Run important flows under a dedicated service account rather than a personal account, so a password change or a leaver does not stop them. If you do, plan how that account fits your Conditional Access policies, as the Terms of Use section describes.
- Keep a list of flows with the connection owner and a second person who has access, so the reauthorization in cause 8 can happen at once.
- For connectors that are rarely triggered, schedule a check well before the inactivity period, since the page names 90 days for SharePoint as one example.
- After a Conditional Access change, test one flow from each embedded surface you use.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Data loss prevention (DLP)](https://www.m365.fm/entity/dlp/)

## Sources

- [Resolve Power Automate Broken Connections (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-automate/connections/troubleshoot-broken-connections)
