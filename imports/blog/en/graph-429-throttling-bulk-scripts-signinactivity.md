---
title: "Microsoft Graph Returns 429 Too Many Requests in Bulk Scripts: What to Change"
summary: "Your Graph script slows to a crawl or fails with 429 even at one request every ten seconds. Learn why expensive properties and shared quotas matter, and how to back off, split calls and batch safely."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [graph, microsoft-graph-powershell, throttling]
keypoints:
  - "A fixed request rate does not protect you. Limits depend on the request type, the app and the tenant. Learn lists GET signInActivity at 10 requests per minute."
  - "Wait the number of seconds in the Retry-After header, then retry. Learn says Graph keeps logging usage while you are throttled, so immediate retries make it worse."
  - "Splitting expensive properties out of per-user calls, paging with a larger $top, and using delta or change notifications cut the request count."
  - "In a $batch call, each request is judged on its own. The batch returns 200 while single requests inside it fail with 429, and they are not retried for you."
faq:
  - q: "What should a script do when Graph returns 429?"
    a: "Microsoft Learn says to wait the number of seconds in the Retry-After response header and retry, and to keep doing so until the request succeeds. If the response has no Retry-After header, Learn recommends exponential backoff. Learn also says Microsoft Graph SDKs already include handlers for this. The page does not say how Graph PowerShell cmdlets behave, so test your own script."
  - q: "Is Graph throttling counted per SharePoint site or drive?"
    a: "An answer accepted by the asker in a February 2026 Q&A thread (posted anonymously, so its author's role is unknown) said it is not scoped to single sites or drives. Learn's SharePoint throttling page lists user, tenant and application scopes for general requests. The only per-site limits it lists are for anonymous links and anonymous egress. Do not assume that spreading requests over many sites gives you separate quotas."
  - q: "Why do I get throttled when I request signInActivity?"
    a: "Learn's throttling limits page lists GET signInActivity at 10 requests per minute for an app, and warns that $select=signInActivity on List users can cause stricter throttling than usual. It advises $top=500 and, if needed, a $filter on createdDateTime to reduce the data per request."
  - q: "Does a missing signInActivity value mean the user never signed in?"
    a: "Not necessarily. Learn says lastSuccessfulSignInDateTime became available on December 1, 2023 and is not backfilled, so it can be empty for a user whose last sign-in was earlier. The February 2026 thread does not answer this for users with no signInActivity block at all, and Learn does not either. Treat it as unknown."
---

A script reads user data from Microsoft Graph, one user at a time, with a slow and careful rate. It still gets `429 Too Many Requests`. A May 2026 Microsoft Q&A thread describes exactly this: a call for one user, a long `$select` list that includes `signInActivity`, an `$expand=manager`, and a client set to one request every ten seconds with one request in flight.

A second thread, from February 2026, asked how throttling works when many SharePoint and OneDrive drives are read in parallel. Put together, the two threads show why a simple rate limit on the client is not enough. This article explains what Microsoft Learn documents and what the threads only suggested. It is a troubleshooting guide, not an official Microsoft procedure.

## What the threads reported

**May 2026 thread (users endpoint).** The asker got 429 on `GET /v1.0/users/{id}` with many properties, including `signInActivity`, plus `$expand=manager`. Pagination and filters did not help, because each call returned one user. A Microsoft moderator answered that the expensive properties, not only the request rate, drive the throttling. The moderator suggested splitting the calls (profile, sign-in activity, manager), honoring `Retry-After` with exponential backoff, caching, and reading sign-in activity less often. That answer was not marked accepted. An AI-generated answer, which the asker did mark as accepted, said much the same. The asker did not say whether the 429s stopped.

**February 2026 thread (driveItems).** The asker wanted to know if throttling applies per site or drive, and what concurrency is safe. An anonymous answer, accepted by the asker, said that limits are layered across tenant, app and service, that requests to different sites can draw on the same quota, and that you should honor `Retry-After`, use `$batch`, and prefer delta queries and change notifications over polling. It gave no concurrency number. The asker said it helped.

## Step 1: Read the 429 properly

Capture three things on every failure: the request URL, the `Retry-After` value and the time. Learn's Graph PowerShell troubleshooting page suggests running a cmdlet with `-Debug` to see the HTTP method, URI and status code, and says to record the `request-id` and `date` response headers if you open a support ticket.

The May 2026 thread did not quote a `Retry-After` value. Without it, nobody can say which limit the script hit.

## Step 2: Honor Retry-After

Learn's throttling page is clear on this:

1. Wait the number of seconds in the `Retry-After` header.
2. Retry the request.
3. If it fails with 429 again, keep using the same delay until it succeeds.

Learn explains why: Microsoft Graph continues to log resource usage while a client is throttled, so backing off with the header is the fastest way to recover. Immediate retries add to your usage. If the response has no `Retry-After` header, Learn recommends exponential backoff.

Learn says the Microsoft Graph SDKs already handle this. It does not say the same for Graph PowerShell cmdlets, so do not assume it. If your script wraps raw calls, such as `Invoke-MgGraphRequest`, build the wait in yourself.

## Step 3: Find the expensive calls

Learn's service-specific limits page has a section for identity and access reports. It lists these numbers, which can change:

