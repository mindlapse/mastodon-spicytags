module "cache_following" {
  source           = "github.com/mindlapse/terraform_modules/aws/scheduled_lambda"
  env              = var.env
  product          = var.product
  image_name       = data.aws_ecr_repository.lambda_image.name
  image_version    = "latest"
  function_name    = "cache_following"
  function_timeout = local.function_timeout
  lambda_policies = [
    aws_iam_policy.read_ssm_config.arn
  ]
  environment = {
    COMMAND = "cache_following"
  }
  schedule_expression = "rate(2 hours)"
  # sns_topic_arn = aws_sns_topic.topic.arn
  fifo = false
}

