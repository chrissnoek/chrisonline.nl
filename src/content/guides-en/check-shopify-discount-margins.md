---
title: 'How to Check Shopify Discount Prices & Gross Margins'
description: 'Calculate the gross margin after a Shopify percentage discount, check price floors and missing costs, and review campaign coverage before a sale.'
intro: 'A discount percentage is not a margin percentage. Calculate the selling price first, then compare the estimated gross margin with the rule your team chose.'
answer: 'For a supported percentage discount, multiply selling price by one minus the discount rate. Estimated gross margin is discounted price minus product cost, divided by discounted price, times 100. Check missing costs, product scope and discount coverage before treating a promotion check as passed.'
pubDate: 2026-10-13
updatedDate: 2026-10-13
appId: 'promofinch'
appName: 'PromoFinch'
keyTakeaways:
  - 'Gross margin is calculated against the discounted selling price.'
  - 'A missing cost is an unknown input, not a zero cost.'
  - 'Check discount coverage before approving a campaign baseline.'
  - 'Monitor price and cost changes during the sale and compare prices afterward.'
---

## Calculate the price after a percentage discount

Start with the current selling price, product cost and the discount rate for the selected
variant. Keep the inputs in the store's base currency. For a simple supported percentage
discount, the calculation is:

**Discounted price = selling price × (1 − discount rate)**

**Estimated gross margin = (discounted price − product cost) ÷ discounted price × 100**

If the discounted price is zero or the cost is unavailable, do not report a normal margin
percentage. Resolve the inputs first. This estimate is not net profit: taxes, shipping,
payment fees and other business costs need a separate assessment.

## Worked example: $100 price, $70 cost, 20% discount

These are illustrative inputs, not results from a merchant or a real campaign.

| Input or result             | Example                      |
| --------------------------- | ---------------------------- |
| Current selling price       | $100                         |
| Product cost                | $70                          |
| Discount                    | 20%                          |
| Calculated discounted price | $80                          |
| Estimated gross margin      | 12.5%                        |
| Example minimum price rule  | $85 — below the chosen limit |
| Example minimum margin rule | 20% — below the chosen limit |

The product has $10 left between the discounted selling price and its recorded product cost.
Dividing that $10 by the $80 discounted selling price gives a 12.5% estimated gross margin.
It is not 30%, which would describe the margin before this discount.

The thresholds are your team's choices. This example does not recommend a universal price
floor or margin target.

## Check missing costs and the discount's actual scope

A blank cost must stay visible. Treating it as zero produces an optimistic margin that has
not been supported by data. Review the cost for each relevant variant, not just one example
product.

Also check which products and buyers the discount applies to, its dates and whether other
discounts can combine with it. Shopify's
[discount combination documentation](https://help.shopify.com/en/manual/discounts/discount-combinations)
explains why checkout behavior needs its own review. A simple calculation cannot represent
every combination, customer condition or checkout outcome.

## Choose a spreadsheet or a recurring check

A spreadsheet can work for a small, one-off promotion with clear inputs. Keep a copy of the
scope, calculation and thresholds you approved. If prices, costs or discounts change during
the campaign, repeat the calculation using the changed inputs.

[PromoFinch](/en/shopify-apps/promofinch/) brings defined price floors, estimated gross-margin
limits and maximum discounts together for a supported subset of basic Shopify percentage
discount codes and automatic product percentage discounts. It reports findings with the inputs
behind each calculation. Missing costs and unsupported conditions remain visible.

## Know what PromoFinch can check

PromoFinch uses the store's base currency and available product costs. Uncertain discount
conditions remain unsupported. Basic discounts with active or scheduled Shopify Rollouts
are outside the supported check. Do not approve a campaign just because the supported part
looks acceptable: review the report's coverage and unresolved inputs too.

The app is read-only. It does not block a checkout discount, change prices, automatically
restore prices or simulate a full checkout. It does not calculate net profit or certify
legal price compliance.

## Monitor the campaign and its ending

After reviewing a complete supported check, you can approve starting values as a campaign
baseline in PromoFinch. During the sale, review new findings when a price, cost or discount
changes. Afterward, compare selling and compare-at prices against the approved starting
values, and investigate differences in Shopify.

A compare-at value, a current selling price and a percentage discount are separate inputs.
Do not assume that every crossed-out price implies the same discount calculation.

## A campaign review checklist

1. Select the campaign's products and variants.
2. Confirm usable product costs and the base currency.
3. Record minimum price, minimum estimated gross margin and maximum discount rules.
4. Review unsupported discounts and missing inputs.
5. Calculate supported scenarios and resolve findings before approving the baseline.
6. Review changes during the sale and compare prices when it ends.

See [PromoFinch's supported discount checks and installation link](/en/shopify-apps/promofinch/).
