Fxp Satis Serverless
====================

Welcome to the Fxp Satis Serverless - a serverless static Composer repository generator.

This document contains information on how to download, install, and start the API built with:

- [AWS API Gateway](https://aws.amazon.com/api-gateway)
- [AWS Lambda Javascript](https://aws.amazon.com/lambda)
- [AWS S3](https://aws.amazon.com/s3)
- [AWS Cloud Formation](https://aws.amazon.com/cloudformation)
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch) (by API Gateway)
- [AWS CloudFront](https://aws.amazon.com/cloudfront) (by API Gateway)
- [AWS Certificate Manager](https://aws.amazon.com/certificate-manager)
- [AWS IAM](https://aws.amazon.com/iam)
- [AWS CLI](https://aws.amazon.com/cli)
- [Github Webhooks](https://developer.github.com/webhooks)

**Note:**
[Nodejs](https://nodejs.org), [Git](https://git-scm.com) and [AWS CLI](https://aws.amazon.com/cli) must be installed
on your local machine.

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

**If you prefer run the commands separately, execute the commands:**

1. `$ yarn install`
2. `$ yarn run config`
3. `$ yarn run create-bucket`
4. `$ yarn run build`
5. `$ yarn run package`
6. `$ yarn run deploy`

**If you prefer run the server in local, execute the commands:**

1. `$ yarn install`
2. `$ yarn run config`
3. `$ yarn run start` (The Express server runs on `http://localhost:3000` by default)

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
- `start`: Run the server in local
- `create-bucket`: Create the S3 bucket
- `delete-bucket`: Delete the S3 bucket
- `build`: Build the project (configure the project before)
- `package`: Package the built project in S3 for AWS Cloud Formation (build the project before)
- `deploy`: Deploy the packaged project in AWS Cloud Formation
- `package-deploy`: Package and deploy the project
- `delete-stack`: Delete the AWS Cloud Formation stack
