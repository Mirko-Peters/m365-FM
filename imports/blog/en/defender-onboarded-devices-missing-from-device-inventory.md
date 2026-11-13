---
title: "Defender for Endpoint: Onboarded Devices Missing From the Device Inventory"
summary: "Intune or the local script says the device is onboarded, but Assets > Devices stays empty? Check the sensor, then DNS, proxy and TLS inspection with the Client Analyzer, in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [microsoft-defender-for-endpoint, intune, endpoint-detection-and-response]
keypoints:
  - "Microsoft Learn says that a device missing from the device list one hour after onboarding points to an onboarding or connectivity problem."
  - "Check the sensor first: sc.exe query sense and the SENSE Operational log. Event IDs 5, 7 and 15 all say to check internet access."
  - "Run the Defender for Endpoint Client Analyzer. If one of the five connection methods returns 200 for a URL, the client can reach it."
  - "In one 2024 thread, a DNS filtering tool on the network blocked Microsoft endpoints. Changing the DNS on the client fixed it, as confirmed by the asker."
  - "Exclude *.endpoint.security.microsoft.com from TLS inspection. Use one onboarding method per device and do not rely on the local script in production."
faq:
  - q: "How long should I wait before I treat a missing device as a problem?"
    a: "Microsoft Learn says that if devices do not appear in the Devices list an hour after onboarding, you should suspect an onboarding or connectivity problem. The local script page says a device can take several minutes to appear. The device inventory page gives no fixed time for new devices. Wait at least an hour, then start the checks."
  - q: "Which URLs must the device reach?"
    a: "It depends on your connectivity type and region. Learn says streamlined connectivity, the default for new onboarding since May 8, 2024, needs *.endpoint.security.microsoft.com. Standard connectivity uses a longer URL list, and the URLs depend on the region in the onboarding package. Do not copy a list from a forum. Run the Client Analyzer, which tests the URLs for your package."
  - q: "Can I use the local script and an Intune policy on the same device?"
    a: "A community answer in a 2025 thread said Microsoft does not recommend mixing methods. That statement was not confirmed in the Microsoft Learn pages I checked, and the asker never confirmed a result. What Learn does say is that the local script is meant for 10 devices or fewer and for evaluation, and that you should not run onboarding and offboarding scripts on the same device at the same time. Pick one method per device."
  - q: "Does the sensor use my browser proxy settings?"
    a: "No. Learn says the sensor runs as LocalSystem and uses WinHTTP, which is independent of the WinINet proxy settings that browsers use. Configure the proxy with a Group Policy value for the sensor or with netsh winhttp, and test from the device."
---

You deployed the Defender for Endpoint onboarding package. Intune shows the device as compliant, or the local script finished without an error, or the onboarding value is present in the registry. Yet in the Microsoft Defender portal, **Assets** > **Devices** shows nothing for the machine, even after a day.

Two Microsoft Q&A threads describe this situation. In a September 2024 thread, test devices that were onboarded through Intune never showed up. In a September 2025 thread about Defender for Business, the asker had used both a local script and an Intune policy, the Intune connector looked healthy, and the `OnboardingInfo` value existed in the registry, but no devices appeared. Only the first thread ended with a result that the asker confirmed. This article uses both as scenario sources and builds the checklist from current Microsoft Learn pages. It is not an official Microsoft procedure.

## What the symptoms look like

- Intune shows the device, and sometimes shows it as compliant, but the Defender device inventory does not list it.
- The onboarding script ran, or the policy was assigned, but nothing new appears after an hour or more.
- The Intune connector for Defender for Endpoint looks healthy, so the problem is not the connector.

## Step 1: Wait, then look in the right place

Microsoft Learn says that if devices do not appear in the **Devices** list an hour after onboarding, you should suspect an onboarding or connectivity problem. So do not start before that.

In the Defender portal, open **Assets** > **Devices** (or `https://security.microsoft.com/machines`). Stay on the **All devices** tab and search by device name. Learn describes this inventory as the place for onboarded devices and for devices found by discovery.

