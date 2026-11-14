---
title: "Refactor Power Apps OnStart Variables Into Named Formulas for Faster App Loading"
summary: "A step-by-step way to move Set and Collect calls out of App.OnStart into App.Formulas, with before and after Power Fx, what must stay in OnStart, and the limits Microsoft documents for named formulas."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [power-apps, power-fx]
keypoints:
  - "Microsoft recommends replacing variable and collection initialization in App.OnStart with named formulas in App.Formulas to reduce load time."
  - "OnStart statements run in order before the first screen. Named formulas are independent and evaluated only when needed, so the first screen can appear immediately."
  - "Static values such as colors, style records, lookup lists and parameter-derived values are the best candidates. State that changes still needs Set."
  - "Named formulas are read-only and cannot use behavior functions such as Set, Collect, Notify, Navigate, Patch or SubmitForm."
  - "Use StartScreen instead of Navigate in OnStart, and drop the var prefix for names that are no longer variables."
faq:
  - q: "Why does App.OnStart slow down a canvas app?"
    a: "Microsoft Learn explains that OnStart is a sequence of statements, so the app must evaluate each Set and Collect call in order before it can display the first screen. The whole formula must also be analyzed as one unit, which makes it complex for Power Apps Studio."
  - q: "Which OnStart code should move to named formulas?"
    a: "Learn says most OnStart variables hold static values that never change, such as colors, style records and lookup lists. Those become named formulas. Variables that your app modifies later still need Set, because named formulas cannot be changed."
  - q: "Can a named formula call Navigate or Patch?"
    a: "No. Learn states that named formulas don't support behavior functions with side effects, including Set, Collect, Notify, Navigate, Launch, Patch, SubmitForm and RemoveIf. Keep that logic in behavior properties such as OnSelect or OnVisible."
  - q: "How much faster will my app load?"
    a: "Microsoft reports that Power Apps Studio load time dropped by as much as 80 percent from this change alone in its tests. That is a best case for Studio load, not a promise for runtime, so measure your own app before and after."
---

Many canvas apps initialize everything in `App.OnStart`: colors, lookup collections, user information, parameters. Each of those statements has to finish before the first screen appears. Microsoft's guidance for large apps is blunt: the best way to reduce load time for both Power Apps Studio and the app itself is to replace variable and collection initialization in OnStart with named formulas in `App.Formulas`. This guide shows how to do that refactor safely.

## Why named formulas load faster

Learn gives three reasons:

1. **OnStart is sequential.** The app must evaluate every `Set` and `Collect` in order, with errors aggregated, before the first screen can show.
2. **Named formulas are independent.** Each one can be analyzed separately, which splits a large OnStart into smaller pieces for Studio.
3. **Named formulas are lazy.** They define how to calculate a value whenever it is needed, so the app does not evaluate them until a control asks for the result. The first screen can display immediately.

Learn reports Studio load time falling by as much as 80 percent from this change alone. If you used `Screen.OnVisible` to defer work until a screen appears, the work stays deferred as a global named formula.

## Step 1: List what OnStart does

Open `App.OnStart` and sort every statement into one of four groups:

| Group | Example | Target |
|---|---|---|
| Static value | `Set(varColorMenuIcon, "#0070a9")` | Named formula |
| Derived value or lookup | `ClearCollect(FacilitiesList, ...)` | Named formula, if read-only |
| Value from a startup parameter | `Set(ParamFacility, LookUp(...Param("FacilityID")...))` | Named formula with `If` and `Blank()` |
| Mutable state | counters, flags, selected items | Keep `Set` |

Learn says that more often than not OnStart variables set up static values, and a named formula is the better choice for them.

## Step 2: Convert each statement

Each `Set` or `Collect` becomes `name = formula;` in the `App.Formulas` property. The Learn example:

```power-fx
// Before: App.OnStart
Set(varColorOnDark, RGBA(0, 0, 0, 1));
Set(varColorMenuIcon, "#0070a9");
ClearCollect(FacilitiesList,
    ForAll(Facilities, { Name: 'Facility Name', Id: Facility }));
If(Not IsBlank(Param("FacilityID")),
    Set(ParamFacility,
        LookUp(FacilitiesList, Id = GUID(Param("FacilityID"))).Name));
```

