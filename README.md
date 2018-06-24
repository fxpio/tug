Fxp Satis Serverless
====================

The serverless static Composer repository generator built with Amazon AWS Lambda, API Gateway, S3, Cloud Formation, CLI
and Github Webhooks.

Features include:

- Packages definition stored in the S3 buckets
- API keys stored in the S3 buckets
- Enable each Github repositories in the S3 bucket
- Route to prepare all Composer package definitions
- Create or remove the Composer package definition when the Github branch or tag is created or removed
- Refresh the commit SHA1 on each commit
- Create automatically the integrality of the Composer packages on a new commit if the Github repository
  is enabled on the Satis Serverless and if no package is present

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
