---
title: "How to Share Power BI Content with External Guest Users Through Entra B2B"
summary: "External guests can open Power BI content when the tenant setting allows inviting external users, the guest has a Microsoft Entra B2B account and a license path exists. A walkthrough of the settings, invitation options, licensing choices, limitations and sharing steps from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [power-bi, entra-external-id, b2b-collaboration, guest-access]
keypoints:
  - "The Power BI admin portal has a setting to invite external users to your organization, and guests also need the right Entra role or permission to be invited."
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
    a: "Learn says the People in your organization link type does not work for guests. Use Specific people and add the guest. Conditional Access policies can also block guest access."
  - q: "Are there features guests cannot use?"
    a: "Learn lists limitations including no publishing from Power BI Desktop, no Analyze in Excel and no installing a gateway. Guests with social identities get browser access only and no mobile app."
  - q: "Does sharing a report also share the data?"
    a: "Sharing a report shares access to the underlying semantic model. Learn points to row-level security and object-level security to limit what each person sees."
---

To share Power BI content with someone outside your organization, three things must line up: the Power BI tenant setting that allows inviting external users, a Microsoft Entra B2B guest account for the person, and a license path for the content. Microsoft's guidance is spread over two Learn pages, one on distributing content to external guest users with Microsoft Entra B2B and one on sharing reports and dashboards. I read both through a summarizing fetch tool, so treat the details below as a summary of those pages and check the pages themselves for exact wording before you change tenant settings.

## How the pieces fit together

Power BI uses Microsoft Entra B2B so that people from other organizations can sign in with their own identity and see content you share. The guest becomes a guest user in your Entra directory. Access to the Power BI content is then controlled in Power BI through sharing, workspace roles or apps, while Entra and Conditional Access govern sign-in.

## Step 1: allow external users in Power BI

In the Power BI admin portal, the tenant setting to invite external users to your organization must be enabled for the people who will invite guests. The Learn page also says inviting guests requires permission in Microsoft Entra, such as the Guest Inviter role.

Conditional Access can block guests. Learn mentions that policies applied to guest users can stop them from signing in or opening content, so check them before you diagnose Power BI.

## Step 2: invite the guest

Learn describes two invitation styles:

- **Planned invitations.** Invite the guest ahead of time in Microsoft Entra ID, for example under Users, All users, then New user and Invite external user. Bulk invitation and PowerShell are alternatives. The guest accepts the invitation by selecting Get Started in the email they receive.
- **Ad hoc invitations.** Power BI sends an invitation when you share content, when you add someone to a subscription, or when you add them to an app access list. Learn says ad hoc invitations are not supported for workspace access lists.

Learn also mentions a From external orgs tab in Power BI; I did not read what it lists in detail.

## Step 3: license the guest

Learn lays out a license matrix and three options for licensing guest users:

1. **Premium capacity.** Host the content in a Premium capacity. Check the matrix on the page for which guest actions this covers.
2. **Assign a Pro or Premium Per User license** to the guest in your organization.
3. **The guest brings their own license** from their home organization.

Inviting guests requires a Pro or Premium Per User license for the person who invites, and the page says a Pro trial cannot invite external users. I recommend reading the matrix on the page for your exact case rather than relying on this summary.

## Step 4: share the content

For a report or dashboard, Learn's sharing page describes the following flow:

1. Select Share on the report or dashboard.
2. Choose Send link and set the link type to Specific people.
3. Enter the guest's email address, add a message if you like and send.

Points from the page:

- The People in your organization link does not work for guests.
- To give a group of guests access, use a security group. A distribution group does not work for this purpose.
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

## What I did not read

I did not read the Entra B2B documentation in full, the Power BI admin portal settings page or the license matrix beyond the summary. The first Power BI B2B URL I tried did not open, so I used the canonical Fabric location of the same article.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Guest access](https://www.m365.fm/entity/guest-access/)

## Sources

- [Distribute Power BI content to external guest users with Microsoft Entra B2B (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/powerbi/service-admin-entra-b2b)
- [Share and collaborate on Power BI reports and dashboards (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/service-share-dashboards)
