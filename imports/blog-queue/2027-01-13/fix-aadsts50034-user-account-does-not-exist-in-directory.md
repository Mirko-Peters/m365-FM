---
title: "Fix AADSTS50034: The User Account Does Not Exist in the Directory"
summary: "AADSTS50034 (UserAccountNotFound) means the account is not in the tenant that handled the sign-in. Check for typos and the wrong tenant, then add the person as a B2B guest if they should have access."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [entra-id, b2b-collaboration, guest-access]
keypoints:
  - "Learn names the error UserAccountNotFound: to sign in, the account must be added to the directory."
  - "Documented causes: the user mistyped the username, the user is not in the tenant, or the application chose the wrong tenant."
  - "If the user should have access, Learn says to add them as a guest through B2B collaboration."
  - "In the Entra admin center, invite via Entra ID > Users > New user > Invite external user, as at least User Administrator."
  - "Guest invitations do not expire, and the guest must redeem the invitation; the invitation state shows on the user's page."
faq:
  - q: "What does AADSTS50034 mean?"
    a: "The Microsoft Entra error code reference lists AADSTS50034 as UserAccountNotFound. To sign in to the application, the account must be added to the directory. The error can occur because the user mistyped the username or is not in the tenant."
  - q: "Can the application be the cause?"
    a: "Yes. Learn says an application might have chosen the wrong tenant to sign in to, and the currently signed-in user was prevented from signing in because the account does not exist in that tenant. In that case check which tenant endpoint the app sends users to (my advice, not Learn's)."
  - q: "How do I fix it for someone who should have access?"
    a: "The reference says that if this user should be able to sign in, add them as a guest and links to the B2B guide. In the Microsoft Entra admin center you go to Entra ID > Users, select New user > Invite external user, and complete the Basics tab with the email address and display name."
  - q: "Which role do I need to invite a guest?"
    a: "The Learn how-to says to sign in as at least a User Administrator. It also notes that by default all users and admins can invite guests, but your external collaboration settings might restrict who can invite."
  - q: "Does an invited guest have access immediately?"
    a: "No. Learn says the invited user must redeem the invitation to access resources. An invitation of a user does not expire. If the invitation state is Pending acceptance, you can open the user in the Entra admin center and select Resend invitation."
---

AADSTS50034 means the sign-in reached a tenant that has no matching account for the user. Check the username for typos, check which tenant the app sends the user to, and if the person should have access, invite them as a B2B guest. The Microsoft Entra error code reference calls this error **UserAccountNotFound**.

## What Microsoft says

The error reference gives this description. To sign in to the application, the account must be added to the directory. The error can occur for three reasons:

1. The user mistyped their username.
2. The user is not in the tenant.
3. The application chose the wrong tenant to sign in to, and the signed-in user was prevented from signing in because they do not exist in that tenant.

It then says: if this user should be able to sign in, add them as a guest, and it links to the guide for adding B2B users.

The reference page also notes that error codes and messages are subject to change, and that for current information you can look up the code at `https://login.microsoftonline.com/error`. You can append the number to the URL, for example `?code=50034`.

## Step 1: Rule out the simple cases

- Compare the username in the error response or the sign-in log with what the user meant to type. The text of the error includes a trace ID, correlation ID and timestamp that you can use to find the entry in the Entra sign-in logs.
- Check whether the user's account really lives in this tenant. A person from another company or a personal Microsoft account is not a member of your tenant.

## Step 2: Check which tenant the app uses

Learn lists the wrong tenant as a cause. For an app you own, look at the authority or sign-in URL it uses. If it contains a specific tenant ID or domain, only accounts from that tenant can sign in. Check the app's documentation or ask its developer which sign-in endpoint is configured. That advice is mine, not from Learn.

## Step 3: Invite the person as a guest

If the person is external and should have access, use B2B collaboration. This is the Learn how-to for the Entra admin center.

Prerequisite: your external collaboration settings must allow you to invite guests. Learn says all users and admins can invite guests by default, but your organization's policies might restrict certain types of users.

1. Sign in to the Microsoft Entra admin center as at least a **User Administrator**.
2. Browse to **Microsoft Entra ID** > **Users**.
3. Select **New user** > **Invite external user**.
4. On **Basics**, enter the guest's **Email** and a **Display name**. Optionally select **Send invite message** to add a short message.
5. Optionally add properties or assignments. You can assign the guest to up to 20 groups or roles at creation. Assigning Microsoft Entra roles needs the Privileged Role Administrator role.
6. Select **Review + invite**, then **Invite**.

The invited account is added with the user type **Guest**, and an email invitation goes out. Learn adds these details:

- The guest must redeem the invitation to access resources. An invitation does not expire.
- Group email addresses are not supported. Use an individual's address.
- Learn says Microsoft Entra does not currently support plus symbols in email addresses, so omit the plus and characters after it up to the @ sign to avoid delivery problems.
- The guest's UPN has the format `emailaddress#EXT#@domain`.

### Check the invitation

Open the guest in **Microsoft Entra ID** > **Users** and look at the **B2B collaboration** tile in **My Feed**. If the state is **Pending acceptance**, select **Resend invitation**. The **Properties** page also shows the **Invitation state**.

## Step 4: Give access to the app

Whether an account in the directory is enough depends on the app; if the app requires assignment, the guest also needs access to it (my advice, not from the error reference). Learn's B2B how-to describes adding guests to an app: **Microsoft Entra ID** > **Enterprise apps**, pick the application, **Users and groups** > **Add user/group**, select the guest and assign. The guest shows up with the role **Default Access** unless the app has other roles. The same page also describes adding guests to a group. Assigning that group to the app is my suggestion, not a step on that page.

## When inviting is the wrong fix

Do not invite someone only to make the error disappear. If the user is an employee who typed the wrong name, correct the username. If the app picks the wrong tenant, change the app configuration. Inviting a guest creates a second identity for a person who may already have a proper account. That caution is my advice.

## A short checklist

This is my summary of the steps above.

1. Read the username in the sign-in log entry.
2. Is the user a member of the tenant? If yes, fix the typo or the sign-in name.
3. Is the app using the right tenant? If not, fix the configuration.
4. If the user is external and approved, invite as a guest and confirm the redemption.
5. Assign the guest to the app or group that grants access.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Guest access](https://www.m365.fm/entity/guest-access/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Add B2B collaboration users - Microsoft Entra External ID (Microsoft Learn)](https://learn.microsoft.com/entra/external-id/add-users-administrator)
