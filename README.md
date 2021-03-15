# stripe-example

Stripeによる各種処理の実行サンプル

## サンプル説明

| Path | 機能 |
|-----|-----|
|/customer|カスタマー（顧客）の作成|
|/card|クレジットカード登録|
|/card_change|クレジットカード変更|
|/card_detach|クレジットカード削除（デタッチ）|
|/payment|都度決済|
|/refund|返金|
|/subscription|定期支払い（サブスクリプション）|
|/subscription_cancel|定期支払いの解約|
|/subscription_change_plan|定期支払いの商品（コース）変更|
|/subscription_promotion_code|定期支払いプロモーションコードの適用|
|/subscription_staged_price|従量課金プランの使用量の反映|
|/subscription_user_action|3Dセキュアの対応が必要な場合のユーザ操作画面|

## 初期設定

### .envの設定

`.env.example` をコピーして、 `.env` を作成。

`.env` にStripeの各種キーを設定する。

### 商品情報の設定

`products.yaml.example` をコピーして、 `products.yaml` を作成。

[商品ページ](https://dashboard.stripe.com/test/products)で追加した商品の、商品名とprice_idをyamlに設定する。この設定はsubscriptionのサンプル実行時に利用される。

## docker build

```bash
docker-compose build
```

## stripeへのログイン（初回のみ）

```bash
docker-compose run --rm stripe login
```

## APPサーバの起動

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
