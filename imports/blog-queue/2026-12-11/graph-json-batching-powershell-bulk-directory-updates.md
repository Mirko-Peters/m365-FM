---
title: "Microsoft Graph Batch Requests in PowerShell: Speed Up Large Directory Updates"
summary: "Use JSON batching with Invoke-MgGraphRequest to send up to 20 Graph calls per request, check each response status, retry only throttled items and avoid the common batching mistakes."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [microsoft-graph-powershell, graph, powershell]
keypoints:
  - "A batch is one POST to https://graph.microsoft.com/v1.0/$batch with a requests array. The maximum is 20 individual requests per batch."
  - "A parseable batch returns 200 even if single requests failed. Always check the status of each entry in responses."
  - "Each request in a batch is throttled individually. Throttled items return 429 and are not retried automatically, so your script must retry them."
  - "Responses can come back in a different order. Match them to your input by id, which must be unique or the batch fails with 400."
  - "Invoke-MgGraphRequest has no batch switch. The Learn page shows only a GET example, so the loop below is an illustrative pattern built on its documented parameters."
faq:
  - q: "How many requests can I put into one Graph batch?"
    a: "According to Microsoft Learn, a JSON batch can contain a maximum of 20 individual requests. The Graph SDKs split larger sets automatically, but with Invoke-MgGraphRequest in PowerShell you chunk the requests yourself."
  - q: "If the batch returns 200, did everything succeed?"
    a: "No. Learn says a parseable batch returns 200 even if individual requests inside it failed, and a malformed batch returns 400. Check the status property of every entry in the responses array."
  - q: "How do I handle throttling in a batch?"
    a: "Microsoft Learn says each request in a batch is evaluated individually, so some can return 429 while the batch itself returns 200. Throttled requests in a batch are not retried automatically. Retry them yourself using the retry-after value in the JSON of that response, for example in a new batch after the longest value."
  - q: "Can requests in a batch depend on each other?"
    a: "Yes, with the dependsOn array of request ids. If a request fails, every request that depends on it fails with 424 Failed Dependency. Learn's tip is to make a batch either fully sequential or fully parallel."
  - q: "Does Invoke-MgGraphRequest support POST bodies?"
    a: "The cmdlet reference lists the Body parameter as required when the method is Post or Patch, and a ContentType parameter. The reference page shows only a GET example, so for batch bodies build the JSON yourself."
---

To update many directory objects quickly, group up to 20 calls into one POST to the `$batch` endpoint, send it with `Invoke-MgGraphRequest`, then check every response and retry only the throttled ones. Batching reduces round trips. It does not raise throttling limits, because each request inside a batch is still evaluated on its own.

## How batching works

Per Microsoft Learn:

- Method and URL: `POST https://graph.microsoft.com/v1.0/$batch`.
- Body: one JSON object with a `requests` array.
- Each request needs `id` (unique string), `method` and a relative `url` such as `/users/...`. A `body` and `headers` (with `Content-Type`) are needed when you send content.
- The response has a `responses` array. Each entry has `id`, `status`, `headers` and `body`. Order can differ from the request order, so match by `id`.
- Maximum **20** requests per batch. A duplicate `id` fails the whole batch with 400.

| Result | Meaning |
|---|---|
| Batch 400 | Malformed batch or duplicate id |
| Batch 200 | Parseable. Individual entries may still have failed |
| Entry 429 | That request was throttled |
| Entry 424 | A request it depends on failed |

## Step 1: Connect with the right scopes

Use `Connect-MgGraph` with scopes that cover every call in the batch. The cmdlet reference does not discuss scopes, so use the permission listed on each Graph API page for the operation.

## Step 2: Build chunks of 20

The Graph SDKs split batches automatically at the limit. In PowerShell with `Invoke-MgGraphRequest` you do it yourself. The following is an illustrative pattern built on the documented parameters (`-Method`, `-Uri`, `-Body`, `-ContentType`). Adapt the operation and test on a few objects first.

```powershell
$updates = @(
  # one object per directory change, for example: @{ Id = '<user id>'; Body = @{ department = 'Sales' } }
)

$chunks = for ($i = 0; $i -lt $updates.Count; $i += 20) {
  ,$updates[$i..([Math]::Min($i + 19, $updates.Count - 1))]
}

foreach ($chunk in $chunks) {
  $n = 0
  $requests = foreach ($u in $chunk) {
    $n++
    @{
      id      = "$n"
      method  = 'PATCH'
      url     = "/users/$($u.Id)"
      body    = $u.Body
      headers = @{ 'Content-Type' = 'application/json' }
    }
  }
  $payload = @{ requests = @($requests) } | ConvertTo-Json -Depth 6
  $result  = Invoke-MgGraphRequest -Method POST `
              -Uri 'https://graph.microsoft.com/v1.0/$batch' `
              -Body $payload -ContentType 'application/json'
  # inspect $result.responses here
}
```

Use single quotes around `$batch` so PowerShell does not expand it.

## Step 3: Check every response

Loop over `$result.responses`. Treat anything that is not a 2xx status as a failure, log the `id`, the status and `body.error.message`, and keep the failed ids. Learn's example response shows 403 for permissions and 405 for an endpoint that exists only in beta, so the error body is worth logging.

## Step 4: Retry only throttled items

Learn explains that if a batch item exceeds limits it gets 429 while the batch returns 200, and that throttled requests in a batch are not retried automatically, even in SDKs that retry unbatched calls. Collect the 429 items, read the retry-after value in each response's JSON and resend them in a new batch after the longest value. Avoid immediate retries, because all requests count against your limits. The throttling page also says that Graph recommends exponential backoff when no `Retry-After` is present.

## Use dependsOn sparingly

If a second call needs the first, add `dependsOn` with the first id. A failure in the first makes the second fail with 424. Learn recommends a batch be either fully sequential or fully parallel. For bulk updates of independent objects, leave `dependsOn` out.

## Plan the bulk run

1. Export the objects and intended changes to a file first, so the run is repeatable.
2. Test with one chunk of a few objects. Confirm the result in the directory before you continue.
3. Log every response entry with its status, so you can rerun only failures.
4. Keep the number of operations per request and the call frequency low. The throttling page lists reducing both as ways to avoid throttling, and it prefers change tracking (delta query) and change notifications over regular polling or scanning.
5. Remember that writes are more likely to be throttled than reads, and that underlying services such as Exchange, Planner or Teams have their own limits on top of Graph.

## Other uses

Batching can also avoid URL length limits for long `$filter` clauses, because the URL moves into the body. Headers such as `ConsistencyLevel: eventual` go in each request's `headers`.

## Typical mistakes

- Sending more than 20 requests in one batch.
- Treating a 200 on the batch as success.
- Reusing an `id` inside one batch.
- Expecting responses in input order.
- Retrying everything at once instead of only the 429 items.
- Using a scope that fits only some operations in the batch, which gives 403 for those entries.

## What the pages do not say

The `Invoke-MgGraphRequest` reference does not list OutputType values or show a POST example, and the SDK batching article has no PowerShell notes. The code above is a pattern, not Microsoft sample code. For bulk extraction rather than updates, the throttling page recommends Microsoft Graph Data Connect.

## Related

- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Combine multiple requests in one HTTP call using JSON batching](https://learn.microsoft.com/en-us/graph/json-batching)
- [Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)
- [Invoke-MgGraphRequest](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.authentication/invoke-mggraphrequest)
- [Use the Microsoft Graph SDKs to batch requests](https://learn.microsoft.com/en-us/graph/sdks/batch-requests)
