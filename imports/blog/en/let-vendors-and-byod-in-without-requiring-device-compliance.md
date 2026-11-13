---
title: "Vendors and Personal Laptops: Limit Access Instead of Requiring Device Compliance"
summary: "A compliance-only Conditional Access policy locked out vendors and BYOD users and was rolled back. Use web-only access, app protection and device filters to keep them in, with less risk. Steps checked on Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [conditional-access, device-compliance, bring-your-own-device, block-download-policy, intune]
keypoints:
  - "'Require device to be marked as compliant' needs an Entra-registered, Intune-enrolled device. Vendors on their own laptops usually have neither."
  - "For unmanaged devices, SharePoint can allow limited, web-only access with no download, print or sync. Changes can take up to 24 hours."
  - "Target the Office 365 cloud app in Conditional Access, not SharePoint alone, or the Teams Files tab can break."
  - "A device filter with a positive rule such as deviceOwnership equals Personal does not match devices that are not registered in Entra. Use a negative rule to target them."
  - "Approved client app is retiring. Use Require app protection policy for new mobile policies."
faq:
  - q: "Can I allow vendors on unmanaged laptops to use SharePoint without letting them download files?"
    a: "Yes. In the SharePoint admin center, under Access control, Unmanaged devices, choose Allow limited, web-only access. Users get browser access without download, print or sync, and managed devices keep full access. Microsoft Learn says the change can take up to 24 hours."
  - q: "Does a policy that requires a compliant device block Intune enrollment?"
    a: "No. Microsoft Learn says enrollment is not blocked when you require a compliant device. A community thread from August 2026 disputed how far this goes for Company Portal downloads, with no confirmed answer, so check the sign-in log for the blocked resource."
  - q: "Is 'Require approved client app' still a good choice for BYOD?"
    a: "Not for new policies. Microsoft Learn says the grant control is retiring and that new policies should use Require app protection policy. Policies that rely on approved client app alone should be moved. Check the Learn migration article for the current status."
  - q: "How do I target personal devices with a device filter?"
    a: "The filter property deviceOwnership supports the value Personal. Learn warns that devices not registered in Entra have all properties treated as empty, so a positive rule does not match them, and a negative rule does. Test with report-only mode before you enforce."
---

A company wants Office 365 and SharePoint open only to company devices. The first idea is a Conditional Access policy that requires a compliant device. In a Microsoft Q&A thread from February 2026, the administrator turned that on and received so much pushback from vendors, contractors and employees on personal devices that the policy was rolled back. The question that followed: how do we reduce the risk without blocking these people?

Two Microsoft moderators and a volunteer answered with similar ideas. No answer was marked as accepted. This article puts those ideas into one design and checks each part against Microsoft Learn. It is not an official Microsoft procedure. Licensing is not covered, so check the Entra and Intune requirements for each feature yourself.

## Why compliance-only fails for outsiders

According to Microsoft Learn, **Require device to be marked as compliant** needs a device that is registered in Microsoft Entra ID and enrolled in Intune (or a supported third-party MDM on Windows). A vendor's own laptop has neither, and you do not want to enroll it. So the policy blocks every outsider by design.

A second thread from August 2026 asked a related question: can a compliance policy stop users from downloading apps in Company Portal when the device is non-compliant? An AI-generated answer said enrollment and the web Company Portal are exceptions, and a high-reputation community member disagreed. Nobody confirmed anything. What Learn does say is clear: requiring a compliant device does not block Intune enrollment. If a user is blocked at some step, open the sign-in log and find the exact resource and policy, instead of guessing.

## Step 1: Split the audiences

List the groups before you build anything:

1. **Managed company devices.** Compliant or hybrid joined. They keep full access.
2. **Employees on personal phones and tablets.** Protect the apps, not the device.
3. **Vendors and contractors on unmanaged computers.** Browser only, with limits.

Create a security group for vendors and one for BYOD users. Keep your emergency access accounts out of every policy, as Learn recommends for all device-based policies.

## Step 2: Give unmanaged computers limited web-only access

This is the main answer from the February 2026 thread, and Learn's page on unmanaged devices supports it.

1. In the SharePoint admin center, open **Access control**, then **Unmanaged devices**. Older tenants may show this under **Policies**, **Access control**.
2. Choose **Allow limited, web-only access**.
3. Decide whether to allow browser editing. You can switch editing off for lower risk.

What the setting does, per Learn: unmanaged devices (devices that are neither hybrid Entra joined nor compliant in Intune) can use the browser, with no download, print or sync, and cannot use apps, including the Office desktop apps. Managed devices keep full access. You can apply it to all users or selected ones, and to all sites or selected sites.

It relies on Conditional Access and application enforced restrictions. Learn's session controls page explains the mechanism: Entra passes device information to the app, and the app gives a limited experience to unmanaged devices and a full one to managed devices. The app must be configured in its own service.

Points to plan for, all from Learn:

