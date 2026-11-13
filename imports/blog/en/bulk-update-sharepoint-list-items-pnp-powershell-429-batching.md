---
title: "Bulk-Updating SharePoint Lists With PnP PowerShell Without 429 Errors: Batching and Built-In Retry"
summary: "A bulk update hits 429 or 'HttpClient.Timeout of 100 seconds'? PnP PowerShell already retries. Use batching, read fewer items, raise the timeout for long jobs and make throttling visible."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [pnp-powershell, throttling, sharepoint, retry-pattern, batch-size]
keypoints:
  - "SharePoint Online answers with 429 or 503 and a Retry-After header. Microsoft Learn says to honor that header, because throttled requests still count against your usage."
  - "PnP docs: throttled requests are retried up to 10 times, so a homemade retry loop is rarely needed. A request and its retries must finish within 100 seconds unless you raise SharePointPnPHttpTimeout."
  - "Batching with New-PnPBatch, -Batch and Invoke-PnPBatch cuts the number of requests sharply. The docs say large batches are split into chunks of 100 requests for SharePoint and 20 for Graph."
  - "Retries do not show with -Verbose. Use Start-PnPTraceLog to see them."
faq:
  - q: "Do I need my own retry loop around PnP PowerShell cmdlets?"
    a: "Usually not for short throttling. The PnP throttling page says requests to SharePoint Online and Microsoft Graph pass through a retry handler. It honors Retry-After, caps a single wait at 300 seconds and retries up to 10 times. A long throttle can still make a cmdlet fail, so add a retry only around the whole job, and do not reconnect on every retry."
  - q: "Why does my cmdlet fail with 'HttpClient.Timeout of 100 seconds'?"
    a: "The PnP docs say a request and all its retries must finish within a 100-second HTTP timeout. A long Retry-After can use up that time. For long jobs, set the SharePointPnPHttpTimeout environment variable, in seconds or -1 for no timeout, before you connect. It does not apply to cmdlets built on the PnP Core SDK."
  - q: "Does SharePoint Online return RateLimit headers I can use for pacing?"
    a: "A community answer suggested monitoring RateLimit headers. Microsoft Learn contradicts itself here: one section says RateLimit headers give early signals, while another says SharePoint Online does not return or support the IETF RateLimit headers and that apps should honor Retry-After instead. Do not build pacing on them. Rely on Retry-After."
  - q: "How many items can I update per minute?"
    a: "Learn lists default limits that depend on your license count and that can change. For the smallest tier it gives 1,250 resource units per minute for one app in your tenant, and it says to estimate 2 units per request. Learn also says CSOM and REST have no predetermined cost and usually use more than Graph, so treat the figure as a rough floor. Check the live page for your tier."
---

A script that updates a few hundred list items runs fine. Run it on 50,000 items and it slows to a crawl, prints 429 errors or stops with a timeout message. The usual first reaction is to wrap everything in a retry loop with a long sleep.

This article uses a January 2026 Microsoft Q&A thread as its scenario. An asker updated a large set of list items sequentially through the SharePoint REST API and still got `429 Too Many Requests`. The accepted answer proposed batches and a retry loop. We check each idea against Microsoft Learn and the PnP PowerShell documentation. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- Long jobs stop, or crawl, with HTTP 429 even though calls are sequential (the Q&A thread).
- The cmdlet fails with `Too many http request retries: 10`.
- The cmdlet fails with `The request was canceled due to the configured HttpClient.Timeout of 100 seconds elapsing`.

The last two messages are named in the PnP throttling page. They are two different ends of the same problem: the retry count ran out, or the time ran out.

## Step 1: Understand what throttling means

Microsoft Learn says SharePoint Online answers application requests with HTTP 429 (too many requests) or HTTP 503 (server too busy). Both carry a `Retry-After` header that gives the wait in seconds. Learn says throttled requests still count toward your limits, so ignoring the header can cause more throttling. It also says that an application which keeps exceeding the limits may be blocked completely, in which case it keeps getting 503 and the tenant is notified in the Message Center.

Sequential calls can still be throttled. The Q&A answer said so, and Learn's limits are budgets over time windows, for example per minute, so a steady stream of calls can use one up.

## Step 2: Remove homemade retry code first

