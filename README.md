# KAILTH Bot

Facebook Messenger bot with an Express dashboard.

## Run locally

```sh
npm ci
npm start
```

The dashboard listens on `0.0.0.0:$PORT`; locally it defaults to port `3000`.
Open `/` for the dashboard and `/healthz` for the service health check.

## Deploy on Railway

Deploy this repository as one Railway service using the repository root as the
service root. The included `railway.toml` and `Dockerfile` build and start only
this app.

Railway supplies `PORT` at runtime. Do not hard-code the generated domain to
port `3000` unless the Railway service's `PORT` variable is also set to `3000`.
Prefer leaving the domain target port unset so Railway routes to `PORT`, or make
the domain target port exactly match the service's `PORT` value.

Set `APPSTATE` in Railway's service variables to the account app-state JSON.
Do not commit `appstate.json` or put its contents in this repository.
