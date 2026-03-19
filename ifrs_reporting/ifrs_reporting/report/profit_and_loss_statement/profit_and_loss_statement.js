const PL_REPORT_NAME = "Profit and Loss Statement";

function format_ifrs_template_row(value, row, column, data, default_formatter, filter) {
	if (!frappe.query_report.get_filter_value("report_template", false)) {
		return erpnext.financial_statements.formatter(
			value,
			row,
			column,
			data,
			default_formatter,
			filter
		);
	}

	if (!data) return "";

	const valueMatch = (column.fieldname || "").match(/^(?:seg_(\d+)_)?(.+)$/);
	const baseFieldname = valueMatch ? valueMatch[2] : column.fieldname;
	const segmentIndex = valueMatch && valueMatch[1] ? parseInt(valueMatch[1], 10) : null;

	let formatting = data;
	if (segmentIndex !== null && data.segment_values) {
		formatting = data.segment_values[`seg_${segmentIndex}`] || {};
	}

	const style_custom_value = (formatted_value, fmt, raw_value) => {
		const styles = [];

		if (fmt.bold) styles.push("font-weight: bold");
		if (fmt.italic) styles.push("font-style: italic");
		if (fmt.warn_if_negative && typeof raw_value === "number" && raw_value < 0) {
			styles.push("color: #dc3545");
		} else if (fmt.color) {
			styles.push(`color: ${fmt.color}`);
		}

		if (!styles.length) return formatted_value;
		const style_string = styles.join("; ");

		if (/<[^>]+>/.test(formatted_value || "")) {
			const temp_div = document.createElement("div");
			temp_div.innerHTML = formatted_value;
			const first_element = temp_div.querySelector("*");
			if (first_element) {
				const existing_style = first_element.getAttribute("style") || "";
				first_element.setAttribute(
					"style",
					existing_style ? `${existing_style}; ${style_string}` : style_string
				);
				return temp_div.innerHTML;
			}
		}

		return `<span style="${style_string}">${formatted_value}</span>`;
	};

	if (baseFieldname === "account") {
		let account_value = data.section_name || data.account_name || formatting.account_name || value;
		if (!account_value && formatting.is_blank_line) return "&nbsp;";
		if (!account_value) return "";
		if (formatting.hidden_calculation) return "";

		const should_link_to_ledger =
			formatting.is_detail ||
			(formatting.account_filters && formatting.child_accounts && formatting.child_accounts.length);

		if (should_link_to_ledger) {
			const gl_data = {
				account:
					Array.isArray(formatting.child_accounts) && formatting.child_accounts.length
						? formatting.child_accounts
						: formatting.account || account_value,
				from_date: formatting.from_date || formatting.period_start_date,
				to_date: formatting.to_date || formatting.period_end_date,
				account_type: formatting.account_type,
				company: frappe.query_report.get_filter_value("company", false),
			};

			column.link_onclick =
				"erpnext.financial_statements.open_general_ledger(" + JSON.stringify(gl_data) + ")";
			account_value = default_formatter(account_value, row, column, data);
		}

		let formatted_value = String(account_value);
		if (formatting.is_detail || formatting.prefix) {
			formatted_value = (formatting.prefix || "• ") + formatted_value;
		}

		if (data._segment_info && data._segment_info.total_segments === 1) {
			column.is_tree = true;
		} else if (formatting.indent && formatting.indent > 0) {
			formatted_value = "&nbsp;".repeat(formatting.indent * 4) + formatted_value;
		}

		return style_custom_value(formatted_value, formatting, null);
	}

	if (formatting.is_blank_line || formatting.hidden_calculation) return "";

	const col = { ...column };
	col.fieldtype = formatting.fieldtype || col.fieldtype;
	if (col.fieldtype === "Float") col.options = null;

	if (formatting.hide_when_empty) {
		const empty_value =
			value === null || value === undefined || value === "" || (typeof value === "number" && Math.abs(value) < 0.01);
		if (empty_value) return "";
	}

	const formatted_value = default_formatter(value, row, col, data);
	return style_custom_value(formatted_value, formatting, value);
}

frappe.query_reports[PL_REPORT_NAME] = $.extend({}, erpnext.financial_statements);

erpnext.utils.add_dimensions(PL_REPORT_NAME, 10);

frappe.query_reports[PL_REPORT_NAME]["filters"].push(
	{
		fieldname: "report_template",
		label: __("Report Template"),
		fieldtype: "Link",
		options: "Financial Report Template",
		get_query: { filters: { report_type: PL_REPORT_NAME, disabled: 0 } },
	},
	{
		fieldname: "show_account_details",
		label: __("Account Detail Level"),
		fieldtype: "Select",
		options: ["Summary", "Account Breakdown"],
		default: "Summary",
		depends_on: "eval:doc.report_template",
	},
	{
		fieldname: "selected_view",
		label: __("Select View"),
		fieldtype: "Select",
		options: [
			{ value: "Report", label: __("Report View") },
			{ value: "Growth", label: __("Growth View") },
			{ value: "Margin", label: __("Margin View") },
		],
		default: "Report",
		depends_on: "eval:!doc.report_template",
		reqd: 1,
	},
	{
		fieldname: "accumulated_values",
		label: __("Accumulated Values"),
		fieldtype: "Check",
		default: 0,
	},
	{
		fieldname: "include_default_book_entries",
		label: __("Include Default FB Entries"),
		fieldtype: "Check",
		default: 1,
	},
	{
		fieldname: "show_zero_values",
		label: __("Show zero values"),
		fieldtype: "Check",
		depends_on: "eval:!doc.report_template",
	}
);

frappe.query_reports[PL_REPORT_NAME]["export_hidden_cols"] = true;
frappe.query_reports[PL_REPORT_NAME]["formatter"] = format_ifrs_template_row;
