from ifrs_reporting.ifrs_reporting.doctype.financial_report_template.financial_report_engine import FinancialReportEngine
from erpnext.accounts.report.profit_and_loss_statement.profit_and_loss_statement import (
	execute as erpnext_execute,
)


def execute(filters=None):
	filters = filters or {}
	if filters.get("report_template"):
		return FinancialReportEngine().execute(filters)

	return erpnext_execute(filters)
