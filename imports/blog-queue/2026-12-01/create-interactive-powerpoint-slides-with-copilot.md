---
title: "Create Interactive PowerPoint Slides with Copilot: What Microsoft Documents"
summary: "Copilot in PowerPoint can create interactive slides such as dashboards, timelines, process flows and comparisons. This guide covers how to start, the platforms, licensing and rollout status, and what Microsoft has not documented yet."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [powerpoint, copilot]
keypoints:
  - "Interactive slides are created with the Create interactive slide skill in Copilot, or with the Interactive Slide button on the Home and Insert tabs."
  - "Microsoft names four use types: dashboards, interactive timelines and process flows, visual explanations, and comparisons."
  - "A Copilot license is required. Rollout was announced for Frontier first, then worldwide from mid-October 2026."
  - "Slides are interactive on Windows, Mac, web and iPad. On iPhone and Android they appear as non-interactive images."
  - "In PowerPoint Live in Teams each attendee interacts on their own, and presenter and attendee views are not synchronized."
faq:
  - q: "How do I create an interactive slide in PowerPoint with Copilot?"
    a: "According to Microsoft's Windows blog, select Interactive Slide on the ribbon and describe the slide, or open the Create interactive slide skill in the Copilot skill picker. You can reference the current presentation or other files such as Excel workbooks and Word documents."
  - q: "What kinds of interactive slides can Copilot make?"
    a: "The blog lists dashboards based on a data snapshot, interactive timelines and process flows, visual explanations of complex concepts, and comparisons of products, scenarios or strategies."
  - q: "Do interactive slides work on phones?"
    a: "Message Center post MC1461152 says slides are interactive on iPad, while on iPhone and Android they appear as non-interactive images. Creating and using them is supported on Windows, Mac and the web."
  - q: "Is there an admin setting to control the feature?"
    a: "The Message Center post says there are no admin settings for this capability and no action is required before rollout. It recommends briefing support teams and updating internal PowerPoint guidance."
  - q: "Does Microsoft give example prompts?"
    a: "The Microsoft pages read for this article do not give written prompt wording for interactive slides. The Windows blog has a demo video and the support page lists the feature without separate steps."
---

Copilot in PowerPoint can build full-slide interactive visuals that a presenter or audience can explore: dashboards, timelines, process flows, explanations and comparisons. The feature is a Copilot skill called Create interactive slide. This guide explains how to start it, where it works and what the rollout and licensing look like. Microsoft's pages describe the capability but do not provide written example prompts, so this article does not invent a prompt library.

## What interactive slides are

Microsoft's Windows blog describes interactive slides as explorable slides that presenters and audiences work through together. Copilot generates them from a simple prompt or from existing content. The blog names four types:

- **Dashboards** based on a data snapshot, including grounding from Work IQ.
- **Interactive timelines and process flows.**
- **Visual explanations** that summarize or clarify complex concepts.
- **Comparisons** of products, scenarios or strategies.

When presenting, the presenter can reveal information step by step and direct attention to key points, while the audience can explore the visuals.

## How to create one

Microsoft documents two entry points:

1. **Ribbon.** Select **Interactive Slide** on the Home or Insert tab, then describe the slide you want.
2. **Copilot chat.** Open Copilot Chat from the Copilot icon in the lower-right corner, select the **Skills** menu and choose **Create interactive slide**.

You can reference content in the current presentation or in other files such as Excel workbooks and Word documents. Microsoft's support page on editing with Copilot lists interactive slides, for example dashboards, timelines and summaries, among Copilot's capabilities and gives no separate steps.

### Making a request that works

Microsoft does not publish prompt wording, so this is guidance based on what the sources say the feature uses. State which of the four types you want, point Copilot at the source file or the existing slide that holds the data, and name the audience. Then review the result, because Microsoft advises reviewing AI-generated content and notes that large or complex presentations may exceed system limits.

## Where it works

From Message Center post MC1461152:

| Platform | Behavior |
|---|---|
| Windows, Mac, web | Create and use interactive slides |
| iPad | Slides are interactive |
| iPhone, Android | Slides appear as non-interactive images |

In PowerPoint Live in Microsoft Teams, each attendee interacts independently. Presenter and attendee interactions are not shared, and synchronizing them is described as a planned future improvement.

## Licensing and rollout

- A Copilot license is required.
- The post says the skill was available to the Frontier program and Microsoft 365 Insider Beta first, then Current Channel (Preview), with worldwide rollout starting mid-October 2026 and expected to finish by the end of October 2026. The post was last updated on October 7, 2026.
- The Windows blog from October 30, 2026 says the ribbon button and skill were rolling out to Current Channel and Monthly Enterprise Channel on Windows and Mac and to PowerPoint for the web, with completion expected by the end of October 2026.
- Because rollout timing varies by tenant, a missing button does not mean you lack the license. Check your update channel and Copilot license first.

## For admins

The Message Center post states there are no admin settings for this capability. Microsoft recommends briefing presentation support, adoption, training and help desk teams, identifying Frontier participants to give feedback and updating internal PowerPoint training material.

## Other Copilot options in PowerPoint

For plain slide creation, Microsoft Support describes creating a presentation from a prompt or from a Word document, using a template, trying a new design, adding a slide or image and summarizing a presentation. The Skills menu also lists Review this presentation, Visualize this slide and Prepare for Questions. Creating from a document needs a Microsoft Copilot work license.

## Editing and responsible use

Microsoft Support says Copilot works in PowerPoint for Windows, Mac and the web, and that you can choose an AI model for edits, including Claude from Anthropic or ChatGPT from OpenAI. Example edit prompts on that page include adding a sales-projection chart from a spreadsheet and summarizing its top takeaways, or replacing a bullet list with a SmartArt timeline. Brand Kit is available to enterprise users and requires a Microsoft Copilot license, so branded decks can follow your organization's assets.

Microsoft's guidance on limits is general rather than specific to interactive slides:

- Large or complex presentations may exceed system limits.
- Outputs may be inaccurate, so review and edit AI content before sharing.
- Use the thumbs-down button in Copilot Chat to report problematic output.
- You are responsible for having rights and consent for any images you upload.

## Practical checks before a presentation

1. Test the slide in the same mode you will present, because phones show images only.
2. If you present in a Teams meeting, remember that audience members explore on their own.
3. Keep the source data file available, since the feature can use Excel and Word content.
4. Review numbers and labels on every generated dashboard.
5. Save a backup copy of the deck before large Copilot edits.

## Related

- [Microsoft PowerPoint](https://www.m365.fm/entity/powerpoint/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [PowerPoint for the web](https://www.m365.fm/entity/powerpoint-online/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Microsoft Windows Blog (Japan): Transform your storytelling with interactive slides in PowerPoint](https://blogs.windows.com/japan/2026/10/30/transform-your-storytelling-with-interactive-slides-in-powerpoint-4564287/)
- [Microsoft Message Center MC1461152 (mirror): Create interactive slides in PowerPoint with Copilot skill](https://mc.merill.net/message/MC1461152)
- [Microsoft Support: Edit with Copilot in PowerPoint](https://support.microsoft.com/en-us/powerpoint/edit-with-copilot-in-powerpoint)
- [Microsoft Support: Welcome to Copilot in PowerPoint](https://support.microsoft.com/topic/57133c75-24c0-4519-8096-d0dadf25fb8d)
