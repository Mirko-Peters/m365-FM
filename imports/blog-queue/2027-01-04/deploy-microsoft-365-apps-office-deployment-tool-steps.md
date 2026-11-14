---
title: "How to Deploy Microsoft 365 Apps With the Office Deployment Tool"
summary: "Deploy Microsoft 365 Apps with the Office Deployment Tool: setup.exe modes, configuration.xml elements, the Office Customization Tool, download, install and update steps, and caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [microsoft-365-apps]
keypoints:
  - "The Office Deployment Tool is a command-line tool with setup.exe and a sample configuration.xml. It supports /download, /configure and /customize modes."
  - "Microsoft recommends the Office Customization Tool at config.office.com over hand-editing XML."
  - "Deployment is two steps: download with setup.exe /download, then install with setup.exe /configure. Success shows 'Products configured successfully.'"
  - "Local administrator permissions are needed for configure and customize modes. When running from a share, use full network paths."
  - "OneDrive installs with Microsoft 365 Apps by default. Use ExcludeApp with the ID OneDrive to prevent it."
faq:
  - q: "What does the Office Deployment Tool do?"
    a: "According to Microsoft Learn, it is a command-line tool to download and deploy Microsoft 365 Apps to client computers. It controls which products and languages are installed, how they are updated and whether users see the install experience."
  - q: "What are the setup.exe modes?"
    a: "Microsoft Learn lists /download to download products and languages, /configure to install, update or remove them, /customize to apply application preferences to existing installs, and /help."
  - q: "How do I run a silent install?"
    a: "Learn shows adding Display with Level set to None and AcceptEULA set to TRUE in the configuration file, then running setup.exe /configure with that file."
  - q: "Should I write configuration.xml by hand?"
    a: "Learn recommends the Office Customization Tool at config.office.com, a web interface for creating and modifying configuration files, which you can export and use with the tool."
  - q: "How do I stop OneDrive from installing?"
    a: "Learn says OneDrive installs automatically with Microsoft 365 Apps. Use an ExcludeApp element with the ID OneDrive to prevent it."
---

The Office Deployment Tool, or ODT, deploys Microsoft 365 Apps in two steps. You create a configuration file, run `setup.exe /download` to fetch the files, and then run `setup.exe /configure` to install them. This guide follows the Microsoft Learn overview of the tool. It covers the core flow and says where Learn sends you to other articles.

## What you get

The self-extracting download contains `setup.exe` and a sample `configuration.xml`. Learn says to get the tool from the Microsoft Download Center and to use the latest version. The tool controls which products and languages are installed, how they are updated and whether users see the install experience.

## Modes of setup.exe

| Mode | Purpose | Example |
| --- | --- | --- |
| `/download` | Download products and languages from the CDN or a local source | `setup.exe /download downloadconfig.xml` |
| `/configure` | Install, update or remove products and languages | `setup.exe /configure installconfig.xml` |
| `/customize` | Apply application preferences only to existing installs | `setup.exe /customize preferencesconfig.xml` |
| `/help` | Show command-line help | |

## Configuration file elements

Elements shown in the Learn article:

- **Add:** the install source and products. Attributes shown include `SourcePath` (for example `\\server\share`), `OfficeClientEdition` (bitness such as 32), `Version` and `DownloadPath`. `Version` is required when you use `DownloadPath`. `Channel` appears in an example, but the article does not define its values.
- **Product ID:** the product to install, for example `O365ProPlusRetail` for Microsoft 365 Apps for enterprise or `VisioProRetail`.
- **Language ID:** a language to include, for example `en-us`.
- **ExcludeApp ID:** excludes an app, for example `Publisher`, and can also remove one that was previously installed.
- **Remove:** removes a product language.
- **Display:** `Level="None"` hides the user interface and `AcceptEULA="TRUE"` accepts the license terms.
- **Updates:** `Enabled="TRUE"` with `UpdatePath` points clients to a local update source. By default clients update from the Office CDN.
- **AppSettings:** application preferences such as registry-based user entries.

## Use the Office Customization Tool

Learn recommends the Office Customization Tool at `https://config.office.com/` over hand-editing XML. It is a web interface for creating and modifying configuration files, including application preferences. You export the file and use it with the ODT.

## Deploy in three steps

1. **Download.** Create a configuration file with an `Add` element that has `SourcePath` and `OfficeClientEdition`, plus `Product` entries. Run `setup.exe /download <file>`. Check the output folder for an Office folder.
2. **Install.** Create a configuration file. Add `<Display Level="None" AcceptEULA="TRUE" />` for a silent install. Run `setup.exe /configure <file>`. Learn says success shows "Products configured successfully."
3. **Update.** Run configure mode again, or set `Updates` with an `UpdatePath` to use a local source. For Group Policy and other update methods, Learn points to its article on choosing how to manage updates.

## Application preferences with /customize

Customize mode ignores all other settings and applies only application preferences. Preferences apply to existing and future users on the device. If Office is running, the changes take effect at the next restart.

## Caveats from Learn

- **Admin rights.** You need local administrator permissions on the client. Configure and customize modes require them.
- **Network paths.** If you run from a share, pass the full network path to both `setup.exe` and the configuration file.
- **Bandwidth.** Download mode fetches only files missing from the target folder.
- **DownloadPath** requires a `Version` value as well.
- **OneDrive.** It installs automatically with Microsoft 365 Apps and individual apps such as Word, Excel, PowerPoint, Publisher, Visio and Skype. Use `<ExcludeApp ID="OneDrive" />` to prevent this.
- **Troubleshooting.** Check the log files in `%temp%`. If problems persist, update to the newest ODT.
- **Scope.** The article is for enterprise admins. Home users should follow a separate install guide.

## A repeatable pattern

1. Generate the configuration in the Office Customization Tool, choosing products, languages and update settings.
2. Run download mode once to a share.
3. Test configure mode on a pilot device with the full network path.
4. Roll out with your deployment tool, and keep the configuration file in version control.
5. Use the same file with a changed `Version` or `Updates` setting for later updates.

The pattern above is practical advice, not a Microsoft procedure.

## Typical mistakes

- Running configure without administrator rights.
- Using a relative path when running from a share.
- Setting `DownloadPath` without `Version`.
- Forgetting the OneDrive exclusion when you do not want it.
- Expecting the article to cover every update scenario. Learn says it does not.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Overview of the Office Deployment Tool (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/deploy/overview-office-deployment-tool)
