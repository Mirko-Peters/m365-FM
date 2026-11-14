---
title: "Fix Teams Error 0xCAA20004 When Signing In: A Conditional Access Checklist"
summary: "Learn says Teams error 0xCAA20004 occurs when an issue affects Conditional Access. Run the Teams sign-in diagnostic, then use the Entra sign-in logs to find which policy applied, including service dependencies and audience reporting."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [teams, conditional-access, entra-id]
keypoints:
  - "Learn's Teams sign-in page says 0xCAA20004 occurs if an issue affects Conditional Access and links to Conditional Access policies for Teams."
  - "Start with the Teams Sign-in diagnostic in the Microsoft 365 admin center and the Remote Connectivity Analyzer Teams Sign in test."
  - "In the Entra sign-in logs, filter by user, time or correlation ID and open the Conditional Access tab to see which policies applied."
  - "Teams sign-in requests several resources, so a policy on SharePoint or Exchange can interrupt a Teams sign-in."
  - "If the error persists, Learn lists reinstalling Teams and, if nothing helps, creating a support request with debug logs and the error code."
faq:
  - q: "What does 0xCAA20004 mean?"
    a: "Microsoft Learn's page on Teams sign-in errors says this error occurs if an issue affects Conditional Access. It links to an explanation of how Conditional Access policies work for Teams. The page gives no further detail on the error itself."
  - q: "Which tools should I run first?"
    a: "The Teams Sign-in diagnostic in the Microsoft 365 admin center, which needs an administrator account and asks for the affected user's email address, and the Teams Sign in test in the Microsoft Remote Connectivity Analyzer, which verifies that the user account meets the requirements to sign in to Teams."
  - q: "How do I find the policy that interrupted the sign-in?"
    a: "In the Microsoft Entra admin center, sign in as at least Reports Reader, open Sign-in logs, find the event, and select the Conditional Access tab. It shows the policies that resulted in the interruption. You can drill into a policy name and use the Troubleshoot Event sign-in diagnostic."
  - q: "Why can a SharePoint policy block Teams?"
    a: "Learn explains that signing in to Teams requests multiple resources, such as Teams chat, the Outlook calendar and documents. Conditional Access policies apply across all of them, so a restriction on SharePoint can apply even when the user thinks they only sign in to Teams. Audience reporting in the sign-in logs shows the requested resources."
  - q: "What if the error occurs only in the Teams web client?"
    a: "The Teams sign-in page says that if the error occurs only in the web client, see its login loop page for resolutions specific to the user's browser. Otherwise it says to check for updates, and if the error persists to reinstall Teams: uninstall, delete the Teams folder under percent appdata percent Microsoft, and install again, as administrator if possible."
---

Teams error 0xCAA20004 points to Conditional Access. Microsoft Learn's page on Teams sign-in errors says the code occurs if an issue affects Conditional Access, and that is all it says about the cause. The practical work is therefore to find which Conditional Access policy interrupted the sign-in, and to rule out client problems. This guide combines the Teams sign-in page with Learn's page on troubleshooting sign-in problems with Conditional Access.

## Step 1: run the Teams sign-in diagnostic

Learn lists two checks that an administrator can run.

**Teams Sign-in diagnostic.** It runs from the Microsoft 365 admin center and needs an administrator account. Enter the email address of the affected user in **Provide the username or email of the user reporting this issue** and select **Run Tests**. Learn says this feature is not available for Microsoft 365 Government, Microsoft 365 operated by 21Vianet or Microsoft 365 Germany.

**Microsoft Remote Connectivity Analyzer.** Open the Teams Sign in test, sign in with the account to test, enter the verification code and select **Verify**. The test checks that the account meets the requirements to sign in to Teams. Learn notes that the tool does not currently support Microsoft 365 Government environments (GCC or GCC High).

If a diagnostic finds an issue that affects Teams in the tenant, Learn says to follow the solution it gives.

## Step 2: check the client

