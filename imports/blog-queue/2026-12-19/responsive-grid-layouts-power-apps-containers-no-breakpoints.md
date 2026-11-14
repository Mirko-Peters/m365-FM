---
title: "Responsive Grid Layouts in Power Apps Without Breakpoints: Containers, Wrap and Fill Portions"
summary: "How to build a layout that adapts in a canvas app using horizontal and vertical containers, Wrap, Fill portions and Minimum width instead of size breakpoints, with the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-apps, power-fx, canvas-app]
keypoints:
  - "Learn's setup step is to turn off Scale to fit, Lock aspect ratio and Lock orientation under Settings > Display. Turning off Scale to fit is what makes responsiveness possible."
  - "Horizontal and vertical containers place children automatically. Fill portions share extra space, Minimum width sets a floor, Gap spaces items and Wrap moves items to a new row or column."
  - "When Wrap is on, Learn says the Align setting is ignored on child controls. Center or End justification can make children unreachable when a scrolling container is too small."
  - "Learn does not document a complete wrap-grid recipe or a pixel-exact guarantee. The authoring canvas does not respond to sizing formulas, so publish and test on real window sizes."
  - "Data table, charts and the Add picture control are not supported in layout containers. Inside a gallery template use Parent.TemplateWidth and Parent.TemplateHeight."
faq:
  - q: "Do I need breakpoints for a responsive canvas app?"
    a: "No, not for every layout. Microsoft Learn describes two approaches: formulas on X, Y, Width and Height with Parent.Width and SizeBreakpoints, and auto layout containers that distribute space by their settings. Containers can adapt without any breakpoint formulas, though the pages do not call that a replacement for all cases."
  - q: "What does Wrap do in a horizontal container?"
    a: "Learn defines Wrap as whether the content wraps to a new row or column when it cannot fit. It also says that when Wrap is enabled, the Align property on child controls is ignored."
  - q: "How does Fill portions work?"
    a: "Learn says the number is the portion of the extra space given to a child out of all the extra space claimed by the children of its parent. If child A has 1 and child B has 2, A gets one third and B gets two thirds."
  - q: "Why does my layout look wrong in the studio but right when published?"
    a: "Learn states that the authoring canvas does not respond to the sizing formulas. Save and publish, then open the app on devices or browser windows of various sizes and orientations."
  - q: "Can I drag controls inside a container?"
    a: "No. Learn says drag and drop is disabled for controls in layout containers. Use the container properties, and reorder controls with the Tree view or arrow keys."
---

The way to build a responsive grid in a canvas app without breakpoint formulas is to let containers do the layout: a vertical container for rows, a horizontal container with Wrap for the cells, Fill portions and Minimum width on each cell, and a Gap between them. Microsoft Learn documents each of these properties. It does not document a finished wrap-grid recipe or a pixel-exact guarantee, so test the result on real window sizes.

## Step 0: Make the app responsive at all

Responsiveness starts in the app settings. Learn's prerequisite (build-responsive-apps page) is to go to **Settings** > **Display**, turn off **Scale to fit**, **Lock aspect ratio** and **Lock orientation**, then select **Apply**.

Screens then size themselves with the default formulas:

```power-fx
Width = Max(App.Width, App.MinScreenWidth)
Height = Max(App.Height, App.MinScreenHeight)
```

`MinScreenWidth` and `MinScreenHeight` are set under **App Object** > **Properties** > **Advanced**. If the window is smaller, the user scrolls.

## Step 1: Add the outer container

Insert a **Horizontal container** or **Vertical container** from the **Layout** tab of the Insert pane. Set it to fill the screen, as in Learn's example:

| Property | Value |
|---|---|
| X | `0` |
| Y | `0` |
| Width | `Parent.Width` |
| Height | `Parent.Height` |

Inside a container you never set X and Y for a child. The container positions it.

## Step 2: Understand the container properties

For the horizontal container, Learn lists:

- **Direction:** Horizontal or Vertical.
- **Justify:** Start, End, Center, Space Between, along the main axis.
- **Align:** Start, Center, End, Stretch, on the other axis.
- **Gap:** space between children in pixels.
- **Horizontal Overflow** and **Vertical Overflow:** Scroll or Hide.
- **Wrap:** whether content wraps to a new row or column when it cannot fit.

