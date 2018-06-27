Enable Satis Serverless in your project
=======================================

To enable the Satis Serverless for each PHP project with Composer, you must run this Composer command:

```
$ composer config repositories.satis-serverless composer https://<your-custom-domain>
```

> Of course, use your custom domain, and you also can change the name of the Composer repository.

## Use the API key with Composer

When you run Composer, it will prompt to enter your credentials, in this case, use the values for:

- **Username**: `token`
- **Password**: `<your-api-key>`
 