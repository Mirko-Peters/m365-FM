---
title: "Adaptive Cards in Teams: How to Use the Designer, with Examples"
summary: "How to design an Adaptive Card for Microsoft Teams with the Adaptive Card Designer, which schema version and actions Teams supports, layout rules for mobile, and a minimal JSON example."
status: review
publish: false
author: mirko-p
date: 2026-11-25
topics: [adaptive-cards, adaptive-card-designer, teams]
keypoints:
  - "The browser-based Adaptive Card Designer is at adaptivecards.microsoft.com/designer.html. Add elements visually, copy the JSON payload and use it in your app."
  - "Teams bots and message extensions support Adaptive Card schema version 1.6 or earlier, and Teams mobile supports up to 1.6."
  - "Incoming webhooks support all native card elements except Action.Submit. Supported actions there include Action.OpenURL, Action.ShowCard, Action.ToggleVisibility and Action.Execute."
  - "Design for narrow screens first, set wrap to true on text and choice sets, and use one to three primary actions, with a maximum of six."
  - "Cards in Teams do not support file or image uploads, and the isEnabled property of Action.Submit is not supported."
faq:
  - q: "Where is the Adaptive Card Designer?"
    a: "Microsoft Learn points to the browser-based designer at adaptivecards.microsoft.com/designer.html. The Teams SDK documentation describes the workflow: add elements visually until the card looks right, copy the JSON payload from the editor pane, then paste it into your project or convert it to builder calls."
  - q: "Which Adaptive Card version does Teams support?"
    a: "According to the Teams platform documentation on Microsoft Learn, bot-sent cards, action-based message extensions, search-based message extensions, link unfurling and dialogs support schema version 1.6 or earlier. The Teams mobile app supports up to 1.6, and later versions might not render correctly there."
  - q: "Why does my card text get cut off on mobile?"
    a: "Microsoft Learn says to set wrap to true on TextBlock, ColumnSet and Input.ChoiceSet. Without it, text is truncated on mobile. It also advises designing for narrow screens first and keeping column widths small, because Teams mobile does not support horizontal scrolling."
  - q: "Can I use Action.Submit in an incoming webhook card?"
    a: "No. The Microsoft Learn card reference states that incoming webhooks support all native Adaptive Card elements except Action.Submit. Use Action.OpenURL, Action.ShowCard, Action.ToggleVisibility or Action.Execute instead."
  - q: "How many buttons should a card have?"
    a: "Microsoft Learn recommends one to three primary actions and allows a maximum of six, noting that less is more. It also says cards should stay concise, because they become less useful once they scroll out of view, especially in channels."
---

An Adaptive Card in Teams is a JSON description of a small piece of interface that Teams renders as a message card. The fastest way to build one is the Adaptive Card Designer in the browser: add elements, copy the JSON, and send it from your bot or app. This guide covers the designer workflow, what Teams supports, layout rules that avoid truncated cards, and a minimal example.

A note on sources: the Microsoft Learn pages read for this article do not describe the designer's host app selector or its sample data editor for Teams. The steps below stick to what the pages state.

## Open the designer

The Adaptive Cards documentation points to a browser-based designer at adaptivecards.microsoft.com/designer.html. It can also be embedded in your own web app with the `adaptivecards-designer` npm package. Microsoft's Teams SDK guide describes a three-step flow:

1. Add elements visually until the card looks right.
2. Copy the JSON payload from the editor pane.
3. Paste the JSON into your project, or convert it to builder calls.

If you prefer an editor, the Adaptive Cards tools page lists a Visual Studio Code extension called Adaptive Card Viewer, which previews the card while you edit a `.json` file with a `$schema` property. It also lists AdaptiveCards Studio, which lets you edit card templates and sample data in VS Code.

## What Teams supports

The Teams card reference gives these limits:

| Area | Documented support |
|---|---|
| Schema version | Version 1.6 or earlier for bot cards, message extensions, link unfurling and dialogs |
| Teams mobile | Up to version 1.6, later versions might render inconsistently |
| Incoming webhooks | All native elements except Action.Submit |
| Action.Submit | The `isEnabled` property is not supported |
| Action styles | Positive or destructive styling is not supported |
| Uploads | File or image uploads are not supported |

