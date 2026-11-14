---
title: "How to Create and Manage Resource Accounts for Teams Phone Voice Apps"
summary: "Every Teams auto attendant and call queue needs a resource account. Learn what Learn lists as prerequisites: Teams Phone Resource Account licenses, optional phone numbers and two admin roles. Then create, edit, license and assign a number in the Teams admin center or PowerShell."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [teams-phone, teams-auto-attendant, teams-call-queues, teams]
keypoints:
  - "A resource account is required for each auto attendant or call queue, and it must stay disabled for sign in."
  - "Each resource account needs a Microsoft Teams Phone Resource Account license, and subscriptions with Teams Phone get a zero-cost allocation."
  - "Phone numbers are optional and are needed only when the voice app must be reachable directly by number."
  - "To create and manage resource accounts, an admin needs a Teams administrator role plus the User Administrator role."
  - "Create in the Teams admin center under Voice, Resource accounts, Add, or use New-CsOnlineApplicationInstance in PowerShell."
faq:
  - q: "Can users sign in to a resource account?"
    a: "No. Learn says resource accounts used for auto attendants and call queues are disabled for sign in and must remain so. Chat and presence are not available and will not work for these accounts."
  - q: "Do I need a license for every resource account?"
    a: "Yes. Learn says each resource account requires a Microsoft Teams Phone Resource Account license. Learn also says nested auto attendants and call queues that transfer calls externally do not require resource accounts or licensing, and that you license the resource account on the first auto attendant or call queue receiving the call."
  - q: "Is a phone number required?"
    a: "No. Learn says phone numbers are optional. For an auto attendant or call queue that should be reachable directly by a phone number, the resource account must have an associated number."
  - q: "Which roles do I need?"
    a: "To create and manage a resource account you need a Teams administrator role, either Teams Telephony Administrator, Teams Communications Administrator or Teams Administrator, and the User Administrator role. A Global Administrator also has the permissions, but Learn recommends roles with the fewest permissions."
  - q: "What do I need to edit a resource account?"
    a: "Learn notes that when editing, the admin must currently be assigned either the Global Admin role, or the Skype for Business Administrator and User Administrator roles."
---

A resource account is the object Teams uses to represent an auto attendant or call queue. Microsoft Learn says a resource account is required for each auto attendant or call queue, and that it may also be assigned a phone number so callers from outside Teams can reach the voice app. Before you create one, you need a Microsoft Teams Phone Resource Account license and the right admin roles. This guide follows Learn's page on managing resource accounts for voice applications.

## What a resource account is not

Learn says resource accounts used for auto attendants and call queues are disabled for sign in and must remain so. Chat and presence are not available and will not work for these accounts. Presence still appears, but it will not change. So treat the account as a technical object, not a user mailbox.

## Before you start

Learn lists three prerequisites: obtain Microsoft Teams Phone Resource Account licenses, obtain phone numbers, and assign permissions for managing a resource account.

### Licenses

Each resource account requires a **Microsoft Teams Phone Resource Account** license. Learn says subscriptions with Teams Phone have access to a zero-cost allocation of these licenses, and extra ones can be purchased. If you bought Teams Phone Standard, Teams Phone with Calling Plan or Teams Shared Devices licenses, you still need to complete the purchasing process for your allotment, but it is zero cost at checkout.

To check whether you already have them, sign in to the Microsoft 365 admin center with a Global admin account and go to **Billing** > **Your products**. They appear as **Microsoft Teams Phone Resource Account**. To acquire them, Learn gives these steps: in the Microsoft 365 admin center go to **Billing** > **Purchase services** > **Add-ons**, find the license, select **Details**, choose the number and billing frequency, select **Buy**, fill in the purchase details and select **Place order**. Learn says you need one license per auto attendant and call queue, and recommends at least five so you can add more later.

### Phone numbers

Numbers are optional. Resource accounts can use toll or toll-free numbers, which you can request or port from another carrier. Learn lists these number types: Calling Plans service numbers, Direct Routing numbers and Operator Connect numbers. It adds that resource accounts with Direct Routing numbers with or without extensions are supported, but the Teams admin center supports only numbers without extensions. For a number with an extension, use the Teams PowerShell cmdlet `Set-CsPhoneNumberAssignment`.

### Roles

Learn says admins need two roles: a Teams administrator role and the **User Administrator** role. Any of Teams Telephony Administrator, Teams Communications Administrator or Teams Administrator works for the Teams part. If a user has a Teams administrator role without User Administrator, assign User Administrator so the person can create user accounts. A Global Administrator also has the permissions, but Learn recommends roles with the fewest permissions. Learn adds a note that Teams administrators will need user management permissions in Microsoft 365 to create and manage resource accounts, a change it says started to roll out in the fourth quarter of 2024 and continued through the first quarter of 2025.

## Create a resource account

In the Teams admin center:

1. Sign in to the Teams admin center.
2. Expand **Voice** and select **Resource accounts**.
3. Select **Add**.
4. In the **Add resource account** pane, fill in **Display name**, **Username** and **Resource account type**. The type is either **Auto attendant** or **Call queue**.
5. Select **Save**.

With PowerShell, Learn names the cmdlet `New-CsOnlineApplicationInstance`.

## Edit a resource account

Learn notes that when editing, the admin must currently have either the Global Admin role, or the Skype for Business Administrator and User Administrator roles. In the Teams admin center, expand **Voice**, select **Resource accounts**, select the account and select **Edit**. You can change **Display name**, **Resource account type** and **Voice routing policy**. Choosing a voice routing policy assigns that policy to the account. Select **Save**. The PowerShell cmdlet is `Set-CsOnlineApplicationInstance`.

## Assign a license

1. Sign in to the Microsoft 365 admin center.
2. Expand **Users** and select **Active users**.
3. Select the resource account.
4. On the **Licenses and Apps** tab, under **Licenses**, select **Microsoft Teams Phone Resource Account**.
5. Select **Save changes**.

If the account needs a phone number, Learn says to check that the **Select location** list on that tab matches the intended country code.

## Assign a phone number

1. In the Teams admin center, expand **Voice** and select **Resource accounts**.
2. Select the account and then **Assign/unassign**.
3. In **Phone number type**, choose the type of number.
4. In **Assigned phone number**, search for the number, include the country code, for example +1 250 555 0012, and select **Add**.
5. Select **Save**.

## What I did not read

The page output I worked from ends at the phone number steps. Learn's page may contain more, for example about deleting accounts or hiding them from Teams users, since its description mentions deletion and hiding. I did not verify those parts, so check the page itself for them.

## Practical advice

This section is my advice, not a Microsoft statement.

1. **Do the license step before the number step.** The license page notes the location must match the country code, so licensing first avoids a mismatch.
2. **Name accounts by purpose.** A display name that includes the voice app name makes the Resource accounts list easier to read.
3. **Plan licenses for the future.** Learn recommends at least five licenses, which is a reasonable way to avoid repeat purchase steps.
4. **Keep the admin roles narrow.** Learn recommends the fewest permissions, so use the Teams role that fits plus User Administrator, not Global Administrator.
5. **Document which account serves which voice app.** The account list does not tell you which auto attendant a number belongs to unless you keep a record.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams auto attendant](https://www.m365.fm/entity/teams-auto-attendant/)
- [Teams call queues](https://www.m365.fm/entity/teams-call-queues/)

## Sources

- [Manage - Resource accounts for voice applications - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/aa-cq-manage-resource-accounts)