```power-fx
// After: App.Formulas
varColorOnDark = RGBA(0, 0, 0, 1);
varColorMenuIcon = "#0070a9";
FacilitiesList =
    ForAll(Facilities, { Name: 'Facility Name', Id: Facility });
ParamFacility =
    If(Not IsBlank(Param("FacilityID")),
        LookUp(FacilitiesList, Id = GUID(Param("FacilityID"))).Name,
        Blank());
```

Three details from the conversion:

- A conditional `Set` becomes an `If` expression that returns `Blank()` in the else branch.
- `ClearCollect` or `Collect` becomes the table expression itself. The name then behaves like a read-only table.
- Every definition ends with a semicolon.

Named formulas can refer to each other in any order, as long as they do not create a circular reference. `a = b;` with `b = a;` is not allowed.

## Step 3: Rename and clean up

Learn notes that named formulas are immutable, so the `var` prefix no longer fits. Rename `varColorOnDark` to something like `ColorOnDark` when you can, and update the references. Do this in a copy of the app, because renames touch every control that uses the name.

Do not place named formulas in `App.OnStart`. Learn says it is tempting, but they do not belong there.

## Step 4: Handle what cannot move

Named formulas cannot use behavior functions or cause side effects. Learn lists `Set`, `Collect`, `Notify`, `Navigate`, `Launch`, `Patch`, `SubmitForm` and `RemoveIf` among the imperative operations they do not support. Use these alternatives instead:

- **State that changes.** Keep `Set`. Learn says that for those situations `Set` is perfect and you should continue to use it.
- **Choosing the first screen.** Use the `StartScreen` property instead of `Navigate`. Learn says using `Navigate` in OnStart is retired, because it forces the system to finish OnStart before showing the first screen. `StartScreen` is evaluated once when the app loads and can use `Param`, `User`, `LookUp` and similar data flow functions.
- **Logic for one screen.** Use that screen's `OnVisible`.

`StartScreen` cannot see global variables or collections created in OnStart, but named formulas are available there. That is another reason to move static lookups.

## Step 5: Know the execution model

Learn adds a warning about the nonblocking OnStart setting, which is the default. OnStart then runs at the same time as other app rules. Variables initialized in OnStart might not be fully initialized when other rules read them, and a screen can become interactive before OnStart finishes. Named formulas have no such timing dependency: there is no OnStart that must run first and no time in which the value is incorrect.

To test OnStart behavior in Studio, hover over **App** in the Tree view, select the ellipsis and choose **Run OnStart**. If you rebuild collections there, use `ClearCollect` rather than `Collect` so repeated runs start from empty collections.

## Step 6: Measure before and after

1. Record the time to first screen in the published app on a typical device, and the Studio open time, before the change.
2. Move one group of statements at a time and republish to a test copy.
3. Compare. Learn's 80 percent figure is for Studio load time in its tests, so your gain will vary.
4. Watch for formulas that are expensive when used on a busy screen. A lazy formula still has to run once a control needs it.

## Common mistakes

- Moving a variable that the app later changes. It will fail because named formulas cannot be set.
- Putting `Navigate` or `Patch` inside a named formula.
- Leaving a named formula inside OnStart.
- Keeping `var` prefixes, which misleads later maintainers.
- Using OnStart for first-screen routing instead of `StartScreen`.
- Converting everything in one pass, which makes errors harder to trace.

## When OnStart is still fine

Learn does not give a checklist of valid OnStart uses. It describes the intended uses as retrieving and caching data in collections and setting up global variables, and it warns that OnStart can cause performance problems. If a task truly has to run once at load and change app state, a short OnStart is acceptable, but keep it small.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Fx](https://www.m365.fm/entity/power-fx/)

## Sources

- [Microsoft Learn: Working with large apps in Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-large-apps)
- [Microsoft Learn: App object, Formulas, OnStart and StartScreen properties](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/object-app)