The PnP throttling page says PnP PowerShell already retries. When a response is 429, 503 or 504, or the connection drops, the handler waits for the `Retry-After` value. If there is none, it waits 1, 2, 4, 8 seconds and so on, and no single wait is longer than 300 seconds. It retries up to 10 times. Requests that change data are retried too.

For batches, the docs add that throttled Graph requests are retried with a 3-second starting wait without reading `Retry-After`, and that a SharePoint batch is retried as a whole.

The script in the accepted Q&A answer reconnects interactively on every retry. A new sign-in does not change throttling. Keep retries around the whole job at most, and keep one connection.

## Step 3: Make the retries visible

The PnP page says retries do not show with `-Verbose`. They go to the trace log at the default `Information` level:

```powershell
Start-PnPTraceLog -WriteToLogStream
# run your cmdlets
Get-PnPTraceLog | Where-Object Message -like "*retry*"
```

Entries look like "Retrying request ... due to status code TooManyRequests", followed by the wait. Cmdlets built on the PnP Core SDK are the exception and do not write these entries. Counting them tells you whether the job is throttled constantly or only in bursts.

## Step 4: Batch the updates

The batching page uses `Add-PnPListItem` as its example. Without batching, adding one item needs around 6 requests, so 100 items mean at least 600. With a batch, the list fields are fetched once and cached in the batch, and each new item adds one request. The page gives no figure for updates, but `Set-PnPListItem` supports `-Batch` in the same way.

```powershell
$batch = New-PnPBatch
Get-PnPListItem -List "Projects" -PageSize 500 -Query "<View><Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Old</Value></Eq></Where></Query></View>" |
    ForEach-Object { Set-PnPListItem -List "Projects" -Identity $_.Id -Values @{ Status = "Archived" } -Batch $batch }
Invoke-PnPBatch -Batch $batch -Details
```

The list and the `Status` text column are examples. Use internal field names, as the cmdlet page asks.

What the docs say about large batches:

- `Invoke-PnPBatch` splits a batch into chunks. A SharePoint REST batch goes out in chunks of 100 requests, and a Graph batch in chunks of 20.
- If one chunk hits an error, processing continues with the next chunks by default. Add `-StopOnException` to stop at the first error.
- `Add-PnPListItem`, `Set-PnPListItem` and `Remove-PnPListItem` support `-Batch`. The batching page lists them; check the cmdlet pages for others.

You do not need to cut chunks of 100 yourself. For a very large job you may still call `Invoke-PnPBatch` every few hundred items to get progress output and to limit memory. That is a design choice, not a documented requirement.

## Step 5: Read less

- Use `-PageSize` on `Get-PnPListItem`, and `-Fields` or a CAML `-Query` with `<ViewFields>` to fetch only what you need. The cmdlet page shows both.
- Filter on the server with CAML instead of fetching every item and filtering in PowerShell.
- The changelog for 3.4.0 says `Set-PnPListItem` and `Add-PnPListItem` now fetch only the fields named in `-Values` when you do not use `-Batch`.

Learn adds that Graph usually costs fewer resource units than CSOM or REST for the same task, so prefer Graph where PnP has a Graph-based cmdlet. Check the cmdlet before you assume which API it calls.

## Step 6: Set the timeout and identify your traffic

For long jobs, set the timeout before you connect:

```powershell
$env:SharePointPnPHttpTimeout = 600
$env:SharePointPnPUserAgent = "NONISV|YourCompany|ListCleanup/1.0"
Connect-PnPOnline -Url https://yourtenant.sharepoint.com/sites/projects -ClientId <id> -Tenant yourtenant.onmicrosoft.com -Thumbprint <thumbprint>
```

`SharePointPnPHttpTimeout` takes seconds, or `-1` for none, and does not apply to cmdlets built on the PnP Core SDK. `SharePointPnPUserAgent` must be set before the first connection in the session and uses the format `NONISV|CompanyName|AppName/Version`. Learn says undecorated traffic is deprioritized and gives the same format for enterprise applications.

## Step 7: Plan against the limits

Learn lists default limits that depend on your license count and says they can change. Example values for the smallest tier, 0 to 1,000 licenses:

| Limit | Value |
|---|---|
| One app in your tenant, per minute | 1,250 resource units |
| One app in your tenant, per 24 hours | 1,200,000 resource units |
| One user, per 5 minutes (flat, not tied to the tier) | 3,000 requests |

