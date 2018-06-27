Fxp Satis Serverless
====================

The Fxp Satis Serverless is a Composer repository for private PHP packages hosted on Github installable with
[Composer](http://getcomposer.org). Unlike the static package generator [Satis](https://github.com/composer/satis),
this project is hosted on your AWS account, using API Gateway with Lambda for the serverless code execution, and S3
for storage, while using Github webhooks to automatically build packages and providers.

The main idea of this project is to have an intermediary between the management of its own server [Packagist](https://github.com/composer/packagist),
or the use of a third party service, and the simple static packages generator [Satis](https://github.com/composer/satis).
That is, do not be worried about updating package versions and SHA1s for branches, while avoiding the cost of server
maintenance and execution, or the high cost of third-party services. With the serverless approach, the financial cost
is very low, and in the majority of cases, less than $1/month. You can see the pricing of
[Lambda@Edge](https://aws.amazon.com/lambda/pricing), [S3](https://aws.amazon.com/s3/pricing) and
[API Gateway](https://aws.amazon.com/api-gateway/pricing) for more details.

Also, this project is not intended to be another complete Packagist server, or a static packages generator like Satis,
but bring some interesting features of the Packagist server (automatic update of package definitions) for a very low
cost in case you use Github to host your private packages, and that the use of VCS repositories makes every Composer
update excessively long.

**Features include:**

- Deploy the service in minutes
- Fully manage the remote service with command lines
- Stored the Composer package definitions and API keys in the S3 buckets
- Create the Composer package definition when the Github branch or tag is created
- Remove the Composer package definition when the Github branch or tag is deleted
- Refresh the commit SHA1 on each commit
- Automatically configuration of the AWS credentials if the [Shared Credentials File](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
  is present on your machine
- Automatically configuration of the AWS regions if the Shared Config File is present on your machine
- All commands to:
  - configure interactively the project
  - create or remove the S3 bucket
  - build, package, and deploy automatically the project in AWS API Gateway, Lambda, S3, and CloudWatch with the Cloud Formation stack
  - remove the project on AWS (but keeping all the data in S3)
  - enable or disable manually each Github repositories
  - generate or delete an API key
  - generate all package definitions for a specific repository
  - serve the server in local for tests

Documentation
-------------

The bulk of the documentation is stored in the `doc/index.md`
file in this project:

[Read the Documentation](doc/index.md)

Installation
------------

All the installation instructions are located in [documentation](doc/index.md).

License
-------

This project is under the proprietary license. See the complete license in the bundle:

[LICENSE](LICENSE)

About
-----

Fxp Satis Serverless is a [François Pluchino](https://github.com/francoispluchino) initiative.
See also the list of [contributors](https://github.com/fxpio/fxp-satis-serverless/graphs/contributors).

Reporting an issue or a feature request
---------------------------------------

Issues and feature requests are tracked in the [Github issue tracker](https://github.com/fxpio/fxp-satis-serverless/issues).
