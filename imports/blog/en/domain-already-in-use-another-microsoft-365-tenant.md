---
title: "Domain Already in Use by Another Microsoft 365 Tenant: Remove, Take Over or Ask Support"
summary: "Another Microsoft 365 organization holds your custom domain and you cannot sign in there? Pick the right path: remove the domain, take over an unmanaged directory, or open a support case."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [custom-domain, microsoft-365-admin-center, entra-id, exchange-online]
keypoints:
  - "A custom domain can be verified in only one Microsoft Entra directory at a time, so it must leave the old one before your new tenant can add it."
  - "If you can sign in as Global Administrator of the old tenant, remove the domain there after moving every user, group and alias off it."
  - "If the old directory is unmanaged, Entra offers an internal or an external admin takeover. External takeover does not work for SharePoint, OneDrive or Skype for Business plans."
  - "If neither works, ask Microsoft Support from the admin center of a tenant you control and be ready to prove domain ownership with a DNS TXT record."
faq:
  - q: "Why does Microsoft 365 say my domain is already added to a different organization?"
    a: "The domain is verified in another Microsoft Entra directory. A domain can be verified in only one directory at a time. That directory can be an old tenant of yours or an unmanaged directory created by a self-service sign-up with an address on your domain."
  - q: "What is the difference between internal and external admin takeover?"
    a: "Microsoft Learn describes internal takeover as becoming Global Administrator of the unmanaged directory itself. External takeover moves the domain, with its users and licenses, into a directory you already manage. External takeover does not support plans that include SharePoint, OneDrive or Skype for Business."
  - q: "Can I remove a domain while users or groups still use it?"
    a: "No. Microsoft Learn lists the checks: the domain must not be the default domain, and no users, shared or resource mailboxes, contacts, groups, distribution lists, teams or admin sign-ins may use it. Removal can take minutes or up to a day when many objects reference the domain."
  - q: "What do I do if I have no admin access to the old tenant?"
    a: "Use the takeover paths if the directory is unmanaged. Otherwise open a support request from the Microsoft 365 admin center of another tenant, and prove ownership of the domain. Moderators in two 2026 threads also described opening the request from a short trial tenant if you have no other one."
---

A small company buys a domain and a Microsoft 365 plan. When the admin adds the domain, the portal says it is already added to a different Microsoft 365 organization. The old tenant may belong to a former IT provider, to a hosting package, or to nobody the company remembers. There is no admin to ask.

At least five Microsoft Q&A threads from April to November 2026 describe this, and none shows a confirmed final fix. The Microsoft Learn pages, however, describe the supported paths clearly. This article sorts them into a decision flow. It is a troubleshooting guide, not an official Microsoft procedure. Only use these steps for domains you own.

## What the symptoms look like

- The portal rejects the domain with a message that it is already added to a different organization.
- You cannot find the old tenant, or you find it but have no Global Administrator.
- Or the opposite: you are the admin, but removing the domain fails because one object still references it.

## Step 1: Understand the rule

Microsoft Entra cannot hold the same verified domain in two directories. Learn says a domain can be verified in only one directory, so a domain verified in another directory cannot also be verified in the new one, and you must delete it from the old directory. A moderator in a 2026 thread put it simply: the domain must leave the old tenant before the new one can take it.

Your task is therefore not to "force" the new tenant. It is to free the domain from the old one.

## Step 2: Decide which situation you are in

Ask three questions:

1. Can anyone still sign in to the old tenant as Global Administrator? If yes, go to **Path A**.
2. Was the old directory created by someone signing up with an address on your domain, with no admin ever assigned? That is an unmanaged directory. Go to **Path B**.
3. Is it a normal managed tenant and nobody can get in? Go to **Path C**.

You may not know the answer to question 2. Learn describes unmanaged directories as the result of a self-service user signing up for a cloud service with an address on the domain. In one thread, the old tenant had been created automatically, had no licenses or mailboxes, and held only guest accounts. The moderator pointed to admin takeover. That was a recommendation, and the asker never confirmed the result.

## Path A: Remove the domain in the old tenant

Learn's "Remove a domain" page lists the checks. The domain must not be the default domain, and no users, shared or resource mailboxes, contacts, groups, distribution lists, teams or admin sign-ins can use it. Then:

1. **Move users.** In the Microsoft 365 admin center, open **Users**, **Active users**, select the users and choose **Change domains**. For your own account, use **Manage username** on the **Account** tab. Keep another Global Administrator on a different domain so you do not lock yourself out. Learn names `Update-MgUser` for scripted changes.
2. **Move groups and lists.** Open **Teams & groups**, **Active teams & groups**, select the group, and under email addresses edit the primary address to another domain.
3. **Remove the domain.** Open **Settings**, **Domains**, select the domain and choose **Remove domain**.

