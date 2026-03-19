import json
from pathlib import Path

import frappe


def execute():
	if not frappe.db.has_column("Account", "account_category"):
		return

	mapping = _load_mapping()
	if not mapping:
		return

	accounts = frappe.get_all(
		"Account",
		filters={"is_group": 0},
		fields=["name", "account_name", "account_category"],
		limit_page_length=0,
	)

	for account in accounts:
		if account.account_category:
			continue

		category = mapping.get(account.account_name)
		if not category:
			continue

		frappe.db.set_value("Account", account.name, "account_category", category, update_modified=False)


def _load_mapping() -> dict[str, str]:
	path = Path(__file__).resolve().parents[2] / "data" / "account_category_mapping.json"
	if not path.exists():
		return {}

	with path.open() as f:
		return json.load(f)
