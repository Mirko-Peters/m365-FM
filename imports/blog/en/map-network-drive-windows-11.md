---
title: "Map Network Drive in Windows 11: File Explorer, net use and PowerShell"
summary: "How to map a network drive in Windows 11 with File Explorer, net use or PowerShell, keep it after sign-in, fix common errors and roll it out to many users."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-server]
keypoints:
  - "In File Explorer, select This PC, open the three-dot menu, choose Map network drive, pick a letter, enter the \\\\server\\share path and select Finish."
  - "Select Reconnect at sign-in so the drive comes back after every restart. On the command line the equivalent is /persistent:yes."
  - "net use is the quickest scripted method. Use an asterisk instead of typing a password into the command, so it isn't stored in your history."
  - "New-PSDrive with -Persist -Scope Global creates a drive that is visible in File Explorer. Without -Persist the drive exists only in that PowerShell session."
  - "In a domain, don't map by hand. Group Policy preferences can create, update or delete mapped drives for users without logon scripts."
faq:
  - q: "How do I map a network drive in Windows 11?"
    a: "Open File Explorer, select This PC, open the three-dot More menu and choose Map network drive. Pick a drive letter, type the path in the form \\\\server\\share in the Folder box, tick Reconnect at sign-in if you want it to survive restarts, and select Finish. If the option isn't in the menu, right-click This PC instead."
  - q: "How do I map a network drive with a command?"
    a: "Open Command Prompt or Windows Terminal and run net use Z: \\\\server\\share /persistent:yes. Replace Z: with a free letter. To use a different account, add /user:DOMAIN\\username and an asterisk, so Windows prompts for the password instead of storing it in your command history. net use alone lists your current connections."
  - q: "Why does my mapped drive disappear after a restart?"
    a: "The mapping was probably not saved as persistent. Map it again with Reconnect at sign-in ticked, or run net use with /persistent:yes. If the drive shows a red X after sign-in, the network may not have been ready or the saved credentials may be wrong. Open the drive again and enter the correct account."
---
To map a network drive in Windows 11, open File Explorer, select **This PC**, open the three-dot **More** menu and choose **Map network drive**. Pick a free drive letter, enter the path to the share, such as `\\server\share`, tick **Reconnect at sign-in** and select **Finish**. The share then shows up in This PC like a local disk. This article is for IT admins and power users who map drives for themselves or for others. It covers File Explorer, `net use`, PowerShell, the errors you will meet and the point where hand-mapping should give way to Group Policy.

## Map a network drive in File Explorer

Microsoft's page on [file sharing over a network in Windows](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/file-sharing-over-a-network-in-windows) lists the steps for Windows 11.

1. Open **File Explorer** from the taskbar or press the Windows logo key + E.
2. Select **This PC** in the left pane.
3. On the ribbon, select **More** (the three dots), then **Map network drive**. If the entry isn't on that menu, right-click **This PC** in the folder pane and choose it there.
4. Pick any available letter in the **Drive** list.
5. In the **Folder** box, type the path to the folder or computer, or use **Browse** to find it. Select **Reconnect at sign-in** if the drive should return after every sign-in.
6. Select **Finish**.

Two things to know. First, the path can point to a subfolder: `\\server\share\Invoices` works as well as the share root. That is handy when a team should land in its own project folder and not see the rest. Second, the Windows dialog also offers a way to connect with a different account. Microsoft's page doesn't cover that option, so look for it in the dialog on your build and read it before you confirm. Mapping with another account is what you need when the file server doesn't know your Windows sign-in.

If the share doesn't show up at all, the Microsoft article suggests the usual suspects for a home or small office network: update Windows on all PCs, keep them on the same router, set the Wi-Fi network to **Private**, and turn on **Network discovery** and **File and printer sharing** in the advanced sharing settings. It also says that if you can't connect to a drive or folder, the other computer may be off or you may lack permission, in which case you should ask your network administrator. The article additionally recommends turning off password-protected sharing for that home scenario. That removes a sign-in requirement, so weigh it against your own security needs before you copy that advice to an office network.

## Map a drive with net use

