---
title: "Set Up Azure Blob Lifecycle Management Rules to Tier and Delete Old Data"
summary: "Create an Azure Storage lifecycle management policy in the portal: rule scope and filters, last access time tracking, what the policy can and cannot do, run timing, and the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [azure-blob-storage]
keypoints:
  - "A lifecycle policy is a JSON collection of rules. Rules can move blobs to cooler tiers or delete them based on creation time, last modified time or last access time."
  - "In the portal use the storage account, Data management > Lifecycle management > List View > Add a rule. Azure Storage runs the policy once per day."
  - "Changes can take up to 24 hours to take effect. Disable a policy, wait 24 hours, then delete it."
  - "Last accessed rules need access time tracking enabled and the block blob type."
  - "Policies cannot rehydrate blobs, cannot delete blobs in immutable containers, and a rule has at most 10 prefixes and 10 blob index tag conditions."
faq:
  - q: "Where do I create a lifecycle management rule?"
    a: "Microsoft Learn says to open the storage account in the Azure portal, select Lifecycle management under Data management, open the List View tab and select Add a rule. You can also paste JSON on the Code View tab."
  - q: "How often does the policy run, and when do changes apply?"
    a: "Learn says Azure Storage runs the policy once per day, and that when you add or edit rules it can take up to 24 hours for changes to take effect and for the first execution to start."
  - q: "Which blob types and account types are supported?"
    a: "Policies are supported for block blobs and append blobs in general-purpose v2, premium block blob and Blob Storage accounts. Tiering is allowed only on block blobs, and tiering is not yet supported in premium block blob accounts."
  - q: "Can a lifecycle policy move archived blobs back to hot?"
    a: "No. Learn lists that lifecycle management policies cannot be used to rehydrate blobs to an online tier. A policy can move blobs from cool back to hot immediately when they are accessed."
  - q: "Does lifecycle management cost money?"
    a: "Learn says the policies are free of charge. You pay standard operation costs for Set Blob Tier API calls, delete operations are free, and each last access time update is charged as an other transaction at most once every 24 hours per object."
---

Azure Storage lifecycle management moves blobs to cheaper tiers or deletes them on a schedule you define. It is the standard way to stop old logs and exports from sitting in the hot tier forever. This guide covers how a policy is built, how to create one in the portal, and the limits Microsoft Learn lists.

## What a policy can do

Learn says lifecycle management policies let you:

- Move current versions, previous versions or snapshots of a blob to a cooler tier if they have not been accessed or modified for a period, to optimize cost.
- Move blobs from cool back to hot immediately when they are accessed.
- Delete current versions, previous versions or snapshots at the end of their lifecycle.
- Apply rules to the whole storage account, to selected containers, or to a subset of blobs through name prefixes or blob index tags.

A policy is a collection of rules in a JSON document. Each rule has conditions, actions and filters. Conditions use Creation Time, Last Modified Time or Last Accessed Time, the last only if access time tracking is enabled. Each rule needs at least one action. Filters limit the rule with prefixes and blob tags, combine with a logical AND, and cannot exclude blobs.

## Create a rule in the portal

1. In the Azure portal, open the storage account.
2. Under **Data management**, select **Lifecycle management**.
3. Select the **List View** tab.
4. Select **Add a rule** and name it on the **Details** form. Set the **Rule scope**, **Blob type** and **Blob subtype**. Choosing **Limit blobs with filters** adds a **Filter set** tab.
5. Select **Base blobs** to set conditions. The Learn example moves blobs to the cool tier if they are not modified for 30 days.
6. If you chose filters, select **Filter set** to add an optional filter, such as a name prefix inside one container.
7. Select **Add**.

The rule appears in the **List View** tab. You can also define the policy as JSON on the **Code View** tab.

### Sample JSON

The Learn page shows its example as a screenshot, so the JSON below is a sketch of the same idea: move block blobs under a prefix to cool after 30 days without modification. Check the policy structure article for the exact schema.

```json
{
  "rules": [
    {
      "name": "moveLogsToCool",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": { "blobTypes": [ "blockBlob" ], "prefixMatch": [ "sample-container/log" ] },
        "actions": { "baseBlob": { "tierToCool": { "daysAfterModificationGreaterThan": 30 } } }
      }
    }
  ]
}
```

## Use last access time

To base a rule on when a blob was last read or written, enable access time tracking: in **Lifecycle management**, select the **Enable access tracking** checkbox. Learn says the **Last accessed** option is available only if tracking is enabled and **Block blobs** is selected as the blob type.

## When rules run

Azure Storage runs the policy once per day. When you add or edit rules, it can take up to 24 hours for the changes to take effect and for the first run to start. If you delete a policy, no new runs are scheduled, but a run already in progress continues and you are billed for the actions it needs. Learn recommends disabling the policy first, waiting 24 hours and then deleting it.

## Limits and exceptions

Learn lists these known limitations:

- Tiering is not yet supported in premium block blob accounts. In other accounts, tiering is allowed only on block blobs, not append or page blobs.
- A policy cannot rehydrate blobs to an online tier.
- A policy must be read or written in full. Partial updates aren't supported.
- Each rule can have up to 10 case-sensitive prefixes and up to 10 blob index tag conditions.
- A policy cannot move a blob that uses an encryption scope to the archive tier.
- The delete action does not work on blobs in an immutable container.
- The delete action does not work on blobs in a soft-deleted state. With soft delete enabled, deleted objects go into the soft-deleted state and are kept for the soft-delete period.
- A delete might fail if an Azure Storage Action tries to delete the same blob.
- Lifecycle management does not affect system containers such as `$logs` or `$web`.

## Billing

Policies are free. You pay standard operation costs for Set Blob Tier API calls. Delete operations are free. Each last access time update is charged as an other transaction at most once every 24 hours per object.

## Practical pattern for logs

1. Create one rule per data class, with a container or prefix filter.
2. Move to cool after the period when reads stop, then delete after your retention requirement.
3. Check that no immutability policy or soft delete changes the result you expect.
4. Review the account the day after a change, keeping the 24-hour delay in mind.

## What the pages do not say

The pages I read do not give the total policy size or a rule-count limit, and they do not describe early deletion charges. Check the policy structure and FAQ articles for those before you plan around tier minimums.

## Related

- [Azure Blob Storage](https://www.m365.fm/entity/azure-blob-storage/)

## Sources

- [Optimize costs by automatically managing the data lifecycle](https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview)
- [Configure a lifecycle management policy](https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-policy-configure)
