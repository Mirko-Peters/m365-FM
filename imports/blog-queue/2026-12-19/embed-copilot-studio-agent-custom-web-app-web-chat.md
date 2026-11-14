---
title: "Embed a Copilot Studio Agent in a Custom Web App With Bot Framework Web Chat"
summary: "How to put a published Copilot Studio agent into your own web app with the Bot Framework Web Chat canvas: token endpoint, sample page, SSO, connection popups and the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [copilot-studio, microsoft-bot-framework, azure-bot-service]
keypoints:
  - "Learn offers three routes: the Web Chat based sample page for a live website, the Direct Line token endpoint for native or custom apps, and the Microsoft 365 Agents SDK."
  - "The page needs the agent's token endpoint. Never put a Direct Line secret into browser or mobile code. A token only grants access to one conversation."
  - "The demo website is for testing only and must not be shared with customers. Use the live website sample or a custom canvas for production."
  - "SSO for a custom website needs manual Microsoft Entra ID authentication and two separate app registrations: one for authentication and one for the canvas page."
  - "If a connection popup uses another origin, add only that reviewed origin to styleOptions.callURLActionTrustedOrigin. Never use a wildcard."
faq:
  - q: "Where do I find the token endpoint for my agent?"
    a: "Microsoft Learn's custom app and SSO articles say to open the agent in Copilot Studio, select Channels, open the Mobile app tile and select Copy next to Token Endpoint. The older canvas customization article describes the same copy button under a different channel tile, so check what your Channels page shows."
  - q: "Can I use the demo website for customers?"
    a: "No. Learn states that the demo website is not intended for production use and that its URL should not be shared with customers. Publish to a live website with the sample page, or build a custom canvas, instead."
  - q: "Is it safe to put a Direct Line secret in my JavaScript?"
    a: "No. Learn says not to put a Direct Line secret in browser or mobile app code. Use the Copilot Studio token endpoint, which returns a token and an expires_in value. The token grants access to a conversation and is not an end-user sign-in token."
  - q: "Does SSO work with the demo website or Azure Bot Service channels?"
    a: "According to the Learn SSO article, SSO is supported on the custom website, Teams, SharePoint and Omnichannel live chat, but not on the demo website, Azure Bot Service channels, Facebook or the mobile app channel. It is also not supported when the agent is published to Power Pages."
  - q: "Do the Learn pages say which Web Chat version to use?"
    a: "No. The sample loads webchat.js from the botframework-webchat latest path, and the pages do not discuss pinning a version. Pinning is a decision for your own change control."
---

To embed a Copilot Studio agent in a custom web app with Bot Framework Web Chat, publish the agent, copy its token endpoint from the Channels page, and load the Web Chat library in your page with that endpoint. Microsoft Learn provides a complete sample `index.html` for this. Everything else, such as SSO, styling and popups, builds on that page.

## Choose the right integration route

Learn describes several ways to connect a published agent to your own app:

- **Live website sample.** A standalone HTML page that uses the Bot Framework Web Chat library. Hand it to your web developer. The site can be external or internal, for example a SharePoint site.
- **Custom canvas.** Learn calls this the advanced option, based on the Bot Framework Web Chat canvas. It says it needs development experience and supports full customization.
- **Direct Line.** For a native app, a custom web interface or an adapter to another service. The agent exposes a token endpoint for this.
- **Microsoft 365 Agents SDK.** Learn lists this as a separate path for web or native apps. The pages read for this article do not describe it in detail.

The demo website is a different thing. Learn says it is for testing with teammates and stakeholders, is not intended for production use, and that its URL should not be shared with customers.

## Step 1: Publish the agent and check authentication

1. Publish the agent. If it does not respond later, Learn lists "make sure the agent is published" as the first check.
2. Go to **Settings** > **Security** > **Authentication** and choose an option.

Learn describes three options: **No authentication**, **Authenticate with Microsoft** and **Authenticate manually**. With no authentication, anyone with the link, or anyone who finds the agent on your website, can chat with it, and the agent can only reach public information. If you need authentication on other channels, Learn says to choose **Authenticate manually**. Changes take effect after you publish.

## Step 2: Get the token endpoint

In Copilot Studio, select **Channels**, open the **Mobile app** tile and select **Copy** next to **Token Endpoint**. The custom app and SSO articles use this path. The older canvas customization article describes the copy button under another channel tile, so if your Channels page differs, follow the tile that shows a Token Endpoint field.