The command line is better when you map drives often, test a share quickly or write a logon script. Microsoft Learn documents [net use](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/gg651155(v=ws.11)), though the page sits in the archived part of the documentation.

The basic form assigns a drive letter to a share:

`net use Z: \\server\share`

Mapping into a folder under the share works the same way: `net use Z: \\server\share\Project`.

The parameters you will use most:

- `/user:DOMAIN\username` connects with a different account. If you leave out the domain, `net use` uses the current logged-on domain.
- An asterisk in place of the password makes Windows prompt for it, and the password isn't displayed as you type. Prefer that to writing a password into the command, where it stays in your history and in any script.
- `/persistent:yes` saves the connection and restores it at the next logon. `/persistent:no` doesn't save it. Microsoft notes that the default is the setting used last, so say it explicitly in scripts.
- `/savecred` stores the credentials you provide for reuse.
- `/delete` cancels a connection. With an asterisk instead of a drive letter, it cancels all network connections.

A complete example: `net use Z: \\server\share /user:CONTOSO\jdoe * /persistent:yes`. Windows then asks for the password.

Run `net use` without parameters to see all current connections, and `net use Z:` to see one. Microsoft also points out that you can't disconnect from a share you're currently using as your current drive or that an active process is using. If a disconnect fails, close the apps first and change out of that drive in your command window.

If the server name contains spaces, put quotation marks around it, from the double backslash to the end of the name.

## Map a drive with PowerShell

PowerShell has two routes. `New-PSDrive` is the one most admins know. According to Microsoft's [New-PSDrive documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-psdrive), `-Persist` creates a Windows mapped network drive that is saved in Windows and is not session-specific. A drive without `-Persist` is temporary: it exists only in that PowerShell session, and you can't see it in File Explorer or with `net use`.

A persistent drive has rules. The name must be a drive letter, the root must be a UNC path to a different computer, and the provider must be FileSystem. For a script, add `-Scope Global`. Otherwise the drive goes away when the script exits.

`New-PSDrive -Name S -PSProvider FileSystem -Root "\\Server01\Scripts" -Persist -Scope Global`

To use another account, add `-Credential` with the result of `Get-Credential`. The credential is used when the root is a UNC path. The documentation also warns that `Remove-PSDrive` on a mapped network drive permanently deletes the mapping from the computer.

The second route is the `New-SmbMapping` cmdlet from the SmbShare module: `New-SmbMapping -LocalPath "X:" -RemotePath "\\Server\Share"`. It has `-Persistent` and `-SaveCredentials` switches. Its `-Password` parameter is plain text, so for scripts use `-Credential` or one of the other options instead of putting a password into a file.

One more point from the PowerShell documentation: mapped drives are specific to a user account. Drives created in a session run as administrator or under another user's credentials aren't visible in sessions started with different credentials. If a script runs as administrator and the user sees nothing, this is why.

## Fix common mapping errors

Most failures fall into a few groups.

**The path is wrong.** A typo in the server name or share looks like a permission problem. Test with `\\server\share` in the File Explorer address bar first. If that opens, the mapping will too.

**Access denied.** Two permission layers apply on a Windows file server: the share permissions and the NTFS permissions on the folder. Check both. When you map a subfolder, your account needs access to that folder, not only to the share above it.

**Wrong or conflicting credentials.** In practice, Windows keeps one set of credentials per server per session (this comes from general Windows knowledge, not from the Microsoft pages linked here). If you connected to the server as one user and then try another account, you can get error 1219. Run `net use` to see what's connected, delete the old connection with `net use \\server\share /delete` or all of them with `net use * /delete`, then connect again with the right account. Microsoft's troubleshooting page only documents the `net use * /delete` part. Disconnecting all shares can interrupt open files, so close your apps first.

**The drive disappears after restart.** The mapping probably wasn't saved as persistent. Map it again with **Reconnect at sign-in** ticked or `/persistent:yes`. If the drive returns with a red X, Windows saved it but couldn't reach the server at sign-in. Open the drive, and it should reconnect when the network is up.

## Disconnect a mapped drive