Learn says removal takes about five minutes if few objects reference the domain, and several hours up to a day if many do. With hundreds of users, use PowerShell, because the portal can miss some. One leftover user blocks removal.

If removal says an object is still using the domain, but you cannot find it, one thread offers a hint. An administrator saw a stale proxy address on a cloud user that blocked deletion. Graph rejected edits to the read-only `proxyAddresses` property. The volunteer answer there was to open a support case. This was not confirmed, so treat it as a case for Path C.

## Path B: Take over an unmanaged directory

Learn describes two takeover methods. Both need a DNS TXT record that proves you own the domain.

**Internal takeover** makes you Global Administrator of the unmanaged directory. Learn lists it as the method that supports Microsoft 365 products with SharePoint and OneDrive. External takeover excludes them. The outline is:

1. Sign up for Power BI with a user on your domain and enter the verification code.
2. Confirm the request in the email that Power BI sends.
3. Sign in to the Microsoft 365 admin center at `portal.office.com/admintakeover` and choose to become the admin of the verified domain.
4. Add the TXT record that the portal shows at your registrar and wait for verification.

After that, you are admin of the old directory and can follow Path A to remove the domain there. Learn also describes moving the domain to a managed directory, which needs a `.onmicrosoft.com` Global Administrator in the old directory.

**External takeover** moves the domain with its users, subscriptions and license assignments into a directory you already manage. Learn lists the supported services as Azure Rights Management and Exchange Online. It says that plans with SharePoint, OneDrive or Skype for Business are not supported, and that cross-cloud takeover is not supported. For scripting, Learn shows Microsoft Graph PowerShell. `Confirm-MgDomain` does not expose the force option, so Learn uses a call to the domain's verify endpoint with `forceTakeover` set to true. Read the page before you run it. It also says the unmanaged directory is deleted ten days after a successful forced takeover.

Both methods change the old directory. Do them only for domains you own, and read the Learn page in full first.

## Path C: Ask Microsoft Support

If the tenant is managed and nobody can sign in, the thread answers point to support:

1. In the Microsoft 365 admin center of a tenant you control, open **Help & Support**, search for contact options and create a request. Describe the domain, the exact error and that you have no admin access to the old tenant.
2. If you have no tenant at all, moderators in two 2026 threads suggested signing up for a trial of a business plan, opening the request from that tenant, and cancelling the trial afterward to avoid charges.
3. Expect to prove ownership with a DNS TXT record. One moderator also listed documents that support may ask for: billing details, the tenant ID of the old organization and business registration. This list is from the thread and not from Learn.
4. If a reseller manages the subscription, the reseller may need to open the case.

None of the threads reported a finished case, so I cannot give a timeline.

## Step 3: Finish in the new tenant

After the domain is free:

1. Add it in the Microsoft 365 admin center of the new tenant under **Settings**, **Domains**.
2. Add the TXT record that the wizard shows and verify.
3. Only then change MX and other mail records. Learn's removal guidance reminds you to understand how mail flow changes if MX points to Microsoft 365. Mail delivery follows your MX records, so plan this step with care.

Check licenses and mailboxes before the change, so that no mail is lost.

## Limits and open points

- No thread had an accepted solution. The paths come from the Learn pages and the moderators' advice.
- This article does not cite the Learn domains FAQ. Check it for the current wording of the error message.
- The takeover article was updated in June 2026 and the removal article in April 2026. Names of portal elements may move.
- Removing a domain changes email addresses. Plan the cutover with the people who send and receive mail.

## Related

- [Custom domain](https://www.m365.fm/entity/custom-domain/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Microsoft Learn: Take over an unmanaged directory as administrator in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/users/domains-admin-takeover)
- [Microsoft Learn: Remove a domain from Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/admin/get-help-with-domains/remove-a-domain)
- [Microsoft Q&A: Domain already in use in Microsoft 365 (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5876864/domain-already-in-use-in-microsoft-365-unable-to-r)
- [Microsoft Q&A: Unable to remove a domain from a dormant tenant (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5886910/unable-to-remove-domain-moderator-note-personal-in)
- [Microsoft Q&A: Remove Domain from MS 365 Business Account (May 2026)](https://learn.microsoft.com/en-ie/answers/questions/5904307/remove-domain-from-ms-365-business-account)
- [Microsoft Q&A: Stale proxy address blocking custom domain deletion (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5903207/i-need-backend-cleanup-for-a-stale-proxy-address-b)
- [Microsoft Q&A: Remove tenant from a domain which you don't have admin rights to (November 2026)](https://learn.microsoft.com/en-us/answers/questions/6062340/remove-tenant-from-a-domain-which-you-dont-have-ad)
