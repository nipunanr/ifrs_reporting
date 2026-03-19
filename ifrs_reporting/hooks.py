app_name = "ifrs_reporting"
app_title = "IFRS Reporting"
app_publisher = "Nipuna Rangika"
app_description = "IFRS financial reporting backport for ERPNext v15"
app_email = "nipuna@synaxlabs.com"
app_license = "mit"

fixtures = [
    {"dt": "Custom Field", "filters": [["name", "in", ["Account-account_category"]]]}
]

after_install = "ifrs_reporting.install.after_install"
after_migrate = ["ifrs_reporting.install.after_migrate"]