In File Explorer, open **This PC**, right-click the mapped drive and select **Disconnect**. From the command line, run `net use Z: /delete`. Removing the mapping doesn't delete any files on the server, because it only removes the shortcut. Do tell the people who use it, especially if somebody has a file open.

## Re-map at sign-in with a script or a scheduled task

Not every PC is on a domain, and not every laptop is on the office network when its user signs in. For those cases a small script does the job. Put the mapping command in a `.ps1` or `.cmd` file and run it at sign-in.

Microsoft Learn shows the pattern for a logon task in the documentation of the `New-ScheduledTaskTrigger` cmdlet. The `-AtLogOn` switch starts the task when a user logs on, and the optional `-User` parameter limits it to one account. The cmdlet page doesn't give the accepted format of the user identifier, so test it in your own environment. The sequence looks like this:

1. Create the action: `$a = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-NoProfile -File "C:\Scripts\map.ps1"'`
2. Create the trigger: `$t = New-ScheduledTaskTrigger -AtLogOn -User "CONTOSO\jsmith"`
3. Register the task: `Register-ScheduledTask -TaskName "MapDrives" -Action $a -Trigger $t`

Omit `-User` and the task fires for any user who signs in. Registering a task for another user may need a session run as administrator.

Two cautions. Drives belong to the user session that created them, as the PowerShell documentation says, so the task has to run as the user who needs the drive and not as SYSTEM. And a script that runs before the network is ready fails quietly, so check that the drive is there after the first test sign-in instead of assuming it worked. On a domain, prefer the Group Policy approach below.

## Map drives for many users

Hand-mapping doesn't scale. On a domain, use [Group Policy preferences](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-preferences). Microsoft lists the Drive Maps extension as a way to create, modify or delete mapped drives and to configure the visibility of all drives, using the logged-on user's security context.

The Drive Map preference item supports four actions. Create makes a new mapping, Delete removes one, Replace deletes and recreates it, and Update changes only the settings you define. Update can't change the location, the reconnect setting or the credentials. Use Replace for those. The location is a UNC path such as `\\server\share`, and the **Reconnect** setting corresponds to a persistent mapping. You can also attach item-level targeting so a drive appears only for the users or groups that need it.

Two warnings from the same Microsoft pages. The Drive Map item can store a password for connecting as another account, but it's stored obfuscated in a file that all domain users can read, so don't use it for sensitive accounts. And preferences, unlike policy settings, are defaults that users can change and that return to your value at the next Group Policy refresh.

On the question of editions, Microsoft's Windows 11 comparison ties domain join and Group Policy to Windows 11 Pro paired with Windows Server, and it doesn't claim the same for Home. The File Explorer method above works the same on any edition as far as Microsoft's page shows, so a Home PC can still map a drive by hand, with a script or with Task Scheduler. For a fleet of managed machines that's not how you want to do it, though. Check how your environment applies [Windows Server](https://www.m365.fm/entity/windows-server/) policy to your Windows 11 clients and map once, centrally.

## Common mistakes

- Typing the password into the net use command. Use an asterisk so Windows asks for it.
- Using New-PSDrive without -Persist and wondering why File Explorer doesn't show the drive.
- Running a mapping script as administrator and expecting the signed-in user to see the drive.
- Mapping with another account while an old connection to the same server is still open. Delete the old one first.
- Using Update in a Group Policy preference to change the location. Use Replace.
- Mapping everyone to the share root when each team only needs its own folder.

## Related topics to explore

- How do I share a folder from my own PC? In File Explorer, right-click the folder, choose Show more options, Give access to, then Specific people. Microsoft documents this on the same page as mapping.
- How do I clear a drive that is stuck? Use `net use * /delete`, then map again.
- How do I automate mapping at sign-in? Group Policy preferences for domain users, or a logon script with `net use` for everyone else.
- What about SharePoint or OneDrive libraries? That is a separate topic, and this article only covers file shares reached by a UNC path.

## Next step

Open File Explorer and map one share with Reconnect at sign-in ticked, then check that `net use` lists it. Once that works for one person, write the same mapping down as a Group Policy preference so you never have to map a network drive in Windows 11 by hand for the next ten users.
