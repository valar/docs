# Domains

Serve a service on your own domain name instead of `*.valar.app`. Add a domain, set its DNS records, verify ownership, and link it to a service. See [Custom domains](advanced-topics/custom-domains.md) for the CLI commands.

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/domains` | [List domains](#list-domains) |
| `POST` | `/v2/projects/{project}/domains` | [Add a domain](#add-a-domain) |
| `POST` | `/v2/projects/{project}/domains/{domain}/verify` | [Verify a domain](#verify-a-domain) |
| `POST` | `/v2/projects/{project}/domains/{domain}/link` | [Link a domain to a service](#link-a-domain-to-a-service) |
| `DELETE` | `/v2/projects/{project}/domains/{domain}/link` | [Unlink a domain from a service](#unlink-a-domain-from-a-service) |
| `DELETE` | `/v2/projects/{project}/domains/{domain}` | [Remove a domain](#remove-a-domain) |

## List domains

`GET /v2/projects/{project}/domains`

Returns all domains registered to a project, with their verification status and linked service.

```bash
curl https://api.valar.dev/v2/projects/myproject/domains \
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

Registers a domain with the project and returns the DNS records to configure before verification.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/domains \
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

Set the returned records with your DNS provider:

| Domain type | Example | DNS records |
|---|---|---|
| Apex domain | `mydomain.com` | `A`, `AAAA`, `TXT` |
| Subdomain | `app.mydomain.com` | `CNAME`, `TXT` |

## Verify a domain

`POST /v2/projects/{project}/domains/{domain}/verify`

Verifies domain ownership after you set the DNS records from the add step.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/verify \
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

If verification fails, `verified` is `false` and `error` describes the problem.

## Link a domain to a service

`POST /v2/projects/{project}/domains/{domain}/link`

Points a verified domain at a service in the same project.

- `service`: Required. Name of the target service.
- `allowInsecureTraffic`: Optional. Set to `true` to accept both HTTP and HTTPS.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"service": "web"}'
```

```json
{
  "status": "ok"
}
```

> [!IMPORTANT]
> The domain must be verified before you can link it, and the service must belong to the same project.

## Unlink a domain from a service

`DELETE /v2/projects/{project}/domains/{domain}/link`

Removes the link between a domain and a service. The domain stays registered in the project and can be linked again later.

```bash
curl -X DELETE https://api.valar.dev/v2/projects/myproject/domains/mydomain.com/link \
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

Permanently removes a domain from the project. Unlink the domain from any service first.

```bash
curl -X DELETE https://api.valar.dev/v2/projects/myproject/domains/mydomain.com \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```
