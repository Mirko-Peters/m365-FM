---
title: "GPU session hosts on Azure Virtual Desktop: when they pay off"
summary: "A GPU session host pays off when users run graphics-intensive applications or need higher frame rates, because remote sessions are rendered on the CPU by default. This guide covers the supported VM sizes, the licensing detail, the HEVC trade-offs and how to verify the GPU is actually used."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, gpu]
keypoints:
  - "By default, Azure Virtual Desktop remote sessions are rendered with the CPU and do not use an available GPU. GPU rendering and GPU frame encoding are switched on separately, with Intune or Group Policy."
  - "Learn lists four supported GPU-optimized sizes: NVv3, NVv4, NVadsA10 v5 and NCasT4_v3. NC, NCv2, NCv3, ND and NDv2 series are not generally appropriate as session hosts."
  - "NVadsA10 v5 offers fractional GPUs from 1/6 of an A10 (4 GiB frame buffer) up to two GPUs, and NVIDIA sizes include a GRID license for 25 concurrent users."
  - "HEVC/H.265 encoding has been generally available since June 2025, but it needs a desktop application group, the host's multimedia redirection component disabled, a newer GRID driver and a capable client."
  - "Verify with Task Manager, nvidia-smi, the Connection Information window and event IDs 170 and 162. A GPU that is installed but not configured does nothing for the session."
faq:
  - q: "Does adding a GPU VM size speed up every remote session?"
    a: "No. Learn says remote sessions are rendered with the CPU by default and do not use an available GPU. You enable GPU-accelerated application rendering and remote frame encoding through Intune or Group Policy, install the right graphics driver, and restart the session hosts."
  - q: "Can I use any N-series size as a session host?"
    a: "No. Learn lists NVv3, NVv4, NVadsA10 v5 and NCasT4_v3 as supported for GPU acceleration. It says NC, NCv2, NCv3, ND and NDv2 series are not generally appropriate, because they target compute and machine learning tools such as CUDA workloads and do not support GPU acceleration for most applications or the Windows user interface."
  - q: "Is HEVC/H.265 encoding still in preview?"
    a: "No. Azure Virtual Desktop's what's new page records HEVC GPU acceleration in preview in September 2024 and generally available in June 2025. It still has prerequisites, including a desktop application group and a supported client."
---

A GPU session host pays off when the applications or the user experience need the GPU, because Azure Virtual Desktop renders remote sessions on the CPU by default. Typical cases are graphic design, video editing, 3D modeling, CAD and data visualization. For office workloads Learn gives no threshold, so test a CPU-only pilot before paying for GPU sizes.

This guide helps you decide, picks between the supported sizes, and shows what must be in place for the GPU to be used at all.

## What the GPU does in a session

Learn names three components of GPU acceleration:

- **GPU-accelerated application rendering:** the GPU renders graphics inside the remote session.
- **GPU-accelerated remote frame encoding:** the Remote Desktop Protocol encodes rendered frames for the local device. The GPU does this encoding for higher frame rates and a better experience. Learn notes it may consume more network bandwidth and more session host and client resources, and it benefits 3D modeling, CAD/CAM and video playback and editing.
- **Codec choice:** AVC/H.264 or HEVC/H.265. Learn says HEVC allows 25 to 50 percent better compression than AVC/H.264 at the same quality, or better quality at the same bitrate.

Full-screen video encoding with AVC/H.264 also works without GPU acceleration. HEVC needs a compatible GPU-enabled VM. You can also raise the default chroma value to improve image quality without a GPU, though with HEVC the 4:4:4 chroma setting falls back to 4:2:0.

## Do you need one? A decision table

| Situation | GPU session host | Why |
|---|---|---|
| CAD, 3D modeling, visualization, video editing | Likely yes | Learn names these as the cases where GPU acceleration is crucial |
| Applications that require a GPU to start or perform | Yes | The vendor requirement decides, not the protocol |
| Video playback quality in sessions | Test first | Learn says frame encoding on the GPU benefits video playback; multimedia redirection is a different route |
| Office and web workloads | Test CPU-only first | Our reading: Learn sets no threshold for these |
| Compute or machine learning on a VM | Not as a session host | NC, NCv2, NCv3, ND and NDv2 target CUDA-style tools |

Our reading on cost: the benefit has to outweigh GPU size pricing, which this guide does not quote. Use the Azure pricing calculator that the VM size pages link to, and compare it with the CPU size that passes your pilot.

## Which VM sizes are supported

Learn's table lists these sizes for Azure Virtual Desktop session hosts:

| Azure VM size | GPU application rendering | GPU frame encoding |
|---|---|---|
| NVv3-series | Supported | HEVC/H.265 and AVC/H.264 |
| NVv4-series | Supported | AVC/H.264 |
| NVadsA10 v5-series | Supported | HEVC/H.265 and AVC/H.264 |
| NCasT4_v3-series | Supported | HEVC/H.265 and AVC/H.264 |

Learn's advice on choosing: the right size depends on application workloads, desired experience and cost. Larger and more capable GPUs generally give a better experience at a given user density, and smaller and fractional GPU sizes give finer control over cost and quality.

The Azure VM sizes overview also lists other graphics families, for example NVads V710 v5 in the NV family and the NG family for virtual desktop use. They do not appear in Learn's Azure Virtual Desktop table, so check that page for support before choosing one.

### The NVadsA10 v5 detail

The NVadsA10 v5 series uses NVIDIA A10 GPUs with AMD EPYC 74F3V (Milan) processors and is the series with partial GPUs. Learn's size table:

