module "sample_tags" {
  source           = "github.com/mindlapse/terraform_modules/aws/scheduled_lambda"
  env              = var.env
  product          = var.product
  image_name       = data.aws_ecr_repository.lambda_image.name
  image_version    = "latest"
  function_name    = "sample_tags"
  function_timeout = local.function_timeout
  memory_size      = 512
  lambda_policies = [
    aws_iam_policy.read_ssm_config.arn
  ]
  environment = {
    COMMAND = "sample_tags"
  }
  schedule_expression = "rate(3 minutes)"
  fifo = false
}

