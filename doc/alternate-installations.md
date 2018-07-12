Alternate installations
=======================

If you do not want to use the `yarn run setup` command to install, configure and deploy the server in production,
you can manually run each command used by the `setup` command.

**If you prefer run the commands separately to install, configure and , execute the commands:**

1. `$ yarn install`
2. `$ node bin/config`
3. `$ node bin/create-bucket`
4. `$ node bin/build`
5. `$ node bin/package`
6. `$ node bin/deploy`

**To run the dev server in local, only execute the commands:**

1. `$ yarn install`
2. `$ node bin/config`
3. `$ node bin/serve` (by default, the Express server runs on `http://localhost:3000`, and the AWS DynamoDB local
   server runs on `http://localhost:3001`)
