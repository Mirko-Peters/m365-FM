---
title: "Microsoft Graph delta queries with PowerShell for user lifecycle sync"
summary: "How to sync user changes with Microsoft Graph delta queries in PowerShell: the nextLink and deltaLink loop, token handling, removed users, the 7-day token limit and the limits that cause silent gaps."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [graph, powershell, microsoft-graph-powershell, microsoft-graph-permissions]
keypoints:
  - "Delta query is a pull model. Call users/delta once for the full state, follow nextLink pages, save the deltaLink, and call it next time to get only changes."
  - "Directory object delta tokens last seven days. An expired token returns an error such as syncStateNotFound, and a 410 Gone means a full resync."
  - "Any query parameter such as $select must be in the initial request. After that, use the returned URL as it is."
  - "Removed users show an @removed object with reason changed (restorable from deletedItems) or deleted (not restorable)."
  - "User delta does not track licenseAssignmentStates, and $filter supports only id eq with a limit of 50 objects."
faq:
  - q: "How long is a Graph delta token valid for users?"
    a: "Microsoft Learn says the limit for directory objects is seven days. When a token expires, the service should respond with a 40X-series error with codes such as syncStateNotFound, and the app should start with a full synchronization."
  - q: "How do I find users that were deleted?"
    a: "Learn says removed instances are returned with their id and an @removed object. A reason of changed means the item was deleted and can be restored from deletedItems. A reason of deleted means it can't be restored. Restored items appear as newly created instances."
  - q: "Which permission does the users delta call need?"
    a: "Learn lists User.Read.All as the least privileged permission, delegated or application. Personal Microsoft accounts are not supported."
  - q: "Can I get only the properties that changed?"
    a: "Yes. Learn says the Prefer: return=minimal header on a request using a deltaLink returns only the properties that changed. Without it, unchanged properties are returned with their old values."
  - q: "Should I poll or use change notifications?"
    a: "Learn describes combining both. An app can subscribe to change notifications and then use delta query to fetch all changes since the last request. Learn says this nearly eliminates frequent polling for supported resources."
---

Delta queries let a script read only the users that changed since the last run instead of reading the whole directory each time. The pattern is: run `users/delta` once to get the current state, save the `@odata.deltaLink`, and call that saved link on every later run. This article shows the loop in PowerShell and the limits Microsoft documents for user sync.

## How the call pattern works

Learn describes delta query, also called change tracking, as a way to discover created, updated or deleted entities without a full read. The flow:

1. Send `GET https://graph.microsoft.com/v1.0/users/delta`.
2. If the response contains `@odata.nextLink`, more pages exist. Request that URL, even if the current page is empty.
3. When a response contains `@odata.deltaLink`, you have the full current state. Save the whole URL.
4. On the next run, request the saved deltaLink to receive changes.

A page never contains both links. The nextLink holds a `$skiptoken` and the deltaLink holds a `$deltatoken`. Both are opaque, so copy the URL instead of building it.

Users deleted before the first delta call are not returned. Updates made before it are summarized in the latest state of each user.

## Permissions

For `users/delta`, Learn lists `User.Read.All` as the least privileged permission, for delegated work or school accounts and for application permissions. Personal Microsoft accounts are not supported. An unattended lifecycle job normally uses an app registration with the application permission.

## Step 1: The PowerShell loop

The Microsoft Graph PowerShell SDK can send raw requests with `Invoke-MgGraphRequest`. This sketch follows the documented flow. State is stored in a file, and the token URL is saved only after the last page was processed.

