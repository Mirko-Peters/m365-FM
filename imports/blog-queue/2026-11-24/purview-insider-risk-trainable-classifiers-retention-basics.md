---
title: "Insider Risk Management in Microsoft Purview: Basics With Trainable Classifiers and Retention"
summary: "What Insider Risk Management does in Microsoft Purview, how it works with trainable classifiers and retention, and what to set up first, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [insider-risk-management, trainable-classifiers, retention-policies, purview]
keypoints:
  - "Insider Risk Management correlates signals to find malicious or inadvertent insider risks such as IP theft, data leakage and security violations, in five stages from policy to action."
  - "Users in Insider Risk Management are pseudonymized by default, and role-based access controls and audit logs support user-level privacy."
  - "Trainable classifiers recognize content that patterns can't catch. Pretrained ones are ready to use, custom ones are English only and can't be retrained once published."
  - "Retention settings can retain, delete, or retain and then delete. Retention wins over deletion, and the longest retention period wins."
  - "Start with permissions and the audit log, then create a policy from a template. First alerts appear after about 24 hours."
faq:
  - q: "What is Insider Risk Management in Microsoft Purview?"
    a: "According to Microsoft Learn, it is a compliance solution that correlates various signals to identify potential malicious or inadvertent insider risks, such as IP theft, data leakage and security violations. Reviewers work through policies, alerts, triage, investigation and action."
  - q: "Do trainable classifiers work in every language?"
    a: "No. Microsoft Learn says pretrained classifiers evaluate the languages listed on its classifier definitions page, while custom trainable classifiers are English only. Classifiers also only work with items that aren't encrypted."
  - q: "What wins when a retention policy and a retention label conflict?"
    a: "Microsoft Learn describes four principles. Retention wins over deletion, the longest retention period wins, explicit wins over implicit for deletions, and the shortest deletion period wins. A retention label's delete action always beats a retention policy's delete action."
  - q: "Which license is needed for Insider Risk Management?"
    a: "The Microsoft Learn pages read for this article don't give a full list. The configuration page says to confirm a supported Microsoft 365 subscription, names Microsoft 365 Enterprise E5 for trials, and notes that some indicators need pay-as-you-go billing. Check the Purview service description before buying."
---
Insider Risk Management is a Microsoft Purview solution that correlates signals to find risky activity by people inside the organization. Trainable classifiers and retention are two other Purview building blocks that often sit next to it. Classifiers help recognize content types. Retention keeps or deletes that content on a schedule. This article explains what each one does, how they relate, and what to set up first.

## What Insider Risk Management does

Microsoft Learn describes Insider Risk Management as a compliance solution that "correlates various signals to identify potential malicious or inadvertent insider risks, such as IP theft, data leakage, and security violations." The workflow has five stages:

1. **Policies.** Create policies from predefined templates and policy conditions.
2. **Alerts.** Risk indicators generate alerts when activity matches a policy.
3. **Triage.** Reviewers evaluate alerts. An alert can open a new case, join an existing case, or be dismissed.
4. **Investigate.** Reviewers use User activity, Content explorer and Case notes.
5. **Action.** Reviewers resolve the case, send a notice template, or escalate to another Purview solution such as eDiscovery (Premium).

The page lists twelve policy templates. They include Data theft by departing users, Data leaks, Data leaks by priority users, Data leaks by risky users, Security policy violations, Risky AI usage and Risky browser usage (preview). Pick the template that matches the question the organization wants answered, not the one with the most indicators.

### Privacy by design

Microsoft states that the solution is built with privacy by design. Users are pseudonymized by default, and role-based access controls and audit logs help protect user-level privacy. Tenant-level administrators can enable user-level identification. The configuration page adds that customers are solely responsible for using the service in compliance with applicable laws, so involve legal and HR before turning identification on.

## What to set up first

The configuration page lists six steps. Four are required, one is recommended and one is optional.

