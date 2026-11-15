---
title: "How to Enable Self-Service Password Reset in Microsoft Entra ID"
summary: "Step by step from the Learn tutorial: prerequisites, enabling SSPR for a test group, methods and registration, notifications, the helpdesk link, and a test with a non-admin account. Plus the legacy policy deprecation and the FAQ answers."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [entra-id, self-service-password-reset, password-writeback]
keypoints:
  - "SSPR needs at least a Microsoft Entra ID P1 license and an account with at least the Authentication Policy Administrator role."
  - "In the Microsoft Entra admin center go to Entra ID, Password reset, Properties, and set Self service password reset enabled to None, Selected or All."
  - "The tutorial sets the Number of methods required to reset to 2 and allows app notification, app code, email and mobile phone."
  - "Since September 30, 2025, authentication methods cannot be managed in the legacy MFA and SSPR policies, so use the Authentication methods policy."
  - "Test with a non-administrator account, at aka.ms/ssprsetup for registration and aka.ms/sspr for the reset."
faq:
  - q: "What do I need before I enable SSPR?"
    a: "The tutorial lists a working Microsoft Entra tenant with at least a Microsoft Entra ID P1 license, an account with at least the Authentication Policy Administrator role, a non-administrator test user whose password you know, and a group that the test user belongs to."
  - q: "Can I turn SSPR on for everyone at once?"
    a: "Yes. Microsoft Entra ID lets you enable SSPR for None, Selected or All users. The tutorial uses Selected with one test group first. It notes that currently only one Microsoft Entra group can be enabled for SSPR in the admin center, and that nested groups are supported."
  - q: "Why test with a non-administrator account?"
    a: "The tutorial says that by default Microsoft Entra ID enables SSPR for admins and requires them to use two authentication methods. A non-admin test shows the experience of regular users. The administrator reset policy differences are on the SSPR policies page."
  - q: "Why do users not see the password policy of my on-premises domain?"
    a: "The FAQ in the tutorial says Microsoft Entra Connect and cloud sync do not share password policy details with the cloud at this time. SSPR shows only the cloud password policy details and cannot show on-premises policies."
  - q: "Why can a federated user wait after the reset?"
    a: "For federated users whose passwords are synchronized, the source of authority is on-premises, so SSPR updates only the on-premises password. The FAQ says password hash synchronization back to Microsoft Entra ID is scheduled every 2 minutes, so such users might wait up to 2 minutes."
---

Self-service password reset (SSPR) lets users change or reset their own password without an administrator or the help desk. This article follows the Microsoft Learn tutorial on enabling SSPR for a group of users and testing the reset. It adds the points of that page that are easy to miss, such as the license, the role and a deprecation notice. Where I give my own advice, I say so.

## What SSPR gives you

According to the tutorial, users who forget their password or are locked out by Microsoft Entra ID can follow prompts to unblock themselves. The page says this reduces help desk calls and lost productivity. The tutorial is meant for administrators. End users who are already registered and need to get back into an account are pointed to the Microsoft Online password reset page.

## Before you start

You need:

- A working Microsoft Entra tenant with at least a Microsoft Entra ID P1 license. The page links a separate article on licensing requirements for password change and reset.
- An account with at least the **Authentication Policy Administrator** role.
- A non-administrator user with a password you know, for the test. The tutorial calls it testuser.
- A group the test user belongs to. The tutorial uses SSPR-Test-Group.

## Important change to legacy policies

The tutorial carries a notice. In March 2023 Microsoft announced the deprecation of managing authentication methods in the legacy multifactor authentication and SSPR policies. Beginning September 30, 2025, authentication methods cannot be managed in these legacy policies. Microsoft recommended using the manual migration control to move to the Authentication methods policy by that date.

That date has passed. My advice: if your tenant still shows old settings, check the migration status of your authentication methods first.

## Step 1: Enable SSPR

