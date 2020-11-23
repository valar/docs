# Getting started

At this point, we assume you have got access to Valar by registering for the invitation list.
If you have not done that already, you should head back to [our website](https://valar.dev) and do that first.

After registering, you will have received an access token for the Valar. Please keep this token secure as it
identifies you uniquely. Any person or program that has access to your token identifies as yourself.


## Installing the CLI

To get started with deploying your first service, you have to install the Valar command line tool. The simplest way to get started is to use `homebrew`.

```bash
$ brew tap valar/tap
$ brew install valar
```

You will be asked to enter your password (because we install the binary to `/usr/local/bin`) and your API token.
