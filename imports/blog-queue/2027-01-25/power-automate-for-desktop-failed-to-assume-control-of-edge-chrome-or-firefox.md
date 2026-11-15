---
title: "Power Automate for Desktop Failed to Assume Control of Edge, Chrome or Firefox"
summary: "The Failed to assume control error in desktop flows with a Launch browser action: run the troubleshooter, then the four causes from Microsoft Learn: web extension, start timeout, different user accounts and profile conflicts, plus WebDriver."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [power-automate-desktop]
keypoints:
  - "The error reads Failed to assume control of Microsoft Edge, Chrome or Firefox (Internal error or communication failure) and comes from a Launch new browser action."
  - "Run the Troubleshoot UI/Web automation issues diagnostic in the Power Automate for desktop troubleshooter first and press Fix after it finishes."
  - "If the extension looks installed and enabled but does not run, remove and reinstall it from the designer, then restart the browser."
  - "If the browser starts slowly, raise Timeout for webpage to load and Timeout under Advanced, for example to 120 seconds, or attach to the running instance with retries."
  - "Start the browser with the same system user that runs Power Automate for desktop 2.38 or later, and avoid two sessions using the same browser profile."
faq:
  - q: "What does Failed to assume control mean?"
    a: "The error appears when a desktop flow with a Launch new Microsoft Edge, Chrome or Firefox action cannot take control of the browser. Microsoft Learn names four causes: the browser extension is not installed correctly, the browser takes longer to start than the default timeout, different user accounts start the browser and run Power Automate for desktop, or browser profile conflicts prevent the browser from starting."
  - q: "What should I try first?"
    a: "Run the Troubleshoot UI/Web automation issues diagnostic in the Power Automate for desktop troubleshooter. It produces a report, and you resolve the issues with the Fix button that appears after the diagnostic finishes. If that does not solve the error, use the causes and solutions of the article."
  - q: "The flow fails only sometimes. Why?"
    a: "Learn says that when starting the browser takes longer than the default timeout, the behavior might be inconsistent, with some executions failing and others working. Increase the Timeout for webpage to load and Timeout parameters in the Advanced section, for example to 120 seconds."
  - q: "Do I always need the browser extension?"
    a: "Not any more in every case. Starting in version 2.62, Power Automate for desktop supports WebDriver as an alternative communication method for browser automation, which removes the need to install a browser extension."
  - q: "What are the general checks if nothing helped?"
    a: "Make sure the environment variable ComSpec exists with the value C:\\WINDOWS\\system32\\cmd.exe. For Chrome only, check the exit_type parameter in the Preferences file and set it to normal if necessary. Clear the browser cache and cookies manually and restart the browser."
---

A desktop flow that launches a browser can stop with the message Failed to assume control of the browser. The Microsoft Learn page on this error names four causes and gives a solution for each. This article follows that page and adds a short checking order that is marked as mine.

## The error

A flow with a **Launch new Microsoft Edge**, **Launch new Chrome** or **Launch new Firefox** action fails with one of these messages:

- Failed to assume control of Microsoft Edge (Internal error or communication failure).
- Failed to assume control of Chrome (Internal error or communication failure).
- Failed to assume control of Firefox (Internal error or communication failure).

## Step 0: Run the troubleshooter

Learn gives this as an important note before the causes. In Power Automate for desktop run the **Troubleshoot UI/Web automation issues** diagnostic from the troubleshooter. It generates a report that identifies issues. Resolve them with the **Fix** button that appears when the diagnostic finishes. If that does not solve the error, go through the causes below.

## Cause 1: The web extension is not installed correctly or not enabled

Further signs from the page:

- A flow with the launch action fails with the error.
- Starting the Web Recorder for the browser shows a message to select Get Extension, install it, and enable it in the browser.
- The extension looks installed and enabled in the browser's extension list, but it does not run.

Solution:

1. Install the extension for your browser from the Power Automate for desktop designer.
2. Even if it seems installed and enabled, remove it and install it again.
3. Restart the browser.

