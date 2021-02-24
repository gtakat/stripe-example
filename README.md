# stripe-example

## 初期設定

```bash
docker-compose build
```

## stripeへのログイン（初回のみ）

```bash
docker-compose run --rm stripe login
```

## APIサーバの起動

```bash
docker-compose run app
```

## webpack

appが起動している状態で下記を実行

### build

```bash
docker-compose exec app npx webpack
```

### watch

```bash
docker-compose exec app npx webpack -w
```

## Webhookの開発

ローカルにWebhookのエンドポイントを立てても、通常だとstripe側からコールできない。

stripe-cliを利用すると、検知したイベントをローカルの任意のポートにフォワードできる。

* [stripe-node - webhook-signing](https://github.com/stripe/stripe-node/tree/master/examples/webhook-signing)

```bash
docker-compose run --rm stripe listen --forward-to app:8080/stripe_webhook
```

listenを開始すると、webhook用のsecret keyが表示されるので、これを`.env`に追加する。

```bash
Ready! Your webhook signing secret is '{{WEBHOOK_SIGNING_SECRET}}' (^C to quit)
```

このキーはwebhookに送信されたイベントのシグネチャの検証に利用される。

### 手動でイベントを発火する

stripe-cliで任意の連続したイベントを発行できる。

サンプル

```bash
docker-compose run --rm stripe trigger invoice.payment_succeeded
```
