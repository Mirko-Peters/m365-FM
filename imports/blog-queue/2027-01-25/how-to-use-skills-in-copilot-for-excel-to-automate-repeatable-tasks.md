---
title: "How to Use Skills in Copilot for Excel to Automate Repeatable Tasks"
summary: "How to pick Microsoft-managed skills with the Add menu or an @mention, switch skills on and off, and create custom skills in Copilot in Excel: skill-builder, recording a task, or uploading a SKILL.md folder to OneDrive. Format rules, refresh and removal, from the Microsoft Support page."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [copilot, excel, onedrive, agent-skill]
keypoints:
  - "Skills give Copilot in Excel instructions for repeatable tasks such as reconciling accounts, analyzing data and formatting workbooks."
  - "Use a skill through the Add menu and Choose plugins and skills, or type an @mention such as @clean-data in your prompt."
  - "Microsoft-managed skills named on the page are @brandkit, @chart-design, @clean-data, @skill-builder and @theme-design."
  - "Create custom skills with @skill-builder, by recording a task, or by uploading a folder with a SKILL.md file to the skills folder in OneDrive."
  - "SKILL.md needs a name and a description in its frontmatter, and the skill folder must share the name exactly. Renaming the folder removes the skill from the list."
faq:
  - q: "What is a skill in Copilot in Excel?"
    a: "The Microsoft Support page says skills give Copilot in Excel instructions for repeatable tasks such as reconciling accounts, analyzing data and formatting workbooks. You can use skills that Microsoft provides or create your own custom skills."
  - q: "How do I use a skill in a prompt?"
    a: "Open Copilot in Excel, select the Add menu in the prompt field, choose Choose plugins and skills and pick a skill. Alternatively type an @mention in the prompt, for example @clean-data."
  - q: "How do I turn skills on or off?"
    a: "Select the Settings menu, the three dots in the upper-right corner, then Manage plugins and skills, and toggle skills on or off. A skill that is turned off is no longer used automatically, but you can still call it with a direct @mention."
  - q: "What must a custom skill folder contain?"
    a: "A folder with the same name as the skill and a SKILL.md file. The file starts with frontmatter between three-dash lines with a required name and description, and the description tells Copilot when to use the skill. The body holds the instructions with no format restrictions. Optional scripts, references and assets folders can make results more predictable."
  - q: "How do I remove a custom skill without deleting it?"
    a: "Rename its folder in OneDrive. The page says Copilot skips folders whose names do not match the name in SKILL.md. After adding or renaming skills, select Refresh in the Custom skills dialog."
---

Some Excel tasks come back every week: clean a data export, reconcile two lists, apply the same formatting. Skills in Copilot in Excel are meant for exactly that. This article follows the Microsoft Support page on skills in Copilot in Excel. I could read a condensed version of that page, so the article stays with the steps and facts that came through, and my own suggestions are marked as such.

## What a skill is

A skill gives Copilot in Excel instructions for a repeatable task, for example reconciling accounts, analyzing data or formatting workbooks. You can use Microsoft's skills or create your own.

## Use a skill

1. Open Copilot in Excel and select the **Add** menu in the prompt field.
2. Select **Choose plugins and skills**.
3. Pick a skill from the menu, or type an @mention in your prompt, for example `@clean-data`.

The page lists these Microsoft-managed skills:

| Skill | What it does |
| --- | --- |
| `@brandkit` | Follows brand guidelines |
| `@chart-design` | Creates or edits charts |
| `@clean-data` | Finds and corrects data issues |
| `@skill-builder` | Turns recurring workflows into custom skills |
| `@theme-design` | Applies Excel themes |

## Manage skills

1. Select the **Settings** menu (the **...** in the upper-right corner).
2. Select **Manage plugins & skills**.
3. Toggle skills on or off to control which ones Copilot uses by default.

A skill that is turned off is not used automatically. You can still call it with a direct @mention.

## Create a custom skill

The page gives three ways.

### Option 1: Skill-builder

Use `@skill-builder` to create a skill from your instructions, earlier prompts, examples or a workflow. You can preview and refine the skill before it is saved to OneDrive. The page notes that the skill-builder skill is rolling out to production and may not be available to all customers.

### Option 2: Record a skill

Demonstrate a task in your workbook and have Copilot turn your changes into a reusable skill. The page names the approach but, in the version I could read, gives no further steps.

### Option 3: Upload a skill by hand

1. In the Copilot pane open **Settings** (**...**) and select **Manage plugins & skills**.
2. Select **Custom skills**, then **Create OneDrive folder**.
3. Select **Open skills folder** to open the new **skills** folder in OneDrive.
4. Add your skill folders there.

### Format rules

- Each skill has its own folder with a **SKILL.md** file.
- SKILL.md has frontmatter between `---` lines with a required **name** and **description**. The description tells Copilot when to use the skill.
- The body contains the instructions. There are no format restrictions.
- The folder must share the exact name of the skill. The page's example is a skill named `create-table-bold-first-column` that bolds the first column of any table Copilot creates.
- Optional **scripts**, **references** and **assets** folders can make results more predictable.
- Custom skills must follow the industry-standard format to be recognized.

A minimal file in that shape looks like this. It is my illustration, written from the rules above:

```text
---
name: create-table-bold-first-column
description: Use when Copilot creates a table, to bold the first column.
---
When you create a table, format the first column in bold.
```

### Edit and remove

After you add or rename a skill in OneDrive, select **Refresh** in the **Custom skills** dialog. To take a skill out of Copilot's list without deleting it, rename its folder. Copilot skips folders whose names do not match the `name` in SKILL.md.

## Availability notes

- Custom skills are saved to a specific OneDrive folder, so you need access to OneDrive for them.
- The skill-builder skill may not be available to everyone yet.
- The page, as I could read it, does not describe license requirements or admin controls. If a menu item is missing, ask your administrator.

## Good habits (my advice)

This is my suggestion, not guidance from the page:

1. Write the description as a trigger: when should Copilot use this skill, and for what kind of request. A vague description gives vague results.
2. Keep one task per skill. A skill that tries to do three jobs is hard to test.
3. Test a new skill on a copy of a workbook, with the same prompt twice, and compare the results.
4. Name skills for the result they produce, as the page's example does.
5. Review your skill list now and then and switch off what you no longer use.
6. Do not put secrets or customer data into the instructions, since the file sits in a OneDrive folder.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)

## Sources

- [Use skills in Copilot in Excel (Microsoft Support)](https://support.microsoft.com/excel/copilot/copilot-in-excel-skills)