| Size | vCPUs | Memory (GiB) | GPU share | GPU memory (GB) |
|---|---|---|---|---|
| Standard_NV6ads_A10_v5 | 6 | 55 | 1/6 | 4 |
| Standard_NV12ads_A10_v5 | 12 | 110 | 1/3 | 8 |
| Standard_NV18ads_A10_v5 | 18 | 220 | 1/2 | 12 |
| Standard_NV36ads_A10_v5 | 36 | 440 | 1 | 24 |
| Standard_NV72ads_A10_v5 | 72 | 880 | 2 | 48 |

Two details matter for planning. Each instance includes a GRID license, usable as a virtual workstation for one user or by 25 concurrent users in a virtual application scenario. Learn's graphics article states the same 25-user figure for NVIDIA GPU sizes in general. And the series page lists Live Migration and Memory Preserving Updates as not supported, so plan host maintenance accordingly. Ephemeral OS disks are listed as supported.

## What must be in place

1. **Driver.** For NVIDIA sizes, install the GRID driver, not the CUDA driver. The NVIDIA GPU Driver Extension installs GRID automatically for these sizes. For AMD GPU sizes, use the AMD drivers Azure provides. Only Azure-distributed drivers are supported. HEVC needs GRID 16.2 (537.13) or later.
2. **Policy for rendering.** In an Intune settings catalog profile or Group Policy, under Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Remote Session Environment, enable **Use hardware graphics adapters for all Remote Desktop Services sessions**.
3. **Policy for AVC/H.264 encoding.** In the same location, enable **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** and **Configure H.264/AVC hardware encoding for Remote Desktop connections**. Learn warns that prioritizing H.264 without the hardware encoding setting can result in CPU-based encoding.
4. **Policy for HEVC.** Under Remote Desktop Session Host > Azure Virtual Desktop, enable **Configure H.265/HEVC hardware encoding for Remote Desktop Connections**. This needs the Azure Virtual Desktop administrative template. If both HEVC and AVC are enabled, HEVC is prioritized for compatible sessions, and AVC is used when HEVC is not available on the device or the prerequisites are not met.
5. **Restart** the session hosts after the policy applies.

## HEVC trade-offs

HEVC has been generally available since June 2025, after a preview announced in September 2024. Its prerequisites cut across other choices:

- Session hosts running Windows 10 or Windows 11.
- A desktop application group. RemoteApp is not supported.
- Multimedia redirection disabled by uninstalling the host component. Our reading: a pool that relies on multimedia redirection for video cannot also use HEVC on the same hosts.
- Local device with a GPU that has HEVC 4K YUV 4:2:0 decode support, the Microsoft HEVC codec, and Windows App 2.0.503.0 or later, or the Remote Desktop app 1.2.6081 or later, on Windows. Learn says other platforms and versions are not supported.

If part of your user base connects with unsupported clients, they get AVC/H.264, so size the network for that case.

## Verify the GPU is used

1. On the HEVC path, check the codec on the client: `Get-AppxPackage -Name "Microsoft.HEVCVideoExtension" | FT Name, Version`.
2. Connect, start an application that loads the GPU and open the Performance tab in Task Manager. For NVIDIA GPUs, `nvidia-smi` also shows utilization.
3. In the session's **Connection Information** window, select **See details**. **Codecs Used: HEVC** under Graphics details means HEVC frame encoding is in use.
4. In Event Viewer, open Applications and Services Logs > Microsoft > Windows > RemoteDesktopServices-RdpCoreCDV > Operational for Azure Virtual Desktop connections. Event ID 170 with "AVC hardware encoder enabled: 1" means GPU frame encoding. Event ID 162 with **Avc444FullScreenProfile** or **HevcProfile** shows which full-screen video profile is active.

## A pilot that answers the pay-off question

The honest test of whether a GPU size pays off is a side-by-side pilot. The steps are our suggestion; the settings come from Learn.

1. Pick one representative application and one task users complain about, such as rotating a 3D model or scrubbing a timeline.
2. Build two session hosts in a pilot host pool: one on the CPU size you use today, one on a GPU size from the table above. A fractional NVadsA10 v5 size such as Standard_NV6ads_A10_v5 (1/6 GPU, 4 GB) is the smallest NVadsA10 v5 size, so it is a low-commitment way to ask "does the GPU help at all".
3. Install the GRID driver and apply the Intune or Group Policy settings from the previous section on the GPU host only. Restart it.
4. Run the same task on both hosts with the same users and note frame rate, responsiveness and whether the application loads the GPU, using the verification steps.
5. Repeat on the next larger fractional size if the smallest one is saturated, and compare density against price in the Azure pricing calculator.

Permissions for the configuration matter in practice. Learn lists the Policy and Profile manager built-in role in Microsoft Entra ID for Intune, plus a group of target devices, or a domain account with Group Policy object permissions and a security group or organizational unit for Group Policy.

## Common mistakes

- **A GPU size without the policy.** The VM has a GPU, but sessions are still rendered on the CPU, because the default does not use it.
- **The CUDA driver on a graphics size.** For NVIDIA sizes in this scenario only GRID drivers support GPU acceleration for most applications and the Windows user interface.
- **An unsupported series.** NC, NCv2, NCv3, ND and NDv2 are not generally appropriate as session hosts. NCasT4_v3 is the NC-family exception that Learn lists.
- **H.264 prioritized without hardware encoding.** This can produce CPU-based encoding while the GPU sits idle.
- **HEVC expected on RemoteApp.** The HEVC prerequisites require a desktop application group.

## Sources

Retrieved 17 November 2026.

- Microsoft Learn, Enable GPU acceleration for Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/graphics-enable-gpu-acceleration
- Microsoft Learn, NVadsA10_v5 size series: https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nvadsa10v5-series
- Microsoft Learn, Azure VM sizes overview: https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview
- Microsoft Learn, What's new in Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new