The SDK documentation adds that its card packages bundle the Adaptive Card v1.5 schema as strict types. That is within the version 1.6 limit.

## A minimal example

This is the structure a bot sends as an attachment. It is adapted from the format on the Teams card reference page. The card goes in `content`, and `contentType` is `application/vnd.microsoft.card.adaptive`.

```json
{
  "contentType": "application/vnd.microsoft.card.adaptive",
  "content": {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
      {
        "type": "TextBlock",
        "text": "Publish Adaptive Card schema",
        "weight": "bolder",
        "size": "medium",
        "wrap": true
      }
    ],
    "actions": [
      { "type": "Action.Submit", "title": "OK" }
    ]
  }
}
```

The `wrap` property is an addition based on the design guidance below. The page also shows dynamic values with templating, for example a text block whose `text` is `${titleText}`.

## Sending the card

The card reference does not include a full walkthrough for sending. It points to Bot Framework samples for .NET and Node.js. The Teams SDK guide shows a builder pattern with packages for C# (`Microsoft.Teams.Cards`), Python (`microsoft-teams-cards`) and TypeScript (`@microsoft/teams.cards`). A short Python example from the guide builds a card with a text block and a button, and sends it with `MessageActivityInput(text="Hello text!").add_card(card)`. Builders validate every property against the schema, which catches errors at build time.

## Layout rules for Teams

Microsoft's design guidance includes these rules:

- **Narrow first.** Design for narrow screens first. Cards scale up well but not down.
- **Wrap text.** Set `"wrap": true` on `TextBlock`, `ColumnSet` and `Input.ChoiceSet`.
- **Columns.** Fewer columns display better on mobile. Avoid more than three columns and keep explicit widths under one fourth of the narrowest card width, about 48 pixels at most.
- **Column width values.** `auto` sizes to content, `stretch` shares the remaining width, a plain number is proportional, and `<number>px` is fixed. Do not set `auto` on every column, or buttons may be cut off.
- **Images.** Use transparent backgrounds so images adapt to any Teams theme. A 100 by 100 pixel image shown at 50 by 50 stays sharp, but the reverse pixelates. Set only the width or only the height.
- **Full-width cards.** Cards must not show a horizontal scroll, so do not specify a fixed width. Test in narrow places such as mobile and meeting side panels.
- **Actions.** Use one to three primary actions, with a maximum of six.
- **Containers.** Use `style` for emphasis, `selectAction` to attach an action, and `Action.ToggleVisibility` for collapsible groups. Do not use containers for other purposes.

Microsoft also lists card types by use, such as Hero for articles, Thumbnail for a simple actionable message, List for choosing from items, and ChoiceSet for gathering several inputs. The design page notes that its guidance is a legacy Teams guide and points to the Adaptive Cards documentation hub as the current source for design best practices.

## Common mistakes

1. Designing a wide card and discovering on mobile that text is cut off.
2. Using a schema version above 1.6.
3. Using Action.Submit in an incoming webhook card.
4. Adding too many buttons.
5. Using fixed pixel widths on several columns.

## Starter material

The design page links to a repository of starter templates, Microsoft-Teams-Adaptive-Card-Samples on GitHub, and to a Teams UI Kit in Figma that covers theming, accessibility and responsive sizing.

## Related

- [Adaptive Cards](https://www.m365.fm/entity/adaptive-cards/)
- [Adaptive Cards Designer](https://www.m365.fm/entity/adaptive-card-designer/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Message extensions (Microsoft Teams)](https://www.m365.fm/entity/teams-message-extensions/)

## Sources

- [Microsoft Learn: Adaptive Cards tools](https://learn.microsoft.com/en-us/adaptive-cards/resources/tools)
- [Microsoft Learn: Create and explore card types in Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-reference)
- [Microsoft Learn: Designing Adaptive Cards for your app](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/design-effective-cards)
- [Microsoft Learn: Building Adaptive Cards (Teams SDK)](https://learn.microsoft.com/en-us/microsoftteams/platform/teams-sdk/in-depth-guides/adaptive-cards/building-adaptive-cards)
