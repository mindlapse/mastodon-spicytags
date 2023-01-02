
terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.20.1"
    }
  }

  backend "s3" {
    bucket = "spicytags-prod-terraform-remote-state-primary"
    key    = "terraform.tfstate"
    region = "ca-central-1"
  }
}
