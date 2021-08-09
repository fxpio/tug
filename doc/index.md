Tug
===

Welcome on the Tug - a private Composer registry for private PHP packages on AWS Serverless.

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
- [Gitlab Webhooks](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html)
- [Express](http://expressjs.com)

## Prerequisites

This project requires:

- an active account for [AWS](https://aws.amazon.com)
- an active account for [Github](https://github.com) or [Gitlab](https://gitlab.com)

If you want to compile and deploy your own version, you must have in addition:

- the installation of the applications bellow on your local machine (if you prefer to compile your own version):
  - [Nodejs](https://nodejs.org)
  - [NPM](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) (to install dependencies)
  - [Java](https://www.java.com) (optional, to run database in local)
  - [Git](https://git-scm.com) (optional)

### Services credentials

**AWS credentials:**

Use the credentials (AWS Access Key ID and the Secret Access Key) from [your AWS account](https://console.aws.amazon.com/iam/home?#/security_credential),
or follow best practices by creating an dedicated [IAM user](https://console.aws.amazon.com/iam).

Keep the credentials for the step 2.

> **Note:**
>
> If you use the [AWS CLI](https://aws.amazon.com/cli), the credentials and some other parameters are automatically
> retrieve by the `config` command.


**Github credentials:**

Generate a [personal access token](https://github.com/settings/tokens) with the required scopes:

- `repo`, included:
  - `repo:status`
  - `repo_deployment`
  - `public_repo`
  - `repo:invite`

Keep the token for the step 2.

**Gitlab credentials:**

Generate a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) with the required scopes:

- `read_api`
- `read_repository`

Keep the token for the step 2.


## 1) Installation

You have the option to install the server in one click or download, compile and deploy your own version of the server:

### 1.a. Installation with the AWS CloudFormation Launch Stack

This installation process is the easiest and fastest, just click on the "CloudFormation Launch Stack" button,
and follow the wizard:

[![Image of CloudFormation Launch Stack](images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=Tug&templateURL=https://tug-dev.s3.amazonaws.com/latest.template)

1. Then click Next where you can enter a stack name (Tug is a good default)
2. Click Next
3. Click Next again on the Options step (leaving the default options selected), to get to the final Review step
4. a. In the Capabilities section of the Review step: check the acknowledgment checkboxes and click
4. b. In the Transformations section of the Review step: click on the button "Create a change set"

> ** Note:**
>
> You can change the AWS region on the first page of wizard, by default,
> it is the region `eu-west-1` that is selected.

### 1.b. Installation from your local machine

#### 1.b.1. Clone the repository

```
$ git clone git@github.com:fxpio/tug.git
```

Or download the [archive](https://github.com/fxpio/tug/archive/1.0.zip) if you haven't Git.


#### 1.b.2. Setup the project

This command install dependencies, configure the project, create the S3 bucket, package and deploy in
AWS Cloud Formation, with API Gateway, Lambda, SQS and IAM.

```
$ yarn run setup
```

> **Notes:**
> - You will be prompted to enter your credentials for AWS and Github or Gitlab services, as well as some other settings.
> - If you prefer run the commands separately or run the dev server in local, see [this page](alternate-installations.md)

Great! Now you can go to the AWS console of CloudFormation to track the deployment status of the stack.

When the deployment process is complete, you can directly use the endpoint of
`https://<lambda-id>.execute-api.<region>.amazonaws.com/prod/`, or create your SSL certificate to use with
a custom domain. In this case, see [this page](custom-domain-ssl.md).


## 2) Configure the server

### 2.1. Create the oAuth token

#### 2.1.a. Create the oAuth token for Github

To connect the server with your Github account, you must configure the Github oAuth token.

To create a oAuth token, open the PWA and in the `Settings` section click
on the `Add` button of the `oAuth token` line item. Add your Github personal token just before.

Or run the command:

```
$ bin/create-github-oauth --token <your-github-personal-token>
```

> **Note:**
>
> The oAuth token for Github is stored in the DynamoDB with the id `config:global` and the
> `github-oauth."github.com"` attribute.

#### 2.1.b. Create the oAuth token for Gitlab

To connect the server with your Gitlab account, you must configure the Gitlab oAuth token.

To create a oAuth token, open the PWA and in the `Settings` section click
on the `Add` button of the `oAuth token` line item. Add your Gitlab personal token just before.

Or run the command:

```
$ bin/create-gitlab-oauth --token <your-gitlab-personal-token>
```

> **Note:**
>
> The oAuth token for Gitlab is stored in the DynamoDB with the id `config:global` and the
> `gitlab-oauth."gitlab.com"` attribute.


### 2.2. Create the token for Webhooks

### 2.2.a. Create the token for Github Webhooks

To create a token to use in Github webhooks, open the PWA and in the `Settings` section click
on the `Add` button of the `Webhook token` line item.

Or run the command:

```
$ bin/create-github-token
```

> **Note:**
>
> The token for Github Webhooks is stored in the DynamoDB with the id `config:global` and the
> `github-webhook."github.com"` attribute.

### 2.2.b. Create the token for Gitlab Webhooks

To create a token to use in Gitlab webhooks, open the PWA and in the `Settings` section click
on the `Add` button of the `Webhook token` line item.

Or run the command:

```
$ bin/create-gitlab-token
```

> **Note:**
>
> The token for Gitlab Webhooks is stored in the DynamoDB with the id `config:global` and the
> `gitlab-webhook."gitlab.com"` attribute.


### 2.3. Configure the Webhook in the SCM service

### 2.3.a. Configure the Github Webhook

In each repository or in a organization, create the webhook with:

- Payload URL: `https://<your-custom-domain-for-tug>`
- Content type: `application/json`
- Secret: `<your-created-token-for-github-webhooks-in-step-2.2>`
- Which events would you like to trigger this webhook? `Just the push event.`

### 2.3.b. Configure the Gitlab Webhook

In each repository or in a organization, create the webhook with:

- URL: `https://<your-custom-domain-for-tug>`
- Secret Token: `<your-created-token-for-gitlab-webhooks-in-step-2.2>`
- Trigger: _Select the events_
  - `Push events`
  - `Tag push events`


### 2.4. Create your first API key

The API keys are to be used with Composer to allow the connection with your Tug.

To create a new API key, open the PWA and click on the `Add API key` section. Add optionally
your fingerprint, and let Tug generate the key.

Or run the command:

```
$ bin/create-api-key
```

> **Note:**
>
> The API keys are stored in the DynamoDB with the prefix `api-keys:`.


## 3) Enjoy!

Now that you have completed the basic installation and configuration of Tug, you are ready to learn
more about using this project.

The following documents are available:

- [Configure your custom domain with SSL](custom-domain-ssl.md)
- [Using Tug in your project](include-in-project.md)
- [Manage the packages](manage-packages.md)
- [Alternative installations](alternate-installations.md)
- [Update the CloudFormation Stack](update-cloud-formation-stack.md)
- [Available commands](available-commands.md)
