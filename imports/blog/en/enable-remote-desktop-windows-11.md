---
title: "Enable Remote Desktop in Windows 11: Setup and Safe Access"
summary: "Enable Remote Desktop in Windows 11: which editions can host, the Settings steps, adding users, connecting from other devices and keeping RDP off the internet."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-app, windows-server]
keypoints:
  - "To enable Remote Desktop in Windows 11, go to Settings, System, Remote Desktop, turn it on and select Confirm. Note the PC name shown on that page."
  - "Only Windows Pro, Enterprise and Education can host incoming connections. Windows 11 Home can connect to other PCs but can't be the host."
  - "Administrators can always connect. Other accounts must be added to the Remote Desktop users list, and Microsoft recommends Network Level Authentication."
  - "To reach a PC from outside your network, Microsoft prefers a VPN over port forwarding, because port forwarding opens your PC to the internet."
  - "Windows App is Microsoft's client for Remote PC on Windows, macOS, iOS, Android and more. On Windows, Remote Desktop Services still uses the Remote Desktop app."
faq:
  - q: "Does Windows 11 Home support Remote Desktop?"
    a: "Only as a client. Microsoft says a Home PC can connect to other systems, but it can't host incoming Remote Desktop connections. The host must run Windows Pro, Enterprise or Education. On Home, you can still use the Remote Desktop Connection app or Windows App to reach a Pro PC, so a mixed household is fine."
  - q: "How do I enable Remote Desktop in Windows 11?"
    a: "On the PC you want to reach, open Start, Settings, System, Remote Desktop. Turn on Remote Desktop and select Confirm. Check under System, About that the edition is Windows 11 Pro or higher, and write down the PC name on the Remote Desktop page. You need that name to connect from the other device."
  - q: "Is it safe to expose Remote Desktop to the internet?"
    a: "Microsoft's guidance says port forwarding opens your PC to the internet and isn't recommended. It prefers a VPN, so your PC isn't exposed at all. If you must forward the port, use a strong password and limit the mapping to known source IP addresses. Enable Remote Desktop only on trusted networks and for accounts that need it."
---
To enable Remote Desktop in Windows 11, open **Settings**, go to **System**, then **Remote Desktop**, turn the switch on and select **Confirm**. Write down the PC name on that page, because you need it to connect. The PC must run Windows 11 Pro, Enterprise or Education, as Windows Home can't host incoming connections. This article is for IT admins and power users who want to reach a Windows 11 PC from another device. It covers the editions, the setup, who is allowed in, how to connect from Windows, Mac and phones, and how to do it without exposing the PC to the internet.

## Check the edition first

This is the step that saves the most time. Microsoft's Learn article on [enabling Remote Desktop](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-access) says the PC that receives the connection can run Windows Professional, Enterprise or Education, and that Windows Home can't host incoming connections. A Home PC can still be the client that connects to other systems. Microsoft's support page on [how to use Remote Desktop](https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c) says the same about the client side: it can run any edition of Windows or another operating system.

To check the edition, go to **Start**, **Settings**, **System**, **About** and read the **Edition** line. If it says Home, the **Remote Desktop** switch won't do what you want. Your options are to upgrade the edition on that PC, or use another way to reach it. This article only covers the built-in feature.

## Turn on Remote Desktop

1. Sign in with an account that is a member of the Administrators group. Microsoft lists administrative privileges as a prerequisite.
2. Select **Start**, **Settings**, **System**, **Remote Desktop**.
3. Switch **Remote Desktop** to **On**.
4. Select **Confirm** in the pop-up.
5. Note the **PC name** shown on the page.

The page also has a checkbox that makes the PC discoverable on private networks so that a remote device can connect automatically. Microsoft says it's checked by default. The PC has to be powered on and connected to the network when you try to connect, so a laptop that has gone to sleep isn't reachable.

Enabling Remote Desktop opens a port on your PC, which makes it accessible to devices on your local network. Microsoft's advice is to enable it only on trusted networks, such as a home network, and to avoid devices that need strict access controls.

### The same thing from PowerShell

For a script or a PC you manage remotely, the setting is a registry value and a firewall rule. The following commands are standard Windows configuration and not taken from the Learn page, so test them on one PC before you roll them out. Run them in a session started as administrator:

1. `Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name 'fDenyTSConnections' -Value 0` allows connections.
2. `Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name 'UserAuthentication' -Value 1` requires Network Level Authentication.
3. `Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'` opens the built-in firewall rules.

Remote Desktop listens on TCP port 3389 by default, which Microsoft's outside-access article names as the typical port.

## Decide who may connect

Members of the Administrators group can connect remotely. Other users need to be added. Microsoft notes that the administrators and any users you add can connect, so every account involved needs a strong, unique password.

In Settings, on the same **Remote Desktop** page, use the entry to select the users that can remotely access this PC (the label differs by build), choose **Add**, type the user name and select **OK**. From the command line, `net localgroup "Remote Desktop Users" username /add` does the same for a local account.

