Fxp Satis Serverless
====================

Welcome to the Fxp Satis Serverless - a serverless Composer repository for private repositories.

This document contains information on how to download, install, and start the API built with:

- [AWS API Gateway](https://aws.amazon.com/api-gateway)
- [AWS Lambda@Edge Nodejs](https://aws.amazon.com/lambda)
- [AWS S3](https://aws.amazon.com/s3)
- [AWS SQS](https://aws.amazon.com/sqs)
- [AWS Cloud Formation](https://aws.amazon.com/cloudformation)
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch) (by Lambda)
- [AWS CloudFront](https://aws.amazon.com/cloudfront) (by API Gateway)
- [AWS Certificate Manager](https://aws.amazon.com/certificate-manager)
- [AWS IAM](https://aws.amazon.com/iam)
- [Github Webhooks](https://developer.github.com/webhooks)
- [Express](http://expressjs.com)

## Prerequisites

This project requires:

- an active account for [AWS](https://aws.amazon.com)
- an active account for [Github](https://github.com)
- the installation of the applications bellow on your local machine:
  - [Nodejs](https://nodejs.org)
  - [Git](https://git-scm.com) (optional)

### Services credentials

**Github credentials:**

Generate a [personal access token](https://github.com/settings/tokens) with the required scopes:

- `repo`, included:
  - `repo:status`
  - `repo_deployment`
  - `public_repo`
  - `repo:invite`

Keep the token for the step 2.

**AWS credentials:**

Use the credentials (AWS Access Key ID and the Secret Access Key) from [your AWS account](https://console.aws.amazon.com/iam/home?#/security_credential),
or follow best practices by creating an dedicated [IAM user](https://console.aws.amazon.com/iam).

Keep the credentials for the step 2.

> **Note:**
>
> If you use the [AWS CLI](https://aws.amazon.com/cli), the credentials and some other parameters are automatically
> retrieve by the `config` command.


## 1) Clone the repository

```
$ git clone git@github.com:fxpio/fxp-satis-serverless.git
```

Or download the [archive](https://github.com/fxpio/fxp-satis-serverless/archive/master.zip) if you haven't Git.


## 2) Setup the project

This command install dependencies, configure the project, create the S3 bucket, package and deploy in
AWS Cloud Formation, with API Gateway, Lambda, SQS and IAM.

```
$ yarn run setup
```

> You will be prompted to enter your credentials for AWS and Github services, as well as some other settings.

**If you prefer run the commands separately, execute the commands:**

1. `$ yarn install`
2. `$ node bin/config`
3. `$ node bin/create-bucket`
4. `$ node bin/package-deploy`

**To run the dev server in local, only execute the commands:**

1. `$ yarn install`
2. `$ node bin/config`
3. `$ node bin/serve` (The Express server runs on `http://localhost:3000` by default)

### 2.1. Create the SSL certificate (optional)
         
Create the domain certificate in AWS Certificate Manager in `us-west-1` region (only compatible this region):

1. Add the root domain: `satis.example.tld` (example)
2. Validate and request the certificate

### 2.2. Create the domain in API Gateway (optional)

Create the domain in API Gateway with:

- Domain: `<your-custom-domain-for-satis>`
- Configuration of the endpoint: `Edge Optimized`
- ACM Certificate: `<your-certificate-for-satis-domain>`
- Base Path Mapping:
  - Path: ``
  - Destination: `<your-satis-gateway-api>`
  - Stage: `prod`


## 3) Create the first API key

Run the command:

```
$ node bin/create-api-key
```

> **Note:**
>
> The API key is stored in the S3 bucket with the prefix `api-keys/`.


## 4) Configure the Github Webhook

In each repository or in a organization, create the webhook with:

- Payload URL: `https://<your-custom-domain-for-satis>`
- Content type: `application/json`
- Secret: `<your-api-key-defined-in-the-api-keys-s3-bucket>`
- Which events would you like to trigger this webhook? `Let me select individual events.`:
  - `Branch or tag creation`
  - `Branch or tag deletion`
  - `Pushes`


## 5) Enjoy!

Now that you have completed the basic installation and configuration of the Satis Serverless, you are ready to learn
more about using this project.

The following documents are available:

- [Using Satis Serverless in your project](include-in-project.md)
- [Manage the packages](manage-packages.md)

### Available commands

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
- `show-github-token`: Show the Github token
- `create-github-token`: Create the Github token
- `enable-repo`: Enable manually the Github repository
- `disable-repo`: Disable manually the Github repository

> **Note:**
>
> Each command has the `--help` option (`-h` alias) to display all informations about the command.
