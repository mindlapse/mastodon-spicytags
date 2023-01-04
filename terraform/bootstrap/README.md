# Bootstrap

Always run the bootstrap first! 
This will set up prerequisite infrastructure, namely:

- A cross-region versioned remote state for Terraform
- An ECR repository `spicytags_prod_core`
- A Parameter Store secret `/spicytags/prod/config`
  - The parameter is empty, but can be provided with a JSON object, typically provided as Config to Lambda functions