1. Assign permissions. The role groups named are **Insider Risk Management** and **Insider Risk Management Admins**. Enabling analytics also needs a Microsoft 365 Global Administrator. Microsoft recommends the roles with the fewest permissions.
2. Enable the Microsoft 365 audit log. Auditing is on by default in Microsoft 365 organizations. If it is off, confirm with other administrators before turning it on. After you turn it on, wait for the audit log to be prepared before searching.
3. Optional: enable insider risk analytics. Results might take up to 48 hours.
4. Recommended: configure the prerequisites for policies, for example connecting apps in Microsoft Defender for cloud indicators.
5. Configure the insider risk settings.
6. Create a policy.

After the first policy exists, alerts from activity indicators start arriving after about 24 hours. Plan the review team before that, because an alert queue without reviewers is only noise.

## What trainable classifiers add

Some content can't be found by labels or pattern matching. A trainable classifier, according to Microsoft Learn, learns to identify a type of content "by looking at hundreds of examples of the content you want to detect."

There are two kinds:

- **Pretrained classifiers.** Microsoft provides them. They show the status Ready to use and need no training.
- **Custom classifiers.** You supply a set of examples that are definitely in the category and a set that definitely aren't. Purview makes predictions, you confirm true and false positives and negatives, and then you publish the classifier.

Microsoft lists these places to use classifiers: auto-labeling Office files with sensitivity labels, auto-applying retention label policies, sensitivity label conditions, and data loss prevention. Communication compliance accepts only Microsoft-provided classifiers.

Limits worth knowing:

- Custom classifiers are English only.
- Classifiers only work with items that aren't encrypted.
- Retraining a published custom classifier isn't supported. Remove it and start again with larger sample sets. An unpublished classifier can still get an updated data set.
- The page gives no minimum or maximum seed count beyond "hundreds of examples."
- If you create a new SharePoint site and folder for seed data, allow at least an hour for indexing first.

## How retention fits in

Retention settings keep content in place and do one of three things: retain only, delete only, or retain and then delete. When content is edited or deleted while retained, Microsoft keeps a copy in a secure location. In SharePoint and OneDrive this is the Preservation Hold library. In Exchange it is the Recoverable Items folder.

### Policy or label

| | Retention policy | Retention label |
|---|---|---|
| Scope | Site or mailbox level | Item level (folder, document, email) |
| Moves with content | No | Yes, within the tenant |
| Applied manually | No | Yes |
| Applied by conditions such as trainable classifiers | No | Yes |
| Can mark an item as a record | No | Yes |

Microsoft's guidance is to use a policy when everything in a site or mailbox gets the same settings, and a label when items need different settings. Using both is supported. Labels don't cover Teams or Viva Engage messages. Use policies for those.

This is where trainable classifiers meet retention. A label policy can apply a retention label automatically when a classifier matches, so contracts, for example, get a longer retention period than general documents.

### When settings overlap

Retain and delete outcomes are calculated independently. Microsoft lists four principles:

1. Retention wins over deletion.
2. The longest retention period wins.
3. Explicit wins over implicit for deletions. A label's delete action always beats a policy's delete action.
4. The shortest deletion period wins.

eDiscovery holds take precedence over all retention settings. A labeled item has only one retention label at a time. Microsoft's example: a policy that deletes after three years and a label that retains for five years means the email is kept five years and then permanently deleted.

## Common mistakes

- Starting with analytics and policies before permissions and the audit log are in place.
- Expecting a custom classifier to work on non-English or encrypted content.
- Trying to improve a published classifier by retraining it. The documented path is to rebuild it.
- Assuming a retention label can be prioritized over another. Retention labels can't be prioritized.
- Using a label policy for Teams messages. Labels don't support them.

## Related

- [Insider Risk Management](https://www.m365.fm/entity/insider-risk-management/)
- [Trainable classifiers](https://www.m365.fm/entity/trainable-classifiers/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)
- [Retention labels](https://www.m365.fm/entity/retention-labels/)

## Sources

- [Learn about Insider Risk Management, Microsoft Learn](https://learn.microsoft.com/en-us/purview/insider-risk-management)
- [Get started with Insider Risk Management settings, Microsoft Learn](https://learn.microsoft.com/en-us/purview/insider-risk-management-configure)
- [Learn about trainable classifiers, Microsoft Learn](https://learn.microsoft.com/en-us/purview/trainable-classifiers-learn-about)
- [Learn about retention policies and retention labels, Microsoft Learn](https://learn.microsoft.com/en-us/purview/retention)
