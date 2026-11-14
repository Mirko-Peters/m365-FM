---
title: "Adaptive Cards Action.Submit vs Action.Execute: Universal Actions in Teams"
summary: "Action.Execute is the universal action for bots in Teams and Outlook, Action.Submit stays for link unfurling cards and messaging extension cases. Differences, the refresh property, schema 1.4, fallback, invoke handling and migration."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [adaptive-cards, teams, microsoft-bot-framework, outlook-actionable-messages]
keypoints:
  - "Action.Execute handles actions across hosts such as Teams and Outlook through the bot. It is not a full replacement of Action.Submit."
  - "Link unfurling cards such as hero and thumbnail cards must call Action.Submit. Action.Execute is not supported when a messaging extension must send a result back to the conversation."
  - "A bot cannot return a new card when it processes an Action.Submit. For Action.Execute it can return an Adaptive Card in response."
  - "Universal Actions need Adaptive Cards schema 1.4 or later. For older Teams clients, add an Action.Submit in the fallback property and wrap Action.Execute in an ActionSet."
  - "Automatic refresh needs the refresh property with a userIds array of at most 60 user IDs. Without it the user sees a button for a manual refresh."
faq:
  - q: "What is the difference between Action.Submit and Action.Execute?"
    a: "Teams bots used Action.Submit, which leaves the communication model to the underlying channel, and Outlook used Action.Http to call a backend named in the card. Action.Execute lets the bot be the common backend for action handling across Teams and Outlook, and the bot can return an updated card in response."
  - q: "Does Action.Execute replace Action.Submit completely?"
    a: "No. The Teams overview says Action.Execute is not a replacement of Action.Submit. Link unfurling cards such as hero and thumbnail cards must call Action.Submit, and Action.Execute is not supported when an external system does an action and the result must be sent back to the conversation through a messaging extension."
  - q: "Which card version do I need?"
    a: "Adaptive Cards schema version 1.4 or greater, according to the Universal Action Model page. With a lower version, a card in Outlook will not work, and in Teams it may not work depending on the client version. For older Teams clients the page recommends an Action.Submit in the fallback property of the Action.Execute."
  - q: "How do user-specific views work?"
    a: "Through the refresh property. The Teams overview gives an incident card as an example, where only the assigned user sees a Resolve button, the creator sees Edit, and all others see details only."
  - q: "Why does my card not refresh automatically?"
    a: "The Universal Action Model page says that without a userIds list in the refresh section, the card does not refresh automatically on display and the user gets a button for a manual refresh. The list can hold at most 60 user IDs. In Outlook, userIds is ignored and refresh is always honored."
---

Adaptive Cards in Teams used to mean `Action.Submit`. With Universal Actions there is a second option, `Action.Execute`, and the two are not interchangeable. This article compares them using the Teams overview page on Universal Actions and the Universal Action Model page of the Adaptive Cards documentation. The second page is older, so I point out where it may be out of date. Opinions are marked as mine.

## Why Universal Actions exist

The Teams overview says the layout and rendering of Adaptive Cards were universal, but action handling was not. A developer who wanted to send one card to several places had to handle actions differently for each. Before Universal Actions:

- Teams and bots used `Action.Submit`, which defers the communication model to the underlying channel.
- Outlook used `Action.Http` to communicate with a backend service named explicitly in the card payload.

Universal Actions make the bot the common backend for action handling and add `Action.Execute`, which works across apps such as Teams and Outlook. The page describes the result as build once, deploy anywhere: you can send the same card to Teams and Outlook and keep them in sync through the bot.

## The comparison

| Point | Action.Submit | Action.Execute |
| --- | --- | --- |
| Used by | Teams bots | Bots in Teams and Outlook (the universal model) |
| Communication | Left to the underlying channel | Through the bot as common backend |
| Replaces | Not applicable | `Action.Submit` and `Action.Http` for these scenarios, with limits below |
| New card in response | A bot cannot return a new card when it processes an Action.Submit | The bot can return an Adaptive Card in response |
| Refresh and user-specific views | Not available | Available through the `refresh` property |
| Minimum schema | Not stated in the pages I read | 1.4 |

## Where Action.Submit stays

The Teams overview is explicit that `Action.Execute` is not a replacement of `Action.Submit`:

- For link unfurling cards, such as hero and thumbnail cards, you must call `Action.Submit`.
- If an external system must do an action and the result must be sent back to the conversation using a messaging extension, `Action.Execute` is not supported.