Keep the list short. If someone doesn't need remote access, they shouldn't be on it.

### Network Level Authentication

Microsoft describes Network Level Authentication (NLA) as requiring users to authenticate before a session is established. That reduces the risk of unauthorized access and of malicious software. Microsoft recommends it for most environments. Older clients that don't support NLA may need it switched off temporarily, but keep it on whenever you can. You can also find the setting by running `SystemPropertiesRemote.exe`, which opens the Remote tab of System Properties.

## Connect from another device

On Windows, search for **Remote Desktop Connection** in the taskbar, open it, enter the PC name and select **Connect**. Sign in with your account on the remote PC.

On a Mac, an iPhone or an iPad, Microsoft's support page names the **Windows App**, which you install from the Microsoft Store or Apple App Store. Add the PC name, then select the PC. On Android, install the **Remote Desktop** app from Google Play.

The Learn overview of [Windows App](https://www.m365.fm/entity/windows-app/) describes it as Microsoft's client for connecting to Windows devices and apps. It covers Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services and Remote PC, which is a physical PC you connect to remotely, on Windows, macOS, iOS and iPadOS, Android and ChromeOS, and more. Two details matter to admins. Remote PC connections on supported platforms work without signing in, but the other services need a work or school account, and personal Microsoft accounts aren't supported. And Windows App doesn't support Remote Desktop Services on Windows. For that, Microsoft says to keep using the Remote Desktop app on Windows. If your organization runs session hosts on [Windows Server](https://www.m365.fm/entity/windows-server/), that detail decides which client you roll out.

## Connect from outside your network

Remote Desktop connections are peer-to-peer, so your client needs direct network access to the PC. At home or in an office that's fine. From outside, Microsoft's article on [accessing your PC from outside your network](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-outside-access) names two methods.

**A VPN** is the one Microsoft prefers. When you're connected, the Remote Desktop client behaves as if it were on the same network, and your PC is never exposed to the public internet. The article doesn't recommend a specific VPN service.

**Port forwarding** maps a port on your router's public IP address to the PC's internal address, usually port 3389. The steps depend on the router. Microsoft warns that this opens your PC up to the internet, which isn't recommended. If you do it anyway, set a strong password on the PC, and restrict the mapping to known source addresses where the router allows it, for example your office network. Give the PC a static internal IP address so that the forwarding rule keeps pointing at it, and consider dynamic DNS if your ISP changes your public address. If you change the port, the router mapping has to match what the PC listens on.

For anything beyond a few PCs, Microsoft's page also points to Remote Desktop Gateway, though that article doesn't cover it.

## If the connection fails

Microsoft's article lists the prerequisites for a working connection, and they double as a checklist when something doesn't work.

1. The remote PC is powered on and connected to the network. If it's asleep or off, nothing else matters.
2. You have network access to the PC, either locally or through the internet.
3. The user account is permitted to connect: it's an administrator or on the Remote Desktop users list.
4. Remote Desktop connections are allowed through the firewall.
5. The PC name or address you entered is right.

For the last point, you can look up the internal IPv4 address of the PC. Microsoft's outside-access article says to go to **Settings**, **Network & Internet**, **Status**, **View your network properties**, and to read the IPv4 address of the network configuration whose status is Operational. Try that address in place of the PC name. If it works, the problem is name resolution, not Remote Desktop.

Also check which network profile the PC is on. Microsoft's guidance is to use the feature on trusted networks such as a home network, and the discoverability checkbox mentioned above applies to private networks. If a laptop moved from the office to a different network, check that the network is one you meant to allow.

When you no longer need remote access, turn the **Remote Desktop** switch off again on the same Settings page. A feature that is off can't be attacked, and enabling it later takes ten seconds.

## Common mistakes

- Trying to enable hosting on Windows 11 Home. Check the edition first.
- Forgetting that the PC must be on and connected. A sleeping laptop can't accept a connection.
- Forwarding port 3389 straight to the internet. Use a VPN.
- Adding every user in the department to the access list. Add only those who need it.
- Switching off Network Level Authentication to fix a client problem and leaving it off.
- Not writing down the PC name, then guessing it from the other device.

## Related topics to explore

- Why does it say my account is not authorized? The account must be an administrator or on the Remote Desktop users list.
- What if Home is all I have? Use the Home PC as the client. The host needs Pro, Enterprise or Education.
- How do I connect from a phone or tablet? The Windows App on iOS and iPadOS, or the Remote Desktop app on Android.
- How do I give remote access to many users? That is a Remote Desktop Services or Windows 365 question, and Windows App is the client for the cloud services.

## Next step

Check the edition, switch the feature on, add only the accounts that need it, and connect once from inside your network before you think about the internet. If you need access from outside, start with a VPN. That is the safest way to enable Remote Desktop in Windows 11 without handing the world a port to try.
