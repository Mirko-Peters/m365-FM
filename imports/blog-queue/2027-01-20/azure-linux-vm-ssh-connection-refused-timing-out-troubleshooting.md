---
title: "Azure Linux VM SSH Connection Refused or Timing Out: Troubleshooting Steps"
summary: "Step-by-step SSH troubleshooting for an Azure Linux VM, following Microsoft Learn: reset the SSH configuration and credentials, check NSG rules and roles, review resource health, then restart or redeploy, with portal and CLI commands."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [azure-virtual-machines, network-security-group]
keypoints:
  - "Learn's quick order: reset the SSH configuration, reset the user's credentials, check NSG rules and role assignment, check resource health, restart, then redeploy."
  - "Try to reconnect after each step. The portal, Serial Console, Run Command, Azure CLI and the VMAccess extension can all perform the resets."
  - "The NSG needs an inbound allow rule for SSH, by default TCP port 22. Port redirection or mapping needs an Azure load balancer."
  - "With Microsoft Entra login, the user needs the Virtual Machine Administrator Login or Virtual Machine User Login role, or sees Permission denied (publickey)."
  - "Redeploying moves the VM to another node. Ephemeral disk data is lost and dynamic IP addresses associated with the VM are updated."
faq:
  - q: "What is the first thing to try when SSH to an Azure Linux VM fails?"
    a: "Microsoft Learn lists quick steps in this order: reset the SSH configuration, reset the credentials for the user, verify the network security group rules and role assignment, check the VM resource health, restart the VM and redeploy the VM. It says to try reconnecting after each step."
  - q: "How do I reset the SSH configuration in the Azure portal?"
    a: "Select the VM, scroll to the Help section and select Reset password. In the Mode section select Reset configuration only and then Update. Learn says this does not change the user account name, password or SSH keys when done with the CLI equivalent, az vm user reset-ssh."
  - q: "What do I do if I cannot SSH at all?"
    a: "Learn says the Azure VM Serial Console works regardless of the SSH configuration and that cannot-SSH situations are what it was designed for. If you cannot use the Serial Console, for example when only SSH keys are used, the Run Command feature in the Azure portal can run the same commands non-interactively."
  - q: "Which role do I need for Microsoft Entra SSH logins?"
    a: "Per Learn, the user must be assigned Virtual Machine Administrator Login or Virtual Machine User Login on the resource group that contains the VM and its associated resources. Without it the error Permission denied (publickey) is returned."
  - q: "Does redeploying the VM lose data?"
    a: "Learn notes that after a redeploy finishes, ephemeral disk data is lost and dynamic IP addresses associated with the VM are updated. Redeploying moves the VM to another node within Azure, which may correct underlying networking issues."
---

When SSH to an Azure Linux VM is refused or times out, work through Microsoft's order: reset the SSH configuration, reset the user's credentials, check network security group rules and role assignments, check resource health, restart, and finally redeploy. Try to connect again after each step. The Azure portal, the Azure CLI, the VM Serial Console, Run Command and the VMAccess extension can all do the work.

## Quick order from Microsoft

Learn gives six quick steps:

1. Reset the SSH configuration.
2. Reset the credentials for the user.
3. Verify that network security group rules permit SSH traffic, and check role assignments.
4. Check the VM resource health.
5. Restart the VM.
6. Redeploy the VM.

Learn also suggests running VM assist for Linux or Windows first. These are script-based diagnostic tools that help identify common issues affecting the Azure VM Guest Agent and overall VM health.

## Step 1: Reset the SSH configuration

**Azure portal.** Select the VM, scroll to the **Help** section and select **Reset password**. In the **Mode** section choose `Reset configuration only` and then select **Update**.

**Azure CLI.** This resets the SSH configuration to defaults and restarts the SSH server on the VM. It does not change the user account name, password or SSH keys:

```
az vm user reset-ssh --resource-group myResourceGroup --name myVM
```

