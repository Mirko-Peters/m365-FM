---
title: "How to Use Custom Skills With Copilot in PowerPoint"
summary: "Choose, invoke, upload and manage skills in Copilot in PowerPoint. Three ways to add a custom skill, the SKILL.md folder format with name and description, how to edit, hide and delete skills, and the known upload limits, based on the Microsoft Support page."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [copilot, powerpoint]
keypoints:
  - "A skill is a reusable, instruction-based capability that gives Copilot domain expertise, workflows and task guidance for repeatable tasks."
  - "Use a skill from the plus menu in the Copilot prompt field, Choose skills, or type it with an at-mention such as the skill name."
  - "Custom skills can be uploaded in the pane, pasted with Add skill, or placed in the Skills folder on OneDrive. Uploaded skills are for personal use only."
  - "Each skill needs its own folder with a SKILL.md file with name and description frontmatter. The folder name must match the name or Copilot skips it."
  - "Known limits: image and PDF files are not supported in uploads, and nested ZIP folders are not supported."
faq:
  - q: "What is a skill in Copilot in PowerPoint?"
    a: "The Microsoft Support page says a skill extends an AI model's capabilities. Skills are reusable, instruction-based capabilities that give Copilot domain expertise, workflows and task-specific guidance for repeatable tasks. You can choose from the skills available in the Copilot pane or create your own."
  - q: "How do I use a skill?"
    a: "Open Copilot in PowerPoint, select the plus sign menu in the prompt field and choose Choose skills. The list has built-in skills and custom skills you uploaded. Select one, or type it with an at-mention, for example at copyedit-this-presentation for a skill named copyedit-this-presentation."
  - q: "How do I add my own skill?"
    a: "The page lists three methods. Upload skill files in the pane under Choose skills, Manage skills, Add skill. Paste the skill into the Add skill form and select Add. Or add skill folders directly to the Skills folder in OneDrive through Settings, Manage skills, Custom skills, Create OneDrive folder, Open skills folder."
  - q: "What must a skill folder look like?"
    a: "Each skill needs its own folder with a SKILL.md file. SKILL.md has required frontmatter between three-dash lines with a name and a description that tells Copilot when to use the skill, then a body with instructions and no format restrictions. The folder name must match the name in SKILL.md, or Copilot skips the folder."
  - q: "Can others use the skills I upload?"
    a: "The page says skills uploaded in Copilot in PowerPoint are for personal use only. They are saved to your Skills folder on OneDrive."
---

Skills let you give Copilot in PowerPoint reusable instructions for tasks you repeat, such as editing a deck in a house style or writing a standard summary slide. This article follows the Microsoft Support page "Custom skills in Copilot in PowerPoint". It applies to PowerPoint for Microsoft 365, PowerPoint for Microsoft 365 for Mac and PowerPoint for iPad, and the page notes that Copilot may not be included in your subscription or may be restricted by your organization's settings.

## What a skill is

A skill extends what an AI model can do. Skills are reusable, instruction-based capabilities that give Copilot domain expertise, workflows and task-specific guidance for repeatable tasks. You can use the skills available in the Copilot pane or create your own.

## Use a skill

1. Open Copilot in PowerPoint.
2. Select the **+** menu in the prompt field.
3. Select **Choose skills**. The list contains built-in skills and custom skills that you uploaded.
4. Select a skill from the list, or type it with an at-mention. For example, `@copyedit-this-presentation` calls a skill with that name.

## Manage which skills Copilot uses

Open the **Settings** menu (the three dots in the upper-right corner) and select **Manage skills**. Toggle skills on or off. A skill that is off is no longer used automatically and no longer shows in the skill dropdown.

## Add a custom skill

The page offers three methods.

### Option 1: Upload in the pane

1. In the Copilot chat pane select **+**, then **Choose skills**.
2. Scroll to the end of the list and select **Manage skills**.
3. Select **Add skill**, then upload or drag and drop one or more skill files.

The skill is saved to your Skills folder on OneDrive and appears in the dropdown. If it does not show up, refresh in the **Manage skills** pane. Uploaded skills are for personal use only.

### Option 2: Paste into Add skill

In the **Add skill** menu in the Copilot pane, paste your skill into the form and select **Add**. It is saved to your Skills folder on OneDrive.

### Option 3: Work directly in OneDrive

1. In the Copilot pane open the **Settings** menu.
2. Select **Manage skills**, then **Custom skills**.
3. Select **Create OneDrive folder**.
4. Select **Open skills folder**.
5. Add your skill folders there.

## The skill format

- Each skill has its own folder containing a **SKILL.md** file.
- SKILL.md has two parts. The required **frontmatter** sits between `---` lines and holds a **name** and a **description** that tells Copilot when to use the skill. The **body** holds your instructions and has no format restrictions.
- The folder name must match the name in SKILL.md. Copilot skips folders whose names do not match.
- The page gives an example skill, `create-executive-summary-slide`, whose SKILL.md must be in a folder with the same name. For the standard, it refers to the Agent Skills specification at agentskills.io.

A minimal file following the described structure looks like this. The wording is my own example, not the page's:

```markdown
---
name: create-executive-summary-slide
description: Use when the user asks for an executive summary slide of the current deck.
---

Write a single slide that lists the three main messages of the deck in short sentences.
Use the existing slide master and keep the title under eight words.
```

## Edit, hide and delete

- Open **Manage skills** and select **Edit** or **Delete** below the skill.
- If you add, remove or rename a skill in OneDrive, select **Refresh** in the Custom skills dialog.
- To hide a skill without deleting its OneDrive folder, change the folder name so it no longer matches the name in SKILL.md.

## Known limitations

- ZIP uploads support file types including `md`, `txt`, `csv`, `json`, `xml`, `html`, `svg`, `py` and `js`.
- Image files such as PNG and PDF files are not currently supported.
- Nested ZIP folders are not currently supported.

## Writing useful skills (my advice)

This is my suggestion, not guidance from the page:

1. Write the description as a trigger. State when the skill should run, in the words a user would use.
2. Keep one skill to one task. A skill for a standard summary slide is easier to test than a large style guide.
3. Test with the at-mention first, so you know the skill works before you rely on automatic selection.
4. Keep skill names short and without spaces, since the folder name must match the name exactly.
5. Because uploaded skills are personal, share the SKILL.md file with colleagues in your team site and let each person add it, if the same behavior is wanted.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft PowerPoint](https://www.m365.fm/entity/powerpoint/)

## Sources

- [Custom Skills in Copilot in PowerPoint (Microsoft Support)](https://support.microsoft.com/powerpoint/copilot/copilot-in-powerpoint-skills)
