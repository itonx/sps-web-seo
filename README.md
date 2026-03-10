# SPS

Official page: <a href="https://solucionesprosystem.com/" target="_blank">Soluciones Pro-System</a>

> This project was created with <a href="https://astro.build/" target="_blank">Astro</a>.

## 💻 Deployment

Hosted on <a href="https://azure.microsoft.com/en-us/products/app-service/static" target="_blank">Azure Static Web App</a>.

The deployment is triggered by a GitHub action which is executed when a new tag is created.

Create a new tag:

```bash
git tag vX.X.X
git push origin --tags
```

# Docker file

## Build

```bash
docker build -t sps-web-seo:latest
```

## Run

```bash
docker run --rm -d --name sps-web-seo-test -p 5001:5001 sps-web-seo:latest
```

## Test

Go to https://localhost:5001

# Docker compose

## Build

```bash
docker compose up --build -d
```

## Stop

```bash
docker compose down
```

## Test

Go to https://localhost:5001

## Remove dangling images

```bash
docker image prune
```
