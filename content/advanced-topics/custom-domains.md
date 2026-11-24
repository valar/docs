# Custom domains

Serve a Valar service on your own domain instead of `*.valar.app`. You need DNS control over the domain to verify ownership and route traffic.

## Adding the domain to the current project

Add your domain to the current project with `valar domains add`, replacing `mydomain.com` with your own domain:

```bash
valar domains add mydomain.com
```

```text
Please set the following records (choose one for A/AAAA and CNAME):

CNAME mydomain.com
A     94.130.169.221
AAAA  2a01:4f8:c0c:cc7b::1
TXT   edXV6/46gsofA19JNCRZRRCofdysr+FAqthoRsrwavu+OtYyyniUStL7mka8XtcqjqMstA5PJ+5CHky/1guASw==
```

Set the returned records with your DNS provider:

| Domain type | Example | DNS records to set |
|---|---|---|
| Apex domain | `mydomain.com` | `A`, `AAAA`, `TXT` |
| Subdomain | `app.mydomain.com` | `CNAME`, `TXT` |

## Verifying ownership

Once the DNS records are set, verify ownership with `valar domains verify`:

```bash
valar domains verify mydomain.com
```

```text
Verified until 2022-02-19 22:08:05 +0000 UTC
```

## Link the domain to a service

Link the verified domain to a service in the current project:

```bash
valar domains link mydomain.com helloworld
```

Your service is now reachable at `mydomain.com`.

> [!IMPORTANT]
> Domains belong to the project you add them to. You cannot link a domain to a service in another project or transfer domains between projects yet.

To unlink or remove a domain over HTTP, or to allow plain HTTP traffic (`allowInsecureTraffic`), see [Domains](api/domains.md).
