Manage the packages
===================


## Enable the Github repository

If the Github Webhook is defined directly on the repository, each repository is automatically enabled when Github try
a ping after added the webhook.

If the Github Webhook is defined on the organization, you must enable the Github repository with the command:

 ```
 $ node bin/enable-repo -r <username-or-organization-name>/<repository-name>
 ```

> **Note:**
>
> The enabled repositories are stored in the S3 bucket with the prefix
> `repositories/<username-or-organization-name>/<repository-name>`.


## Generate the Composer package definitions

For all existing repositories or to regenerate the integrality of the Composer package definitions,
you can call the `GET` url:

```
$ curl -u token:<api-key> https://<your-custom-domain-for-satis>/init/<username-or-organization>/<repository-name>
```
