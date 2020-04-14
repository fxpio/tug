Fxp Satis Serverless
====================

[![Image of CloudFormation Launch Stack](doc/images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=FxpSatisServerless&templateURL=https://fxp-satis-serverless.s3.amazonaws.com/latest.template)
[![Build Status](https://travis-ci.org/fxpio/satis-serverless.svg?branch=master)](https://travis-ci.org/fxpio/satis-serverless)

The Fxp Satis Serverless is a Composer repository for private PHP packages installable with
[Composer](http://getcomposer.org). Unlike the static package generator [Satis](https://github.com/composer/satis),
this project is hosted on your AWS account, using API Gateway with Lambda for the serverless code execution, DynamoDB
for database, and S3 for storage, while using services webhooks to automatically build packages and providers.

The main idea of this project is to have an intermediary between the management of its own server [Packagist](https://github.com/composer/packagist),
or the use of a third party service, and the simple static packages generator [Satis](https://github.com/composer/satis).
That is, do not be worried about updating package versions and SHA1s for branches, while avoiding the cost of server
maintenance and execution, or the high cost of third-party services. With the serverless approach, the financial cost
is very low, and in the majority of cases, less than $1/month. You can see the pricing of
[Lambda](https://aws.amazon.com/lambda/pricing), [DynamoDB](https://aws.amazon.com/dynamodb/pricing),
[S3](https://aws.amazon.com/s3/pricing) and [API Gateway](https://aws.amazon.com/api-gateway/pricing) for more details.

Also, this project is not intended to be another complete Packagist server, or a static packages generator like Satis,
but bring some interesting features of the Packagist server (automatic update of package definitions) for a very low
cost in case you use a third party service like Github to host your private packages, and that the use of
VCS repositories makes every Composer update excessively long.

**Features include:**

- Deploy the service in minutes
- Fully manage the remote service with the Progressive Web Application or the API Rest
- Server messages and the Progressive Web Application are localized in multiple languages
- Available drivers:
  - Github
- Tiggers:
  - Create the Composer package definition when the branch or tag is created
  - Remove the Composer package definition when the branch or tag is deleted
  - Refresh the commit SHA1 on each commit
- Storage:
  - Store the Composer package definitions, API keys and config in the DynamoDB
  - Put in cache the package versions and providers in S3
  - Track the download count of each package version by Composer
- All API Rest to:
  - configure the server
  - list the repositories
  - enable or disable manually each repositories
  - generate or delete the token used by the Webhooks
  - list the API keys
  - generate or delete an API key
  - list the package versions
  - generate all package definitions for a specific repository
  - show the details of each package version
  - refresh all packages or a specific package version
  - delete all packages or a specific package version
  - clean and rebuild the cache
- All commands to manage the remote service:
  - all management commands use the API Rest of the Server
  - authentication can be do with the AWS Security Token Service (session token) or the AWS IAM Credentials
  - automatically configuration of the AWS credentials if the [Shared Credentials File](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
    is present on your machine
  - automatically configuration of the AWS regions if the Shared Config File is present on your machine
  - enable or disable manually each Github repositories
  - generate or delete the token used by the Github Webhooks
  - generate or delete an API key
  - generate all package definitions for a specific repository
  - refresh all packages or a specific package version
  - delete all packages or a specific package version
- All commands to create and deploy manually:
  - configure interactively the project
  - create or remove the S3 bucket to deploy the code
  - build, package, and deploy automatically the project in AWS API Gateway, Lambda, SQS, DynamoDB, S3, IAM,
    and Cloud Watch with the Cloud Formation stack
  - remove the project on AWS (but keeping all the data in DynamoDB and S3)
  - serve the server in local for tests

Documentation
-------------

The bulk of the documentation is stored in the `doc/index.md`
file in this project:

[Read the Documentation](doc/index.md)

The latest version of the AWS CloudFormation Stack is to this url:

https://fxp-satis-serverless.s3.amazonaws.com/latest.template

Installation
------------

All the installation instructions are located in [documentation](doc/index.md).

License
-------

This project is under the MIT license. See the complete license in the bundle:

[LICENSE](LICENSE)

About
-----

Fxp Satis Serverless is a [François Pluchino](https://github.com/francoispluchino) initiative.
See also the list of [contributors](https://github.com/fxpio/fxp-satis-serverless/graphs/contributors).

Reporting an issue or a feature request
---------------------------------------

Issues and feature requests are tracked in the [Github issue tracker](https://github.com/fxpio/fxp-satis-serverless/issues).