So the migration is not a global search and replace. The Universal Action Model page says that to update an existing Teams scenario you replace the instances of `Action.Submit` with `Action.Execute`, but read that together with the two exceptions above.

## What you gain

### User-specific views

Without Universal Actions every user in a chat or channel sees the same view and buttons. The `refresh` property lets different users see different things. The page's example is an incident card: only the assigned user sees **Resolve**, the creator sees **Edit**, and everyone else sees details only.

### Sequential workflows

Because `Action.Execute` can return an Adaptive Card in response to an action, a user can move through a series of steps without separate cards being sent. Any user can progress without changing the card for others. The page's example is a food ordering bot.

### Up-to-date views

A card can update itself. The page's example is an approval request: after approval, the card shows the time and who approved, instead of the approve buttons.

## Technical requirements

From the Universal Action Model page:

1. **Schema version.** The model was introduced in Adaptive Cards schema version 1.4. Set the card `version` to 1.4 or greater. This makes the card incompatible with older clients that do not support the model.
2. **Behavior with a lower version.** In Outlook, the card will not work: `refresh` is not honored and `Action.Execute` does not render, and the card may be rejected. In Teams, it may not work depending on the client version.
3. **Fallback.** For older Teams clients, define `Action.Execute` with an `Action.Submit` in its `fallback` property. The bot must then process both. The page notes the fallback gives a degraded experience, since a bot cannot return a new card for an `Action.Submit`.
4. **ActionSet.** Some older Teams clients do not support `fallback` unless the action is wrapped in an `ActionSet`. The page strongly recommends wrapping all `Action.Execute` actions in an `ActionSet`.
5. **Outlook.** The card needs the `originator` property, a GUID created when the bot subscribes to the Outlook channel. Without it, Outlook does not render the card. Teams ignores it.

## Handling the action in the bot

When an `Action.Execute` runs, whether from a button or from the refresh, the client sends the bot an invoke activity named `adaptiveCard/action`. Its value holds a copy of the action, including the `data` with the card's input values, and a `trigger` field that says `manual` or `automatic`.

The bot's HTTP response must have status 200 when the bot processed the request, and the body carries a `statusCode` from 200 to 599, a `type` and a `value`. The page stresses that an HTTP 200 does not mean success. A client must read `statusCode` in the body. The page lists these types for the success case: an Adaptive Card to show in place of the current one, or a message string. Error cases include 400, 401 for a required sign-in, 412 for a failed SSO flow, and 500.

## Refresh: the 60 user limit

To make a card refresh automatically, define `refresh` with an `action` of type `Action.Execute` and a `userIds` array. If `userIds` is missing, the card does not refresh automatically on display. The user gets a button for a manual refresh instead. The page gives the reason: a Teams chat or channel can have many members, and automatic refresh for all of them at once would mean many concurrent calls to the bot. At most 60 user IDs are currently allowed. In Outlook, `userIds` is ignored and `refresh` is always honored.

## Dated points on the pages

- The Universal Action Model page was last changed in 2023. It says support in Outlook clients for the model was under active development, and that migration of existing Actionable Message scenarios was in progress. I did not check the current state, so confirm it before you plan an Outlook scenario.
- The same page says an Actionable Message scenario can use `Action.Http` or `Action.Execute`, but not both, and that `Action.Execute` scenarios are implemented as bots subscribed to the Outlook Actionable Messages channel.

## Choosing between them (my advice)

This is my suggestion, not guidance from the pages:

1. For a new bot card that needs a reply card, per-user views or refresh, use `Action.Execute` with card version 1.4.
2. For link unfurling cards and the messaging extension case above, keep `Action.Submit`.
3. If you must support older Teams clients, use the fallback and the ActionSet wrapper, and accept the degraded behavior for them.
4. Keep the verb names of your actions stable and documented, since the bot routes on them.
5. Test the card in the Teams and the Outlook clients you need, in the versions your users run.

## Related

- [Adaptive Cards](https://www.m365.fm/entity/adaptive-cards/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Bot Framework](https://www.m365.fm/entity/microsoft-bot-framework/)
- [Outlook actionable messages](https://www.m365.fm/entity/outlook-actionable-messages/)

## Sources

- [Universal Actions for Cards - Overview (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/platform/task-modules-and-cards/cards/universal-actions-for-adaptive-cards/overview)
- [Universal Action Model (Microsoft Learn)](https://learn.microsoft.com/adaptive-cards/authoring-cards/universal-action-model)