## Cause 2: The browser takes longer to start than the default timeout

The automation tries to take control of the browser before it has started, so the launch action fails. Learn notes that this can be inconsistent, where some runs fail and others succeed.

**Solution 1: Increase the timeouts.** In the launch action, raise **Timeout for webpage to load** and **Timeout** in the **Advanced** section, for example to **120** seconds. If that does not help, use solution 2 or 3.

**Solution 2: Attach to the running instance and use Go to web page.**

1. Add a **Launch Browser** action for your browser with **Launch mode** set to **Launch new Instance** and a default URL as **Initial URL**.
2. Select **On error** for it, open **Continue flow run**, choose **Go to next action** and save.
3. Add a second **Launch Browser** action for the same browser. Set **Launch mode** to **Attach to running instance**, **Attach to browser tab** to **By URL**, and **Tab URL** to the URL from step 1. Replace the new browser variable with the variable produced in step 1.
4. For this action select **On error**, enable **Retry action if an error occurs**, set the number of times to **20** and the interval to **5** seconds, and save.
5. Add a **Go to web page** action. Use the browser variable as **Web browser instance**, set **Navigate** to **To URL**, and enter the target URL.

**Solution 3: Attach after a Wait action.** Do steps 1 and 2 from solution 2, then add a **Wait** action of **90** seconds (adjust as appropriate), then the second **Launch Browser** action with **Attach to running instance** and **By URL** as described.

## Cause 3: Different user accounts

You start the browser with a different system user than the one that runs Power Automate for desktop (version 2.38 or later). This can happen in attended and unattended modes. Solution: start the browser with the same system user account that runs Power Automate for desktop.

## Cause 4: Browser profile conflicts

The browser does not start, or starts once and not again. It does not appear, or ends right after launch. Learn explains that when a Chromium-based browser such as Edge or Chrome starts, it checks whether another instance already uses the same profile on disk, and ends at once if so. If the same user is signed in to several sessions on the machine, only one session can start the browser.

Solution: start the browser from the flow with a different profile on disk. The page's example gets the desktop folder with a **Get special folder** action and then runs `msedge.exe` with `--user-data-dir="%SpecialFolderPath%\<ProfileFolder>"` through the **Run application** action. This gives the browser a unique profile directory.

## General checks

- The environment variable `ComSpec` must exist with the value `C:\WINDOWS\system32\cmd.exe`.
- Chrome only: check the `exit_type` parameter in `%localappdata%\Google\Chrome\User Data\Default\Preferences` and set it to `normal` if necessary.
- Clear the browser cache and cookies manually, then restart the browser.

## WebDriver option

Starting in version 2.62, Power Automate for desktop supports WebDriver as an alternative communication method for browser automation. Learn says this removes the need for a browser extension. The page links the web automation actions reference for details.

## Which cause fits (my summary)

This table is my own summary of the page.

| What you see | Cause |
| --- | --- |
| Get Extension message in Web Recorder, or extension seems on but does nothing | Extension |
| Fails on some runs and works on others | Slow browser start |
| Fails when the flow runs under another Windows user than the browser | Different accounts |
| Browser closes right after launch, or fails after the first run | Profile conflict |

## Checking order (my advice)

This is my suggestion, not an order from the page:

1. Run the troubleshooter and press Fix.
2. If the flow worked yesterday and fails today, think of browser updates and extension state, and reinstall the extension.
3. If a flow fails only on some machines or at some times, test the timeouts, since the page ties inconsistent failures to them.
4. On shared machines and servers with several sessions, check profile conflicts and the user account.
5. Do not combine all fixes at once. Change one thing and run the flow, so you know which one worked.
6. For new flows, consider WebDriver if your version supports it, since it removes one part that can break.

## Related

- [Power Automate Desktop](https://www.m365.fm/entity/power-automate-desktop/)

## Sources

- [Failed to assume control of Edge or Chrome or Firefox error (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-automate/desktop-flows/browser-automation/failed-to-assume-control-of-edge-chrome-firefox-error)