On each child:

- **Fill portions:** the share of extra space. A child with 1 next to a child with 2 gets one third and two thirds of the extra space.
- **Minimum width:** the minimum size in the direction of the Fill portions.
- **Align in container:** per-child alignment, with **Set by container** as the default.

## Step 3: Build the grid from rows and cells

A pattern based on those properties:

1. Use a vertical container for the page. Put a header container at the top and a content container below.
2. In the content container, add a horizontal container for the grid and turn **Wrap** on.
3. Add one child container per card. Give every card the same Fill portions, for example 1, and the same Minimum width, for example 280.
4. Set **Gap** to your spacing value, and a matching padding on the container.
5. Set the vertical overflow of the content area to **Scroll**.

The intent: on a wide window, several cards fit in a row and share the extra space. When the window narrows below the combined minimum widths, the next card moves to a new row. The Learn pages read for this article describe the individual properties but not this exact recipe, so verify the wrapping behavior in your app and adjust the minimum width until it matches your design.

## Step 4: Use a gallery when the data decides the number of cards

If the grid shows records, a gallery is the usual control. Learn documents these gallery properties:

- **WrapCount:** the number of items shown per row or column.
- **TemplateSize:** the height of the template in vertical orientation, or the width in horizontal orientation. The minimum is one, and it can make controls drift from their expected X or Y if you do not account for it.
- **TemplatePadding:** the distance between items.

Inside a gallery template, use `Parent.TemplateWidth` and `Parent.TemplateHeight`, not `Parent.Width` and `Parent.Height`, which refer to the whole gallery.

The Learn pages read do not show a formula for WrapCount. Learn does not say whether it accepts a formula, so one option to test is a formula based on the width, for example `Max(1, RoundDown(Parent.Width / 280, 0))`. That is an idea to test, not documented guidance. Watch for the flexible height gallery: Learn warns that if a user scrolls before all items load, the item in view might be pushed out of view, and says a standard gallery avoids it. Galleries can be nested only two levels deep.

## Step 5: Know the limits

Documented limitations:

- When **Wrap** is on, the **Align** setting on child controls is ignored.
- When Wrap is off and overflow is Scroll, Learn recommends Justify of **Start** or **Space Between**. **Center** or **End** can make children unreachable if the container is too small.
- Drag and drop is disabled in layout containers. Use properties, the Tree view or arrow keys.
- **Data table**, **Charts** and **Add Picture** are not supported in layout containers. The basic Container control also does not support the PDF viewer or Web barcode scanner, and containers do not work within forms.
- Some container properties are hidden for child controls and are ignored even if set through the formula bar.
- If you write formulas in X, Y, Width and Height, dragging the control overwrites them.
- The authoring canvas does not respond to sizing formulas. Save and publish, then test.

## When breakpoints still help

Learn's other approach uses the `Size` property of the screen with default `SizeBreakpoints` of `[600, 900, 1200]` for tablet or web apps and `[1200, 1800, 2400]` for phone apps. A formula such as `Parent.Width * Switch(Parent.Size, ScreenSize.Small, 0.5, ScreenSize.Medium, 0.3, 0.25)` changes widths by size class. Use it where containers cannot express the design, for example when a section should disappear on small screens.

## About "pixel perfect"

Learn describes flexible layouts that adapt to the space, not exact pixel placement at every size. If you need exact values in one place, such as a fixed 100 pixel header, set Flexible height off and give that child a Height, as in Learn's example. Everything else can flex around it.

## A short test routine

1. Publish the app.
2. Open it in a browser and resize the window across your supported range.
3. Rotate a phone or tablet if orientation is unlocked.
4. Check that no child becomes unreachable when Overflow is Scroll.
5. Fix the Minimum width and Gap values, publish and repeat.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Fx](https://www.m365.fm/entity/power-fx/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)

## Sources

- [Horizontal and vertical container control (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-horizontal-container)
- [Building responsive canvas apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/build-responsive-apps)
- [Create responsive layouts in canvas apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/create-responsive-layout)
- [Container control in canvas apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-container)
- [Gallery control in Power Apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-gallery)
