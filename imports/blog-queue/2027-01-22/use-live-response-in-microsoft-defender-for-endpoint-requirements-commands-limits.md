---
title: "Use Live Response in Microsoft Defender for Endpoint: Requirements, Commands and Limits"
summary: "Live response gives analysts a remote shell on a device in Microsoft Defender for Endpoint. Supported systems, the settings and permissions to enable first, basic and advanced commands, library and script handling, and the documented session and size limits."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [microsoft-defender-for-endpoint, endpoint-detection-and-response]
keypoints:
  - "Live response is a remote shell session on a device for investigation and immediate response actions such as downloading files, running scripts and remediating entities."
  - "Turn it on in the Advanced features settings first. Only admins and users with Manage Portal Settings permissions can do that."
  - "Basic commands inspect the device. Advanced commands such as run, putfile, remediate and undo need a role that allows advanced live response."
  - "Scripts must be uploaded to the library before the run command can use them. Unsigned PowerShell scripts need an extra setting that raises exposure to threats."
  - "Documented limits include 50 sessions at a time, five concurrent sessions per user, one session per device and a 30 minute inactivity timeout."
faq:
  - q: "What is live response in Defender for Endpoint?"
    a: "According to Microsoft Learn, live response gives security operations teams instantaneous access to a device through a remote shell connection. Analysts use it to collect forensic data, run scripts, send suspicious entities for analysis, remediate threats and hunt for emerging threats."
  - q: "What do I have to enable before I can start a session?"
    a: "Enable the live response capability on the Advanced features settings page. Learn recommends enabling live response for servers there too. Unsigned script execution is optional and has its own setting. Only admins and users with Manage Portal Settings permissions can change these settings. The user who starts a session also needs a role that allows basic or advanced live response commands."
  - q: "How do I start a session?"
    a: "Sign in to the Microsoft Defender portal, go to Endpoints and Device inventory, select the device and choose Initiate live response session. Wait for the command console to connect. When you are done, select Disconnect session and confirm."
  - q: "Does pressing Ctrl+C stop a command on the device?"
    a: "No. Learn warns that Ctrl+C only cancels the command in the Microsoft Defender portal and does not stop it on the agent side. Operations that change things, such as remediate, may continue even if the command was canceled."
  - q: "Which limits apply?"
    a: "Learn lists 50 live response sessions at a time, a 30 minute inactive timeout, up to five concurrent sessions per user and one session at a time per device. Individual commands have a 10 minute limit, except getfile, findfile and run with 30 minutes. File limits are 3 GB for getfile, 30 GB for fileinfo and 250 MB for the library."
---

Live response is the remote shell of Microsoft Defender for Endpoint. Microsoft Learn describes it as giving security operations teams instantaneous access to a device, so they can investigate in depth and take immediate response actions to contain threats. This article covers what to enable, how to start a session, which commands exist, how the library and scripts work, and the limits listed on the page.

## What you can do in a session

Per the Learn page, analysts can:

- Run basic and advanced commands to investigate a device.
- Download files, such as malware samples and the output of PowerShell scripts, including in the background.
- Upload a PowerShell script or executable to the library and run it on a device from a tenant level.
- Take or undo remediation actions.

## Supported systems

The Learn page lists these operating systems and versions:

| Platform | Requirement from the page |
| --- | --- |
| Windows 11 | Supported |
| Windows 10 | Version 1909 or later. Versions 1903, 1809, 1803 and 1709 are listed with specific KB updates |
| macOS | Version 101.43.84 or later, Intel-based and ARM-based |
| Linux | Version 101.45.13 or later |
| Windows Server 2022 or later | Supported |
| Windows Server 2019 | Version 1903 or later, or version 1809 with a named update |
| Windows Server 2016 and 2012 R2 | Requires the Unified Agent. The page also recommends the EDR sensor update KB5005292 |
| Azure Stack HCI OS | Version 23H2 or later |

For the older server versions, the page adds that live response does not work as expected for offline down-level servers onboarded with the streamlined method if you use a static proxy. It suggests a system proxy instead. Check the page for the exact KB numbers on the older Windows 10 builds, since I list only the pattern here.

## Before the first session

1. **Enable live response** on the Advanced features settings page.
2. **Enable live response for servers** on the same page. Learn marks this as recommended.
3. **Optionally enable unsigned script execution.** Learn says signature verification applies only to PowerShell scripts, and warns that allowing unsigned scripts may increase your exposure to threats.
4. **Check permissions.** Only users with the appropriate permissions can start a session. Depending on the role, a user can run basic or advanced commands, and this is controlled by RBAC custom roles.

Only admins and users with Manage Portal Settings permissions can enable the first two settings. Uploading a file to the library from inside a session needs the Manage Security Settings permission. The button is greyed out for users with only delegated permissions. Uploading from the Library management page does not need that permission.

