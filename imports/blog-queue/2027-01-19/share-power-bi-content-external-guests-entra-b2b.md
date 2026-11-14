---
title: "How to Share Power BI Content with External Guest Users Through Entra B2B"
summary: "External guests can open Power BI content when the tenant setting allows inviting external users, the guest has a Microsoft Entra B2B account and a license path exists. A walkthrough of the settings, invitation options, licensing choices, limitations and sharing steps from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [power-bi, entra-external-id, b2b-collaboration, guest-access]
keypoints:
  - "The Power BI admin portal has a setting to invite external users, and the person who invites must also hold the Guest Inviter role in Microsoft Entra ID."
  - "Guests can be invited ahead of time in Microsoft Entra ID, or ad hoc when you share, but not through workspace access lists."
  - "Inviting guests requires a Power BI Pro or Premium Per User license for the inviter, and a Pro trial cannot invite."
  - "A guest needs a license path: Premium capacity, an assigned Pro or PPU license, or a license the guest brings from their own organization."
  - "Share to specific people with a security group rather than a distribution group, and remember that sharing a report also shares access to its semantic model."
faq:
  - q: "Do guests need a Power BI license?"
    a: "Learn describes three ways to license guests: content in a Premium capacity, assigning a Pro or Premium Per User license to the guest, or the guest bringing their own license from their organization. The exact requirement depends on the content and capacity."
  - q: "Can I invite guests from Power BI itself?"
    a: "Yes, ad hoc invitations are possible when you share content, in subscriptions and in app access lists. Learn says ad hoc invitations are not supported through workspace access lists, so invite guests to the workspace after they exist in the directory."
  - q: "Why can a guest not open the link I sent?"
    a: "Learn says the People in your organization link type does not work for external or guest users. Use Specific people and add the guest. Learn also says a Microsoft Entra Conditional Access policy can be used to prevent guests from accessing Power BI, so check for one."
  - q: "Are there features guests cannot use?"
    a: "Learn lists limitations including no publishing from Power BI Desktop, no Analyze in Excel and no installing a gateway. Guests with social identities get browser access only and no mobile app."
  - q: "Does sharing a report also share the data?"
    a: "Sharing a report shares access to the underlying semantic model. Learn points to row-level security and object-level security to limit what each person sees."
---

To share Power BI content with someone outside your organization, three things must line up: the Power BI tenant setting that allows inviting external users, a Microsoft Entra B2B guest account for the person, and a license path for the content. Microsoft's guidance is spread over two Learn pages, one on distributing content to external guest users with Microsoft Entra B2B and one on sharing reports and dashboards. This article summarises both, so check the pages for exact wording before you change tenant settings.

## How the pieces fit together

Power BI uses Microsoft Entra B2B so that people from other organizations can sign in with their own identity and see content you share. The guest becomes a guest user in your Entra directory. Access to the Power BI content is then controlled in Power BI through sharing, workspace roles or apps, while Entra and Conditional Access govern sign-in.

## Step 1: allow external users in Power BI

In the Power BI admin portal, enable the Invite external users to your organization setting before you invite guests. Learn says that even when the setting is enabled, the user who invites guests must be granted the Guest Inviter role in Microsoft Entra ID. For planned invites it also says you must be assigned the user admin role.

Learn says that if you disable the setting, existing guests keep access to items they already had, and that to prevent guests from accessing Power BI you use a Microsoft Entra Conditional Access policy. My reading: check such policies before you diagnose Power BI.

## Step 2: invite the guest

Learn describes two invitation styles:

- **Planned invitations.** Invite the guest ahead of time in Microsoft Entra ID, for example in the Azure portal under Microsoft Entra ID, Users, All users, then New guest user. Bulk invitation and PowerShell are alternatives. The guest accepts the invitation by selecting Get Started in the email they receive.
- **Ad hoc invitations.** Power BI sends an invitation when you share content, when you add someone to a subscription, or when you add them to an app access list. Learn says ad hoc invitations are not supported for workspace access lists.

Learn also describes a From external orgs tab on the Power BI home page. Users who are guests in another tenant see it, and it lists the items shared with them from external tenants.

## Step 3: license the guest

Learn lays out a license matrix and three options for licensing guest users:

1. **Premium capacity.** Host the content in a Premium capacity. Learn says the guest then needs only a Fabric Free license. The sharing page adds that only P SKUs and F SKUs of F64 or larger let users with a free license use shared content; smaller F SKUs require a Pro license.
2. **Assign a Pro or Premium Per User license** to the guest in your organization.
3. **The guest brings their own license** from their home organization.

Inviting guests requires a Pro or Premium Per User license for the person who invites, and the page says a Pro trial cannot invite external users. The matrix on the page covers the combinations of consumer license, provider type and workspace type: for example, a consumer with a Free license can reach only Premium capacity workspaces shared by licensed providers, while a consumer with a PPU license has the broadest access. Read the matrix for your exact case.

## Step 4: share the content

For a report or dashboard, Learn's sharing page describes the following flow:

1. Select Share on the report or dashboard.
2. Choose Send link and set the link type to Specific people.
3. Enter the guest's email address, add a message if you like and send.

Points from the page:

- The People in your organization link does not work for guests.
- To share with a group that includes people with external email addresses, use a security group, not a distribution group. Learn says people with external emails in a distribution group cannot see the content unless they are Microsoft Entra B2B guest users.
- Sharing a report shares access to its semantic model. To limit what guests can see, use row-level security (RLS) or object-level security (OLS).

For broader distribution, an app or a workspace is a better container than many individual shares. For a workspace, invite the guest to Entra first, as ad hoc invites do not work there.

## Limitations for guests

Learn lists several limitations. Among them:

- Guests cannot publish from Power BI Desktop.
- Guests cannot use Analyze in Excel.
- Guests cannot install a gateway.
- Guests who sign in with social identities get browser access only and cannot use the mobile app.

Verify the current list on the page, since feature support changes.

## A rollout checklist

This section is my advice, not a Microsoft statement.

1. **Start with one pilot guest.** Do the invitation, license and sharing steps for a single test person from a partner and write down each step.
2. **Decide the container.** Choose between direct shares, an app or a workspace before you invite many people.
3. **Use groups.** A security group with guest members is easier to review than a long list of individual shares.
4. **Plan data access up front.** Because sharing a report shares its semantic model, decide on RLS or OLS before the first external share, not after.
5. **Check Conditional Access with a test guest.** A policy that requires a compliant device, for example, can lock out partner users who cannot satisfy it.
6. **Review guests regularly.** Remove guests who no longer need access, in Entra and in the Power BI shares.
7. **Tell guests what to expect.** A short note about the invitation email, the Get Started step and the browser-only limits avoids support requests.

## Troubleshooting order

This section is my advice, not a Microsoft statement.

- If the invitation email never arrives, check the guest object in Entra to see whether it exists and whether the invitation was redeemed.
- If the guest signs in but sees no content, check the link type, the group membership and the license path.
- If the guest is prompted unexpectedly or blocked at sign-in, check the Conditional Access policies that apply to guests.
- If the guest sees too much data, review the semantic model permissions and RLS.

## What the pages do not cover

The two pages do not cover the Entra B2B settings in detail, the Power BI admin portal settings page or in-place semantic model sharing, which Learn describes as another way to share with external guests. Use the linked Learn pages for those topics.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Guest access](https://www.m365.fm/entity/guest-access/)

## Sources

- [Distribute Power BI Content to External Guest Users with Microsoft Entra B2B - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/powerbi/service-admin-entra-b2b)
- [Share and Collaborate on Power BI Reports and Dashboards - Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/service-share-dashboards)
