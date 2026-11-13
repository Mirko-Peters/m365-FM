---
title: "Safe Links URLs Not Rewritten, or Rewritten Despite an Exclusion: What the Settings Really Do"
summary: "Safe Links is on but links in mail are not wrapped, or a link is wrapped although it is on the Do not rewrite list. This guide checks scope, policy order, settings and client limits against Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [safe-links, defender-for-office-365]
keypoints:
  - "Safe Links does not rewrite URLs in Teams or in Office apps, does not wrap SharePoint or OneDrive links any more, and ignores RTF, S/MIME signed and public folder mail, according to Microsoft Learn."
  - "The setting Do not rewrite URLs, do checks via SafeLinks API only turns wrapping off while still scanning links, so unwrapped links can be a configured result, not a fault."
  - "Preset policies always win: Strict first, then Standard, then custom policies by priority, then Built-in protection. A recipient is protected by the first policy that applies."
  - "The Do not rewrite list needs exact patterns, supports at most three wildcards per entry, and is ignored in Teams and the Office web apps."
faq:
  - q: "Why are links in my emails not rewritten although Safe Links is on?"
    a: "First check whether Safe Links is meant to rewrite that link. Microsoft Learn says it does not protect URLs in RTF messages, mail-enabled public folders, or S/MIME signed messages, supports only HTTP, HTTPS and FTP, and no longer wraps SharePoint or OneDrive URLs. Then check whether the API-only setting is selected, whether the recipient is covered by a higher-priority policy, and whether another service wraps links before Defender does."
  - q: "How long does a Safe Links policy change take?"
    a: "Microsoft Learn says to allow up to 6 hours for a new or updated policy, and up to 24 hours for the Teams setting. A 2025 Q&A answer mentioned up to 48 hours. Learn's figure should be your reference."
  - q: "Why is my URL still rewritten although it is in the Do not rewrite list?"
    a: "Learn describes several causes: the pattern does not match the exact URL, the recipient falls under a different policy whose list is the one that applies, or the click happens in Teams or an Office web app, which ignore the list. In a July 2025 thread the asker used a subdomain pattern and still saw rewriting, and no cause was confirmed."
  - q: "Do URL allow entries in the Tenant Allow/Block List stop rewriting?"
    a: "No. Learn states that URL allow entries in the Tenant Allow/Block List are not excluded from Safe Links rewriting. The Do not rewrite list is the setting for that."
---

Two opposite complaints come up for Safe Links in Microsoft Defender for Office 365. In one, an administrator enables Safe Links and Safe Attachments, sends a test mail, and the link in the inbox is still the original address. In the other, a vendor sends one-time links to staff, the domain is on the **Do not rewrite** list, and the links are wrapped anyway and stop working.

Both appeared in Microsoft Q&A threads in 2025, and a third one in April 2026 asked how to stop the "verifying link" page in Teams for trusted domains. None of the threads reached a confirmed fix. The answers I could verify came from Microsoft Learn, so this article is built on the current Learn pages. It is not an official Microsoft procedure. Where I mention a thread, I say what was reported there.

## Symptoms

- Links in delivered mail show the original URL, even though Safe Links is switched on.
- A link on the exclusion list still gets rewritten.
- In Teams, a link opens a verification page, and an admin looks for a domain-level bypass.

## Step 1: Is this link meant to be rewritten?

Microsoft Learn's [Safe Links overview](https://learn.microsoft.com/en-us/defender-office-365/safe-links-about) (updated October 2026) lists cases where you will not see a wrapped link:

- Mail-enabled public folders are not covered.
- URLs in rich text format (RTF or TNEF) messages are not protected.
- Only HTTP, HTTPS and FTP links are supported.
- S/MIME signed messages are ignored.
- URLs that point to SharePoint or OneDrive are no longer wrapped, although the Safe Links service still processes them. Learn says this does not lower protection.
- If another service wraps links before Defender for Office 365 sees them, Safe Links may not be able to process those links.
- In Teams and in Office apps, Safe Links checks links at click time and does not rewrite them.

The answers in the 2025 thread named most of these cases too.

## Step 2: Read the email settings in the policy

In the Defender portal, go to **Email & collaboration**, then **Policies & rules**, **Threat policies**, and **Safe Links**. Learn's [policy configuration page](https://learn.microsoft.com/en-us/defender-office-365/safe-links-policies-configure) lists these email settings:

- **On: Safe Links checks a list of known, malicious links when users click links in email. URLs are rewritten by default.** If this is off, there is no time-of-click protection for email.
- **Apply Safe Links to email messages sent within the organization.** If it is off, mail between internal senders and internal recipients is not covered.
- **Do not rewrite URLs, do checks via SafeLinks API only.** Learn says that when this is selected, no URL wrapping takes place, but URLs are still scanned before delivery. In supported versions of Outlook for Windows, Mac, iOS, Android and Outlook on the web, Safe Links is called through an API at click time for an extra scan.

The last setting is the one to look at first. An unwrapped link in such a policy is the expected result. It is also what one answer in the 2025 thread suggested checking, among others.

## Step 3: Find the policy that actually applies

