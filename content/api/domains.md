# Domains

Custom domains let you serve a Valar service from your own domain name instead of the default `*.valar.app` address. The workflow is: add a domain, configure DNS records, verify ownership, then link the domain to a service. See [Custom domains](advanced-topics/custom-domains.md) for a step-by-step walkthrough using the CLI.

## List domains

`GET /v2/projects/{project}/domains`

Returns all domains registered to a project, including their verification status and linked service.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/domains \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "project": "myproject",
    "domain": "mydomain.com",
    "token": "edXV6/46gs...",
    "verified": true,
    "expiration": "2026-02-19T22:08:05Z",
    "error": "",
    "service": "web",
    "allowInsecureTraffic": false
  }
]
```

## Add a domain

`POST /v2/projects/{project}/domains`

Registers a new domain with the project. The response contains the DNS records you need to configure with your DNS provider before verification.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/domains \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"domain": "mydomain.com"}'
```

```json
{
  "A": "94.130.169.221",
  "AAAA": "2a01:4f8:c0c:cc7b::1",
  "TXT": "edXV6/46gsofA19JNCRZRRCofdysr+FAqthoRsrwavu+OtYyyniUStL7mka8XtcqjqMstA5PJ+5CHky/1guASw==",
  "CNAME": "mydomain.com"
}
```

For apex domains (e.g. `mydomain.com`), set the A, AAAA, and TXT records. For subdomains (e.g. `app.mydomain.com`), set the CNAME and TXT records.

## Verify a domain

`POST /v2/projects/{project}/domains/{domain}/verify`

Triggers a DNS verification check. Call this after you have configured the DNS records returned by the add endpoint.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/verify \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "project": "myproject",
  "domain": "mydomain.com",
  "token": "edXV6/46gs...",
  "verified": true,
  "expiration": "2026-02-19T22:08:05Z",
  "error": "",
  "service": null,
  "allowInsecureTraffic": false
}
```

If verification fails, the `verified` field will be `false` and `error` will describe the problem.

## Link a domain to a service

`POST /v2/projects/{project}/domains/{domain}/link`

Points a verified domain at a service within the same project. Set `allowInsecureTraffic` to `true` if you want the domain to accept plain HTTP in addition to HTTPS.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"service": "web"}'
```

```json
{
  "status": "ok"
}
```

> **Important**: The domain must be verified before it can be linked. The service must belong to the same project as the domain.

## Unlink a domain from a service

`DELETE /v2/projects/{project}/domains/{domain}/link`

Removes the link between a domain and a service. The domain stays registered in the project and can be re-linked later.

```bash
$ curl -X DELETE https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"service": "web"}'
```

```json
{
  "status": "ok"
}
```

## Remove a domain

`DELETE /v2/projects/{project}/domains/{domain}`

Permanently removes a domain from the project. If the domain is linked to a service, you must unlink it first.

```bash
$ curl -X DELETE https://api.valar.dev/v2/projects/myproject/domains/mydomain.com \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```
