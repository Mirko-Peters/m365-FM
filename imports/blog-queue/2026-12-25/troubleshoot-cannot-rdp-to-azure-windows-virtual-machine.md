---
title: "Cannot RDP to an Azure Windows VM: Step-by-Step Troubleshooting"
summary: "Fix Remote Desktop connection failures to an Azure Windows VM in the order Microsoft Learn lists: reset RDP configuration, check NSG rules, review boot diagnostics, reset credentials, restart, redeploy, check routing and firewalls."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [azure-virtual-machines, azure-bastion]
keypoints:
  - "Learn lists ten steps and recommends trying to connect again after each one. The first is Reset password with Mode set to Reset configuration only."
  - "Use IP flow verify in Network Watcher and the effective security rules to confirm an inbound Allow rule exists for RDP, default port 3389."
  - "Redeploy moves the VM to another host. Ephemeral disk data is lost and dynamic IP addresses are updated."
  - "If the Connect button is grayed out and you do not use ExpressRoute or Site-to-Site VPN, assign a public IP address."
  - "The page does not cover resizing, TermService, custom RDP ports, Network Level Authentication or Azure Bastion."
faq:
  - q: "What should I try first?"
    a: "According to Microsoft Learn, reset the RDP configuration. In the portal select the VM, go to Help, select Reset password, set Mode to Reset configuration only and select Update."
  - q: "How do I check whether a network security group blocks RDP?"
    a: "Learn says to use IP flow verify in Network Watcher and review effective security rules to confirm an inbound Allow rule exists for RDP, default port 3389, with the right priority."
  - q: "What does redeploy do?"
    a: "Learn says it moves the VM to another host. Ephemeral disk data is lost and dynamic IP addresses are updated."
  - q: "Why is the Connect button grayed out?"
    a: "Learn says that if you are not using ExpressRoute or Site-to-Site VPN, you need to assign a public IP address before RDP works."
  - q: "Does the page cover specific RDP error messages?"
    a: "It links to separate articles for errors such as no Remote Desktop License Servers available, and the Local Security Authority cannot be contacted. It does not explain their fixes."
---

When you cannot connect over Remote Desktop to an Azure Windows VM, work through Microsoft's steps in order and try to connect again after each one. This guide follows the Microsoft Learn troubleshooting page and keeps its order of steps.

## Steps in the order the page lists them

1. **Reset the RDP configuration.** Select the VM, scroll to **Help**, select **Reset password**, set **Mode** to **Reset configuration only** and select **Update**. This addresses disabled Remote Connections and Windows Firewall rules that block RDP.
2. **Verify network security group rules.** Use **IP flow verify** in Network Watcher to see whether a rule blocks traffic, and review effective security rules to confirm an inbound Allow rule for RDP exists, default port 3389, with the right priority.
3. **Review boot diagnostics.** Check the console log and screenshot. Not all VMs have boot diagnostics enabled, so this step may not apply.
4. **Reset the network interface.** The page links to a separate article.
5. **Check Resource Health.** Select the VM, go to **Help** and select **Resource health**. A healthy VM shows **Available**.
6. **Reset user credentials.** Under **Help**, select **Reset password**, keep **Mode** as **Reset password**, enter a username and new password and select **Update**. Change the password again after you sign in.
7. **Restart.** On the **Overview** tab, select **Restart**.
8. **Redeploy.** Under **Help**, select **Redeploy**, then **Redeploy** again. This moves the VM to another host. Ephemeral disk data is lost and dynamic IP addresses are updated.
9. **Verify routing.** Use Network Watcher **Next hop** and review the effective routes for the network interface.
10. **Check firewalls.** Confirm that on-premises or local firewalls allow outbound TCP 3389 traffic to Azure.

## What each group of steps targets

The page ties steps to causes only in a few places. Resetting the configuration targets disabled Remote Connections and blocking Windows Firewall rules. IP flow verify and effective security rules target a network security group that blocks RDP. Next hop and effective routes target routing, and the final step covers on-premises or local firewalls. After each step, the page says to try the connection again. My advice: keep a note of what you changed, especially before a redeploy, so you can tell which step fixed the problem.

## Placeholder names in the examples

The PowerShell examples use `myResourceGroup`, `myVM`, `myVMAccessExtension` and the location `WestUS`. The page says to install and configure the latest Azure PowerShell first, then replace the placeholders with your own values.

## Connect button grayed out

Learn says that if the **Connect** button is grayed out and you are not using ExpressRoute or Site-to-Site VPN, you need to assign a public IP address.

## Azure PowerShell equivalents

The page gives PowerShell for the same steps. It uses placeholder names, so replace them.

```powershell
# Reset RDP configuration
Set-AzVMAccessExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Location Westus -Name "myVMAccessExtension"

# Restart and redeploy
Restart-AzVM -ResourceGroup "myResourceGroup" -Name "myVM"
Set-AzVM -Redeploy -ResourceGroupName "myResourceGroup" -Name "myVM"
```

To check NSG rules, `Get-AzNetworkSecurityGroup` returns the rules. A valid rule shows TCP, destination port range 3389, access Allow and direction Inbound. The page notes that such a rule may not be created automatically with the VM. Credentials are reset by running `Set-AzVMAccessExtension` with `-UserName` and `-Password`.

## Specific error messages

The page links to separate articles for these errors:

- No Remote Desktop License Servers available
- Remote Desktop can't find the computer
- The Local Security Authority cannot be contacted
- Your credentials did not work
- This computer can't connect to the remote computer

For Microsoft Entra sign-in problems, it links to articles on missing Azure roles, unauthorized client, a required password change and a required MFA method.

## What the page does not cover

It does not list resizing as a step. It also does not discuss the Remote Desktop Services service, custom RDP ports, Network Level Authentication, Azure Bastion as an alternative or Network Watcher connection troubleshoot. It defers detailed causes to a separate RDP troubleshooting article.

## A safe order

This is a suggestion, not from the page. Start with steps that do not change the VM, such as NSG checks and Resource Health. Redeploy loses ephemeral disk data, so use it after the gentler steps.

## Related

- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)

## Sources

- [Cannot connect with RDP to a Windows VM in Azure (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/windows/troubleshoot-rdp-connection)
