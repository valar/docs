# Adding custom domains

Being reachable under some `myproject-myapp.valar.app` domain is nice and all,
but sometimes you want to do stuff without having the valar domain branding in the way. To help you with that, we provide support for custom domains.

To get started, choose a domain you have full control over. To verify ownership, you have to set specific DNS records for the domain.

## Adding the domain to the current project

To add a new domain to the current project, you need to use a subcommand of `valar domains`.

```bash
$ valar domains add mydomain.com
Please set the following records (choose one for A/AAAA and CNAME):

CNAME mydomain.com
A     94.130.169.221
AAAA  2a01:4f8:c0c:cc7b::1
TXT   edXV6/46gsofA19JNCRZRRCofdysr+FAqthoRsrwavu+OtYyyniUStL7mka8XtcqjqMstA5PJ+5CHky/1guASw==
```

Make sure to replace `mydomain.com` with your own one. The output of the command is very important. Go to your DNS provider and set the records for your domain accordingly. If you want to use an APEX domain (such as `mydomain.com`), add the A, AAAA and TXT records. If you do not use an APEX domain (like `me.mydomain.com`), add the CNAME and TXT records.

## Verifying ownership

After you've added the necessary records, Valar can now confirm that you own the domain. To trigger this step manually, use `valar domains verify`.

```bash
$ valar domains verify mydomain.com
Verified until 2022-02-19 22:08:05 +0000 UTC
```

If Valar shows you that the domain has been verified, you are good to go now.

## Link the domain to a service

Domains are scoped to the project they reside in. This means that you can not link a domain to a service that sits outside of the project the domain has been added to. Domain transfers between projects are not yet possible, so make sure that you add the domain to the correct project.

```bash
$ valar domains link mydomain.com mysite
```

Congratulations. You can now go visit `mydomain.com` and see your Valar site deployed on your custom domain!

