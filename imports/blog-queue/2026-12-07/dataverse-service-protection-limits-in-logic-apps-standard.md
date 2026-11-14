---
title: "Dataverse Service Protection Limits in Logic Apps Standard: Handling 429 and Concurrency"
summary: "How Dataverse service protection limits (6,000 requests, 20 minutes execution time, 52 concurrent requests) interact with Logic Apps Standard retry policies, loop concurrency and host settings."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [dataverse, azure-logic-apps, throttling]
keypoints:
  - "Dataverse limits are evaluated per user over a five-minute sliding window: 6,000 requests, 20 minutes of combined execution time, and 52 or more concurrent requests per web server."
  - "The Web API answers with HTTP 429 and a Retry-After header. Logic Apps retry policies trigger on 408, 429 and 5xx."
  - "The default Logic Apps policy is exponential with up to 4 retries. A custom policy allows 1 to 90 retries."
  - "Standard workflows run For each with a default parallelism of 20. Lowering it, down to 1, is the main lever against concurrent request errors."
  - "Learn does not say whether Logic Apps honors the Retry-After header, so test the behavior before relying on it."
faq:
  - q: "What are the default Dataverse service protection limits?"
    a: "Microsoft Learn lists, per user and per web server, 6,000 requests within a five-minute sliding window, 20 minutes (1,200 seconds) of combined execution time in that window, and 52 or higher concurrent requests. The page notes these are defaults and can vary by environment."
  - q: "Which error codes show the limit that was hit?"
    a: "Learn maps requests to 0x80072322, execution time to 0x80072321 and concurrent requests to 0x80072326. With the Web API all of them surface as HTTP 429 Too Many Requests with a Retry-After header in seconds."
  - q: "Does a Logic Apps retry policy cover 429?"
    a: "Yes. Microsoft Learn says retry policies apply when the request times out or fails with a 408, 429 or 5xx response. The page does not describe how the Retry-After header is handled."
  - q: "How do I slow a For each loop in a Standard workflow?"
    a: "Microsoft Learn documents Runtime.Backend.ForeachDefaultDegreeOfParallelism with a default of 20 iterations, and says setting it to 1 runs the loop sequentially. It is a host setting in host.json."
  - q: "Do application users get higher limits?"
    a: "No. Microsoft Learn states that the same limits apply to application users as to other users. Plug-in requests do not count, but their execution time is added to the triggering request."
---

Dataverse protects itself with service protection limits, and a Logic Apps Standard workflow that loops over many rows can hit them quickly. The limits are per user, so the identity behind the Dataverse connection decides who gets throttled. The fix is a combination of lower loop concurrency, a retry policy that backs off, and smaller batches. No Microsoft page read for this article describes the Dataverse connector in Logic Apps specifically, so this guide joins two documented sides and marks the gaps.

## The limits on the Dataverse side

Microsoft Learn states that Dataverse evaluates limits for each authenticated user over a five-minute (300-second) sliding window, except for concurrent requests. Each web server enforces them independently. Defaults:

| Measure | Default per web server | Error code |
|---|---|---|
| Number of requests | 6,000 in five minutes | 0x80072322 |
| Combined execution time | 20 minutes (1,200 seconds) in five minutes | 0x80072321 |
| Concurrent requests | 52 or higher | 0x80072326 |

With the Web API, each of these is an HTTP 429 Too Many Requests. The response carries a Retry-After header with a number of seconds. The duration depends on the demanding requests of the preceding five minutes and grows if the caller keeps sending them. The concurrent request error returns immediately.

Other facts from the page:

- Application users have the same limits as other users.
- Plug-ins and custom workflow activities do not count their requests, but their execution time is added to the triggering request.
- Dataverse search follows a different throttle of one request per second per user.

## What Microsoft recommends for callers

- Let the server set the pace. Increase the request rate gradually and use Retry-After to decide when to send more.
- Use limited parallelism. The page gives no fixed recommended value.
- Use small batches. Start with a batch size of 10 and raise concurrency until retryable errors appear. With the SDK, ExecuteMultiple typically allows up to 1,000 operations, but larger batches raise the chance of hitting the execution time limit.
- Move away from large periodic jobs toward real-time integration.

