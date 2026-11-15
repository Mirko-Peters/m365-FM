---
title: "Power Platform Solution Import Fails: Read the Import Log and Fix Missing Dependencies"
summary: "Troubleshoot a failed Power Platform solution import using Microsoft Learn: the import steps and prompts, how missing dependencies are reported, where to download the XML import log, the most common cause of failure, privileges, the 95 MB size limit and gateway connection notes."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [power-platform-solution, power-platform-alm]
keypoints:
  - "Learn says the most common cause of a failed import is that the solution did not contain some required components."
  - "After a failed import, select Download Log File on the Solutions page. The log is an XML file that can be opened in Excel. See history shows all solution operations."
  - "If dependencies are missing, the import lists them and may link to the Power Platform admin center to install an application update, after which you restart the import."
  - "The maximum solution file size is 95 MB, and creating components needs the create privilege. System Customizer lacks it on the Plug-In Assembly table by default."
  - "The page gives no fix per error message. It points to a separate article for the unmanaged active layer created after import."
faq:
  - q: "Where do I find the import errors?"
    a: "According to Microsoft Learn, a notification on the Solutions page shows captured errors or warnings, and Download Log File gives details as an XML file."
  - q: "What is the most common cause of import failure?"
    a: "Learn says the solution did not contain some required components."
  - q: "What happens when dependencies are missing?"
    a: "The import shows a list of the missing dependencies. If the required package version is available, a link opens the Power Platform admin center so you can install the application update, then you restart the import."
  - q: "Is there a size limit?"
    a: "Yes, the maximum solution file size is 95 MB."
  - q: "Why does a Plug-In Assembly fail to import for a System Customizer?"
    a: "Learn says System Customizer has create privilege on most commonly imported components but not on the Plug-In Assembly table by default, while System Administrator does."
---

A solution import fails when the target environment cannot satisfy what the solution needs. This guide follows the Microsoft Learn article on importing solutions, and focuses on reading the failure. Learn also advises importing only solutions from a trusted source.

## What the import does

Import a solution through **Solutions**, **Import solution**, then choose **This device** and a .zip or .cab file, or a **Pipeline** source. After **Next** you review the solution information. Under **Advanced settings**, plugin steps and flows are imported by default. Clear **Enable Plugin steps and flows included in the solution** if you do not want imported inactive plugin steps activated. If the solution has connection references you choose connections, and if it has environment variables you enter values. If dependencies are missing, a list appears before you select **Import**.

## Where to look when it fails

1. On the **Solutions** page, a notification shows the captured errors or warnings.
2. Select **Download Log File**. The log is an XML file. Learn says you can open it with Excel to view the contents.
3. For all solution operations, including imports, select **See history**.

Learn states that the most common cause of failure is a solution that did not contain some required components. The page gives no list of error messages and no per-error fixes. Its troubleshooting pointer is a link labelled Manage apps and solutions into the Power Apps troubleshooting documentation. The link target is named unmanaged-active-layer-created-after-solution-import.

## Missing dependencies

If the target environment lacks required dependencies, the import shows them in a list. If the required package version is available, a link goes to the Power Platform admin center, where you install the application update. After the update finishes, restart the solution import.

For a dependency that is another solution or component of your own, the solution concepts article explains the rules. You cannot install a dependent solution until its base solution is installed, and you cannot uninstall a base solution while a dependent solution is installed.

## Privileges and size

- You need the create privilege for each component being imported. System Customizer has it for most commonly imported components, not for the Plug-In Assembly table by default. System Administrator has it.
- The maximum solution file size is 95 MB.

## Managed and unmanaged behavior

A managed solution's component changes arrive in a published state. An unmanaged solution's changes arrive as drafts, so you must publish them. Importing an unmanaged solution overwrites existing customizations to the components in it, and Learn says this cannot be undone. Deleting an unmanaged solution removes only the solution container.

## Apps that use a gateway

If an app uses an on-premises data gateway ID, the gateway connection must be a shared connection. After importing, remove the connections and add them back with the correct gateway ID.

## A troubleshooting order

This section is a suggestion, not Microsoft guidance. First download the log and search for the component named in the first error. Next check whether the source solution was exported with its required components and whether connection references and environment variables have values in the target. Then check the importing user's security role against the create privilege note, and the file size against 95 MB.

## Related steps in the article

Learn points to source control and automation for imports. My inference: a repeatable import is easier to diagnose than a manual one. It also links separate articles on updating and exporting solutions, and on publishing changes. After a successful import, changes that need publishing must be published before they take effect.

When an import runs it works in the background and may take a few moments. The page states that flows are not deactivated when that option is cleared.

## What to record when asking for help

This section is a suggestion. Note the solution name and version, whether it is managed or unmanaged, the target environment, the first error from the downloaded XML log, and the missing component or dependency it names. Those four facts let another admin reproduce the failure quickly.

## Not covered

The import page does not explain update, upgrade and stage for upgrade (the concepts page only summarizes them), does not describe the log structure beyond XML, and gives no steps for pipelines, the API or the command line. It does not list the full set of required security roles.

## Related

- [Power Platform solutions](https://www.m365.fm/entity/power-platform-solution/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)

## Sources

- [Import solutions in Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/data-platform/import-update-export-solutions)
- [Solution concepts with Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm)
