---
title: "Vendors and Personal Laptops: Limit Access Instead of Requiring Device Compliance"
summary: "A compliance-only Conditional Access policy locked out vendors and BYOD users and was rolled back. Use web-only access, app protection and device filters to keep them in, with less risk. Steps checked on Learn."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [conditional-access, device-compliance, bring-your-own-device, block-download-policy, intune]
keypoints:
  - "'Require device to be marked as compliant' needs an Entra-registered, Intune-enrolled device. Vendors on their own laptops usually have neither."
  - "For unmanaged devices, SharePoint can allow limited, web-only access with no download, print or sync. Changes can take up to 24 hours."
  - "Target the Office 365 cloud app in Conditional Access, not SharePoint alone, or the Teams Files tab can break."
  - "A device filter with a positive rule such as deviceOwnership equals Personal does not match devices that are not registered in Entra. Use a negative rule to target them."
  - "Learn says the Require approved client app control became read-only on June 30, 2026. Use Require app protection policy for new mobile policies."
faq:
  - q: "Can I allow vendors on unmanaged laptops to use SharePoint without letting them download files?"
    a: "Yes. In the SharePoint admin center, under Access control, Unmanaged devices, choose Allow limited, web-only access. Users get browser access without download, print or sync, and managed devices keep full access. Microsoft Learn says the change can take up to 24 hours."
  - q: "Does a policy that requires a compliant device block Intune enrollment?"
    a: "No. Microsoft Learn says enrollment is not blocked when you require a compliant device. A community thread from August 2026 disputed how far this goes for Company Portal downloads, with no confirmed answer, so check the sign-in log for the blocked resource."
  - q: "Is 'Require approved client app' still a good choice for BYOD?"
    a: "Not for new policies. The Microsoft Learn migration article says the retirement date was moved to June 30, 2026. From that date the control is read-only: admins cannot create or edit policies that use it, but can disable or delete them, and existing enabled policies are still enforced. New policies should use Require app protection policy. Check the Learn migration article for the current status."
  - q: "How do I target personal devices with a device filter?"
    a: "The filter property deviceOwnership supports the values Personal (bring your own devices) and Company. Learn warns that for devices not registered in Entra all properties are treated as null values, so a positive rule does not match them, and a negative rule does. Test with report-only mode before you enforce."
---

A company wants Office 365 and SharePoint open only to company devices. The first idea is a Conditional Access policy that requires a compliant device. In a Microsoft Q&A thread from February 2026, the administrator turned that on and received so much pushback from vendors, contractors and employees on personal devices that the policy was rolled back. The question that followed: how do we reduce the risk without blocking these people?

A Microsoft moderator (in two replies) and a volunteer moderator answered with similar ideas. No answer was marked as accepted. This article puts those ideas into one design and checks each part against Microsoft Learn. It is not an official Microsoft procedure. Licensing is not covered, so check the Entra and Intune requirements for each feature yourself.

## Why compliance-only fails for outsiders

According to Microsoft Learn, **Require device to be marked as compliant** needs a device that is registered in Microsoft Entra ID and enrolled in Intune (or a supported third-party MDM on Windows). A vendor's own laptop has neither, and you do not want to enroll it. So the policy blocks every outsider by design.

A second thread from August 2026 asked a related question: can a compliance policy stop users from downloading apps in Company Portal when the device is non-compliant? An AI-generated answer said enrollment and the web Company Portal are exceptions, and a high-reputation community member commented that sign-in to the Company Portal app is blocked when the device is noncompliant. Nobody confirmed anything. What Learn does say is clear: requiring a compliant device does not block Intune enrollment. If a user is blocked at some step, open the sign-in log and find the exact resource and policy, instead of guessing.

## Step 1: Split the audiences

List the groups before you build anything:

1. **Managed company devices.** Compliant or hybrid joined. They keep full access.
2. **Employees on personal phones and tablets.** Protect the apps, not the device.
3. **Vendors and contractors on unmanaged computers.** Browser only, with limits.

Create a security group for vendors and one for BYOD users. Keep your emergency access accounts out of every policy, as Learn recommends for all device-based policies.

## Step 2: Give unmanaged computers limited web-only access

This is the main answer from the February 2026 thread, and Learn's page on unmanaged devices supports it.

1. In the SharePoint admin center, open **Access control**, then **Unmanaged devices**. Learn names **Policies**, **Access control** only for Office 365 operated by 21Vianet.
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
4. Under **Grant**, select **Require app protection policy**. Learn's policy page still shows an example that also selects **Require approved client app** and uses **Require one of the selected controls**, but see the retirement note below before you use that control.
5. Start in **Report-only** mode.

Mind the retirement. Learn's grant controls page still says the approved client app grant is retiring in early March 2026. The migration article, updated in May 2026, moves that date to June 30, 2026. From then on the control is read-only: you cannot create or edit policies that use it, you can still disable or delete them, and existing enabled policies keep being enforced. New policies should use only **Require app protection policy**. The thread replies that mention approved apps are older advice than that.

Learn says iOS and Android devices must first register in Entra ID before these controls can be enforced. For app protection policy, Learn names Microsoft Authenticator for iOS or Microsoft Company Portal for Android as the broker app.

## Step 4: Aim a policy at personal devices with a device filter

The volunteer also suggested a filter such as `deviceOwnership eq Personal`. Learn confirms that `deviceOwnership` is a supported property with the operators Equals and NotEquals and the values `Personal` (bring your own devices) and `Company` (corporate owned devices). Learn's own example uses `device.deviceOwnership -eq "Company"`; a rule for `Personal` follows the same syntax.

There is a trap, and it matters for vendors. Learn says that for a device that is not registered in Entra ID, all device properties are treated as null values. The filter rule applies to such a device only with a negative operator. With a positive operator, the rule applies only when the device exists in the directory and matches the attribute. So:

- A rule that says ownership equals Personal will find registered personal devices only.
- To reach unregistered vendor laptops, Learn recommends a negative operator such as NotEquals. Build the rule the other way round and test it in report-only mode.

Learn also says to use at least one system-defined or admin-defined property in each filter, and that the maximum rule length is 3,072 characters.

## Step 5: Add MFA for outsiders

The moderator's second reply and the volunteer's answer suggest MFA for vendors and BYOD users on top of the device limits. Learn's compliance page names alternative policies for organizations that are not ready to require compliance for everyone: require a compliant or hybrid joined device for administrators, or require a compliant device, a hybrid joined device or multifactor authentication for all users. If you want to demand specific methods, Learn's grant controls page describes the **Require authentication strength** grant.

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
- [Microsoft Learn: Migrate approved client app to application protection policy in Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/migrate-approved-client-app)
- [Microsoft Q&A: Conditional Access policy for non-compliant devices (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5778510/conditional-access-policy-for-non-compliant-device)
- [Microsoft Q&A: Conditional Access, device compliance and Company Portal app downloads (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5973089/confirmation-required-conditional-access-device-co)
