---
title: "Power Automate Pagination and Throttling Limits for Large Datasets"
summary: "How to get past the 100-item default and the 5,000-row traps in Power Automate cloud flows, and how daily request limits, 429 errors and retries work, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [power-automate, throttling, sharepoint]
keypoints:
  - "SharePoint Get items returns 100 items by default. Top Count can raise this up to the 5,000 list view threshold; going beyond fails without pagination."
  - "Learn lists a paginated items limit of 5,000 for the Low profile and 100,000 for all others. To process more, trigger multiple flow runs."
  - "Every action, retry and extra pagination request counts toward the daily request limit. Failed actions count, skipped ones do not."
  - "A 429 error is connector throttling, not a daily-limit problem. Spread, batch or filter the calls instead of buying capacity."
  - "Flows throttled continuously for 14 days are turned off automatically."
faq:
  - q: "Why does Get items return only 100 rows?"
    a: "Microsoft Learn's guidance for SharePoint Get items says the default item limit is 100 and that items are paginated by default. Setting Top Count in Advanced options raises the limit up to the list view threshold of 5,000."
  - q: "What is the maximum number of paginated items?"
    a: "The Power Automate limits page lists 5,000 paginated items for the Low profile and 100,000 for all other profiles. It advises triggering multiple flow runs over the data to process more."
  - q: "Does a Process license fix 429 errors?"
    a: "No. Microsoft Learn states that a Process license raises the daily action entitlement to 250,000 actions per 24 hours but does not raise connector limits or Dataverse service protection limits. A 429 from one connector needs spreading, batching or a different connection."
  - q: "Do retries count against my limits?"
    a: "Yes. Learn's request counting rules say retries and extra requests from pagination count as actions, and both successful and failed actions count while skipped actions do not."
  - q: "What happens if a flow stays throttled?"
    a: "According to the limits page, flows that are continuously throttled for 14 days turn off automatically. They can be turned on again at any time, but they are turned off again if they keep violating the limits."
---

Large datasets hit three separate limits in Power Automate, and each needs a different fix. A connector returns a limited page of items unless pagination is configured. A single run can only loop over so many items. And the platform throttles flows by daily request volume and by connector-specific rules. Mixing these up leads to the wrong remedy, such as buying a license when the real problem is a 429 from one connector.

This article is based on three Microsoft Learn pages listed under Sources. Where they leave gaps, the text says so.

## Step 1: Understand what the connector returns

For SharePoint Get items and Get files, Learn states that the default item limit is 100 and that items are paginated by default. A flow that only specifies the site and the list returns 100 items.

Two settings change this:

- **Top Count** under **Advanced options** raises the limit up to the list view threshold of 5,000. Beyond 5,000, Learn says Power Automate fails and shows an error.
- **Pagination** in the action settings menu is the fix Learn names for lists with more than 5,000 items when a filter query is used. Without it, a filter on a large list can return no records if nothing in the first 5,000 items matches.

The SharePoint guidance page is dated June 2022. It does not give the exact menu location of the pagination threshold or any threshold value. Check the current action settings in the designer for that.

## Step 2: Filter at the source

Learn lists the following ways to reduce requests, and they also shrink pages:

- Use an OData filter query on the action instead of filtering inside an **Apply to each** loop.
- Use **Select** and **Filter array** instead of loops when reshaping data.
- Use **Limit columns by view** and **Limit Entries to Folder** on Get items.
- Add trigger conditions so the flow runs only when needed.

The SharePoint page shows filter examples such as `Location eq 'Midwest' and Status eq 'Approved'` and order-by expressions such as `Title asc`.

## Step 3: Know the per-run limits

The limits page lists these values for a single run:

| Limit | Value |
|---|---|
| Paginated items | 5,000 for Low, 100,000 for all others |
| Apply to each array items | 5,000 for Low, 100,000 for all others |
| Apply to each concurrency | Default 1, can be set from 1 to 50 |
| Concurrent runs | Unlimited when Concurrency Control is off, 1 to 100 when on (default 25 when on) |
| Split on items | 100 when trigger concurrency is on |
| Run duration | 30 days |

For more items than the limit, Learn says to trigger multiple flow runs over the data. Concurrency Control is off by default and cannot be turned off again without deleting and re-adding the trigger.

## Step 4: Count your requests

Daily limits depend on the license plan and apply across all runs of all flows in 24 hours. Learn's counting rules:

- Every trigger and action generates a request, including built-in actions such as Compose and Initialize variable.
- Successful and failed actions count. Skipped actions do not.
- An action inside **Apply to each** counts once per item.
- Retries and extra pagination requests count.

A loop over 20,000 items with three actions therefore produces roughly 60,000 requests plus the trigger. To see the numbers, open the flow details page, select **Analytics** and then the **Actions** tab.

A Process license entitles a flow to 250,000 actions per 24 hours. Learn adds that up to 10 Process licenses can be stacked on one flow, and that solution-aware flows in a flow group share one entitlement. The flow must be in a solution.

There is also a burst cap. Learn says the cap is currently 100,000 actions in five minutes, and suggests child flows or trigger conditions to stay under it.

## Step 5: Read a 429 correctly

Learn describes connector throttling as an HTTP 429 (Too Many Requests) with text such as "Rate limit is exceeded. Try again in 27 seconds". Every connector has its own limit, and this page gives no values.

| Symptom | Limit | Remedy from Learn |
|---|---|---|
| Whole flow delayed, high daily action count | Daily action limit | Process license or fewer requests |
| 429 from one connector | Connector limit | Spread calls over time, batch them, or use a different connection |
| Errors against Dataverse under load | Dataverse service protection | Reduce the request rate. A Process license does not raise it |

Dataverse limits are evaluated per user, usually the flow owner. The Power Platform requests add-on raises a user's limit, not a flow's, and cannot be assigned to a flow.

## Step 6: Configure retries with care

Power Automate can retry an action, configured per action. The Power Platform well-architected guidance says to use the built-in retry when one exists and to prefer an exponential interval for background operations. It also warns against endless retries and against stacked retry layers. Its example is a retry count of three on two calls, which gives nine attempts in total against the service.

The pages read do not state Power Automate's default retry count or interval. Check the action's **Settings** pane before relying on a number from a blog post.

## Typical mistakes

- Raising Top Count above 5,000 instead of enabling pagination.
- Looping over a full list and filtering inside the loop.
- Setting high concurrency on a connector that is already returning 429.
- Treating a 429 as a license problem.
- Ignoring that retries also use up daily requests.

If a flow is throttled for 14 days in a row, Learn says it is turned off automatically.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Throttling](https://www.m365.fm/entity/throttling/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Understand Power Automate limits (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/understand-limits)
- [Limits of automated, scheduled, and instant flows (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Working with Get items and Get files (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/dev/business-apps/power-automate/guidance/working-with-get-items-and-get-files)
- [Handle transient faults (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/well-architected/reliability/handle-transient-faults)
