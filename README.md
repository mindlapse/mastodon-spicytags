# Mastodon - Spicy Tags

Monitor a Mastodon instance for interesting tags.

To get started, create an API key within Mastodon for your account.


Next, create a `./env/.env.<suffix>` file using the `.env.sample` file as a template.

Set the following variables to match your setup:
```
API_URL=https://mastodon.social/api/v1/

ACCOUNT_ID=112233445566778899

SLEEP_MS=120000

ACCESS_TOKEN=abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG
```


Start polling with:

```
npm start --env=<suffix>
```