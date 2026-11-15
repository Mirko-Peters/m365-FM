---
title: "Customer Lockbox: Turn It On and Approve Microsoft Support Access Requests"
summary: "Turn on Customer Lockbox in the Microsoft 365 admin center, approve or deny Microsoft engineer access requests, and find the audit records. Covers role, 12-hour expiry, 4-hour access limit and licensing."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [purview, microsoft-365-admin-center, microsoft-purview-audit]
keypoints:
  - "Turn it on in the Microsoft 365 admin center under Settings > Org Settings > Security & Privacy > Customer Lockbox by checking Require approval for all data access requests."
  - "Approvers need the Customer Lockbox access approver role; Global Administrators are also notified and can approve."
  - "A request expires if you reject it or do not approve it within 12 hours, and no access is granted."
  - "Approved access lasts at most 4 hours, and the engineer can request a shorter period."
  - "Approvals and engineer actions appear in the audit log under Set-AccessToCustomerDataRequest and the user Microsoft Operator."
faq:
  - q: "Which role can approve Customer Lockbox requests?"
    a: "Microsoft Learn says anyone assigned the Customer Lockbox access approver admin role in the Microsoft 365 admin center can approve requests. The FAQ adds that Global Administrators can approve too and are notified, and that customers control these role assignments."
  - q: "How long does a Customer Lockbox request stay open?"
    a: "Learn states that requests have a default duration of 12 hours. If you reject the request or do not approve it within 12 hours, it expires and the Microsoft engineer gets no access."
  - q: "How long can a Microsoft engineer access my data after approval?"
    a: "According to the Learn FAQ, the maximum period for the granted access permissions is currently 4 hours, and the engineer can request a shorter period. Access is revoked automatically after the requested duration."
  - q: "Which services and licenses does Customer Lockbox cover?"
    a: "Learn lists Exchange Online, SharePoint Online, OneDrive for Business, Teams and Windows 365, and says Microsoft 365 Copilot interactions are covered through the Exchange Online support. It is included with Microsoft 365 or Office 365 E5 and can be added to other plans with an Information Protection and Compliance or Advanced Compliance add-on."
  - q: "Can I get an alert when a request is approved?"
    a: "Learn says there is no built-in option to alert administrators. It suggests that administrators can set up alerts with Microsoft Defender for Cloud Apps."
---

Customer Lockbox lets you decide whether a Microsoft support engineer may access your content during a support case. You turn it on in the Microsoft 365 admin center, and a person with the right role approves or denies each request. Without approval, no access is granted. This guide follows the Microsoft Learn page on Customer Lockbox requests.

## What Customer Lockbox does

Learn explains that Microsoft engineers usually fix issues with telemetry and debugging tools. Some cases require the engineer to access your content. With Customer Lockbox, the engineer must request access from you as the final step of the approval workflow, and you can approve or deny it.

Supported services, according to Learn: Exchange Online, SharePoint Online, OneDrive for Business, Teams and Windows 365. All Microsoft 365 Copilot interactions are covered through the support for Exchange Online.

## Licensing

Learn's FAQ says Customer Lockbox is included with Microsoft 365 or Office 365 E5. It can be added to other plans with an Information Protection and Compliance or Advanced Compliance add-on subscription. For government customers it is included with Microsoft 365 or Office 365 G5. For other cases, check the licensing guidance that the page links to.

## Turn Customer Lockbox on

1. Sign in at `https://admin.microsoft.com` with a work or school account that has the **Customer Lockbox access approver** role assigned.
2. Go to **Settings** > **Org Settings** > **Security & Privacy**.
3. Select **Customer Lockbox** in the left column.
4. Check **Require approval for all data access requests** and save.

When this is on, Microsoft must obtain your organization's approval before accessing any of your tenant's content. Learn's FAQ says a Global Administrator can enable and configure Customer Lockbox, and that only a Global Administrator can specify who can approve requests.

## How a request flows

Learn describes the typical workflow:

1. A user has an issue, cannot fix it and opens a support request.
2. A Microsoft support engineer decides they need access to the tenant.
3. The engineer files a request in the Customer Lockbox tool. It includes the tenant name, service request number, expected start time (access starts right after approval if none is given), the estimated duration and the service.
4. After a Microsoft Support manager approves it, Customer Lockbox emails the designated approver in your organization.
5. The approver signs in to the Microsoft 365 admin center and approves. This creates an audit record.
6. The engineer gets the approval, signs in and fixes the issue. Access is revoked automatically after the requested duration.

Learn adds that the email notification does not contain links that ask you to sign in to Office 365. Go to the admin center directly instead.

Global Administrators and anyone with the approver role are notified. These are also the people who can approve.

## Approve or deny a request

1. Sign in at `https://admin.microsoft.com` with an account that has the **Customer Lockbox access approver** role.
2. Go to **Support** > **Customer Lockbox Requests**.
3. Select a request and choose **Approve** or **Deny**.

If you reject the request or do not approve it within 12 hours, it expires and no access is granted. The FAQ says a rejected request means no access to customer content occurs, and that the service issue might persist, in which case Microsoft informs the user.

You can also use the `Set-AccessToCustomerDataRequest` cmdlet to approve, deny or cancel requests. Learn links to the cmdlet's reference page.

Each request carries a Microsoft 365 service request number. If you need more information before deciding, Learn says to contact Microsoft Support and quote that number.

## How long does approved access last

The FAQ says the maximum period is currently 4 hours, and the engineer can request a shorter one. Audit records for engineer actions fall within 4 hours of the approval.

## Find the audit records

Audit records for requests and for engineer actions are written to the Microsoft 365 audit log. Learn describes this search in the Microsoft Purview portal audit log search tool:

1. Make sure auditing is set up and you have permission to search it.
2. Open **Audit** and set a start and end date. Leave **Activities**, **Users** and **File, folder, or site** blank so the search returns all records.
3. Run the search and sort by **Activity**. Look for **Set-AccessToCustomerDataRequest**. These records show an approver approving or denying a request.
4. Sort by **User** and look for **Microsoft Operator**. These are actions by a Microsoft engineer after an approved request.

You can export the results to CSV and filter on **Operations** and **UserIds**. For PowerShell, Learn gives two `Search-UnifiedAuditLog` examples in Exchange Online PowerShell: one with `-Operations Set-AccessToCustomerDataRequest` and one with `-UserIds "Microsoft Operator"`.

The audit record of an approval contains the date, the IP address of the approver's machine, the user (a service account), the activity and the GUID of the request. If the request was denied, the `ApprovalDecision` value is `Deny`.

## Limits Learn states

- It does not protect against data requests from law enforcement or other third parties. Learn says Microsoft attempts to redirect such third parties to the customer.
- There is no built-in administrator alert for approvals.
- Microsoft recommends roles with the fewest permissions and fewer Global Administrators.

## Practical notes

This section is my advice, not a Microsoft statement. Name at least two people to hold the approver role so that a request within the 12-hour window does not expire because one person is away. Keep the approver role assignments reviewed like any privileged role. Search the audit log after an approved request as well. Learn's FAQ says you can cross-reference the approval emails with the request history in the Microsoft 365 admin center.

## Related

- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)

## Sources

- [Customer Lockbox requests (Microsoft Learn)](https://learn.microsoft.com/purview/customer-lockbox-requests)