## Start and end a session

1. Sign in to the Microsoft Defender portal.
2. Go to **Endpoints** > **Device inventory** and select the device.
3. Select **Initiate live response session** and wait while the console connects.
4. Work with the built-in commands.
5. Select **Disconnect session**, then **Confirm**.

The session dashboard shows who created the session, when it started and how long it has run. It also offers disconnect, upload to library, the command console and the command log. Learn notes that live response actions started from the Device page are not available in the MachineActions API.

## Basic commands

Roles with the basic permission can run these. The page also marks which commands work on Windows, macOS and Linux.

- Navigation and help: `cd`, `cls`, `dir`, `help`, `connect`, `trace`
- Files: `fileinfo`, `findfile`, `getfile`
- Jobs: `jobs`, `fg`, `status`
- Inspection: `processes`, `connections`, `drivers`, `services`, `scheduledtasks`, `startupfolders`, `registry`, `persistence`

On the page, `connections`, `drivers`, `persistence`, `registry`, `scheduledtasks`, `services` and `startupfolders` are marked for Windows only. The page also notes that `fg` takes a command ID from `jobs`, not a process ID.

## Advanced commands

Roles with the advanced permission can also run:

| Command | What it does |
| --- | --- |
| `analyze` | Analyses an entity with incrimination engines to reach a verdict (Windows) |
| `run` | Runs a script from the library on the device |
| `library` | Lists files uploaded to the live response library |
| `putfile` | Puts a file from the library on the device. Files go to a working folder and are deleted at restart by default |
| `remediate` | Remediates an entity. File: delete. Process and service: stop and delete image file. Registry entry: delete. Scheduled task: remove. Startup folder item: delete file |
| `undo` | Restores an entity that was remediated (Windows) |
| `collect` | Collects a forensics package (macOS and Linux) |
| `scan` | Runs a quick antivirus scan (macOS and Linux) |
| `isolate`, `release` | Network isolation with continued service connectivity, and release from it (macOS) |

`remediate` has a prerequisite command. Add `-auto` and it runs that prerequisite for you, for example `remediate file <file path> -auto`. For `putfile`, the page lists a file size limit of 300 MB on Windows and 10 MB on other platforms.

## Files, library and scripts

**Get a file.** Use `getfile <file_path>`. To keep working while it downloads, append `&`, or press Ctrl + Z during a download to move it to the background. Bring it back with `fg <command_id>`.

**Library.** The library stores scripts and other files that can be run in a session at the tenant level. PowerShell and Bash scripts can run, but only after you upload them. You can upload from the session console or from the Library management page. In the console, select **Upload file to library**, browse to the file, add a description, choose whether to overwrite a file with the same name, optionally add script parameter examples, and confirm. Use alphanumeric characters and the symbols `-`, `_` or `.` in file names.

**Run a script.** Upload it first, then use `run`. Unsigned PowerShell scripts need the unsigned script setting.

## Parameters and output

- `help <command name>` shows syntax and parameters.
- Parameters are positional by default. To skip ahead, name the parameter with a hyphen, for example `<command name> -param2_name param2`.
- Output can be switched with `-output json` or `-output table`. Table output shows fewer fields.
- Redirect to a file with `processes > output.txt`.
- The **Command log** tab lists each command with its ID, command line, duration and status.

## Limits from the page

- 50 live response sessions at a time.
- Inactive timeout of 30 minutes.
- Commands are limited to 10 minutes, except `getfile`, `findfile` and `run` at 30 minutes.
- A user can start up to five concurrent sessions.
- A device can be in only one session at a time.
- File sizes: `getfile` 3 GB, `fileinfo` 30 GB, `library` 250 MB. In US Government cloud environments the library limit is 5 MB by default, and a higher limit needs a support ticket.

Learn also notes that a large `getfile` can hit the command timeout on slow networks even when the file is within the size limit, and suggests splitting large files. Live response is a cloud-based interactive shell, so response time varies with network quality and system load.

## Working habits (my advice)

This is my suggestion, not Microsoft guidance:

1. Keep the advanced permission for a small group and review it with the role design.
2. Prefer signed scripts, and keep the unsigned script setting off unless you have a case for it.
3. Use `-output json` when you want to copy details into a case.
4. Before `remediate`, collect the file with `getfile` if your process requires evidence, and remember that Ctrl+C does not stop an agent-side action.
5. Keep a short list of approved library scripts with a description and a parameter example, so the next analyst knows what each does.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Endpoint detection and response (EDR)](https://www.m365.fm/entity/endpoint-detection-and-response/)

## Sources

- [Investigate entities on devices using live response in Microsoft Defender for Endpoint (Microsoft Learn)](https://learn.microsoft.com/defender-endpoint/live-response)