- Any request in that group: 122 requests per 10 seconds per app across all tenants, and 5 requests per 10 seconds per app per tenant.
- `GET signInActivity`: 10 requests per minute.

Your one-in-ten-seconds script makes 6 calls a minute, which is under 10 on paper. The thread does not say whether other jobs from the same app registration ran at the same time. Those jobs would share the budget, because the limits apply per app and per tenant. This is a conclusion from Learn's limits table, not something the thread states.

Learn also says that `$select=signInActivity` on List users may cause stricter throttling than standard calls. Its advice:

- Use `$top=500`, the maximum page size when you select `signInActivity`, instead of the default 100.
- Use `$filter` on `createdDateTime` to query smaller time spans. Start with about three days of data and narrow the span if you are throttled.
- The `signInActivity` property needs a Microsoft Entra ID P1 or P2 license and the `AuditLog.Read.All` permission, per Learn's List users page.

If you need sign-in activity for many users, a list call such as `GET /v1.0/users?$select=displayName,userPrincipalName,signInActivity&$top=500` returns up to 500 users per request. That means far fewer requests than one call per user. Learn's List users page documents this request with `signInActivity`. Whether it is also lighter on the service side is not stated, so measure it.

The moderator in the May thread suggested reading `signInActivity` through the beta endpoint. Learn's current v1.0 reference documents `signInActivity`, so you should not need beta for it. Check the property on the endpoint you use.

## Step 4: Cut the number of requests

Learn's best practices point the same way:

- Reduce the number of operations per request and the frequency of calls.
- Avoid continuous polling and regular scans of large collections. Use change tracking (delta queries) and change notifications when they exist.
- Cache data that does not change often, such as manager relationships. This is advice from the moderator in the May thread, not a Learn statement.

## Step 5: Use $batch with care

Batching can reduce network round trips. Learn's JSON batching page sets a limit of 20 individual requests per batch. It also says:

- Each request in a batch is evaluated against the throttling limits on its own. If one exceeds them, that request fails with 429, while the batch itself returns 200. Several requests can be throttled in one batch.
- Retry each failed request using the `retry-after` value in the response body for that request. Learn says you might retry them all in a new batch after the longest `retry-after` value.
- If an SDK retries throttled requests when they are not batched, throttled requests inside a batch are not retried automatically.

So batching does not remove the limit. It moves the retry logic into your code.

## Step 6: Plan SharePoint and OneDrive reads

For drive scans, Learn's SharePoint throttling page says that SharePoint Online returns 429 or 503 with a `Retry-After` header, and that throttled requests count toward the limits. It lists throttling at user, tenant and application scope, and its only per-site limits are for anonymous links and anonymous egress. Do not plan around a separate quota per site. Other points from that page:

- Traffic with no app ID and no User-Agent string is undecorated. Learn says well-decorated traffic is prioritized over undecorated traffic. The documented User-Agent formats are `ISV|CompanyName|AppName/Version` and `NONISV|CompanyName|AppName/Version`.
- A single-item query costs 1 resource unit, a multi-item query or write costs 2, and permission operations, including `$expand=permissions`, cost 5. Avoid permission expansion in bulk scans.
- Learn recommends Microsoft Graph over CSOM and REST where possible, because it usually uses fewer resources.

The February thread also touched on `410 Gone` for delta queries. The answer there said it means the delta token can no longer be used, and the client should start again with a new initial delta query. Plan for that in any incremental sync.

## Verify

1. Log the number of 429 responses and the `Retry-After` values for one run before and after your changes.
2. Run the script alone, with no other job using the same app registration, to see the effect of your own calls.
3. If throttling continues with correct backoff and reduced calls, collect the `request-id` and `date` headers and open a support case.

## Limits

- The May 2026 thread has no confirmed outcome, and the accepted answer there was AI-generated. The Learn guidance above is the evidence used here.
- The asker's question about users with no `signInActivity` block was never answered in the thread. Learn does not describe it either, so treat a missing block as unknown. Learn does say `lastSuccessfulSignInDateTime` is not backfilled before December 1, 2023, so an empty value does not prove the user never signed in.
- Limits listed by Learn are marked as subject to change. Check the live page before you build around a number.

## Related

- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Throttling](https://www.m365.fm/entity/throttling/)

## Sources

- [Microsoft Learn: Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)
- [Microsoft Learn: Microsoft Graph service-specific throttling limits](https://learn.microsoft.com/en-us/graph/throttling-limits)
- [Microsoft Learn: Combine multiple requests with JSON batching](https://learn.microsoft.com/en-us/graph/json-batching)
- [Microsoft Learn: List users](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)
- [Microsoft Learn: signInActivity resource type](https://learn.microsoft.com/en-us/graph/api/resources/signinactivity)
- [Microsoft Learn: Avoid getting throttled or blocked in SharePoint Online](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online)
- [Microsoft Learn: Troubleshoot common errors in Microsoft Graph PowerShell](https://learn.microsoft.com/en-us/powershell/microsoftgraph/troubleshooting?view=graph-powershell-1.0)
- [Microsoft Q&A: Throttling issue with users endpoint (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5902304/throttling-issue-with-users-endpoint)
- [Microsoft Q&A: Microsoft Graph throttling behavior when processing driveItems in parallel (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5768152/microsoft-graph-throttling-behavior-when-processin)
