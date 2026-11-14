---
title: "How to Set Up Shared Calling in Teams Phone"
summary: "Set up Shared Calling in Teams Phone: prerequisites, resource account and auto attendant, voice routing policy, Shared Calling policy, assignment, extension dialing and emergency calling rules."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [teams-phone, teams-admin-center]
keypoints:
  - "Shared Calling lets users without their own phone number place and receive calls through a resource account number."
  - "Users need a Teams Phone license and Enterprise Voice enabled. Do not assign a phone number to a Shared Calling user."
  - "Create a Shared Calling policy under Voice > Shared calling policies and assign it to users."
  - "Shared Calling users must have a voice routing policy with empty PSTN usages, or no valid PSTN usages."
  - "Set up emergency calling for every Shared Calling user. Callback numbers in a policy must be unique and unassigned."
faq:
  - q: "What is Shared Calling in Teams Phone?"
    a: "According to Microsoft Learn, Shared Calling lets users without an assigned phone number place and receive calls through a resource account phone number. A Shared Calling policy configures the users."
  - q: "What do users need for Shared Calling?"
    a: "Microsoft Learn says each user needs a Teams Phone license and must be voice enabled. You must not assign a phone number to a Shared Calling user. The users also need no voice routing policy with valid PSTN usages."
  - q: "How do users call each other inside the organization?"
    a: "Learn says internal calls between users are made by dialing by name. Optionally, users can also be dialed by extension if you configure extension dialing."
  - q: "Which number types can the resource account use?"
    a: "The Learn page names a Calling Plan service number, an Operator Connect number or a Direct Routing number."
  - q: "What happens to emergency calls?"
    a: "Learn says you must create and assign an emergency call routing policy for every Shared Calling user. The location is the user's actual location from the Teams client when available, otherwise the location assigned to the resource account number."
---

Shared Calling gives a group of users calling without individual phone numbers. They place and receive calls through the phone number of a resource account. To set it up, license and voice-enable the users, prepare a resource account with a number and an auto attendant, create a Shared Calling policy, and assign it. Emergency calling needs separate setup. This guide follows Microsoft Learn.

## What Shared Calling is

Users configured for Shared Calling have no phone number of their own. Calls go through a resource account number. Internal calls are made by dialing by name, and users can optionally be dialed by extension.

## Prerequisites

- **Licenses:** each user needs a **Teams Phone** license.
- **Voice enabled:** each user must have Enterprise Voice on. Do not assign a phone number to a Shared Calling user.
- **Resource account:** create or reuse one and assign a Calling Plan service number, an Operator Connect number or a Direct Routing number.
- **Auto attendant:** for inbound calls, associate the resource account with a configured auto attendant scoped to the users it must reach. The page does not mention call queues.
- **Emergency location:** the number needs a location. Find location IDs with `Get-CsOnlineLisLocation`.
- **Funding for Calling Plan service numbers:** a Pay-As-You-Go Calling Plan with minutes, or Communications Credits with a funded balance.
- **Voice routing policy:** Shared Calling users must not have a voice routing policy with valid PSTN usages.

## Step 1: License and voice-enable users

In the Microsoft 365 admin center, select **Billing** > **Licenses**, choose the Teams Phone license and **Assign licenses**. In the Teams admin center, select **Users** > **Manage users**, open the user, go to the **Account** tab, and under **Assigned phone number** set **Enterprise Voice** to **On**, then **Save**. In PowerShell:

```powershell
Set-CsPhoneNumberAssignment -Identity <user> -EnterpriseVoiceEnabled $true
```

## Step 2: Prepare the resource account

1. Assign a Calling Plan, Operator Connect or Direct Routing number to the resource account.
2. Associate the resource account with an auto attendant for inbound calling.
3. Assign a location to the number, using a location ID from `Get-CsOnlineLisLocation`.
4. Meet the number requirements. Calling Plan needs the funding above. Operator Connect needs no action. Direct Routing needs an online voice routing policy with valid PSTN usages on the resource account.

## Step 3: Create a voice routing policy with empty PSTN usages

Create a voice routing policy with empty PSTN usages and assign it to the Shared Calling users.

## Step 4: Create the Shared Calling policy

In the Teams admin center:

1. Select **Voice** > **Shared calling policies** > **Add**.
2. Enter a name and description.
3. Under **Resource account**, choose the account.
4. Optionally select **Add emergency callback numbers**, choose the **Phone number type** and **Assigned phone number**, and select **Add**.
5. Select **Save**.

PowerShell, from the Learn example:

```powershell
$ra = Get-CsOnlineUser -Identity main-aa@contoso.com
New-CsTeamsSharedCallingRoutingPolicy -Identity Seattle -ResourceAccount $ra.Identity -EmergencyNumbers @{add='+14255556789','+14255554321'}
```

To change callback numbers later, use `Set-CsTeamsSharedCallingRoutingPolicy` with `@{add=...}` or `@{remove=...}`. A number in use cannot be deleted or reassigned until you remove it from the policy.

## Step 5: Assign the policy

```powershell
Grant-CsTeamsSharedCallingRoutingPolicy -PolicyName Seattle -Identity user@contoso.com
```

You can also assign it in the Teams admin center with the policy assignment for users and groups.

## Step 6 (optional): Extension dialing

In the Teams admin center, open the user from **Users** > **Manage Users**, edit the general information on the **Account** tab, set **Phone number type** to **Direct Routing**, enter an **Assigned phone number** (Learn mentions the resource account's digits as an example) and a **Phone number extension** with digits only that is unique. Select **Apply**. In PowerShell:

```powershell
Set-CsPhoneNumberAssignment -Identity <user> -PhoneNumber "+12223334444;ext=6789" -PhoneNumberType DirectRouting
```

Extension dialing works only if the user's voice routing policy has no PSTN usages. Otherwise the user behaves as if a phone number were assigned.

## Emergency calling

- Create and assign an **emergency call routing policy** for every Shared Calling user, regardless of number type.
- For a Calling Plan or Operator Connect resource account, the policy must not have online PSTN usages. For Direct Routing, it must have them.
- The callback number comes from the policy's emergency numbers. If the list is empty, the resource account number is used, which is not supported for Calling Plan toll-free numbers.
- Location order: the user's actual location from the Teams client, then the location assigned to the resource account's number.
- Outside North America, upload emergency addresses for the resource account numbers to the carrier's emergency database. Contact each carrier.

## Limits from Learn

- All numbers in a policy must share the same number type and country.
- Each policy needs unique emergency callback numbers, and a number cannot be in more than one policy. Callback numbers cannot be assigned to users or resource accounts.
- For an emergency call, the next free callback number is reserved for 60 minutes.
- Calling Plan callback numbers must be subscriber numbers, not service numbers.
- Calling Plan service numbers are not supported in Romania, Czech Republic, Hungary, Singapore, New Zealand, Australia and Japan.
- For Operator Connect, confirm Shared Calling support with your operator.
- If Calling Plan or Operator Connect and Direct Routing Shared Calling coexist in one tenant, site-assigned emergency call routing policies cannot be used.
- If the resource account's number is removed, reassigned or ported, the policy remains but outbound calls fail for users still using it.

## Typical mistakes

- Giving a user a phone number as well as Shared Calling.
- Leaving PSTN usages in the voice routing policy.
- Skipping the emergency call routing policy.
- Reusing a callback number across policies.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Set up Shared Calling in Teams Phone (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/shared-calling-setup)
