---
title: "Securing redirection in Azure Virtual Desktop with Entra authentication context"
summary: "To restrict clipboard, drive, printer and USB redirection on unmanaged devices, create an authentication context in Entra, require a compliant device in a Conditional Access policy for it, and map it to the redirections in the host pool's RDP properties. Context-based redirection is in preview as of 17 November 2026."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-context-based-redirections, azure-virtual-desktop]
keypoints:
  - "Three configuration steps: create and publish an authentication context in Entra, create a Conditional Access policy that targets it, then map it to each redirection under the host pool's RDP Properties > Device redirection."
  - "The example policy on Learn uses Grant access with Require device to be marked as compliant. Note the context's name and ID, because you use the same context in both places."
  - "The setting applies to all session hosts in the host pool. Test with a pilot host pool first, from both a compliant device and a BYOD or noncompliant device."
  - "If a redirection does not behave as expected, check the policy assignment, device compliance, the host pool RDP properties and other redirection policies. The most restrictive setting wins."
  - "Context-based redirection is in preview, and RemoteApp support has been in preview since October 2026. Check Learn's current page before relying on it."
faq:
  - q: "Where do I set the mapping in the Azure portal?"
    a: "Learn's path is Azure Virtual Desktop > Host pools > your host pool > RDP Properties > Device redirection. For each redirection you want to control, select Dynamically configure using authentication context, choose the authentication context from the list, and select Save."
  - q: "Why does a redirection stay blocked from a compliant device?"
    a: "Learn lists four checks: the Conditional Access policy assignment and authentication context, the device compliance status in Microsoft Entra ID and Intune, the host pool RDP properties, and existing redirection policies that might override the configuration. Microsoft's blog post adds that the most restrictive policy always applies."
  - q: "Do users need to do anything after I save the RDP properties?"
    a: "Learn's custom RDP properties article says users need to refresh their resources to receive changes to a host pool's RDP properties. That article covers RDP properties in general; Learn's context-based redirection article does not state it separately."
---

To restrict clipboard, drive, printer and USB redirection for connections from unmanaged devices, you create an authentication context in Microsoft Entra, a Conditional Access policy that targets it, and a mapping from that context to the redirections in the host pool's RDP properties. Context-based redirection is in preview as of 17 November 2026, so run it first on a pilot host pool.

This walkthrough follows Learn's configuration article for Azure Virtual Desktop. The concepts behind it, and how the setting fits with other controls, are covered in the explainer article on context-based redirections in this series.

## Before you start

- **A host pool to test on.** The mapping applies to all session hosts in the host pool, desktop and RemoteApp sessions alike (RemoteApp support has been in preview since October 2026). A separate pilot host pool keeps production unchanged.
- **Permissions.** Editing RDP properties needs, per Learn's custom RDP properties article, the Desktop Virtualization Host Pool Contributor role or equivalent. You also need rights to create authentication contexts and Conditional Access policies in Microsoft Entra.
- **Licensing.** Entra's developer guidance says Conditional Access requires Microsoft Entra ID P1 and that authentication context is not available in the Free edition.
- **A decision on the trust signal.** Learn's example requires a compliant device. That relies on devices being enrolled and evaluated in Intune, so check that compliance reporting works for your test devices first.
- **Existing redirection policies.** Microsoft's blog post warns that an existing policy which disables a redirection wins, because the most restrictive policy always applies. For the redirections you want to gate, the other policies should be "Not Configured" or "Enabled". Check Intune and Group Policy settings on the session hosts, including those that ship with recent gallery images.

## Step 1: create the authentication context

1. Sign in to the Microsoft Entra admin center.
2. Go to **Entra ID** > **Conditional Access** > **Authentication contexts**.
3. Select **New authentication context**.
4. Enter a name and a description. Learn's example name is "All Managed, Compliant Devices".
5. Select **Publish to apps**, then pick an available value from the **ID** list. The example uses c8.
6. Select **Save**.

Write down the name and the ID. Learn says you use the same authentication context in the policy and in the redirection settings. Entra allows c1 to c99, and its documentation advises names that can be reused across resources, such as *trusted devices*, to keep the number of contexts small.

## Step 2: create the Conditional Access policy

1. In **Conditional Access**, select **Policies**, then **New policy**.
2. Enter a name.
3. Under **Users or workload identities**, include the users or groups the policy applies to.
4. Under **Target resources**, select **Authentication context** and choose the context from step 1.
5. Under **Grant**, select **Grant access** > **Require device to be marked as compliant** > **Select**.
6. Set **Enable policy** to **On** and select **Create**.

Learn's example policy, as a table:

| Setting | Value |
|---|---|
| Users or workload identities | Targeted users or groups |
| Target resources | Authentication contexts |
| Authentication context | The context from step 1 |
| Grant access | Enabled |
| Require device to be marked as compliant | Selected |
| Require all selected controls | Selected |
| Enable policy | On |

