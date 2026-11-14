---
title: "Test Canvas Apps Automatically With Test Studio in Power Apps: Record, Edit and Play"
summary: "How to test a canvas app with Test Studio in Power Apps, based on Microsoft Learn: opening it, test suites and cases, recording, editing steps, Assert and Trace, OnTestCaseStart, storing results, play links, and the documented limitations."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [power-apps, canvas-app, power-platform]
keypoints:
  - "Save the app, then select Advanced tools and Open tests. Test Studio opens in a new tab, and you must be the creator or a co-owner of the app."
  - "Publish before you record or play. Record replays the last published version, and Done saves the recording while Cancel discards it."
  - "Recording over an existing test case overrides its existing steps."
  - "Use OnTestCaseStart to set up each case, and OnTestCaseComplete to store results, for example in a Dataverse table."
  - "Learn lists limitations, among them components, PCF controls, nested galleries, media controls and Person columns, and says Test Studio is incompatible with Git version control."
faq:
  - q: "How do I open Test Studio?"
    a: "According to Microsoft Learn, sign in to Power Apps, open the app, save it, select Advanced tools in the left navigation, and then select Open tests. Test Studio opens in a new browser tab."
  - q: "Do I need to publish the app before recording?"
    a: "Yes. According to Microsoft Learn, only a published app plays in record mode, so recording without publishing replays the last published version."
  - q: "How do I run tests in a browser or a pipeline?"
    a: "Select a suite or case and choose Copy play link. Learn says the link is persistent and helps integrate tests in a build and release pipeline such as Azure DevOps."
  - q: "Where can I store test results?"
    a: "Learn shows saving results with Patch into a Dataverse table, and mentions a Power Automate flow, email and in-app notifications as other destinations."
---

Test Studio lets you record and replay tests of a canvas app inside Power Apps. You open it from **Advanced tools**, group tests into suites and cases, record steps, add assertions, and play the tests. This guide follows the Microsoft Learn pages Test Studio - Power Apps and Working with Test Studio - Power Apps.

## Requirements

You must be the creator or a co-owner of the app. Tests are stored in the app package, so exporting and importing the package also carries over the suites and cases.

## Open Test Studio

1. Sign in to Power Apps.
2. Create a new app or edit an existing one.
3. **Save** the app. Learn says you must save before you can write tests.
4. Select **Advanced tools** in the left navigation.
5. Select **Open tests**. Test Studio opens in a new browser tab.

## Suites and cases

- A **test suite** groups cases. Select **New suite** and edit the name and description in the main grid. A default suite and case are created automatically, and an app can contain several suites. App state persists across the cases of a suite, according to the overview.
- A **test case** tests a specific feature. Select a suite, select **New Case** in the top menu, and edit its name and description.

## Record a test

1. Publish recent changes first. Only a published app plays in record mode.
2. Select **Record** in the top menu. The published app opens in recording mode in a new tab.
3. Use the app. Your actions appear in the left pane.
4. Select **Done** to save the recording, or **Cancel** to leave without recording.

Recording over an existing test case overrides its steps. The page does not use the label Stop.

## Edit steps and add assertions

Review the generated steps and formulas. You can edit a step description in the main grid and select the formula to edit the action. **Insert a step above** adds a step. You can also use **Assert**, **SetProperty**, **Select** or **Trace**.

- **Assert** fails the test when its condition is false and shows the message you provide.
- **Trace** writes messages to the test results.

The Learn example counts rows before and after an action and asserts the difference:

```power-fx
Assert(kudosAfterTest = kudosBeforeTest + 1, "Kudos count incorrect. Expected : " & kudosBeforeTest + 1 & " Actual :" & kudosAfterTest)
```

Save the test case from the top-right menu. The page links to reference pages for Select and SetProperty and does not give their syntax.

## Set up cases and process results

Setup runs through the **OnTestCaseStart** property of a suite, which runs before each case. The page example navigates to the first screen, loads test data and resets a counter. To set it, select **Test** in the left pane or **View** on the suite header, and then **OnTestCaseStart**. The **TestCaseInfo** record provides names, descriptions and IDs of the case and suite.

- **OnTestCaseComplete** runs when each case finishes. The **TestCaseResult** record has fields such as StartTime, EndTime, Traces, Success and TestFailureMessage.
- **OnTestSuiteComplete** runs when each suite finishes. The **TestSuiteResult** record includes TestsPassed and TestsFailed.

The page saves results with `Patch` into a custom Dataverse table. Other destinations it mentions are a Power Automate flow, email with `Office365.SendMailV2`, and an in-app `Notify` message when the test runs in a browser. It does not describe a built-in sharing or reporting feature, and it documents no suite-level start property.

## Play the tests

1. Select **Publish**. Unpublished changes do not play.
2. Select a suite or a single case.
3. Select **Play**. The app opens in Play mode and the steps run.
4. A green check mark means a step succeeded. A red failure indicator and a message mean it failed.
5. Select **Done** to return.

## Run in a browser or pipeline

Select a suite or case and choose **Copy play link**. If there are unpublished changes you are asked to publish, and you can skip it, but new changes will not play. Paste the URL into a browser to play the test. The link is persistent, so you can update tests without changing build and release pipelines. Learn says the link helps integrate tests in a build and release pipeline such as Azure DevOps. The page gives no pipeline setup steps.

## Limitations and best practices

The overview lists limitations. Among them are components, code components written with the Power Apps Component Framework (PCF), nested galleries, media controls, Person-type columns, controls not listed in the Select and SetProperty function pages, and the formula-level error management experimental feature, which the page says needs to be turned on for the app. It also says Test Studio is incompatible with Git version control. Read the current list before you plan coverage.

## Suggestion: a first test plan

This section is a practical suggestion and not a Microsoft statement.

1. Start with one suite for the main screen and a case for the most important action.
2. Add an Assert that checks a visible result, not only that the steps ran.
3. Reset test data in OnTestCaseStart so cases do not depend on each other.
4. Publish, play, and only then add more cases.

## Not covered

The pages I read do not describe the following:

- Syntax details for Select and SetProperty.
- Azure Pipelines setup steps.
- Behavior for the controls on the limitations list beyond the list itself.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Test Studio - Power Apps (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/test-studio)
- [Working with Test Studio - Power Apps (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/working-with-test-studio)