## Step 2: Check that the sensor runs on the device

On the device, open an elevated Command Prompt:

```
sc.exe query sense
```

Learn uses this command on its server onboarding page to confirm that Defender for Endpoint is running. The state should be running.

Then open Event Viewer and go to **Applications and Services Logs** > **Microsoft** > **Windows** > **SENSE** > **Operational**. Filter the log for Critical, Warning and Error. Learn lists these events in its troubleshooting table:

| Event ID | What Learn says to do |
|---|---|
| 5 | Make sure the device has internet access |
| 6 | Run the onboarding script again |
| 7 | Make sure of internet access, then run the full onboarding again |
| 9 | If it happened during onboarding, reboot and run onboarding again |
| 15 | Make sure the device has internet access |

Three of the five point to connectivity. If you see those, continue with step 4. If the sensor is not running, see the Learn page on onboarding issues for the service start errors.

## Step 3: Check how the device was onboarded

If you used Intune, Learn lists two error codes in the troubleshooting page. `0x87D1FDE8` means remediation failed, for example because the Defender policy registry key is missing or the OMA DM client cannot write to it. `0x87D101A9` means an ACL permission failure, caused by an unsupported SKU or platform. Learn also describes cases where a device shows as non-compliant for a short time. One example is a device that is still finishing the out-of-box experience. Another is the SENSE service using delayed start, which Learn says should fix itself within 24 hours.

Learn also says not to deploy the onboarding and offboarding policies to the same device at the same time.

On the 2025 thread: the asker used a local script and an Intune policy together. A community comment in that thread said Microsoft does not recommend mixing methods and that the local script suits about 1 to 10 devices. Treat the first claim as reported in the thread, not confirmed in Microsoft Learn. The second claim is consistent with Learn: the local script page says the script is for evaluation on 10 devices or fewer, and that production should use Group Policy, Configuration Manager, Intune or the Defender deployment tool. The practical advice is simple. Choose one method per device, and do not use the local script as your rollout plan.

## Step 4: Test the connection with the Client Analyzer

Do not guess which URLs are blocked. Learn describes a tool for this, the Defender for Endpoint Client Analyzer (`MDEClientAnalyzer.zip`). The steps from the Learn page:

1. Extract the zip on the affected device.
2. Open an elevated Command Prompt.
3. Run the script from the extracted folder:

```
MDEClientAnalyzer.cmd
```

4. Open `MDEClientAnalyzerResult.txt` from the result folder.

For every URL, the tool tests five connection methods: default proxy, proxy auto discovery, proxy disabled, named proxy and command line proxy. According to Learn, if any one method returns **200**, the client can communicate with that URL by that method. If you see an HTTP error, look up the code and allow the required URLs.

Two cautions from the same page:

- If `TelemetryProxyServer` is set in the registry or Group Policy, Defender for Endpoint falls back to a direct connection when the proxy is unreachable. The results can then look healthy even though the proxy path is broken.
- The cloud connectivity checks do not work with the attack surface reduction rule that blocks process creations from PSExec and WMI commands. Learn says to disable that rule for the test or add an exclusion for the analyzer.

If the device is not yet onboarded, run the tool with the onboarding file, so that it uses the right region: `mdeclientanalyzer.cmd -o <path to onboarding cmd file>`. Learn gives this for streamlined connectivity.

## Step 5: Test name resolution

Learn says DNS resolution is always required, and that the devices must reach the consolidated domain `*.endpoint.security.microsoft.com`. In the 2025 thread, the asker planned to test with `Resolve-DnsName` for four names in an elevated PowerShell window:

```powershell
Resolve-DnsName endpoint.security.microsoft.com -Type A,AAAA
Resolve-DnsName eu.endpoint.security.microsoft.com -Type A,AAAA
Resolve-DnsName api.security.microsoft.com -Type A,AAAA
Resolve-DnsName eu.api.security.microsoft.com -Type A,AAAA
```

Use these as a quick test, not as a complete URL list. The names that matter for you depend on the region in your onboarding package. A name that does not resolve, or resolves to a block page, tells you that DNS is part of the problem.

