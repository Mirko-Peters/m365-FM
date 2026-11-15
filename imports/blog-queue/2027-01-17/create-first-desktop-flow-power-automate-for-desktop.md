---
title: "How to Create Your First Desktop Flow in Power Automate for Desktop"
summary: "Create a desktop flow in Power Automate for desktop from an example, the console or a cloud flow. Follow Learn's Backup flow walkthrough with actions like Get special folder, For each and Copy file, test it step by step, and see what the free work or school account includes."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [power-automate-desktop, power-automate, power-platform]
keypoints:
  - "Learn lists three ways to create a desktop flow: copy an example from the Examples tab, create one in the console with New flow, or create one through a cloud flow."
  - "With a work or school account, Power Automate for desktop is available at no extra cost, and the default environment must contain a Dataverse database."
  - "Learn's first flow copies files from the documents folder to a Backup folder on another drive and appends each original path to Logs.txt."
  - "Test with Run, or step through with Run next action, then Save and run from the console."
  - "Triggering from a cloud flow needs a registered machine, a desktop flow connection and the right license; Learn lists up to 70 desktop flow runs per minute per connection."
faq:
  - q: "How do I start from an example?"
    a: "Open the Examples tab in the console, right-click an example and select Create a copy. The copy is stored under My flows. If you edit an example in the designer, use Save as, because you cannot save changes to the original."
  - q: "What does a work or school account include?"
    a: "Learn says using Power Automate with a work or school account is available at no extra cost. Running flows automatically, premium cloud connectors, and flow sharing and monitoring need a trial or an Organization premium account."
  - q: "What is required in the environment?"
    a: "To use Power Automate for desktop, your default environment must contain a Dataverse database."
  - q: "How do I test a flow action by action?"
    a: "In the flow designer select Run next action to run one action at a time. Select Run to run the whole flow."
  - q: "How do I run a desktop flow from a cloud flow?"
    a: "Add the Run a flow built with Power Automate for desktop action, create or reuse a desktop flow connection, choose attended or unattended, and select or create the desktop flow. You need a registered machine or machine group and a work or school account."
---

To create your first desktop flow, open Power Automate for desktop, select **New flow** in the console, name it and build the steps in the flow designer. Microsoft Learn describes three ways to start: copy an example, create one in the console, or create one through a cloud flow. This guide follows Learn's page on creating desktop flows, its getting started walkthrough for a work or school account and its page on triggering desktop flows from cloud flows.

## What you need

Learn says Power Automate with a work or school account is available at no extra cost. To use Power Automate for desktop, your default environment must contain a Dataverse database. For more RPA features, such as running flows automatically, premium cloud connectors, and flow sharing and monitoring, you start a trial or upgrade to an Organization premium account. To start a trial, select **Go premium** in the console.

## Three ways to create a desktop flow

1. **From an example.** The **Examples** tab in the console has a collection of examples. Right-click one and select **Create a copy**, and the copy lands under **My flows**. If you open an example in the flow designer and edit it, use **Save as**, because you cannot save changes to the original.
2. **Through the console.** Launch the app, select **New flow**, enter a name and select **Create**, design the flow and select **Save**. Close the designer and the flow appears under **My flows**.
3. **Through a cloud flow.** You can create a desktop flow from a cloud flow and trigger it remotely. See the section below.

## Walkthrough: a Backup flow

Learn's getting started page builds a flow that copies all files in the documents folder to a backup location and appends the original path of each file to a log file. It needs a secondary drive. If you have none, pick a different destination folder.

1. Launch Power Automate and select **New flow** in the **Console**.
2. Name it, for example **Backup flow**, and select **Create**.
3. In the designer, add **Get special folder** and retrieve the path of the documents folder.
4. Add **Get files in folder** to retrieve all files in that folder. Optionally include subfolders.
5. Add a **For each** loop so each file is handled independently.
6. Inside the loop, add **Get file path part** to get the path of the current file.
7. Add **Copy file** to copy the current file to the destination, in Learn's example a folder called **Backup** on the D drive.
8. Add **Write text to file** to append a line to the log file. In the example the file is **Logs.txt**, and each line holds the original path of the copied file.
9. Select **Run** at the top of the designer to test.
10. To see how each action behaves, run the flow step by step with **Run next action**.
11. If it works, select **Save** and close the designer.
12. Run it from the console with the **Run** button. Select **Stop** to end it before it finishes.

Learn describes the building blocks too: premade actions plus a built-in recorder, used for tasks such as filling forms, retrieving data from the web or desktop applications, and sending standardized emails.

## Trigger a desktop flow from a cloud flow

Learn's page on triggering lists prerequisites: a registered machine or machine group to run the flows, a work or school account, a configured desktop flow connection, and the right license for attended runs or an unattended add-on for unattended runs. The license must belong to the creator of the connection.

Steps from the page:

1. Go to Power Automate and sign in, then create a cloud flow, instant or automated.
2. Select **+ New step**, search for **Power Automate for desktop** and select **Run a flow built with Power Automate for desktop**.
3. Create a desktop flow connection if you do not have one.
4. Set the run mode, attended or unattended, and select **Create a new desktop flow**, or pick an existing flow by name.
5. Enter a name and select **Launch app**. If the browser asks whether to allow the page to open Power Automate, select **Open**.
6. The new desktop flow opens in the designer.

Desktop flows can have input and output variables. Input variables pass data from cloud to desktop, output variables pass data back. The page says the input size limit for a desktop flow is 2 MB (1 MB for China regions) and recommends obfuscating sensitive inputs. Known limitations: up to 70 desktop flow runs per minute for every connection, and cancelling a parent cloud flow does not stop its child desktop flows if the **Asynchronous Pattern** is disabled in the action settings.

For failures in unattended runs, Learn describes video logs, which record the last 60 seconds of on-screen activity before a failure. They need Power Automate for desktop version 2.66 or later, a cloud flow with that action and unattended mode, and the Video logs option turned on under advanced parameters.

## Tips for the first flow

This section is my advice, not a Microsoft statement.

1. **Keep the first flow harmless.** Learn's backup example copies files and does not delete anything, which makes it safe to rerun.
2. **Use Run next action early.** Watching each action's effect is the quickest way to learn what the actions do.
3. **Name actions and variables clearly** from the start, because a flow of ten actions is still easy to read and one of a hundred is not.
4. **Test the destination first.** If the secondary drive is missing, the example fails in a way that looks like a flow problem.
5. **Check licensing before planning unattended runs.** The page ties unattended runs to an add-on, so settle that with your administrator before you build.
6. **Move to cloud triggers only when the desktop flow is stable.** Debugging is easier on the machine.

## Related

- [Power Automate for desktop](https://www.m365.fm/entity/power-automate-desktop/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Create desktop flows - Power Automate (Microsoft Learn)](https://learn.microsoft.com/power-automate/desktop-flows/create-flow)
- [Get started with a work or school account - Power Automate (Microsoft Learn)](https://learn.microsoft.com/power-automate/desktop-flows/getting-started-freeorg)
- [Trigger desktop flows from cloud flows - Power Automate (Microsoft Learn)](https://learn.microsoft.com/power-automate/desktop-flows/trigger-desktop-flows)
