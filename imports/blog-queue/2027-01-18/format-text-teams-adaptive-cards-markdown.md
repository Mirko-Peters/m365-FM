---
title: "How to Format Text in Teams Adaptive Cards With Markdown"
summary: "Teams Adaptive Cards support a small Markdown subset in TextBlock, Fact title and Fact value: bold, italic, lists and links. Headers, tables, images, preformatted text and blockquotes are not supported. Learn the syntax, the newline rules and the size limits from Microsoft's page."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [adaptive-cards, markdown, teams]
keypoints:
  - "Markdown works in Adaptive Card TextBlock, Fact.Title and Fact.Value; HTML is not supported in Adaptive Cards."
  - "Supported styles are bold, italic, unordered lists, ordered lists and hyperlinks; headers, tables, images, preformatted text and blockquotes are not."
  - "Lists need a single newline, written as backslash r or backslash n, while backslash n twice would indent the next element."
  - "Elsewhere in a TextBlock, use two newlines for a line break."
  - "Mentions use at tags with a msteams mention object, and message size limits are 28 KB for Incoming Webhooks and 100 KB for bot messages."
faq:
  - q: "Where does Markdown work in an Adaptive Card?"
    a: "Learn says Markdown is supported in the TextBlock element and in Fact.Title and Fact.Value. HTML is not supported in Adaptive Cards. Connector cards for Microsoft 365 Groups behave differently: they support Markdown and a limited set of HTML."
  - q: "Which Markdown features can I use?"
    a: "Bold with double asterisks, italic with underscores, unordered lists with a dash, ordered lists with numbers, and hyperlinks in the form of a title in brackets followed by a URL in parentheses."
  - q: "Which features are not supported?"
    a: "Headers, tables, images, preformatted text and blockquotes are listed as unsupported. Markdown is also not supported for OAuth sign-in cards in bots."
  - q: "How do I make a line break?"
    a: "In lists, use a single carriage return or newline between items. Two newlines in a list indent the next element. Anywhere else in a TextBlock, use two newlines to start a new line."
  - q: "Can cards contain emoji and mentions?"
    a: "Learn says emoji are supported and that you should set charset UTF-8 in REST headers. Mentions use the at tag around the user name plus a mention object in the msteams entity. Channel and team mentions are not supported in bot messages."
---

Teams Adaptive Cards accept a limited Markdown syntax in three places: the `TextBlock` element, `Fact.Title` and `Fact.Value`. You get bold, italic, ordered and unordered lists, and links. Headers, tables, images, preformatted text and blockquotes are not supported, and HTML is not supported in Adaptive Cards at all. This article summarises the Markdown section of Microsoft Learn's page on formatting text in Teams cards, with my notes on how to use it.

## Where Markdown applies

Learn says Markdown is supported in the Adaptive Card `TextBlock`, `Fact.Title` and `Fact.Value`. Two related points keep people from guessing wrong:

- HTML is not supported in Adaptive Cards.
- Connector cards for Microsoft 365 Groups support Markdown and a limited set of HTML. That is a different card type with different rules.
- Markdown is not supported for OAuth sign-in cards in bots.

So if a card shows literal asterisks, first check whether you are inside one of the three supported fields and whether the card type is an Adaptive Card.

## The supported styles

Learn lists these styles with their syntax:

| Style | Markdown |
| --- | --- |
| Bold | `**Bold**` |
| Italic | `_Italic_` |
| Unordered list | `- Item 1\r- Item 2` |
| Ordered list | `1. Green\r2. Orange` |
| Hyperlink | `[Title](url)` |

Notice that italics use underscores in Learn's example, and the list items are separated by `\r` inside the JSON string.

## What is not supported

The page says these are not supported: headers, tables, images, preformatted text and blockquotes. If you need structure that Markdown cannot give you, the card elements themselves are the tool. Learn's page covers further card features in other sections, for example CodeBlock, containers, a responsive layout and an overflow menu, which I list below but did not use here.

## Newlines are the usual trouble

Newlines behave differently in lists than elsewhere, and this is where most formatting problems start:

- **In lists**, use `\r` or `\n` between items. Learn warns that `\n\n` in a list indents the next element.
- **Elsewhere in a TextBlock**, use `\n\n` to start a new line.

A short example in the shape Learn describes:

```json
{
  "type": "TextBlock",
  "text": "**Status**\n\nOpen items:\r- Review draft\r- Send notes",
  "wrap": true
}
```

The first paragraph break uses two newlines. The list uses a single carriage return between items. I wrote this example from the rules above, so test it in your own card before relying on it.

## Emoji, mentions and size limits

Learn says emoji are supported in cards. If you send the card through REST, set `charset=UTF-8` in the headers so the characters survive.

Mentions use an `<at>username</at>` tag in the text together with the `msteams` mention object. Learn adds that channel and team mentions are not supported in bot messages.

Message size is limited: 28 KB for Incoming Webhooks and 100 KB for bot messages. A card with many long text blocks can reach these limits sooner than you expect.

## Inline images

Markdown images are not supported, but the page describes inline images with these limits: png, jpg or gif, within 1024 by 1024 pixels and under 1 MB. Animated gif is not supported. For pictures, use the card's image support instead of Markdown syntax.

## Rendering differs by client

Learn says rendering can differ between desktop, iOS and Android. Check your card in all three before you roll it out to a team.

## How I would build a formatted card

This section is my advice, not a Microsoft statement.

1. **Start with the supported five.** Bold for the label, plain text for the value, a list when you have three or more parallel items, and a link for the call to action. That covers most notification cards.
2. **Use Facts for label and value pairs.** Since Markdown works in Fact.Title and Fact.Value, you can bold part of a value without a custom layout.
3. **Escape or test special characters.** Underscores and asterisks inside identifiers, such as a file name with underscores, can be read as formatting. Test with real data, not sample text.
4. **Keep line breaks explicit.** Decide per field whether you are in a list or in running text, and use the matching newline rule from the section above.
5. **Test on a phone.** The page warns about client differences, and mobile is where long lines wrap oddly.
6. **Do not put sensitive text in a card you cannot recall.** That is outside what the page covers, but cards in channels are visible to everyone in them.

## Other card topics on the same page

The page also has sections on information masking, full width cards, responsive layout, typeahead, Stageview, CodeBlock, an overflow menu, borders, scrollable containers, compound buttons, icons and ratings. I read the Markdown section closely for this article and only noted the other headings, so use the page itself for those features.

## A checklist before you send a card

This section is my advice, not a Microsoft statement.

- Is the formatted text inside a TextBlock, Fact.Title or Fact.Value?
- Does the card avoid headers, tables, images and blockquotes in Markdown?
- Are list items separated by a single newline and other paragraphs by two?
- Is the payload under the size limit for the channel, 28 KB for Incoming Webhooks or 100 KB for bot messages?
- Did you set UTF-8 if the card contains emoji and goes through REST?
- Does the card look acceptable on desktop, iOS and Android?

Keeping a short checklist like this next to your card templates catches the common formatting problems before users see them.

## Related

- [Adaptive Cards](https://www.m365.fm/entity/adaptive-cards/)
- [Markdown](https://www.m365.fm/entity/markdown/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Format Text in Cards - Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/platform/task-modules-and-cards/cards/cards-format)
