---
title: "Microsoft Entra Access Reviews: Set Up, Run and Automate Reviews in ID Governance"
summary: "How to create a Microsoft Entra access review for groups and applications, which settings matter (reviewers, recurrence, auto apply, no response), what licenses and roles apply, and how to automate and monitor reviews."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [access-reviews, entra-id-governance, microsoft-entra]
keypoints:
  - "Create a review in the Microsoft Entra admin center under ID Governance > Access Reviews > New access review. The minimum role is Identity Governance Administrator."
  - "Reviews need Microsoft Entra ID Governance or Microsoft Entra Suite. Some capabilities work with ID P2, but inactive-user reviews and affiliation recommendations need ID Governance."
  - "Reviews of Entra roles are created in PIM, and reviews of access package assignments in entitlement management, not in the main Access Reviews area."
  - "Auto apply results removes denied access when the review ends. Combined with Remove access or Take recommendations for non-responders, it can revoke all access to the resource."
  - "Pilot with a small group and noncritical resources first, with auto apply off, and watch the audit log for review events."
faq:
  - q: "What are Microsoft Entra access reviews?"
    a: "According to Microsoft Learn, access reviews let organizations manage group memberships, access to enterprise applications and role assignments. User access is reviewed regularly so that only the right people keep it. Reviews can be recurring on a weekly, monthly, quarterly or annual schedule."
  - q: "What license and role do I need to create an access review?"
    a: "Microsoft Learn says reviews require a Microsoft Entra ID Governance or Microsoft Entra Suite subscription, and some capabilities may work with Microsoft Entra ID P2. Reviews of inactive users and reviews with user-to-group affiliation recommendations require Microsoft Entra ID Governance. To create a review of groups or applications you need at least the Identity Governance Administrator role."
  - q: "Where do I create a review for privileged roles or access packages?"
    a: "Microsoft Learn lists the creation location by access type. Microsoft Entra roles and Azure resource roles are reviewed from Privileged Identity Management. Access package assignments are reviewed from entitlement management. Group and application reviews are created under ID Governance and Access Reviews in the Microsoft Entra admin center."
  - q: "What happens if reviewers do not respond?"
    a: "The If reviewers don't respond setting offers No change, Remove access, Approve access and Take recommendations. Microsoft warns that Remove access or Take recommendations combined with Auto apply results to resource can revoke all access to the resource if reviewers do not respond."
  - q: "Can access reviews be automated?"
    a: "Yes. Microsoft Learn says you can create a review with the Microsoft Graph call POST /identityGovernance/accessReviews/definitions, which needs the AccessReview.ReadWrite.All permission, or with the PowerShell cmdlet New-MgIdentityGovernanceAccessReviewDefinition. Inside the portal, Auto apply results applies decisions automatically at the end of the review."
---

A Microsoft Entra access review asks the right people, on a schedule, whether users should keep access to a group, an application or a role. It is a governance control: it finds access that nobody needs any more and removes it. This guide covers where reviews are created, what they need, how to build one, and how to automate and monitor it. Details come from Microsoft Learn.

## What you can review and where the review lives

Microsoft Learn lists where each kind of review is created:

| Access to review | Possible reviewers | Created in |
|---|---|---|
| Security group or Microsoft 365 group members | Specified reviewers, group owners, self-review | Access reviews (Microsoft Entra groups) |
| Assignment to a connected app | Specified reviewers, self-review | Access reviews (enterprise apps) |
| Microsoft Entra role | Specified reviewers, self-review | Privileged Identity Management |
| Azure resource role | Specified reviewers, self-review | Privileged Identity Management |
| Access package assignments | Specified reviewers, group members, self-review | Entitlement management |

This matters because the main Access Reviews area handles groups and applications. Role reviews start in PIM, and access package reviews start in the access package settings.

## Licenses and roles

Reviews require a Microsoft Entra ID Governance or Microsoft Entra Suite subscription. Some capabilities may work with Microsoft Entra ID P2. Three capabilities need ID Governance: reviews of inactive users, reviews with user-to-group affiliation recommendations, and reviews of multiple resources together (preview).

To create a review of groups or applications, Microsoft says you need at least the **Identity Governance Administrator** role. For an application review, the app must first be integrated with Microsoft Entra ID in your tenant. Microsoft's deployment guide adds that the app needs **User assignment required?** set to **Yes**, or its access cannot be reviewed.

