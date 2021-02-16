# stripe-example

## 初期設定

```bash
docker-compose build
```

## APIサーバの起動

```bash
docker-compose run app
```

## webpack watch

appが起動している状態で下記を実行

```bash
docker-compose exec app npx webpack -w
```

## Webhookの開発

ローカルにWebhookのエンドポイントを立てても、通常だとstripe側からコールできない。
stripe-cliを利用すると、検知したイベントをローカルの任意のポートにフォワードできる。

```bash
docker-compose run --rm stripe listen --forward-to app:8080/stripe_webhook
```
