---
title: "How to Set Up Predictive Lead Scoring in Dynamics 365 Sales"
summary: "Step by step from Microsoft Learn: prerequisites (Advanced Sales Insights, at least 40 qualified and 40 disqualified leads), creating the first scoring model, the fields in Add model, publishing, automatic retraining every 15 days, and what to check when the model is not ready to publish."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [dynamics-365-sales, predictive-lead-scoring, dynamics-365-sales-insights, sales-lead, business-process-flow]
keypoints:
  - "The model scores open leads from historical data, so sellers can prioritize them. A score of 80 beats a score of 50 in Learn's example."
  - "You need Advanced Sales Insights features enabled and at least 40 qualified and 40 disqualified leads created and closed in the training time frame, which ranges from three months to two years."
  - "Create the model in Sales Insights settings under Predictive models, then Lead scoring. Leave the page while it trains, which takes a few minutes."
  - "Publish when it is ready. If Model performance shows Not ready to Publish, view the Performance tab. Accuracy fell below the AUC threshold, and publishing anyway will perform poorly."
  - "You can create up to 10 models for different sets of leads, and select Retrain automatically to retrain the model every 15 days."
faq:
  - q: "What do I need before I can create a lead scoring model?"
    a: "Advanced Sales Insights features must be enabled, and your organization must have created and closed at least 40 qualified and 40 disqualified leads in the time frame you choose for training. The time frame ranges from three months to two years. The data sync to the data lake takes about four hours, so recently closed leads are not considered right away."
  - q: "Where do I create the model?"
    a: "In the Sales Hub app go to Change area in the lower-left corner, select Sales Insights settings, and under Predictive models select Lead scoring. Change fields such as business process flow and filter column if needed, then select Get started."
  - q: "What does Not ready to Publish mean?"
    a: "The app judges the model not ready if its accuracy falls below a threshold value, the Area under curve (AUC) score. Select View Details and the Performance tab to see why. You can still publish, but Learn says it will perform poorly."
  - q: "How many models can I have?"
    a: "Up to 10, published and unpublished, for different sets of leads. The app warns you when a new model might score the same leads as an existing one. The Add model button appears only after you have created at least one model."
  - q: "What if my license is Dynamics 365 Sales Enterprise?"
    a: "Learn says you can enable predictive lead scoring in the lead and opportunity scoring quick setup and get 1,500 scored records per month. If you cannot find the feature, check your license, your security role, whether your administrator turned it on, and whether you use a custom app."
---

Predictive lead scoring gives each open lead a score based on how earlier leads ended. Sellers can then work the leads with the best chances first. The Microsoft Learn page on configuring predictive lead scoring covers the prerequisites, the first model, publishing, and extra models. This article follows it and marks my own suggestions.

## What you get

The model calculates a score for open leads from historical data. Learn's example: Lead A gets 80 and Lead B gets 50, so Lead A has a greater chance to become an opportunity. You can also look at the top influencing factors to see why Lead B's score is low and decide whether to improve it. The score helps sellers prioritize and aims to raise qualification rates and cut the time to qualify.

Good to know before you start:

- Historical data collection starts when you create a scoring model. The data is stored in the data lake for analysis.
- If your Dynamics 365 Sales subscription expires or your organization is deleted, the historical data is deleted after 30 days.
- With a Dynamics 365 Sales Enterprise license you can enable predictive lead scoring in the lead and opportunity scoring quick setup, with 1,500 scored records per month.
- Since the 2020 release wave 2, scores are written to the Predictive Score (`msdyn_predictivescore`) table and not to the lead table. Lead and opportunity scoring both use it.

## Prerequisites

1. Advanced Sales Insights features must be enabled.
2. Enough leads to train the model. Your organization must have created and closed at least **40 qualified** and **40 disqualified** leads in the time frame you choose for training. You select the time frame, from three months to two years, when you create the model. More leads give better predictions.
3. If you plan to use a business process flow, leads that abandoned the selected flow are not considered for training, scoring or the minimum requirement.

The sync with the data lake takes about four hours, so leads that you closed recently will not count at once.

If you have a model from a version of Dynamics 365 earlier than 2020 release wave 2, Learn says to delete it before you create a new one. Otherwise the previous model is applied to all leads and the new models have no effect.