Learn counts 2 units for create, update and delete requests and says to use 2 units per request for planning. By that rule, 1,000 item updates cost about 2,000 units, which is more than one minute of the smallest tier's app budget. This is our arithmetic from Learn's numbers, and only a rough floor: Learn says CSOM and REST have no predetermined unit cost and usually use more than Graph. Batched requests are still evaluated one by one, according to Learn. Spreading a large job over time is advice from the PnP page.

## Known issues from related threads

- **Out of memory:** A June 2025 GitHub issue reported `Get-PnPListItem` running out of memory on libraries with hundreds of thousands of items, even with `-ScriptBlock` and `-PageSize`. The reporter said all items still go to the output. The issue closed with no confirmed fix. For huge lists, narrow the query first.
- **Batched multi-choice fields:** An April 2025 issue reported a multi-choice value written one character at a time in a batch. A maintainer said it was fixed, and one commenter confirmed the fix on a 3.1.18 nightly build. Another commenter could not reproduce it on a simple list. Update first if you see it.
- **List object in a loop:** A June 2026 issue on version 3.2.0 reported `Set-PnPListItem -List $list` failing on the second item, where `$list` came from `Get-PnPList`. The maintainer answered that an earlier fix for how the client context is cloned had caused this regression and that the new fix would be in the next nightly. The thread has no confirmation. The 3.3.0 changelog lists a fix for how `ClientContext` is handled in `Set-PnPListItem` and related cmdlets, which may be the same one. The sources do not link them. Passing the list title as a string worked for the reporter.
- **Apostrophe in the list title:** A September 2026 issue reported `Set-PnPListItem -Batch` failing when the list title contains an apostrophe. A maintainer said the fix was committed for the next nightly build and closed the issue. The reporter's own workaround was to double the apostrophe. Nobody confirmed the fix.

## Limits and open points

- The January 2026 Q&A thread was accepted by its asker, who only wrote thanks. Nobody reported that the script fixed the throttling.
- That answer advised watching RateLimit headers. The Learn throttling page contradicts itself on this: one section mentions RateLimit headers as early signals, another says SharePoint Online does not return or support them. Honor `Retry-After` and do not depend on the headers.
- If throttling stays high with batching, fewer reads and one connection, collect the time of the failures and your app's request pattern. Learn says blocks are announced in the Message Center, so check it too.

## Related

- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)
- [Throttling](https://www.m365.fm/entity/throttling/)
- [Retry pattern](https://www.m365.fm/entity/retry-pattern/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: Avoid getting throttled or blocked in SharePoint Online](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online)
- [PnP PowerShell: Throttling and retries](https://pnp.github.io/powershell/articles/throttling.html)
- [PnP PowerShell: Batching in PnP PowerShell](https://pnp.github.io/powershell/articles/batching.html)
- [PnP PowerShell: Invoke-PnPBatch](https://pnp.github.io/powershell/cmdlets/Invoke-PnPBatch.html)
- [PnP PowerShell: Set-PnPListItem](https://pnp.github.io/powershell/cmdlets/Set-PnPListItem.html)
- [PnP PowerShell: Get-PnPListItem](https://pnp.github.io/powershell/cmdlets/Get-PnPListItem.html)
- [PnP PowerShell: Start-PnPTraceLog](https://pnp.github.io/powershell/cmdlets/Start-PnPTraceLog.html)
- [PnP PowerShell changelog](https://github.com/pnp/powershell/blob/dev/CHANGELOG.md)
- [Microsoft Q&A: SharePoint REST API returns 429 throttling errors during batch operations (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5698692/sharepoint-rest-api-returns-429-throttling-errors)
- [GitHub: Get-PnPListItem causes out of memory exceptions (issue 4989, June 2025)](https://github.com/pnp/powershell/issues/4989)
- [GitHub: When batch updating, multi-select choice fields get updated character by character (issue 4875, April 2025)](https://github.com/pnp/powershell/issues/4875)
- [GitHub: Set-PnPListItem fails when updating list items with -List from Get-PnPList (issue 5348, June 2026)](https://github.com/pnp/powershell/issues/5348)
- [GitHub: Set-PnPListItem with an apostrophe in the name when using -Batch fails (issue 5479, September 2026)](https://github.com/pnp/powershell/issues/5479)
