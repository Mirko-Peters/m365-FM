---
title: "Fix Microsoft 365 Apps Install Error 30015-4 and 30015-1011"
summary: "Install errors 30015-4 (1392) and 30015-1011 (1392): the two options on the Microsoft Support page, restart and reinstall, then the Office offline installer, with the offline installer steps for the home version. The page names no cause, so this article says so and adds a short checking order."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [microsoft-365-apps]
keypoints:
  - "The Support page covers error codes 30015-1011 (1392) and 30015-4 (1392) when installing Microsoft 365 or Office, and lists no specific causes."
  - "Option 1 is to save your work, close programs, restart, then sign in with the account for Microsoft 365 and select Install again."
  - "Option 2 is the Office offline installer, which may bypass proxy, firewall, antivirus or internet connection problems according to the page."
  - "For the home version, choose Offline installer in the Choose a version list, mount the image file, then run Setup32.exe or Setup64.exe from the Office folder."
  - "If you installed through work or school, use the Office for business tab of the offline installer article instead."
faq:
  - q: "What do 30015-4 (1392) and 30015-1011 (1392) mean?"
    a: "The Microsoft Support page only says that installing Microsoft 365 or Office fails with these codes. It lists no specific causes. It suggests that the offline installer may bypass potential proxy, firewall, antivirus or internet connection issues, which hints at where the problem may be, but the page does not state the cause."
  - q: "What is the first thing to try?"
    a: "Option 1 on the page: save your work, close open programs and restart the computer. After the restart, open a web browser, sign in with the account associated with Microsoft 365 and select Install. The page says to try the solutions in order."
  - q: "How do I use the offline installer?"
    a: "For the home version, follow the Office offline installer article: select Download, in the Install window choose Offline installer from the Choose a version list, pick your language and select Install, and save the file. Mount the downloaded image, open the Office folder on the virtual drive and run Setup32.exe or Setup64.exe, then wait for the You are all set message."
  - q: "I installed Microsoft 365 through work or school. Is the process the same?"
    a: "The offline installer article says to use its Office for business tab if you installed Microsoft 365 through work or school and signed in with that account. I could not read that tab, so check the article for those steps."
  - q: "What should I do after the installation works?"
    a: "The offline installer article says to connect to the internet, open an Office app such as Word and select Accept to agree to the license terms. Then open any Microsoft 365 app, go to File, Account, and select Update Now from the Update Options list."
---

Errors 30015-4 (1392) and 30015-1011 (1392) stop the installation of Microsoft 365 or Office before it finishes. The Microsoft Support page on these codes is short. It gives two options and does not list causes. I say that clearly, because the article should not make up reasons that the page does not give. This article walks through the two options, adds the offline installer steps from the linked Support article, and ends with a checking order that is marked as my advice.

## What the page says

- **Symptom:** installing Microsoft 365 or Office fails with error code 30015-1011 (1392) or 30015-4 (1392).
- **Applies to:** the page lists Office 2016, Office 2013, Office 365 Small Business, and Office 365 operated by 21Vianet (Small Business Admin) in its applies-to line.
- **Causes:** the page lists none. It says only that the offline installer may bypass potential proxy, firewall, antivirus or internet connection issues.
- **Order:** try the solutions in the order given.

## Option 1: Restart and reinstall

1. Save your work, close open programs and restart the computer.
2. After the restart, open a web browser and sign in with the account associated with Microsoft 365. The page names Internet Explorer here, which is out of date, so use a current browser. Select **Install**.

To reinstall, the page links version-specific articles for Microsoft 365, Office 2024, Office 2021, Office 2019 and Office 2016.

## Option 2: Use the Office offline installer

The page tells you to follow the Use the Office offline installer article and select the tab for your version of Office. Here are the steps for the **Office for home** tab as I read them.

### Download

1. Select the **Download** button in the article.
2. In the Install window, choose **Offline installer** from the **Choose a version** list.
3. Select your language and choose **Install**.
4. When prompted, save or open the file. The button depends on the browser: **Save** (Edge), **Open** (Internet Explorer), **Open when done** (Chrome), **Save File** (Firefox).

If you installed Microsoft 365 through work or school and already signed in with that account, the article says to use the **Office for business** tab instead. I did not read that tab.

### Mount the image

1. Open the **Download** folder and double-click the downloaded image file. The article names **O365HomePremRetail.img** for the home version. Select **Open** if prompted.
2. A virtual drive window should appear. If not, open **File Explorer** and find the new drive, for example (D:). If (D:) exists, the next free letter is used.
3. Optionally save a copy of the virtual drive to a thumb drive or disc.

### Install

1. Open the **Office** folder on the virtual drive.
2. Run **Setup32.exe** for the 32-bit version or **Setup64.exe** for the 64-bit version.
3. Wait for the **You're all set** message.

### Activate and update

1. Connect to the internet, open an Office app such as Word and select **Accept** to agree to the license terms.
2. Open any Microsoft 365 app, go to **File** > **Account** and select **Update Now** from the **Update Options** list.

The article says to confirm that your PC or Mac meets the system requirements before you start. It does not list the specifications.

## What the page does not say

- It does not explain what error 1392 stands for.
- It does not list log locations, registry settings or commands.
- It does not cover managed deployments with the Office Deployment Tool or Intune. If you deploy Microsoft 365 Apps that way, use the deployment documentation for your tool.

## Checking order (my advice)

This is my suggestion, not guidance from the page:

1. Try the restart and reinstall first, since it costs nothing and is the first option on the page.
2. Because the page mentions proxy, firewall, antivirus and connection issues as things the offline installer may bypass, note whether the failing machine is behind a proxy or has a security product that inspects downloads. Compare with a machine that installs fine.
3. If the offline installer works where the online one fails, that points to the network path, but this is my reading, not a statement of the page.
4. For many machines with the same error, collect the exact code, the build or version of Office, the network location and the time, before you open a support case.
5. Keep the downloaded offline image for repeat installs on other machines, if your license terms allow it.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [Error code 30015-1011 (1392) and 30015-4 (1392) when installing Office (Microsoft Support)](https://support.microsoft.com/office/error-code-30015-1011-1392-and-30015-4-1392-when-installing-office-a1984055-5e3c-412d-affb-966f27f8c7c8)
- [Use the Office offline installer (Microsoft Support)](https://support.microsoft.com/office/f0a85fe7-118f-41cb-a791-d59cef96ad1c)
