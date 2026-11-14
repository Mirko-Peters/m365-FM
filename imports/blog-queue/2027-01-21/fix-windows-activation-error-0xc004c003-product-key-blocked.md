---
title: "Fix Windows Activation Error 0xC004C003: The Specified Product Key Is Blocked"
summary: "Error 0xC004C003 means the activation server blocked the MAK on the client. Causes and the two fixes from Microsoft Learn: install a new MAK with slmgr, or switch an Azure VM to Azure KMS activation, with the exact commands."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [windows-server, azure-virtual-machines]
keypoints:
  - "Learn says the MAK configured on the client is blocked on the activation server, and the steps apply to physical computers, on-premises VMs and Azure VMs."
  - "Documented causes: key reported as stolen or misused, expired trial or evaluation key, key does not match the edition, or an on-premises key migrated to Azure."
  - "Fix 1: get a new MAK from the Microsoft Licensing Activation Centers, install it with slmgr /ipk, then activate with slmgr.vbs /ato."
  - "Fix 2 for Azure VMs: set the KMS client setup key for your Windows version and point the VM to azkms.core.windows.net:1688."
  - "If activation still fails with the same error, Learn says to contact Microsoft Support."
faq:
  - q: "What does error 0xC004C003 mean?"
    a: "Microsoft Learn describes it as the activation server determining that the specified product key is blocked. It may appear when you use a Multiple Activation Key (MAK) to activate Windows. The message is shown in Windows Script Host when you try to activate."
  - q: "Why would a product key be blocked?"
    a: "Learn lists four situations: the key is reported as stolen or misused, the key is a trial or evaluation key that expires, the key does not match the installed Windows edition, or the client was an on-premises physical computer or VM that was migrated to Azure, because the original key is not valid for Azure."
  - q: "How do I install a new MAK?"
    a: "Contact the Microsoft Licensing Activation Centers for a new MAK. Then, in an administrative Command Prompt on the client, run slmgr -/ipk with the key, and try again to activate with cscript c:\\windows\\system32\\slmgr.vbs /ato. If activation fails, an Azure VM goes to the Azure KMS step, and other systems contact Microsoft Support."
  - q: "How do I fix this on an Azure VM?"
    a: "Learn says Azure VMs should use Azure KMS activation by default. If the VM uses a MAK, set the KMS client setup key for the Windows version with slmgr.vbs /ipk, run slmgr.vbs /skms azkms.core.windows.net:1688 and then slmgr.vbs /ato. Learn gives WX4NM-KYWYW-QJJR4-XV3QB-6VM33 as the example key for Windows Server 2022 Datacenter."
  - q: "Where can I read more on Azure activation problems?"
    a: "The Learn page links to articles on troubleshooting tools for Windows activation on Azure VMs, Azure Windows VM activation problems, DNS-related activation issues, name resolution in Azure virtual networks and the Azure IP address 168.63.129.16."
---

Error 0xC004C003 means the activation server determined that the product key is blocked. Microsoft Learn ties it to a Multiple Activation Key (MAK) that is blocked on the activation server. The fix is either a new MAK, or, for an Azure VM, a switch to Azure Key Management Service (KMS) activation. The steps cover physical computers, on-premises virtual machines and Azure VMs.

## What you see

When you try to activate Windows, Windows Script Host shows:

`Error: 0xC004C003 The activation server determined the specified product key is blocked.`

## Why the key is blocked

The MAK configured on the client is blocked on the activation server. Learn lists these situations:

- The product key is reported as stolen or misused.
- The product key is a trial or evaluation key that expires.
- The product key does not match the installed Windows edition.
- The client was originally an on-premises physical computer or VM and was migrated to Azure. The original product key is not valid for Azure.

The last cause matters for lift-and-shift projects. A VM that came from on-premises with a MAK can show this error after the move.

## Before you start

Learn recommends being familiar with the `slmgr` script. For Azure VM activation problems, it points to a separate article on troubleshooting tools for Windows activation on Azure virtual machines.

## Step 1: Get and install a new MAK

If your licensing model requires MAK activation:

1. Contact the Microsoft Licensing Activation Centers to obtain a new MAK.
2. On the client, open an administrative Command Prompt and install the key:

   ```cmd
   slmgr -/ipk <xxxxx-xxxxx-xxxxx-xxxxx-xxxxx>
   ```

   The placeholder stands for your MAK.
3. Try to activate again:

   ```cmd
   cscript c:\windows\system32\slmgr.vbs /ato
   ```
4. If activation fails, an Azure VM continues with step 2. For other computers, Learn says to contact Microsoft Support.

The command in the Learn text is written `slmgr -/ipk`. Learn's other commands use the form `slmgr.vbs /ipk`, so if the first form is rejected on your system, the `cscript ... slmgr.vbs /ipk` form from step 2 is the same operation. That is my observation about the notation, not a Microsoft statement.

## Step 2 (Azure VMs): Use Azure KMS

By default, Azure VMs should use Azure KMS activation. If the VM uses a MAK instead, reconfigure it:

1. Open an administrative Command Prompt on the Azure VM.
2. Set the KMS client setup key for your Windows version. Learn's example for Windows Server 2022 Datacenter:

   ```cmd
   cscript c:\windows\system32\slmgr.vbs /ipk WX4NM-KYWYW-QJJR4-XV3QB-6VM33
   ```

   Learn links a page that lists the KMS client activation keys for other versions.
3. Point the VM to Azure KMS:

   ```cmd
   cscript c:\windows\system32\slmgr.vbs /skms azkms.core.windows.net:1688
   ```
4. Try again:

   ```cmd
   cscript c:\windows\system32\slmgr.vbs /ato
   ```

If activation fails with the same error, contact Microsoft Support.

## Which cause fits which fix

| Cause | Direction in Learn |
| --- | --- |
| MAK blocked as stolen or misused | New MAK from the Licensing Activation Centers |
| Evaluation key expired | New MAK, if your licensing needs a MAK |
| Key does not match the edition | New MAK, as the page lists this as a cause. The page gives no separate edition procedure |
| Azure VM with an on-premises key | Azure KMS configuration in step 2 |

The mapping of causes to fixes is my reading. Learn gives one resolution path for all causes: step 1, and step 2 for Azure VMs.

## Related Learn pages for Azure activation

The References section of the page points to related reading:

- Troubleshoot Windows activation error codes.
- DNS troubleshooting guidance and guidelines for DNS-related activation issues.
- Troubleshoot Azure Windows virtual machine activation problems, and the troubleshooting tools for Windows activation on Azure VMs.
- Configuring DNS name resolution for Azure virtual networks, and the overview of the Azure IP address 168.63.129.16.

The last items suggest that activation in Azure also depends on DNS and network access to well-known addresses. The page does not describe those checks in detail, so I leave them to those articles.

## A short checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Check whether the machine is in Azure. If yes, go straight to Azure KMS.
2. Check the edition against the key you installed. A mismatch is a documented cause.
3. Confirm the key type with your licensing contact before you request a new one.
4. Run the activation command from an elevated prompt and record the full error text for support.

## Related

- [Windows Server](https://www.m365.fm/entity/windows-server/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Error 0xC004C003 "the specified product key is blocked" when activating Windows (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-server/licensing-and-activation/activation-error-0xc004c003-product-key-blocked)
