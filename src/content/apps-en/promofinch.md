---
title: 'PromoFinch: Shopify Discount Margin Checker'
description: 'Check Shopify percentage discounts against price and gross-margin limits. Monitor campaign changes and review missing costs with read-only PromoFinch.'
heroTitle: 'Check Shopify discount prices & margins.'
intro: 'PromoFinch checks supported percentage discounts against your price floor and estimated gross-margin limits. Review missing costs and monitor changes during your sale.'
updatedDate: 2026-10-13
relatedGuide: 'check-shopify-discount-margins'
tagline: 'Check discount prices and estimated gross margins before your sale.'
audience: 'Shopify teams running recurring promotions with available product costs and their own price or gross-margin limits.'
features:
  - 'Check supported percentage discounts against your price and estimated gross-margin limits'
  - 'Review missing costs, pricing issues and the inputs behind each calculation'
  - 'Monitor campaign changes and compare final prices with approved starting values'
coverAlt: 'PromoFinch showing an active campaign monitor, approved starting values and a completed promotion check in a test store.'
galleryAlts:
  - 'PromoFinch test findings showing a discounted price below the price floor and an estimated gross margin below the selected limit, with calculation inputs.'
  - 'PromoFinch rules for minimum price, minimum estimated gross margin, maximum discount and a required usable product cost.'
---

## Check Shopify discount prices before a campaign starts

A promotion may start within your chosen limits and change when someone edits a product price,
cost or discount. A single spreadsheet check before launch cannot show every later change.

PromoFinch brings supported discount calculations and your own rules together. It highlights
detectable pricing risks for review before and during a campaign. You remain in control of
every correction in Shopify.

## Set your price floor and estimated gross-margin limits

Define a minimum selling price, minimum estimated gross margin and maximum discount. Check a
supported Shopify percentage discount or a manually selected product scope against those rules.
The report shows findings and the product costs and inputs behind each calculation.

For example, if the calculated discounted price falls below your own price floor, PromoFinch
shows that finding and the inputs used. Missing costs and unsupported conditions remain visible
rather than being treated as a successful calculation.

## A 20% discount can leave a 12.5% gross margin

Illustrative example: a product priced at $100 with a $70 product cost receives a supported
20% discount. The calculated selling price is $80. Estimated gross margin is
($80 − $70) ÷ $80 × 100 = **12.5%**. With a $85 price floor or a 20% minimum gross-margin
rule, this example produces a finding. These are example inputs, not merchant results.

Missing cost is not treated as a zero cost. Check scope and coverage before relying on a
report: an unsupported discount is not a passed discount. The [discount margin guide](/en/guides/check-shopify-discount-margins/)
explains the calculation, missing costs and a practical campaign checklist.

## Monitor changes during and after a promotion

After reviewing a check, approve starting values as a campaign baseline. PromoFinch checks again
during the campaign and compares prices after it ends with those approved values. This can help
your team investigate a changed selling price or compare-at price.

Filterable findings, CSV exports and email notifications for relevant changes support follow-up.
PromoFinch does not change prices or discounts and does not automatically restore campaign prices.

## Understand what the discount check covers

PromoFinch supports a defined subset of basic Shopify percentage discount codes and automatic
product percentage discounts. It calculates using the store's base currency and available
product costs. It is not a full checkout simulation or a net-profit calculation.

Other discount constructions and uncertain conditions are reported as unsupported. A basic
discount with an active or scheduled Shopify Rollout is outside the supported check. The app
does not infer buyer coverage from a discount's dates alone.

## Who is PromoFinch for?

PromoFinch fits e-commerce and merchandising teams with recurring promotions, maintained product
costs and defined price or gross-margin limits. Typical situations include a seasonal sale,
Black Friday or a campaign where several colleagues manage prices and discounts.

The useful question is: “Which supported promotion calculations now fall outside our rules?”
The app does not provide automatic repricing, universal discount coverage or legal price
compliance certification.

## Questions about PromoFinch

### Does PromoFinch change my prices or discounts?

No. PromoFinch is read-only. You review the findings and make any corrections in Shopify.

### Does PromoFinch block a discount or restore prices automatically?

No. It reports findings for your team to review. It does not block checkout discounts,
change selling prices or automatically restore prices after a sale.

### Is gross margin the same as net profit?

No. The estimate uses the calculated selling price and available product cost in your store's
base currency. Shipping, taxes, payment fees and other business costs are not a net-profit
calculation.

### Does the app support every Shopify discount?

No. Only supported percentage discounts with sufficiently clear inputs are calculated.
Unknown or uncertain conditions are visible. Full checkout behavior, customer-specific prices,
all discount combinations and active or scheduled Rollouts are outside the supported check.

### What does a successful check mean?

It means the selected rules and supported calculations passed with the available data.
It does not guarantee campaign profit, legal compliance or every possible checkout outcome.

### Where can I install PromoFinch?

Install through the [Shopify App Store](https://apps.shopify.com/promoproof-3), where you can find
current pricing and trial details. The app interface is in English. The listing URL retains
the app's earlier internal working name, PromoProof.

## Built and supported by Chris Online

PromoFinch is designed and developed by Chris Snoek, Chris Online, and has been publicly
available since 6 October 2026. Screenshots on this page show real checks in a test store.
Contact [info@chrisonline.nl](mailto:info@chrisonline.nl) with product or setup questions.