Learn adds that this is the Copilot Studio token endpoint, not the Direct Line `tokens/generate` endpoint. A call returns a JSON body with `token`, `expires_in` (3600 in the example) and `conversationId`. Use the returned `expires_in` value instead of assuming a lifetime.

## Step 3: Use the sample page

Save the sample HTML from Learn as `index.html` and replace this line:

```javascript
const tokenEndpoint = "<YOUR TOKEN ENDPOINT>";
```

Open the page in a modern browser such as Microsoft Edge and test the agent. According to Learn, the sample:

- loads `webchat.js` from the `botframework-webchat` CDN path;
- derives the regional Direct Line URL from the token endpoint through `/powervirtualagents/regionalchannelsettings`;
- sends a `startConversation` event on connect, which runs the Greeting system topic;
- provides a floating chat button, a popup window and a **Restart Conversation** button that fetches a new token;
- switches the popup to full screen at 768 pixels width and below.

Styling goes through `styleOptions`. Keys in the sample include `accent`, `backgroundColor`, `botAvatarImage`, `userAvatarImage`, `bubbleBackground` and `sendBoxBackground`. For icons without a URL, Learn says a Base64-encoded image string works. The full property list is in the Web Chat customization documentation.

The sample code is provided as is, without a service level agreement or support, and for use with Copilot Studio only.

## Step 4: Add single sign-on

SSO signs in users who are already signed in to the page that hosts the agent. Learn lists five main steps:

1. Configure manual authentication with Microsoft Entra ID.
2. Create an app registration for your custom canvas.
3. Authorize the canvas app for the authentication app's custom scope.
4. Add the scope to the agent configuration.
5. Configure the client-side code of the canvas.

Key details from the article:

- Create two registrations, an authentication app registration and a canvas app registration. Learn says not to reuse one registration for both.
- Under the authentication registration, copy the scope from **Expose an API**. Paste it into **Token exchange URL (required for SSO)** under **Settings** > **Security** > **Authentication**, then save and publish.
- Add the canvas app's client ID under **Authorized client applications** with the token exchange scope.
- On the canvas registration, add a **SPA** platform with your page URL as redirect URI and turn on access tokens and ID tokens for implicit and hybrid flows.
- Use the complete Entra ID SSO sample from the CopilotStudioSamples repository, including its Web Chat middleware. Keep a customized user ID within the sample's 64-character limit.
- Keep the fallback sign-in card in case token exchange fails.

SSO is supported for the custom website, Teams, SharePoint and Omnichannel live chat. It is not supported for the demo website, Azure Bot Service channels, Facebook or the mobile app channel, and not when the agent is published to Power Pages. Guest users cannot get AI-generated answers from SharePoint and Graph connector data sources in SSO-configured apps.

## Step 5: Handle connection popups safely

When an agent needs a user connection, the canvas receives an Adaptive Card and your canvas must handle `Action.OpenUrlDialog`. Learn's guidance:

- Accept only absolute `http://` or `https://` URLs.
- Trust only origins you control or that your security team has allowlisted.
- If the connection window has another origin than the chat page, add only the reviewed origin to `styleOptions.callURLActionTrustedOrigin`. Do not use a wildcard.
- Use the chat page's exact origin as the `postMessage` target origin, not `*`, and validate `event.source` and `event.origin`.
- Do not treat closing the window as a successful connection.

The section on continuing after successful connection setup is marked as preview documentation and not meant for production use.

## Limits and checks

| Item | What Learn says |
|---|---|
| Messages per environment | 8,000 requests per minute per Dataverse environment on a paid plan |
| Generative AI messages | Per-environment limits that depend on billing capability, for example 100 per minute for pay-as-you-go |
| Response streaming | Five-minute timeout in the web app and Teams, per the quotas page |
| Direct Line access | `*.directline.botframework.com` must be reachable over HTTPS and WebSocket for Web Chat |

If the agent does not answer, check that it is published, that the token endpoint is correct, and that it sits inside double quotation marks after the `=` sign. Learn does not document pinning a Web Chat version, so decide for yourself whether to replace the `latest` path with a fixed one.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft Bot Framework](https://www.m365.fm/entity/microsoft-bot-framework/)
- [Azure Bot Service](https://www.m365.fm/entity/azure-bot-service/)

## Sources

- [Connect an agent to a custom app (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-custom-application)
- [Publish an agent to a demo or live website (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-web-channels)
- [Customize the Web Chat canvas (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/customize-default-canvas)
- [Configure SSO for agents on custom websites (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-sso)
- [End-user authentication in Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)
- [Quotas and limits for Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)
