module "boostrap" {
  source = "github.com/mindlapse/terraform_modules/aws/bootstrap/tf_remote_state"

  product = local.product
  env     = local.env

  primary_region = "ca-central-1"
  backup_region  = "ap-southeast-2"
}