## Create a review step by step

Sign in to the Microsoft Entra admin center and go to **ID Governance** > **Access Reviews** > **New access review**.

**1. Scope**

- Select **Review access to a resource type**.
- Choose **Teams + Groups** (either **All Microsoft 365 groups with guest users** or **Select Teams + groups**) or **Applications**.
- Choose **Guest users only** or **Everyone**. For group membership you can also check **Inactive users (on tenant level)** and set **Days inactive**, up to 730.

**2. Reviews**

- Under **Select reviewers**, choose **Group owner(s)** (groups only), **Selected user(s) or groups(s)**, **Users review their own access** or **Managers of users**. For managers and group owners you can set a fallback reviewer.
- Set **Duration (in days)**, **Start date** and an end: **Never**, a specific date, or after a number of occurrences.

**3. Settings**

- **Auto apply results to resource:** removes denied access automatically when the review ends. If it is off, someone must apply the results manually.
- **If reviewers don't respond:** No change, Remove access, Approve access or Take recommendations.
- **Action to apply on denied guest users:** remove membership, or block sign-in for 30 days and then remove the user from the tenant. This applies only to reviews scoped to guests.
- **Decision helpers:** **No sign-in within 30 days** recommends approval for users who signed in during the past 30 days and denial for the others. **User-to-Group Affiliation** is based on distance in the reporting structure.
- **Advanced settings:** require justification, email notifications, reminders (sent halfway through the review period) and extra text for the reviewer email.

**4. Review + Create**

Enter a name, which is required, and an optional description. Both are shown to reviewers. Select **Create**.

## Multi-stage reviews

For a second opinion, check **Multi-stage review** on the **Reviews** tab. A review has two stages by default and up to three. Each stage has its own reviewers and duration, and you choose which reviewees go on to the next stage, such as denied or not-reviewed users. Recurrence must be at least as long as the total duration.

## Choosing reviewers

Microsoft's deployment guide says group owners are usually the best reviewers. Groups synced from on-premises Active Directory have no Entra owner, so pick reviewers individually. Applications do not necessarily have owners, so the application owner cannot be selected. The reviewer type cannot be changed once a review starts. If cycles are too frequent or reviewers too few, Microsoft warns that decision quality may fall.

## Automate and monitor

- **Auto apply and recommendations.** Recommendations are based on last sign-in or last app access, and the system can apply them at the end for users who did not respond.
- **Graph and PowerShell.** Create reviews with `POST /identityGovernance/accessReviews/definitions` (permission `AccessReview.ReadWrite.All`) or `New-MgIdentityGovernanceAccessReviewDefinition`.
- **Audit logs.** Filter by category **Policy** for activities such as Create access review, Access review ended, Approve decision and Apply decision. Export logs to Azure Monitor Log Analytics or Event Hubs for trend dashboards.
- **Group owners as creators.** Under **ID Governance** > **Access Reviews** > **Settings**, set **Group owners can create and manage access reviews for groups they own** to **Yes**. The default is **No**.

## Start safely

Microsoft's pilot advice is practical: start with a small group and noncritical resources, begin with reviews whose results are not applied automatically, document any access removed so it can be restored quickly, and check that the audit log records all events. A monthly recurrence and a 48-hour reviewer deadline appear as an example plan, not a rule.

## Limits and surprises

- Each selected group or app creates a **separate** review.
- Each recurrence is a snapshot. Changes made during a review apply to the next cycle.
- Nested groups are flattened, and users are removed only from direct membership.
- Access reviews cannot change membership of groups synced from on-premises Active Directory. Admins must act on results in AD.
- Guest reviewers who have not accepted their invitation receive no review email.

## Related

- [Access reviews](https://www.m365.fm/entity/access-reviews/)
- [Microsoft Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Privileged Identity Management](https://www.m365.fm/entity/privileged-identity-management/)
- [Guest access](https://www.m365.fm/entity/guest-access/)

## Sources

- [Microsoft Learn: What are access reviews?](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview)
- [Microsoft Learn: Create an access review of groups and applications](https://learn.microsoft.com/en-us/entra/id-governance/create-access-review)
- [Microsoft Learn: Plan an access reviews deployment](https://learn.microsoft.com/en-us/entra/id-governance/deploy-access-reviews)
