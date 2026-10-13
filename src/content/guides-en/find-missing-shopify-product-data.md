---
title: 'How to Find Missing SKUs, Barcodes & Metafields in Shopify'
description: 'A practical Shopify product data audit: check missing SKUs and barcodes, review required metafields, and separate new gaps from existing cleanup.'
intro: 'Start with the fields your catalog actually needs. A blank value matters when a product page, supplier workflow or integration depends on it.'
answer: 'Export Shopify products to inspect SKU and barcode columns, then review required product and variant metafields separately. Define which fields are required for each product group, record existing gaps, and repeat the same checks after imports or bulk edits.'
pubDate: 2026-10-13
updatedDate: 2026-10-13
appId: 'specfinch'
appName: 'SpecFinch'
keyTakeaways:
  - 'Audit variants as well as products: SKU and barcode are variant-level fields.'
  - 'A product CSV supports product metafields, but not variant metafields.'
  - 'Missing and incorrect values are different problems.'
  - 'Keep a baseline so the old backlog does not hide new gaps.'
---

## 1. Define required fields before searching for blanks

Write a small checklist per product group. For example, apparel might require variant SKUs
and a product material metafield; another group might also require barcodes supplied by its
manufacturer. This is an illustrative setup, not a universal Shopify requirement.

Include the field, the product scope and the person who owns corrections. Do not mark every
metafield as required: optional data creates noise. Decide what counts as a missing value and
which fields need a minimum text length.

## 2. Inspect missing SKUs and barcodes in a product export

Export the relevant Shopify products and open the CSV in a spreadsheet. Preserve an original
copy. Filter the SKU and barcode columns for blanks, keeping the product handle and variant
options beside each row so you can locate the right variant.

A product can have several variants. A complete first row does not mean every variant has the
identifier it needs. Review the export as variant rows, and send the list to the responsible
team. Make corrections carefully in Shopify; a CSV audit does not require reimporting the file.

Shopify documents the available fields and import dependencies in its
[product CSV guide](https://help.shopify.com/en/manual/products/import-export/using-csv).

## 3. Review product and variant metafields separately

Existing product metafields can be included in Shopify's product CSV. Variant metafields are
not supported in that product CSV workflow; review them in Shopify's variant bulk editor
instead. Avoid treating an export as proof that every required metafield was checked.

Check each selected definition against the products or variants that need it. A blank material
field and a populated but incorrect material field are separate findings. Presence checks can
identify the first problem, but they cannot decide the correct value for you.

## 4. Record a baseline and check again after changes

Save the date, scope, rules and existing findings. Repeat those checks after a supplier import,
PIM update or bulk edit. Compare the new list with the baseline to distinguish new gaps,
returned issues and resolved work.

For example, if 40 existing missing barcodes remain and an import creates 3 new gaps, the
useful change report highlights those 3 while keeping the 40 available for cleanup. These
numbers illustrate the workflow; they are not customer results.

## When SpecFinch fits this workflow

[SpecFinch](/en/shopify-apps/specfinch/) checks merchant-defined required product fields,
variant SKUs, barcodes and existing product or variant metafields. You can create up to ten
data contracts for active products, selected product types or collections.

The first successful full scan establishes the baseline. Subsequent scans distinguish new,
returned, worsened and resolved findings. Manual and daily scans, CSV exports and Shopify
product links support follow-up. The app reads product data without changing it.

Use a manual review for a one-off cleanup. Consider recurring scans when imports or several
editors can repeatedly remove required data. SpecFinch does not create SKUs, verify GTIN
authenticity, fill metafields or guarantee feed acceptance or search rankings.

## Questions to answer before installing

### Can I use SpecFinch as a barcode validator?

You can require a barcode to be present. Presence is not authenticity: the app does not
validate GTIN ownership or certify the identifier. Check questionable values with the supplier.

### Does a missing field always mean an error?

No. It is a finding against your selected requirements. Optional fields should remain optional,
and your team decides whether a value needs correction.

### How do I keep the report useful?

Start with one product group and a few important fields. Review the baseline, assign ownership,
then check the next import. Expand the scope once the team can act on the findings.

## Before your next import

1. Record the product scope and required fields.
2. Review existing SKU, barcode and metafield gaps.
3. Keep a dated baseline and assign the cleanup work.
4. Repeat the same checks after the change.
5. Review new findings and correct the source workflow when the same field keeps disappearing.

See [SpecFinch's supported checks, screenshots and installation link](/en/shopify-apps/specfinch/).
