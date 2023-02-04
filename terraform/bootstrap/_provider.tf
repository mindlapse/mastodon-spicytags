provider "aws" {
  region  = var.region
  profile = var.aws_profile
  default_tags {
    tags = {
      product = var.product
      env     = var.env
    }
  }
}