If the diagnostics find nothing, Learn says to check that the Teams client runs the latest update, using **Settings and more** next to the profile picture, then **Check for updates**. The desktop app updates automatically, but if an update is missing, install it and try again.

Then read the error code on the sign-in screen. Learn gives guidance for these codes:

- **0xCAA82EE7 or 0xCAA82EE2:** check that the user has Internet access, and use the Network assessment tool to verify the network between the user and Microsoft.
- **0xCAA20004:** an issue that affects Conditional Access. This is the code in this article.
- **0xCAA70004 or 0xCAA70007**, or sign-in issues that also occur in other Office apps: Learn links an article on connection issues at sign-in after an Office 2016 update.

## Step 3: find the Conditional Access policy

Learn's Conditional Access troubleshooting page describes this route.

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Find the event. Filters that help: **Correlation ID** for a specific event, **Conditional Access** to see policy successes and failures, scoped to failures if you want fewer results, **Username**, **Date** and **Resource**.
4. Open the event and select the **Conditional Access** tab. It shows which policies resulted in the interruption. The **Troubleshooting and support** tab may give a clear reason, such as a device that did not meet compliance requirements.
5. Select the policy name to see the policy configuration. The **Basic Info**, **Location**, **Device Info**, **Authentication Details** and **Additional Details** tabs hold the user and device details used in the assessment.

Learn says that on the original error page, **More Details** shows information useful for searching the sign-in events or for a support incident. If the information is not enough, use the sign-in diagnostic under **Basic info** > **Troubleshoot Event**, or the What If tool. When you contact Microsoft support, include the request ID, time and date from the sign-in event.

Policies apply only when all conditions are satisfied or not configured. The ellipsis next to a policy in the sign-in event shows details that explain why it applied or not.

### Teams signs in to more than Teams

Learn explains that a user who signs in to an app such as Teams requests several resources, such as Teams chat, the Outlook calendar and Excel documents. Conditional Access policies apply across all of them. If an admin restricts access to SharePoint or specific SharePoint sites, the policy applies even when the user thinks they only sign in to Teams. **Audience** in the sign-in log, under the Resource section after you select a policy on the Conditional Access tab, lists all resources requested in the sign-in.

Separately, Learn's Teams security page says Teams is supported as its own cloud app in Conditional Access, and policies set on Exchange Online and SharePoint apply to Teams when a user signs in. It also says that without correct policies on those apps, users might still reach those resources directly.

### Service dependencies

Learn says some users are blocked because a cloud app depends on a resource that a policy blocks. Check the application and the resource in the sign-in log. Its example: the application is the Azure portal and the resource is Azure Resource Manager, and the policy must cover all of the applications and resources involved.

### Risky policy settings

Learn warns against some settings for all users and all resources, such as Block access, Require device to be marked as compliant, Require Hybrid Microsoft Entra joined device and Require app protection policy. These can block the whole organization or lock out administrators who lack an enrolled device. If you are locked out, another admin can disable the policy, and if no admin can, you can submit a support request.

## Step 4: reinstall Teams if the error persists

If the error persists, Learn's reinstall steps are to uninstall Teams, browse to `%appdata%\Microsoft` and delete the **Teams** folder, then download and install Teams, as administrator if possible by right-clicking the installer and choosing **Run as administrator**. If nothing helps, create a support request, collect debug logs and give the error code shown on the sign-in screen.

## A short order of work

This is my own summary, not a Microsoft statement.

1. One user or many? If many, a recent policy change is the likely trigger, so look at policy change history first.
2. Pull the sign-in event for the failure and read the Conditional Access tab.
3. Check **Audience** to see which resource a policy matched.
4. Fix or exclude with care, using report-only mode for any change, and keep an emergency access account out of the policy.
5. Only then spend time on reinstalling the client.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Fix Teams sign-in errors - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-sign-in/resolve-sign-in-errors)
- [Troubleshooting sign-in problems with Conditional Access - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Overview of security and compliance - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/security-compliance-overview)
