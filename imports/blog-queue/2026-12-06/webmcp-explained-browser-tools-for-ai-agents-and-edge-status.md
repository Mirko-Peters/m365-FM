---
title: "WebMCP Explained: Browser Tools for AI Agents and Where Edge Stands"
summary: "What WebMCP is: a proposed browser API that lets web pages register tools for AI agents, how it relates to MCP, its documented API and limits, and Microsoft Edge's testing and origin trial status."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [mcp, microsoft-edge]
keypoints:
  - "WebMCP is a proposed browser API that lets a web page register tools that AI agents can call. The browser mediates access."
  - "The proposal is authored by Microsoft and Google engineers and is open source. It is a proposal, not a finished standard."
  - "Tools are registered in JavaScript through navigator.modelContext, with a name, description, input schema and execute callback."
  - "It needs an open browsing context. Headless tool calls and built-in tool discovery are not part of the proposal."
  - "Microsoft Edge said in September 2026 that its implementation is ready for testing. An origin trial runs until March 30, 2027."
faq:
  - q: "What is WebMCP?"
    a: "According to the WebMCP proposal, it is a proposed browser API that lets a web page register tools that AI agents can call. Only a top-level browsing context, such as a tab, can act as the provider. Tool calls run as JavaScript callbacks in the page, and the browser arbitrates access."
  - q: "Is WebMCP the same as MCP?"
    a: "No. The proposal says WebMCP's primitives align with MCP's tools, resources and prompts, and that MCP-compatible agents can use WebMCP tools with minimal translation. WebMCP itself is a web API that runs in the browser page."
  - q: "How does a page register a tool?"
    a: "The proposal describes navigator.modelContext with provideContext, which replaces previously registered tools, and registerTool and unregisterTool for single tools. A tool has a name, a description, an inputSchema and an execute callback. The proposal notes that the examples and prose are not fully consistent."
  - q: "Can I test WebMCP in Microsoft Edge?"
    a: "The Microsoft Edge blog of September 21, 2026 says Edge's implementation is ready for testing and mentions samples and a debugging extension in the webmcp-labs repository. A Microsoft Edge origin trial page lists an expiry of March 30, 2027 and calls the feature experimental."
  - q: "Does WebMCP connect to Microsoft 365 agents?"
    a: "The pages I read do not mention Microsoft 365 agents, Copilot or Agent 365 in connection with WebMCP. They describe a browser API for sites and browsing agents. Any link to Microsoft 365 is not documented there."
---
WebMCP lets a website tell an AI agent what it can do. Instead of the agent guessing from the page layout, the page registers named tools in JavaScript, and the browser controls how an agent can call them. This article explains the idea, the documented API, the limits and what Microsoft Edge has said, using only the pages I could read.

## The idea in one paragraph

WebMCP is described in its proposal as a browser API that lets a web page register tools for AI agents. The page acts as the provider, and only a top-level browsing context such as a tab can do this. Tool calls run as JavaScript callbacks in the page. Microsoft's Edge team describes it as a web API, specified with the Web Machine Learning Community Group, for human-agent collaboration on your site. It lets you expose existing front-end code as structured tools that a browsing agent can use.

## Who is behind it and how final it is

The proposal lists authors from Microsoft (Brandon Walderman and Andrew Nolan) and Google (David Bokan, Khushal Sagar and Hannah Van Opstal). The document is hosted under webmachinelearning.github.io and is open source. It carries a date of August 13, 2025, lists open questions and TODO items, and is not presented as a finished standard. Expect details to change.

## How it relates to MCP

The proposal says WebMCP's primitives align with MCP's tools, resources and prompts. The browser implements the data layer, so the web is not tied to one MCP version, and MCP-compatible agents can use WebMCP tools with minimal translation. In WebMCP the tools live in an open web page, and the browser mediates access.

## The documented API

From the proposal:

- `navigator.modelContext.provideContext({ tools: [...] })` registers tools. Each call replaces earlier tools and context.
- `registerTool()` and `unregisterTool(name)` add or remove single tools without resetting the rest.
- A tool descriptor has a `name`, a `description`, an `inputSchema` in a JSON Schema style and an `execute(args, agent)` callback.
- `agent.requestUserInteraction()` asks the user for input, such as a confirmation, while a tool runs.
- Feature detection uses `"modelContext" in window.navigator`.

A declarative approach, such as a manifest, is mentioned only as a future possibility with the syntax to be decided. The proposal also notes an inconsistency between its prose, which mentions an `agent` property on `Window`, and its code examples, which use `navigator.modelContext`.

## Limits stated in the proposal

- It needs an open browsing context. Headless tool calls are a future consideration.
- Developers must keep the UI in sync when tool calls change state.
- Complex UIs may need refactoring.
- There is no built-in tool discovery mechanism.
- There is no dedicated security section. The text mentions browser-mediated access with user consent, local handling of tools and browser policies for iframes.

## What Microsoft Edge says

The Microsoft Edge blog post "New in Edge for developers" of September 21, 2026 says Edge's WebMCP implementation is ready for testing. Microsoft points to samples and a browser extension for running and debugging WebMCP tools in the `webmcp-labs` repository. The post names no flag for enabling it. It says you can test locally or register for an origin trial.

The Edge origin trial page for WebMCP describes the feature as letting websites register tools for agents hosted by the site or in Chrome. It lists an expiry date of March 30, 2027 and no Edge version numbers. Registration needs a GitHub sign-in, acceptance of the terms and a domain. You then add the token as a `<meta>` tag or an `Origin-Trial` header. The terms say the feature is experimental, may change or end at any time and may never ship beyond the trial. They recommend feature detection so sites degrade gracefully.

## A cautious path for site owners

1. Pick one stable, low-risk page action, such as search or filtering.
2. Describe it as a tool with a clear name, description and input schema.
3. Wrap it in feature detection so the page works without WebMCP.
4. Ask for user confirmation with `requestUserInteraction()` for anything that changes data.
5. Test in an Edge build or origin trial and expect the API to change.

## What the sources do not say

None of the pages I read connect WebMCP to Microsoft 365 agents, Copilot or Agent 365. They also do not name stable Edge version numbers, a default-on date or a security model beyond the points above. Treat claims that go further as unverified.

## Related

- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [Microsoft Edge](https://www.m365.fm/entity/microsoft-edge/)

## Sources

- [WebMCP proposal (Web Machine Learning Community Group)](https://webmachinelearning.github.io/webmcp/docs/proposal.html)
- [New in Edge for developers, September 2026 (Microsoft Edge Blog)](https://blogs.windows.com/msedgedev/?p=26265)
- [WebMCP origin trial (Microsoft Edge Developer)](https://developer.microsoft.com/microsoft-edge/origin-trials/trials/0b76fe60-b266-458e-a285-04e375c0c31a)
