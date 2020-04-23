Custom domain with SSL
======================

With AWS API Gateway, you can attach your custom domain with a SSL certificate. In this section, we will consider
that you have already purchased your custom domain, and that you can edit your entries in the DNS zone of your domain.

## 1. Create the SSL certificate

Create the domain certificate in AWS Certificate Manager in your AWS region if you want to use a regional endpoint,
or in the `us-west-1` region if you want to use the Edge Optimized endpoint:

1. Add the root domain: `tug.example.tld` (example)
2. Validate and request the certificate

## 2. Create the domain in API Gateway

Create the domain in API Gateway with:

- Domain: `<your-custom-domain-for-tug>`
- Configuration of the endpoint: `Edge Optimized` or `Regional`
- ACM Certificate: `<your-certificate-for-tug-domain>`
- Base Path Mapping:
  - Path: ``
  - Destination: `<your-tug-gateway-api>`
  - Stage: `prod`

### 3. Configure your DNS zone

Create a DNS entry for your custom domain, map it with the domain target of the API Gateway  with a `CNAME` type.
