#!/usr/bin/env python3
"""Schreibt data/seo_overrides.json: Titel und Beschreibung (nur <title>, meta description, og:description) fuer Seiten mit hoher Sichtbarkeit und niedriger CTR
(Search-Console-Export vom 20.11.2026: Position 3-9, mind. 8000 Impressionen). Schluessel = Pfad der Seite (kanonisch, ohne Domain).
Texte sind von Hand geschrieben und stuetzen sich auf die Ueberschriften der Beitraege; die sichtbare H1 bleibt unveraendert."""
import json, re, sys
from pathlib import Path

B = "/community/u/mirko-p/blog/"
BLOG = {
 "troubleshooting-passkey-login-fails-complete-guide-for-microsoft-and-beyond": ("Passkey Login Fails? Causes and Fixes for Microsoft", "Passkey sign-in not working? Check device and platform support, security key vs passkey mix-ups, account verification, sync and network issues."),
 "muting-conversations-in-microsoft-teams-a-complete-guide": ("How to Mute a Conversation in Microsoft Teams", "Mute a Teams chat or channel in a few clicks: desktop vs mobile steps, rollout status of the feature, and tips so important mentions still get through."),
 "fixing-approve-sign-in-request-not-showing-in-microsoft-authenticator": ("Approve Sign-In Request Not Showing? Authenticator Fix", "No approval prompt in Microsoft Authenticator? Fix silent notification failures, check device setup, use other sign-in methods and recover access."),
 "how-to-manage-multiple-accounts-in-onedrive": ("How to Use Multiple Accounts in OneDrive", "Add and switch between personal and work or school OneDrive accounts, keep folders clearly named, and fix the most common problems with several accounts."),
 "priority-notifications-in-teams-the-complete-guide-for-effective-communication": ("Priority Notifications in Teams: Setup and Rules", "Set up priority notifications in Teams for chats, channels and meetings, work with Focus mode, and check the licensing and admin settings you need."),
 "microsoft-teams-window-team-or-channel-disappear-fix-missing-teams-and-channels-in-the-microsoft-app": ("Teams or Channel Disappeared? How to Get It Back", "Missing team or channel in Microsoft Teams? See why teams and channels hide or vanish, how to show them again, and the specific fixes for Mac users."),
 "noise-suppression-in-teams-guide-for-clearer-meetings": ("Teams Noise Suppression: How to Turn It On", "Turn on noise suppression in Teams audio settings before or during a meeting, tune headset and profile settings, and improve call audio beyond the filter."),
 "pinning-chats-in-teams-a-complete-guide": ("How to Pin Chats in Microsoft Teams", "Pin and unpin chats in Teams on desktop, web and mobile, pin messages in channels, and learn the pin limits and admin controls that apply."),
 "live-captions-in-teams-the-complete-guide-for-meetings-and-accessibility": ("Live Captions in Teams: Turn On and Customize", "Turn on live captions in a Teams meeting, set the spoken language, use translated captions for events, and fix caption problems and privacy questions."),
 "bandwidth-requirements-explained-the-complete-guide-for-microsoft-teams-and-digital-workplaces": ("Teams Bandwidth Requirements for Calls and Video", "How much bandwidth Microsoft Teams needs for calls, video and screen sharing, how to measure it, and how to plan capacity for home and office."),
 "mentions-explained-in-microsoft-teams-the-complete-guide": ("@Mentions in Teams: How They Work and When to Use", "How @mentions work in Microsoft Teams: person, channel and tag mentions, step-by-step use, notification options, and how to avoid too much noise."),
 "copilot-not-responding-troubleshooting-guide-for-microsoft-users": ("Copilot Not Responding? Quick Fixes for Microsoft 365", "Microsoft Copilot not responding? Check connection, account and licence, service health and app availability, then try the quick and advanced fixes."),
 "recording-storage-in-microsoft-teams-onedrive-and-sharepoint-explained": ("Where Teams Meeting Recordings Are Stored", "Teams recordings are saved in OneDrive or SharePoint depending on the meeting type. See where to find them, who can access them, and how retention works."),
 "copilot-performance-issues-explained-causes-solutions-and-the-path-forward": ("Copilot Performance Issues: Causes and Fixes", "Why Microsoft Copilot feels slow or gives weak results: service health, network, licensing, weak prompts and data governance, with fixes for each cause."),
 "effective-solutions-for-teams-crashing-fix-microsoft-teams-app-instability": ("Microsoft Teams Keeps Crashing? How to Fix It", "Fix Teams crashes on Windows, Mac and mobile: update or reinstall the app, clear the cache, check profiles, add-ins, graphics acceleration and permissions."),
 "microsoft-teams-free-vs-paid-whats-the-real-difference": ("Microsoft Teams Free vs Paid: What You Get", "Teams free vs paid compared: chat, meetings and calling limits, storage and files, security and compliance features, and when an upgrade makes sense."),
 "browser-issues-with-teams-troubleshooting-and-best-practices": ("Teams in the Browser Not Working? Fixes That Help", "Fix Teams problems in the browser: supported browsers, camera and microphone permissions, login and loading errors, plus step-by-step best practices."),
 "using-emojis-gifs-and-stickers-in-microsoft-teams-a-complete-guide": ("Emojis, GIFs and Stickers in Teams: How to Use Them", "Add emojis, reactions, GIFs and stickers to Teams chats, personalize them, create custom stickers, and use them accessibly and professionally."),
 "sharing-code-snippets-in-teams-for-effective-collaboration": ("How to Share Code Snippets in Microsoft Teams", "Share code in Teams chats and channels so it stays readable: formatting options, where to share which kind of code, and secure tools for code sharing."),
 "sharepoint-audit-log-governance-the-complete-guide": ("SharePoint Audit Log: Setup, Search and Governance", "How to configure, access and analyze SharePoint audit logs, what they capture, and how to govern them as part of your wider Microsoft 365 compliance setup."),
 "microsoft-365-f3-vs-e3-choosing-the-right-license-for-your-workforce": ("Microsoft 365 F3 vs E3: Differences and Cost", "F3 vs E3 compared: features, security and compliance, user roles and cost ($8 vs $32 per user), plus how to cut licence waste by matching plans to roles."),
 "teams-desktop-vs-web-vs-mobile-which-microsoft-teams-platform-is-right-for-you": ("Teams Desktop vs Web vs Mobile: Which to Use", "Teams desktop, web and mobile compared: feature differences, performance and accessibility, and which app fits which task, with deployment advice."),
 "microsoft-365-f1-vs-f3-licensing-explained-choosing-the-right-plan-for-frontline-workers": ("Microsoft 365 F1 vs F3: Which Frontline Plan?", "F1 vs F3 for frontline workers: core features, what F3 adds, apps, security and compliance, device management and Teams capabilities side by side."),
 "understanding-anonymous-users-in-microsoft-teams-meetings": ("Anonymous Users in Teams Meetings: Settings and Risks", "Who can join a Teams meeting without signing in, how anonymous users are verified, which admin controls apply, and how to block them with PowerShell."),
 "understanding-hub-site-associations-in-sharepoint": ("SharePoint Hub Site Association: How to Connect Sites", "Associate a SharePoint site with a hub: request a hub, manage who can connect, automate association, and how branding, navigation and governance work."),
 "using-reactions-in-teams-chat-for-better-collaboration": ("Reactions in Teams Chat: How to Use Them", "Use reactions in Teams chat to acknowledge messages without extra replies: how to get started, skin tone options, availability, and professional use."),
 "fixing-video-issues-in-teams-step-by-step-troubleshooting-guide": ("Teams Camera or Video Not Working? Step-by-Step Fix", "Fix Teams camera and video problems: check permissions and device selection, update Teams and drivers, test your setup, and use the advanced fixes."),
 "fix-screen-sharing-not-working-comprehensive-troubleshooting-guide": ("Screen Sharing Not Working in Teams? Fixes", "Why Teams screen sharing fails and how to fix it: permission and security settings, updates, hardware, network and platform-specific solutions."),
 "using-markdown-in-teams-chat-what-every-user-should-know": ("Markdown in Teams Chat: What Works and What Doesn't", "Which Markdown formatting works in Microsoft Teams chat, how to format text and code, and what to do when Markdown support falls short."),
 "version-history-in-teams-files-everything-you-need-to-know": ("Version History in Teams Files: How to Restore", "See and restore earlier versions of files in Teams, configure version settings, avoid conflicts while co-authoring, and fix common version problems."),
 "voicemail-in-teams-the-complete-guide-for-microsoft-teams-users-and-admins": ("Voicemail in Microsoft Teams: Setup and Troubleshooting", "Set up and check voicemail in Teams on desktop and mobile, configure cloud voicemail as an admin, use automatic triage and fix voicemail problems."),
 "sharepoint-site-limits-explained-essential-guide-for-microsoft-365": ("SharePoint Limits: Storage, Items and File Paths", "SharePoint Online limits explained: storage by plan, list and library item maximums, file path rules, permission limits and workarounds."),
 "understanding-external-identities-pricing-in-microsoft-entra-id": ("Microsoft Entra External ID Pricing Explained", "How Entra External ID is billed: monthly active users, linking a tenant to an Azure subscription, authentication methods, and ways to keep costs down."),
 "fixing-teams-login-issues-the-essential-guide-for-microsoft-teams-users": ("Can't Sign In to Microsoft Teams? How to Fix It", "Teams login not working? Check service status and authentication, clear the cache, repair the app, and follow advanced steps for persistent errors."),
 "copilot-audit-logs-explained": ("Copilot Audit Logs: Where to Find Them", "Find and analyze Copilot audit logs in Microsoft Purview: user and admin activity, Copilot Studio and GitHub Copilot, and known coverage gaps."),
 "fixing-notification-problems-on-samsung-devices-and-microsoft-teams": ("Teams Notifications Not Working on Samsung Phones", "Fix Teams notifications on Samsung: check Do Not Disturb and Focus modes, app permissions, battery optimization and Quick Settings."),
 "troubleshooting-call-issues-step-by-step-solutions-for-microsoft-teams-and-beyond": ("Dropped or Poor Calls in Teams? Step-by-Step Fixes", "Fix dropped calls and poor call quality: basic checks first, then network, coverage, SIM and device issues, Wi-Fi calling and VoIP."),
 "versioning-in-sharepoint-the-complete-guide-for-modern-document-management": ("SharePoint Versioning: Settings and Best Practices", "Configure version history in SharePoint Online, understand intelligent versioning, manage storage and retention, and clean up old versions automatically."),
 "troubleshooting-network-issues-in-microsoft-teams": ("Teams Network Problems: How to Troubleshoot", "Fix Microsoft Teams network problems step by step: clear the Teams cache, check latency, packet loss, DNS, firewall and VPN, plus admin-level solutions."),
 "group-chats-vs-channels-in-microsoft-teams-how-to-choose-for-better-collaboration": ("Teams Group Chat vs Channel: Which to Use", "Group chats vs channels in Teams: key differences, files and tabs, access and permissions, public vs private channels, and how to organize them."),
 "mastering-sharepoint-guest-access-controls-for-secure-collaboration": ("SharePoint Guest Access: Controls and Best Practices", "Control guest access in SharePoint: external sharing settings, invitations and approval, compliance, best practices and integration with Microsoft 365."),
 "onedrive-personal-vs-business-understanding-key-differences-and-best-use-cases": ("OneDrive Personal vs Business: Key Differences", "OneDrive Personal vs OneDrive for Business: storage, sync, security, collaboration, SharePoint integration, and why the two accounts get confused."),
 "azure-ad-join-vs-hybrid-join-vs-registered-devices-understanding-the-differences-and-choosing-the-right-path": ("Entra Join vs Hybrid Join vs Registered Devices", "Azure AD (Entra) join vs hybrid join vs registered devices: how each works, device trust and compliance, management with Intune, and how to choose."),
 "how-to-fix-the-aadsts50126-invalid-username-or-password-error-in-microsoft-365": ("AADSTS50126 Invalid Username or Password: Fix", "Fix AADSTS50126 in Microsoft 365: what the error means, step-by-step solutions for users, admin troubleshooting for connected systems, and prevention."),
 "how-to-fix-microsoft-authenticator-push-notification-delays": ("Authenticator Push Notifications Delayed? Fixes", "Fix delayed or missing Microsoft Authenticator push notifications: enable alerts, check network and time sync, battery and background limits."),
 "microsoft-teams-logs-explained": ("Microsoft Teams Logs: How to Find and Read Them", "Where to find Microsoft Teams logs, how to collect and analyze them, and how to use them for troubleshooting and operational insight."),
 "how-to-fix-aadsts50020-user-account-not-found-in-tenant": ("AADSTS50020: User Account Not Found in Tenant – Fix", "Fix AADSTS50020 (user account not found in tenant): what the identity provider error means, root causes, effective solutions and how to prevent it."),
 "mastering-token-lifetime-policies-in-microsoft-entra-id": ("Entra ID Token Lifetime Policies: How to Configure", "Configure token lifetime policies in Microsoft Entra ID: setup, verification, Conditional Access recommendations and how to validate tokens securely."),
 "understanding-the-aadsts50011-redirect-uri-mismatch-error": ("AADSTS50011 Redirect URI Mismatch: How to Fix It", "Fix AADSTS50011: the redirect URI sent by your app must exactly match one registered in Microsoft Entra ID. See causes, error messages and the fix."),
 "sensitivity-label-not-applying-troubleshooting-and-solutions-for-microsoft-365-and-power-bi": ("Sensitivity Label Not Applying? Troubleshooting Guide", "Why sensitivity labels don't apply in Microsoft 365 and Power BI: licensing and configuration prerequisites, step-by-step checks, and inheritance issues."),
 "outlook-label-not-showing-troubleshooting-sensitivity-labels-missing-in-microsoft-365": ("Outlook Sensitivity Label Not Showing: How to Fix", "Sensitivity labels missing in Outlook? Recognize the symptoms, check configuration requirements, label policy scope and licensing, and resolve it."),
 "teams-slow-performance-fixes-the-complete-guide-for-microsoft-teams-users": ("Microsoft Teams Slow? How to Speed It Up", "Fix a slow Microsoft Teams: quick checks, app-level fixes, cache, new vs classic Teams, network and device readiness, and preventative best practices."),
 "mastering-copilot-prompts-for-data-analysis-in-microsoft-365": ("Copilot Prompts for Data Analysis in Excel and Teams", "Copilot prompts for data analysis in Excel, Outlook and Teams: prompt types, task-based strategies for business intelligence and advanced techniques."),
 "mastering-copilot-prompts-for-email-writing-efficiency": ("Copilot Prompts for Writing Emails in Outlook", "Copilot prompts to draft, reply to and organize email in Outlook: tone control, task-based workflows, executive communication and Copilot's limits."),
 "temporary-access-pass-not-working-troubleshooting-guide": ("Temporary Access Pass Not Working? How to Fix It", "Fix Temporary Access Pass (TAP) problems: prerequisites, device and browser issues, Conditional Access blocks, expiration, and registering security keys."),
 "fixing-aadsts53003-blocked-by-conditional-access-in-microsoft-365-and-azure": ("AADSTS53003 Blocked by Conditional Access: Fix", "Fix AADSTS53003, sign-in blocked by Conditional Access: find the policy that blocks you, troubleshoot step by step and prevent it, incl. hybrid MFA."),
 "how-to-fix-a-user-stuck-in-microsoft-365-mfa-loop": ("Microsoft 365 MFA Loop: How to Fix It", "Fix a user stuck in the Microsoft 365 MFA loop: diagnose in the admin console, reset Authenticator, adjust Conditional Access, fix device issues."),
 "how-to-fix-mfa-prompts-every-login-in-microsoft-365-and-azure": ("MFA Prompt at Every Login? How to Reduce It", "Too many MFA prompts in Microsoft 365 and Azure? Tune Conditional Access and authentication settings, use managed devices and persistent sessions."),
 "copilot-prompts-for-outlook-productivity--inbox-efficiency": ("Copilot Prompts for Outlook: Email and Calendar", "Copilot prompts for Outlook: summarize unread email, draft replies, manage your inbox and plan your calendar, with a getting-started guide."),
 "understanding-aadsts700082-and-refresh-token-expired-errors-in-microsoft-oauth": ("AADSTS700082 Refresh Token Expired: How to Fix", "Fix AADSTS700082: what triggers the expired refresh token error, root causes of token expiration in Microsoft identity, the fix and how to prevent it."),
 "copilot-prompts-for-powerpoint-the-ultimate-guide": ("Copilot Prompts for PowerPoint: Templates and Tips", "Copilot prompts for PowerPoint: prompt structure, slide-specific templates, full-presentation workflows and how to polish the output for professional use."),
 "mastering-copilot-prompts-for-inbox-management-the-ultimate-guide": ("Copilot Prompts for Inbox Management in Outlook", "Copilot prompts to manage your inbox: advanced prompt strategies for Outlook and Teams, human-sounding replies, workflows and Copilot's limits."),
 "understanding-the-aadsts900561-endpoint-only-accepts-post-error": ("AADSTS900561: Endpoint Only Accepts POST – Fix", "Fix AADSTS900561: the endpoint only accepts POST requests. See common causes and solutions, how to debug the sign-in flow and prevent the error."),
}
OTHER = {   # weitere Seiten: Pfad -> (Titel, Beschreibung). Folgenseiten (EOP, Graph delta) haben schon suchintentnahe meta_title/meta_description und bleiben unveraendert.
    "/": ("M365: Microsoft 365 Podcast, Guides & Explainers", "Learn Microsoft 365, Copilot, Azure and Power Platform with podcast episodes, troubleshooting guides and animated explainers by Microsoft MVP Mirko Peters."),
    "/entity/word-online/": ("Word Online: What Is Word for the Web?", "Word for the web, also called Word Online, is the browser version of Word for writing and co-authoring documents without installing the desktop app."),
    "/entity/powerpoint-online/": ("PowerPoint Online: What Is PowerPoint for the Web?", "PowerPoint for the web, also called PowerPoint Online, is the browser version of PowerPoint for creating, presenting and co-authoring slide decks."),
}


def main():
    root = Path(__file__).resolve().parent.parent
    out, bad = {}, []
    for slug, v in BLOG.items():
        if not v: continue
        t, d = v
        out[f"{B}{slug}/"] = {"title": t, "description": d}
    for path, (t, d) in OTHER.items(): out[path] = {"title": t, "description": d}
    for k, v in out.items():
        if len(v["title"]) > 60: bad.append((k, "Titel", len(v["title"])))
        if not 100 <= len(v["description"]) <= 155: bad.append((k, "Beschreibung", len(v["description"])))
    if bad:
        for b in bad: print("Laenge:", *b)
        if "--force" not in sys.argv: sys.exit(1)
    (root / "data" / "seo_overrides.json").write_text(json.dumps(dict(sorted(out.items())), ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(len(out), "Eintraege")


if __name__ == "__main__":
    main()