- Changes can take up to 24 hours. Users who are already signed in are not affected right away.
- Choosing an option on this page replaces earlier Conditional Access policies created from the page, and your edits to them are not kept.
- "Anyone" links are not controlled by it. Turn those links off on sites where you rely on the policy.
- Blocking only SharePoint can break the Files tab in Teams while chat keeps working. A Conditional Access policy for the **Office 365** cloud app avoids that dependency problem.
- Apps that do not use modern authentication can bypass device-based policies. Learn says to block them in the admin center under **Apps that don't use modern authentication**.
- Images may not show when a user edits in a browser under limited access, and some PDFs and images can produce an "Access Denied" error under the default file type setting.

For site-level control, Learn shows the `Set-SPOSite -ConditionalAccessPolicy` parameter, and for the tenant, `Set-SPOTenant -ConditionalAccessPolicy AllowLimitedAccess`. Site settings must be at least as strict as the tenant setting.

Exchange Online has its own configuration for application enforced restrictions, and the SharePoint page does not describe it. Read the Exchange documentation before you promise vendors a limited Outlook on the web.

## Step 3: Protect the apps on personal phones

For employees who use their own phones, the volunteer's answer proposes app protection policies. Learn's Conditional Access page for this scenario gives the steps:

1. Create the Intune app protection policy first.
2. In **Entra ID**, **Conditional Access**, create a policy for your BYOD group, with **All resources** as the target.
3. Under **Conditions**, **Device platforms**, select Android and iOS.
4. Under **Grant**, select **Require app protection policy**. Learn's own example also selects **Require approved client app** and uses **Require one of the selected controls**.
5. Start in **Report-only** mode.

Mind the retirement. Learn's grant controls page says that the approved client app grant is retiring, that policies using only that grant must be moved, and that new policies should use app protection policy only. The page text still gives a date in early 2026 while it was updated in June 2026, so read the migration article before you decide. The thread reply that mentions approved apps is older advice than that.

Devices must be registered in Entra before these controls apply on iOS and Android, and a broker app is needed: the Authenticator app on iOS, and the Authenticator or Company Portal app on Android.

## Step 4: Aim a policy at personal devices with a device filter

The volunteer also suggested a filter such as `deviceOwnership eq Personal`. Learn confirms that `deviceOwnership` is a supported property with the values it documents, for example `device.deviceOwnership -eq "Personal"`.

There is a trap, and it matters for vendors. Learn says that devices not registered in Entra ID have all their properties treated as empty. Positive operators such as Equals or Contains do not match them, so the filter is not applied. Negative operators such as NotEquals do match them. So:

- A rule that says ownership equals Personal will find registered personal devices only.
- To reach unregistered vendor laptops, build the rule the other way round, for example by excluding compliant or managed devices with a negative operator, and test it.

Learn also says to use at least one system-defined or admin-defined property in each filter, and that the maximum rule length is 3,072 characters.

## Step 5: Add MFA for outsiders

Both moderator answers suggest MFA for vendors and BYOD users on top of the device limits. Learn's compliance page lists the same fallback: if you are not ready to require compliance for everyone, require a compliant or hybrid joined device, or MFA, and start with administrators. Use an authentication strength if you want to demand a specific method.

## Step 6: Test, then enforce

1. Create every policy in **Report-only** mode.
2. Check the impact in the sign-in log and the Conditional Access reports. Learn notes that a policy applies only when all its conditions match.
3. Use the **What If** tool with a vendor test account on an unmanaged browser.
4. Tell vendors and users what they will see before you switch policies to **On**. The first rollout in the thread failed on friction, and the replies advise telling vendors and users what is required before enforcement.
5. Keep the emergency access accounts excluded.

## How to verify the result

- A vendor test account on an unmanaged laptop can open a document library in the browser, but the download, print and sync options are gone.
- The same account cannot open the Office desktop apps against SharePoint.
- An employee on a personal phone can use Outlook or Teams only through an app that has the app protection policy.
- A managed laptop still has full access.
- The Teams Files tab still works for vendors that you meant to allow.

## Limits of this guide

- The February 2026 thread has no accepted answer. The design here is a synthesis, and Learn backs each element separately, not as one tested solution.
- Limited access is not the same as no risk. A vendor can still read and screenshot what the browser shows.
- Licensing for Conditional Access, Intune and the SharePoint features differs. Check it before you start.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Device compliance (Intune compliance policies)](https://www.m365.fm/entity/device-compliance/)
- [Bring your own device (BYOD)](https://www.m365.fm/entity/bring-your-own-device/)
- [Block download policy (SharePoint)](https://www.m365.fm/entity/block-download-policy/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Learn: Control access from unmanaged devices (SharePoint and OneDrive)](https://learn.microsoft.com/en-us/sharepoint/control-access-from-unmanaged-devices)
- [Microsoft Learn: Conditional Access session controls](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-session)
- [Microsoft Learn: Conditional Access grant controls](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-grant)
- [Microsoft Learn: Require device compliance with Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance)
- [Microsoft Learn: Filter for devices in Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-condition-filters-for-devices)
- [Microsoft Learn: Require an approved client app or app protection policy](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-approved-app-or-app-protection)
- [Microsoft Q&A: Conditional Access policy for non-compliant devices (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5778510/conditional-access-policy-for-non-compliant-device)
- [Microsoft Q&A: Conditional Access, device compliance and Company Portal app downloads (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5973089/confirmation-required-conditional-access-device-co)