Power Automate's limits page adds a related point: Dataverse limits are evaluated per user, usually the flow owner, and a Process license does not raise them. The same logic applies to a Logic Apps connection, but no Logic Apps page read here says so.

## The Logic Apps side: retry policies

Microsoft's article on handling workflow errors and exceptions in Logic Apps says retry policies apply to triggers and actions that support them. They trigger when a request times out or fails with 408, 429 or 5xx.

| Policy type | Behavior |
|---|---|
| Default | Exponential interval for most operations, up to 4 retries, intervals scaled by 7.5 seconds and capped between 5 and 45 seconds |
| None | No resend |
| Exponential interval | Random wait from an exponentially growing range |
| Fixed interval | Same wait before each resend |

For a custom policy, `count` is 1 to 90. Intervals run from `PT5S` to `P1D` for Standard stateful workflows. Stateless Standard workflows allow `PT1S` to `PT1M`. The exponential maximum interval defaults to 1 hour in Standard, and the minimum to 5 seconds.

In the designer, select the action, open **Settings**, and set **Retry policy** under **Networking**. In code view, add a `retryPolicy` object to the action's `inputs`:

```json
"retryPolicy": {
  "type": "exponential",
  "count": 8,
  "interval": "PT20S",
  "minimumInterval": "PT10S",
  "maximumInterval": "PT5M"
}
```

The values here are an example built from the documented properties, not a Microsoft recommendation. The article does not describe whether the Retry-After header from Dataverse overrides the configured interval. Test with a deliberately throttled run and read the run history to see the actual waits.

## Reduce concurrency in loops

Standard host settings, documented on the host and app settings page, include:

- `Runtime.Backend.ForeachDefaultDegreeOfParallelism`: default 20 iterations. Setting it to 1 runs the loop sequentially.
- `Runtime.Backend.FlowDefaultForeachItemsLimit`: 100,000 items for stateful workflows, 100 for stateless.
- `Runtime.Trigger.MaximumRunConcurrency`: default 100 runs for the listed trigger types.
- `Runtime.Backend.ApiConnectionOperation.DefaultRetryCount`: default 4 for managed connector actions.

Settings go in the `extensions.workflow.Settings` object of host.json. Because 20 parallel iterations that each call Dataverse can exceed 52 concurrent requests when several runs overlap, lower the loop concurrency first and measure again. The pages do not say which of these settings applies to a given Dataverse connector, so confirm in a test.

## A practical order of fixes

1. Identify which limit was hit from the error code in the run history.
2. For concurrent request errors, lower loop parallelism and trigger concurrency.
3. For request count and execution time errors, spread the work in time and use smaller batches.
4. Set an exponential retry policy with a sensible maximum, not an endless loop.
5. Add a failure path with a scope and **Run after** set to **Has failed**, so throttled items are logged and can be re-queued.
6. Keep a retry count low on each layer. Microsoft's reliability guidance warns that retries on both calls of a chain multiply attempts.

## Typical mistakes

- Setting a retry count of 90 and hammering a throttled service.
- Using one shared connection identity for many workflows, so all of them share the same per-user limits.
- Raising loop concurrency to speed up a job that is already near the 6,000 request mark.
- Inserting records with retries but without idempotency, which Microsoft warns can cause incorrect values in a Dataverse table.

## Related

- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Stateful workflows (Azure Logic Apps)](https://www.m365.fm/entity/logic-apps-stateful-workflows/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Throttling](https://www.m365.fm/entity/throttling/)

## Sources

- [Service protection API limits (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits)
- [Handle workflow errors and exceptions in Azure Logic Apps (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/logic-apps/error-exception-handling)
- [Edit host and app settings for Standard logic apps (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/logic-apps/edit-app-settings-host-settings)
- [Understand Power Automate limits (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/understand-limits)
- [Handle transient faults (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/well-architected/reliability/handle-transient-faults)