## Create the first model

1. In the Sales Hub app go to **Change area** in the lower-left corner and select **Sales Insights settings**.
2. Under **Predictive models**, select **Lead scoring**.
3. On the **Predictive lead scoring** page, change fields such as business process flow and filter column if needed, then select **Get started**.

If you do not have 40 qualified and 40 disqualified leads in the time frame of the **Train with leads from the past** field, you cannot create a model. If there are enough, the app generates a model by default. Training takes a few minutes, and you can leave the page and come back. The app uses standard attributes to train the model. You can edit the model later to include custom or intelligent attributes.

## Publish the model

1. When the model is trained, the page shows a confirmation.
2. If the model is trained but not ready, the **Model performance** field shows **Not ready to Publish**.
3. To retrain the model every 15 days, select **Retrain automatically**.
4. Select **Publish** or **View details**.

Publishing applies the model to leads that match the criteria of the model. The score appears in the **Lead score** column in views and in a widget on the lead form.

To check accuracy before you publish, or to learn why a model is not ready, select **View Details** and the **Performance** tab. A model is not ready when its accuracy is below a threshold, the **Area under curve (AUC) score**. You can still publish, but it will perform poorly.

## Add more models

You can create up to 10 models, published and unpublished, for different sets of leads. This helps if regions or business units follow different sales practices. The app warns you if a new model might score the same leads as an existing one.

1. At the bottom of the **Predictive lead scoring** page select **Add model**. The button shows only after you have created at least one model.
2. **New model name:** alphanumeric characters, underscores allowed, no spaces or other special characters. The default is LeadScoring_ followed by date and time in UTC.
3. **Business process flow:** choose the flow relevant to the leads. To show custom flows, enable **Change Tracking** for the business process flow entity. Custom processes are then synced to the data lake when you generate the model.
4. **State option set:** the option set where the lead status is defined.
5. **Qualified Value** and **Disqualified Value:** pick the matching values. The standard **Status** option set uses Qualified and Disqualified. You can choose a custom option set.
6. **Filter column** and **Filter values:** define which leads the model scores. To filter on several columns, create a calculated field with the needed columns and select it as the filter column.
7. **Train with leads from the past:** the training period. The default is two years. The model analyzes closed leads from this period and uses them to score open leads from the past two years. If there are not enough closed leads, **Get started** is disabled, so pick another period.
8. Select **Get started**. You get a warning for a duplicate model and can create it anyway or change the settings so it scores a different set of leads.
9. When it is trained, publish it or view details.

With several models, use the **Select model** list on the page to pick which to view.

## If you cannot find the feature

Learn lists these possibilities:

- You do not have the license for the feature. Check the comparison table and the licensing guide.
- You do not have the security role. Setup needs the administration and customization roles, and using sales features needs the primary sales roles. Some tasks need functional roles.
- Your administrator has not turned it on.
- Your organization uses a custom app. The steps apply to the standard Sales Hub and Sales Professional apps.

## Rollout tips (my advice)

This is my suggestion, not guidance from the page:

1. Check the lead counts before you plan the project. If you are close to the minimum, wait or use a longer training period.
2. Keep the lead statuses clean. The model learns from the Qualified and Disqualified values, so unreliable closing practice gives unreliable scores.
3. Start with one model for your main lead stream and look at the Performance tab before you publish.
4. Explain the score to sellers as a guide for ordering their work, and show them the top influencing factors in the widget.
5. If you add models per region, make sure the filters do not overlap, since the app warns about overlapping sets.
6. Review the model now and then, especially when your sales process changes, and use the automatic retraining if the 15-day schedule fits your lead volume.

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [Predictive lead and opportunity scoring](https://www.m365.fm/entity/predictive-lead-scoring/)
- [Dynamics 365 Sales Insights](https://www.m365.fm/entity/dynamics-365-sales-insights/)
- [Lead (Dynamics 365 Sales)](https://www.m365.fm/entity/sales-lead/)
- [Business process flow](https://www.m365.fm/entity/business-process-flow/)

## Sources

- [Configure predictive lead scoring (Microsoft Learn)](https://learn.microsoft.com/dynamics365/sales/configure-predictive-lead-scoring)
