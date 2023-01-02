variable "aws_profile" {
  type        = string
  description = "The name an AWS profile you created for Terraform to use for deployment"
}

variable "region" {
  type        = string
  description = "The AWS region where mastodon will be deployed. e.g. ca-central-1"
}

variable "product" {
  type        = string
  description = "A product used for prefixing resource names."
}

variable "env" {
  type        = string
  description = "The environment name used for prefixing resource names, with the product variable."
}
