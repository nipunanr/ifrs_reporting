from ifrs_reporting.ifrs_reporting.doctype.financial_report_template.financial_report_engine import FinancialReportEngine
from erpnext.accounts.report.balance_sheet.balance_sheet import execute as erpnext_execute


def execute(filters=None):
	filters = filters or {}
	if filters.get("report_template"):
		return FinancialReportEngine().execute(filters)

	return erpnext_execute(filters)
