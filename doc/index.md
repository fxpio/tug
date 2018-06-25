Fxp Satis Serverless
====================

Welcome to the Fxp Satis Serverless - a serverless static Composer repository generator.

This document contains information on how to download, install, and start the API built with:

- [AWS API Gateway](https://aws.amazon.com/api-gateway)
- [AWS Lambda@Edge Nodejs](https://aws.amazon.com/lambda)
- [AWS S3](https://aws.amazon.com/s3)
- [AWS Cloud Formation](https://aws.amazon.com/cloudformation)
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch) (by API Gateway)
- [AWS CloudFront](https://aws.amazon.com/cloudfront) (by API Gateway)
- [AWS Certificate Manager](https://aws.amazon.com/certificate-manager)
- [AWS IAM](https://aws.amazon.com/iam)
- [AWS CLI](https://aws.amazon.com/cli)
- [Github Webhooks](https://developer.github.com/webhooks)
- [Express](http://expressjs.com)

## Prerequisites

This project requires:

- an active account for [AWS](https://aws.amazon.com)
- an active account for [Github](https://github.com)
- the installation of the applications bellow on your local machine:
  - [Git](https://git-scm.com)
  - [Nodejs](https://nodejs.org)
  - [AWS CLI](https://aws.amazon.com/cli)

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
or follow best practices by creating an [IAM user](https://console.aws.amazon.com/iam) dédié.

Keep the credentials for the configuration of the AWS CLI.

### Configure tools

For AWS CLI, you must configure the tool with the command:

```
$ aws configure
```

Enter your AWS Access Key ID, AWS Secret Access Key and your default region name.


## 1) Clone the repository

```
$ git clone git@github.com:fxpio/fxp-satis-serverless.git
```


## 2) Setup the project

This command install dependencies, configure the project, create the S3 bucket, package and deploy in
AWS Cloud Formation, with API Gateway, Lambda and IAM.

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

In Amazon AWS S3 console, select the satis bucket and:

1. Create the `api-keys` folder
2. Create a folder containing the API key in the `api-keys` folder (you can use
   [this generator](https://codepen.io/corenominal/full/rxOmMJ) to create a key)


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

### Enable the Github repository

If the Github Webhook is defined directly on the repository, this action is automatically done when Github try a ping
after added the webhook.

If the Github Webhook is defined on the organization, you must enable the Github repository. In Amazon AWS S3 console,
select the satis bucket and defined the package name in the `repositories` folder like this:

```
s3://<satis-bucket>/repositories/<username-or-organization>/<repository-name>
```

### Generate the Composer package definitions

For all existing repositories or to regenerate the integrality of the Composer package definitions,
you can call the `GET` url:

```
$ curl -u token:<api-key> https://<your-custom-domain-for-satis>/init/<username-or-organization>/<repository-name>
```

### NPM/Yarn available commands

- `setup`: Install dependencies, configure the project, create the S3 bucket, package and deploy in
  AWS Cloud Formation, with API Gateway, Lambda and IAM
- `config`: Configure the project
- `deconfig`: Remove the custom configuration
- `serve`: Run the server in local
- `create-bucket`: Create the S3 bucket
- `delete-bucket`: Delete the S3 bucket
- `build`: Build the project (configure the project before)
- `package`: Package the built project in S3 for AWS Cloud Formation (build the project before)
- `deploy`: Deploy the packaged project in AWS Cloud Formation
- `package-deploy`: Package and deploy the project
- `delete-stack`: Delete the AWS Cloud Formation stack
