---
title: "How to Set Up Entra Password Protection With a Custom Banned Password List"
summary: "Set up Microsoft Entra Password Protection with a custom banned password list: global vs custom list, steps and entry limits, matching and scoring rules, licensing, on-premises notes and caveats from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [entra-id, self-service-password-reset]
keypoints:
  - "Path: Entra ID > Authentication methods > Password protection. Set Enforce custom list to Yes and add one term per line. At least Authentication Policy Administrator is needed."
  - "The custom list holds up to 1,000 terms of 4 to 16 characters. Updates can take several hours to apply."
  - "Matching is case-insensitive, normalizes substitutions such as 0 to o and @ to a, uses an edit distance of one, and scores passwords. A password needs at least 5 points."
  - "The global banned list applies to all users and cannot be disabled or configured. The custom list needs Microsoft Entra ID P1 or P2."
  - "Block base terms, not variants. Entra validation and on-premises validation are not consistent, so check both."
faq:
  - q: "Where do I configure the custom list?"
    a: "Per the Learn tutorial, in the Microsoft Entra admin center browse to Entra ID > Authentication methods, then Password protection. Set Enforce custom list to Yes, add strings to Custom banned password list one per line and select Save. At least the Authentication Policy Administrator role is required."
  - q: "What are the limits?"
    a: "Up to 1,000 terms, each at least 4 and at most 16 characters according to the tutorial. The concept page says substring matching is enforced only for terms of at least four characters."
  - q: "Do I need to add every variant of a word?"
    a: "No. Learn says to block base terms, not variants. For Contoso, London and Widget, add those three terms and the algorithm handles variants such as Contoso!1 or LondonHQ."
  - q: "Which license is required?"
    a: "Cloud-only users need Microsoft Entra ID P1 or P2 for the custom list, while the global list works with Entra ID Free. For users synchronized from on-premises AD DS, both lists need Entra ID P1 or P2."
  - q: "How quickly do changes apply?"
    a: "The tutorial says updates can take several hours."
---

Turn on Enforce custom list in Authentication methods > Password protection, add your base terms one per line, and save. Entra then checks new passwords against the global list and your list together. This guide follows two Microsoft Learn pages: the concept article on banned passwords and the tutorial on configuring custom banned passwords.

## Global and custom lists

- **Global banned password list:** applied automatically to all users in a tenant. It cannot be disabled or configured. It is built from Microsoft Entra security telemetry, not external data, and Microsoft does not publish its contents. It is checked when users change or reset their own password through Microsoft Entra ID.
- **Custom banned password list:** organization-specific terms such as brand names, product names, locations, internal terms and abbreviations with company meaning. The entries are combined with the global list.

## Prerequisites for the tutorial

- A Microsoft Entra tenant with at least Microsoft Entra ID P1 or a trial.
- At least the **Authentication Policy Administrator** role.
- A non-administrator test user with a known password.
- To test in the web portal, the tenant must be configured for self-service password reset.

## Steps

1. Sign in to the Microsoft Entra admin center at `entra.microsoft.com`.
2. Browse to **Entra ID** > **Authentication methods**, then **Password protection**.
3. Set **Enforce custom list** to **Yes**.
4. Add strings to **Custom banned password list**, one per line.
5. Leave **Enable password protection on Windows Server Active Directory** at **No** unless you have deployed the on-premises agents.
6. Select **Save**.

The tutorial's cleanup is to set Enforce custom list to No and save.

## Entry format and limits

- One string per line, up to **1,000** terms.
- Case-insensitive.
- Common character substitutions are considered, for example o and 0 or a and @.
- Minimum length 4 characters, maximum 16 characters.
- The list is not meant for very large password lists.

Learn advises blocking base terms. For Contoso, London and Widget, add only those three.

## How passwords are evaluated

**Normalization.** Uppercase letters become lowercase, and common substitutions are applied.

| Original | Becomes |
| --- | --- |
| 0 | o |
| 1 | l |
| $ | s |
| @ | a |

**Matching.** Fuzzy matching uses an edit distance of one, so for the banned term abcdef the variants abcdeg, abcdefg and abcde match. Substring matching checks the user's first name, last name and tenant name. Tenant name matching does not run during AD DS domain controller validation.

**Scoring.** Each banned term found scores 1 point and each remaining character scores 1 point. The password must score at least 5 points.

Learn's examples with contoso on the custom list and blank on the global list:

- C0ntos0Blank12 normalizes to contosoblank12 and scores 4, so it is rejected.
- ContoS0Bl@nkf9! normalizes to contosoblankf9! and scores 5, so it is accepted.

A password with a banned term can still pass if its overall score is high enough.

## Licensing

| Users | Global list | Custom list |
| --- | --- | --- |
| Cloud-only | Entra ID Free | Entra ID P1 or P2 |
| Synchronized from on-premises AD DS | Entra ID P1 or P2 | Entra ID P1 or P2 |

## On-premises AD DS

Agents on on-premises servers extend Password Protection to AD DS so that password changes there meet the same policy. The setup is in separate Learn articles and not on these pages.

## Caveats from Learn

- Updates can take several hours.
- Microsoft Entra password validation and on-premises validation are not consistent. Make sure users meet each service's requirements when setting passwords or completing SSPR.
- The algorithm and the global list can change at any time. For on-premises DC agents, algorithm updates take effect after the agent software is upgraded.
- Microsoft recommends layering other protections, such as multifactor authentication.
- The global list is not based on third-party compromised password lists.

## What the pages do not say

Password length rules, the full list of substitutions beyond the four shown, the size of the global list, lockout behavior, whether existing passwords that match a banned entry are forced to change, whether removing an entry applies sooner than other updates, and automation options such as PowerShell or Graph. There is also no audit or enforced mode on the tutorial page.

## A practical list

The advice below is practical, not from Learn.

1. Start with your company name, product names and brand terms.
2. Add office locations and common internal abbreviations.
3. Keep entries short and base-form. Do not add variants.
4. Test with the test user and remember the delay of several hours.
5. Communicate the change to users to reduce helpdesk calls.

## Typical mistakes

- Adding long lists of variants. The algorithm already handles them.
- Using entries shorter than four characters.
- Expecting immediate effect.
- Forgetting the license for the custom list.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)
- [Password writeback](https://www.m365.fm/entity/password-writeback/)

## Sources

- [Eliminate bad passwords using Microsoft Entra Password Protection (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-password-ban-bad)
- [Tutorial: Configure custom banned passwords (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/tutorial-configure-custom-password-protection)
