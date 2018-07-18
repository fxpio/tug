Available commands
==================

All commands below are executable via:
- `bin/<command-name>`
- `bin\<command-name>` or `"bin/<command-name>"` (Windows)
- `node bin/<command-name>`
- `yarn run bin/<command-name>`
- `npm run bin/<command-name>`

**Available commands:

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
- `create-github-oauth`: Create your Github Oauth token
- `show-github-oauth`: Show your Github Oauth token
- `delete-github-oauth`: Delete your Github Oauth token
- `show-gitlab-oauth`: Show your Gitlab Oauth token
- `create-gitlab-oauth`: Create your Gitlab Oauth token
- `delete-gitlab-oauth`: Delete your Gitlab Oauth token
- `create-github-token`: Create the token for the Github Webhooks
- `show-github-token`: Show the token for the Github Webhooks
- `delete-github-token`: Delete the token for the Github Webhooks
- `create-api-key`: Create a API key
- `delete-api-key`: Delete a API key
- `enable-repo`: Enable manually the Github repository
- `disable-repo`: Disable manually the Github repository
- `delete-packages`: Delete the package versions or a specific package version
- `refresh-packages`: Refresh the package versions or a specific package version
- `refresh-cache`: Refresh only the cache of all package versions or a specific package version

> **Note:**
>
> Each command has the `--help` option (`-h` alias) to display all informations about the command.
