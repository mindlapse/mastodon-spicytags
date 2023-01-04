resource "aws_ssm_parameter" "config" {
  name = "/${local.product}/${local.env}/config"
  type = "SecureString"


  // For security reasons, secrets must be populated manually outside of Terraform.
  value = jsonencode({
    DATABASE_URL = ""
    REDIS_URL    = ""

    HOME_ACCOUNT_ID = ""

    HOME_ACCESS_TOKEN = ""
    HOME_API_URL      = ""

    SCAN_ACCESS_TOKEN = ""
    SCAN_API_URL      = ""
  })

  lifecycle {
    ignore_changes = [
      "value"
    ]
  }
}
