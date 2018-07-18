Manage the packages
===================


## Enable the Github repository

If the Github Webhook is defined directly on the repository, each repository is automatically enabled when Github try
a ping after added the webhook.

When the repository is enabled, the server start to parse all Composer packages in each branch and each tag.

If the Github Webhook is defined on the organization, you must enable the Github repository with the command:

 ```
 $ bin/enable-repo -r <username-or-organization-name>/<repository-name>
 ```

> **Note:**
>
> The enabled repositories are stored in the DynamoDB with the prefix
> `repositories:<username-or-organization-name>/<repository-name>`.
