Alternate installations
=======================

If you do not want to use the `yarn run setup` command to install, configure and deploy the server in production,
you can manually run each command used by the `setup` command.

**If you prefer run the commands separately to install, configure and , execute the commands:**

1. `$ yarn install`
2. `$ bin/config`
3. `$ bin/create-bucket`
4. `$ bin/build`
5. `$ bin/package`
6. `$ bin/deploy`

**To run the dev server in local, only execute the commands:**

1. `$ yarn install`
2. `$ bin/config`
3. `$ bin/serve` (by default, the Express server runs on `http://localhost:3000`, and the AWS DynamoDB local
   server runs on `http://localhost:3001`)

> **Note:**
>
> For Windows platform, run the command with `\` instead of `/`, or put the command name in double
> quote marks (`"`)
