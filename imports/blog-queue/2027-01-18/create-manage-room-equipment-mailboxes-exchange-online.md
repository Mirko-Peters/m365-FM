---
title: "Create and Manage Room and Equipment Mailboxes in Exchange Online"
summary: "Room and equipment mailboxes let people book spaces and gear by inviting them to meetings. Learn the steps in the Exchange admin center and PowerShell, the booking defaults, delegate approval, room lists and removal, based on Microsoft's resource mailbox page."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [exchange-online, exchange-online-powershell, shared-mailbox, distribution-list]
keypoints:
  - "Create resource mailboxes in the Exchange admin center under Recipients, Resources, or with New-Mailbox using the Room or Equipment switch."
  - "Booking defaults per Learn: repeating meetings allowed, 180-day booking window, 24 hours maximum duration, 8 to 5 working hours Monday to Friday, auto-accept."
  - "Modify settings with Set-User, Set-Mailbox, Set-CalendarProcessing and Set-MailboxFolderPermission, or in the flyout tabs General, Booking, Delegation and Others."
  - "Room lists are distribution groups with room mailboxes only, can only be created in PowerShell, and help with more than 100 rooms or multiple buildings."
  - "Nested groups do not work in resource mailbox settings, and in hybrid you should create resource mailboxes in the matching location."
faq:
  - q: "What is the difference between a room and an equipment mailbox?"
    a: "Both are resource mailboxes that people book by inviting them to a meeting. A room mailbox stands for a physical meeting space, an equipment mailbox for a resource that is not a room, such as the motor vehicle in Learn's example. You pick Room or Equipment when you create them."
  - q: "How do I create one in PowerShell?"
    a: "Use New-Mailbox with the Room or Equipment switch, for example New-Mailbox -Name ConfRoom1 -Room -DisplayName with a display name. For equipment add -Equipment and optionally -PrimarySmtpAddress."
  - q: "What are the default booking settings?"
    a: "Learn lists: repeating meetings allowed, a booking window of 180 days, a maximum duration of 24 hours, working hours 8 to 5 Monday to Friday, and automatic acceptance of requests."
  - q: "How do I require approval for bookings?"
    a: "Learn's delegate approval example uses Set-CalendarProcessing with AllBookInPolicy set to false, AllRequestInPolicy set to true and ResourceDelegates, plus Set-MailboxFolderPermission to give the delegate Editor rights with the Delegate sharing flag."
  - q: "What is a room list?"
    a: "A distribution group that contains only room mailboxes. Learn says room lists can only be created in PowerShell and are useful with more than 100 rooms or multiple buildings."
---

Room and equipment mailboxes are resource mailboxes that people book by inviting them to a meeting. You can create them in the Exchange admin center under **Recipients** > **Resources**, or in Exchange Online PowerShell with `New-Mailbox` and the `-Room` or `-Equipment` switch. Microsoft Learn's page on resource mailboxes also covers booking defaults, delegate approval, room lists and removal, which this article walks through in the order the page uses.

## Room versus equipment

Learn distinguishes two types. A room mailbox represents a physical location such as a meeting room. An equipment mailbox represents a resource that is not a room, and Learn's own example is a motor vehicle. You choose the type when you create the mailbox, with the Room or Equipment option in the wizard or the matching switch in PowerShell, so decide before you start.

## Create one in the Exchange admin center

1. Open `https://admin.exchange.microsoft.com`.
2. Go to **Recipients** > **Resources**.
3. Choose **Add a room resource** or **Add an equipment resource**.

The wizard has these pages: **Set up** (name and resource mail address), **Set properties**, **Booking delegate settings** and **Review**. Learn gives defaults for bookings: repeating meetings allowed, a booking window of 180 days, a maximum duration of 24 hours, working hours of 8 to 5 Monday to Friday, and automatic acceptance.

## Create one in PowerShell

Learn's examples:

```powershell
New-Mailbox -Name ConfRoom1 -Room -DisplayName "Conference Room 1"

New-Mailbox -Name MotorVehicle2 -Equipment -DisplayName "Motor Vehicle 2" -PrimarySmtpAddress mv2@contoso.com
```

To check the result:

```powershell
Get-Mailbox -Identity ConfRoom1 | Format-List Name,RecipientTypeDetails,PrimarySmtpAddress
```