Our reading, not a Learn statement: because the policy targets an authentication context and not the Azure Virtual Desktop apps, it is separate from the policies that govern sign-in to Azure Virtual Desktop. Sign-in policies are a separate subject, covered in our article on Conditional Access policies for Azure Virtual Desktop.

## Step 3: map the context to the redirections

1. Sign in to the Azure portal and open **Azure Virtual Desktop**.
2. Select **Host pools**, then the host pool you want to configure.
3. Select **RDP Properties** > **Device redirection**.
4. For a redirection you want to control, select **Dynamically configure using authentication context**.
5. In the **Authentication context** list that appears, select the context from step 1.
6. Repeat steps 4 and 5 for each further redirection.
7. Select **Save**.

Learn's screenshot sets drive and storage redirection and clipboard redirection to the dynamic option with the c8 context. The four redirections available for this mapping are clipboard, drive and storage, printer and USB. For reference, the host pool defaults include `redirectclipboard:i:1`, `redirectprinters:i:1`, `drivestoredirect:s:*` and `usbdevicestoredirect:s:*`, so without the dynamic setting every connection gets those redirections.

If you manage RDP properties by script, note how Learn's examples work: `Update-AzWvdHostPool -CustomRdpProperty` replaces all custom properties unless you append your change to the current value. Learn's context-based redirection article documents only the portal route for this mapping. To roll back, our reading is that you set the redirection back to its previous value on the same tab and save.

## Step 4: validate from two devices

Learn's validation steps for Azure Virtual Desktop give the pattern. Run it on the pilot host pool.

| Test | Connect from | Expected result |
|---|---|---|
| 1 | Managed, compliant device | Configured redirections are available in the session |
| 2 | BYOD or noncompliant device | Configured redirections are restricted or unavailable |
| 3 | Both devices, if you publish RemoteApp | Repeat tests 1 and 2 with a published application |

Connect with a client Learn lists for full desktop sessions: Windows App on Windows, a web browser, Android, iOS/iPadOS or macOS. For each redirection, Learn points to its own article for the check:

- **Clipboard:** copy and paste between the local device and the remote session.
- **Drive and storage:** Learn's drive redirection article.
- **Printer:** Learn's printer redirection article.
- **USB:** Learn's USB redirection article.

Illustrative scenario: with the context mapped to clipboard and drives only, a user on a compliant laptop can copy text from a local document into the remote session and see local drives. The same user on a personal tablet should get neither, while printing, which you did not map, behaves as before.

## If it does not behave as expected

Learn's checklist for Azure Virtual Desktop, in the order to work through it:

1. **Policy assignment and authentication context.** Is the user in the group the policy targets, and is the policy set to On? Does the policy target the same context you mapped?
2. **Device compliance.** Check the device's compliance status in Microsoft Entra ID and Intune.
3. **Host pool RDP properties.** Did the save succeed, and is the right context selected for each redirection?
4. **Existing redirection policies.** An Intune or Group Policy setting that disables the redirection on the session host overrides the configuration, as the most restrictive setting wins.

Entra's documentation notes that sign-in logs show where authentication context policies are applied, which is the place to look when a compliant device is still treated as noncompliant. Microsoft also says a Resultant Set of Policy feature is in development to show which settings and policy source applied to a connection. It is not available today, so expect to check the layers manually.

## Rolling out beyond the pilot

An order that follows from the steps above, and is our suggestion rather than a Learn requirement:

1. Pilot with one redirection, for example drives, on one host pool and a small user group.
2. Add the other redirections after tests 1 to 3 pass.
3. Repeat the host pool mapping for each production host pool. The authentication context and the policy can be reused.
4. Record the context name and ID next to the host pool name in your documentation, so a later change to the policy is made with its dependents in view.

Do not delete the context casually later. Entra says to confirm that nothing uses it first, and it must have no Conditional Access policy assigned and not be published to apps.

## Sources

Retrieved 17 November 2026.

- Microsoft Learn, Configure context-based redirections (Preview), Azure Virtual Desktop tab: https://learn.microsoft.com/en-us/windows-365/enterprise/context-based-redirections
- Windows IT Pro Blog, Adaptive data protection with context-based redirections in Windows 365, now in public preview: https://techcommunity.microsoft.com/blog/windows-itpro-blog/adaptive-data-protection-with-context-based-redirections-in-windows-365-now-in-p/4521366
- Microsoft Learn, What's new in Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new
- Microsoft Learn, Set custom RDP properties on a host pool in Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-rdp-properties
- Microsoft Learn, Conditional Access: Target resources (Authentication context): https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-cloud-apps
- Microsoft Learn, Developer guidance for Microsoft Entra Conditional Access authentication context: https://learn.microsoft.com/en-us/entra/identity-platform/developer-guide-conditional-access-authentication-context
