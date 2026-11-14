---
title: "Entra Access Package Multi-Stage Approval: Set Up Self-Service Requests Step by Step"
summary: "How to configure an access package policy in Microsoft Entra ID Governance with up to three approval stages, fallback and alternate approvers, decision timeouts and requestor questions, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [entra-id-governance, entra-id, microsoft-entra]
keypoints:
  - "Approval is set on the policy of an access package: ID Governance > Entitlement management > Access packages > Policies > Add policy."
  - "Learn describes single-stage, two-stage and three-stage approval. In each stage only one of the selected approvers has to decide."
  - "If an approver denies, or no one in a stage approves in time, the request ends and no access is granted."
  - "Fallback approvers cover a missing manager. Alternate approvers act as the forwarding step and need a timeout of at least four days."
  - "The feature needs Microsoft Entra ID Governance or Microsoft Entra Suite, and approvers cannot approve their own requests."
faq:
  - q: "How many approval stages can an access package policy have?"
    a: "The Microsoft Learn page on approval settings documents single-stage and multi-stage approval and describes a three-stage process with a second and third approver. It does not state a separate maximum, so three is the highest number of stages the page describes."
  - q: "Do all approvers in a stage have to approve?"
    a: "No. According to Microsoft Learn, in a multi-stage policy only one of the selected approvers in each stage must approve for the request to advance. Once one approver submits a decision, the others can no longer act on it."
  - q: "What happens if nobody approves a request?"
    a: "Per Microsoft Learn, if the request is not approved within the number of days set for the stage, it is automatically denied and the user must submit a new request. If approvers deny, or no one approves, the request ends and the identity does not get access."
  - q: "What is the difference between fallback and alternate approvers?"
    a: "Microsoft Learn says fallback approvers receive the request when entitlement management cannot find the user's manager. Alternate approvers receive a pending request after a set number of days if no one has acted. Learn notes that the primary approvers can still decide after the request is forwarded."
  - q: "Which roles can edit access package policies?"
    a: "Microsoft Learn lists Identity Governance Administrator as the minimum role, with Catalog owner and Access package assignment manager as least-privilege alternatives."
---

A self-service access package with more than one approval step is configured on the policy of the package. Open the package, add or edit a policy, and set **How many stages** on the approval part of the **Requests** tab. Then choose approvers, timeouts and fallbacks for each stage. Microsoft Learn describes up to three stages, and in each stage only one approver has to decide.

## What you need first

Learn says the feature requires Microsoft Entra ID Governance or Microsoft Entra Suite subscriptions for your organization's users, and some capabilities may work with a Microsoft Entra ID P2 subscription. The page does not map individual features to licenses, so check the licensing fundamentals page for your plan.

To edit policies you need at least the Identity Governance Administrator role. Catalog owner and Access package assignment manager are the least-privilege alternatives that Learn names. Delegated access package managers can define who can request, who must approve and when access expires.

## Open the policy

1. Sign in to the Microsoft Entra admin center.
2. Go to **ID Governance** > **Entitlement management** > **Access packages**.
3. Open the access package and select **Policies**.
4. Select **Add policy**, or select an existing policy and then **Edit**.
5. On the **Basics** tab, enter a name and description. Select **Next** to reach the **Requests** tab.

## Set who can request

Under **Users who can request access**, choose one of the options Learn lists for users in your directory: specific users and groups, all members excluding guests, or all users including guests. For people outside the directory, choose connected organizations. The option **None (administrator direct assignments only)** removes the request step, and direct assignments by an administrator still need the approvals the policy requires.

Use several policies when different groups need different approval paths. If more than one policy applies, the requestor chooses one when requesting.

## Configure the stages

Turn on approval, then set **How many stages**. The rules from Learn:

- Single-stage: one of the selected approvers or fallback approvers must approve.
- Multi-stage: one approver in each stage must approve for the request to move on.
- A denial before any approval, or no approval at all, ends the request.
- Approvers cannot approve their own requests.

Approver choices depend on who the policy covers:

| Approver type | Available for |
|---|---|
| Manager as approver | Users in the directory |
| Internal sponsor | Users not in the directory |
| External sponsor | Users not in the directory |
| Choose specific approvers (**Add approvers**) | Users or groups in your directory |

A typical pattern from the Learn page is the manager in stage one, a resource owner in stage two and a security reviewer in stage three for confidential resources. For users in the directory, add stage two approvers under **Choose specific approvers**.

Mind the third stage. If **Manager as approver** is selected in stage one or two, only **Choose specific approvers** is available for stage three. To use the manager as the third approver, clear the manager from the earlier stages first. For users outside the directory, internal or external sponsor appears in stage three only if it was not chosen earlier.

## Add fallback and alternate approvers

When the first approver is the manager, select **Add fallback** and choose users or groups. They receive the request if entitlement management cannot find a manager. The manager comes from the **Manager** attribute in the user's Microsoft Entra profile, so an empty attribute is the usual reason a fallback is needed.

For a forwarding step, select **Show advanced request settings** under the approver and set **If no action taken, forward to alternate approvers?** to **Yes**. Then add the alternate approvers and set **Forward to alternate approver(s) after how many days**. Learn lists these limits:

- A request can be forwarded only one day or later after it starts.
- Alternate approval needs a request timeout of at least four days.
- If the manager is the first approver, **Second level manager as alternate approver** is available, and a fallback is then required.
- Primary approvers can still approve or deny after forwarding.

Learn recommends different people for the first, second and alternate roles.

## Set timeouts and justifications

Set **Decision must be made in how many days?** for each stage. If no decision arrives in time, the request is denied automatically and the user must start again. Turn on **Require approver justification** per stage if the reason should be visible to other approvers and the requestor. Turn on **Require requestor justification** when approvers need context.

## Collect requestor answers

On the **Requestor information** tab, use the **Questions** sub-tab. Choose short text, multiple choice or long text, mark the question as **Required** if needed, and optionally add a regex pattern for text answers. Approvers see the answers when they decide. Learn notes that localized strings follow the requestor's browser language.

Finish with the **Lifecycle** tab, then select **Create** or **Update**.

## How approvers act

Approvers receive an email with an **Approve or deny request** link, or open `myaccess.microsoft.com` and select **Approvals** and the **Pending** tab. They select **View**, review the **Details**, choose **Approve** or **Deny**, add a reason if needed and select **Submit**. If notifications are disabled on the access package, no email arrives. Revoking an approved request needs an approver with a Microsoft Entra ID Governance license.

## Typical mistakes

- Choosing the manager in an early stage and then finding no manager option in stage three.
- Setting an alternate approver timeout shorter than four days.
- Leaving out fallback approvers while managers are missing in the directory.
- Assuming every approver in a stage must agree.
- Using the same person as primary and alternate approver.

## What the sources do not say

The Learn pages read for this article do not describe how multi-stage requests are displayed step by step for approvers, and they do not describe forwarding of a request by an approver by hand. The overview page names multi-stage approval but gives no configuration detail.

## Related

- [Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [Change approval settings for an access package in entitlement management](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-access-package-approval-policy)
- [Change request settings for an access package](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-access-package-request-policy)
- [Approve or deny access requests in entitlement management](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-request-approve)
- [What is entitlement management?](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-overview)