**VMAccess extension.** Create a `settings.json` file with `{ "reset_ssh": true }` and call the `VMAccessForLinux` extension with `az vm extension set`, publisher `Microsoft.OSTCExtensions`. Learn notes that you can reuse such json files across VMs.

## Step 2: Reset the credentials

In the same portal blade, choose `Reset SSH public key` or `Reset password` in **Mode**, enter the username and the key or new password, and select **Update**. You can also create a user with sudo privileges there.

With the CLI use `az vm user update` with `--password` for a password or `--ssh-key-value` for a key. Learn adds that if you uploaded a custom Linux disk image, the Azure Linux Agent version 2.0.5 or later must be installed. For gallery images the access extension is already installed.

## Step 3: Check security rules, routing and roles

- Ensure an NSG rule permits SSH traffic, by default TCP port 22. Learn says you cannot use port redirection or mapping without an Azure load balancer.
- Use **IP flow verify** in Network Watcher to confirm whether an NSG rule blocks traffic to or from the VM. You can also review effective security rules for an inbound Allow rule that has priority for the SSH port.
- Use Network Watcher **Next hop** or the effective routes of the network interface to confirm that a route does not prevent traffic.
- With Microsoft Entra ID managing SSH logins, the user must have the **Virtual Machine Administrator Login** or **Virtual Machine User Login** role on the resource group that contains the VM and its associated resources. Otherwise the error `Permission denied (publickey)` is returned.

## Step 4: Check health and boot diagnostics

Check the VM resource health and confirm that the VM reports as healthy. If boot diagnostics are enabled, verify that the logs show no boot errors.

## Step 5: Look inside the VM with Serial Console or Run Command

The Azure VM Serial Console gives an interactive text console that works regardless of SSH configuration. Learn says it was designed for cannot-SSH situations and points to its prerequisites. If you cannot use it, for example when only SSH keys are used for authentication, use **Run Command** in the portal. Commands run non-interactively and the output returns to the portal, and no `sudo` is needed in that context.

Useful checks from Learn:

```
sudo systemctl status sshd.service
sudo ss --listen --tcp --process --numeric | grep sshd
grep -i port /etc/ssh/sshd_config
```

The first shows whether the service is active and which port and addresses it listens on. The second shows listening sockets, and any output means SSH is running. Learn recommends `ss` because `netstat` is deprecated and not always available. The third shows a configured port. Lines starting with `#` are comments, and if nothing is returned the default applies: all IP addresses, port 22. If sshd listens on another port, your NSG rule and client command must use that port.

## Step 6: Restart and redeploy

**Restart:** select the VM and then **Restart**, or run `az vm restart`. This addresses underlying compute issues after the resets.

**Redeploy:** select the VM, go to **Help** and select **Redeploy**, or run `az vm redeploy`. Learn says it moves the VM to another node within Azure, which may correct underlying networking issues. After the operation, ephemeral disk data is lost and dynamic IP addresses associated with the VM are updated. Plan for that before you redeploy a VM that stores data on an ephemeral disk or that clients reach by a dynamic address.

## Which method fits which situation

| Situation | Method Learn describes |
| --- | --- |
| Quick reset, no tools installed | Azure portal, Reset password blade |
| Cannot SSH, need an interactive shell | Azure VM Serial Console |
| Serial Console not usable, key-only login | Run Command in the portal |
| Already on a command line | Azure CLI |
| Reusable definitions across VMs | VMAccessForLinux extension with json files |

## Reading the symptoms (my advice)

The following mapping is my experience-based suggestion, not Microsoft text:

- A timeout usually points to the network path: NSG, routing, wrong port or a stopped VM, so start with step 3.
- A refusal suggests nothing is listening on that port, so check the sshd service and port.
- Permission denied suggests credentials, keys or Entra roles.

## Related

- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Network security group (NSG)](https://www.m365.fm/entity/network-security-group/)

## Sources

- [Troubleshoot SSH connection issues to an Azure VM (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/linux/troubleshoot-ssh-connection)
