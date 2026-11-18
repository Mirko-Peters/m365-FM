---
title: "How to build and test App Masking rules with the Rules Editor"
summary: "On one reference machine with FSLogix Apps and the Rules Editor, scan the app to create a Rule Set, test it with Apply Rules to System, add a group assignment and copy the .fxr and .fxa files to each session host."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-app-masking, fslogix]
keypoints:
  - "The Rules Editor installs from FSLogixAppsRuleEditorSetup.exe in the x64 > Release folder. Open it as Administrator to test, then File > New, name the Rule Set, pick the program and Scan."
  - "Apply Rules to System turns the rules on immediately on the build machine, and selecting it again turns them off. Learn calls this one way to validate the rules."
  - "Manage Assignments controls who is affected. A new rule has Everyone with Applies set to No; the tutorial adds a group, such as Domain Users, with Applies set to Yes."
  - "Deploy both files, the .fxr rule file and the .fxa assignment file, to C:\\Program Files\\FSLogix\\Apps\\Rules on each session host. The FSLogix Apps Services use them immediately."
  - "Assignments do not support Entra ID cloud-only accounts. Test Rule Sets before production, because hiding rules manipulate the file system at a fundamental level."
faq:
  - q: "Do I need to restart the session host after copying the rule files?"
    a: "The tutorial does not mention a restart. It says the FSLogix Apps Services use the .fxr and .fxa files immediately after they are copied to C:\\Program Files\\FSLogix\\Apps\\Rules. Verify with a test user anyway, because Learn also tells you to test and validate Rule Sets before production."
  - q: "Do I need to run the Rules Editor as Administrator?"
    a: "Learn's tutorial advises opening the FSLogix Rules Editor as Administrator if you plan to test the Rule Set. It gives no reason and does not describe what happens without administrator rights. Our reading: the test applies the rules to the machine you are working on, so elevated rights are plausible, but check the tutorial's tip first if the test does not work."
  - q: "Where do I change which users a rule applies to?"
    a: "In the Rules Editor, select the Rule Set in the left pane and choose Manage Assignments on the action bar. Add a group, user or other assignment and set whether it applies. Learn says the assignments are processed from top to bottom and reordered with Move Up and Move Down."
---

To build an App Masking rule, install the FSLogix Rules Editor, create a Rule Set from an installed application with **Scan**, test it with **Apply Rules to System**, assign it to a group, and copy the resulting `.fxr` and `.fxa` files to `C:\Program Files\FSLogix\Apps\Rules` on each session host that should apply the rule. This guide follows Microsoft Learn's tutorial, uses Google Chrome as Learn does, and adds a test plan. For the concepts behind rules and assignments, read the article "FSLogix App Masking: showing the right apps to the right users" first; this one covers the procedure only. The entity page for [FSLogix App Masking](https://www.m365.fm/entity/fslogix-app-masking/) has the summary.

## Before you start

- **One reference machine** with FSLogix Apps, the Rules Editor and the application you want to hide. Learn's tutorial lists FSLogix Apps (core product), the FSLogix Apps Rule Editor and Google Chrome as prerequisites, scans "the system" and tests on the system where the rules were created. Our reading: the editor, FSLogix Apps and the application therefore belong on the same machine. Your session hosts also need FSLogix Apps, because the FSLogix Apps Services (`frxsvc`) process the Rule Set files.
- **The Rules Editor.** In the downloaded FSLogix zip, open `x64 (64-bit)` > `Release` and run `FSLogixAppsRuleEditorSetup.exe`. Accept the licensing terms and select **Install**. Learn describes the editor as intended for administrator workstations and does not recommend an alternate install location. The installer accepts the same switches as the other FSLogix installers, for example `/quiet` and `/norestart`.
- **Directory-synced identities.** Assignments don't support Microsoft Entra ID cloud-only accounts; the concepts article explains the limit.

## Step 1: Create the Rule Set

1. Open the **FSLogix Rules Editor**. If you plan to test, open it as Administrator.
2. Select **File** > **New**.
3. Enter a name, for example `Google_Chrome`, and select **Enter file name**. The rule wizard opens.
4. Select **Choose from installed programs**, pick the application and select **Scan**.
5. Learn says the scan covers all relevant items for the application and adds them as hiding rules. When it completes, the button changes; select **OK**.
6. The Rules Editor now lists every item that will be hidden. It saves the Rule Set file automatically once rules are added.

### Scope of this guide

This guide covers the scan-based path only, because Learn's tutorial does not describe editing single rules. Rule types and what they do are covered in the companion article. Learn advises keeping a Rule Set to one type of customization in most cases.

## Step 2: Test the rules on the build machine

Learn calls testing on the system where the rules were created one way to validate that the rules work as intended, and points to its concepts page for an in-depth guide.

1. Select the Rule Set in the left pane.
2. On the action bar, select **Apply Rules to System**.
3. The rules take effect immediately. The application should no longer be visible or open.
4. Select **Apply Rules to System** again to turn the rules off. The application should reappear and open.

## Step 3: Create the assignment

Assignments say how and to whom the rules apply.