The `RecipientTypeDetails` property tells you whether the mailbox is a room or equipment mailbox.

## Change settings

In the admin center, select the resource to open the flyout, which has these tabs:

- **General:** names and basic properties.
- **Booking:** how requests are processed.
- **Delegation:** Send as, Send on behalf and Full Access.
- **Others:** a MailTip of up to 175 characters, email addresses and custom attributes 1 to 15.

Learn notes that hiding a resource from the address list still allows booking it by its address.

In PowerShell, the cmdlets are `Set-User`, `Set-Mailbox`, `Set-CalendarProcessing` and `Set-MailboxFolderPermission`. Two of Learn's examples are limiting bookings to working hours with `-ScheduleOnlyDuringWorkHours` and setting a maximum meeting length with `-MaximumDurationInMinutes 540`.

## Require delegate approval

Learn's appendix shows scenarios: default booking, delegate approval and scoped auto-approval. For delegate approval, the example uses `Set-CalendarProcessing` with `-AllBookInPolicy $false`, `-AllRequestInPolicy $true` and `-ResourceDelegates` naming the approvers. It then uses `Set-MailboxFolderPermission` to give the delegate Editor permission with `-SharingPermissionFlags Delegate`. The result is that requests go to the delegate instead of being accepted automatically.

Learn also says nested groups do not work in resource mailbox settings. If you want a group of approvers, use a group that lists the people directly.

## Room lists

A room list is a distribution group that contains only room mailboxes. Learn says room lists can only be created in PowerShell and are useful if you have more than 100 rooms or multiple buildings. The page gives these commands:

```powershell
New-DistributionGroup -Name "Building 32 Conference Rooms" -RoomList
Add-DistributionGroupMember -Identity "Building 32 Conference Rooms" -Member ConfRoom1
Set-DistributionGroup -Identity "Building 32 Conference Rooms" -RoomList
```

The last command turns an existing group into a room list. The exact parameters for the member and identity in the second and third command are my reading of the pattern, so check them against the page before you run them.

## Remove a resource mailbox

In the admin center, select the resource and choose **Delete resource**. In PowerShell, use `Remove-Mailbox -Identity` with the mailbox name.

## Hybrid note

For hybrid deployments, Learn says to create resource mailboxes in the location that matches them, in the cloud or on-premises, as appropriate. The page gives an estimated time of under five minutes per procedure.

## A setup routine

This section is my advice, not a Microsoft statement.

1. **Decide on a naming scheme first.** Names like Building-Floor-Room-Capacity make list views and room finders easier to use.
2. **Create a handful first.** Use the admin center for one or two, to learn the wizard, then use PowerShell for the rest.
3. **Review the defaults with the owners.** A 24-hour maximum duration and a 180-day booking window are Learn's defaults. A small room may need a shorter maximum so one person cannot hold it all day.
4. **Use delegate approval sparingly.** It adds work for the delegate. Reserve it for rooms with special rules, such as executive spaces or training rooms.
5. **Add MailTips for rules.** The MailTip field is limited to 175 characters, so keep it short, for example a reminder about catering.
6. **Test with a real meeting request.** Invite the resource from a normal account and check that it accepts or sends the request to the delegate as intended.
7. **Document who owns each resource.** When a booking problem occurs, the helpdesk should know who can change the settings.

## What the page does not cover

The page I read describes the management tasks. It does not give a license list, a limit on the number of resource mailboxes, or detailed troubleshooting for declined bookings. For those, use other Exchange Online documentation.

## Keeping the resource list healthy

This section is my advice, not a Microsoft statement. Resource mailboxes tend to accumulate. Rooms get renamed, buildings close, and equipment is retired. Review the list on a schedule, for example once a year, and remove resources that no longer exist, using the removal steps from Learn. If you use room lists for buildings, check that each room belongs to the right list after a move. Outdated entries cause bookings for rooms that cannot be used, which is the kind of problem people blame on the calendar system rather than on the data behind it.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Shared mailbox](https://www.m365.fm/entity/shared-mailbox/)
- [Distribution list](https://www.m365.fm/entity/distribution-list/)

## Sources

- [Manage resource mailboxes in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/exchange/recipients-in-exchange-online/manage-resource-mailboxes)