A recipient is protected by the first policy that applies to them. Learn gives this order:

1. The Strict preset security policy, always first.
2. The Standard preset security policy.
3. Custom Safe Links policies, in priority order. A lower number is a higher priority, and 0 is the highest.
4. Built-in protection, which always has the lowest priority.

Learn adds that Built-in protection covers users who are not in the Standard or Strict presets or in custom policies. So a custom policy you edited may never apply to a user who is also in a preset.

To see the presets, open **Email & collaboration**, **Policies & rules**, **Threat policies**, then **Preset Security Policies**. In PowerShell, Learn names `Get-SafeLinksPolicy` and `Get-SafeLinksRule` for custom policies. For the presets in a Defender for Office 365 organization it names `Get-ATPBuiltInProtectionRule` and `Get-ATPProtectionPolicyRule` with the Standard or Strict rule name.

Also check how the policy is scoped. Under **Users**, **Groups** and **Domains**, Learn says groups must be distribution groups, mail-enabled security groups or Microsoft 365 groups. Dynamic distribution groups and dynamic-membership Entra groups are not supported. Leaving all three empty applies the policy to all recipients.

## Step 4: Wait long enough

Learn says to allow up to 6 hours for a new or updated Safe Links policy, and up to 24 hours when you change the Teams setting. A 2025 answer mentioned 48 hours. I would use Learn's number. If the test fails right after you saved the policy, wait and test again before you change more settings.

## Step 5: If an excluded URL is still rewritten

Learn says entries in the **Do not rewrite the following URLs** list are not scanned or wrapped during mail flow, but they might still be blocked at click time. Check these points:

- **Pattern.** Learn's examples show that `contoso.com` allows only `https://contoso.com`, not subdomains or paths. To cover a domain and everything under it, two entries are needed: `contoso.com/*` and `*.contoso.com/*`. Up to three wildcards are allowed per entry.
- **Which list.** Only one list is applied to a user who is in several active Safe Links policies. If the user falls under a higher-priority policy, your edit in a lower one has no effect.
- **Client.** Microsoft Teams and the Office web apps ignore the list, and users can be blocked there by Safe Links scanning.
- **Tenant Allow/Block List.** Learn states that URL allow entries there are not excluded from rewriting, so they are no substitute for the Do not rewrite list.
- **Wait time.** See Step 4.

In the July 2025 thread, the asker used a subdomain pattern with a trailing wildcard, still saw rewriting, and also added the domain to the Tenant Allow List. The thread did not find a cause. The answer that the asker accepted proposed S/MIME signing or encryption, and the asker was still checking it and a vendor portal option. Learn's S/MIME statement fits that idea, but the thread did not confirm that it solved the case. Neither of the two answers in that thread came from a named Microsoft source, so I did not use them as evidence.

## Step 6: Teams links and the verification page

Learn says that in Teams, Safe Links checks links at click time and does not rewrite them, and the Do not rewrite list does not apply there. On the pages I read, I found no setting that exempts single domains from Teams link checks. The only Teams option on the policy is the on/off switch, which Learn recommends keeping on. The April 2026 thread reached the same conclusion through an AI-generated answer that the asker accepted. The asker then asked a follow-up about a separate policy for specific users, and nobody answered it. Test any such policy on a pilot group first, and note that turning protection off for users removes it for all their Teams links.

## Step 7: Test the result

1. Send a test message from an external account to a mailbox that is in scope of the policy you changed.
2. Compare the link in the delivered mail with the link you sent.
3. Repeat in the clients your users use, because Learn describes different click-time behavior by client.
4. For an exclusion, test the exact URL form from the vendor, including subdomain and path.
5. Remember that wrapping happens per recipient, even when a message is forwarded or replied to.

## What stays open

- Why the excluded one-time URLs were rewritten in the July 2025 thread. No confirmed cause exists.
- Whether the Teams policy approach works for a user subset. No source I read says so.
- Learn does not give a maximum number of entries for the Do not rewrite list on the page I read, so check your own list size in the portal.

## Related

- [Safe Links](https://www.m365.fm/entity/safe-links/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Safe Attachments](https://www.m365.fm/entity/safe-attachments/)

## Sources

- [Microsoft Learn: Safe Links overview](https://learn.microsoft.com/en-us/defender-office-365/safe-links-about)
- [Microsoft Learn: Set up Safe Links policies](https://learn.microsoft.com/en-us/defender-office-365/safe-links-policies-configure)
- [Microsoft Learn: Preset security policies](https://learn.microsoft.com/en-us/defender-office-365/preset-security-policies)
- [Microsoft Q&A: Not able to get wrapped Safe Link after enabling Safe Attachments and Safe Links (2025)](https://learn.microsoft.com/en-us/answers/questions/5517709/i-am-not-able-to-get-wrapped-safelink-after-enable)
- [Microsoft Q&A: Safelinks, dynamic URLs and preventing rewriting (July 2025)](https://learn.microsoft.com/en-us/answers/questions/4375510/safelinks-dynamic-urls-and-preventing-rewriting)
- [Microsoft Q&A: How to add trusted domains (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5858977/how-to-add-trusted-domains)