1. With the Rule Set selected, choose **Manage Assignments** on the action bar.
2. Select **Add**, then **Group**.
3. In the **Select Group** dialog, select the person icon next to the Group box, type the group name and select **OK**.
4. Check the Assignments window. A new rule starts with **Everyone** and **Applies** set to **No**. In Learn's example, adding Domain Users produces `CONTOSO\Domain Users` with **Applies** set to **Yes**, and the tutorial describes the goal as hiding Chrome for specific users.
5. Select **OK**.

Learn processes the assignment list from top to bottom and orders it with **Move Up** and **Move Down**. Its two figures show that Everyone at the top with Domain Users set to apply leaves the Rule Set applying to Domain Users only, while Everyone at the bottom leaves it applying to nobody. Our example: to hide an application from a group named `Sales-Interns`, add that group with **Applies** set to **Yes** below the Everyone entry, which stays at **No**. Learn does not explain the logic further, so test the order you end up with, using one member and one non-member of the group.

Other assignment types and **Save as Template** are covered in the companion article.

## Step 4: Deploy to the session hosts

The Rule Set is saved as two files: the assignment file `.fxa` and the rule file `.fxr`. Copy both to:

`C:\Program Files\FSLogix\Apps\Rules`

Learn says to copy the files "to the virtual machine" and that the FSLogix Apps Services use them immediately. Our reading: every session host that should apply the rule needs its own copy of both files, and Learn does not describe how to distribute them. For [pooled host pools](https://www.m365.fm/entity/avd-pooled-host-pool/) this means adding the two files to whatever process you already use to change hosts, so new hosts get them as well.

## Step 5: Test with real users

Treat the build-machine test as step one only. Learn says to test and validate Rule Sets before production because hiding and redirection rules manipulate the file system at a very fundamental level. A simple plan, which is our suggestion:

1. Copy the files to one non-production session host.
2. Sign in as a member of the assigned group and confirm the application is hidden everywhere users would look: Start menu, desktop, file explorer and the install folder.
3. Sign in as a user outside the group and confirm the application still works.
4. Sign in as a user who is in two groups with different intent, and confirm the result matches your assignment order.
5. Roll the files out to a pilot pool, then to the rest.

Keep a copy of the previous `.fxr` and `.fxa` files before you overwrite them so you can restore the last working state.

## What to check if the rules do not behave as expected

Learn has no troubleshooting section for this tutorial, so the table below combines Learn's statements with our reading, marked as such.

| Symptom | Check |
|---|---|
| Rules do nothing for a user | Whether the account is Entra ID cloud-only (assignments don't support it), whether the VM can reach a domain controller to resolve SIDs, and the assignment order |
| Rule Set applies to nobody | Our reading of Learn's second figure: Everyone placed at the bottom of the list. Check the order |
| Apply Rules to System has no effect | Whether the Rule Set is selected in the left pane; Learn's tutorial also advises opening the Rules Editor as Administrator for testing |
| Files copied but no effect | The folder `C:\Program Files\FSLogix\Apps\Rules`, both files present, and (our reading) FSLogix Apps installed on that host |
| Update to the application | Our reading: a new version may install to different paths, so re-scan and test the rule |

## If you manage hosts with Nerdio Manager

Nerdio's help says App Masking is currently not supported in AAD joined host pool scenarios (Nerdio's wording; Microsoft now calls this Microsoft Entra joined). This is separate from Learn's limit on cloud-only accounts. Otherwise, the help describes a console workflow under the host pool's action menu, **Applications** > **Installed apps**, where you add a rule set and apply it to the session hosts. It does not mention the Rules Editor. Our reading: you do not build or copy `.fxr` and `.fxa` files yourself there, so this guide applies to hosts you manage by hand. Two points matter in the user fields. With **Apply to all users** on (the default), the applications are available only to the users listed under **Exclude users and groups**, and hidden for everyone else. With it off, the applications are available to all users, and the users and groups you list under **Apply only the following users and groups** are the ones whose access is restricted. Nerdio also says only rule sets that are enabled are applied to hosts. The full walk-through is in the companion article. See [Nerdio](https://www.m365.fm/entity/nerdio/) for the platform.

## A short checklist

1. On one reference machine, install FSLogix Apps, the Rules Editor and the target application.
2. Create the Rule Set with **File** > **New**, **Choose from installed programs**, **Scan**.
3. Review the rule list, then test with **Apply Rules to System** on and off.
4. Add the group in **Manage Assignments** and confirm the **Applies** values and order.
5. Copy `.fxr` and `.fxa` to the rules folder of a test host and verify with member and non-member accounts.
6. Roll out. Our reading: repeat the scan after application updates.

## Sources

- [Microsoft Learn: Tutorial: Create and implement Rule Sets (Application Masking)](https://learn.microsoft.com/en-us/fslogix/tutorial-application-rule-sets)
- [Microsoft Learn: Rule Sets and the Rules Editor (concepts)](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-apps-rule-editor-rule-sets)
- [Microsoft Learn: Install FSLogix](https://learn.microsoft.com/en-us/fslogix/how-to-install-fslogix)
- [Nerdio: Manage installed applications on host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/25499394422157-Manage-Installed-Applications-on-Host-Pools)
