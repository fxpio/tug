Tug
===

[![Image of CloudFormation Launch Stack](doc/images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=Tug&templateURL=https://tug-dev.s3.amazonaws.com/latest.template)
[![Build Status](https://travis-ci.org/fxpio/tug.svg?branch=master)](https://travis-ci.org/fxpio/tug)

Tug is a Composer private registry for private PHP packages installable with
[Composer](http://getcomposer.org). The main idea of this project is to have an intermediary between
the management of its own server Packagist, or the use of a third party service, and the simple static
packages generator like Satis. That is, do not be worried about updating package versions and SHA1s of
the branches, while avoiding the cost of server maintenance and execution, or the high cost of third-party
services.

For that, this project is hosted on your AWS account, using API Gateway with Lambda for the serverless code
execution, DynamoDB for database, and S3 to storage the cached files, while using webhooks of services to automatically
build packages and providers. With the serverless approach, the financial cost is extremely low, see free, and in most
cases, only a few cents by month with the [AWS Free Tier](https://aws.amazon.com/free). You can see the pricing of
[S3](https://aws.amazon.com/s3/pricing), [Lambda](https://aws.amazon.com/lambda/pricing),
[DynamoDB](https://aws.amazon.com/dynamodb/pricing) and [API Gateway](https://aws.amazon.com/api-gateway/pricing)
for more details.

Also, this project is not intended to be another complete Packagist server, or a static packages generator like Satis,
but bring some interesting features of the Packagist server (automatic update of package definitions) for a very low
cost in case you use a third party service like Github to host your private packages, and that the use of
VCS repositories makes every Composer update excessively long.

**Features include:**

- Deploy the service in a few minutes
- Fully manage the remote service with the Progressive Web Application or the API Rest
- Server messages and the Progressive Web Application are localized in multiple languages
- Authenticate with the AWS IAM Credentials (access key id and secret access key)
- Available drivers:
  - Github
- Tiggers:
  - create the Composer package definition when the branch or tag is created
  - remove the Composer package definition when the branch or tag is deleted
  - refresh the commit SHA1 on each commit
- Storage:
  - store the Composer package definitions, API keys and config in the DynamoDB
  - put in cache the package versions and providers in S3
  - track the download count of each package version by Composer
- API Rest to:
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
- CLI commands to manage the remote service:
  - enable or disable manually each Github repositories
  - generate or delete the token used by the Github Webhooks
  - generate or delete an API key
  - generate all package definitions for a specific repository
  - refresh all packages or a specific package version
  - delete all packages or a specific package version
- CLI commands to create and deploy manually:
  - configure interactively the project
  - create or remove the S3 bucket to deploy the code
  - build, package, and deploy automatically the project in AWS API Gateway, Lambda, SQS, DynamoDB, S3, IAM,
    and Cloud Watch with the Cloud Formation stack
  - remove the project on AWS (but keeping all the data in DynamoDB and S3)
  - serve the server in local for tests
- All CLI commands use the API Rest of the Server
- Auto configuration of the CLI tool:
  - authentication can be do with the AWS Security Token Service (session token) or the AWS IAM Credentials
  - automatically configuration of the AWS credentials if the [Shared Credentials File](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
    is present on your machine
  - automatically configuration of the AWS regions if the Shared Config File is present on your machine

Documentation
-------------

The bulk of the documentation is stored in the `doc/index.md`
file in this project:

[Read the Documentation](doc/index.md)

The latest version of the AWS CloudFormation Stack is to this url:

https://tug-dev.s3.amazonaws.com/latest.template

Installation
------------

All the installation instructions are located in [documentation](doc/index.md).

License
-------

This project is under the MIT license. See the complete license in the bundle:

[LICENSE](LICENSE)

About
-----

Tug is a [François Pluchino](https://github.com/francoispluchino) initiative.
See also the list of [contributors](https://github.com/fxpio/tug/graphs/contributors).

Reporting an issue or a feature request
---------------------------------------

Issues and feature requests are tracked in the [Github issue tracker](https://github.com/fxpio/tug/issues).
