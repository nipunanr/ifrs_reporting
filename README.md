# IFRS Reporting

Reusable Frappe app for ERPNext v15 that backports ERPNext v16-style Financial Report Templates, including IFRS-ready templates and template-driven report rendering.

This app is designed for multi-site use in a bench and can be installed on any ERPNext v15 site.

## Why this app exists

ERPNext v16 introduced a Financial Report Template framework with richer layout and formatting support. ERPNext v15 does not include that framework out of the box.

This app brings the v16 approach to v15 so teams can:

- select report templates directly from financial reports,
- use IFRS templates for Balance Sheet, Profit and Loss, and Cash Flow,
- use advanced template layouts (including horizontal/columnar templates),
- use row-level formatting (bold, italic, color),
- hide empty and hidden-calculation rows in template mode.

## What is included

### Core framework

- DocType: Financial Report Template
- DocType: Financial Report Row
- DocType: Account Category
- Report engine and validation logic adapted for ERPNext v15
- Custom Financial Statement script report

### Standard templates shipped by this app

- Standard Balance Sheet (IFRS)
- Standard Profit and Loss (IFRS)
- Standard Cash Flow Statement (IFRS)
- Horizontal Balance Sheet (Columnar)
- Horizontal Profit and Loss (Columnar)
- Financial Ratios Analysis

### Report behavior changes in template mode

For Balance Sheet, Profit and Loss Statement, Cash Flow, and Custom Financial Statement:

- Report Template selector is enabled.
- Account Detail Level is enabled when a template is selected.
- Select View is hidden when a template is selected (for Balance Sheet and P&L).
- v16-style formatting is applied in template mode:
	- bold, italic, row colors,
	- indentation and detail prefixes,
	- blank lines,
	- hidden_calculation rows suppressed,
	- hide_when_empty rows suppressed,
	- avoids showing zeroes for intentionally blank/hidden rows.

## Compatibility

- Frappe 15
- ERPNext 15
- Python 3.11 (bench-managed virtual environment)

Notes:

- This app ports selected v16 accounting report-template features into v15.
- It does not upgrade your ERPNext version.

## Installation

From the bench root:

```bash
# 1) Get app (if not already present)
bench get-app /path/to/ifrs_reporting

# 2) Install on target site
bench --site <your-site> install-app ifrs_reporting

# 3) Migrate site
bench --site <your-site> migrate

# 4) Clear cache and restart services
bench --site <your-site> clear-cache
bench restart
```

Example for a local site:

```bash
bench --site site1.local install-app ifrs_reporting
bench --site site1.local migrate
bench --site site1.local clear-cache
bench restart
```

## Upgrade / re-sync after pulling changes

```bash
bench --site <your-site> migrate
bench --site <your-site> clear-cache
bench restart
```

The install and migrate hooks automatically:

- sync account categories,
- sync financial report templates,
- enforce report module overrides required for template-enabled report scripts.

## How to use

### 1) Standard financial reports

Open:

- Balance Sheet
- Profit and Loss Statement
- Cash Flow

Then select a value in Report Template.

Recommended first tests:

- Balance Sheet -> Standard Balance Sheet (IFRS)
- Profit and Loss Statement -> Standard Profit and Loss (IFRS)
- Cash Flow -> Standard Cash Flow Statement (IFRS)

### 2) Custom Financial Statement

Open Custom Financial Statement and select:

- Financial Ratios Analysis

### 3) Horizontal templates

Use:

- Horizontal Balance Sheet (Columnar)
- Horizontal Profit and Loss (Columnar)

These templates are designed for side-by-side sections and depend on template row metadata for display structure.

## Data model expectations

The app adds and uses:

- Custom Field on Account: account_category (Link to Account Category)
- Account Category master records

An included patch attempts best-effort mapping of existing Accounts to account_category values.

If your chart of accounts is heavily customized, review and adjust account categories manually for best IFRS template output quality.

## Validation checklist

Run after install or upgrade:

```bash
bench --site <your-site> list-apps
bench --site <your-site> migrate
```

In UI, validate:

- Financial Report Template DocType exists.
- Report Template filter appears in Balance Sheet, P&L, Cash Flow, and Custom Financial Statement.
- Select View is hidden when template is selected (BS/P&L).
- Colors, italics, and blank-line behavior render correctly in template reports.

## Troubleshooting

### Report Template not showing in report UI

1. Run:

```bash
bench --site <your-site> migrate
bench --site <your-site> clear-cache
bench restart
```

2. Hard refresh browser (Ctrl+Shift+R).

### Templates are missing

Run migrate again to trigger template sync:

```bash
bench --site <your-site> migrate
```

### Styling not applied (everything appears bold or plain)

Usually stale report script cache.

```bash
bench --site <your-site> clear-cache
bench restart
```

Then hard refresh browser.

### Module import errors after deployment

Make sure app is installed in site and importable in bench environment:

```bash
bench --site <your-site> list-apps
```

If needed, re-run install and migrate.

## Limitations and scope

- The app targets financial-report template features relevant to IFRS reporting use in ERPNext v15.
- Not all v16 accounting subsystem changes are included.
- Output accuracy depends on chart-of-accounts quality and account-category mapping completeness.

## Development notes

- Keep module paths under the app package namespace.
- When importing/updating template JSON files, keep module set to IFRS Reporting.
- After code/template changes, always run migrate and clear cache.

## License

See license.txt.
