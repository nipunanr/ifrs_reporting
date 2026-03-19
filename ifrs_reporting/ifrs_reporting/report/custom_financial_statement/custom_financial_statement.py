# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from ifrs_reporting.ifrs_reporting.doctype.financial_report_template.financial_report_engine import (
	FinancialReportEngine,
)


def execute(filters: dict | None = None):
	if filters and filters.report_template:
		return FinancialReportEngine().execute(filters)