1. Sign in to the Microsoft Entra admin center as at least an Authentication Policy Administrator.
2. Browse to **Entra ID** > **Password reset**.
3. On the **Properties** page, under **Self service password reset enabled**, choose **Selected**.
4. If the group is not visible, choose **No groups selected**, search for the group, and choose **Select**.
5. Select **Save**.

You can pick **None**, **Selected** or **All**. The page says the choice lets you test with a subset before you tell a wider set of users. It notes that you can enable only one Microsoft Entra group in the admin center, and that nested groups are supported as part of a wider deployment.

## Step 2: Choose authentication methods and registration

Users are asked for another confirmation method when they unlock the account or reset a password. The tutorial uses these settings:

1. On the **Authentication methods** page, set **Number of methods required to reset** to **2**. The page says you can increase the number to improve security.
2. Choose the **Methods available to users**. The tutorial enables **Mobile app notification**, **Mobile app code**, **Email** and **Mobile phone**.
3. Select **Save**.

Then registration. Users must register contact information before they can reset a password. The page says an administrator can provide it manually, or users can register themselves.

1. On the **Registration** page, set **Require users to register when signing in** to **Yes**.
2. Set **Number of days before users are asked to reconfirm their authentication information** to **180**.
3. Select **Save**.

The page explains why the number of days matters: outdated contact information can leave a user unable to unlock the account or reset the password. It also says the interruption to register only happens when the configured conditions are met, and only once per interactive session.

## Step 3: Notifications and the helpdesk link

On the **Notifications** page the tutorial sets **Notify users on password resets?** to **Yes** and **Notify all admins when other admins reset their password?** to **Yes**, then saves. The page says this gives an extra layer of awareness when a privileged account password is reset with SSPR.

On the **Customization** page, set **Customize helpdesk link** to **Yes** and enter an email address or web address in **Custom helpdesk email or URL**. The page recommends a custom helpdesk email or URL, so users who need more help know where to go.

## Step 4: Test as a user

1. Open a new browser window in InPrivate or incognito mode and go to `https://aka.ms/ssprsetup`.
2. Sign in with the non-administrator test user and register the authentication methods. Select **Looks good** when done.
3. Open another private window and go to `https://aka.ms/sspr`.
4. Enter the user name and the CAPTCHA characters, then select **Next**.
5. Follow the verification steps. When finished, the user gets an email notification that the password was reset.

The page asks you to use a non-administrator account. By default Microsoft Entra ID enables SSPR for admins, who must use two authentication methods to reset their password.

## FAQ points from the tutorial

- SSPR shows only the cloud password policy details. Microsoft Entra Connect and cloud sync do not share on-premises policy details with the cloud at this time.
- Federated users with synchronized passwords can wait up to 2 minutes after the reset, since password hash synchronization back to Microsoft Entra ID runs every 2 minutes.
- Users with password writeback enabled do not see the password strength indicator, since SSPR cannot read the on-premises policy and cannot validate strength.
- The page title Don't lose access to your account appears for users who are members of SSPR or combined registration groups configured for the tenant.

## Switch it off again

If you do not want to keep the setup, set **Self service password reset enabled** to **None** on the **Properties** page and save. The page notes that a later tutorial in the series sets up password writeback, so do not disable SSPR if you want to continue with that.

## Rollout advice (my advice)

This is my suggestion, not part of the tutorial:

1. Start with a pilot group of users who can give feedback on the registration prompt.
2. Write a short help page for users that shows the two addresses, aka.ms/ssprsetup and aka.ms/sspr.
3. Decide the helpdesk link text before you enable the setting, so the first users do not see a blank target.
4. If you synchronize from on-premises, plan password writeback together with SSPR.
5. Review the registration numbers a few weeks after the start, before you move the setting to All.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Self-service password reset (SSPR)](https://www.m365.fm/entity/self-service-password-reset/)
- [Password writeback](https://www.m365.fm/entity/password-writeback/)

## Sources

- [Enable Microsoft Entra self-service password reset (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/tutorial-enable-sspr)