```powershell
Connect-MgGraph -Scopes "User.Read.All"
$stateFile = ".\users-delta.txt"
$uri = if (Test-Path $stateFile) { Get-Content $stateFile -Raw } else {
  "https://graph.microsoft.com/v1.0/users/delta?`$select=displayName,jobTitle,accountEnabled"
}
$headers = if (Test-Path $stateFile) { @{ Prefer = "return=minimal" } } else { @{} }   # minimal applies to deltaLink requests
do {
  $page = Invoke-MgGraphRequest -Method GET -Uri $uri -Headers $headers
  foreach ($u in $page.value) {
    if ($u.ContainsKey('@removed')) { "REMOVED  $($u.id)  reason=$($u['@removed'].reason)" }
    else { "CHANGED  $($u.id)  $($u.displayName)" }
  }
  $uri = $page.'@odata.nextLink'
  if ($page.'@odata.deltaLink') { $page.'@odata.deltaLink' | Set-Content $stateFile -NoNewline }
} while ($uri)
```

The code is an illustration of the documented pattern, not a tested production script. Add error handling, retries and logging before using it. The Learn page also shows the SDK cmdlet `Get-MgUserDelta`, for example with `-Property "displayName,jobTitle,mobilePhone"`, as an alternative to raw requests.

If you only care about future changes, Learn describes a "sync from now" option for Microsoft Entra resources such as users. Append `$deltatoken=latest` to the delta function, and the response contains an `@odata.deltaLink` and no resource data.

## Step 2: Choose properties once

Learn is clear on two rules. A query parameter must be in the initial request, and later requests should reuse the returned URL because the token encodes the parameters. The overview adds that `$select` is supported on some Microsoft Entra resources so you can change the properties tracked for an existing deltaLink, with the caveat that `$select` and `$skiptoken` together are not supported. This article does not rely on that, so if you want different properties the safe route is a new full sync.

`$select` has a trap. Learn says that if a property you did not select changes, the user does not appear in the delta response. Select every property your downstream system cares about. The `id` is always returned.

By default, responses contain all selected property values, changed or not, and the response does not tell you which changed. With `Prefer: return=minimal` on a deltaLink request, only changed properties come back.

## Step 3: Handle removals and restores

Removed users arrive as an `id` plus an `@removed` object:

| Reason | Meaning per Learn |
|---|---|
| `changed` | Deleted, and can be restored from deletedItems |
| `deleted` | Deleted and cannot be restored |

A user restored from deletedItems shows up as a newly created instance. Design the downstream action for a removal as reversible, such as disabling an account in the target system, before you delete it.

## Step 4: Plan for the limits

Learn lists these limits for delta queries:

- **Token lifetime:** seven days for directory objects. After expiry, expect a 40X error with codes such as `syncStateNotFound`, then run a full sync. A `410 Gone` also means start over.
- **Replays:** the same change can appear again. Make the target update idempotent.
- **Duplicates and order:** a single entity can appear multiple times, and you should not assume a sequence.
- **Delays:** expect varying delay between a change and its appearance. Retry later if a change is missing.
- **Properties:** only properties stored in the main data store trigger changes, and for users, changes to `licenseAssignmentStates` are not tracked.
- **Directory extensions:** when one directory extension property changes, all directory extension properties of the same data type are returned, changed or not.
- **Filters:** for users, `$filter` supports only `id eq {value}`, up to 50 objects. `$top`, `$orderby` and `$expand` are not supported on user and group delta.
- **Tenants:** change tracking is not supported in external tenants of Microsoft Entra External ID or in Azure AD B2C tenants.

A job that runs less often than every seven days will lose its token. Schedule it daily, and alert when a run fails so the gap never reaches seven days.

## Step 5: Add change notifications if you need speed

Delta query is pull. Change notifications are push. Learn describes using a subscription to learn that something changed, then calling the delta function for the details. That reduces polling and the chance of throttling for supported resources.

## Typical mistakes

- Saving the deltaLink before the last page was processed, then losing changes after a crash.
- Changing `$select` between runs and expecting the token to follow.
- Treating `@removed` as final when the reason is `changed`.
- Missing licensing changes because the property is not tracked. Read licenses separately on a schedule.

## Related

- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)

## Sources

- [Use delta query to track changes in Microsoft Graph data](https://learn.microsoft.com/en-us/graph/delta-query-overview)
- [user: delta](https://learn.microsoft.com/en-us/graph/api/user-delta)
