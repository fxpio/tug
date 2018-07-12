Available commands
==================

All commands below are executable via `node bin/<command-name>`, `yarn run bin/node bin/<command-name>`
or `npm run bin/node bin/<command-name>`:

- `setup`: Install dependencies, configure the project, create the S3 bucket, package and deploy in
  AWS Cloud Formation, with API Gateway, Lambda and IAM
- `config`: Configure the project
- `deconfig`: Remove the custom configuration
- `serve`: Run the server in local
- `create-bucket`: Create the S3 bucket
- `delete-bucket`: Delete the S3 bucket
- `build`: Build the project (configure the project before, if it's not the case)
- `package`: Package the built project in S3 for AWS Cloud Formation (builds the project before, if it's not the case)
- `deploy`: Deploy the packaged project in AWS Cloud Formation
- `package-deploy`: Package and deploy the project
- `delete-stack`: Delete the AWS Cloud Formation stack
- `create-api-key`: Create a API key
- `delete-api-key`: Delete a API key
- `show-github-token`: Show the token for the Github Webhooks
- `create-github-token`: Create the token for the Github Webhooks
- `delete-github-token`: Delete the token for the Github Webhooks
- `enable-repo`: Enable manually the Github repository
- `disable-repo`: Disable manually the Github repository

> **Note:**
>
> Each command has the `--help` option (`-h` alias) to display all informations about the command.
