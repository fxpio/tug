Fxp Satis Serverless
====================

Welcome to the Fxp Satis Serverless - a serverless Composer repository for private repositories.

This document contains information on how to download, install, and start the API built with:

- [AWS API Gateway](https://aws.amazon.com/api-gateway)
- [AWS Lambda Nodejs](https://aws.amazon.com/lambda)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb)
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
  - [NPM](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) (to install dependencies)
  - [Java](https://www.java.com) (optional, to run database in local)
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

> **Notes:**
> - You will be prompted to enter your credentials for AWS and Github services, as well as some other settings.
> - If you prefer run the commands separately or run the dev server in local, see [this page](alternate-installations.md)

Great! Now you can go to the AWS console of CloudFormation to track the deployment status of the stack.

When the deployment process is complete, you can directly use the endpoint of
`https://<lambda-id>.execute-api.<region>.amazonaws.com/prod/`, or create your SSL certificate to use with
a custom domain. In this case, see [this page](custom-domain-ssl.md).


## 3) Create the oauth token for Github

To connect the server with your Github account, you must configure the Github Aouth token. To create a oauth token,
run the command:

```
$ bin/create-github-oauth --token <your-github-personal-token>
```

> **Note:**
>
> The oauth token for Github is stored in the DynamoDB with the id `config:global` and the
> `github-oauth."github.com"` attribute.


## 4) Create the token for Github Webhooks

To create a token to use in Github webhooks, run the command:

```
$ bin/create-github-token
```

> **Note:**
>
> The token for Github Webhooks is stored in the DynamoDB with the id `config:global` and the
> `github-webhook."github.com"` attribute.


## 5) Configure the Github Webhook

In each repository or in a organization, create the webhook with:

- Payload URL: `https://<your-custom-domain-for-satis>`
- Content type: `application/json`
- Secret: `<your-created-token-for-github-webhooks-in-step-3>`
- Which events would you like to trigger this webhook? `Just the push event.`


## 6) Create your first API key

The API keys are to be used with Composer to allow the connection with your Satis Serverless.

To create a new API key, run the command:

```
$ bin/create-api-key
```

> **Note:**
>
> The API keys are stored in the DynamoDB with the prefix `api-keys:`.


## 7) Enjoy!

Now that you have completed the basic installation and configuration of the Satis Serverless, you are ready to learn
more about using this project.

The following documents are available:

- [Configure your custom domain with SSL](custom-domain-ssl.md)
- [Using Satis Serverless in your project](include-in-project.md)
- [Manage the packages](manage-packages.md)
- [Alternative installations](alternate-installations.md)
- [Available commands](available-commands.md)
