Update the CloudFormation Stack
===============================

### Only update the version of Tug

To update only the version of Tug, without update your CloudFormation Stack,
you can manually override the value of the `TugVersion` parameter by the version
tag name available in the [Github Releases page](https://github.com/fxpio/tug/releases).

To finish the update, follow the wizard of the AWS console.

### Update the CloudFormation Stack

You can also update your CloudFormation Stack of Tug with the latest version, just use the AWS console
or AWS CLI tool to update the stack with the S3 link below:

For the latest version:

```
https://tug-dev.s3.amazonaws.com/latest.template
```

For a specific version tag name available in the [Github Releases page](https://github.com/fxpio/tug/releases):

```
https://tug-dev.s3.amazonaws.com/<TAG_NAME>.template
```

> **Note:**
> When updating the CloudFormation Stack, the Tug version is not automatically
> updated given that it is a parameter of the Stack. So you must manually override
> the value of the `TugVersion` parameter by the version tag name available in the
> [Github Releases page](https://github.com/fxpio/tug/releases).

To finish the update, follow the wizard of the AWS console.
