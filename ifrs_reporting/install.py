import frappe


def _ensure_report_overrides():
    report_names = ["Balance Sheet", "Profit and Loss Statement", "Cash Flow"]

    for report_name in report_names:
        if frappe.db.exists("Report", report_name):
            frappe.db.set_value("Report", report_name, "module", "IFRS Reporting", update_modified=False)


def _sync_ifrs_templates_and_categories():
    from ifrs_reporting.ifrs_reporting.doctype.financial_report_template.financial_report_template import (
        sync_financial_report_templates,
    )

    from ifrs_reporting.patches.v1_0.map_existing_account_categories import execute as map_categories

    # Route standard financial reports to IFRS app scripts.
    _ensure_report_overrides()

    # Import account categories and templates from this app.
    sync_financial_report_templates()

    # Best-effort mapping for existing chart of accounts.
    map_categories()


def after_install():
    _sync_ifrs_templates_and_categories()


def after_migrate():
    _sync_ifrs_templates_and_categories()