## Step 6: Check DNS filtering

This is the cause that one thread confirmed. In the 2024 thread, the asker first received several suggestions: check the connector, the license and the firewall requirements. The asker then found that a DNS filtering tool on the lab network was filtering out certain Microsoft endpoints. After changing the DNS on the client network adapter to an external DNS server, all test devices joined. The asker confirmed this in a self-answer, and a Microsoft moderator reposted it as the accepted answer. A later user reported the same symptom with Defender for Business in 2025 and asked for details. No reply is shown.

Note what this fix is. It worked for a lab. Learn does not mention DNS filtering on the pages I read, so this is reported in a community thread, not confirmed in Microsoft Learn. In a production network, my suggestion is to keep your DNS filter and add the Defender domains to its allow list, instead of sending clients to a public DNS server. Check the effect with the Client Analyzer again.

## Step 7: Check the proxy and TLS inspection

If a proxy sits between the device and the internet:

- Learn says the sensor runs as `LocalSystem` and uses WinHTTP, which does not follow browser proxy settings. A system-wide setting is `netsh winhttp set proxy <host>:<port>`, and `netsh winhttp reset proxy` returns to a direct connection.
- You can also set `TelemetryProxyServer` for the sensor through Group Policy. Learn says not to deploy it through MDM, because the sensor reads it only from the Group Policy location.
- The proxy should not require authentication for these destinations, because the connections come from the operating system or Defender client services.

For TLS inspection, Learn is direct: exclude `*.endpoint.security.microsoft.com` from SSL/TLS inspection, HTTPS interception and man-in-the-middle proxying. With inspection on, the sensor might fail to reach the backend, which causes onboarding or connectivity failures. For standard connectivity, Learn adds that you should not exclude all of `*.blob.core.windows.net` from inspection. Exclude only the Defender blob URLs that its list names.

Streamlined connectivity has been the default for onboarding since May 8, 2024. Learn says the setting on the **Optional features** page only affects newly onboarded devices. Existing devices must be migrated.

## Step 8: Confirm the result

When the Client Analyzer shows 200 for the URLs and the SENSE log is quiet, give the device some time. Then search again in **Assets** > **Devices**. Open the device page and check that it is onboarded and that its sensor health state is **Active**. Learn also describes running a detection test to prove that data reaches the service end to end.

## Limits of this guide

- The 2024 DNS result comes from one lab network. It proves one cause, not all causes.
- The 2025 thread has no confirmed result. Do not treat any of its suggestions as proven.
- Learn does not give a fixed time for how long a new device needs to appear.
- If all checks pass and the device is still missing, collect the Client Analyzer output and open a support case.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Endpoint detection and response](https://www.m365.fm/entity/endpoint-detection-and-response/)

## Sources

- [Microsoft Learn: Troubleshoot Defender for Endpoint onboarding issues](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-onboarding)
- [Microsoft Learn: Verify client connectivity to Defender for Endpoint service URLs](https://learn.microsoft.com/en-us/defender-endpoint/verify-connectivity)
- [Microsoft Learn: Configure network connectivity to Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/configure-environment)
- [Microsoft Learn: Configure device proxy and internet connectivity settings](https://learn.microsoft.com/en-us/defender-endpoint/configure-proxy-internet)
- [Microsoft Learn: Onboard Windows devices with a local script](https://learn.microsoft.com/en-us/defender-endpoint/configure-endpoints-script)
- [Microsoft Learn: Onboard servers to Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/onboard-server)
- [Microsoft Learn: Explore devices in the device inventory](https://learn.microsoft.com/en-us/defender-endpoint/machines-view-overview)
- [Microsoft Q&A: Devices onboarded to Intune are not showing up in Microsoft Defender (September 2024)](https://learn.microsoft.com/en-us/answers/questions/2072325/devices-onboarded-to-intune-are-not-showing-up-in)
- [Microsoft Q&A: Microsoft Defender for Business not showing onboarded device via Intune/Script (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5561241/microsoft-defender-for-business-not-showing-onboar)
